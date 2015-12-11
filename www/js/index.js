/**
 * Created by USER on 27/11/2015.
 */
document.addEventListener("deviceready", init, false);

var CENTER;
var map = undefined;
var db;
var CURRENTMARKERS = [];
var newPlacePos;
var newPlaceName;
var newPlaceRange;
var UNITS = 0.00009; //10 metros

var latitudMarkerCheck;
var longitudMarkerCheck;
var rangeMarker;

var currentLatitude;
var currentLongitude;

function init() {
    createDataBase();
    setUserData();
    initCamera();

    fillListView();

    $(document).on("pagebeforeshow", "#index", initIndex);
    $(document).on("pagebeforeshow", '#maps', initPageMaps);
    $(document).on("pagebeforeshow", '#ImagesMarkers', fillMarkersView);


    //Listener Buttons Maps
    searchButtonListener();
    saveBtnPopupMarkerListener();
    cancelBtnPopupMarkerListener();
    saveMapListener();
    saveBtnPopupMapListener();
    cancelBtnPopupMapListener();
    $("#popupSaveMarker").bind({
        popupafterclose: function (event, ui) {
            map.setClickable(true);
        }
    });

    $("#popupSaveMap").bind({
        popupafterclose: function (event, ui) {
            map.setClickable(true);
        }
    });
}

function initIndex() {
    $('#maps-list').collapsibleset("destroy");
    $('#maps-list').empty();
    fillListView();
}

function createDataBase(){
    db = openDatabase('dpmaps', '1.0', 'BD de Mapas', 2 * 1024 * 1024);

    db.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS maps');
        tx.executeSql('DROP TABLE IF EXISTS markers');
        tx.executeSql('DROP TABLE IF EXISTS users');

        tx.executeSql('CREATE TABLE IF NOT EXISTS maps (' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, ' +
            'name VARCHAR(45), ' +
            'latitud DOUBLE,' +
            'longitud DOUBLE,' +
            'zoom INTEGER' +
            ');');

        tx.executeSql('CREATE TABLE IF NOT EXISTS users (' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, ' +
            'name VARCHAR(100), ' +
            'email VARCHAR(100),' +
            'nationality VARCHAR(45)' +
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

        tx.executeSql('CREATE TABLE IF NOT EXISTS images (' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, ' +
            'image_uri VARCHAR(100), ' +
            'mark_id INTEGER,' +
            'FOREIGN KEY(mark_id) REFERENCES markers(id)' +
            ');');

        tx.executeSql("INSERT INTO maps (name, latitud, longitud, zoom) VALUES ('Londres', '51.5085', '-0.1257', '13')");
        tx.executeSql("INSERT INTO maps (name, latitud, longitud, zoom) VALUES ('Ciudad de México', '19.4284', '-99.1276', '13')");
        tx.executeSql("INSERT INTO maps (name, latitud, longitud, zoom) VALUES ('Barcelona', '41.3887', '2.1589', '13')");
        tx.executeSql("INSERT INTO maps (name, latitud, longitud, zoom) VALUES ('NY', '40.7142', '-74.0059', '13')");

        tx.executeSql("INSERT INTO markers (title, latitud, longitud, range, visited, map_id) VALUES ('Lugar 1', '51.5095', '-0.1453', '1', '0', '1')");
        tx.executeSql("INSERT INTO markers (title, latitud, longitud, range, visited, map_id) VALUES ('Lugar 2', '51.5185', '-0.1267', '5', '1', '1')");
        tx.executeSql("INSERT INTO markers (title, latitud, longitud, range, visited, map_id) VALUES ('Lugar 3', '51.5055', '-0.1359', '20', '1', '1')");
        tx.executeSql("INSERT INTO markers (title, latitud, longitud, range, visited, map_id) VALUES ('Lugar 4', '19.4384', '-99.1286', '50', '0', '2')");
        tx.executeSql("INSERT INTO markers (title, latitud, longitud, range, visited, map_id) VALUES ('Lugar 5', '19.4294', '-99.1174', '34', '0', '2')");
        tx.executeSql("INSERT INTO markers (title, latitud, longitud, range, visited, map_id) VALUES ('Lugar 6', '19.4274', '-99.1210', '14', '1', '2')");
        tx.executeSql("INSERT INTO markers (title, latitud, longitud, range, visited, map_id) VALUES ('Lugar 7', '41.38387', '2.15489', '90', '0', '3')");
        tx.executeSql("INSERT INTO markers (title, latitud, longitud, range, visited, map_id) VALUES ('Lugar 8', '41.48387', '2.17489', '43', '0', '3')");
        tx.executeSql("INSERT INTO markers (title, latitud, longitud, range, visited, map_id) VALUES ('Lugar 9', '40.7342', '-74.1059', '25', '0', '4')");
        tx.executeSql("INSERT INTO markers (title, latitud, longitud, range, visited, map_id) VALUES ('Lugar 10', '40.8142', '-74.0159', '8', '1', '4')");
        tx.executeSql("INSERT INTO markers (title, latitud, longitud, range, visited, map_id) VALUES ('Lugar 11', '40.7145', '-74.0009', '90', '0', '4')");
        tx.executeSql("INSERT INTO markers (title, latitud, longitud, range, visited, map_id) VALUES ('Lugar 12', '40.7045', '-74.1009', '10', '0', '4')");

        tx.executeSql("INSERT INTO users (name, email, nationality) VALUES ('Joshua', 'josshft@gmail.com', 'México')");

    });
}

