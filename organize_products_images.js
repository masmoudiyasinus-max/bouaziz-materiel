const fs = require('fs');
const path = require('path');
const { products } = require('./src/data/products');

const dir = 'c:\\Freelance\\Clients\\Agri\\website\\public\\images\\products';
const diskFiles = fs.readdirSync(dir);

// Custom mapping for files that exist under alternative names
const altMappings = {
  'couveuse-river-49-oeufs': 'couveuse_river_1785440266616.png',
  'couveuse-puisor-x2-51-oeufs': 'couveuse_puisor_1785440275189.png',
  'couveuse-numerique-pto-56-oeufs': 'couveuse_pto_1785440284126.png',
  'couveuse-pto-smart-270-oeufs': 'couveuse_pto_smart_1785446369799.png',
  'couveuse-durafiable-ah500': 'couveuse_durafiable_1785439909897.png',
  'lampe-chauffante-philips-250w': 'lampe_chauffante_philips_1785439918251.png',
  'canon-chaleur-diesel-automatique': 'canon_chaleur_diesel_1785446402484.png',
  'mangeoire-plastique-suspendue-20kg': 'mangeoire_plastique_turbo_1785439927994.png',
  'mangeoire-galvanisee-conique-20kg': 'mangeoire_galvanisee_conique_1785446410692.png',
  'mangeoire-lineaire-galvanisee-1m': 'mangeoire_lineaire_1785446418320.png',
  'abreuvoir-plastique-14l': 'abreuvoir_inverse_1785446435409.png',
  'abreuvoir-lineaire-flotteur-1m': 'abreuvoir_lineaire_flotteur_1785446452292.png',
  'systeme-nipple-drinkers': 'systeme_nipple_1785446444436.png',
  'cage-poules-pondeuses-multi-etages': 'cage_poules_pondeuses_1785439943898.png',
  'caisse-transport-volailles-pliable': 'caisse_transport_1785446477770.png',
  'plumeuse-electrique-inox': 'plumeuse_electrique_1785439951227.png',
  'poste-abattage-triple-cone': 'poste_abattage_1785446486983.png',
  'machine-traire-omsa-20l': 'machine_traire_omsa_1785439959804.png',
  'baratte-lait-electrique-40l': 'baratte_lait_inox_1785446351752.png',
  'tondeuse-moutons-electrique-pro': 'tondeuse_moutons_1785446377839.png',
  'seringue-veterinaire-hsw': 'seringue_veterinaire_1785446387131.png',
  'motoculteur-7cv-benzine': 'motoculteur_12cv_1785439968929.png',
  'recolteuse-olives-cifarelli': 'recolteuse_cifarelli_1785439979010.png',
  'broyeur-fourrage-melasty': 'broyeur_melasty_1785439986910.png'
};

// Copy/rename files to expected `${slug}.jpg`
products.forEach(p => {
  const targetJpg = p.slug + '.jpg';
  const targetPath = path.join(dir, targetJpg);

  if (!fs.existsSync(targetPath)) {
    const altFile = altMappings[p.slug];
    if (altFile && fs.existsSync(path.join(dir, altFile))) {
      fs.copyFileSync(path.join(dir, altFile), targetPath);
      console.log(`Copied ${altFile} -> ${targetJpg}`);
    }
  }
});

// Check status now
const stillMissing = [];
products.forEach(p => {
  const targetJpg = p.slug + '.jpg';
  const targetPath = path.join(dir, targetJpg);
  if (!fs.existsSync(targetPath)) {
    stillMissing.push({ id: p.id, slug: p.slug, name: p.name });
  }
});

console.log('\nTotal products:', products.length);
console.log('Products with dedicated [slug].jpg:', products.length - stillMissing.length);
console.log('Still missing [slug].jpg count:', stillMissing.length);
if (stillMissing.length > 0) {
  console.log('Still missing list:', JSON.stringify(stillMissing, null, 2));
}
