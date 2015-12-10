/**
 * Created by Kev' on 05/12/2015.
 */

var idMarker;

function redirectToViewMarker(){
    idMarker = $(this).data("id");
    window.location.href = "#ImagesMarkers";
}

function getIdMarker(){
    return idMarker;
}

$(document).on("click",".marker", redirectToViewMarker);