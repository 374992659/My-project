$(document).ready(function(){
    "use strict";
    // 功能1 上传图片
    $('#uploaderInput').change(function(e) {
        var fileId = $(this).attr("id");
        var t_files = this.files;
                var imglength =  $("#view_" + fileId).parent().parent().find(".upload-img").length;
                if (imglength==1) {
                        if (t_files.length > 5) {
                                new Message().showMsg("最多选择五张图片");
                                return false;
                            } else if (t_files.length < 1) {
                                new Message().showMsg("至少选择一张图片");
                            return false;
                            }
                     }else if(t_files.length+imglength>6) {
                         new Message().showMsg('最多再选择'+ (6-parseInt(imglength)) +'张图片');
                         return false;
                     }
                 var data = new FormData();
                 for (var i=0;i<t_files.length;i++){
                         data.append('file',t_files[i]);
                         data.append('randomCode',fileId+i);
                         data.append('upDir','comment')
                     }
        var Url=window.URL.createObjectURL(this.files[0]);
        console.log(Url);
        // var formData= new FormData();
        var apptoken=localStorage.getItem("apptoken");
        var group_num=localStorage.getItem("group_num");
        // formData.append("file",$("#uploaderInput")[0].files[0]);
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











