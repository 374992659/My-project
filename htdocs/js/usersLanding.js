$(document).ready(function(){
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
    $(".weui-btn").click(function(){
        var code=$(".captcha").val(),
            proId=$(this).val(),
            cityId=$(this).val();
        info=['', JSON.stringify({"code":code,"proId":proId,"cityId":cityId})];
        console.log(info);
        var f=jsEncryptData( info );
        console.log(f);
    });





});