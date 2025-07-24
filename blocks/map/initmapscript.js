/* eslint-disable */
/* stylelint-disable */
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/1162\/img-0422.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Associa\u00e7\u00e3o Projecto Vit\u00f3<\/p><p class=\"carte_box_pays\">Cape Verde<\/p><p class=\"carte_box_date\">2025 \u2192 2027<\/p><p class=\"carte_box_titre\">Implementing an organisational development action plan<\/p><p class=\"carte_box_categorie\">Organisational development<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/implementing-an-organisational-development-action-plan>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/implementing-an-organisational-development-action-plan";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/855\/tompotanah-villages-c-blue-forests.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Comit\u00e9 fran\u00e7ais de l\u2019UICN<\/p><p class=\"carte_box_pays\">Multi-country<\/p><p class=\"carte_box_date\">2025 \u2192 2027<\/p><p class=\"carte_box_titre\">Support programme for biodiversity NGOs working in developing countries (ProBioDev)<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising | Organisational development<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/support-programme-for-biodiversity-ngos-working-in-developin>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/support-programme-for-biodiversity-ngos-working-in-developin";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/861\/site-du-programme-bamboo-lemur-4-c-sebastien-meys.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Helpsimus (Association fran\u00e7aise pour la sauvegarde du grand hapal\u00e9mur)<\/p><p class=\"carte_box_pays\">Madagascar<\/p><p class=\"carte_box_date\">2024 \u2192 2027<\/p><p class=\"carte_box_titre\">Stepping up protection for a thousand hectares of forest fragments housing the largest population of greater bamboo lemurs in the wild<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/stepping-up-protection-for-a-thousand-hectares-of-forest-fra>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/stepping-up-protection-for-a-thousand-hectares-of-forest-fra";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/869\/petites-filles-1-c-darren-cresswell.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">The National Forest Company<\/p><p class=\"carte_box_pays\">England<\/p><p class=\"carte_box_date\">2024 \u2192 2027<\/p><p class=\"carte_box_titre\">Creating a forest for learning III<\/p><p class=\"carte_box_categorie\">Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/creating-a-forest-for-learning-iii>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/creating-a-forest-for-learning-iii";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/811\/animation-classe-verte-2-c-credi-ong.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Centre R\u00e9gional de Recherche et d\u2019\u00c9ducation pour le D\u00e9veloppement Int\u00e9gr\u00e9 (CREDI-ONG)<\/p><p class=\"carte_box_pays\">Benin<\/p><p class=\"carte_box_date\">2023 \u2192 2026<\/p><p class=\"carte_box_titre\">Resilience and adaptation to climate change in the Sitatunga Valley<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/resilience-and-adaptation-to-climate-change-in-the-sitatunga>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/resilience-and-adaptation-to-climate-change-in-the-sitatunga";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/159\/alpes-vivantes-1-c-alpes-vivantes.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Alpes vivantes<\/p><p class=\"carte_box_pays\">Switzerland<\/p><p class=\"carte_box_date\">2023 \u2192 2026<\/p><p class=\"carte_box_titre\">Sustainable protection of biodiversity in the Vaud Alps<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/sustainable-protection-of-biodiversity-in-the-vaud-alps>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/sustainable-protection-of-biodiversity-in-the-vaud-alps";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/201\/beneficiaire-du-projet-cajou-cambodge-1-c-eper.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">EPER<\/p><p class=\"carte_box_pays\">Cambodia<\/p><p class=\"carte_box_date\">2023 \u2192 2026<\/p><p class=\"carte_box_titre\">Green Cashew - Sustainable cashew cultivation to fight climate change<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Ancestral knowledge<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/green-cashew-sustainable-cashew-cultivation-to-fight-climate>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/green-cashew-sustainable-cashew-cultivation-to-fight-climate";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/222\/foretxcellence-1-c-romain-blanc.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">For\u00eatxcellence<\/p><p class=\"carte_box_pays\">Switzerland<\/p><p class=\"carte_box_date\">2022 \u2192 2027<\/p><p class=\"carte_box_titre\">For\u00eatxcellence<\/p><p class=\"carte_box_categorie\">Ancestral knowledge<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/foretxcellence>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/foretxcellence";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/827\/sentier-didactique-du-bois-de-resonance-du-risoud-4-c-associ.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Association Sentier didactique du bois de r\u00e9sonance du Risoud<\/p><p class=\"carte_box_pays\">Switzerland<\/p><p class=\"carte_box_date\">2022 \u2192 2023<\/p><p class=\"carte_box_titre\">Risoud resonance wood learning trail<\/p><p class=\"carte_box_categorie\">Awareness raising | Ancestral knowledge<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/risoud-resonance-wood-learning-trail>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/risoud-resonance-wood-learning-trail";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/428\/ecotourisme-dobservation-des-bonobos-avec-mmt-dans-le-territ.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Mbou-Mon-Tour (MMT)<\/p><p class=\"carte_box_pays\">Democratic Republic of the Congo (DRC)<\/p><p class=\"carte_box_date\">2022 \u2192 2024<\/p><p class=\"carte_box_titre\">Support for sustainable development through the conservation and enhancement of local biodiversity<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/support-for-sustainable-development-through-the-conservation>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/support-for-sustainable-development-through-the-conservation";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/234\/agou-kpolo-plot-c-morija.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Association Morija<\/p><p class=\"carte_box_pays\">Togo<\/p><p class=\"carte_box_date\">2022 \u2192 2025<\/p><p class=\"carte_box_titre\">Agroforestry and green entrepreneurship<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/agroforestry-and-green-entrepreneurship>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/agroforestry-and-green-entrepreneurship";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/335\/sentier-de-la-morges-71-c-yves-burdet.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Association pour la sauvegarde de Morges (ASM)<\/p><p class=\"carte_box_pays\">Switzerland<\/p><p class=\"carte_box_date\">2022 \u2192 2023<\/p><p class=\"carte_box_titre\">Sentier de la Morges trail<\/p><p class=\"carte_box_categorie\">Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/sentier-de-la-morges-trail>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/sentier-de-la-morges-trail";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/258\/site-toile-verte-givrins-c-parc-jura-vaudois.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Association du Parc naturel r\u00e9gional Jura vaudois<\/p><p class=\"carte_box_pays\">Switzerland<\/p><p class=\"carte_box_date\">2022 \u2192 2026<\/p><p class=\"carte_box_titre\">Toile verte<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/toile-verte>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/toile-verte";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/303\/aide-7-c-aide.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Appui aux Initiatives de D\u00e9veloppement (AIDE)<\/p><p class=\"carte_box_pays\">Cameroon<\/p><p class=\"carte_box_date\">2022 \u2192 2024<\/p><p class=\"carte_box_titre\">Integrated management of mangrove landscapes in Douala-Ed\u00e9a National Park<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/integrated-management-of-mangrove-landscape-in-the-douala-ed>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/integrated-management-of-mangrove-landscape-in-the-douala-ed";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/274\/preservation-de-la-biodiversite-au-cap-vert-2-c-projecto-vit.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Associa\u00e7\u00e3o Projecto Vit\u00f3<\/p><p class=\"carte_box_pays\">Cape Verde<\/p><p class=\"carte_box_date\">2022 \u2192 2025<\/p><p class=\"carte_box_titre\">Time for conservation of endemic threatened flora in Cape Verde's islands<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/time-for-conservation-of-endemic-threatened-flora-in-cape-ve>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/time-for-conservation-of-endemic-threatened-flora-in-cape-ve";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/172\/arboretum-1-c-arboretum-national-du-vallon-de-laubonne.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Association de l\u2019Arboretum national du Vallon de l\u2019Aubonne<\/p><p class=\"carte_box_pays\">Switzerland<\/p><p class=\"carte_box_date\">2022 \u2192 2026<\/p><p class=\"carte_box_titre\">Improving mediation and conservation<\/p><p class=\"carte_box_categorie\">Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/improving-mediation-and-conservation>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/improving-mediation-and-conservation";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/155\/champ-daubergines-c-acpe.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Actions Communautaires pour la Protection de l\u2019Environnement (ACPE)<\/p><p class=\"carte_box_pays\">Democratic Republic of the Congo (DRC)<\/p><p class=\"carte_box_date\">2022 \u2192 2025<\/p><p class=\"carte_box_titre\">Supporting the reconstitution of forest cover through agro-ecological practices<\/p><p class=\"carte_box_categorie\">Conservation\/restoration<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/supporting-the-reconstitution-of-forest-cover-through-agro-e>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/supporting-the-reconstitution-of-forest-cover-through-agro-e";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/355\/belo-sur-mer-pecheuse-dans-une-barque-entouree-de-paletuvier.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Blue Ventures<\/p><p class=\"carte_box_pays\">Madagascar<\/p><p class=\"carte_box_date\">2022 \u2192 2023<\/p><p class=\"carte_box_titre\">Blue forests<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/blue-forests>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/blue-forests";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/316\/apprentissage-c-aquaverde.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Aquaverde<\/p><p class=\"carte_box_pays\">Brazil<\/p><p class=\"carte_box_date\">2022 \u2192 2022<\/p><p class=\"carte_box_titre\">Reforestation and Brazil nuts<\/p><p class=\"carte_box_categorie\">Conservation\/restoration<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/reforestation-and-brazil-nuts>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/reforestation-and-brazil-nuts";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/301\/staff-technique-2-c-add.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Alternatives Durables pour le D\u00e9veloppement (ADD)<\/p><p class=\"carte_box_pays\">Cameroon<\/p><p class=\"carte_box_date\">2022 \u2192 2023<\/p><p class=\"carte_box_titre\">Awareness raising and environmental education for young people in vocational schools and communities<\/p><p class=\"carte_box_categorie\">Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/awareness-raising-and-environmental-education-for-young-peop>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/awareness-raising-and-environmental-education-for-young-peop";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/150\/alcp-c-alcp.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Action Lutte Contre la Pauvret\u00e9 (ALCP)<\/p><p class=\"carte_box_pays\">Burkina Faso<\/p><p class=\"carte_box_date\">2022 \u2192 2025<\/p><p class=\"carte_box_titre\">Agro-ecological restoration and agroforestry in the green belt of the city of Ouagadougou<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/agro-ecological-restoration-and-agroforestry-in-the-green-be>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/agro-ecological-restoration-and-agroforestry-in-the-green-be";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/181\/brulis-c-coeur-de-foret.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">C\u0153ur de For\u00eat<\/p><p class=\"carte_box_pays\">Indonesia<\/p><p class=\"carte_box_date\">2022 \u2192 2025<\/p><p class=\"carte_box_titre\">Forest restoration and preservation on the island of Flores, Indonesia<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/forest-restoration-and-preservation-on-the-island-of-flores>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/forest-restoration-and-preservation-on-the-island-of-flores";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/244\/assemblee-feminine-de-conservation-des-habitats-c-istituto-o.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Istituto Oikos<\/p><p class=\"carte_box_pays\">Tanzania<\/p><p class=\"carte_box_date\">2022 \u2192 2024<\/p><p class=\"carte_box_titre\">Mountain farmers and savannah pastoralists: conserving sustainable livelihoods in East Africa<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/mountain-farmers-and-savannah-pastoralists-conserving-sustai>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/mountain-farmers-and-savannah-pastoralists-conserving-sustai";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/406\/journee-de-plantation-avec-le-comite-mangrove-4-c-fama-reyan.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Alliance internationale pour la gestion de l\u2019eau de pluie (IRHA)<\/p><p class=\"carte_box_pays\">Senegal<\/p><p class=\"carte_box_date\">2021 \u2192 2024<\/p><p class=\"carte_box_titre\">Sea forest<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/sea-forest>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/sea-forest";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/454\/action-pedagogique-de-terrain-parcelle-de-veranne-le-mantel.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Robin du Bois<\/p><p class=\"carte_box_pays\">France<\/p><p class=\"carte_box_date\">2021 \u2192 2023<\/p><p class=\"carte_box_titre\">Save the Pilat forests<\/p><p class=\"carte_box_categorie\">Conservation\/restoration<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/save-the-pilat-forests>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/save-the-pilat-forests";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/288\/les-femmes-de-la-cooperative-essodounissi-lavent-des-noix-de.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">V\u00e9t\u00e9rinaires Sans Fronti\u00e8res Suisse (VSF-Suisse)<\/p><p class=\"carte_box_pays\">Togo<\/p><p class=\"carte_box_date\">2021 \u2192 2024<\/p><p class=\"carte_box_titre\">MiKaGo<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising | Ancestral knowledge<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/mikago>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/mikago";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/269\/parc-naturel-du-jorat-2-c-raphael-dupertuis.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Parc naturel du Jorat<\/p><p class=\"carte_box_pays\">Switzerland<\/p><p class=\"carte_box_date\">2021 \u2192 2025<\/p><p class=\"carte_box_titre\">Reception infrastructure at the Parc naturel du Jorat<\/p><p class=\"carte_box_categorie\">Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/reception-infrastructure-at-the-parc-naturel-du-jorat>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/reception-infrastructure-at-the-parc-naturel-du-jorat";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/239\/assemblee-c-nouvelle-planete.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Nouvelle Plan\u00e8te<\/p><p class=\"carte_box_pays\">Peru<\/p><p class=\"carte_box_date\">2021 \u2192 2024<\/p><p class=\"carte_box_titre\">Protection of the forest through the official establishment of indigenous communities<\/p><p class=\"carte_box_categorie\">Conservation\/restoration<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/protection-de-la-foret-par-la-titularisation-fonciere-de-com>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/protection-de-la-foret-par-la-titularisation-fonciere-de-com";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/422\/fleur-de-p-greuteri-3-c-alessandro-s-gristina.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Jardin Botanique de l\u2019Universit\u00e9 de Fribourg<\/p><p class=\"carte_box_pays\">Italy<\/p><p class=\"carte_box_date\">2021 \u2192 2024<\/p><p class=\"carte_box_titre\">Conservation of threatened woody species<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/conservation-of-threatened-woody-species>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/conservation-of-threatened-woody-species";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/346\/autorite-nationale-de-reglementation-pharmaceutique-c-promet.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Fondation Biovision<\/p><p class=\"carte_box_pays\">Uganda<\/p><p class=\"carte_box_date\">2021 \u2192 2024<\/p><p class=\"carte_box_titre\">Mpigi forest school<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising | Ancestral knowledge<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/mpigi-forest-school>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/mpigi-forest-school";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/207\/mosaique-de-petits-milieux-secs-et-humides-crassier-c-esep.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Association des Amis de l\u2019ESEP (\u00c9tablissement scolaire Elisabeth de Portes)<\/p><p class=\"carte_box_pays\">Switzerland<\/p><p class=\"carte_box_date\">2021 \u2192 2027<\/p><p class=\"carte_box_titre\"><\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/13>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/13";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/210\/biche-burtigny-c-open-mind.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Commune de Burtigny<\/p><p class=\"carte_box_pays\">Switzerland<\/p><p class=\"carte_box_date\">2021 \u2192 2024<\/p><p class=\"carte_box_titre\">Fruit-producing edges of the Grandes Tattes forest<\/p><p class=\"carte_box_categorie\">Conservation\/restoration<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/fruit-producing-edges-of-the-grandes-tattes-forest-14>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/fruit-producing-edges-of-the-grandes-tattes-forest-14";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/309\/pepiniere-1-c-ubiratan-g-surui.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Aquaverde<\/p><p class=\"carte_box_pays\">Brazil<\/p><p class=\"carte_box_date\">2021 \u2192 2022<\/p><p class=\"carte_box_titre\">Reinforcing the traditional medicinal plant culture and reforestation of the Surui territory<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Ancestral knowledge<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/reinforcing-the-traditional-medicinal-plant-culture-and-refo>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/reinforcing-the-traditional-medicinal-plant-culture-and-refo";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/462\/reforestation-et-agroforesterie-sur-le-plateau-de-bateke-4-c.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Secodev<\/p><p class=\"carte_box_pays\">Democratic Republic of the Congo (DRC)<\/p><p class=\"carte_box_date\">2021 \u2192 2023<\/p><p class=\"carte_box_titre\">Reforestation and agroforestry on the Bat\u00e9k\u00e9 plateau<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/reforestation-and-agroforestry-on-the-bateke-plateau>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/reforestation-and-agroforestry-on-the-bateke-plateau";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/383\/arbres-adultes-a-dashtijum-c-fauna-flora-international.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Fauna & Flora International (FFI)<\/p><p class=\"carte_box_pays\">Tadjikistan<\/p><p class=\"carte_box_date\">2020 \u2192 2024<\/p><p class=\"carte_box_titre\">Supporting local communities through the conservation of ancient fruit and nut forests<\/p><p class=\"carte_box_categorie\">Conservation\/restoration<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/supporting-local-communities-through-the-conservation-of-anc>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/supporting-local-communities-through-the-conservation-of-anc";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/402\/clapiers-de-lapins-c-inter-aide.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Inter Aide<\/p><p class=\"carte_box_pays\">Malawi<\/p><p class=\"carte_box_date\">2020 \u2192 2024<\/p><p class=\"carte_box_titre\">Improving the lives of rural communities through the planting of agroforestry groves and by adopting agro-ecological practices<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/improving-the-lives-of-rural-communities-through-the-plantin>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/improving-the-lives-of-rural-communities-through-the-plantin";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/374\/femme-plantant-un-arbre-1-c-fairventures.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Fairventures Worldwide<\/p><p class=\"carte_box_pays\">Uganda<\/p><p class=\"carte_box_date\">2020 \u2192 2023<\/p><p class=\"carte_box_titre\">Sustainable mass timber construction for resilient rural economies<\/p><p class=\"carte_box_categorie\">Conservation\/restoration<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/sustainable-mass-timber-construction-for-resilient-rural-eco>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/sustainable-mass-timber-construction-for-resilient-rural-eco";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/396\/arbre-indigene-plante-dans-une-zone-deboisee-2-c-igh.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Itombwe G\u00e9n\u00e9ration pour l\u2019Humanit\u00e9 (IGH)<\/p><p class=\"carte_box_pays\">Democratic Republic of the Congo (DRC)<\/p><p class=\"carte_box_date\">2020 \u2192 2023<\/p><p class=\"carte_box_titre\">Itombwe forest conservation<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/itombwe-forest-conservation>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/itombwe-forest-conservation";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/228\/madame-bien-village-de-bam-c-gret.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Gret<\/p><p class=\"carte_box_pays\">Vietnam<\/p><p class=\"carte_box_date\">2020 \u2192 2024<\/p><p class=\"carte_box_titre\">Empowering ethnic minority women through sustainable forest management in nature reserves<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/empowering-ethnic-minority-women-for-sustainable-forest-mana>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/empowering-ethnic-minority-women-for-sustainable-forest-mana";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/368\/communaute-locale-2-c-experts-solidaires.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Experts-Solidaires<\/p><p class=\"carte_box_pays\">Benin<\/p><p class=\"carte_box_date\">2020 \u2192 2022<\/p><p class=\"carte_box_titre\">Integrated forest resource management<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/integrated-forest-resource-management>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/integrated-forest-resource-management";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/438\/plantation-2-c-pragya.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Pragya<\/p><p class=\"carte_box_pays\">India<\/p><p class=\"carte_box_date\">2020 \u2192 2024<\/p><p class=\"carte_box_titre\">Ancestral knowledge preservation, conservation and cultivation of endangered medicinal and aromatic plants in the Himalayas<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising | Ancestral knowledge<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/ancestral-knowledge-preservation-conservation-and-cultivatio>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/ancestral-knowledge-preservation-conservation-and-cultivatio";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/280\/apprentissage-c-darren-cresswell.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">The National Forest Company<\/p><p class=\"carte_box_pays\">England<\/p><p class=\"carte_box_date\">2020 \u2192 2024<\/p><p class=\"carte_box_titre\">Creating a forest for learning II<\/p><p class=\"carte_box_categorie\">Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/creating-a-forest-for-learning-ii>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/creating-a-forest-for-learning-ii";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/188\/creation-de-meuble-en-r-vinifera-c-didier-roguet.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Conservatoire et Jardin botaniques de la Ville de Gen\u00e8ve (CJBG)<\/p><p class=\"carte_box_pays\">Benin | Ghana | C\u00f4te d\u2019Ivoire<\/p><p class=\"carte_box_date\">2020 \u2192 2027<\/p><p class=\"carte_box_titre\">Multipalms<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/multipalms>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/multipalms";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/480\/dundreggan-rewilding-centre-c-paul-campbell-photography.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Trees for Life<\/p><p class=\"carte_box_pays\">Scotland<\/p><p class=\"carte_box_date\">2020 \u2192 2023<\/p><p class=\"carte_box_titre\">Dundreggan Rewilding Centre<\/p><p class=\"carte_box_categorie\">Awareness raising | Ancestral knowledge<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/dundreggan-rewilding-centre>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/dundreggan-rewilding-centre";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/433\/classe-dapprentissage-orangutan-haven-c-paneco.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Fondation PanEco<\/p><p class=\"carte_box_pays\">Indonesia<\/p><p class=\"carte_box_date\">2020 \u2192 2023<\/p><p class=\"carte_box_titre\">Environmental education centres<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/environmental-education-centres>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/environmental-education-centres";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/322\/construction-2-c-arutam.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Arutam Z\u00e9ro D\u00e9forestation<\/p><p class=\"carte_box_pays\">Mexico<\/p><p class=\"carte_box_date\">2020 \u2192 2022<\/p><p class=\"carte_box_titre\">Support for traditional Mayan agriculture and raising awareness of family nutrition<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising | Ancestral knowledge<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/support-for-traditional-mayan-agriculture-and-raising-awaren>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/support-for-traditional-mayan-agriculture-and-raising-awaren";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/467\/abreuvoirs-pour-les-animaux-c-shen.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">SHEN<\/p><p class=\"carte_box_pays\">Armenia<\/p><p class=\"carte_box_date\">2019 \u2192 2023<\/p><p class=\"carte_box_titre\">Afforestation of Chambarak and Ttujur communities<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/afforestation-of-chambarak-and-ttujur-communities>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/afforestation-of-chambarak-and-ttujur-communities";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/472\/ecole-a-ciel-ouvert-1-c-gabriela-furer-silviva.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Fondation Silviva<\/p><p class=\"carte_box_pays\">Switzerland<\/p><p class=\"carte_box_date\">2019 \u2192 2022<\/p><p class=\"carte_box_titre\">The Forester\u2019s world<\/p><p class=\"carte_box_categorie\">Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/the-foresters-world>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/the-foresters-world";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/823\/grand-hapalemur-4-c-sebastien-meys.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Helpsimus (Association fran\u00e7aise pour la sauvegarde du grand hapal\u00e9mur)<\/p><p class=\"carte_box_pays\">Madagascar<\/p><p class=\"carte_box_date\">2019 \u2192 2023<\/p><p class=\"carte_box_titre\">Stepping up protection for Madagascar\u2019s largest wild population of greater bamboo lemurs<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/stepping-up-protection-for-madagascars-largest-wild-populati>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/stepping-up-protection-for-madagascars-largest-wild-populati";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/447\/grand-milieu-sec-c-reseau-ecologique-la-frontiere.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">R\u00e9seau \u00e9cologique La Fronti\u00e8re<\/p><p class=\"carte_box_pays\">Switzerland<\/p><p class=\"carte_box_date\">2019 \u2192 2022<\/p><p class=\"carte_box_titre\">Landscape and biodiversity<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/landscape-and-biodiversity>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/landscape-and-biodiversity";
     
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
  myOptions.content="<div class='myboxmap'><img src='https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/map/projects-listing/193\/biodiversite-1-c-daisy-tarrier.jpg'   width='220' height='144' ><p class=\"carte_box_partenaires\">Envol Vert<\/p><p class=\"carte_box_pays\">Colombia<\/p><p class=\"carte_box_date\">2019 \u2192 2025<\/p><p class=\"carte_box_titre\">Preserving the last dry forests through agroforestry<\/p><p class=\"carte_box_categorie\">Conservation\/restoration | Awareness raising<\/p><p class=\"carte_box_link\"><a href=\/en\/fondation-pour-les-arbres-projects\/preserver-les-dernieres-forets-seches-par-lagroforesterie>\u2192 See more<\/a><\/p><\/div>";

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
   window.location.href = "/en/fondation-pour-les-arbres-projects/preserver-les-dernieres-forets-seches-par-lagroforesterie";
     
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
                    url: 'https://content.da.live/aemdemos/fondationsaudemarspiguet/assets/images/closter1.png',
                    width: 56,
                    height: 56,
                    textColor: '#ffffff',
                    textSize: 12
                }
            ]
        });

        map.fitBounds(bounds);
        console.log('After fitBounds - Current zoom:', map.getZoom());
        
        // Add zoom change listener to track what's happening with zoom
        map.addListener('zoom_changed', function() {
            console.log('Zoom changed to:', map.getZoom());
        });
        
        // Hide map initially to prevent seeing zoom transition
        document.getElementById('map').style.opacity = '0';
        
        // Use timeout to ensure zoom is set after map is fully initialized
        setTimeout(() => {
            var currentZoom = map.getZoom();
            console.log('Auto zoom from fitBounds:', currentZoom);
            map.setZoom(currentZoom + 1); // Zoom in by 1 level from auto-calculated zoom
            console.log('After zooming in +1 level:', map.getZoom());
            
            // Show map after zoom is complete
            setTimeout(() => {
                document.getElementById('map').style.opacity = '1';
                document.getElementById('map').style.transition = 'opacity 0.3s ease-in';
                console.log('Map now visible with correct zoom level');
            }, 100);
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

         $(document).on("click", "a.works_categorylink", function(e){
        e.preventDefault();

        var myslectcat=$(this).data('categoryid');

        $('a.works_categorylink').removeClass("active");
        $(this).addClass("active");

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
         setTimeout(() => {
             var currentZoom = map.getZoom();
             map.setZoom(currentZoom + 1); // Zoom in by 1 level after category filtering
         }, 100);
               

        }); 

});