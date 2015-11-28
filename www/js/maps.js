/**
 * Created by USER on 27/11/2015.
 */
document.addEventListener("deviceready", init, false);

var CENTER;
var map;

function init(){
    navigator.geolocation.getCurrentPosition(drawMap, onErrorGeolocation);
}

function drawMap(position){

    CENTER = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var div = document.getElementById("map");

    // Initialize the map view
    map = plugin.google.maps.Map.getMap(div, {
        camera: {
            latLng: CENTER,
            zoom: 13
        }
    });

    map.addEventListener(plugin.google.maps.event.MAP_READY, initMarker);


    map.on(plugin.google.maps.event.MAP_LONG_CLICK, function(latLng) {
        //alert("Map was long clicked.\n" + latLng.toUrlValue());
        drawMarker(latLng);
    });

}

function initMarker(){
    map.addMarker({
        position: CENTER,
        title: "Hello GoogleMap for Cordova!",
        icon: 'green'
    });
}

function drawMarker(pos){
    map.addMarker({
        position: pos,
        title: "Hello GoogleMap for Cordova!",
        icon: 'green'
    });
}

function onErrorGeolocation(error){
    alert('code: ' + error.code + '\n' +'message: ' + error.message + '\n');
}


