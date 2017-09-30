$(document).ready(function(){
    //
    var phone=null;
    // 获取用户输入的账号
    var account=$(".account").val();
    // 获取用户输入的密码
    var password=$(".password").val();
    // 获取apptoken
    var apptoken=localStorage.getItem("apptonken");
    // 转换数据格式为json
    data=["",JSON.stringify({"account":account,"password":password,"apptoken":apptoken})];
    // 对数据进行aes加密
    var jsonEncryptDate=jsEncryptData(data);
    console.log(jsonEncryptDate);
    // 账号登录发起ajax请求
    $.ajax({
        url:"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=login&is_wap=1",
        type:"POST",
        data:{"data":jsonEncryptDate},
        success:function(data){
            // 解密返回的数据
            data=jsDecodeData(data);
            // 把apptoken存在本地
            localStorage.setItem("apptoken",data.apptoken);
            if(data.errcode===0){
                window.location.href="friend.html";
            }else{
                alert(data.errmsg);
            }
        }


    });
    // 电话号码登录
    //    向手机发送验证码
    $(".getCodeBtn").click(function(){
        var phone=$(".phone").val();
        console.log(phone);
        // 转换数据格式json
        data=["",JSON.stringify({"phone":phone,"apptoken":apptoken})];
        // 加密数据
        jsonEncryptDate=jsEncryptData(data);
        console.log(jsonEncryptDate);
        $.ajax({
            url:"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=sendPhoneLogin$is_wap=1",
            type:"POST",
            data:{"phone":phone},
            success:function(data){
                   // 解密返回的数据
                data=jsDecodeData(data);
                // 保存apptoken
                    localStorage.setItem("apptoken",apptoken);
                if(data.errcode===0){
                    console.log(data.errcode)
                }

            }

        });
        return phone;
    });
    // 登录
    $(".regBtn").click(function(){
        // 获取验证码
        var code=$(".code").val();
        // 数据格式转换
        data=["",JSON.stringify({"smscode":code,"phone":phone})];
        // 数据加密
        jsonEncryptDate=jsEncryptData(data);
        $.ajax({
            url:"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=phoneLogin&is_wap",
            type:"POST",
            data:{"data":jsonEncryptDate},
            success:function(data){
                // 数据解密
                data=jsDecodeData(data);
                if(data.errcode===0){
                    window.location.href="friend.html"
                }else{
                    alert(data.errmsg);
                }
            }
        })

    });
});