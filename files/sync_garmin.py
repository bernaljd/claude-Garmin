#!/usr/bin/env python3
"""Pull your own Garmin data (activities + daily wellness) into plain files.

A thin, read-only wrapper around python-garminconnect by cyberjunky:
https://github.com/cyberjunky/python-garminconnect

    python sync_garmin.py --login                      # one time, hidden prompts
    python sync_garmin.py --days 3 --dry-run           # preview, writes nothing
    python sync_garmin.py --days 3 --sink files        # write ./garmin/
    python sync_garmin.py --days 3 --sink supabase     # POST to your endpoint
    python sync_garmin.py --export-ci-token            # for GitHub Actions only

Security model:
  * The password is read once from a hidden prompt (getpass). It is never
    stored, never read from an env var or CLI argument, and never printed.
  * Only the login token is saved, by the library, in an owner-only file. The
    token is never printed.
  * --login refuses to run where the password prompt cannot be hidden.
  * Only GET requests are made to Garmin. Nothing is written back.
"""

from __future__ import annotations

import argparse
import base64
import getpass
import json
import os
import re
import stat
import sys
import warnings
from datetime import date, timedelta
from pathlib import Path
from typing import Any, Callable

TOKEN_DIR = Path(os.path.expanduser("~/.garminconnect"))
TOKEN_FILE = TOKEN_DIR / "garmin_tokens.json"
CI_TOKEN_FILE = "garmin-ci-token.txt"


# --------------------------------------------------------------------------
# Login / tokens
# --------------------------------------------------------------------------

def _import_garmin():
    try:
        from garminconnect import Garmin  # noqa: WPS433
    except ImportError:
        sys.exit("garminconnect is not installed. Run: pip install -r requirements.txt")
    return Garmin


def do_login() -> None:
    """Interactive one-time login. Password goes through a hidden prompt only."""
    if not (sys.stdin.isatty() and sys.stdout.isatty()):
        sys.exit(
            "--login needs a real terminal so your password can be typed hidden.\n"
            "Open Terminal (Mac) or PowerShell/cmd (Windows) and run it there."
        )
    Garmin = _import_garmin()

    email = input("Garmin email: ").strip()
    with warnings.catch_warnings():
        # getpass warns (and echoes!) if it cannot disable echo. Treat as fatal.
        warnings.simplefilter("error", getpass.GetPassWarning)
        try:
            password = getpass.getpass("Garmin password (hidden): ")
        except getpass.GetPassWarning:
            sys.exit("Cannot hide password input in this terminal. Aborting.")

    def prompt_mfa() -> str:
        return input("Garmin 2FA code: ").strip()

    TOKEN_DIR.mkdir(mode=0o700, parents=True, exist_ok=True)
    try:
        TOKEN_DIR.chmod(0o700)
    except OSError:
        pass

    client = Garmin(email=email, password=password, prompt_mfa=prompt_mfa)
    del password
    try:
        client.login(str(TOKEN_FILE))
    except Exception as exc:  # message only; never echo credentials
        sys.exit(f"Login failed: {type(exc).__name__}: {exc}")

    if not TOKEN_FILE.exists():
        client.client.dump(str(TOKEN_FILE))
    print(f"Logged in. Token saved privately to {TOKEN_FILE} (not shown).")


def export_ci_token() -> None:
    """Write the token bundle (base64) to a 0600 file for the GitHub secret."""
    if not TOKEN_FILE.exists():
        sys.exit("No saved login. Run --login first.")
    encoded = base64.b64encode(TOKEN_FILE.read_bytes()).decode("ascii")
    flags = os.O_WRONLY | os.O_CREAT | os.O_TRUNC
    fd = os.open(CI_TOKEN_FILE, flags, stat.S_IRUSR | stat.S_IWUSR)
    with os.fdopen(fd, "w") as fh:
        fh.write(encoded)
    try:
        os.chmod(CI_TOKEN_FILE, stat.S_IRUSR | stat.S_IWUSR)
    except OSError:
        pass
    print(
        f"Wrote {CI_TOKEN_FILE}. Paste its contents into the GARMIN_TOKEN_B64 "
        "secret, then delete the file. Never commit or share it."
    )


def connect():
    """Return a logged-in client using a saved token only (no password)."""
    Garmin = _import_garmin()
    b64 = os.environ.get("GARMIN_TOKEN_B64", "").strip()
    if b64:
        try:
            tokenstore = base64.b64decode(b64).decode("utf-8")
        except Exception:
            sys.exit("GARMIN_TOKEN_B64 is not valid base64. Re-export it.")
    elif TOKEN_FILE.exists():
        tokenstore = str(TOKEN_FILE)
    else:
        sys.exit("Not logged in. Run: python sync_garmin.py --login")

    client = Garmin()
    try:
        client.login(tokenstore)
    except Exception as exc:
        sys.exit(
            f"Saved login was rejected ({type(exc).__name__}). "
            "Re-run --login (and update GARMIN_TOKEN_B64 if you use Actions)."
        )
    return client


