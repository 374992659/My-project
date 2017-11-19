$(document).ready(function(){
    // 获取apptoken
    $(".integralInform").click(function(){
        var apptoken=localStorage.getItem("apptoken");
        var data=["",JSON.stringify({"apptoken":apptoken})];
        var jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"UserCenter_pointNoticeWords",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function (data) {
                //解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken)
                }

            }
        })
    });

});