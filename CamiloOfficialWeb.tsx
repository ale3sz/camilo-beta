import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, ArrowRight, MapPin, Clock, ExternalLink } from 'lucide-react';

// ============================================================================
// TYPES & REAL DATA — CAMILO CAFÉ ARTESANAL (ROSARIO & FUNES)
// ============================================================================

type CategoryId = 'desayunos' | 'tentacion' | 'almuerzos' | 'licuados';

interface MenuCategory {
  id: CategoryId;
  pill: string;
  schedule: string;
  description: string;
}

interface MenuItem {
  id: string;
  category: CategoryId;
  title: string;
  subtitle: string;
  price: string;
  tag: string;
  timeTag: string;
  image: string;
}

type BookingGoalId = 'rave' | 'grupos' | 'mayorista' | 'giftcard';

interface BookingGoal {
  id: BookingGoalId;
  title: string;
  subtitle: string;
  whatsappIntro: string;
  previewBadge: string;
  previewTitle: string;
  previewImage: string;
  allowedBranches: string[] | null;
}

const CATEGORIES: MenuCategory[] = [
  {
    id: 'desayunos',
    pill: '.DESAYUNOS Y MERIENDAS XXL.',
    schedule: 'Todos los días de 08:00 al cierre',
    description:
      'Nuestra bollería gigante recién horneada, tazones de cerámica de 500cc y combos para compartir entre 2 o 3 personas.',
  },
  {
    id: 'tentacion',
    pill: '.TENTACIÓN DEL DÍA (L a V hasta 16hs).',
    schedule: 'Lunes a Viernes de 08:00 a 16:00 hs',
    description:
      'Las promos más pedidas de la semana para desayunar o cortar la mañana con porciones XL a precio especial.',
  },
  {
    id: 'almuerzos',
    pill: '.MENÚ EJECUTIVO & ALMUERZOS (11 a 16hs).',
    schedule: 'Lunes a Sábados de 11:00 a 16:00 hs',
    description:
      'Platos caseros abundantes, sándwiches en croissant XXL y ensaladas completas con bebida y café incluido.',
  },
  {
    id: 'licuados',
    pill: '.LICUADOS, TRAGOS Y CROCANTES.',
    schedule: 'Todo el día · Ideal Tardecita & After Office',
    description:
      'La nueva carta: licuados de 500ml con pistacho o Nutella, exprimidos hasta 5 litros, vermut, gin y tapeo caliente.',
  },
];

