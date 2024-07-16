const provider = new GeoSearch.OpenStreetMapProvider();
const search = new GeoSearch.GeoSearchControl({
    provider: provider,
    notFoundMessage: 'Ihre eingegebene Adresse wurde leider nicht gefunden.',
    style: 'bar',
    searchLabel: 'Adresse eingeben',
    keepResult: true,
    updateMap: false,
    marker: {
        // optional: L.Marker    - default L.Icon.Default
        icon: new L.Icon.Default(),
        draggable: false,
    },
});


let newLocation;
// Uni Trier
const latUni = 49.74606765;
const lonUni = 6.68718716;


function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function haversine(lat1, lon1, lat2, lon2) {
    // Konvertiere Grad in Radiant
    lat1 = toRadians(lat1);
    lon1 = toRadians(lon1);
    lat2 = toRadians(lat2);
    lon2 = toRadians(lon2);

    // Unterschiede berechnen
    let dlat = lat2 - lat1;
    let dlon = lon2 - lon1;

    // Haversine-Formel anwenden
    let a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius der Erde (in Kilometern)
    let r = 6371.0;

    // Distanz berechnen
    let distance = c * r;
    return distance;
}

function formatDistanceString(distance, name) {
    let text = `Die Distanz zwischen ${name} und der Universität Trier beträgt ca. <b>${distance.toFixed(2)}</b> km. `
    switch (true) {
        case distance > 800.0:
            text = `The distance between ${name} and the University of Trier is <b>${distance.toFixed(2)}</b> km. ` +
                'I expect you to come from far away. Nice that you found the University of Trier. You want to learn first german? - ' +
                'Schreib dich ein!'
            break;
        case distance > 200.0:
            text += 'Ich würde herziehen. Die Universität ist top und du lernst hier sicher schnell viele Freunde kennen.' +
                ' Trier ist ohnehin eine sehr schöne und die älteste Stadt Deutschlands.'
            break;
        case distance > 50.0:
            text += 'Trier ist cool. Eine Wohnung in Trier lohnt sich. Am Wochenden kannst du deine Freunde und Familie zu Hause treffen. ' +
                'Gleich einschreiben würde ich sagen.'
            break;
        case distance > 10.0:
            text += 'Das ist gar nicht so weit weg. Du kannst bei deinen Eltern wohnen und trotzdem in Trier studieren. ' +
                'Oder du ziehst gleich in die älteste Stadt Deutschlands. Am besten sofort einschreiben.'
            break;
        case distance <= 10.0:
            text += 'Du wohnst ja quasi in Trier. Schreibe dich am besten gleich ein.'
            break;


    }
    return text
}

let line

function processLocation(ev) {
    if (line != null) {
        osm_347.removeLayer(line)
    }
    let locationDistanceElement = document.querySelector('#locationDistance');
    newLocation = ev;
    lon2 = ev['location']['x'];
    lat2 = ev['location']['y'];
    let name = newLocation['location']['label'];
    console.log(newLocation);
    // Distanz berechnen
    let distance = haversine(latUni, lonUni, lat2, lon2);
    locationDistanceElement.innerHTML = formatDistanceString(distance, name)

    let latlngs = [
        [latUni, lonUni],
        [lat2, lon2]
    ]
    line = L.polyline(latlngs, {color: '#007AC3'}).addTo(osm_347);
    osm_347.fitBounds(line.getBounds());
}

function createUniPin() {
    let UniPin = L.icon({
        iconUrl: '/fileadmin/logo/LogoPin.png',

        iconSize: [38, 61],
        iconAnchor: [36, 60],
        popupAnchor: [-17, -50]
    });
    L.marker([latUni, lonUni], {icon: UniPin}).addTo(osm_347).bindPopup("Universität Trier");
}

function initTileLayer() {

    let osm = L.tileLayer.provider('OpenStreetMap.DE')
    let openTopoMap = L.tileLayer.provider('OpenTopoMap')
    let EsriWorldImagery = L.tileLayer.provider('Esri.WorldImagery');
    let EsriWorldStreetMap = L.tileLayer.provider('Esri.WorldStreetMap');
    let opnvKarte = L.tileLayer.provider('OPNVKarte');


    let baseMaps = {
        "OpenStreetMap": osm,
        "OpenTopoMap": openTopoMap,
        "EsriWorldImagery": EsriWorldImagery,
        "EsriWorldStreetMap": EsriWorldStreetMap,
        "ÖPNVKarte" : opnvKarte
    };
    osm.addTo(osm_347);
    let layerControl = L.control.layers(baseMaps).setPosition('topright').addTo(osm_347);
}

function initGeosearch() {
    osm_347.addControl(search);
    osm_347.on('geosearch/showlocation', processLocation);
    initTileLayer()
    createUniPin();
}


document.addEventListener('DOMContentLoaded', (ev) => setTimeout(initGeosearch, 100));
