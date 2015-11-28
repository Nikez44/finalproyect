/**
 * Created by USER on 27/11/2015.
 */

$( document ).on( "pagecreate", "#mapPage", function( event ) {
    alert( "This page was just enhanced by jQuery Mobile!" );
    //$('#map').html("Hola Mundo!");
    initMap();
});


function initMap() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

function onSuccess (position){
    //var parentElement = document.getElementById(id);
    //var listeningElement = parentElement.querySelector('.listening');

    var myLatLng = {lat: position.coords.latitude, lng: position.coords.longitude};

    // Create a map object and specify the DOM element for display.
    var map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        scrollwheel: true,
        zoom: 15
    });

    map.addListener('click', function(e) {
        placeMarkerAndPanTo(e.latLng, map);
    });

    function placeMarkerAndPanTo(latLng, map) {
        var marker = new google.maps.Marker({
            position: latLng,
            map: map
        });
        map.panTo(latLng);
    }

    var image = 'img/marker-514.png';
    // Create a marker and set its position.
    var marker = new google.maps.Marker({
        map: map,
        position: myLatLng,
        title: 'Hello World!',
        label: 'Hello World!',
        icon: image
    });

    var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="firstHeading" class="firstHeading">'+ marker.title +'</h1>'+
        '<div id="bodyContent">'+
        '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
        'sandstone rock formation in the southern part of the '+
        'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
        'south west of the nearest large town, Alice Springs; 450&#160;km '+
        '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
        'features of the Uluru - Kata Tjuta National Park. Uluru is '+
        'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
        'Aboriginal people of the area. It has many springs, waterholes, '+
        'rock caves and ancient paintings. Uluru is listed as a World '+
        'Heritage Site.</p>'+
        '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
        'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
        '(last visited June 22, 2009).</p>'+
        '</div>'+
        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });
}

function onError(error){
    alert('code: ' + error.code + '\n' +'message: ' + error.message + '\n');
}