function fillListView(){
    var mapList = $('#maps-list');
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM maps', [], function (tx, result) {
            for (var i = 0; i < result.rows.length; i++) {
                var item = result.rows.item(i);
                var element = $('<div data-role="collapsible" data-inset="false">' +
                    '<h4>' +
                    item.name +
                    '</h4>' +
                    '<ul data-role="listview" class="ui-listview"></ul>' +
                    '</div>');

                getMarkers(item.id, element);

                var options = $('<div class="ui-grid-c">' +
                    '<div class="ui-block-a"><a href="#" class="ui-btn ui-btn-inline ui-mini vermap" data-id="'+item.id+'"><i class="zmdi zmdi-eye"></i> Ver</a></div>'+
                    '<div class="ui-block-b"><a href="#" class="ui-btn ui-btn-inline ui-mini editmap" data-id="'+item.id+'"><i class="zmdi zmdi-edit"></i> Editar</a></div>'+
                    '<div class="ui-block-c"><a href="#" class="ui-btn ui-btn-inline ui-mini deletemap data-id="'+item.id+'""><i class="zmdi zmdi-delete"></i> Eliminar</a></div>'+
                    '</div>');

                element.append(options);
                mapList.append(element);
                mapList.collapsibleset();
            }
        });
    });
}

function getMarkers(id, element) {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM markers WHERE map_id = ' + id, [], function (tx, resultMarkers) {
            for (var j = 0; j < resultMarkers.rows.length; j++) {
                var marker = resultMarkers.rows.item(j);
                var markerElement = $('<li data-id="' + marker.id + '"><a href="#" data-id="' + marker.id + '" class="marker ui-btn ui-btn-icon-right ui-icon-carat-r waves-effect waves-button waves-effect waves-button waves-effect waves-button">' + marker.title + '</a></li>');
                element.find('ul').first().append(markerElement);
            }
        });
    });
}

/**
 * Funciones para la pagina de MAPS
 */
function initPageMaps() {
    CURRENTMARKERS = [];
    navigator.geolocation.getCurrentPosition(drawMap, onErrorGeolocation);
}

function saveBtnPopupMarkerListener() {
    $('#save-btn-popup').on('click', function (e) {
        e.preventDefault();

        if ($('#marker-name').val()) {
            newPlaceName = $('#marker-name').val();
            newPlaceRange = $('#marker-range').val();
            $('#marker-name').val("");
            drawMarker();
            $('#popupSaveMarker').popup("close");
        } else {
            alert("Debes ingresar un nombre");
        }
    });
}

function cancelBtnPopupMarkerListener() {
    $('#cancel-btn-popup').on('click', function (e) {
        e.preventDefault();
        $('#popupSaveMarker').popup("close");
    });
}

function saveMapListener() {
    $('#save-map').on('click', function (e) {
        e.preventDefault();

        if (!CURRENTMARKERS.isEmpty()) {
            map.setClickable(false);
            $('#popupSaveMap').popup("open");
        } else {
            alert('Debes de poner al menos un lugar');
        }

    });
}

function saveBtnPopupMapListener() {
    $('#savemap-btn-popup').on('click', function (e) {
        e.preventDefault();

        if ($('#map-name').val()) {
            var mapName = $('#map-name').val();
            saveMap(mapName);
            $('#popupSaveMap').popup("close");
            new $.nd2Toast({ // The 'new' keyword is important, otherwise you would overwrite the current toast instance
                message : "Mapa guardado exitosamente!", // Required
                ttl : 6000 // optional, time-to-live in ms (default: 3000)
            });

        }else{
            alert("Debes ingresar un nombre");
        }

    });
}

function cancelBtnPopupMapListener() {
    $('#cancelmap-btn-popup').on('click', function (e) {
        e.preventDefault();
        $('#popupSaveMap').popup("close");
    });
}

function saveMap(name) {
    db.transaction(function (tx) {
        tx.executeSql("INSERT INTO maps (name, latitud, longitud, zoom) VALUES (?, ?, ? , ?)", [name, newPlacePos.lat, newPlacePos.lng, 13], function (tx, results) {
            saveMarkers(results.insertId);
        });
    });
}

function saveMarkers(id) {
    db.transaction(function (tx) {
        CURRENTMARKERS.forEach(function (marker) {
            tx.executeSql("INSERT INTO markers (title, latitud, longitud, range, visited, map_id) VALUES (?, ?, ?, ?, ?, ?)", [marker.title, marker.position.lat, marker.position.lng, marker.range, 0, id]);
        });
    });
}


