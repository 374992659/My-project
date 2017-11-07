$(document).ready(function(){
    // 获取个人账号
    var account=localStorage.getItem("account");
    $(".account").text(account);
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
    // 功能5 上传用户头像
    $('#uploaderInput').change(function(e) {
        var Url=window.URL.createObjectURL(this.files[0]) ;

        var formData= new FormData();
        var apptoken=localStorage.getItem("apptoken");
        formData.append("file",$("#uploaderInput")[0].files[0]);
        var data=["",JSON.stringify({"apptoken":apptoken})];
        var json=jsEncryptData(data);
        formData.append("data",json);
        console.log(formData);
        $.ajax({
            type:"POST",
            url:url+"group_uploadGroupP",
            fileElementId:'uploaderInput',
            data:formData,
            processData : false,
            contentType : false,
            secureuri:false,
            success : function(data){
                // 解密
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    console.log(data.data.file_path);
                    localStorage.setItem("myPortrait",data.data.file_path);
                    $(".flockHead img").attr("src",Url);
                    $(".loader").attr("style","position:absolute;left:40%;opacity: 0;");
                    $(".flockHead").attr("style","display:block");
                }
            },
            error:function (data) {
                console.log(data);
            }
        });
    });
    // 功能6 提交用户资料
    $(".finishBtn").click(function(){
        // 获取头像
        var portrait=localStorage.getItem("myportrait"),
       // 获取昵称
          nickname=$("#nickname").val(),
    });
});