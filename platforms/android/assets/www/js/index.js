/**
 * Created by USER on 27/11/2015.
 */
document.addEventListener("deviceready", init, false);

var CENTER;
var map;
var db;

function init(){

    createDataBase();
    fillListView();
    $(document).on("pageshow", '#maps', initPageMaps);
}

function createDataBase(){
    db = openDatabase('dpmaps', '1.0', 'BD de Mapas', 2 * 1024 * 1024);

    db.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS maps');
        tx.executeSql('DROP TABLE IF EXISTS Markers');

        tx.executeSql('CREATE TABLE IF NOT EXISTS maps (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, ' +
            'name VARCHAR(45), ' +
            'latitud DOUBLE,' +
            'longitud DOUBLE,' +
            'zoom INTEGER)');

        tx.executeSql('CREATE TABLE IF NOT EXISTS markers (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, ' +
            'title VARCHAR(45), ' +
            'latitud DOUBLE,' +
            'longitud DOUBLE,' +
            'visited TINYINT(1),' +
            'map_id INTEGER)');

        tx.executeSql("INSERT INTO maps (name, latitud, longitud, zoom) VALUES ('Mapa 1', '3.57', '4.44', '10')");
        tx.executeSql("INSERT INTO maps (name, latitud, longitud, zoom) VALUES ('Mapa 2', '23.57', '38.44', '10')");
        tx.executeSql("INSERT INTO markers (title, latitud, longitud, visited, map_id) VALUES ('Lugar 1', '5.57', '10.44', '1', '1')");
    });
}

function fillListView(){
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM maps', [], function (tx, result) {
            for (var i = 0; i < result.rows.length; i++) {
                var item = result.rows.item(i);
                var element = $('<li><a href="#" class="ui-btn waves-effect waves-button waves-effect waves-button waves-effect waves-button"><h2>'+item.name+'</h2><p> Latitud: ' + item.latitud + ' Longitud: ' + item.longitud +'</p></a></li>');
                $('#maps-list').append(element);
            }
        });
    });


}


/**
 * Funciones para la pagina de MAPS
 */
function initPageMaps(){
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
        title: "Hello GoogleMap for Cordova!"
    });
}

function onErrorGeolocation(error){
    alert('code: ' + error.code + '\n' +'message: ' + error.message + '\n');
}


