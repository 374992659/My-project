$(document).ready(function(){
//上传文件
    $('#uploaderInput').change(function(e) {
        var Url=window.URL.createObjectURL(this.files[0]) ;
        var formData= new FormData();
        var apptoken=localStorage.getItem("apptoken");
        formData.append("file",$("#uploaderInput")[0].files[0]);
        var data=["",JSON.stringify({"apptoken":apptoken})];
        var json=jsEncryptData(data);
        formData.append("data",json);
        console.log(formData);
        $.ajax({
            type:"POST",
            url:url+"ChatMessage_uploadGroupFile",
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
                    console.log(data.data[0]);
                    $(".img").attr({
                        "src":Url,
                        "style":"width:77px;height:77px"
                    });

                }
            },
            error:function (data) {
                console.log(data);
            }
        });
    });



});