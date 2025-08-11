/* eslint-disable */
/* stylelint-disable */

// Function to detect current language from URL
function getCurrentLanguage() {
  const path = window.location.pathname;
  return path.includes('/fr/') ? 'fr' : 'en';
}

// Function to get language-appropriate URL
function getLocalizedUrl(projectSlug) {
  const language = getCurrentLanguage();
  
  // Mapping from English slugs to French slugs
  const projectMapping = {
    "implementing-an-organisational-development-action-plan": "mettre-en-oeuvre-un-plan-daction-de-developpement-organisa",
    "support-programme-for-biodiversity-ngos-working-in-developin": "programme-dappui-aux-ong-de-biodiversite-actives-dans-les-pa",
    "stepping-up-protection-for-a-thousand-hectares-of-forest-fra": "renforcement-de-la-protection-dun-millier-dhectares-de-fragm",
    "creating-a-forest-for-learning-iii": "creer-une-foret-pour-lapprentissage-iii",
    "resilience-and-adaptation-to-climate-change-in-the-sitatunga": "resilience-et-adaptation-au-changement-climatique-dans-la-va",
    "sustainable-protection-of-biodiversity-in-the-vaud-alps": "proteger-durablement-la-biodiversite-dans-les-alpes-vaudoise",
    "green-cashew-sustainable-cashew-cultivation-to-fight-climate": "green-cashew-culture-durable-de-la-noix-de-cajou-pour-lutter",
    "foretxcellence": "foretxcellence",
    "risoud-resonance-wood-learning-trail": "sentier-didactique-du-bois-de-resonance-du-risoud",
    "support-for-sustainable-development-through-the-conservation": "appui-au-developpement-durable-a-travers-la-conservation-et",
    "agroforestry-and-green-entrepreneurship": "agroforesterie-et-entrepreneuriat-vert",
    "sentier-de-la-morges-trail": "sentier-de-la-morges",
    "toile-verte": "toile-verte",
    "integrated-management-of-mangrove-landscape-in-the-douala-ed": "gestion-integree-des-paysages-de-mangroves-dans-le-parc-nati",
    "time-for-conservation-of-endemic-threatened-flora-in-cape-ve": "agir-maintenant-pour-la-preservation-de-la-flore-endemique-m",
    "improving-mediation-and-conservation": "amelioration-de-la-mediation-et-de-la-conservation",
    "supporting-the-reconstitution-of-forest-cover-through-agro-e": "appui-a-la-reconstitution-du-couvert-forestier-par-des-prati",
    "blue-forests": "forets-bleues",
    "reforestation-and-brazil-nuts": "reforestation-et-noix-du-bresil",
    "awareness-raising-and-environmental-education-for-young-peop": "sensibilisation-et-education-environnementale-de-jeunes-des",
    "agro-ecological-restoration-and-agroforestry-in-the-green-be": "restauration-agro-ecologique-et-agroforesterie-dans-la-ceint",
    "forest-restoration-and-preservation-on-the-island-of-flores": "restauration-et-preservation-des-forets-de-lile-de-flores-in",
    "mountain-farmers-and-savannah-pastoralists-conserving-sustai": "agriculteurs-de-montagne-et-eleveurs-de-la-savane-preserver",
    "sea-forest": "la-foret-de-la-mer",
    "save-the-pilat-forests": "sauvons-les-forets-du-pilat",
    "mikago": "mikago",
    "reception-infrastructure-at-the-parc-naturel-du-jorat": "infrastructures-daccueil-du-parc-naturel-du-jorat",
    "protection-de-la-foret-par-la-titularisation-fonciere-de-com": "protection-de-la-foret-par-la-titularisation-fonciere-de-com",
    "conservation-of-threatened-woody-species": "conservation-des-especes-ligneuses-menacees",
    "mpigi-forest-school": "lecole-de-la-foret-de-mpigi",
    "13": "13",
    "fruit-producing-edges-of-the-grandes-tattes-forest-14": "lisieres-fruitieres-de-la-foret-des-grandes-tattes-14",
    "reinforcing-the-traditional-medicinal-plant-culture-and-refo": "valorisation-du-savoir-traditionnel-sur-les-plantes-medicina",
    "reforestation-and-agroforestry-on-the-bateke-plateau": "reforestation-et-agroforesterie-sur-le-plateau-de-bateke",
    "supporting-local-communities-through-the-conservation-of-anc": "soutenir-les-communautes-locales-par-la-conservation-des-for",
    "improving-the-lives-of-rural-communities-through-the-plantin": "ameliorer-la-vie-des-communautes-rurales-par-la-plantation-d",
    "sustainable-mass-timber-construction-for-resilient-rural-eco": "constructions-durables-en-bois-de-charpente-pour-des-economi",
    "itombwe-forest-conservation": "conservation-de-la-foret-ditombwe",
    "empowering-ethnic-minority-women-for-sustainable-forest-mana": "autonomiser-les-femmes-de-minorites-ethniques-par-la-gestion",
    "integrated-forest-resource-management": "gestion-integree-des-ressources-forestieres",
    "ancestral-knowledge-preservation-conservation-and-cultivatio": "preservation-des-savoirs-ancestraux-conservation-et-culture",
    "creating-a-forest-for-learning-ii": "creer-une-foret-pour-lapprentissage-ii",
    "multipalms": "multipalms",
    "dundreggan-rewilding-centre": "dundreggan-rewilding-centre",
    "environmental-education-centres": "centres-deducation-environnementale",
    "support-for-traditional-mayan-agriculture-and-raising-awaren": "appui-a-lagriculture-traditionnelle-maya-et-sensibilisation",
    "afforestation-of-chambarak-and-ttujur-communities": "reforestation-par-les-communautes-chambarak-et-ttujur",
    "the-foresters-world": "univers-forestier",
    "stepping-up-protection-for-madagascars-largest-wild-populati": "renforcement-de-la-protection-de-la-plus-importante-populati",
    "landscape-and-biodiversity": "paysage-et-biodiversite",
    "preserver-les-dernieres-forets-seches-par-lagroforesterie": "preserver-les-dernieres-forets-seches-par-lagroforesterie"
  };
  
  if (language === 'fr') {
    const frenchSlug = projectMapping[projectSlug] || projectSlug;
    return `/fr/fondation-pour-les-arbres-nos-projets/${frenchSlug}`;
  } else {
    return `/en/fondation-pour-les-arbres-projects/${projectSlug}`;
  }
}

