import { products } from "./products";

export const categories = [
  {
    id: 1,
    name: "Couveuses & Chauffage",
    nameAr: "الفقاسات والتدفئة",
    slug: "couveuses-chauffage",
    description: "Couveuses automatiques, incubateurs, systèmes de chauffage et accessoires de couvaison pour volailles",
    descriptionAr: "فقاسات بيض أوتوماتيكية، حاضنات، أنظمة تدفئة ومستلزمات تفقيس الدواجن",
    icon: "Egg",
    get productCount() {
      return products.filter((p) => p.category === "couveuses-chauffage").length;
    },
    image: "/images/categories/couveuses.jpg",
  },
  {
    id: 2,
    name: "Mangeoires & Abreuvoirs",
    nameAr: "المعالف والمشارب",
    slug: "mangeoires-abreuvoirs",
    description: "Mangeoires, abreuvoirs automatiques et systèmes d'alimentation pour volailles et oiseaux",
    descriptionAr: "معالف، مشارب أوتوماتيكية وأنظمة تغذية للدواجن والطيور",
    icon: "Droplets",
    get productCount() {
      return products.filter((p) => p.category === "mangeoires-abreuvoirs").length;
    },
    image: "/images/categories/mangeoires.jpg",
  },
  {
    id: 3,
    name: "Cages & Batteries",
    nameAr: "الأقفاص والبطاريات",
    slug: "cages-batteries",
    description: "Cages d'élevage, batteries pour poules pondeuses, caisses de transport et équipements d'abattage",
    descriptionAr: "أقفاص تربية، بطاريات دجاج بياض، صناديق نقل ومعدات ذبح",
    icon: "Grid3x3",
    get productCount() {
      return products.filter((p) => p.category === "cages-batteries").length;
    },
    image: "/images/categories/cages.jpg",
  },
  {
    id: 4,
    name: "Élevage Bovin & Ovin",
    nameAr: "تربية الأبقار والأغنام",
    slug: "elevage-bovin-ovin",
    description: "Machines à traire, matériel vétérinaire, tondeuses à laine et accessoires d'élevage",
    descriptionAr: "آلات حلابة، معدات بيطرية، آلات جز صوف ومستلزمات تربية",
    icon: "Beef",
    get productCount() {
      return products.filter((p) => p.category === "elevage-bovin-ovin").length;
    },
    image: "/images/categories/bovin.jpg",
  },
  {
    id: 5,
    name: "Machines Agricoles",
    nameAr: "الآلات الزراعية",
    slug: "machines-agricoles",
    description: "Motoculteurs, décortiqueuses, broyeurs d'aliments et équipements de récolte",
    descriptionAr: "جرارات يدوية (Motoculteur)، مقشرات، مطاحن أعلاف ومعدات جني",
    icon: "Tractor",
    get productCount() {
      return products.filter((p) => p.category === "machines-agricoles").length;
    },
    image: "/images/categories/machines.jpg",
  },
  {
    id: 6,
    name: "Ventilation & Irrigation",
    nameAr: "التهوية والرش",
    slug: "ventilation-irrigation",
    description: "Extracteurs d'air, pad cooling, pulvérisateurs et pompes d'irrigation",
    descriptionAr: "مراوح سحب، لوحات تبريد، آلات رش مبيدات ومضخات مياه",
    icon: "Wind",
    get productCount() {
      return products.filter((p) => p.category === "ventilation-irrigation").length;
    },
    image: "/images/categories/ventilation.jpg",
  },
  {
    id: 7,
    name: "Alimentation & Santé Animale",
    nameAr: "التغذية والصحة الحيوانية",
    slug: "alimentation-sante-animale",
    description: "Aliments composés, vitamines, compléments alimentaires, antiparasitaires et raticides",
    descriptionAr: "أعلاف مركبة، فيتامينات، مكملات غذائية، مبيدات حشرات وسموم فئران",
    icon: "Pill",
    get productCount() {
      return products.filter((p) => p.category === "alimentation-sante-animale").length;
    },
    image: "/images/categories/alimentation.jpg",
  },
  {
    id: 8,
    name: "Balances & Équipements",
    nameAr: "الموازين والمعدات",
    slug: "balances-equipements",
    description: "Balances commerciales, pèse-bétail, générateurs électriques et instruments de mesure",
    descriptionAr: "موازين تجارية، موازين مواشي، مولدات كهرباء وأدوات قياس",
    icon: "Scale",
    get productCount() {
      return products.filter((p) => p.category === "balances-equipements").length;
    },
    image: "/images/categories/balances.jpg",
  },
];

export function getCategoryBySlug(slug) {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id) {
  return categories.find((c) => c.id === id);
}
