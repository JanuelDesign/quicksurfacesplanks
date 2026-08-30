/**
 * =========================================================================
 * ARCHIVO DE BASE DE DATOS DE IMÁGENES PARA LA SECCIÓN DE ESCALERAS (STEPS)
 * =========================================================================
 * 
 * ¿DÓNDE Y CÓMO SUBIR TUS IMÁGENES?
 * 1. Para cambiar cualquiera de las imágenes, solo reemplaza el valor de 'imageUrl' 
 *    por el link directo de tu imagen (puede ser URL de Imgur, Cloudinary, AWS S3, 
 *    Google Drive directo o colocar la imagen en la carpeta /public/stairs/... y poner '/stairs/mi-foto.webp').
 * 
 * 2. SECCIONES:
 *    - STAIR_TECHNICAL_IMAGES: Las 2 imágenes de la Fila 1 (Perfil Square Step Nose y Diagrama de Ensamble).
 *    - STAIR_VERTICAL_CARDS: Las 2 imágenes en formato vertical 9:16 (768x1365).
 *    - INSTALLED_STAIRS_CAROUSEL: Las imágenes del carrusel de escaleras instaladas.
 */

export interface StairTechnicalImage {
  id: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  imageUrl: string;
  tag: string;
  tagEn: string;
}

export interface StairVerticalCard {
  id: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  aspectRatio: '9:16';
  dimensions: '768x1365';
  imageUrl: string;
  badge: string;
  badgeEn: string;
}

export interface StairProjectItem {
  id: string;
  title: string;
  titleEn: string;
  community: string;
  colorName: string;
  colorCode: string;
  thickness: string;
  imageUrl: string;
  description: string;
  descriptionEn: string;
  stepsCount: number;
}

/**
 * FILA 1: LAS 2 IMÁGENES TÉCNICAS (Perfil de Pieza y Diagrama de Ensamble)
 * Reemplaza aquí los 'imageUrl' con las 2 imágenes que desees subir.
 */
export const STAIR_TECHNICAL_IMAGES: StairTechnicalImage[] = [
  {
    id: 'stair-tech-1',
    title: 'Pieza Square Step Nose (Perfil al Ras)',
    titleEn: 'Square Step Nose Profile (Flush Finish)',
    subtitle: 'Acabado monobloque sin pestaña plástica (Zero Overlap)',
    subtitleEn: 'Monoblock finish without plastic overlap lip (Zero Overlap)',
    imageUrl: 'https://raw.githubusercontent.com/JanuelDesign/quicksurfacesplanks/refs/heads/main/public/images/steps/steps_square_step.webp',
    tag: 'Perfil 100% al Ras',
    tagEn: '100% Flush Profile',
  },
  {
    id: 'stair-tech-2',
    title: 'Diagrama de Ensamble y Fijación Estructural',
    titleEn: 'Assembly & Structural Adhesion Diagram',
    subtitle: 'Fijación con polímero elástico de alta adherencia y clic continuo',
    subtitleEn: 'High-strength elastic polymer bonding and continuous click-lock',
    imageUrl: 'https://raw.githubusercontent.com/JanuelDesign/quicksurfacesplanks/refs/heads/main/public/images/steps/steps_square_step_diagrama.webp',
    tag: 'Fijación Polimérica',
    tagEn: 'Polymer Bonding',
  },
];

/**
 * FILA 2: LAS 2 IMÁGENES VERTICALES 9:16 (768 x 1365)
 * Totalmente limpias sin textos invasivos sobre la foto.
 */