const MENU_PRODUCTS: MenuItem[] = [
  {
    id: 'croissant-pistacho',
    category: 'desayunos',
    title: 'Croissant XXL Pistacho & Pastelera',
    subtitle:
      'Nuestro clásico viral del tamaño de un antebrazo, relleno a tope de crema de pistacho artesanal y pastelera.',
    price: '$15.000',
    tag: 'MÁS PEDIDO · COMEN 2',
    timeTag: 'Todo el día',
    image: '/assets/posts/camilo_post_10.jpg',
  },
  {
    id: 'camilo-power-libre',
    category: 'desayunos',
    title: 'Camilo Power Libre',
    subtitle:
      'Tazón de café 500cc libre + facturas y bollería dulce libre + vaso de exprimido de naranja libre.',
    price: '$27.000',
    tag: 'EXPERIENCIA LIBRE',
    timeTag: 'Desayuno y Merienda',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'tentacion-dia-home',
    category: 'desayunos',
    title: 'Tentación del Día XL',
    subtitle:
      'Café de especialidad en jarrita + Medialuna XXL tibia de manteca recién salida del horno.',
    price: '$7.500',
    tag: 'PROMO SEMANAL',
    timeTag: 'Lun a Vie hasta 16:00',
    image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'toston-camilo-compartir',
    category: 'desayunos',
    title: 'Tostón Camilo para Compartir',
    subtitle:
      '2 Tazones 500cc + base de Croissant XXL abierta con palta fresca, huevos a la plancha y cherrys + 2 exprimidos.',
    price: '$37.000',
    tag: 'PARA 2 O 3 PERSONAS',
    timeTag: 'Todo el día',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'tentacion-jarrita',
    category: 'tentacion',
    title: 'Tentación Jarrita + Medialuna XXL',
    subtitle: 'Café doble o cortado en jarrita + 1 Medialuna gigante de manteca o dulce de leche.',
    price: '$7.500',
    tag: 'CLÁSICO IMBATIBLE',
    timeTag: 'Lun a Vie hasta 16:00',
    image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'tentacion-tazon-campo',
    category: 'tentacion',
    title: 'Tentación Tazón 500cc & Tostadas',
    subtitle:
      'Nuestro icónico tazón de cerámica de medio litro con latte art + tostadas de masa madre, queso crema y mermelada.',
    price: '$11.500',
    tag: 'TAZÓN 500CC',
    timeTag: 'Lun a Vie hasta 16:00',
    image: '/assets/posts/camilo_post_8.jpg',
  },
  {
    id: 'tentacion-salada-jyq',
    category: 'tentacion',
    title: 'Tentación Salada XXL Jamón & Queso',
    subtitle:
      'Tazón 500cc de café con leche + Medialuna XXL prensada rellena de abundante jamón natural y queso fundido.',
    price: '$13.800',
    tag: 'SALADO CALIENTE',
    timeTag: 'Lun a Vie hasta 16:00',
    image: 'https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'tentacion-combo-compartir',
    category: 'tentacion',
    title: 'Combo Semana para Compartir',
    subtitle: '2 Tazones de 500cc + 2 Medialunas XXL + 2 Vasos de jugo de naranja recién exprimido.',
    price: '$23.500',
    tag: 'COMBO DÚO',
    timeTag: 'Lun a Vie hasta 16:00',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'ejecutivo-del-dia',
    category: 'almuerzos',
    title: 'Menú Ejecutivo Camilo',
    subtitle:
      'Plato principal elaborado en el día + Bebida sin alcohol + Café en jarrita o mini postre incluido.',
    price: '$15.000',
    tag: 'BEBIDA + CAFÉ INCLUIDO',
    timeTag: 'Lun a Sáb 11 a 16 hs',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'croissant-lomito-xxl',
    category: 'almuerzos',
    title: 'Croissant XXL de Lomito & Huevo',
    subtitle:
      'Croissant salado gigante con lomito ahumado, queso danbo gratinado, huevo a la plancha, tomate, rúcula y papas.',
    price: '$18.500',
    tag: 'ALMUERZO XXL',
    timeTag: '11:00 a 16:00 hs',
    image: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'milanesa-compartir',
    category: 'almuerzos',
    title: 'Milanesa Napolitana XXL para 2',
    subtitle:
      'Milanesa de ternera gigante con salsa casera, jamón cocido natural, muzzarella fundida y colchón de papas rústicas.',
    price: '$22.500',
    tag: 'PARA COMPARTIR',
    timeTag: '11:00 a 16:00 hs',
    image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'caesar-bowl-xxl',
    category: 'almuerzos',
    title: 'Caesar Bowl Crispy XXL',
    subtitle:
      'Hojas verdes orgánicas, suprema de pollo rebozada crocante, hebras de parmesano, crutones caseros y aderezo Caesar.',
    price: '$16.200',
    tag: 'FRESCO & ABUNDANTE',
    timeTag: '11:00 a 16:00 hs',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'bidon-5l-exprimido',
    category: 'licuados',
    title: 'Jugo Exprimido: 500ml, 1L y Bidón 5L',
    subtitle:
      '100% naranja recién exprimida sin agregados. Botellas para llevar y bidón gigante de 5 litros (minorista y mayorista).',
    price: '$24.000',
    tag: 'BIDÓN 5 LITROS',
    timeTag: 'Para llevar / Mayorista',
    image: '/assets/posts/camilo_post_6.jpg',
  },
  {
    id: 'tragos-sunset-copon',
    category: 'licuados',
    title: 'Aperol Spritz, Gin Beefeater & Cynar',
    subtitle:
      'Aperol con Salentein Extra Brut (500ml), Gin Tonic Beefeater (500ml), Cynar con pomelo o Fernet con Coca-Cola.',
    price: '$9.500',
    tag: 'COPÓN 500ML',
    timeTag: 'Sunset & After Office',
    image: '/assets/posts/camilo_post_4.jpg',
  },
  {
    id: 'licuados-especiales-500',
    category: 'licuados',
    title: 'Licuados Especiales 500ml & Coffee Pistacho',
    subtitle:
      'Frutilla Pistacho, Frutella (frutilla y Nutella), Banana Split, Frutilla Cream (con pastelera) y Coffee Nutella.',
    price: '$8.500',
    tag: 'NUEVA CARTA',
    timeTag: 'Todo el día',
    image: '/assets/posts/camilo_post_1.jpg',
  },
  {
    id: 'crocantes-fingers-muzza',
    category: 'licuados',
    title: 'Crocantes: Fingers de Pollo & Muzzarella',
    subtitle:
      '10 unidades de fingers de pollo o 10 bocados de muzzarella rebozados + dips a elección (barbacoa, salsa golf, mayo).',
    price: '$14.800',
    tag: '10 UNIDADES + DIPS',
    timeTag: 'Ideal para picar',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=900&q=85',
  },
];

