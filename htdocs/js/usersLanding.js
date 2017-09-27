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






});