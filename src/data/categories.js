import { products } from "./products.js";

export const categories = [
  {
    id: 1,
    name: "Couveuses & Chauffage",
    slug: "couveuses-chauffage",
    description: "Couveuses automatiques, incubateurs, systèmes de chauffage et accessoires de couvaison pour volailles",
    icon: "Egg",
    get productCount() {
      return Array.isArray(products) ? products.filter((p) => p && p.category === "couveuses-chauffage").length : 0;
    },
    image: "/images/products/couveuse-durafiable-ah500.jpg",
  },
  {
    id: 2,
    name: "Mangeoires & Abreuvoirs",
    slug: "mangeoires-abreuvoirs",
    description: "Mangeoires, abreuvoirs automatiques et systèmes d'alimentation pour volailles et oiseaux",
    icon: "Droplets",
    get productCount() {
      return Array.isArray(products) ? products.filter((p) => p && p.category === "mangeoires-abreuvoirs").length : 0;
    },
    image: "/images/products/mangeoire-galvanisee-conique-20kg.jpg",
  },
  {
    id: 3,
    name: "Cages & Batteries",
    slug: "cages-batteries",
    description: "Cages d'élevage, batteries pour poules pondeuses, caisses de transport et équipements d'abattage",
    icon: "Grid3x3",
    get productCount() {
      return Array.isArray(products) ? products.filter((p) => p && p.category === "cages-batteries").length : 0;
    },
    image: "/images/products/cage-poules-pondeuses-multi-etages.jpg",
  },
  {
    id: 4,
    name: "Élevage Bovin & Ovin",
    slug: "elevage-bovin-ovin",
    description: "Machines à traire, matériel vétérinaire, tondeuses à laine et accessoires d'élevage",
    icon: "Beef",
    get productCount() {
      return Array.isArray(products) ? products.filter((p) => p && p.category === "elevage-bovin-ovin").length : 0;
    },
    image: "/images/products/machine-traire-omsa-20l.jpg",
  },
  {
    id: 5,
    name: "Machines Agricoles",
    slug: "machines-agricoles",
    description: "Décortiqueuses d'amandes, broyeurs d'aliments, motoculteurs et équipements de récolte",
    icon: "Tractor",
    get productCount() {
      return Array.isArray(products) ? products.filter((p) => p && p.category === "machines-agricoles").length : 0;
    },
    image: "/images/products/decortiqueuse-amandes-v2.jpg",
  },
  {
    id: 6,
    name: "Ventilation & Irrigation",
    slug: "ventilation-irrigation",
    description: "Extracteurs d'air, panneaux cooling, systèmes de brumisation, pompes et tuyaux d'irrigation",
    icon: "Wind",
    get productCount() {
      return Array.isArray(products) ? products.filter((p) => p && p.category === "ventilation-irrigation").length : 0;
    },
    image: "/images/products/extracteur-air-industriel-140cm.jpg",
  },
  {
    id: 7,
    name: "Alimentation & Santé",
    slug: "alimentation-sante-animale",
    description: "Vitamines, compléments nutritionnels, désinfectants et produits d'hygiène pour élevages",
    icon: "Pill",
    get productCount() {
      return Array.isArray(products) ? products.filter((p) => p && p.category === "alimentation-sante-animale").length : 0;
    },
    image: "/images/products/soluvit-ad3ec-vitamines-1l.jpg",
  },
  {
    id: 8,
    name: "Balances & Pesage",
    slug: "balances-equipements",
    description: "Balances électroniques de précision, pesons suspendus et balances industrielles pour bétail et récoltes",
    icon: "Scale",
    get productCount() {
      return Array.isArray(products) ? products.filter((p) => p && p.category === "balances-equipements").length : 0;
    },
    image: "/images/products/balance-elicom-s200l-30kg.jpg",
  },
];
