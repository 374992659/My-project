$(document).ready(function(){
    $("#file_input").change(function(e){
        var targetElement = e.target,
            file = targetElement.files[0],
            url=window.URL.createObjectURL(this.files[0]) ;
        console.log(file.name);
        var photoAlbum = new FormData();
        photoAlbum.append('fileToUpload', file);
        if(url){
                localStorage.setItem("photoUrl",url);
            window.location.href="flockPhpto_push.html";
        }

    })


});