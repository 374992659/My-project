$(document).ready(function(){
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken"),
    // 数据格式转换
     data=["",JSON.stringify({"apptoken":apptoken})],
    // 加密
     jsonEncryptData=jsEncryptData(data);
    console.log(data);
    $.ajax({
        url:url+"UserCenter_getApplicationGarden",
        type:"POST",
        data:{"data":jsonEncryptDate},
        success:function(data){
            // var 解密
            var data=jsDecodeData(data);
            console.log(data);
            if(data.errcode===0){
                localStorage.setItem("apptoken",data.apptoken)
            }

        },
        error:function(){}
    })
});