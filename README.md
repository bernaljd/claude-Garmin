# Demo de página web para restaurantes

Plantilla (Astro + TypeScript, sin backend) para mostrar a restaurantes cómo se vería su web: menú filtrable, pedido por WhatsApp, mapa, horarios, historia y galería. Incluye dos marcas de ejemplo (**Brasa & Sal** y **Casa Pacífica**), ambas ficticias.

## Comandos
```bash
npm install
npm run dev                 # http://localhost:4321  (marca por defecto: Brasa & Sal)
BRAND=casa npm run dev      # segunda marca
npm run build               # typecheck + build estático en dist/
npm run preview
```

## Publicar gratis (URL pública)
- **Cloudflare Pages / Netlify / Vercel**: conecta el repositorio. Build: `npm run build`, salida: `dist`.
- Para la segunda marca define la variable de entorno `BRAND=casa`.

## Personalizar para un cliente
Copia `src/config/brands/brasa.ts` a `src/config/brands/cliente.ts`, edita los datos, regístralo en `src/config/brand.ts` y usa `BRAND=cliente`. Campos:
- `name`, `logoMark`, `tagline`, `seo` · `theme` (colores, tipografías de Google Fonts)
- `whatsapp.number` (formato `573001234567`), mensajes precargados (`{item}` se reemplaza por el plato)
- `contact` (dirección, teléfono, `mapsUrl`, `mapsQuery` para el mapa incrustado), `hours`, `social`
- `menu.categories` y `menu.items` (precio en COP, `tag`, `art`; usa `image: "/fotos/plato.jpg"` para una foto real en `public/fotos/`)
- `story`, `gallery`, `finalCta`, y `demoNotice: null` al entregar un sitio real.

## Datos a pedir al restaurante
Nombre y logo · WhatsApp y teléfono · dirección y enlace de Google Maps · horarios · redes sociales · menú completo con precios y descripciones · 8–15 fotos buenas (platos, local) · colores de marca · historia en 2–3 frases · domicilios/reservas sí o no.

## Costos
Gratis: Astro, hosting en Cloudflare Pages/Netlify/Vercel (plan gratuito), dominio `*.pages.dev`/`*.netlify.app`, Google Fonts, mapa incrustado. Pago opcional: dominio propio (~COP 50.000–70.000/año).

## Limitaciones
- Las imágenes de la demo son ilustraciones propias en SVG, no fotografías; para clientes reales sustitúyelas por fotos (`image`).
- Número de WhatsApp, redes y direcciones son ficticios.
