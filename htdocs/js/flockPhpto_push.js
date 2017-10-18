$(document).ready(function(){
    "use strict";
    // 功能1 上传图片
    $('#uploaderInput').change(function(e) {
        var Url=window.URL.createObjectURL(this.files[0]);
        console.log(Url);
        var formData= new FormData();
        var apptoken=localStorage.getItem("apptoken");
        var group_num=localStorage.getItem("group_num");
        formData.append("file",$("#uploaderInput")[0].files[0]);
        var data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num})];
        var json=jsEncryptData(data);
        formData.append("data",json);
        console.log(formData);
        $.ajax({
            type:"POST",
            url:url+"group_addGroupPic",
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
                    var LiImg=`
                      <li class="weui-uploader__file img1" ><img style="height: 77px;width: 77px" class="img" src="${Url}" alt=""/></li>
                    `;
                    $("#uploaderFiles").append(LiImg);
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











