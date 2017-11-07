$(document).ready(function(){
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    // 进入页面请求接口加载页面如果没人有登录跳转到登录页面
    (function(){
        // 数据格式转换
        var data=["",JSON.stringify({"apptoekn":apptoken})],
            // 加密
            jsonEncryptData=jsEncryptData(data);
        console.log(data);
        console.log(jsonEncryptData);
        $.ajax({
            url:url+"UserCenter_getMyInfo",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                // 解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.ercode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    html=`                                      
                    `
                }else{
                    // window.location.href="http://wx.junxiang.ren/project/htdocs/landing.html"
                }
            },
            error:function(){}
        })
    })();
    // 验证手机号

    // 验证身份证号
    $(".Identity").blur(function(){
        // 获取身份证号
        var Identity_code=$(this).val();
        if(!(/^d{15}|d{}18$/.test(Identity_code))){
             alert("身份证有误，请重填");
            return false;
        }
    });
});