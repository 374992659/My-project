$(document).ready(function(){
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    // 省的id
    var proId=null;
    // 市的id
    var area_id=null;
    $(".phoneBtn").click(function(){
        // 获取手机号码发送验证码
        var phone=$(".phone").val();
        // 转换数据格式
         phone = ['', JSON.stringify({"phone":phone})];
         // 手机号加密
        var ph = jsEncryptData( phone );
        console.log(phone);
        // 向后台传送加密电话数据
        $.ajax({
            url:"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=sendWxRegistMsg&is_wap=1",
            type:"POST",
            data:{"data":ph},
            success:function (data) {
                data=jsDecodeData( data );
                console.log(data);
                if(data.errcode===0){
                    alert()
                }else{
                    alert(data.errmsg);
                }
            }
        });
    });

    // 获取省value值
    $("#province").change(function(){
        proId=$(this).val();
        console.log(proId);
        return proId
    });
    // 获取市value值
    $("#city").change(function(){
        area_id=$(this).val();
        console.log(area_id);
        return area_id
    });
    var $_GET = (function() {
        var url = window.document.location.href.toString();
        var u = url.split("?");
        if (typeof(u[1]) == "string"){
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
    var openId=$_GET['openId'];
    // 绑定点击事件提交数据
    $(".landBtn").click(function(){
        // 获取验证码
        var smscode=$(".cap").val();
        // 获取手机号
         var phone=$(".phone").val();
        // 数据加密
        info=['', JSON.stringify({"smscode":smscode,"area_id":area_id,"phone":phone,'openId':openId,"apptoken":apptoken})];
        console.log(info);
        // 加密后的数据
        var afterDate=jsEncryptData( info );
        console.log(afterDate);
        // ajax向后台传输数据
        $.ajax({
            url:"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=wxBindPhone&is_wap=1",
            type:"POST",
            data:{"data":afterDate},
            success:function(data){
                data=jsDecodeData( data );
                localStorage.setItem("apptoken",data.apptoken);
                console.log(data);
                console.log(data.errcode);
                if(data.errcode===0){
                    window.location.href="friend.html";
                }else{
                    alert(data.errmsg);
                }
            }
        })

    });





});