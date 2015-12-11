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

function openImage(){
    var path = $(this).attr("src");
    var IMG = $("<img src='"+path+"'>");
    var popup = $("#popupImage");
    popup.empty();
    popup.append(IMG);
    popup.popup("open");
}

function selectCamera(){
    navigator.notification.confirm("¿Que desea hacer?", function(e){
        switch(e) {
            case 1:
                capturePhoto();
                break;
            case 2:
                captureVideo();
                break;
        }
    }, "Confirma seleccion", ["Foto", "Video"]);
}

$(document).on("click",".marker", redirectToViewMarker);

$(document).on("click",".img_gallery", openImage);
