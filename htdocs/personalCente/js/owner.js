$(document).ready(function(){
    // 上传身份证正面A
    $('#uploaderInputA').change(function(e) {
        var Url=window.URL.createObjectURL(this.files[0]) ;

        var formData= new FormData();
        var apptoken=localStorage.getItem("apptoken");
        formData.append("file",$("#uploaderInputA")[0].files[0]);
        var data=["",JSON.stringify({"apptoken":apptoken})];
        var json=jsEncryptData(data);
        formData.append("data",json);
        console.log(formData);
        $.ajax({
            type:"POST",
            url:url+"UserCenter_uploadOwnerApplicationPic",
            fileElementId:'uploaderInputA',
            data:formData,
            processData : false,
            contentType : false,
            secureuri:false,
            success : function(data){
                // 解密
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    console.log(data.data.file_path);
                    localStorage.setItem("myPicA",data.data.file_path);
                    $(".flockHeadA img").attr("src",Url);
                    $(".loaderA").attr("style","position:absolute;left:40%;opacity: 0;");
                    $(".flockHeadA").attr("style","display:block");
                }
            },
            error:function (data) {
                console.log(data);
            }
        });
    });
    // 上传身份证正面B
    $('#uploaderInputB').change(function(e) {
        var Url=window.URL.createObjectURL(this.files[0]) ;

        var formData= new FormData();
        var apptoken=localStorage.getItem("apptoken");
        formData.append("file",$("#uploaderInputB")[0].files[0]);
        var data=["",JSON.stringify({"apptoken":apptoken})];
        var json=jsEncryptData(data);
        formData.append("data",json);
        console.log(formData);
        $.ajax({
            type:"POST",
            url:url+"UserCenter_uploadOwnerApplicationPic",
            fileElementId:'uploaderInputB',
            data:formData,
            processData : false,
            contentType : false,
            secureuri:false,
            success : function(data){
                // 解密
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    console.log(data.data.file_path);
                    localStorage.setItem("myPicB",data.data.file_path);
                    $(".flockHeadB img").attr("src",Url);
                    $(".loaderB").attr("style","position:absolute;left:40%;opacity: 0;");
                    $(".flockHeadB").attr("style","display:block");
                }
            },
            error:function (data) {
                console.log(data);
            }
        });
    });
});