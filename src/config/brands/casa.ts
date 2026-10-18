import type { Brand } from '../types';
import base from './brasa';

/** Segunda marca: demuestra que la misma base se adapta a otro estilo. */
const casa: Brand = {
  ...base,
  name: 'Casa Pacífica',
  logoMark: 'CP',
  tagline: 'Cocina del Pacífico colombiano',
  seo: {
    title: 'Casa Pacífica · Cocina del Pacífico en Cali',
    description: 'Ceviches, pescado frito, encocados y empanadas de la costa del Pacífico, en Cali. Consulta el menú y reserva por WhatsApp.',
  },
  theme: {
    bg: '#eef3ef', surface: '#ffffff', ink: '#10261f', muted: '#4f6a60',
    accent: '#e08a00', accentInk: '#1a1200', deep: '#0f3d33', deepInk: '#eef3ef',
    fontDisplay: "'Playfair Display', Georgia, serif",
    fontBody: "'DM Sans', system-ui, sans-serif",
    fontsHref: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:ital,wght@0,700;1,600&display=swap',
    displayStyle: 'italic',
    displayCase: 'none',
  },
  hero: {
    eyebrow: 'San Antonio · Cali',
    title: 'El sabor del Pacífico, a la mesa.',
    text: 'Pescado fresco, coco, hierbas y recetas de la costa de Buenaventura y Tumaco, preparadas despacio.',
    art: 'fish',
    highlights: ['Pescado del día', 'Reservas por WhatsApp', 'Platos sin gluten'],
  },
  whatsapp: {
    number: '573000000000',
    greeting: 'Hola Casa Pacífica, quisiera hacer una consulta.',
    itemMessage: 'Hola Casa Pacífica, quiero pedir: {item}. ¿Me confirman disponibilidad?',
    reserveMessage: 'Hola Casa Pacífica, quisiera reservar una mesa. Somos __ personas el día __ a las __.',
  },
  contact: { ...base.contact, email: 'hola@casapacifica.example', address: 'Cra. 5 #3-21', neighborhood: 'San Antonio, Cali',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=San+Antonio%2C+Cali%2C+Colombia', mapsQuery: 'San Antonio, Cali, Colombia' },
  social: [
    { label: 'Instagram', handle: '@casapacifica.demo', url: 'https://www.instagram.com/' },
    { label: 'Facebook', handle: 'Casa Pacífica (demo)', url: 'https://www.facebook.com/' },
  ],
  story: {
    title: 'La cocina de la abuela, con vista a Cali.',
    paragraphs: [
      'Casa Pacífica trae a Cali las recetas de la costa: coco rallado a mano, hierbas de azotea y pescado que llega cada semana desde Buenaventura.',
      'Cocinamos como en casa: lento, con sazón y para compartir.',
    ],
    facts: [{ value: '2×', label: 'entregas de pescado por semana' }, { value: 'Coco', label: 'rallado cada día' }, { value: '12', label: 'recetas de familia' }],
  },
  menu: {
    categories: [
      { id: 'entradas', label: 'Entradas' },
      { id: 'fuertes', label: 'Platos fuertes' },
      { id: 'bebidas', label: 'Bebidas' },
      { id: 'postres', label: 'Postres' },
    ],
    items: [
      { id: 'ceviche', category: 'entradas', name: 'Ceviche de Camarón', description: 'Camarón en jugo de limón, cilantro, cebolla morada y salsa de la casa.', price: 32000, tag: 'Favorito', art: 'bowl' },
      { id: 'empanadas', category: 'entradas', name: 'Empanadas de Piangua', description: 'Tres empanadas de maíz con piangua guisada y ají de la casa.', price: 18000, tag: 'Nuevo', art: 'empanada' },
      { id: 'pargo', category: 'fuertes', name: 'Pargo Frito', description: 'Pargo entero con patacones, arroz con coco y ensalada fresca.', price: 56000, tag: 'Favorito', art: 'fish' },
      { id: 'encocado', category: 'fuertes', name: 'Encocado de Camarón', description: 'Camarones en salsa de coco con arroz blanco y tajadas.', price: 48000, art: 'bowl' },
      { id: 'sudado', category: 'fuertes', name: 'Sudado de Pescado', description: 'Filete sudado con tomate, cebolla y hierbas, con yuca y arroz.', price: 44000, art: 'fish' },
      { id: 'jugo', category: 'bebidas', name: 'Jugo de Borojó', description: 'Borojó, leche y un poco de miel. Espeso y fresco.', price: 11000, art: 'drink' },
      { id: 'viche', category: 'bebidas', name: 'Limonada Cerezada', description: 'Limón, cereza y hielo. Sin alcohol.', price: 10000, art: 'drink' },
      { id: 'cocada', category: 'postres', name: 'Cocada con Queso', description: 'Cocada tradicional con queso costeño y arequipe.', price: 12000, tag: 'Favorito', art: 'dessert' },
    ],
  },
  gallery: [
    { art: 'fish', caption: 'Pargo frito con patacones' },
    { art: 'bowl', caption: 'Ceviche de camarón' },
    { art: 'empanada', caption: 'Empanadas de piangua' },
    { art: 'drink', caption: 'Jugos naturales' },
    { art: 'dessert', caption: 'Cocada con queso' },
    { art: 'bowl', caption: 'Encocado de camarón' },
  ],
  finalCta: { title: 'Reserva tu mesa en Casa Pacífica.', text: 'Escríbenos por WhatsApp con la fecha y el número de personas. Te confirmamos de inmediato.' },
};

export default casa;
