$(document).ready(function(){
    var group_header=localStorage.getItem("group_header"),
        // 获取apptoken
        apptoken=localStorage.getItem("apptoken"),
        // 获取群号码
        group_num=localStorage.getItem("group_num"),
        // 数据格式转换
        data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num})],
        // 加密
        jsonEncryptData=jsEncryptData(data);
        console.log(data);
    $.ajax({
        url:url+"group_getGroupUser",
        type:"POST",
        data:{"data":jsonEncryptData},
        success:function(data){
            //解密
            var data=jsDecodeData(data);
            console.log(data);
            if(data.errcode===0){
                localStorage.setItem("apptoken",data.apptoken);

            }
        },
        error:function(){}
    })

});