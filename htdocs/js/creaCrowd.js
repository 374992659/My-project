$(document).ready(function(){
    "use strict";
    $('#form').change(function(e) {
        var targetElement = e.target;
            console.log(targetElement);
             // url=window.URL.createObjectURL(this.files[0]) ;
       
        var fd = new FormData();
        var apptoken=localStorage.getItem("apptoken");
        var data=["",JSON.stringify({"apptoken":apptoken})];
        var json=jsEncryptData(data);
        fd.append('data',json);

        // localStorage.setItem("groupHeadPic",fd);

        console.log(data);
        $.ajax({
            type:"POST",
            url:url+"group_uploadGroupP",
            fileElementId:'uploaderInput',
            data:json,
            secureuri:false,
            success : function(data){
                // 解密
                data=jsDecodeData(data);
                console.log(data);
                console.log(123);

            },
            error:function (data) {
                console.log(data);
            }
        });
        if(url){
            $(".flockHead img").attr("src", url);
            $(".loader").attr("style","position:absolute;left:40%;opacity: 0;");
            $(".flockHead").attr("style","display:block");
        }
        console.log(123);
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