# --------------------------------------------------------------------------
# Fetching + normalising
# --------------------------------------------------------------------------

def _safe(fn: Callable[[], Any], label: str, errors: list[str]) -> Any:
    try:
        return fn()
    except Exception as exc:
        errors.append(f"{label}: {type(exc).__name__}")
        return None


def _num(value: Any, digits: int | None = None) -> float | int | None:
    if value is None or isinstance(value, bool):
        return None
    try:
        out = float(value)
    except (TypeError, ValueError):
        return None
    if digits is not None:
        out = round(out, digits)
    return int(out) if out == int(out) and digits in (None, 0) else out


def _get(data: Any, *path: str) -> Any:
    for key in path:
        if not isinstance(data, dict):
            return None
        data = data.get(key)
    return data


def fetch_wellness(client, day: str, errors: list[str]) -> dict[str, Any]:
    summary = _safe(lambda: client.get_user_summary(day), f"{day} summary", errors) or {}
    sleep = _safe(lambda: client.get_sleep_data(day), f"{day} sleep", errors) or {}
    hrv = _safe(lambda: client.get_hrv_data(day), f"{day} hrv", errors) or {}
    readiness = _safe(
        lambda: client.get_training_readiness(day), f"{day} readiness", errors
    )
    stress = _safe(lambda: client.get_stress_data(day), f"{day} stress", errors) or {}

    if isinstance(readiness, list):
        readiness = readiness[0] if readiness else {}
    readiness = readiness or {}

    sleep_secs = _get(sleep, "dailySleepDTO", "sleepTimeSeconds")
    return {
        "date": day,
        "resting_hr": _num(summary.get("restingHeartRate")),
        "hrv_overnight_ms": _num(_get(hrv, "hrvSummary", "lastNightAvg")),
        "hrv_status": _get(hrv, "hrvSummary", "status"),
        "sleep_hours": _num(sleep_secs / 3600, 1) if _num(sleep_secs) else None,
        "sleep_score": _num(_get(sleep, "dailySleepDTO", "sleepScores", "overall", "value")),
        "body_battery_low": _num(summary.get("bodyBatteryLowestValue")),
        "body_battery_high": _num(summary.get("bodyBatteryHighestValue")),
        "stress_avg": _num(summary.get("averageStressLevel") or stress.get("avgStressLevel")),
        "steps": _num(summary.get("totalSteps")),
        "training_readiness": _num(readiness.get("score")),
        "training_readiness_level": readiness.get("level"),
    }


def fetch_activities(client, start: str, end: str, errors: list[str]) -> list[dict[str, Any]]:
    raw = _safe(lambda: client.get_activities_by_date(start, end), "activities", errors) or []
    out = []
    for a in raw:
        out.append({
            "id": a.get("activityId"),
            "name": a.get("activityName"),
            "type": _get(a, "activityType", "typeKey"),
            "start_local": a.get("startTimeLocal"),
            "distance_km": _num((a.get("distance") or 0) / 1000, 2),
            "duration_min": _num((a.get("duration") or 0) / 60, 1),
            "avg_hr": _num(a.get("averageHR")),
            "max_hr": _num(a.get("maxHR")),
            "calories": _num(a.get("calories")),
            "elevation_gain_m": _num(a.get("elevationGain")),
            "aerobic_training_effect": _num(a.get("aerobicTrainingEffect"), 1),
        })
    return out


# --------------------------------------------------------------------------
# Rendering
# --------------------------------------------------------------------------

def _fmt(value: Any, unit: str = "") -> str:
    return "n/a" if value is None else f"{value}{unit}"


def daily_markdown(w: dict[str, Any]) -> str:
    sleep = _fmt(w["sleep_hours"], " h")
    if w["sleep_score"] is not None:
        sleep += f" (score {w['sleep_score']})"
    battery = (
        f"{_fmt(w['body_battery_low'])} -> {_fmt(w['body_battery_high'])}"
    )
    return "\n".join([
        f"# Garmin wellness {w['date']}",
        f"- Resting HR: {_fmt(w['resting_hr'], ' bpm')}",
        f"- HRV (overnight): {_fmt(w['hrv_overnight_ms'], ' ms')}",
        f"- Sleep: {sleep}",
        f"- Body battery: {battery}",
        f"- Stress (avg): {_fmt(w['stress_avg'])}",
        f"- Steps: {_fmt(w['steps'])}",
        f"- Training readiness: {_fmt(w['training_readiness'])}",
        "",
    ])


