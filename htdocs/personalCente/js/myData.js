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
        var success=$(".success");
        var hideTop=function(){
            success.empty()};
            // 获取apptoken
               var apptoken= localStorage.getItem("apptoken"),
            // 获取头像
                   portrait=localStorage.getItem("myPortrait"),
            // 获取昵称
                    nickname=$("#nickname").val(),
            // 获取真实姓名（可填）
                    realname=$("#name").val(),
            // 手机号（可填）
                    phone=$("#phone").val(),
            // 微信（可填）
                    wechat_num=$("#weixin").val(),
            // QQ（可填）
                    qq_num=$("#QQ").val(),
            // 常住小区（可填）
                    default_garden=$("#house").val(),
            // 出生年份（可填）
                    birth_year=$("#yearBirth option:selected").val(),
            // 出生月份（可填）
                    birth_month=$("#mouthBirth option:selected").val(),
            // 爱好（可填）
                    hobby=$("#likes").val(),
            // 数据格式转换
                    data=["",JSON.stringify({"apptoken":apptoken,"portrait":portrait,"nickname":nickname,"realname":realname,"phone":phone,"wechat_num":wechat_num,"qq_num":qq_num,"default_garden":default_garden,"birth_year":birth_year,"birth_month":birth_month,"hobby":hobby})],
            // 加密
                    jsonEncryptData=jsEncryptData(data);
                console.log(data);
        $.ajax({
            url:url+"UserCenter_updateUserInfo",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                // 解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    showHide(data.errmsg);
                    window.location.href="index.html";
                }else{
                    showHide(data.errmsg);
                }
            },
            error:function(){}
        })
    });
    // 生成二维码
    $("#qrcode").qrcode({
        width: 200,//二维码宽度
        height:200,//二维码高度
        text: 'http://www.baidu.com',//此处填写生成二维码的生成数据 （拼接了inviter_code的注册页面地址，注册页面在url中获取到inviter_code传递给后台注册接口）
    });
});