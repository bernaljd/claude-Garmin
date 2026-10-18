export type DishArt =
  | 'burger' | 'sandwich' | 'fries' | 'wings' | 'bowl'
  | 'fish' | 'drink' | 'dessert' | 'empanada' | 'skewer';

export interface MenuItem {
  id: string;
  category: string; // id de una categoría
  name: string;
  description: string;
  price: number; // COP
  tag?: 'Favorito' | 'Nuevo' | 'Picante' | 'Vegetariano';
  art: DishArt; // ilustración incluida
  image?: string; // opcional: ruta a una foto real en /public (ej. "/fotos/clasica.jpg")
}

export interface Brand {
  /** Datos básicos */
  name: string;
  logoMark: string; // 1–2 letras para el sello/favicon
  tagline: string;
  city: string;
  seo: { title: string; description: string };

  /** Colores y tipografía (se inyectan como variables CSS) */
  theme: {
    bg: string; surface: string; ink: string; muted: string;
    accent: string; accentInk: string; deep: string; deepInk: string;
    fontDisplay: string; fontBody: string; fontsHref: string;
    displayStyle?: 'normal' | 'italic';
    displayCase?: 'none' | 'uppercase';
  };

  hero: { eyebrow: string; title: string; text: string; art: DishArt; highlights: string[] };

  whatsapp: { number: string; greeting: string; itemMessage: string; reserveMessage: string };
  contact: { phone: string; email: string; address: string; neighborhood: string; mapsUrl: string; mapsQuery: string };
  hours: { days: string; time: string }[];
  social: { label: string; handle: string; url: string }[];

  story: { title: string; paragraphs: string[]; facts: { value: string; label: string }[] };
  menu: { categories: { id: string; label: string }[]; items: MenuItem[] };
  gallery: { art: DishArt; caption: string }[];
  finalCta: { title: string; text: string };
  /** Texto discreto del pie. Pon null cuando sea un cliente real. */
  demoNotice: string | null;
}
