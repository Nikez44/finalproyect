/**
 * Created by USER on 10/12/2015.
 */

var CURRENTPOSMAP;
var idSeeMap;

$(document).on('click', '.vermap', function(e){
    e.preventDefault();
    idSeeMap = $(this).data('id');
    window.location.href = "#seemaps";
    drawSeeMap(idSeeMap);
});

$(document).on('click', '.editmap', function(e){
    e.preventDefault();
    idSeeMap = $(this).data('id');

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM maps where id = "'+ idSeeMap +'"', [], function (tx, result) {
            var item = result.rows.item(0);

            $('#map-cur-name').val(item.name);

        });
    });

    $('#popupUpdateMap').popup('open');
});

$(document).on('click', '.deletemap', function(e){
    e.preventDefault();
    idSeeMap = $(this).data('id');
    alert('Eliminando Mapa' + idSeeMap);
});


function updateBtnPopupMapListener(){
    $('#updatemap-btn-popup').on('click', function(e){
        e.preventDefault();

        if($('#map-cur-name').val()){
            var mapName = $('#map-cur-name').val();
            updateMap(mapName);
            $('#popupUpdateMap').popup("close");
            /*new $.nd2Toast({ // The 'new' keyword is important, otherwise you would overwrite the current toast instance
                message : "Mapa guardado exitosamente!", // Required
                ttl : 6000 // optional, time-to-live in ms (default: 3000)
            });*/

        }else{
            navigator.notification.alert(
                'Debes ingresar un nombre',  // message
                0,
                'Atencion',            // title
                'OK'                  // buttonName
            );
        }

    });
}

function updateMap(name){
    alert('Actualizando el mapa ' + idSeeMap + "con el nombre " + name);
    db.transaction(function (tx) {
        tx.executeSql('UPDATE maps SET name ='+name+' WHERE id = "' + idSeeMap + '"');
    });
}

function upCancelBtnPopupMapListener(){
    $('#updatecancelmap-btn-popup').on('click', function(e){
        e.preventDefault();
        $('#popupUpdateMap').popup("close");
    });
}

function drawSeeMap(id){

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM maps where id = "'+ id +'"', [], function (tx, result) {
            var item = result.rows.item(0);

            var name = item.name;
            var latitud = item.latitud;
            var longitud = item.longitud;
            var zoom = item.zoom;

            CURRENTPOSMAP = new plugin.google.maps.LatLng(latitud, longitud);

        });
    });

    getMarkersFromMap(id);
    CURRENTMARKERS = [];
    initializeMap("seemap", readySeeMap);

}

function getMarkersFromMap(id){
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM markers WHERE map_id = ' + id, [], function (tx, resultMarkers) {
            for (var j = 0; j < resultMarkers.rows.length; j++) {
                var marker = resultMarkers.rows.item(j);
                CURRENTMARKERS.add(marker);
            }
        });
    });
}

function readySeeMap(){
    map.moveCamera({
        target: CURRENTPOSMAP,
        zoom: 13
    });

    CURRENTMARKERS.forEach(function(marker){
        var pos =  new plugin.google.maps.LatLng(marker.latitud, marker.longitud);
        var icon;

        if(marker.visited == 0){
            icon = 'blue';
        }else{
            icon = 'green';
        }

        var mark = { position: pos, title: marker.title, icon: icon };

        map.addMarker(mark);

        map.addPolygon({
            points: [
                new plugin.google.maps.LatLng(pos.lat+(UNITS*marker.range), pos.lng+(UNITS*marker.range)),
                new plugin.google.maps.LatLng(pos.lat-(UNITS*marker.range), pos.lng+(UNITS*marker.range)),
                new plugin.google.maps.LatLng(pos.lat-(UNITS*marker.range), pos.lng-(UNITS*marker.range)),
                new plugin.google.maps.LatLng(pos.lat+(UNITS*marker.range), pos.lng-(UNITS*marker.range))
            ],
            strokeColor: '#AA00FF',
            strokeWidth: 5,
            fillColor: '#880000'
        });

    });
}