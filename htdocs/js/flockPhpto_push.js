$(document).ready(function(){
    // 获取上一个页面的图片路径
    var url=localStorage.getItem("photoUrl");
    $(".img1 img").attr("src",url);
    $("#uploaderInput").change(function(e){
        var targetElement = e.target,
            file = targetElement.files[0],
            url=window.URL.createObjectURL(this.files[0]);
        var photoAlbum = new FormData();
        photoAlbum.append('fileToUpload', file);
        if(url){
           var LiImg=`
           <li class="weui-uploader__file img1" ><img style="width: 79px;height: 79px" src="${url}" alt=""/></li>
           `;
            $("#uploaderFiles").append(LiImg);
        }



    });

});











