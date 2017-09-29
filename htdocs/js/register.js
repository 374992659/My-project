$(document).ready(function(){
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    //
    var area_id=null;
    $("#city").change(function(){
        area_id=$(this).val();
        return area_id;
    });
    // var $_GET = (function() {
    //     var url = window.document.location.href.toString();
    //     var u = url.split("?");
    //     if (typeof(u[1]) == "string"){
    //         u = u[1].split("&");
    //         var get = {};
    //         for (var i in u) {
    //             var j = u[i].split("=");
    //             get[j[0]] = j[1];
    //         }
    //         return get;
    //     } else {
    //         return {};
    //     }
    // })();
    // var openId=$_GET['openId'];
    // 绑定点击事件提交数据
    $(".regBtn").click(function(){
        // 获取账号
        var numeber=$(".account").val();
        // 密码
         var password=$(".password").val();
         //
        var repassword=$(".repassword").val();
        // 数据加密
    info=['', JSON.stringify({"account":numeber,"area_id":area_id,"password":password,'repassword':repassword,"apptoken":apptoken})];
        console.log(info);
        // 加密后的数据
        var afterDate=jsEncryptData( info );
        console.log(afterDate);
        // ajax向后台传输数据
        $.ajax({
            url:"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=regiest&is_wap=1",
            type:"POST",
            data:{"data":afterDate},
            success:function(data){
                data=jsDecodeData( data );
                console.log(data.apptoken);
                localStorage.setItem("apptoken",data.apptoken);
                console.log(data);
                console.log(data.errcode);
                if(data.errcode===0){
                    alert(data.errmsg);
                   // window.location.href="friend.html";
                }else{
                    alert(data.errmsg);
                }
            }
        })

    });





});