// Function to create InfoBox content with localized links
function createInfoBoxContent(imageId, imageName, partner, country, dateRange, title, category, projectSlug) {
  const language = getCurrentLanguage();
  const localizedUrl = getLocalizedUrl(projectSlug);
  
  // Country name translations
  const countryTranslations = {
    "Cape Verde": "Cap-Vert",
    "Multi-country": "Multi-pays",
    "Madagascar": "Madagascar",
    "England": "Angleterre",
    "Benin": "Bénin",
    "Switzerland": "Suisse",
    "Cambodia": "Cambodge",
    "Democratic Republic of the Congo (DRC)": "République démocratique du Congo (RDC)",
    "Togo": "Togo",
    "Cameroon": "Cameroun",
    "Tanzania": "Tanzanie",
    "Senegal": "Sénégal",
    "France": "France",
    "Peru": "Pérou",
    "Italy": "Italie",
    "Uganda": "Ouganda",
    "Brazil": "Brésil",
    "Tadjikistan": "Tadjikistan",
    "Malawi": "Malawi",
    "Vietnam": "Vietnam",
    "India": "Inde",
    "Scotland": "Écosse",
    "Benin | Ghana | Côte d'Ivoire": "Bénin | Ghana | Côte d'Ivoire",
    "Indonesia": "Indonésie",
    "Mexico": "Mexique",
    "Armenia": "Arménie",
    "Colombia": "Colombie",
    "Burkina Faso": "Burkina Faso"
  };
  
  // Category translations
  const categoryTranslations = {
    "Organisational development": "Développement organisationnel",
    "Conservation/restoration": "Conservation/restauration",
    "Awareness raising": "Sensibilisation",
    "Ancestral knowledge": "Savoirs ancestraux"
  };
  
  // Project title translations (for the projects in the map)
  const titleTranslations = {
    "Implementing an organisational development action plan": "Mettre en œuvre un plan d'action de développement organisationnel",
    "Support programme for biodiversity NGOs working in developing countries (ProBioDev)": "Programme d'appui aux ONG de biodiversité actives dans les pays en développement (ProBioDev)",
    "Stepping up protection for a thousand hectares of forest fragments housing the largest population of greater bamboo lemurs in the wild": "Renforcement de la protection d'un millier d'hectares de fragments forestiers abritant la plus importante population de grands hapalémurs sauvages",
    "Creating a forest for learning III": "Créer une forêt pour l'apprentissage III",
    "Resilience and adaptation to climate change in the Sitatunga Valley": "Résilience et adaptation au changement climatique dans la vallée du Sitatunga",
    "Sustainable protection of biodiversity in the Vaud Alps": "Protéger durablement la biodiversité dans les Alpes vaudoises",
    "Green Cashew - Sustainable cashew cultivation to fight climate change": "Green Cashew - Culture durable de la noix de cajou pour lutter contre le changement climatique",
    "Forêtxcellence": "Forêtxcellence",
    "Risoud resonance wood learning trail": "Sentier didactique du bois de résonance du Risoud",
    "Support for sustainable development through the conservation and enhancement of local biodiversity": "Appui au développement durable à travers la conservation et la valorisation de la biodiversité locale",
    "Agroforestry and green entrepreneurship": "Agroforesterie et entrepreneuriat vert",
    "Sentier de la Morges trail": "Sentier de la Morges",
    "Toile verte": "Toile verte",
    "Integrated management of mangrove landscapes in Douala-Edéa National Park": "Gestion intégrée des paysages de mangroves dans le Parc national de Douala-Edéa",
    "Time for conservation of endemic threatened flora in Cape Verde's islands": "Agir maintenant pour la préservation de la flore endémique menacée des îles du Cap-Vert",
    "Improving mediation and conservation": "Amélioration de la médiation et de la conservation",
    "Supporting the reconstitution of forest cover through agro-ecological practices": "Appui à la reconstitution du couvert forestier par des pratiques agro-écologiques",
    "Blue forests": "Forêts bleues",
    "Reforestation and Brazil nuts": "Reforestation et noix du Brésil",
    "Awareness raising and environmental education for young people in vocational schools and communities": "Sensibilisation et éducation environnementale de jeunes des écoles professionnelles et des communautés",
    "Agro-ecological restoration and agroforestry in the green belt of the city of Ouagadougou": "Restauration agro-écologique et agroforesterie dans la ceinture verte de la ville de Ouagadougou",
    "Forest restoration and preservation on the island of Flores, Indonesia": "Restauration et préservation des forêts de l'île de Florès, Indonésie",
    "Mountain farmers and savannah pastoralists: conserving sustainable livelihoods in East Africa": "Agriculteurs de montagne et éleveurs de la savane : préserver des moyens de subsistance durables en Afrique de l'Est",
    "Sea forest": "La forêt de la mer",
    "Save the Pilat forests": "Sauvons les forêts du Pilat",
    "MiKaGo": "MiKaGo",
    "Reception infrastructure at the Parc naturel du Jorat": "Infrastructures d'accueil du Parc naturel du Jorat",
    "Protection of the forest through the official establishment of indigenous communities": "Protection de la forêt par la titularisation foncière de communautés indigènes",
    "Conservation of threatened woody species": "Conservation des espèces ligneuses menacées",
    "Mpigi forest school": "L'école de la forêt de Mpigi",
    "": "", // Empty title case
    "Fruit-producing edges of the Grandes Tattes forest": "Lisières fruitières de la forêt des Grandes Tattes",
    "Reinforcing the traditional medicinal plant culture and reforestation of the Surui territory": "Valorisation du savoir traditionnel sur les plantes médicinales et reforestation du territoire Surui",
    "Reforestation and agroforestry on the Batéké plateau": "Reforestation et agroforesterie sur le plateau de Batéké",
    "Supporting local communities through the conservation of ancient fruit and nut forests": "Soutenir les communautés locales par la conservation des forêts anciennes de fruits et noix",
    "Improving the lives of rural communities through the planting of agroforestry groves and by adopting agro-ecological practices": "Améliorer la vie des communautés rurales par la plantation de bosquets agroforestiers et par l'adoption de pratiques agro-écologiques",
    "Sustainable mass timber construction for resilient rural economies": "Constructions durables en bois de charpente pour des économies rurales résilientes",
    "Itombwe forest conservation": "Conservation de la forêt d'Itombwe",
    "Empowering ethnic minority women through sustainable forest management in nature reserves": "Autonomiser les femmes de minorités ethniques par la gestion durable des forêts dans les réserves naturelles",
    "Integrated forest resource management": "Gestion intégrée des ressources forestières",
    "Ancestral knowledge preservation, conservation and cultivation of endangered medicinal and aromatic plants in the Himalayas": "Préservation des savoirs ancestraux, conservation et culture de plantes médicinales et aromatiques en danger dans l'Himalaya",
    "Creating a forest for learning II": "Créer une forêt pour l'apprentissage II",
    "Multipalms": "Multipalms",
    "Dundreggan Rewilding Centre": "Centre de réensauvagement de Dundreggan",
    "Environmental education centres": "Centres d'éducation environnementale",
    "Support for traditional Mayan agriculture and raising awareness of family nutrition": "Appui à l'agriculture traditionnelle maya et sensibilisation à la nutrition familiale",
    "Afforestation of Chambarak and Ttujur communities": "Reforestation par les communautés Chambarak et Ttujur",
    "The Forester's world": "L'univers du forestier",
    "Stepping up protection for Madagascar's largest wild population of greater bamboo lemurs": "Renforcement de la protection de la plus importante population sauvage de grands hapalémurs de Madagascar",
    "Landscape and biodiversity": "Paysage et biodiversité",
    "Preserving the last dry forests through agroforestry": "Préserver les dernières forêts sèches par l'agroforesterie"
  };
  
  // Partner name translations (some may stay the same)
  const partnerTranslations = {
    "Trees for Life": "Trees for Life",
    "The National Forest Company": "The National Forest Company",
    "Jardin Botanique de l'Université de Fribourg": "Jardin Botanique de l'Université de Fribourg"
    // Add more as needed - many will stay the same
  };
  
  // Translate content based on language
  let localizedCountry = country;
  let localizedTitle = title;
  let localizedCategory = category;
  let localizedPartner = partner;
  let seeMoreText = "→ See more";
  
  if (language === 'fr') {
    localizedCountry = countryTranslations[country] || country;
    localizedTitle = titleTranslations[title] || title;
    localizedPartner = partnerTranslations[partner] || partner;
    seeMoreText = "→ Voir en détail";
    
    // Translate category labels
    localizedCategory = category.split(' | ').map(cat => {
      return categoryTranslations[cat.trim()] || cat.trim();
    }).join(' | ');
  }
  
  return `<div class='myboxmap'><img src='https://content.da.live/audemars-piguet/arbres-fondationsaudemarspiguet/assets/images/map/projects-listing/${imageId}/${imageName}.jpg' width='220' height='144'><p class="carte_box_partenaires">${localizedPartner}</p><p class="carte_box_pays">${localizedCountry}</p><p class="carte_box_date">${dateRange}</p><p class="carte_box_titre">${localizedTitle}</p><p class="carte_box_categorie">${localizedCategory}</p><p class="carte_box_link"><a href=${localizedUrl}>${seeMoreText}</a></p></div>`;
}

