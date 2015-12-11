/**
 * Created by Kev' on 11/12/2015.
 */

function captureVideo(){
    navigator.device.capture.captureVideo(captureSuccess, captureError);
}

function captureError(e) {
    console.log("capture error: "+JSON.stringify(e));
}

function captureSuccess(s) {
    var imgVideo = $("<img class='video' src='img/hover-video.png' data-path='"+s[0].fullPath+"'>");
    $('#gallery').append(imgVideo);

    saveUriPhoto(getIdMarker(), "img/hover-video.png");
}