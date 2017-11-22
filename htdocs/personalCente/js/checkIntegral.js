$(document).ready(function(){
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    //获取积分记录
    (function () {
        var data=["",JSON.stringify({"apptoken":apptoken})];
        var jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"UserCenter_getMyPointRecord",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function (data) {
                console.log(data);
                //解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken)
                }

            }

        })
    })();
    $(".integralInform").click(function(){
        var data=["",JSON.stringify({"apptoken":apptoken})];
        var jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"UserCenter_pointNoticeWords",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function (data) {
                console.log(data);
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