const BOOKING_GOALS: BookingGoal[] = [
  {
    id: 'rave',
    title: 'Coffee Rave / Sunset',
    subtitle: 'Viernes 18hs · DJ en vivo',
    whatsappIntro: 'Quiero reservar mesa para el Sunset Coffee Rave',
    previewBadge: 'SUNSET COFFEE RAVE · VIERNES 18:00 HS',
    previewTitle: 'DJ en vivo en simultáneo: Echesortu y Funes',
    previewImage: '/assets/posts/camilo_post_3.jpg',
    allowedBranches: ['Mendoza y Lavalle (Echesortu)', 'Médicos de Funes 1685 (Funes)'],
  },
  {
    id: 'grupos',
    title: 'Despedidas y Grupos',
    subtitle: 'Cumpleaños, equipos y familias',
    whatsappIntro: 'Quiero reservar una mesa grupal / festejo',
    previewBadge: 'MESAS GRUPALES & FESTEJOS · 4 SUCURSALES',
    previewTitle: 'Encuentros abundantes sin esperar respuesta en DM',
    previewImage: '/assets/posts/camilo_post_11.jpg',
    allowedBranches: null,
  },
  {
    id: 'mayorista',
    title: 'Congelados y Bidón 5L',
    subtitle: 'Para hornear en casa o mayorista',
    whatsappIntro: 'Quiero hacer un encargo de Congelados / Bidón 5L Exprimido',
    previewBadge: 'RETIRO PROGRAMADO & PEDIDOS MAYORISTAS',
    previewTitle: 'Bidones de 5L recién exprimidos y bolsas de panificados',
    previewImage: '/assets/posts/camilo_post_6.jpg',
    allowedBranches: null,
  },
  {
    id: 'giftcard',
    title: 'Gift Cards & Merch',
    subtitle: 'Tarjetas regalo, Jenga y Ta-Te-Ti',
    whatsappIntro: 'Quiero encargar una Gift Card / Juego de mesa Camilo',
    previewBadge: 'REGALÁ UNA EXPERIENCIA XXL EN CAMILO',
    previewTitle: 'Gift Cards físicas/digitales y juegos de madera oficiales',
    previewImage: '/assets/highlights/highlight_4_GIFT CARD.jpg',
    allowedBranches: null,
  },
];

