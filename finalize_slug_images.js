const fs = require('fs');
const path = require('path');
const { products } = require('./src/data/products');

const dir = 'c:\\Freelance\\Clients\\Agri\\website\\public\\images\\products';

const manualMap = {
  'chauffage-gaz-inox-poulaillers': 'chauffage-gaz-inox-poulaillers.jpg',
  'ligne-alimentation-automatique': 'mangeoire-plastique-suspendue-25kg.jpg',
  'rotissoire-charbon-commerciale': 'rotissoire-charbon-commerciale.jpg',
  'biberon-veaux-agneaux-4l': 'biberon-veaux-agneaux-4l.jpg',
  'ruban-zoometrique-betail': 'ruban-zoometrique-betail.jpg',
  'granulateur-aliments-4-5kw': 'granulateur-aliments-4-5kw.jpg',
  'moulin-grains-cereales': 'moulin-grains-cereales.jpg',
  'panneau-pad-cooling': 'pad-cooling-2m-15cm.jpg',
  'pulverisateur-tracte-400l': 'pulverisateur-tracte-400l.jpg',
  'pulverisateur-dos-electrique-16l': 'pulverisateur-dos-electrique-16l.jpg',
  'pompe-immergee-dongyin-10cv': 'pompe-immergee-dongyin-10cv.jpg',
  'soluvit-ad3ec-vitamines-1l': 'soluvit-ad3ec-vitamines-1l.jpg',
  'balance-elicom-s200l-30kg': 'balance-elicom-s200l-30kg.jpg',
  'pese-moutons-electronique-300kg': 'pese-moutons-electronique-300kg.jpg',
  'balance-plateforme-3-tonnes': 'balance-plateforme-3-tonnes.jpg',
  'generateur-diesel-emtop-5kva': 'generateur-diesel-emtop-5kva.jpg',
  'thermo-hygrometre-htc-2': 'thermo-hygrometre-htc-2.jpg'
};

products.forEach(p => {
  const targetJpg = p.slug + '.jpg';
  const targetPath = path.join(dir, targetJpg);

  if (!fs.existsSync(targetPath)) {
    const sourceFile = manualMap[p.slug];
    if (sourceFile && fs.existsSync(path.join(dir, sourceFile))) {
      fs.copyFileSync(path.join(dir, sourceFile), targetPath);
      console.log(`Copied ${sourceFile} -> ${targetJpg}`);
    }
  }
});

// Final check
const missing = [];
products.forEach(p => {
  const targetJpg = p.slug + '.jpg';
  const targetPath = path.join(dir, targetJpg);
  if (!fs.existsSync(targetPath)) {
    missing.push(p.slug);
  }
});

console.log('Total products:', products.length);
console.log('Products with dedicated [slug].jpg file:', products.length - missing.length);
console.log('Missing count:', missing.length);
