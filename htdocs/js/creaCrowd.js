$(document).ready(function(){
    "use strict";
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

