$(document).ready(function(){
    //拉取微信授权
    (function(){
        var latitude="";
        var longitude="";
        // 1.
        $.ajax({
            url:'http://39.108.237.198/project/index.php?m=Api&c=JsSdk&a=getSignPackage&debugging=test',
            type:'POST',
            data : {'url':location.href},
            success:function(data){
                console.log(data);
              var  signature = data.data;
                wx.config({
                    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: signature.appId, // 必填，公众号的唯一标识
                    timestamp: signature.timestamp, // 必填，生成签名的时间戳
                    nonceStr:  signature.nonceStr, // 必填，生成签名的随机串
                    signature:  signature.signature,// 必填，签名，见附录1
                    jsApiList: [  ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
            }
        });
        // 2判断当前版本是否支持
        wx.checkJsApi({
            jsApiList: ['chooseImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function(res) {
                // 以键值对的形式返回，可用的api值true，不可用为false
                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
            }
        });
        //通过ready接口处理成功验证
        wx.ready(function(){
            wx.getLocation({
                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function (res) {
                    console.log("获取地理坐标正确");
                     latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                     longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    var speed = res.speed; // 速度，以米/每秒计
                    var accuracy = res.accuracy; // 位置精度

                },
                fail:function(){
                    console.log("获取地理坐标错误");
                }
            });
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        });
    })();
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
    info=['', JSON.stringify({"openId":openId,"account":numeber,"area_id":area_id,"password":password,'repassword':repassword,"apptoken":apptoken,"piccode":code,"inviter_code":inviter_code})];
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

    });

});