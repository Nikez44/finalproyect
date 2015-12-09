/**
 * Created by Kev' on 05/12/2015.
 */

function getImage() {
    navigator.camera.getPicture(onSuccess, onFailure, {
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
    });
}

tx.executeSql('CREATE TABLE IF NOT EXISTS images (' +
    'id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, ' +
    'image_uri VARCHAR(100), ' +
    'mark_id INTEGER,' +
    'FOREIGN KEY(mark_id) REFERENCES markers(id)' +
    ');');

function onSuccess(imageURI) {
    $('#gallery').append($("<img src='"+imageURI+"'>"));
}

function onFailure(message) {
    alert("Get image failed: " + message);
}

$("li").on("click", function(){
    window.location.href = "#ImagesMarkers";
});