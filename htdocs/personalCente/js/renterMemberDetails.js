$(document).ready(function(){
    //apptoken
    var apptoken=localStorage.getItem("apptoken");
    // 参数：application_id 认证id
    var application_id=localStorage.getItem("application_id");
    // 参数：city_id 城市id
    var city_id=localStorage.getItem("renterCity_id");
    // 数据格式转换
    var data=["",JSON.stringify({"apptoken":apptoken,"application_id":application_id,"city_id":city_id})];
    // 加密
    var jsonEncryptData=jsEncryptData(data);
    console.log(data);
    $.ajax({
        url:url+"UserCenter_getTenantNumInfo",
        type:"POST",
        data:{"data":jsonEncryptData},
        success:function(data){
            // 解密
            var data=jsDecodeData(data);
            console.log(data);
            if(data.errcode===0){
                localStorage.setItem("apptoken",data.apptoken);

            }
        },
        error:function(){}
    })

});
