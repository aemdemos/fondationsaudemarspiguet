const fs = require('fs');

// Read the original English JSON
const originalData = JSON.parse(fs.readFileSync('blocks/map-bien/markers-data.json', 'utf8'));

// Translation mappings from the map-bien JavaScript file
const projectMapping = {
  "a-10-increase-in-the-distribution-of-hot-meals-to-the-most-d": "augmentation-de-10-de-la-distribution-de-repas-chauds-aux-pl",
  "acceleration-programme": "programme-dacceleration",
  "community-food-pack": "community-food-pack",
  "covering-a-part-of-the-basic-nutritional-needs-specifically": "couvrir-une-partie-des-besoins-nutritionnels-de-base-en-part",
  "distribution-of-food-parcels": "distribution-de-colis-alimentaires",
  "emergency-shelter-and-accommodation-programme": "programme-dhebergement-durgence",
  "enhancing-food-and-rice-distribution": "renforcer-la-distribution-de-nourriture-et-de-riz",
  "ensuring-distribution-of-food-aid-and-enhancement-of-food-ba": "assurer-la-distribution-de-laide-alimentaire-et-lamelioratio",
  "food-aid-for-disadvantaged-families": "aide-alimentaire-pour-les-familles-defavorisees",
  "food-pack-distribution-for-the-soup-kitchen-programme": "distribution-de-colis-alimentaires-pour-le-programme-soup-ki",
  "food-rescue-and-rescue-kitchen-programmes": "programmes-food-rescue-et-rescue-kitchen",
  "food-wanted-not-wasted": "food-wanted-not-wasted-nourriture-recherchee-pas-gaspillee",
  "formation-jeunes-youth-training": "formation-jeunes",
  "funding-weekend-meals-in-november-2024-and-2025": "financement-des-repas-du-weekend-en-novembre-2024-et-2025",
  "home-food-distribution-to-elderly-and-disabled-people": "distribution-de-nourriture-a-domicile-pour-les-personnes-en",
  "improving-nutrition-among-vulnerable-populations": "ameliorer-la-nutrition-des-populations-vulnerables",
  "introducing-5200-secondary-school-pupils-to-manual-trades": "initier-5200-jeunes-aux-metiers-manuels-des-le-college",
  "long-term-care-programme-for-vulnerable-elderly-and-disabled": "programme-daide-a-long-terme-pour-les-familles-vulnerables-a",
  "mirandolinas-spring-seniors-on-stage": "le-printemps-mirandolina-les-seniors-en-scene",
  "one-meal-a-day": "un-repas-par-jour",
  "optimisation-of-food-distribution-and-nutritional-improvemen": "optimisation-de-la-distribution-alimentaire-et-amelioration",
  "roll-out-of-local-community-markets-and-local-food-purchasin": "couvrir-une-partie-des-besoins-nutritionnels-de-base-en-part",
  "social-support-drop-in-centre": "permanence-daccueil-social",
  "support-the-scale-up-of-teach-for-italy-to-tackle-education": "soutenir-lexpansion-de-teach-for-italy-tfi-pour-lutter-contr",
  "teaching-as-collective-fellowship-programme": "programme-de-formation-teaching-as-collective",
  "the-espace-clovis-respite-centre-in-metz": "lespace-clovis-a-metz-boutique-solidarite",
  "the-felix-project-kitchen-meals": "the-felix-project-kitchen-meals",
  "transfaire-tomorrow-a-job-for-everyone": "transfaire-demain-un-metier-pour-chacun",
  "wezesha-impact-skills-enterprise-wise-programme": "programme-wezesha-impact-skills-enterprise-wise",
  "working-towards-the-socio-professional-inclusion-of-people-w": "agir-pour-linclusion-socio-professionnelle-des-personnes-tre",
  "young-talents": "jeunes-talents"
};

const countryTranslations = {
  "United States": "États-Unis",
  "Korea": "Corée",
  "Uganda": "Ouganda",
  "Czech Republic": "République tchèque",
  "Hong Kong": "Hong Kong",
  "Malaysia": "Malaisie",
  "Thailand": "Thaïlande",
  "Mexico": "Mexique",
  "Switzerland": "Suisse",
  "Japan": "Japon",
  "Taiwan": "Taïwan",
  "China": "Chine",
  "France": "France",
  "Italy": "Italie",
  "England": "Angleterre",
  "Singapore": "Singapour"
};

const categoryTranslations = {
  "Precariousness": "Précarité",
  "Vocational training/craftsmanship": "Formation professionnelle/artisanat",
  "Social isolation": "Isolement social",
  "Organisational development": "Développement organisationnel",
  "Educators/trainers": "Éducateurs/formateurs"
};