export const STAIR_VERTICAL_CARDS: StairVerticalCard[] = [
  {
    id: 'stair-vert-1',
    title: 'Transición al Ras Sin Pestañas',
    titleEn: 'Flush Transition Without Overlap',
    subtitle: 'Acabado minimalista moderno de alta seguridad',
    subtitleEn: 'Modern minimalist high-safety finish',
    aspectRatio: '9:16',
    dimensions: '768x1365',
    imageUrl: 'https://raw.githubusercontent.com/JanuelDesign/quicksurfacesplanks/refs/heads/main/public/images/steps/step-card-01-piece.webp',
    badge: 'Formato 9:16',
    badgeEn: 'Format 9:16',
  },
  {
    id: 'stair-vert-2',
    title: 'Escalera Completa de 17 Pasos',
    titleEn: 'Complete 17-Step Staircase',
    subtitle: 'Instalación estructural en Siena Reserve',
    subtitleEn: 'Structural installation in Siena Reserve',
    aspectRatio: '9:16',
    dimensions: '768x1365',
    imageUrl: 'https://raw.githubusercontent.com/JanuelDesign/quicksurfacesplanks/refs/heads/main/public/images/steps/step-card-02-installed.webp',
    badge: '17 Escalones',
    badgeEn: '17 Steps',
  },
];

/**
 * FILA 3: GALERÍA CARRUSEL DE ESCALERAS INSTALADAS
 * Fotos limpias sin cajas de texto sobre la imagen.
 */
export const INSTALLED_STAIRS_CAROUSEL: StairProjectItem[] = [
  {
    id: 'stair-proj-1',
    title: 'Escalera Bandol Model — Siena Reserve',
    titleEn: 'Bandol Model Staircase — Siena Reserve',
    community: 'Siena Reserve (Homestead, FL)',
    colorName: 'Moody Gray',
    colorCode: '01',
    thickness: '5.5mm',
    imageUrl: 'https://raw.githubusercontent.com/JanuelDesign/quicksurfacesplanks/refs/heads/main/public/images/steps/step_gallery02.webp',
    description: 'Instalación de 17 escalones Square Step Nose en tono gris contemporáneo con riser blanco puro.',
    descriptionEn: 'Installation of 17 custom Square Step Noses in contemporary gray with crisp white risers.',
    stepsCount: 17,
  },
  {
    id: 'stair-proj-2',
    title: 'Escalera Casis Model — Siena Reserve',
    titleEn: 'Casis Model Staircase — Siena Reserve',
    community: 'Siena Reserve (Homestead, FL)',
    colorName: 'Trustable Oak',
    colorCode: '03',
    thickness: '5.5mm',
    imageUrl: 'https://raw.githubusercontent.com/JanuelDesign/quicksurfacesplanks/refs/heads/main/public/images/steps/step_gallery03.webp',
    description: 'Tono roble natural cálido con veta continua desde el primer escalón hasta el pasillo del segundo piso.',
    descriptionEn: 'Warm natural oak tone with continuous grain flow from step 1 through the 2nd floor hallway.',
    stepsCount: 17,
  },
  {
    id: 'stair-proj-3',
    title: 'Escalera Monte Carlo Model — Homestead',
    titleEn: 'Monte Carlo Model Staircase — Homestead',
    community: 'Siena Reserve (Homestead, FL)',
    colorName: 'Sweet Caramel',
    colorCode: '04',
    thickness: '6.0mm XL',
    imageUrl: 'https://raw.githubusercontent.com/JanuelDesign/quicksurfacesplanks/refs/heads/main/public/images/steps/step_gallery05.webp',
    description: 'Piso XL de 6.0mm con protección comercial de 20 mil y nariz cuadrada libre de pestañas plásticas.',
    descriptionEn: 'XL 6.0mm flooring with 20 mil commercial wear layer and flush square step nose transitions.',
    stepsCount: 17,
  },
  {
    id: 'stair-proj-4',
    title: 'Escalera Vence Model — Luxury Townhomes',
    titleEn: 'Vence Model Staircase — Luxury Townhomes',
    community: 'Siena Reserve (Homestead, FL)',
    colorName: 'Rich Walnut',
    colorCode: '08',
    thickness: '8.0mm XL',
    imageUrl: 'https://raw.githubusercontent.com/JanuelDesign/quicksurfacesplanks/refs/heads/main/public/images/steps/step_gallery06.webp',
    description: 'Máximo confort acústico con bajo piso IXPE de alta densidad y escalones sellados herméticamente.',
    descriptionEn: 'Maximum acoustic comfort with high-density IXPE backing and hermetically bonded treads.',
    stepsCount: 17,
  },
];
