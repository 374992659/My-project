$(document).ready(function(){
    "use strict";

    $('#uploaderInput').change(function() {
        var apptoken=localStorage.getItem("apptoken");
        var data=["",JSON.stringify({"apptoken":apptoken})];
        var json=jsEncryptData(data);
        $.ajaxFileUpload({
            url:url+"group_uploadGroupP", //用于文件上传的服务器端请求地址
            data:{"data":json},
            dataType : 'text',
            secureuri: false, //是否需要安全协议，一般设置为false
            fileElementId: 'uploaderInput', //文件上传域的ID
            success:function(data){
                //解密
                data=jsDecodeData(data);
                console.log(data);
                console.log(13);
            },
             error:function(data){
                 console.log(123);
             }//返回值类型 一般设置为json
        });
    //    var targetElement = e.target;
    //        console.log(targetElement);
    //         // url=window.URL.createObjectURL(this.files[0]) ;
    //    console.log($("#uploaderInput")[0].files[0]);
    //    var formData= new FormData();
    //    var apptoken=localStorage.getItem("apptoken");
    //    formData.append("file",$("#uploaderInput")[0].files[0]);
    //    var data=["",JSON.stringify({"apptoken":apptoken})];
    //    var json=jsEncryptData(data);
    //    formData.append("data",json);
    //    console.log(formData);
    //    $.ajax({
    //        type:"POST",
    //        url:url+"group_uploadGroupP",
    //        //fileElementId:'uploaderInput',
    //        data:formData,
    //        processData : false,
    //        contentType : false,
    //        //secureuri:false,
    //        success : function(data){
    //            // 解密
    //            data=jsDecodeData(data);
    //            console.log(data);
    //            console.log(123);
    //
    //        },
    //        error:function (data) {
    //            console.log(data);
    //        }
    //    });
        //上传前的预览
        //if(url){
        //    $(".flockHead img").attr("src", url);
        //    $(".loader").attr("style","position:absolute;left:40%;opacity: 0;");
        //    $(".flockHead").attr("style","display:block");
        //}
        //console.log(123);
    });


    $(".createBtn").click(function(){
        //获取图片
        var pic=localStorage.getItem("groupHeadPic");
        // 群名称
        var name=$("#flockName").val();
        // 群分类
        var  id=$("#flockClass option:selected").val();
        console.log(id);
        var apptoken=localStorage.getItem("apptoken");
        //数据格式转换
       var data=["",JSON.stringify({"group_name":name,"group_type":id,"apptoken":apptoken})];
        console.log(data);
        //加密数据
      var  jsonEncryptDate=jsEncryptData(data);
        //发起请求
        $.ajax({
            url:url+"group_addGroup",
            type:"POST",
            data:{"data":jsonEncryptDate},
            success:function(data){
                //解密数据
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    alert("good");
                    // window.location.href="createCrowd.html"
                }else{
                    if(data.errcode===114){
                        alert("");
                        //window.location.href="landing.html"
                    }else{
                        alert(data.errmsg);
                    }
                }
            }
        })
    });
});

