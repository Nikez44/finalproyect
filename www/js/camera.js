/**
 * Created by Kev' on 09/12/2015.
 */

var pictureSource;   // picture source
var destinationType; // sets the format of returned value

// Cordova is ready to be used!
function initCamera() {
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
    saveUriPhoto(getIdMarker(), imageData);
    var element = $('#gallery');

    element.append("<img class='img_gallery' src='"+imageData+"'>");
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
    var largeImage = document.getElementById('gallery');
    largeImage.src = imageURI;
}

function capturePhoto() {
    // Take picture using device camera and retrieve image as base64-encoded string

    if(isOnRange()){
        navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
            destinationType: destinationType.FILE_URI,
            saveToPhotoAlbum: true});
    }else{
        navigator.notification.alert(
            'No puedes tomar imagenes hasta haber llegado a este lugar.',  // message
            0,
            'Atencion',            // title
            'OK'                  // buttonName
        );
    }
}

function getPhoto(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source });
}

function onFail(message) {
    alert('Failed because: ' + message);
}