$(document).ready(function(){
    "use strict";
    // 功能1 上传图片
    $('#uploaderInput').change(function(e) {
        // var targetElement = e.target,
        //            file = targetElement.files[0],
                url=window.URL.createObjectURL(this.files[0]);
        //         if(url){
        //            var LiImg=`
        //             <li class="weui-uploader__file img1" ><img style="width: 79px;height: 79px" src="${url}" alt=""/></li>
        //           `;
        //            $("#uploaderFiles").append(LiImg);
        //        }
        var formData= new FormData();
        var apptoken=localStorage.getItem("apptoken");
        for(var i=0; i<$('#uploaderInput')[0].files.length;i++){
            formData.append('file[]', $('#uploaderInput')[0].files[i]);
        }
        // formData.append("file[]",$("#uploaderInput")[0].files[0]);
        var data=["",JSON.stringify({"apptoken":apptoken})];
        var json=jsEncryptData(data);
        formData.append("data",json);
        console.log(formData);
        $.ajax({
            type:"POST",
            url:url+"group_uploadNoticePic",
            fileElementId:'uploaderInput',
            data:formData,
            processData : false,
            contentType : false,
            secureuri:false,
            success : function(data){
                // 解密
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    console.log(data.data[0]);
                    localStorage.setItem("flockCommPic",data.data[0]);
                    var LiImg=`
                        
                    <li class="weui-uploader__file img1" ><img class="img" src="${url}" alt=""/></li>
                    `;
                    $(".picPlace").append(LiImg);
                }
            },
            error:function (data) {
                console.log(data);
            }
        });
    });
    // 获取上一个页面的图片路径
    // $("").change(function(e){
    //     var targetElement = e.target,
    //         file = targetElement.files[0],
    //         url=window.URL.createObjectURL(this.files[0]);
    //     var photoAlbum = new FormData();
    //     photoAlbum.append('fileToUpload', file);
    //     if(url){
    //        var LiImg=`
    //        <li class="weui-uploader__file img1" ><img style="width: 79px;height: 79px" src="${url}" alt=""/></li>
    //        `;
    //         $("#uploaderFiles").append(LiImg);
    //     }
    //
    //
    //
    // });

});











