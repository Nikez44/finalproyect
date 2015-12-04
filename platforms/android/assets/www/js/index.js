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

        tx.executeSql('CREATE TABLE IF NOT EXISTS maps (' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, ' +
            'name VARCHAR(45), ' +
            'latitud DOUBLE,' +
            'longitud DOUBLE,' +
            'zoom INTEGER' +
            ');');

        tx.executeSql('CREATE TABLE IF NOT EXISTS markers (' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, ' +
            'title VARCHAR(45), ' +
            'latitud DOUBLE,' +
            'longitud DOUBLE,' +
            'range DOUBLE,' +
            'visited TINYINT(1),' +
            'map_id INTEGER,' +
            'FOREIGN KEY(map_id) REFERENCES maps(id)' +
            ');');

        tx.executeSql("INSERT INTO maps (name, latitud, longitud, zoom) VALUES ('Mapa 1', '3.57', '4.44', '10')");
        tx.executeSql("INSERT INTO maps (name, latitud, longitud, zoom) VALUES ('GOOGLE', '37.422476', '-122.08425', '10')");
        tx.executeSql("INSERT INTO markers (title, latitud, longitud, range, visited, map_id) VALUES ('Lugar 1', '37.422476', '-122.08525', '0.001', '0', '1')");
    });
}

function fillListView(){
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM maps', [], function (tx, result) {
            for (var i = 0; i < result.rows.length; i++) {
                var item = result.rows.item(i);
                var element = $('<div data-role="collapsible" data-inset="false">' +
                                    '<h4>' +
                                            item.name +
                                    '</h4>' +
                                        '<ul data-role="listview" class="ui-listview">' +
                                            '<li><a href="#" class="ui-btn ui-btn-icon-right ui-icon-carat-r waves-effect waves-button waves-effect waves-button waves-effect waves-button">Lugar 1</a></li>' +
                                        '</ul>' +
                                '</div>');
                $('#maps-list').append(element);
                $('#maps-list').collapsibleset()
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

    map.addPolygon({
        points: [
            new plugin.google.maps.LatLng(pos.lat+0.001, pos.lng+0.001),
            new plugin.google.maps.LatLng(pos.lat-0.001, pos.lng+0.001),
            new plugin.google.maps.LatLng(pos.lat-0.001, pos.lng-0.001),
            new plugin.google.maps.LatLng(pos.lat+0.001, pos.lng-0.001)
        ],
        strokeColor: '#AA00FF',
        strokeWidth: 5,
        fillColor: '#880000'
    });
}

function onErrorGeolocation(error){
    alert('code: ' + error.code + '\n' +'message: ' + error.message + '\n');
}