const ALL_BRANCHES = [
  {
    id: 'centro',
    shortName: 'Pte. Roca 1259 (Centro)',
    zone: 'Rosario Centro · Casa Madre',
    address: 'Pte. Roca 1259, Rosario',
    hours: 'Lunes a Domingo de 08:00 a 21:00 hs',
    features: ['Casa Matriz', 'Menú Ejecutivo', 'Pet Friendly'],
    raveActive: false,
    mapQuery: 'Presidente+Roca+1259+Rosario+Santa+Fe',
  },
  {
    id: 'echesortu',
    shortName: 'Mendoza y Lavalle (Echesortu)',
    zone: 'Barrio Echesortu · Esquina Clásica',
    address: 'Mendoza esq. Lavalle, Rosario',
    hours: 'Lunes a Domingo de 08:00 al cierre',
    features: ['Sede Coffee Rave', 'Vereda Amplia', 'Pet Friendly'],
    raveActive: true,
    mapQuery: 'Mendoza+y+Lavalle+Rosario+Santa+Fe',
  },
  {
    id: 'zonasur',
    shortName: 'San Martín y O. Andrade',
    zone: 'Zona Sur · Rosario',
    address: 'Av. San Martín esq. Olegario Andrade, Rosario',
    hours: 'Lunes a Domingo de 08:00 a 21:00 hs',
    features: ['Combos XXL', 'Almuerzos', 'Pet Friendly'],
    raveActive: false,
    mapQuery: 'San+Martin+y+Olegario+Andrade+Rosario+Santa+Fe',
  },
  {
    id: 'funes',
    shortName: 'Médicos de Funes 1685 (Funes)',
    zone: 'Complejo Barrio Calmo · Pérgola & Terraza',
    address: 'Av. Médicos de Funes 1685, Funes',
    hours: 'Lunes a Domingo de 08:00 al cierre',
    features: ['Sunset & Pérgola', 'Sede Coffee Rave', 'Pet Friendly'],
    raveActive: true,
    mapQuery: 'Medicos+de+Funes+1685+Funes+Santa+Fe',
  },
];

const PEOPLE_LIST = [
  '2 personas',
  '4 personas',
  '6 personas',
  '8 personas',
  '10 personas',
  '15+ personas (Grupo / Empresa)',
];

const SCHEDULE_LIST = [
  'Este Viernes 18:00 hs (Sunset)',
  'Este Viernes 18:30 hs',
  'Sábado 10:00 hs (Desayuno)',
  'Sábado 17:30 hs (Merienda)',
  'Domingo 10:30 hs',
  'Lunes a Viernes 09:30 hs',
  'Lunes a Viernes 13:00 hs (Almuerzo)',
];

// ============================================================================
// MAIN PRODUCTION COMPONENT (Real Full-Bleed Website — No Fake Browser Frame)
// ============================================================================

