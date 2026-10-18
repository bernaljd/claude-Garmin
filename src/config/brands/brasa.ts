import type { Brand } from '../types';

const brasa: Brand = {
  name: 'Brasa & Sal',
  logoMark: 'B&S',
  tagline: 'Hamburguesas a la brasa',
  city: 'Cali',
  seo: {
    title: 'Brasa & Sal · Hamburguesas a la brasa en Cali',
    description:
      'Hamburguesas de autor cocinadas a la brasa en el barrio Granada, Cali. Mira el menú, pide por WhatsApp y encuentra cómo llegar.',
  },
  theme: {
    bg: '#f6efe3', surface: '#fffaf1', ink: '#201712', muted: '#6a5a4c',
    accent: '#d9441e', accentInk: '#ffffff', deep: '#1d1410', deepInk: '#f6efe3',
    fontDisplay: "'Fraunces', Georgia, serif",
    fontBody: "'Inter', system-ui, sans-serif",
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,800;1,9..144,600&family=Inter:wght@400;500;600&display=swap',
    displayStyle: 'normal',
    displayCase: 'none',
  },
  hero: {
    eyebrow: 'Barrio Granada · Cali',
    title: 'Carne, fuego y pan de la casa.',
    text: 'Molemos la carne cada mañana, la cocinamos sobre brasa de carbón y la servimos en pan horneado aquí mismo.',
    art: 'burger',
    highlights: ['Abierto hasta las 11 p. m.', 'Domicilios por WhatsApp', 'Opciones vegetarianas'],
  },
  whatsapp: {
    number: '573000000000', // formato internacional, sin + ni espacios (DEMO)
    greeting: 'Hola Brasa & Sal, quisiera hacer una consulta.',
    itemMessage: 'Hola Brasa & Sal, quiero pedir: {item}. ¿Me confirman disponibilidad?',
    reserveMessage: 'Hola Brasa & Sal, quisiera reservar una mesa. Somos __ personas el día __ a las __.',
  },
  contact: {
    phone: '+57 300 000 0000',
    email: 'hola@brasaysal.example',
    address: 'Av. 9 Norte #12-34',
    neighborhood: 'Granada, Cali',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Granada%2C+Cali%2C+Colombia',
    mapsQuery: 'Granada, Cali, Colombia',
  },
  hours: [
    { days: 'Lunes a jueves', time: '12:00 m. – 10:00 p. m.' },
    { days: 'Viernes y sábado', time: '12:00 m. – 11:30 p. m.' },
    { days: 'Domingo', time: '12:00 m. – 8:00 p. m.' },
  ],
  social: [
    { label: 'Instagram', handle: '@brasaysal.demo', url: 'https://www.instagram.com/' },
    { label: 'TikTok', handle: '@brasaysal.demo', url: 'https://www.tiktok.com/' },
    { label: 'Facebook', handle: 'Brasa & Sal (demo)', url: 'https://www.facebook.com/' },
  ],
  story: {
    title: 'Un asador de barrio con idea fija.',
    paragraphs: [
      'Brasa & Sal nació en una terraza de Granada con una parrilla prestada y una obsesión: que una hamburguesa sepa a carne, a humo y a pan recién hecho, nada más.',
      'Hoy seguimos igual de simples. Pocos ingredientes, proveedores del Valle del Cauca y una brasa que no se apaga hasta que se acaba el servicio.',
    ],
    facts: [
      { value: '100%', label: 'carne molida a diario' },
      { value: 'Carbón', label: 'de leña, nunca plancha' },
      { value: 'Pan', label: 'horneado en casa' },
    ],
  },
  menu: {
    categories: [
      { id: 'burgers', label: 'Hamburguesas' },
      { id: 'entradas', label: 'Para compartir' },
      { id: 'bebidas', label: 'Bebidas' },
      { id: 'postres', label: 'Postres' },
    ],
    items: [
      { id: 'clasica', category: 'burgers', name: 'La Clásica', description: 'Carne de res 160 g a la brasa, queso cheddar, lechuga, tomate, cebolla caramelizada y salsa de la casa.', price: 28000, tag: 'Favorito', art: 'burger' },
      { id: 'caleña', category: 'burgers', name: 'La Caleña', description: 'Res a la brasa, queso costeño, plátano maduro, tocineta crocante y ají de piña.', price: 33000, tag: 'Nuevo', art: 'burger' },
      { id: 'doble', category: 'burgers', name: 'Doble Humo', description: 'Dos carnes de 120 g, doble queso, pepinillos, mostaza antigua y cebolla morada.', price: 36000, art: 'burger' },
      { id: 'pollo', category: 'burgers', name: 'Pollo Crocante', description: 'Pechuga apanada en suero de leche, repollo, pepinillos y mayonesa de ajo asado.', price: 27000, art: 'sandwich' },
      { id: 'veggie', category: 'burgers', name: 'Frijol Negro', description: 'Medallón de frijol y quinoa, aguacate, queso fresco, tomate y salsa de cilantro.', price: 26000, tag: 'Vegetariano', art: 'sandwich' },
      { id: 'papas', category: 'entradas', name: 'Papas de la Casa', description: 'Papa criolla y pastusa fritas dos veces, sal de ajo y salsa rosada.', price: 12000, tag: 'Favorito', art: 'fries' },
      { id: 'alitas', category: 'entradas', name: 'Alitas BBQ (8)', description: 'Alitas glaseadas con BBQ de panela y un toque de ahumado. Con aderezo ranch.', price: 24000, tag: 'Picante', art: 'wings' },
      { id: 'brochetas', category: 'entradas', name: 'Brochetas de Res', description: 'Dos brochetas de lomo con pimentón, cebolla y chimichurri de la casa.', price: 22000, art: 'skewer' },
      { id: 'limonada', category: 'bebidas', name: 'Limonada de Coco', description: 'Limón fresco, crema de coco y hielo. La de siempre en Cali.', price: 10000, tag: 'Favorito', art: 'drink' },
      { id: 'lulo', category: 'bebidas', name: 'Lulo en Agua', description: 'Lulo natural macerado, sin exceso de azúcar.', price: 8000, art: 'drink' },
      { id: 'cerveza', category: 'bebidas', name: 'Cerveza Artesanal', description: 'Rubia o roja, pregunta cuál tenemos hoy. Botella de 330 ml.', price: 14000, art: 'drink' },
      { id: 'brownie', category: 'postres', name: 'Brownie a la Brasa', description: 'Brownie tibio con helado de vainilla y arequipe casero.', price: 15000, tag: 'Nuevo', art: 'dessert' },
      { id: 'tres', category: 'postres', name: 'Tres Leches', description: 'Porción generosa con crema batida y canela.', price: 13000, art: 'dessert' },
    ],
  },
  gallery: [
    { art: 'burger', caption: 'La Clásica, recién salida de la brasa' },
    { art: 'fries', caption: 'Papas criollas y pastusas' },
    { art: 'wings', caption: 'Alitas con BBQ de panela' },
    { art: 'drink', caption: 'Limonada de coco bien fría' },
    { art: 'skewer', caption: 'Brochetas de lomo' },
    { art: 'dessert', caption: 'Brownie con arequipe' },
  ],
  finalCta: {
    title: '¿Hambre? Escríbenos y te lo preparamos.',
    text: 'Pide para recoger, a domicilio o reserva tu mesa. Respondemos por WhatsApp todos los días.',
  },
  demoNotice: 'Sitio de demostración con datos ficticios. Marca, teléfono, direcciones y redes son de ejemplo.',
};

export default brasa;
