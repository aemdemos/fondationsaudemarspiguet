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
  
  if (language === 'fr') {
    return `/fr/fondation-pour-le-bien-commun-nos-projets/${projectSlug}`;
  } else {
    return `/en/fondation-pour-le-bien-commun-projects/${projectSlug}`;
  }
}

// Function to create InfoBox content with localized links
function createInfoBoxContent(imageId, imageName, partner, country, dateRange, title, category, projectSlug) {
  const language = getCurrentLanguage();
  const localizedUrl = getLocalizedUrl(projectSlug);
  
  // Set language-specific text (data is already localized in the JSON)
  const seeMoreText = language === 'fr' ? "→ Voir en détail" : "→ See more";
  
  return `<div class='myboxmap'><img src='https://content.da.live/audemars-piguet/biencommun-fondationsaudemarspiguet/assets/images/map/projects-listing/${imageId}/${imageName}.jpg' width='220' height='144'><p class="carte_box_partenaires">${partner}</p><p class="carte_box_pays">${country}</p><p class="carte_box_date">${dateRange}</p><p class="carte_box_titre">${title}</p><p class="carte_box_categorie">${category}</p><p class="carte_box_link"><a href=${localizedUrl}>${seeMoreText}</a></p></div>`;
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

    
    
  // Get the appropriate markers data based on current language
  const language = getCurrentLanguage();
  const markersKey = language === 'fr' ? 'mapmarkers-fr' : 'mapmarkers';
  const markersData = window.placeholders && window.placeholders[markersKey] ? window.placeholders[markersKey] : [];


  // Create markers dynamically from the data
  markersData.forEach(function(markerData) {
    var myOptions = popupoption;
    myOptions.content = createInfoBoxContent(
      markerData.imageId, 
      markerData.imageName, 
      markerData.partner, 
      markerData.country, 
      markerData.dateRange, 
      markerData.title, 
      markerData.category, 
      markerData.projectSlug
    );

    infoWindows[markerData.itemId] = new InfoBox(myOptions);

    var markerLatLng = new google.maps.LatLng(markerData.latitude, markerData.longitude);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: markerData.itemId,
      icon: iconpointer,
      category: markerData.categoryClasses
    });

    marker.addListener('mouseout', function() {
      // Empty mouseout handler
    });
    
    if (!isTouchDevice) {
      marker.addListener('mouseover', function() {
        $.each(infoWindows, function(key, elem){
          if(elem){
            elem.close();
          }
        });
        infoWindows[this.item].open(map, this);
      });  
      
      marker.addListener('click', function() {
        window.location.href = getLocalizedUrl(markerData.projectSlug);
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
  });
  
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
        map.setZoom(map.getZoom() + 1);
      });

      zoomOutButton.addEventListener('click', function() {
        map.setZoom(map.getZoom() - 1);
      });  
    
    
    
    
}
 
document.addEventListener('DOMContentLoaded', function(){
        

         $(document).on("click", "a.works_categorylink", function(e){
        e.preventDefault();
        // Let event bubble normally

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
               

        }); 

        // Alternative vanilla JS event handler in case jQuery doesn't work
        document.addEventListener('click', function(e) {
            
            // Check for various possible targets
            const clickedAnchor = e.target.closest('a.works_categorylink') || 
                                 e.target.closest('a[data-categoryid]') ||
                                 (e.target.tagName === 'A' && e.target.classList.contains('works_categorylink'));
            
            if (clickedAnchor) {
                e.preventDefault();
                // Don't stop propagation - we want this to work
                
                const clickedLink = clickedAnchor; // Use the found anchor
                const myslectcat = clickedLink.getAttribute('data-categoryid');
                
                // Remove active class from all
                document.querySelectorAll('a.works_categorylink').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to clicked
                clickedLink.classList.add('active');
                
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
                }
            }
        });

});