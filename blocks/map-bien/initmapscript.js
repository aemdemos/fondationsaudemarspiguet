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
  
  if (language === 'fr') {
    const frenchSlug = projectMapping[projectSlug] || projectSlug;
    return `/fr/fondation-pour-le-bien-commun-nos-projets/${frenchSlug}`;
  } else {
    return `/en/fondation-pour-le-bien-commun-projects/${projectSlug}`;
  }
}

// Function to create InfoBox content with localized links
function createInfoBoxContent(imageId, imageName, partner, country, dateRange, title, category, projectSlug) {
  const language = getCurrentLanguage();
  const localizedUrl = getLocalizedUrl(projectSlug);
  
  // Country name translations
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
  
  // Category translations
  const categoryTranslations = {
    "Precariousness": "Précarité",
    "Vocational training/craftsmanship": "Formation professionnelle/artisanat",
    "Social isolation": "Isolement social",
    "Organisational development": "Développement organisationnel",
    "Educators/trainers": "Éducateurs/formateurs"
  };
  
  // Project title translations (for the projects in the map)
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
  
  // Partner name translations (most partner names stay the same as they are proper nouns)
  const partnerTranslations = {
    // Most partner organizations keep their original names in both languages
    // Add specific translations here only if needed
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
  
  return `<div class='myboxmap'><img src='https://content.da.live/audemars-piguet/biencommun-fondationsaudemarspiguet/assets/images/map/projects-listing/${imageId}/${imageName}.jpg' width='220' height='144'><p class="carte_box_partenaires">${localizedPartner}</p><p class="carte_box_pays">${localizedCountry}</p><p class="carte_box_date">${dateRange}</p><p class="carte_box_titre">${localizedTitle}</p><p class="carte_box_categorie">${localizedCategory}</p><p class="carte_box_link"><a href=${localizedUrl}>${seeMoreText}</a></p></div>`;
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
    fillColor: 'rgba(114, 98, 72, 0.85)',
    fillOpacity: 1,
    strokeColor: 'rgba(114, 98, 72, 0.85)',
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
                ,closeBoxURL: "/icons/btn_bien_close.svg"
                
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
    s.src = '/blocks/map-bien/infobox.js';
    s.setAttribute("nonce", "3b3df148715c7bed4d9747306613a38e");
    s.onload = resolve;
    s.onerror = reject;
    document.head.append(s);
  });
    
  bounds = new google.maps.LatLngBounds();

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 30, lng: 8.009033203125},
    zoom: 2.35, // Fine-tuned zoom level for optimal view
    mapId: '5c5cdb8a2b86055061abff98',
    draggable: draggable,
    scrollwheel: false,
    mapTypeControl: false, // Désactiver le contrôle du type de carte (plan/satellite)
    streetViewControl: false, // Désactiver le contrôle de Street View
    fullscreenControl: false,
    zoomControl: false,
    minZoom: 2, 
    maxZoom: 16,
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
  myOptions.content=createInfoBoxContent(1193, "aston-park-towers-c-manna-foodbank", "MANNA FoodBank", "United States", "2025 → 2028", "Roll-out of local community markets and local food purchasing", "Precariousness", "roll-out-of-local-community-markets-and-local-food-purchasin");
  
    infoWindows[102]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (35.41737575558752,-82.549863744635);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 102,
    icon: iconpointer,
      category: "category_12 "
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
     window.location.href = getLocalizedUrl("roll-out-of-local-community-markets-and-local-food-purchasin");
       
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
  myOptions.content=createInfoBoxContent(1171, "kfb-1-c-korea-foodbank", "Korea Foodbank", "Korea", "2025 → 2027", "Improving nutrition among vulnerable populations", "Precariousness", "improving-nutrition-among-vulnerable-populations");
  
    infoWindows[100]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (37.54226410840743,126.94786937151486);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 100,
    icon: iconpointer,
      category: "category_12 "
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
     window.location.href = getLocalizedUrl("improving-nutrition-among-vulnerable-populations");
       
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
  myOptions.content=createInfoBoxContent(1152, "msa-1276", "Wezesha Impact", "Uganda", "2025 → 2028", "\"Wezesha Impact Skills & Enterprise (W.I.S.E)\" programme", "Vocational training/craftsmanship", "wezesha-impact-skills-enterprise-wise-programme");
  
    infoWindows[98]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (0.3006482343676056,32.557109307389794);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 98,
    icon: iconpointer,
      category: "category_9 "
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
     window.location.href = getLocalizedUrl("wezesha-impact-skills-enterprise-wise-programme");
       
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
  myOptions.content=createInfoBoxContent(1132, "potravinove-banky-19-c-potravinove-banky", "Česká federace potravinových bank (Czech Federation of Food Banks)", "Czech Republic", "2025 → 2027", "Ensuring distribution of food aid and enhancement of food bank", "Precariousness", "ensuring-distribution-of-food-aid-and-enhancement-of-food-ba");
  
    infoWindows[95]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (50.06291811401479,14.594677399736028);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 95,
    icon: iconpointer,
      category: "category_12 "
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
     window.location.href = getLocalizedUrl("ensuring-distribution-of-food-aid-and-enhancement-of-food-ba");
       
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
  myOptions.content=createInfoBoxContent(1114, "feeding-hong-kong-c-feeding-hong-kong", "Feeding Hong Kong (FHK)", "Hong Kong", "2025 → 2027", "Food wanted not wasted", "Precariousness", "food-wanted-not-wasted");
  
    infoWindows[93]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (22.29534743633387,114.23488930974541);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 93,
    icon: iconpointer,
      category: "category_12 "
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
     window.location.href = getLocalizedUrl("food-wanted-not-wasted");
       
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
  myOptions.content=createInfoBoxContent(1104, "ksk-1-c-kechara-soup-kitchen-society", "Kechara Soup Kitchen Society (KSK Society)", "Malaysia", "2025 → 2027", "Food pack distribution for the \"Soup Kitchen\" programme", "Precariousness", "food-pack-distribution-for-the-soup-kitchen-programme");
  
    infoWindows[92]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (3.145101943841166,101.71534479771195);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 92,
    icon: iconpointer,
      category: "category_12 "
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
     window.location.href = getLocalizedUrl("food-pack-distribution-for-the-soup-kitchen-programme");
       
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
  myOptions.content=createInfoBoxContent(1089, "sos-1-c-lauren-de-cicca-the-global-foodbanking-network", "Scholars of Sustenance (SOS)", "Thailand", "2025 → 2027", "\"Food Rescue\" and \"Rescue Kitchen\" programmes", "Precariousness", "food-rescue-and-rescue-kitchen-programmes");
  
    infoWindows[91]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (13.757386303875185,100.50904275093613);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 91,
    icon: iconpointer,
      category: "category_12 "
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
     window.location.href = getLocalizedUrl("food-rescue-and-rescue-kitchen-programmes");
       
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
  myOptions.content=createInfoBoxContent(1074, "alimento-para-todos-2-c-alimento-para-todos", "Alimento Para Todos", "Mexico", "2025 → 2027", "Optimisation of food distribution and nutritional improvement for vulnerable populations", "Precariousness", "optimisation-of-food-distribution-and-nutritional-improvemen");
  
    infoWindows[89]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (19.381792571600283,-99.08801047887268);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 89,
    icon: iconpointer,
      category: "category_12 "
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
     window.location.href = getLocalizedUrl("optimisation-of-food-distribution-and-nutritional-improvemen");
       
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
  myOptions.content=createInfoBoxContent(1024, "menuiserie-c-jean-michel-etchemaite", "Caritas Genève", "Switzerland", "2025 → 2027", "Formation jeunes (Youth training)", "Vocational training/craftsmanship", "formation-jeunes-youth-training");
  
    infoWindows[87]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (46.193484923122924,6.143987636905295);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 87,
    icon: iconpointer,
      category: "category_9 "
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
     window.location.href = getLocalizedUrl("formation-jeunes-youth-training");
       
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
  myOptions.content=createInfoBoxContent(955, "cooking-bento-box-c-2hj", "Second Harvest Japan (2HJ)", "Japan", "2025 → 2027", "Enhancing food and rice distribution", "Precariousness", "enhancing-food-and-rice-distribution");
  
    infoWindows[80]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (35.69790136723541,139.78087560449185);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 80,
    icon: iconpointer,
      category: "category_12 "
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
     window.location.href = getLocalizedUrl("enhancing-food-and-rice-distribution");
       
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
  myOptions.content=createInfoBoxContent(972, "service-de-livraison-2-c-mennonite-social-welfare-foundation", "Mennonite Social Welfare Foundation", "Taiwan", "2025 → 2027", "Long-term care programme for vulnerable elderly and disabled families in Eastern Taiwan", "Precariousness", "long-term-care-programme-for-vulnerable-elderly-and-disabled");
  
    infoWindows[82]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (23.983302801883127,121.62203760061799);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 82,
    icon: iconpointer,
      category: "category_12 "
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
     window.location.href = getLocalizedUrl("long-term-care-programme-for-vulnerable-elderly-and-disabled");
       
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
  myOptions.content=createInfoBoxContent(982, "gfb-7-c-green-food-bank", "Green Food Bank", "China", "2024 → 2027", "Distribution of food parcels", "Precariousness", "distribution-of-food-parcels");
  
    infoWindows[83]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (31.240931028263,121.43650383863984);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 83,
    icon: iconpointer,
      category: "category_12 "
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
     window.location.href = getLocalizedUrl("distribution-of-food-parcels");
       
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
  myOptions.content=createInfoBoxContent(1064, "espace-clovis-metz-8-c-yann-levy-agence-43mm", "Fondation pour le Logement des Défavorisés", "France", "2024 → 2025", "The \"Espace Clovis\" respite centre in Metz", "Precariousness", "the-espace-clovis-respite-centre-in-metz");
  
    infoWindows[88]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (49.10680419653208,6.170623313527686);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 88,
    icon: iconpointer,
      category: "category_12 "
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
     window.location.href = getLocalizedUrl("the-espace-clovis-respite-centre-in-metz");
       
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
  myOptions.content=createInfoBoxContent(992, "accommodation-1-c-impacthk", "ImpactHK", "Hong Kong", "2024 → 2026", "Emergency shelter and accommodation programme", "Precariousness", "emergency-shelter-and-accommodation-programme");
  
    infoWindows[84]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (22.323562625116203,114.16248978291092);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 84,
    icon: iconpointer,
      category: "category_12 "
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
     window.location.href = getLocalizedUrl("emergency-shelter-and-accommodation-programme");
       
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
  myOptions.content=createInfoBoxContent(966, "osf-3-c-isabella-balena-osf", "Opera San Francesco per i Poveri (OSF)", "Italy", "2024 → 2026", "One meal a day", "Precariousness", "one-meal-a-day");
  
    infoWindows[81]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (45.46850808027905,9.207569222789388);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 81,
    icon: iconpointer,
      category: "category_12 "
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
     window.location.href = getLocalizedUrl("one-meal-a-day");
       
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
  myOptions.content=createInfoBoxContent(1000, "mirandolina-c-pascal-victor", "Fondation Théâtre de Carouge", "Switzerland", "2024 → 2025", "Mirandolina's spring – Seniors on stage", "Social isolation", "mirandolinas-spring-seniors-on-stage");
  
    infoWindows[85]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (46.18127395511273,6.142001461129767);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 85,
    icon: iconpointer,
      category: "category_13 "
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
     window.location.href = getLocalizedUrl("mirandolinas-spring-seniors-on-stage");
       
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
  myOptions.content=createInfoBoxContent(935, "tpfba-1-c-taiwan-peoples-food-bank-association", "Taiwan People's Food Bank Association (TPFBA)", "Taiwan", "2024 → 2027", "Food aid for disadvantaged families", "Precariousness", "food-aid-for-disadvantaged-families");
  
    infoWindows[78]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (24.13818773142124,120.649119924646);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 78,
    icon: iconpointer,
      category: "category_12 "
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
     window.location.href = getLocalizedUrl("food-aid-for-disadvantaged-families");
       
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
  myOptions.content=createInfoBoxContent(925, "citymeals-volunteers-2-c-jake-price", "Citymeals on Wheels", "United States", "2024 → 2025", "Funding weekend meals in November 2024 and 2025", "Precariousness", "funding-weekend-meals-in-november-2024-and-2025");
  
    infoWindows[77]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (40.75022528879206,-73.97652461018028);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 77,
    icon: iconpointer,
      category: "category_12 "
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
     window.location.href = getLocalizedUrl("funding-weekend-meals-in-november-2024-and-2025");
       
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
  myOptions.content=createInfoBoxContent(906, "the-felix-project-1-c-the-felix-project", "The Felix Project", "England", "2024 → 2026", "The Felix Project Kitchen Meals", "Precariousness", "the-felix-project-kitchen-meals");
  
    infoWindows[75]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (51.52267025479798,-0.2751755603736816);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 75,
    icon: iconpointer,
      category: "category_12 "
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
     window.location.href = getLocalizedUrl("the-felix-project-kitchen-meals");
       
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
  myOptions.content=createInfoBoxContent(1003, "permanence-daccueil-social-2-c-bertrand-carlier", "Croix-Rouge genevoise", "Switzerland", "2024 → 2028", "Social support drop-in centre", "Precariousness", "social-support-drop-in-centre");
  
    infoWindows[86]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (46.1926029869759,6.137602638345343);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 86,
    icon: iconpointer,
      category: "category_12 "
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
     window.location.href = getLocalizedUrl("social-support-drop-in-centre");
       
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
  myOptions.content=createInfoBoxContent(915, "tante-mary-beneficiaire-community-food-pack-c-food-from-the", "Food from the Heart", "Singapore", "2024 → 2026", "Community Food Pack", "Precariousness", "community-food-pack");
  
    infoWindows[76]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (1.3375398548127535,103.88296262536583);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 76,
    icon: iconpointer,
      category: "category_12 "
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
     window.location.href = getLocalizedUrl("community-food-pack");
       
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
  myOptions.content=createInfoBoxContent(891, "pq-3-c-pane-quotidiano", "Pane Quotidiano", "Italy", "2024 → 2026", "Home food distribution to elderly and disabled people", "Precariousness", "home-food-distribution-to-elderly-and-disabled-people");
  
    infoWindows[74]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (45.446546466031904,9.189790200334173);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 74,
    icon: iconpointer,
      category: "category_12 "
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
     window.location.href = getLocalizedUrl("home-food-distribution-to-elderly-and-disabled-people");
       
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
  myOptions.content=createInfoBoxContent(1126, "restos-du-coeur-1-c-sylvie-grosbois", "Les Restaurants du Cœur – Les Relais du Cœur", "France", "2024 → 2027", "A 10% increase in the distribution of hot meals to the most disadvantaged people in Paris", "Precariousness", "a-10-increase-in-the-distribution-of-hot-meals-to-the-most-d");
  
    infoWindows[94]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (48.87752364791656,2.369066785913092);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 94,
    icon: iconpointer,
      category: "category_12 "
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
     window.location.href = getLocalizedUrl("a-10-increase-in-the-distribution-of-hot-meals-to-the-most-d");
       
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
  myOptions.content=createInfoBoxContent(878, "iecd-5-c-appel-daire", "IECD", "France", "2024 → 2027", "Working towards the socio-professional inclusion of people with significant barriers to employment by supporting the structuring of integration stakeholders within a collective", "Organisational development", "working-towards-the-socio-professional-inclusion-of-people-w");
  
    infoWindows[73]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (43.33130481957945,5.410305570703131);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 73,
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
     window.location.href = getLocalizedUrl("working-towards-the-socio-professional-inclusion-of-people-w");
       
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
  myOptions.content=createInfoBoxContent(834, "tfu-1-c-teach-for-uganda", "Teach For Uganda (TFU)", "Uganda", "2024 → 2027", "\"Teaching as Collective\" fellowship programme", "Educators/trainers", "teaching-as-collective-fellowship-programme");
  
    infoWindows[68]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (0.2897881142444389,32.61704595003667);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 68,
    icon: iconpointer,
      category: "category_11 "
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
     window.location.href = getLocalizedUrl("teaching-as-collective-fellowship-programme");
       
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
  myOptions.content=createInfoBoxContent(698, "atelier-lcm-c-acta-vista-jc-verchere", "Acta Vista", "France", "2024 → 2026", "Trans'Faire: tomorrow, a job for everyone", "Vocational training/craftsmanship", "transfaire-tomorrow-a-job-for-everyone");
  
    infoWindows[61]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (43.31831735359238,5.392452787500006);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 61,
    icon: iconpointer,
      category: "category_9 "
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
     window.location.href = getLocalizedUrl("transfaire-tomorrow-a-job-for-everyone");
       
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
  myOptions.content=createInfoBoxContent(739, "23-c-philanthro-lab", "Philanthro-Lab", "France", "2024 → 2026", "Acceleration programme", "Organisational development", "acceleration-programme");
  
    infoWindows[63]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (48.854896861027896,2.382198881250006);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 63,
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
     window.location.href = getLocalizedUrl("acceleration-programme");
       
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
  myOptions.content=createInfoBoxContent(746, "summer-school-1-c-teach-for-italy", "Teach For Italy (TFI)", "Italy", "2024 → 2026", "Support the scale-up of Teach For Italy to tackle education inequalities in Italy", "Educators/trainers | Organisational development", "support-the-scale-up-of-teach-for-italy-to-tackle-education");
  
    infoWindows[64]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (41.89525816575032,12.489620756250005);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 64,
    icon: iconpointer,
      category: "category_11 category_10 "
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
     window.location.href = getLocalizedUrl("support-the-scale-up-of-teach-for-italy-to-tackle-education");
       
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
  myOptions.content=createInfoBoxContent(752, "soft-skills-3-c-yojoa", "Yojoa", "Switzerland", "2024 → 2026", "Stabilise and scale: supporting Yojoa's activities to help vulnerable young people", "Vocational training/craftsmanship | Organisational development", "young-talents");
  
    infoWindows[65]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (46.206775379323076,6.143146764379126);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 65,
    icon: iconpointer,
      category: "category_9 category_10 "
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
     window.location.href = getLocalizedUrl("young-talents");
       
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
  myOptions.content=createInfoBoxContent(720, "ddlm-12-c-julie-gamberoni", "De l'or dans les mains", "France", "2023 → 2026", "Introducing 5,200 secondary school pupils to manual trades", "Vocational training/craftsmanship | Organisational development", "introducing-5200-secondary-school-pupils-to-manual-trades");
  
    infoWindows[62]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (48.8575475,2.3513765);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 62,
    icon: iconpointer,
      category: "category_9 category_10 "
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
     window.location.href = getLocalizedUrl("introducing-5200-secondary-school-pupils-to-manual-trades");
       
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
                    url: 'https://content.da.live/audemars-piguet/biencommun-fondationsaudemarspiguet/assets/images/closter1.png',
                    width: 56,
                    height: 56,
                    textColor: '#ffffff',
                    textSize: 12
                }
            ]
        });

        // map.fitBounds(bounds); // Commented out to use manual zoom level instead
        
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
      zoomInButton.innerHTML = '<img src="/icons/btn_bien_plus.svg" alt="Zoom In" style="width: 24px; height: 24px;">';
      zoomInButton.title = 'Zoom In';
      document.getElementById('map').appendChild(zoomInButton);

      var zoomOutButton = document.createElement('div');
      zoomOutButton.className = 'custom-zoom-button';
      zoomOutButton.id = 'zoom-out';
      zoomOutButton.innerHTML = '<img src="/icons/btn_bien_moins.svg" alt="Zoom Out" style="width: 24px; height: 24px;">';
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