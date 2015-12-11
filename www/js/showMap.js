/**
 * Created by USER on 10/12/2015.
 */

var CURRENTPOSMAP;

$(document).on('click', '.vermap', function(e){
    e.preventDefault();
    var idSeeMap = $(this).data('id');
    window.location.href = "#seemaps";
    drawSeeMap(idSeeMap);
});

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
    CURRENTMARKERS = []
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

    //alert(CURRENTMARKERS.length);

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