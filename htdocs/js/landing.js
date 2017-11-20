$(document).ready(function(){
    // 账号登录发起ajax请求
    $(".accregBtn").click(function(){
        function goBack(){
            window.history.back()
        }
        var apptoken=localStorage.getItem("apptonken");
        // 获取用户输入的账号
        var account=$(".account").val();
        console.log(account);
        // 获取用户输入的密码
        var password=$(".password").val();
        console.log(password);
        var openId=localStorage.getItem("openId");
        // 转换数据格式为json
        data=["",JSON.stringify({"openId":openId,"account":account,"password":password,"apptoken":apptoken})];
        console.log(data);
        // 对数据进行aes加密
        var jsonEncryptDate=jsEncryptData(data);
        console.log(jsonEncryptDate);
        $.ajax({
            url:"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=accountLogin&is_wap=1",
            type:"POST",
            data:{"data":jsonEncryptDate},
            success:function(data){
                console.log(data);
                // 解密返回的数据
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    // 把apptoken存在本地
                    localStorage.setItem("apptoken",data.apptoken);
                    if(document.referrer==="http://wx.junxiang.ren/project/htdocs/personalCente/"){
                        goBack();
                    }else{
                        window.location.href="index.html";
                    }
                }else{
                    showHide(data.errmsg)
                }
            }
        });
    });

// 电话号码登录
    // 向手机发送验证码
    $(".getCodeBtn").click(function(){
        var apptoken=localStorage.getItem("apptonken");
        var phone=$(".phone").val();
        console.log(phone);
        // 转换数据格式json
        data=["",JSON.stringify({"phone":phone,"apptoken":apptoken})];
        // 加密数据
        console.log(data);
        jsonEncryptDate=jsEncryptData(data);
        console.log(jsonEncryptDate);
        $.ajax({
            url:"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=sendPhoneLogin&is_wap=1",
            type:"POST",
            data:{"data":jsonEncryptDate},
            success:function(data){
                   // 解密返回的数据
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    // 保存apptoken
                    localStorage.setItem("apptoken",data.apptoken);
                    console.log(data.errcode);
                    function invokeSettime(obj){
                        var countdown=60;
                        settime(obj);
                        function settime(obj) {
                            if (countdown == 0) {
                                $(obj).attr("disabled",false);
                                $(obj).text("获取验证码");
                                countdown = 60;
                                return;
                            } else {
                                $(obj).attr("disabled",true);
                                $(obj).text("(" + countdown + ") s 重新发送");
                                countdown--;
                            }
                            setTimeout(function() {
                                    settime(obj) }
                                ,1000)
                        }
                    }
                    new invokeSettime(".getCodeBtn");

                }else{

                }
            }
        });
        return phone;
    });

    // 登录
    $(".phoneregBtn").click(function(){
        function goBack(){
            window.history.back()
        }
        // 获取验证码
        var phone=$(".phone").val();
        var code=$(".code").val();
        var apptoken=localStorage.getItem("apptonken");
        // 数据格式转换
        data=["",JSON.stringify({"smscode":code,"phone":phone,"apptoken":apptoken})];
        console.log(data);
        // 数据加密
        jsonEncryptDate=jsEncryptData(data);
        $.ajax({
            url:"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=phoneLogin&is_wap=1",
            type:"POST",
            data:{"data":jsonEncryptDate},
            success:function(data){
                // 数据解密
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    goBack();
                    showHide(data.errmsg);
                    window.location.href="index.html"
                }else{
                    showHide(data.errmsg)
                }
            }
        })

    });
});