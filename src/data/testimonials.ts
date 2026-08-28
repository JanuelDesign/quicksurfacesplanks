export interface TestimonialItem {
  id: string;
  clientName: string;
  role: string;
  roleEn: string;
  community: string;
  imageFileName: string;
  githubUrl: string;
  localUrl: string;
  rating: number;
  quote: string;
  quoteEn: string;
  tag: string;
  tagEn: string;
}

const GITHUB_BASE = 'https://raw.githubusercontent.com/JanuelDesign/quicksurfacesplanks/refs/heads/main/public/images/about-us';

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'testimonio-01',
    clientName: 'World of Cycling',
    role: 'Local Comercial / Showroom',
    roleEn: 'Commercial Client / Showroom',
    community: 'Miami, FL',
    imageFileName: 'about-01-cycling.webp',
    githubUrl: `${GITHUB_BASE}/about-01-cycling.webp`,
    localUrl: `${GITHUB_BASE}/about-01-cycling.webp`,
    rating: 5,
    quote: 'Excelente calidad de los pisos de vinilo y un acabado profesional en cada detalle. Totalmente recomendados en Miami.',
    quoteEn: 'Outstanding luxury vinyl flooring quality and professional craftsmanship in every detail. Highly recommended in Miami.',
    tag: 'Cliente Comercial',
    tagEn: 'Commercial Client',
  },
  {
    id: 'testimonio-02',
    clientName: 'Divermansion Miami',
    role: 'Residencial / Comercial',
    roleEn: 'Residential / Commercial',
    community: 'Miami, FL',
    imageFileName: 'about-02-divermansion.webp',
    githubUrl: `${GITHUB_BASE}/about-02-divermansion.webp`,
    localUrl: `${GITHUB_BASE}/about-02-divermansion.webp`,
    rating: 5,
    quote: 'Los pisos de vinilo XL Pulse superaron nuestras expectativas. Máxima durabilidad, 100% impermeables y una estética espectacular.',
    quoteEn: 'The XL Pulse vinyl planks exceeded our expectations. Maximum durability, 100% waterproof, and stunning aesthetics.',
    tag: 'Pisos XL Pulse',
    tagEn: 'XL Pulse Planks',
  },
  {
    id: 'testimonio-03',
    clientName: 'Freddy Romero',
    role: 'Propietario',
    roleEn: 'Homeowner',
    community: 'Homestead / Miami, FL',
    imageFileName: 'about-03-freddy.webp',
    githubUrl: `${GITHUB_BASE}/about-03-freddy.webp`,
    localUrl: `${GITHUB_BASE}/about-03-freddy.webp`,
    rating: 5,
    quote: 'Instalación impecable en el 2do piso y las escaleras quedaron perfectas sin bordes salientes. Cumplieron con los tiempos prometidos.',
    quoteEn: 'Flawless 2nd floor installation and the custom stairs look seamless with zero overlap. Delivered on time and clean.',
    tag: '2do Piso & Escaleras',
    tagEn: '2nd Floor & Stairs',
  },
  {
    id: 'testimonio-04',
    clientName: 'Januel Design',
    role: 'Diseño de Interiores',
    roleEn: 'Interior Design Studio',
    community: 'Miami, FL',
    imageFileName: 'about-04-januel.webp',
    githubUrl: `${GITHUB_BASE}/about-04-januel.webp`,
    localUrl: `${GITHUB_BASE}/about-04-januel.webp`,
    rating: 5,
    quote: 'Colaboramos con Quick Surfaces por su precisión en las texturas sincronizadas (EIR), la variedad de tonos y la atención personalizada.',
    quoteEn: 'We collaborate with Quick Surfaces for their precise EIR realistic textures, versatile color tones, and tailored support.',
    tag: 'Diseño & Acabados',
    tagEn: 'Design & Finishes',
  },
  {
    id: 'testimonio-05',
    clientName: 'Lorena Ramos',
    role: 'Propietaria',
    roleEn: 'Homeowner',
    community: 'Siena Reserve, Homestead FL',
    imageFileName: 'about-05-lorena.webp',
    githubUrl: `${GITHUB_BASE}/about-05-lorena.webp`,
    localUrl: `${GITHUB_BASE}/about-05-lorena.webp`,
    rating: 5,
    quote: 'El cambio en nuestra casa fue increíble. El equipo fue muy ordenado y nos trajeron las muestras físicas antes de decidir.',
    quoteEn: 'The transformation in our home was incredible. The crew was very tidy and brought physical samples to our doorstep.',
    tag: 'Siena Reserve',
    tagEn: 'Siena Reserve',
  },
  {
    id: 'testimonio-06',
    clientName: 'Michael Díaz',
    role: 'Propietario',
    roleEn: 'Homeowner',
    community: 'Altamira, Homestead FL',
    imageFileName: 'about-06-michael.webp',
    githubUrl: `${GITHUB_BASE}/about-06-michael.webp`,
    localUrl: `${GITHUB_BASE}/about-06-michael.webp`,
    rating: 5,
    quote: 'Excelente trabajo en 2 días. Quitaron toda la alfombra, nivelaron el piso e instalaron todo sin polvo ni complicaciones.',
    quoteEn: 'Excellent work in 2 days. Removed all the old carpet, leveled the floor, and installed everything cleanly without hassle.',
    tag: 'Instalación Rápida',
    tagEn: 'Turnkey Install',
  },
];
