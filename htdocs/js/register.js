$(document).ready(function(){
    var $_GET = (function() {
        var url = window.document.location.href.toString();
        var u = url.split("?");
        if (typeof(u[1]) == "string") {
            u = u[1].split("&");
            var get = {};
            for (var i in u) {
                var j = u[i].split("=");
                get[j[0]] = j[1];
            }
            return get;
        } else {
            return {};
        }
    })();
    var inviter_code=$_GET["inviter_code"];
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
    //验证输入为汉字就删除
    //(function(){
    //    $(".account").on("input",function(){
    //        var Chinese=$(".account").val();
    //        var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
    //        if(reg.test(Chinese)){
    //            $(".account").value="";
    //        }
    //    })
    //})();
    //验证账号位数
    (function(){
       $(".account").blur(function(){
           var numeber=$(".account").val();
           if(numeber.length<6){
               alert("账号太短");
           }
       });


    })();
    //验证密码的位数
    (function(){
        $(".password").blur(function(){
            var password=$(".password").val();
            console.log(password.length);
            if(password.length<6){
                alert("密码太短");
            }
        });
    })();
    $(".regBtn").click(function(){
        var title=$(".this").attr("title");
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
    info=['', JSON.stringify({"openId":openId,"account":numeber,"longitude":longitude,"password":password,'repassword':repassword,"apptoken":apptoken,"latitude":latitude,"inviter_code":inviter_code})];
        console.log(info);
        // 加密后的数据
        var afterDate=jsEncryptData(info);
        console.log(afterDate);
        if(parseInt(title)===0){

        }
        if(password===repassword){
            // ajax向后台传输数据
            $.ajax({
                url:"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=regiest&is_wap=1",
                type:"POST",
                data:{"data":afterDate},
                success:function(data){
                    data=jsDecodeData(data);
                    if(data.errcode===0){
                        localStorage.setItem("apptoken",data.apptoken);
                        var  cityID=$("#city option:selected").val();
                        localStorage.setItem("city_id",cityID);
                        showHide(data.errmsg);
                        window.location.href="index.html";
                    }else{
                        showHide(data.errmsg);
                        //alert(data.data)
                    }
                }
            })
        }else{
            alert("两次密码不一直请重新输入");
        }


    });

});