const titleTranslations = {
  "Roll-out of local community markets and local food purchasing": "Déploiement de marchés communautaires locaux et d'achats alimentaires locaux",
  "Improving nutrition among vulnerable populations": "Améliorer la nutrition des populations vulnérables",
  "\"Wezesha Impact Skills & Enterprise (W.I.S.E)\" programme": "Programme « Wezesha Impact Skills & Enterprise (W.I.S.E) »",
  "Ensuring distribution of food aid and enhancement of food bank": "Assurer la distribution de l'aide alimentaire et l'amélioration de la banque alimentaire",
  "Food wanted not wasted": "Nourriture recherchée, pas gaspillée",
  "Food pack distribution for the \"Soup Kitchen\" programme": "Distribution de colis alimentaires pour le programme « Soup Kitchen »",
  "\"Food Rescue\" and \"Rescue Kitchen\" programmes": "Programmes « Food Rescue » et « Rescue Kitchen »",
  "Optimisation of food distribution and nutritional improvement for vulnerable populations": "Optimisation de la distribution alimentaire et amélioration nutritionnelle pour les populations vulnérables",
  "Formation jeunes (Youth training)": "Formation jeunes",
  "Enhancing food and rice distribution": "Renforcer la distribution de nourriture et de riz",
  "Long-term care programme for vulnerable elderly and disabled families in Eastern Taiwan": "Programme d'aide à long terme pour les familles vulnérables âgées et handicapées dans l'est de Taïwan",
  "Distribution of food parcels": "Distribution de colis alimentaires",
  "The \"Espace Clovis\" respite centre in Metz": "L'Espace Clovis à Metz - boutique solidarité",
  "Emergency shelter and accommodation programme": "Programme d'hébergement d'urgence",
  "One meal a day": "Un repas par jour",
  "Mirandolina's spring – Seniors on stage": "Le printemps Mirandolina – Les seniors en scène",
  "Food aid for disadvantaged families": "Aide alimentaire pour les familles défavorisées",
  "Funding weekend meals in November 2024 and 2025": "Financement des repas du weekend en novembre 2024 et 2025",
  "The Felix Project Kitchen Meals": "The Felix Project Kitchen Meals",
  "Social support drop-in centre": "Permanence d'accueil social",
  "Community Food Pack": "Community Food Pack",
  "Home food distribution to elderly and disabled people": "Distribution de nourriture à domicile pour les personnes âgées et handicapées",
  "A 10% increase in the distribution of hot meals to the most disadvantaged people in Paris": "Augmentation de 10% de la distribution de repas chauds aux plus démunis parisiens",
  "Working towards the socio-professional inclusion of people with significant barriers to employment by supporting the structuring of integration stakeholders within a collective": "Agir pour l'inclusion socio-professionnelle des personnes très éloignées de l'emploi en soutenant la structuration des acteurs de l'insertion au sein d'un collectif",
  "\"Teaching as Collective\" fellowship programme": "Programme de formation « Teaching as Collective »",
  "Trans'Faire: tomorrow, a job for everyone": "Trans'Faire : demain, un métier pour chacun",
  "Acceleration programme": "Programme d'accélération",
  "Support the scale-up of Teach For Italy to tackle education inequalities in Italy": "Soutenir l'expansion de Teach For Italy (TFI) pour lutter contre les inégalités éducatives en Italie",
  "Stabilise and scale: supporting Yojoa's activities to help vulnerable young people": "Stabiliser et grandir : soutenir les activités de Yojoa pour aider les jeunes vulnérables",
  "Introducing 5,200 secondary school pupils to manual trades": "Initier 5 200 jeunes aux métiers manuels dès le collège"
};

// Partner names generally stay the same (proper nouns)
const partnerTranslations = {};

// Apply translations to create French version
const frenchData = {
  markers: originalData.markers.map(marker => {
    // Translate category (handle multiple categories separated by |)
    let translatedCategory = marker.category;
    if (translatedCategory) {
      translatedCategory = translatedCategory.split(' | ').map(cat => {
        return categoryTranslations[cat.trim()] || cat.trim();
      }).join(' | ');
    }

    return {
      ...marker,
      country: countryTranslations[marker.country] || marker.country,
      title: titleTranslations[marker.title] || marker.title,
      category: translatedCategory,
      partner: partnerTranslations[marker.partner] || marker.partner,
      projectSlug: projectMapping[marker.projectSlug] || marker.projectSlug
    };
  })
};

// Write the French version to a new file
fs.writeFileSync('blocks/map-bien/markers-data-fr.json', JSON.stringify(frenchData, null, 2));

console.log('✅ French version created successfully!');
console.log(`📊 Total markers translated: ${frenchData.markers.length}`);

// Stats
let projectsTranslated = 0;
let countriesTranslated = 0;
let titlesTranslated = 0;
let categoriesTranslated = 0;

frenchData.markers.forEach(marker => {
  if (projectMapping[originalData.markers.find(orig => orig.imageId === marker.imageId)?.projectSlug]) {
    projectsTranslated++;
  }
  if (countryTranslations[originalData.markers.find(orig => orig.imageId === marker.imageId)?.country]) {
    countriesTranslated++;
  }
  if (titleTranslations[originalData.markers.find(orig => orig.imageId === marker.imageId)?.title]) {
    titlesTranslated++;
  }
  const origCategory = originalData.markers.find(orig => orig.imageId === marker.imageId)?.category;
  if (origCategory && origCategory.split(' | ').some(cat => categoryTranslations[cat.trim()])) {
    categoriesTranslated++;
  }
});

console.log(`🔄 Translation coverage:`);
console.log(`   Project slugs: ${projectsTranslated}/${frenchData.markers.length} (${Math.round(projectsTranslated/frenchData.markers.length*100)}%)`);
console.log(`   Countries: ${countriesTranslated}/${frenchData.markers.length} (${Math.round(countriesTranslated/frenchData.markers.length*100)}%)`);
console.log(`   Titles: ${titlesTranslated}/${frenchData.markers.length} (${Math.round(titlesTranslated/frenchData.markers.length*100)}%)`);
console.log(`   Categories: ${categoriesTranslated}/${frenchData.markers.length} (${Math.round(categoriesTranslated/frenchData.markers.length*100)}%)`);