def activity_markdown(a: dict[str, Any]) -> str:
    return "\n".join([
        f"# {a['name'] or 'Activity'} ({a['type'] or 'unknown'})",
        f"- Started: {_fmt(a['start_local'])}",
        f"- Distance: {_fmt(a['distance_km'], ' km')}",
        f"- Duration: {_fmt(a['duration_min'], ' min')}",
        f"- Avg / max HR: {_fmt(a['avg_hr'])} / {_fmt(a['max_hr'])} bpm",
        f"- Calories: {_fmt(a['calories'])}",
        f"- Elevation gain: {_fmt(a['elevation_gain_m'], ' m')}",
        f"- Aerobic training effect: {_fmt(a['aerobic_training_effect'])}",
        "",
    ])


def _slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", (text or "").lower()).strip("-")[:40] or "activity"


# --------------------------------------------------------------------------
# Sinks
# --------------------------------------------------------------------------

def write_files(out: Path, activities: list[dict], wellness: list[dict]) -> None:
    (out / "daily").mkdir(parents=True, exist_ok=True)
    (out / "activities").mkdir(parents=True, exist_ok=True)

    store_path = out / "data.json"
    store: dict[str, Any] = {"activities": {}, "wellness": {}}
    if store_path.exists():
        try:
            store = json.loads(store_path.read_text(encoding="utf-8"))
        except (ValueError, OSError):
            pass  # corrupt store: rebuild from this run

    for w in wellness:
        store["wellness"][w["date"]] = w
        (out / "daily" / f"{w['date']}.md").write_text(daily_markdown(w), encoding="utf-8")
    for a in activities:
        store["activities"][str(a["id"])] = a
        day = (a["start_local"] or "unknown")[:10]
        name = f"{day}-{_slug(a['type'] or a['name'])}-{a['id']}.md"
        (out / "activities" / name).write_text(activity_markdown(a), encoding="utf-8")

    store_path.write_text(json.dumps(store, indent=2, sort_keys=True), encoding="utf-8")


def post_ingest(activities: list[dict], wellness: list[dict]) -> None:
    import requests

    url = os.environ.get("GARMIN_INGEST_URL", "").strip()
    secret = os.environ.get("GARMIN_INGEST_SECRET", "").strip()
    if not url or not secret:
        sys.exit("--sink supabase needs GARMIN_INGEST_URL and GARMIN_INGEST_SECRET.")
    if not url.startswith("https://"):
        sys.exit("GARMIN_INGEST_URL must be https:// (the secret is sent with it).")
    resp = requests.post(
        url,
        json={"activities": activities, "wellness": wellness},
        headers={"Authorization": f"Bearer {secret}"},
        timeout=30,
    )
    resp.raise_for_status()
    print(f"Posted {len(activities)} activities, {len(wellness)} wellness days.")


# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------

def main() -> None:
    p = argparse.ArgumentParser(description="Read-only Garmin sync.")
    p.add_argument("--login", action="store_true", help="one-time interactive login")
    p.add_argument("--export-ci-token", action="store_true",
                   help=f"write {CI_TOKEN_FILE} for the GARMIN_TOKEN_B64 secret")
    p.add_argument("--days", type=int, default=3, help="how many days back (default 3)")
    p.add_argument("--sink", choices=["files", "supabase"], default="files")
    p.add_argument("--out", default="./garmin", help="output folder for --sink files")
    p.add_argument("--dry-run", action="store_true", help="print results, write nothing")
    args = p.parse_args()

    if args.login:
        return do_login()
    if args.export_ci_token:
        return export_ci_token()
    if args.days < 1:
        sys.exit("--days must be at least 1")

    client = connect()
    today = date.today()
    days = [(today - timedelta(days=i)).isoformat() for i in range(args.days - 1, -1, -1)]

    errors: list[str] = []
    activities = fetch_activities(client, days[0], days[-1], errors)
    wellness = [fetch_wellness(client, d, errors) for d in days]

    if args.dry_run:
        print(f"== Activities ({len(activities)}) ==")
        for a in activities:
            print(activity_markdown(a))
        print(f"== Wellness ({len(wellness)} days) ==")
        for w in wellness:
            print(daily_markdown(w))
    elif args.sink == "files":
        write_files(Path(args.out), activities, wellness)
        print(f"Wrote {len(activities)} activities and {len(wellness)} days to {args.out}/")
    else:
        post_ingest(activities, wellness)

    if errors:
        print(f"Note: {len(errors)} request(s) failed or had no data: "
              + "; ".join(errors[:8]), file=sys.stderr)


if __name__ == "__main__":
    main()
