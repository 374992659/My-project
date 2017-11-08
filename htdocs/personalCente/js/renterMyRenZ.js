$(document).ready(function(){
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        // 数据格式转换
        var data=["",JSON.stringify({"apptoken":apptoken})];
        // 加密
        var jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"UserCenter_getMyTenantApplicationInfo",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                // 解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    var html="";
                    $.each(data.data,function(i,item){
                        console.log(item);
                    })
                }

            },
            error:function(){}
        })
    });