var draggable=true;
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
if (isTouchDevice) {
   // draggable=false;
}

var map;
var markers = [];
var bounds;
var boundsswiss;
var markerCluster;
var infoWindows = []; 

async function initMap() {
    
var iconpointer = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: '#6B7E7C',
    fillOpacity: 1,
    strokeColor: '#6B7E7C',
    strokeWeight: 1,
    scale: 7 
};
    


var popupoption = {
       content: ''
      ,disableAutoPan: false
      ,maxWidth: 0
      ,pixelOffset: new google.maps.Size(-120, -20)
      ,zIndex: null
      ,boxStyle: { 
            opacity: 1
        ,width: "240px"
       }
       
      ,closeBoxMargin: "0px 0px 0px 0px"
                ,closeBoxURL: "/icons/btn_arbres_close.svg"
                
      ,infoBoxClearance: new google.maps.Size(1, 1)
      ,alignBottom: true
      ,isHidden: false
      ,pane: "floatPane"
      ,enableEventPropagation: false
    };




  // Load InfoBox script and wait for it to complete
  await new Promise((resolve, reject) => {
    if (window.InfoBox) {
      resolve(); // Already loaded
      return;
    }
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = '/blocks/map/infobox.js';
    s.setAttribute("nonce", "3b3df148715c7bed4d9747306613a38e");
    s.onload = resolve;
    s.onerror = reject;
    document.head.append(s);
  });
    
  bounds = new google.maps.LatLngBounds();

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 46.77448320376698, lng: 8.009033203125},
    //zoom: 9, // Zoom will be set dynamically after fitBounds
    mapId: '5c5cdb8a2b86055061abff98',
    draggable: draggable,
    scrollwheel: false,
    mapTypeControl: false, // Désactiver le contrôle du type de carte (plan/satellite)
    streetViewControl: false, // Désactiver le contrôle de Street View
    fullscreenControl: false,
    zoomControl: false,
    //minZoom: 3, 
   // maxZoom: 16,
    styles: audemarsmapstyles
  });
    
        var continents = [
        { name: 'North America', position: { lat: 40, lng: -100 } },
        { name: 'Latin America', position: { lat: -15, lng: -60 } },
        { name: 'Europe', position: { lat: 50, lng: 10 } },
        { name: 'Africa', position: { lat: 0, lng: 20 } },
        { name: 'Asia', position: { lat: 30, lng: 100 } },
        { name: 'Oceania', position: { lat: -20, lng: 140 } }
    ];

    // Ajout des marqueurs pour chaque continent
    continents.forEach(function(continent) {
        new google.maps.Marker({
            position: continent.position,
            map: map,
            label: {
                text: continent.name,
                color: '#6B7E7C',      
                fontSize: '20px',   
                fontFamily: 'Antarctica, sans-serif'
                
            },
            icon: {                    
            url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIHZpZXdCb3g9IjAgMCAxMCAxMCI+PHBhdGggZD0iTTEwIDBoLTkiIHdpZHRoPSI5IiBoZWlnaHQ9IjkiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZS1jYXRjaGluZz0ib3BhcXVldSIgLz48L3N2Zz4="
        }  // Aucune icône spécifiée pour que la définition par défaut s'applique
        });
    });

    
    


    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(1162, "img-0422", "Associa\u00e7\u00e3o Projecto Vit\u00f3", "Cape Verde", "2025 \u2192 2027", "Implementing an organisational development action plan", "Organisational development", "implementing-an-organisational-development-action-plan");

  infoWindows[99]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (14.902685483576084,-24.4936212786621);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 99,
  icon: iconpointer,
    category: "category_10 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("implementing-an-organisational-development-action-plan");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(855, "tompotanah-villages-c-blue-forests", "Comit\u00e9 fran\u00e7ais de l\u2019UICN", "Multi-country", "2025 \u2192 2027", "Support programme for biodiversity NGOs working in developing countries (ProBioDev)", "Conservation\/restoration | Awareness raising | Organisational development", "support-programme-for-biodiversity-ngos-working-in-developin");

  infoWindows[70]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (48.85445918664122,2.4176469555908264);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 70,
  icon: iconpointer,
    category: "category_3 category_4 category_10 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("support-programme-for-biodiversity-ngos-working-in-developin");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(861, "site-du-programme-bamboo-lemur-4-c-sebastien-meys", "Helpsimus (Association fran\u00e7aise pour la sauvegarde du grand hapal\u00e9mur)", "Madagascar", "2024 \u2192 2027", "Stepping up protection for a thousand hectares of forest fragments housing the largest population of greater bamboo lemurs in the wild", "Conservation\/restoration | Awareness raising", "stepping-up-protection-for-a-thousand-hectares-of-forest-fra");

  infoWindows[71]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (-21.176557816179585,47.574459623437505);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 71,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("stepping-up-protection-for-a-thousand-hectares-of-forest-fra");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(869, "petites-filles-1-c-darren-cresswell", "The National Forest Company", "England", "2024 \u2192 2027", "Creating a forest for learning III", "Awareness raising", "creating-a-forest-for-learning-iii");

  infoWindows[72]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (52.73671439092728,-1.5423235186523376);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 72,
  icon: iconpointer,
    category: "category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("creating-a-forest-for-learning-iii");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(811, "animation-classe-verte-2-c-credi-ong", "Centre R\u00e9gional de Recherche et d\u2019\u00c9ducation pour le D\u00e9veloppement Int\u00e9gr\u00e9 (CREDI-ONG)", "Benin", "2023 \u2192 2026", "Resilience and adaptation to climate change in the Sitatunga Valley", "Conservation\/restoration | Awareness raising", "resilience-and-adaptation-to-climate-change-in-the-sitatunga");

  infoWindows[15]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (6.6254021370220935,2.3562780133300842);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 15,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("resilience-and-adaptation-to-climate-change-in-the-sitatunga");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(159, "alpes-vivantes-1-c-alpes-vivantes", "Alpes vivantes", "Switzerland", "2023 \u2192 2026", "Sustainable protection of biodiversity in the Vaud Alps", "Conservation\/restoration | Awareness raising", "sustainable-protection-of-biodiversity-in-the-vaud-alps");

  infoWindows[5]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (46.31599933571462,7.057568143945319);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 5,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("sustainable-protection-of-biodiversity-in-the-vaud-alps");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(201, "beneficiaire-du-projet-cajou-cambodge-1-c-eper", "EPER", "Cambodia", "2023 \u2192 2026", "Green Cashew - Sustainable cashew cultivation to fight climate change", "Conservation\/restoration | Ancestral knowledge", "green-cashew-sustainable-cashew-cultivation-to-fight-climate");

  infoWindows[12]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (12.541337455583687,107.18078286562505);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 12,
  icon: iconpointer,
    category: "category_3 category_5 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("green-cashew-sustainable-cashew-cultivation-to-fight-climate");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(222, "foretxcellence-1-c-romain-blanc", "For\u00eatxcellence", "Switzerland", "2022 \u2192 2027", "For\u00eatxcellence", "Ancestral knowledge", "foretxcellence");

  infoWindows[16]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (47.05887503590964,6.9005408993774475);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 16,
  icon: iconpointer,
    category: "category_5 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("foretxcellence");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(827, "sentier-didactique-du-bois-de-resonance-du-risoud-4-c-associ", "Association Sentier didactique du bois de r\u00e9sonance du Risoud", "Switzerland", "2022 \u2192 2023", "Risoud resonance wood learning trail", "Awareness raising | Ancestral knowledge", "risoud-resonance-wood-learning-trail");

  infoWindows[67]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (46.606710680069476,6.229473661523444);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 67,
  icon: iconpointer,
    category: "category_4 category_5 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("risoud-resonance-wood-learning-trail");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(428, "ecotourisme-dobservation-des-bonobos-avec-mmt-dans-le-territ", "Mbou-Mon-Tour (MMT)", "Democratic Republic of the Congo (DRC)", "2022 \u2192 2024", "Support for sustainable development through the conservation and enhancement of local biodiversity", "Conservation\/restoration | Awareness raising", "support-for-sustainable-development-through-the-conservation");

  infoWindows[50]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (-1.9234361411993575,17.699886869531255);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 50,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("support-for-sustainable-development-through-the-conservation");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(234, "agou-kpolo-plot-c-morija", "Association Morija", "Togo", "2022 \u2192 2025", "Agroforestry and green entrepreneurship", "Conservation\/restoration | Awareness raising", "agroforestry-and-green-entrepreneurship");

  infoWindows[18]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (6.9606891717042565,0.6573453656250061);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 18,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("agroforestry-and-green-entrepreneurship");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(335, "sentier-de-la-morges-71-c-yves-burdet", "Association pour la sauvegarde de Morges (ASM)", "Switzerland", "2022 \u2192 2023", "Sentier de la Morges trail", "Awareness raising", "sentier-de-la-morges-trail");

  infoWindows[35]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (46.516727822257195,6.481794427972418);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 35,
  icon: iconpointer,
    category: "category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("sentier-de-la-morges-trail");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(258, "site-toile-verte-givrins-c-parc-jura-vaudois", "Association du Parc naturel r\u00e9gional Jura vaudois", "Switzerland", "2022 \u2192 2026", "Toile verte", "Conservation\/restoration | Awareness raising", "toile-verte");

  infoWindows[23]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (46.69249698268536,6.3405385724121155);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 23,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("toile-verte");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(303, "aide-7-c-aide", "Appui aux Initiatives de D\u00e9veloppement (AIDE)", "Cameroon", "2022 \u2192 2024", "Integrated management of mangrove landscapes in Douala-Ed\u00e9a National Park", "Conservation\/restoration | Awareness raising", "integrated-management-of-mangrove-landscape-in-the-douala-ed");

  infoWindows[29]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (3.9125631949334667,9.73891885195313);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 29,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("integrated-management-of-mangrove-landscape-in-the-douala-ed");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(274, "preservation-de-la-biodiversite-au-cap-vert-2-c-projecto-vit", "Associa\u00e7\u00e3o Projecto Vit\u00f3", "Cape Verde", "2022 \u2192 2025", "Time for conservation of endemic threatened flora in Cape Verde's islands", "Conservation\/restoration | Awareness raising", "time-for-conservation-of-endemic-threatened-flora-in-cape-ve");

  infoWindows[25]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (14.90269585153705,-24.4936212786621);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 25,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("time-for-conservation-of-endemic-threatened-flora-in-cape-ve");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(172, "arboretum-1-c-arboretum-national-du-vallon-de-laubonne", "Association de l\u2019Arboretum national du Vallon de l\u2019Aubonne", "Switzerland", "2022 \u2192 2026", "Improving mediation and conservation", "Awareness raising", "improving-mediation-and-conservation");

  infoWindows[7]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (46.51167763546902,6.366244863610846);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 7,
  icon: iconpointer,
    category: "category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("improving-mediation-and-conservation");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(155, "champ-daubergines-c-acpe", "Actions Communautaires pour la Protection de l\u2019Environnement (ACPE)", "Democratic Republic of the Congo (DRC)", "2022 \u2192 2025", "Supporting the reconstitution of forest cover through agro-ecological practices", "Conservation\/restoration", "supporting-the-reconstitution-of-forest-cover-through-agro-e");

  infoWindows[4]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (-4.583086856506642,15.162045072656255);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 4,
  icon: iconpointer,
    category: "category_3 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("supporting-the-reconstitution-of-forest-cover-through-agro-e");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(355, "belo-sur-mer-pecheuse-dans-une-barque-entouree-de-paletuvier", "Blue Ventures", "Madagascar", "2022 \u2192 2023", "Blue forests", "Conservation\/restoration | Awareness raising", "blue-forests");

  infoWindows[38]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (-20.749521620858758,44.03136880312496);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 38,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("blue-forests");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(316, "apprentissage-c-aquaverde", "Aquaverde", "Brazil", "2022 \u2192 2022", "Reforestation and Brazil nuts", "Conservation\/restoration", "reforestation-and-brazil-nuts");

  infoWindows[31]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (-11.004376596548237,-61.179202485937495);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 31,
  icon: iconpointer,
    category: "category_3 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("reforestation-and-brazil-nuts");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(301, "staff-technique-2-c-add", "Alternatives Durables pour le D\u00e9veloppement (ADD)", "Cameroon", "2022 \u2192 2023", "Awareness raising and environmental education for young people in vocational schools and communities", "Awareness raising", "awareness-raising-and-environmental-education-for-young-peop");

  infoWindows[28]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (3.4937283965298485,11.327129911523484);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 28,
  icon: iconpointer,
    category: "category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("awareness-raising-and-environmental-education-for-young-peop");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(150, "alcp-c-alcp", "Action Lutte Contre la Pauvret\u00e9 (ALCP)", "Burkina Faso", "2022 \u2192 2025", "Agro-ecological restoration and agroforestry in the green belt of the city of Ouagadougou", "Conservation\/restoration | Awareness raising", "agro-ecological-restoration-and-agroforestry-in-the-green-be");

  infoWindows[3]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (12.384448611097222,-1.5179476031249939);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 3,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("agro-ecological-restoration-and-agroforestry-in-the-green-be");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(181, "brulis-c-coeur-de-foret", "C\u0153ur de For\u00eat", "Indonesia", "2022 \u2192 2025", "Forest restoration and preservation on the island of Flores, Indonesia", "Conservation\/restoration | Awareness raising", "forest-restoration-and-preservation-on-the-island-of-flores");

  infoWindows[8]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (-8.617502106958613,121.1004606);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 8,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("forest-restoration-and-preservation-on-the-island-of-flores");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(244, "assemblee-feminine-de-conservation-des-habitats-c-istituto-o", "Istituto Oikos", "Tanzania", "2022 \u2192 2024", "Mountain farmers and savannah pastoralists: conserving sustainable livelihoods in East Africa", "Conservation\/restoration | Awareness raising", "mountain-farmers-and-savannah-pastoralists-conserving-sustai");

  infoWindows[21]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (-3.3309162453255636,36.68151528749996);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 21,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("mountain-farmers-and-savannah-pastoralists-conserving-sustai");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(406, "journee-de-plantation-avec-le-comite-mangrove-4-c-fama-reyan", "Alliance internationale pour la gestion de l\u2019eau de pluie (IRHA)", "Senegal", "2021 \u2192 2024", "Sea forest", "Conservation\/restoration | Awareness raising", "sea-forest");

  infoWindows[48]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (14.240602259753809,-16.63925497617187);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 48,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("sea-forest");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(454, "action-pedagogique-de-terrain-parcelle-de-veranne-le-mantel", "Robin du Bois", "France", "2021 \u2192 2023", "Save the Pilat forests", "Conservation\/restoration", "save-the-pilat-forests");

  infoWindows[56]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (45.51128729285539,4.711300443750006);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 56,
  icon: iconpointer,
    category: "category_3 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("save-the-pilat-forests");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(288, "les-femmes-de-la-cooperative-essodounissi-lavent-des-noix-de", "V\u00e9t\u00e9rinaires Sans Fronti\u00e8res Suisse (VSF-Suisse)", "Togo", "2021 \u2192 2024", "MiKaGo", "Conservation\/restoration | Awareness raising | Ancestral knowledge", "mikago");

  infoWindows[27]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (8.482061487647467,0.9896817914062561);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 27,
  icon: iconpointer,
    category: "category_3 category_4 category_5 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("mikago");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(269, "parc-naturel-du-jorat-2-c-raphael-dupertuis", "Parc naturel du Jorat", "Switzerland", "2021 \u2192 2025", "Reception infrastructure at the Parc naturel du Jorat", "Awareness raising", "reception-infrastructure-at-the-parc-naturel-du-jorat");

  infoWindows[24]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (46.57267667663095,6.675793241601569);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 24,
  icon: iconpointer,
    category: "category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("reception-infrastructure-at-the-parc-naturel-du-jorat");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(239, "assemblee-c-nouvelle-planete", "Nouvelle Plan\u00e8te", "Peru", "2021 \u2192 2024", "Protection of the forest through the official establishment of indigenous communities", "Conservation\/restoration", "protection-de-la-foret-par-la-titularisation-fonciere-de-com");

  infoWindows[20]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (-9.121577297887972,-74.05929892148437);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 20,
  icon: iconpointer,
    category: "category_3 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("protection-de-la-foret-par-la-titularisation-fonciere-de-com");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(422, "fleur-de-p-greuteri-3-c-alessandro-s-gristina", "Jardin Botanique de l\u2019Universit\u00e9 de Fribourg", "Italy", "2021 \u2192 2024", "Conservation of threatened woody species", "Conservation\/restoration | Awareness raising", "conservation-of-threatened-woody-species");

  infoWindows[49]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (38.001176887326,12.837406705957036);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 49,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("conservation-of-threatened-woody-species");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(346, "autorite-nationale-de-reglementation-pharmaceutique-c-promet", "Fondation Biovision", "Uganda", "2021 \u2192 2024", "Mpigi forest school", "Conservation\/restoration | Awareness raising | Ancestral knowledge", "mpigi-forest-school");

  infoWindows[36]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (0.22334242022110062,32.326466154199224);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 36,
  icon: iconpointer,
    category: "category_3 category_4 category_5 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("mpigi-forest-school");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(207, "mosaique-de-petits-milieux-secs-et-humides-crassier-c-esep", "Association des Amis de l\u2019ESEP (\u00c9tablissement scolaire Elisabeth de Portes)", "Switzerland", "2021 \u2192 2027", "", "Conservation\/restoration | Awareness raising", "13");

  infoWindows[13]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (46.379031187688376,6.171913456063849);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 13,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("13");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(210, "biche-burtigny-c-open-mind", "Commune de Burtigny", "Switzerland", "2021 \u2192 2024", "Fruit-producing edges of the Grandes Tattes forest", "Conservation\/restoration", "fruit-producing-edges-of-the-grandes-tattes-forest-14");

  infoWindows[14]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (46.46778623607813,6.258226942163092);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 14,
  icon: iconpointer,
    category: "category_3 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("fruit-producing-edges-of-the-grandes-tattes-forest-14");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(309, "pepiniere-1-c-ubiratan-g-surui", "Aquaverde", "Brazil", "2021 \u2192 2022", "Reinforcing the traditional medicinal plant culture and reforestation of the Surui territory", "Conservation\/restoration | Ancestral knowledge", "reinforcing-the-traditional-medicinal-plant-culture-and-refo");

  infoWindows[30]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (-28.138443394923552,-54.45968954648437);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 30,
  icon: iconpointer,
    category: "category_3 category_5 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("reinforcing-the-traditional-medicinal-plant-culture-and-refo");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(462, "reforestation-et-agroforesterie-sur-le-plateau-de-bateke-4-c", "Secodev", "Democratic Republic of the Congo (DRC)", "2021 \u2192 2023", "Reforestation and agroforestry on the Bat\u00e9k\u00e9 plateau", "Conservation\/restoration | Awareness raising", "reforestation-and-agroforestry-on-the-bateke-plateau");

  infoWindows[57]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (-4.124363138066986,15.72372109804688);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 57,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("reforestation-and-agroforestry-on-the-bateke-plateau");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(383, "arbres-adultes-a-dashtijum-c-fauna-flora-international", "Fauna & Flora International (FFI)", "Tadjikistan", "2020 \u2192 2024", "Supporting local communities through the conservation of ancient fruit and nut forests", "Conservation\/restoration", "supporting-local-communities-through-the-conservation-of-anc");

  infoWindows[43]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (37.63395496487682,70.08819253359376);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 43,
  icon: iconpointer,
    category: "category_3 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("supporting-local-communities-through-the-conservation-of-anc");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(402, "clapiers-de-lapins-c-inter-aide", "Inter Aide", "Malawi", "2020 \u2192 2024", "Improving the lives of rural communities through the planting of agroforestry groves and by adopting agro-ecological practices", "Conservation\/restoration | Awareness raising", "improving-the-lives-of-rural-communities-through-the-plantin");

  infoWindows[47]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (-14.023175094263374,33.759152006250005);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 47,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("improving-the-lives-of-rural-communities-through-the-plantin");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(374, "femme-plantant-un-arbre-1-c-fairventures", "Fairventures Worldwide", "Uganda", "2020 \u2192 2023", "Sustainable mass timber construction for resilient rural economies", "Conservation\/restoration", "sustainable-mass-timber-construction-for-resilient-rural-eco");

  infoWindows[41]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (1.1577887202339086,31.784359525781216);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 41,
  icon: iconpointer,
    category: "category_3 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("sustainable-mass-timber-construction-for-resilient-rural-eco");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(396, "arbre-indigene-plante-dans-une-zone-deboisee-2-c-igh", "Itombwe G\u00e9n\u00e9ration pour l\u2019Humanit\u00e9 (IGH)", "Democratic Republic of the Congo (DRC)", "2020 \u2192 2023", "Itombwe forest conservation", "Conservation\/restoration | Awareness raising", "itombwe-forest-conservation");

  infoWindows[46]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (-3.572176858726391,28.606564115625005);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 46,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("itombwe-forest-conservation");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(228, "madame-bien-village-de-bam-c-gret", "Gret", "Vietnam", "2020 \u2192 2024", "Empowering ethnic minority women through sustainable forest management in nature reserves", "Conservation\/restoration | Awareness raising", "empowering-ethnic-minority-women-for-sustainable-forest-mana");

  infoWindows[17]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (20.463214410750734,105.20822198305665);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 17,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("empowering-ethnic-minority-women-for-sustainable-forest-mana");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(368, "communaute-locale-2-c-experts-solidaires", "Experts-Solidaires", "Benin", "2020 \u2192 2022", "Integrated forest resource management", "Conservation\/restoration | Awareness raising", "integrated-forest-resource-management");

  infoWindows[40]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (7.967619048184017,2.2400632611328186);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 40,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("integrated-forest-resource-management");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(438, "plantation-2-c-pragya", "Pragya", "India", "2020 \u2192 2024", "Ancestral knowledge preservation, conservation and cultivation of endangered medicinal and aromatic plants in the Himalayas", "Conservation\/restoration | Awareness raising | Ancestral knowledge", "ancestral-knowledge-preservation-conservation-and-cultivatio");

  infoWindows[53]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (32.554202411153724,76.12517983828126);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 53,
  icon: iconpointer,
    category: "category_3 category_4 category_5 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("ancestral-knowledge-preservation-conservation-and-cultivatio");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(280, "apprentissage-c-darren-cresswell", "The National Forest Company", "England", "2020 \u2192 2024", "Creating a forest for learning II", "Awareness raising", "creating-a-forest-for-learning-ii");

  infoWindows[26]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (52.736844312334966,-1.5430101641601501);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 26,
  icon: iconpointer,
    category: "category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("creating-a-forest-for-learning-ii");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(188, "creation-de-meuble-en-r-vinifera-c-didier-roguet", "Conservatoire et Jardin botaniques de la Ville de Gen\u00e8ve (CJBG)", "Benin | Ghana | C\u00f4te d\u2019Ivoire", "2020 \u2192 2027", "Multipalms", "Conservation\/restoration | Awareness raising", "multipalms");

  infoWindows[10]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (6.4260302562071105,2.332760404687506);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 10,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("multipalms");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(480, "dundreggan-rewilding-centre-c-paul-campbell-photography", "Trees for Life", "Scotland", "2020 \u2192 2023", "Dundreggan Rewilding Centre", "Awareness raising | Ancestral knowledge", "dundreggan-rewilding-centre");

  infoWindows[60]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (57.19217530540564,-4.764160800833124);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 60,
  icon: iconpointer,
    category: "category_4 category_5 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("dundreggan-rewilding-centre");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(433, "classe-dapprentissage-orangutan-haven-c-paneco", "Fondation PanEco", "Indonesia", "2020 \u2192 2023", "Environmental education centres", "Conservation\/restoration | Awareness raising", "environmental-education-centres");

  infoWindows[52]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (3.524569509450483,98.18778664980474);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 52,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("environmental-education-centres");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(322, "construction-2-c-arutam", "Arutam Z\u00e9ro D\u00e9forestation", "Mexico", "2020 \u2192 2022", "Support for traditional Mayan agriculture and raising awareness of family nutrition", "Conservation\/restoration | Awareness raising | Ancestral knowledge", "support-for-traditional-mayan-agriculture-and-raising-awaren");

  infoWindows[32]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (20.78453404669676,-88.02017538632812);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 32,
  icon: iconpointer,
    category: "category_3 category_4 category_5 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("support-for-traditional-mayan-agriculture-and-raising-awaren");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(467, "abreuvoirs-pour-les-animaux-c-shen", "SHEN", "Armenia", "2019 \u2192 2023", "Afforestation of Chambarak and Ttujur communities", "Conservation\/restoration | Awareness raising", "afforestation-of-chambarak-and-ttujur-communities");

  infoWindows[58]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (40.57133613137613,44.45846230898438);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 58,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("afforestation-of-chambarak-and-ttujur-communities");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(472, "ecole-a-ciel-ouvert-1-c-gabriela-furer-silviva", "Fondation Silviva", "Switzerland", "2019 \u2192 2022", "The Forester\u2019s world", "Awareness raising", "the-foresters-world");

  infoWindows[59]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (47.133349901575436,7.245091434460265);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 59,
  icon: iconpointer,
    category: "category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("the-foresters-world");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(823, "grand-hapalemur-4-c-sebastien-meys", "Helpsimus (Association fran\u00e7aise pour la sauvegarde du grand hapal\u00e9mur)", "Madagascar", "2019 \u2192 2023", "Stepping up protection for Madagascar\u2019s largest wild population of greater bamboo lemurs", "Conservation\/restoration | Awareness raising", "stepping-up-protection-for-madagascars-largest-wild-populati");

  infoWindows[45]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (-21.177838365615315,47.56845147524407);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 45,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("stepping-up-protection-for-madagascars-largest-wild-populati");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(447, "grand-milieu-sec-c-reseau-ecologique-la-frontiere", "R\u00e9seau \u00e9cologique La Fronti\u00e8re", "Switzerland", "2019 \u2192 2022", "Landscape and biodiversity", "Conservation\/restoration | Awareness raising", "landscape-and-biodiversity");

  infoWindows[55]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (46.410530954566774,6.17188126955567);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 55,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("landscape-and-biodiversity");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  var myOptions = popupoption;
  myOptions.content=createInfoBoxContent(193, "biodiversite-1-c-daisy-tarrier", "Envol Vert", "Colombia", "2019 \u2192 2025", "Preserving the last dry forests through agroforestry", "Conservation\/restoration | Awareness raising", "preserver-les-dernieres-forets-seches-par-lagroforesterie");

  infoWindows[11]= new InfoBox(myOptions);

  var markerLatLng= new google.maps.LatLng (10.62918702242603,-75.22380678739017);
  var marker = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    cursor: 'default',
    item: 11,
  icon: iconpointer,
    category: "category_3 category_4 "
  });

     marker.addListener('mouseout', function() {
  });
  
  if(!isTouchDevice){
    
   marker.addListener('mouseover', function() {
    $.each(infoWindows, function(key, elem){
      if(elem){
    elem.close();
      }
    });
    infoWindows[this.item].open(map, this);
    });  
    
   marker.addListener('click', function() {
   window.location.href = getLocalizedUrl("preserver-les-dernieres-forets-seches-par-lagroforesterie");
     
  });
  } else {
    
    
  marker.addListener('click', function() {
    
  $.each(infoWindows, function(key, elem){
    if(elem){
  elem.close();
    }
  });
    infoWindows[this.item].open(map, this);
  
  });  
    
    
  }


  markers.push(marker);
  bounds.extend(markerLatLng);
    
  
  
   markerCluster = new MarkerClusterer(map, markers, {
            imagePath: '/assets/images/',
            styles:[
                {
                    url: 'https://content.da.live/audemars-piguet/arbres-fondationsaudemarspiguet/assets/images/closter1.png',
                    width: 56,
                    height: 56,
                    textColor: '#ffffff',
                    textSize: 12
                }
            ]
        });

        map.fitBounds(bounds);
        
        // Hide map initially to prevent seeing zoom transition
        document.getElementById('map').style.opacity = '0';
        
        // Use timeout to ensure map is fully loaded before showing
        setTimeout(() => {
            
            // Show map after it's fully loaded
            document.getElementById('map').style.opacity = '1';
            document.getElementById('map').style.transition = 'opacity 0.3s ease-in';
        }, 500);
       //$(window).trigger("resize");
      //google.maps.event.addDomListener(window,"resize",function(){ google.maps.event.trigger(map,"resize"); map.fitBounds(bounds, {bottom:1, left:1, right:1, top:99});});
    
    
   // Crée les boutons de zoom personnalisés
      var zoomInButton = document.createElement('div');
      zoomInButton.className = 'custom-zoom-button';
      zoomInButton.id = 'zoom-in';
      zoomInButton.innerHTML = '<img src="/icons/btn_arbres_plus.svg" alt="Zoom In" style="width: 24px; height: 24px;">';
      zoomInButton.title = 'Zoom In';
      document.getElementById('map').appendChild(zoomInButton);

      var zoomOutButton = document.createElement('div');
      zoomOutButton.className = 'custom-zoom-button';
      zoomOutButton.id = 'zoom-out';
      zoomOutButton.innerHTML = '<img src="/icons/btn_arbres_moins.svg" alt="Zoom Out" style="width: 24px; height: 24px;">';
      zoomOutButton.title = 'Zoom Out';
      document.getElementById('map').appendChild(zoomOutButton);

      // Ajoute des écouteurs d'événements pour les boutons de zoom
      zoomInButton.addEventListener('click', function() {
        console.log('Zoom In clicked - Current zoom:', map.getZoom());
        map.setZoom(map.getZoom() + 1);
        console.log('Zoom In clicked - New zoom:', map.getZoom());
      });

      zoomOutButton.addEventListener('click', function() {
        console.log('Zoom Out clicked - Current zoom:', map.getZoom());
        map.setZoom(map.getZoom() - 1);
        console.log('Zoom Out clicked - New zoom:', map.getZoom());
      });  
    
    
    
    
}
 
