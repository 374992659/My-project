$(document).ready(function(){
    // 图片验证码刷新
    $(".refreshImg").click(function(){
        console.log(123);
        var timestamp = new Date().getTime();
        $(this).attr('src',"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=getPicCode&p="+timestamp );
    });
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    //获取openId
    var openId=localStorage.getItem("openId");
    var area_id=null;
    $("#city").change(function(){
        area_id=$(this).val();
        return area_id;
    });
    $(".regBtn").click(function(){
        // 获取账号
        var numeber=$(".account").val();
        // 密码
         var password=$(".password").val();
         //重复密码
        var repassword=$(".repassword").val();
        // 获取验证码
        var  code=$(".code").val();
        var openId=localStorage.getItem("openId");
        // 数据加密
    info=['', JSON.stringify({"openId":openId,"account":numeber,"area_id":area_id,"password":password,'repassword':repassword,"apptoken":apptoken,"piccode":code})];
        console.log(info);
        // 加密后的数据
        var afterDate=jsEncryptData(info);
        console.log(afterDate);
        // ajax向后台传输数据
        $.ajax({
            url:"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=regiest&is_wap=1",
            type:"POST",
            data:{"data":afterDate},
            success:function(data){
                data=jsDecodeData( data );
                localStorage.setItem("apptoken",data.apptoken);
                if(data.errcode===0){
                    var  cityID=$("#city option:selected").val();
                    localStorage.setItem("city_id",cityID);
                   showHide(data.errmsg);
                   window.location.href="index.html";
                }else{
                    showHide(data.errmsg);
                }
            }
        })

    });





});