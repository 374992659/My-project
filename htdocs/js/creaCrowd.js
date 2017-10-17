$(document).ready(function(){
    "use strict";

    $('#uploaderInput').change(function(e) {
        // var apptoken=localStorage.getItem("apptoken");
        // var data=["",JSON.stringify({"apptoken":apptoken})];
        // var json=jsEncryptData(data);
        // $.ajaxFileUpload({
        //     url:url+"group_uploadGroupP", //用于文件上传的服务器端请求地址
        //     type:"post",
        //     data:{"data":json},
        //     dataType:"text",
        //     fileElementId: 'uploaderInput', //文件上传域的ID
        //     success:function(data){
        //         //解密
        //         data=jsDecodeData(data);
        //         var str = $(data).find("body").text();//获取返回的字符串
        //         var json = $.parseJSON(str);//把字符串转化为json对象
        //         console.log(data);
        //         console.log(json);
        //     },
        //      error:function(XMLHttpRequest, textStatus, errorThrown,data){
        //         console.log(data);
        //          console.log(XMLHttpRequest.status);
        //          console.log(XMLHttpRequest.readyState);
        //          console.log(textStatus);
        //          console.log(123);
        //      }//返回值类型 一般设置为json
        // });
     var targetElement = e.target;
   //          console.log(targetElement);
   var Url=window.URL.createObjectURL(this.files[0]) ;
   //      console.log(url);
        var formData= new FormData();
       var apptoken=localStorage.getItem("apptoken");
        formData.append("file",$("#uploaderInput")[0].files[0]);
        var data=["",JSON.stringify({"apptoken":apptoken})];
       var json=jsEncryptData(data);
        formData.append("data",json);
       console.log(formData);
        $.ajax({
            type:"POST",
            url:url+"group_uploadGroupP",
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
                   console.log(data.data.file_path);
                   localStorage.setItem("createCrowdPic",data.data.file_path);
                   $(".flockHead img").attr("src",Url);
                   $(".loader").attr("style","position:absolute;left:40%;opacity: 0;");
                   $(".flockHead").attr("style","display:block");
               }
            },
           error:function (data) {
                console.log(data);
           }
       });
    });


    $(".createBtn").click(function(){
        //获取图片
        var pic=localStorage.getItem("createCrowdPic");
        // 群名称
        var name=$("#flockName").val();
        // 群分类
        var  id=$("#flockClass option:selected").val();
        console.log(id);
        var apptoken=localStorage.getItem("apptoken");
        //数据格式转换
       var data=["",JSON.stringify({"group_name":name,"group_type":id,"apptoken":apptoken,"group_portrait":pic})];
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
                    var html=`
                    <p style="text-align: center;background: green;color: white">创建成功</p>
                    `;
                    $(".success").append(html);
                    window.location.href="createCrowd.html"
                }else{
                    if(data.errcode===114){
                      
                        window.location.href="landing.html"
                    }else{
                        alert(data.errmsg);
                    }
                }
            }
        })
    });
});

