$(document).ready(function(){
    $(".phoneBtn").click(function(){
        var phone=$(".phone").val();
       phone= jsEncryptData(phone);
        console.log(phone);
        $.ajax({
            url:"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=sendWxRegistMsg",
            type:"POST",
            data:"",
            success:function (data) {
                data=jsDecodeData( data );
                console.log(data);
            }

        });

    });






});