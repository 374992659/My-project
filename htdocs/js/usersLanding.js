$(document).ready(function(){
    var proId=null;
    var cityId=null;
    $(".phoneBtn").click(function(){
        var phone=$(".phone").val();
         phone = ['', JSON.stringify({"phone":phone})];
        var ph = jsEncryptData( phone );
        console.log(phone);
        $.ajax({
            url:"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=sendWxRegistMsg&is_wap=1",
            type:"POST",
            data:{"data":ph},
            success:function (data) {
                data=jsDecodeData( data );
                console.log(data);
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
        cityId=$(this).val();
        console.log(cityId);
        return cityId
    });
    // 绑定点击事件提交数据
    $(".weui-btn").click(function(){
        // 获取验证码
        var code=$(".cap").val(),
        // 数据加密
        info=['', JSON.stringify({"code":code,"proId":proId,"cityId":cityId})];
        console.log(info);
        // 加密后的数据
        var afterDate=jsEncryptData( info );
        console.log(afterDate);
        // ajax向后台传输数据
        $.ajax({
            url:"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=sendWxRegistMsg&is_wap=1",
            type:"POST",
            data:{"data":afterDate},
            success:function(data){
                data=jsDecodeData( data );
                console.log(data);
                console.log(data.errcode);
                if(data.errcode===0){
                    window.location.href="friend.html";
                }
            }
        })

    });





});