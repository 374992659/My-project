$(document).ready(function(){
        "use strict";
    //获取apptoken
    var apptoken=localStorage.getItem("apptoken"),
        //数据格式转换
        data=["",JSON.stringify({"apptoken":apptoken})],
        //加密
        jsonEncryptData=jsEncryptData(data);
        console.log(jsonEncryptData);
        $.ajax({
            url:url+"friends_getGroup",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
               //解密
                var data=jsDecodeData(data);
                console.log(data);
            }

        })

    }
);