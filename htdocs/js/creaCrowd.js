$(document).ready(function(){
    $('#uploaderInput').change(function(e) {
        var targetElement = e.target,
            file = targetElement.files[0],
            url=window.URL.createObjectURL(this.files[0]) ;
        console.log(file);
        var fd = new FormData();
        fd.append('fileToUpload', file);
        localStorage.setItem("groupHeadPic",fd);
        if(url){
            $(".flockHead img").attr("src", url);
            $(".loader").attr("style","position:absolute;left:40%;opacity: 0;");
            $(".flockHead").attr("style","display:block");
        }

        $.ajax({
            url:url+"group_uploadGroupP",
            type:"POST",
            data:fd,
            cache : false,
            processData : false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
            contentType : false, // 不设置Content-type请求头
            success : function(data){
                "use strict";
                // 解密
                data=jsDecodeData(data);
                console.log(data);
            }
        })
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
        data=["",JSON.stringify({"group_name":name,"group_type":id,"apptoken":apptoken})];
        console.log(data);
        //加密数据
        jsonEncryptDate=jsEncryptData(data);
        //发起请求
        $.ajax({
            url:url+"group_addGroup",
            type:"POST",
            data:{"data":jsonEncryptDate,"data_"},
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

