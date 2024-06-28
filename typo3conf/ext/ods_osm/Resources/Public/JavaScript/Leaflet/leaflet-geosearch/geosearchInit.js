const provider = new GeoSearch.OpenStreetMapProvider();
const search = new GeoSearch.GeoSearchControl({
    provider: provider,
    notFoundMessage: 'Ihre eingegebene Adresse wurde leider nicht gefunden.',
    style: 'bar',
    searchLabel: 'Adresse eingeben',
    marker: {
        // optional: L.Marker    - default L.Icon.Default
        icon: new L.Icon.Default(),
        draggable: false,
    },
});


let newLocation;

const lat1 = 49.74606765;
const lon1 = 6.68718716;


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
            text = `The distance between ${name} and the University of Trier is ${distance.toFixed(2)} km. ` +
                'I expect you too come from far away. Nice that you found the University of Trier. You want to learn German: ' +
                'Schreib dich ein!'
            break;
        case distance > 200.0:
            text += 'Ich würde herziehen. Die Universität ist top und du lernst hier sicher schnell viele Freunde kennen.' +
                ' Trier ist ohnehin eine sehr schöne und die älteste Stadt deutschlands.'
            break;
        case distance > 50.0:
            text += 'Trier ist cool. Eine Wohnung in Trier lohnt sich. Am Wochenden kannst du deine Freunde und Familie zu Hause treffen. ' +
                'Gleich einschreiben würde ich sagen.'
            break;
        case distance > 10.0:
            text += 'Das ist gar nicht so weit weg. Du kannst bei deinen Eltern wohnen und trotzdem in Trier studieren. ' +
                'Oder du ziehst gleich in die älteste Stadt deutschlands. Am besten gleich einschreiben.'
            break;
        case distance <= 10.0:
            text += 'Du wohnst ja quasi in Trier. Schreibe dich am besten gleich ein.'
            break;


    }
    return text
}

function processLocation(ev) {
    let locationDistanceElement = document.querySelector('#locationDistance');
    newLocation = ev;
    lon2 = ev['location']['x'];
    lat2 = ev['location']['y'];
    let name = newLocation['location']['label'];
    console.log(newLocation);
    // Distanz berechnen
    let distance = haversine(lat1, lon1, lat2, lon2);
    locationDistanceElement.innerHTML = formatDistanceString(distance, name)
}

function createUniPin() {

    let UniPin = L.icon({
        iconUrl: '/fileadmin/logo/LogoPin.png',

        iconSize: [38, 61], // size of the icon
        iconAnchor: [22, 60], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -50] // point from which the popup should open relative to the iconAnchor
    });
    L.marker([lat1, lon1], {icon: UniPin}).addTo(osm_347).bindPopup("Universität Trier");
}

function initGeosearch() {
    osm_347.addControl(search);
    osm_347.on('geosearch/showlocation', processLocation);
    createUniPin();
}


document.addEventListener('DOMContentLoaded', setTimeout(initGeosearch, 100));
