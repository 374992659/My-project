$(document).ready(function(){
    // 刷新验证码
    $(".refreshImg").click(function(){
        // 获取时间戳
        var timestamp = new Date().getTime();
        console.log(timestamp);
        $(this).attr('src',"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=getPicCode&p="+timestamp );
    });
    // 功能1 获取验证手机验证码
    $(".weui-vcode-btn").click(function(){
        // 获取电话号码
        var phone=$("#phone").val();
        console.log(phone);
    });
    // 功能2 查看两次密码是否一致
    $("#rePassword").blur(function(){
        console.log(123);
        // 获取密码
        var password=$("#password").val(),
        // 获取重复密码
            rePassword=$("#rePassword").val();
        // 比较两个密码
        console.log(password);
        console.log(rePassword);
        if(password!=rePassword){
            alert("两次密码不一致")
        }
    });
    // 功能4 检测手机号是否正确
    $("#phone").blur(function(){
        var phone=$("#phone").val();
        if(!(/^1[34578]\d{9}$/.test(phone))){
          //  alert("手机号码有误，请重填");
            return false;
        }
    });
    // 功能3 提交用户资料
    $(".finishBtn").click(function(){
        // 获取姓名
        // 电话
        // 密码
        // 重复密码




    })
});