export default function CamiloOfficialWeb() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('desayunos');
  const [modalProduct, setModalProduct] = useState<MenuItem | null>(null);

  const [selectedGoal, setSelectedGoal] = useState<BookingGoalId>('rave');
  const [selectedBranch, setSelectedBranch] = useState<string>('Médicos de Funes 1685 (Funes)');
  const [selectedPeople, setSelectedPeople] = useState<string>('6 personas');
  const [selectedSchedule, setSelectedSchedule] = useState<string>('Este Viernes 18:00 hs (Sunset)');
  const [customNote, setCustomNote] = useState<string>('');

  useEffect(() => {
    if (selectedGoal === 'rave') {
      const valid = ['Mendoza y Lavalle (Echesortu)', 'Médicos de Funes 1685 (Funes)'];
      if (!valid.includes(selectedBranch)) {
        setSelectedBranch('Médicos de Funes 1685 (Funes)');
      }
      setSelectedSchedule('Este Viernes 18:00 hs (Sunset)');
    }
  }, [selectedGoal, selectedBranch]);

  const activeCategoryInfo = useMemo(
    () => CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0],
    [activeCategory]
  );

  const visibleProducts = useMemo(
    () => MENU_PRODUCTS.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

  const currentGoalObj = useMemo(
    () => BOOKING_GOALS.find((g) => g.id === selectedGoal) || BOOKING_GOALS[0],
    [selectedGoal]
  );

  const whatsappHref = useMemo(() => {
    const base = `Hola Camilo! ${currentGoalObj.whatsappIntro} para ${selectedSchedule} en la sucursal ${selectedBranch}. Somos ${selectedPeople}.`;
    const extra = customNote.trim() ? ` Detalle adicional: ${customNote.trim()}.` : '';
    return `https://wa.me/5493410000000?text=${encodeURIComponent(`${base}${extra} Muchas gracias!`)}`;
  }, [currentGoalObj, selectedSchedule, selectedBranch, selectedPeople, customNote]);

  return (
    <div className="min-h-screen bg-[#F3ECE1] text-[#111111] font-sans antialiased selection:bg-[#E86A1C] selection:text-white">
      {/* Top Status Strip */}
      <div className="bg-[#111111] text-[#F3ECE1] text-xs sm:text-[13px] py-2 px-4">
        <div className="max-w-[1320px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#27B457] animate-pulse" />
            <span>Abierto todos los días desde las 08:00 hs · 4 Sucursales en Rosario y Funes</span>
          </div>
          <div className="hidden md:flex items-center gap-5 text-[#D8CFC2]">
            <span>Tentación XL: <strong className="text-white">Lun a Vie hasta 16 hs</strong></span>
            <span>Sunset Coffee Rave: <strong className="text-[#E86A1C]">Viernes 18 hs</strong></span>
          </div>
        </div>
      </div>

      {/* Sticky Brand Header */}
      <header className="sticky top-0 z-40 bg-[#F3ECE1]/95 backdrop-blur-md border-b-2 border-[#111111]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-10 h-[80px] flex items-center justify-between gap-4">
          <a href="#carta-xxl" className="relative z-50">
            <div className="w-[96px] h-[96px] rounded-full bg-[#050505] border-2 border-[#111111] shadow-xl overflow-hidden translate-y-3">
              <img src="/assets/logo_oficial.jpg" alt="Camilo Café Artesanal" className="w-full h-full object-cover" />
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-extrabold text-[#111111]">
            <a href="#carta-xxl" onClick={() => setActiveCategory('desayunos')} className="hover:text-[#E86A1C]">.CARTA XXL.</a>
            <a href="#carta-xxl" onClick={() => setActiveCategory('tentacion')} className="hover:text-[#E86A1C]">.PROMOS POR HORARIO.</a>
            <a href="#carta-xxl" onClick={() => setActiveCategory('licuados')} className="hover:text-[#E86A1C]">.LICUADOS Y TRAGOS.</a>
            <a href="#reservas" onClick={() => setSelectedGoal('rave')} className="hover:text-[#E86A1C]">.COFFEE RAVE.</a>
            <a href="#sucursales" className="hover:text-[#E86A1C]">.4 SUCURSALES.</a>
          </nav>

          <a
            href="#reservas"
            className="bg-[#E86A1C] hover:bg-[#CF5910] text-white font-extrabold text-sm px-5 py-3 rounded-full border-[1.5px] border-[#111111] shadow-[0_3px_0_#111111] transition-all"
          >
            Reservar / Pedir por WhatsApp →
          </a>
        </div>
      </header>

      {/* Hero + Carta XXL Section */}
      <section id="carta-xxl" className="pt-12 pb-16 border-b-2 border-[#111111]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-[110px]">
            <h1 className="text-4xl sm:text-5xl font-black uppercase leading-[1.03] tracking-tight">
              DEJÁ DE IMAGINARLO:<br />
              MIRÁ LA CARTA XXL<br />
              <span className="text-[#E86A1C]">EN TAMAÑO REAL</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#2F2B27] font-medium">
              Abierto todos los días en Rosario y Funes. Porciones gigantes recién horneadas, tazones de 500cc y promos claras según la hora del día.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {CATEGORIES.map((cat) => {
                const active = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2.5 rounded-full text-xs font-extrabold border-[1.75px] border-[#111111] transition-all cursor-pointer ${
                      active ? 'bg-[#E86A1C] text-white shadow-[0_3px_0_#111111]' : 'bg-[#FAF6F0] text-[#111111]'
                    }`}
                  >
                    {cat.pill}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 bg-[#FAF6F0] border-[1.5px] border-[#111111] rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs font-extrabold text-[#E86A1C]">
                <span>FRANJA HORARIA</span>
                <span className="text-[#111111] bg-[#E6DDD0] px-2.5 py-0.5 rounded-full">{activeCategoryInfo.schedule}</span>
              </div>
              <p className="mt-1.5 text-sm text-[#3A3530]">{activeCategoryInfo.description}</p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {visibleProducts.map((item) => (
              <motion.article
                key={item.id}
                whileHover={{ y: -4 }}
                onClick={() => setModalProduct(item)}
                className="bg-[#FAF6F0] border-2 border-[#111111] rounded-[20px] p-4 flex flex-col justify-between shadow-[0_4px_0_#111111] cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-extrabold mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E6DDD0]">{item.tag}</span>
                    <span className="text-[#5A534A]">{item.timeTag}</span>
                  </div>
                  <h2 className="text-xl font-extrabold leading-tight">{item.title}</h2>
                  <p className="mt-1.5 text-sm text-[#3A3530]">{item.subtitle}</p>
                </div>
                <div className="mt-4 relative h-[210px] rounded-[14px] overflow-hidden border border-[#111111]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute bottom-2.5 right-2.5 bg-[#111111] text-white font-extrabold text-base px-4 py-1 rounded-full">
                    {item.price}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Reservas en 3 Toques Section */}
      <section id="reservas" className="grid grid-cols-1 lg:grid-cols-12 border-b-2 border-[#111111]">
        <div className="lg:col-span-7 bg-[#F3ECE1] px-4 sm:px-8 lg:px-14 py-14 lg:border-r-2 border-[#111111]">
          <h2 className="text-3xl sm:text-4xl font-black uppercase">Armá tu Reserva o Encargo en 3 Toques</h2>
          <p className="mt-2 text-lg text-[#3A3530]">Sin esperar en Instagram. Tu WhatsApp se abre redactado listo para tocar Enviar.</p>

          <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BOOKING_GOALS.map((goal) => {
              const selected = selectedGoal === goal.id;
              return (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={`relative rounded-2xl p-4 text-center min-h-[140px] flex flex-col justify-between cursor-pointer ${
                    selected ? 'bg-[#FAF6F0] border-2 border-[#E86A1C] shadow-[0_4px_0_#E86A1C]' : 'bg-[#FAF6F0]/70 border border-[#111111]/40'
                  }`}
                >
                  {selected && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#E86A1C] text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                  <div className="font-extrabold text-sm mt-auto">{goal.title}</div>
                  <div className="text-xs text-[#5A534A] mt-1">{goal.subtitle}</div>
                </button>
              );
            })}
          </div>

          <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ALL_BRANCHES.map((b) => {
              const selected = selectedBranch === b.shortName;
              const disabled = currentGoalObj.allowedBranches && !currentGoalObj.allowedBranches.includes(b.shortName);
              return (
                <button
                  key={b.id}
                  disabled={Boolean(disabled)}
                  onClick={() => setSelectedBranch(b.shortName)}
                  className={`px-4 py-3 rounded-full text-sm font-extrabold border-[1.75px] border-[#111111] ${
                    disabled ? 'opacity-35 line-through cursor-not-allowed' : selected ? 'bg-[#111111] text-white' : 'bg-[#FAF6F0]'
                  }`}
                >
                  {b.shortName}
                </button>
              );
            })}
          </div>

          <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={selectedPeople}
              onChange={(e) => setSelectedPeople(e.target.value)}
              className="bg-[#FAF6F0] border-[1.75px] border-[#111111] rounded-full px-4 py-2.5 text-sm font-extrabold"
            >
              {PEOPLE_LIST.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select
              value={selectedSchedule}
              onChange={(e) => setSelectedSchedule(e.target.value)}
              className="bg-[#FAF6F0] border-[1.75px] border-[#111111] rounded-full px-4 py-2.5 text-sm font-extrabold"
            >
              {SCHEDULE_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#111111] text-white px-4 sm:px-8 lg:px-12 py-14 flex flex-col justify-center gap-5">
          <div className="bg-[#173124] border border-[#2C543F] rounded-[20px] p-6">
            <p className="text-sm font-extrabold mb-3">Así se abre tu WhatsApp listo para tocar Enviar:</p>
            <div className="bg-[#F3ECE1] text-[#111111] rounded-2xl p-4 text-sm leading-relaxed">
              Hola Camilo! {currentGoalObj.whatsappIntro} para <strong>{selectedSchedule}</strong> en la sucursal <strong>{selectedBranch}</strong>. Somos <strong>{selectedPeople}</strong>. Muchas gracias!
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full bg-[#27B457] hover:bg-[#209B49] text-white font-extrabold py-3.5 px-6 rounded-full flex items-center justify-center gap-2"
            >
              <span>Abrir WhatsApp con este mensaje listo</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