function searchButtonListener() {
    $('#searchBtn').on('click', function (e) {

        var request = {
            address: $("#query").val()
        };

        plugin.google.maps.Geocoder.geocode(request, function (results) {
            if (results.length) {
                var result = results[0];
                var position = result.position;

                map.animateCamera({
                    target: position,
                    zoom: 15
                });

            } else {
                alert("Not found");
            }
        });

    });
}

function drawMap(position) {

    CENTER = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    initializeMap("map", initMarker);

}

function initializeMap(idElement, callback) {
    if (map !== undefined) {
        map.clear();
    }

    var div = document.getElementById(idElement);

    // Initialize the map view
    map = plugin.google.maps.Map.getMap(div);

    map.removeEventListener(plugin.google.maps.event.MAP_READY);
    map.addEventListener(plugin.google.maps.event.MAP_READY, callback);


    map.on(plugin.google.maps.event.MAP_LONG_CLICK, function(latLng) {
        newPlacePos = latLng;
        map.setClickable(false);
        $('#popupSaveMarker').popup("open");
    });
}

function initMarker(){

    map.moveCamera({
        target: CENTER,
        zoom: 13
    });

    map.addMarker({
        position: CENTER,
        title: "Ubicación Actual"
    });
}

function drawMarker(){
    var marker = {
        position: newPlacePos,
        title: newPlaceName,
        icon: 'blue',
        range: newPlaceRange
    };

    map.addMarker(marker);

    CURRENTMARKERS.add(marker);

    map.addPolygon({
        points: [
            new plugin.google.maps.LatLng(newPlacePos.lat + (UNITS * newPlaceRange), newPlacePos.lng + (UNITS * newPlaceRange)),
            new plugin.google.maps.LatLng(newPlacePos.lat - (UNITS * newPlaceRange), newPlacePos.lng + (UNITS * newPlaceRange)),
            new plugin.google.maps.LatLng(newPlacePos.lat - (UNITS * newPlaceRange), newPlacePos.lng - (UNITS * newPlaceRange)),
            new plugin.google.maps.LatLng(newPlacePos.lat + (UNITS * newPlaceRange), newPlacePos.lng - (UNITS * newPlaceRange))
        ],
        strokeColor: '#AA00FF',
        strokeWidth: 5,
        fillColor: '#880000'
    });
}

function setUserData() {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM users', [], function (tx, result) {
            for (var i = 0; i < result.rows.length; i++) {
                var item = result.rows.item(i);
                var user = $('<div class = "box profile-text"><strong>' + item.name + '</strong>' +
                    '<span class="subline">' + item.email + '</span>');
                var nationality = item.nationality;
            }
            var divUser = $('#divUser');
            var nationDiv = $('#nationality');
            divUser.append(user);
            nationDiv.append(nationality);
        });
    });
}

function onErrorGeolocation(error) {
    alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}

function fillMarkersView() {
    updateCurrentPos();
    setMarkerName();
    $('#gallery').empty();
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM images where mark_id = "' + getIdMarker() + '"', [], function (tx, result) {
            for (var i = 0; i < result.rows.length; i++) {
                var item = result.rows.item(i);

                var element = $('<img class="img_gallery" src="' + item.image_uri + '">');

                var mapList = $('#gallery');
                mapList.append(element);
            }
        });
    });
}

function setMarkerName() {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM markers where id = "' + getIdMarker() + '"', [], function (tx, result) {
            var item = result.rows.item(0);
            $('#name-marker').text(item.title);
             //$('#latitude').text(item.latitud);
            //$('#longitude').text(item.longitud);
            //$('#range').text(item.range);
            latitudMarkerCheck = item.latitud;
            longitudMarkerCheck = item.longitud;
            rangeMarker = item.range;
            if (item.visited === 1) {
                $("#MarkBtn").text("Visitado");
                $("#MarkBtn").button('disable');
            } else {
                $("#MarkBtn").text("No visitado");
                $("#MarkBtn").button('enable');
            }

        });
    });
}

function saveUriPhoto(idmarker, uri) {
    db.transaction(function (tx) {
        tx.executeSql("INSERT INTO images (image_uri, mark_id) VALUES ('" + uri + "', '" + idmarker + "')");
    });
}

function onCheck() {
    if($("#MarkBtn").text() != "Visitado") {
        if (isOnRange()) {
            db.transaction(function (tx) {
                tx.executeSql('UPDATE markers SET visited =' + 1 + ' WHERE id = "' + getIdMarker() + '"');
            });

            navigator.vibrate(3000);
            $("#MarkBtn").text("Visitado");
            $("#MarkBtn").button('disable');
        } else {
            alert("No puedes hacer check en este lugar");
            $("#MarkBtn").text("No visitado");
            $("#MarkBtn").button('enable');
        }
    }
}

function isOnRange() {


    if ((Math.abs(latitudMarkerCheck- currentLatitude) <= rangeMarker) && (Math.abs( longitudMarkerCheck - currentLongitude) <= rangeMarker)) {
        return true;
    } else {
        return false;
    }
}

function updateCurrentPos() {
    navigator.geolocation.getCurrentPosition(function (pos) {
        currentLatitude = pos.coords.latitude;
        currentLongitude = pos.coords.longitude;
    }, onErrorGeolocation);
}