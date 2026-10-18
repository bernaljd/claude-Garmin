import brasa from './brands/brasa';
import casa from './brands/casa';
import type { Brand } from './types';

/** Elige la marca con BRAND=casa (build/dev). Por defecto: brasa. */
const brands: Record<string, Brand> = { brasa, casa };
const key = process.env.BRAND ?? (import.meta.env.BRAND as string | undefined) ?? 'brasa';

export const brand: Brand = brands[key] ?? brasa;

export const cop = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

export const waLink = (message: string) =>
  `https://wa.me/${brand.whatsapp.number}?text=${encodeURIComponent(message)}`;