document.addEventListener('DOMContentLoaded', function(){
        
        // Debug: Check if category links exist
        setTimeout(() => {
            const categoryLinks = document.querySelectorAll('a.works_categorylink');
            console.log('Found category links:', categoryLinks.length);
            categoryLinks.forEach((link, index) => {
                console.log(`Link ${index}:`, link, 'data-categoryid:', link.getAttribute('data-categoryid'));
            });
            
            if (categoryLinks.length === 0) {
                console.log('No category links found! Checking for cards...');
                const cards = document.querySelectorAll('.cards.map-category');
                console.log('Found map-category cards:', cards.length);
                const allAnchors = document.querySelectorAll('.cards.map-category a');
                console.log('Found anchors in map-category cards:', allAnchors.length);
            }
        }, 2000); // Wait 2 seconds for cards to load

         $(document).on("click", "a.works_categorylink", function(e){
        console.log('jQuery: Category link clicked!', this);
        e.preventDefault();
        // Let event bubble normally

        var myslectcat=$(this).data('categoryid');
        console.log('Selected category:', myslectcat);

        $('a.works_categorylink').removeClass("active");
        $(this).addClass("active");
        console.log('Active class updated');

        bounds = new google.maps.LatLngBounds();
        markerstocluster = [];
        markerCluster.clearMarkers();
             
       // Fermer toutes les popups ouvertes
        $.each(infoWindows, function(key, elem) {
            if (elem) {
                elem.close();
            }
        });         

        $.each(markers, function(key, marker){
        var catmarkers=marker.category;

        if(myslectcat=="all"){
                marker.setMap(map);
                markerstocluster.push(marker);
                   bounds.extend(marker.position);
        } else {


            if(catmarkers.search(myslectcat) != -1 ){ 
                marker.setMap(map);
                markerstocluster.push(marker);
                    bounds.extend(marker.position);
            }else{
                marker.setMap(null);
            }
        }

        });
        markerCluster.addMarkers(markerstocluster);
         map.fitBounds(bounds);
               

        }); 

        // Alternative vanilla JS event handler in case jQuery doesn't work
        document.addEventListener('click', function(e) {
            console.log('Document click detected on:', e.target);
            
            // Check for various possible targets
            const clickedAnchor = e.target.closest('a.works_categorylink') || 
                                 e.target.closest('a[data-categoryid]') ||
                                 (e.target.tagName === 'A' && e.target.classList.contains('works_categorylink'));
            
            if (clickedAnchor) {
                console.log('Vanilla JS: Category link clicked!', clickedAnchor);
                e.preventDefault();
                // Don't stop propagation - we want this to work
                
                const clickedLink = clickedAnchor; // Use the found anchor
                const myslectcat = clickedLink.getAttribute('data-categoryid');
                console.log('Vanilla JS: Selected category:', myslectcat);
                
                // Remove active class from all
                document.querySelectorAll('a.works_categorylink').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to clicked
                clickedLink.classList.add('active');
                console.log('Vanilla JS: Active class updated');
                
                // Trigger the same map filtering logic
                if (window.map && window.markers && window.markerCluster) {
                    bounds = new google.maps.LatLngBounds();
                    markerstocluster = [];
                    markerCluster.clearMarkers();
                         
                   // Close all open popups
                    infoWindows.forEach(function(elem) {
                        if (elem) {
                            elem.close();
                        }
                    });         

                    markers.forEach(function(marker){
                        var catmarkers = marker.category;

                        if(myslectcat == "all"){
                            marker.setMap(map);
                            markerstocluster.push(marker);
                            bounds.extend(marker.position);
                        } else {
                            if(catmarkers.search(myslectcat) != -1 ){ 
                                marker.setMap(map);
                                markerstocluster.push(marker);
                                bounds.extend(marker.position);
                            } else {
                                marker.setMap(null);
                            }
                        }
                    });
                    markerCluster.addMarkers(markerstocluster);
                    map.fitBounds(bounds);
                    console.log('Vanilla JS: Map filtering completed');
                }
            }
        });

});