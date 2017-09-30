// 功能修改密码
$(document).ready(function(){
    // a、获取验证码
    $(".getCodeBtn").click(function(){
        // 获取手机号码
        var phone=$(".phone").val();
        var apptoken=localStorage.getItem("apptoken");
        console.log(phone);
        // 转换数据格式json
        data=["",JSON.stringify({"phone":phone,"apptoken":apptoken})];
        // 数据加密
        jsonEncryptDate=jsEncryptData(data);
        // 发起ajax请求
        $.ajax({
            url:"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=sendPhoneLogin&is_wap=1",
            type:"POST",
            data:{"data":jsonEncryptDate},
            success:function(data){
                // 数据解密
                data=jsDecodeData(data);
                localStorage.setItem("apptoken",data.apptoken);
                if(data.errcode===0){
                    console.log(data.errmsg);
                }
            }
        })
    });
    // 修改密码
    $(".changePasswordBtn").click(function(){
        // 获取手机号码
        var phone=$(".phone").val();
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken"),
        // 获取验证码
            getCode=$(".code").val(),
        // 获取新密码
            newpasword=$(".newpassword").val(),
        // 获取重填密码
            repasword=$(".repassword").val();
        // 对传送数据进行转换
        data=["",JSON.stringify({"apptoken":apptoken,"phone":phone,"smscode":getCode,"newpwd":newpasword,"renewpwd":repasword})];
        console.log(data);
        // 对数据进行加密
        jsonEncryptDate=jsEncryptData(data);
        // 发起ajax请求
        $.ajax({
            url:"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=forgetPasswor&is_wap=1",
            type:"POST",
            data:{"data":jsonEncryptDate},
            success:function(data){
                // 解密返回的数据
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    alert("修改密码正确");
                    window.location.herf="landing.html"
                }else{
                    alert(data.errmsg);
                }
            }
        })

    });

});