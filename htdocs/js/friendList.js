$.ajax({
    url:url+"friends_getGroup&debugging=test",
    type:'post',
    success:function(data){
        console.log(data);
        if(data.errcode=114){
            window.location.href='index.html';
        }
    }

});


$(document).ready(function(){
    // 强制跳转到登录页面

    //联系人
         $(".LinkBtn").click(function(e){
             console.log($(e.target));
            if($(this).next().is(":hidden")){
                $(this).next().show();
                $(this).children().children("img").css("transform","rotate(90deg)");
                   }else{
                $(this).next().hide();
                $(this).children().children("img").css("transform","rotate(0deg)");
                //$('.linkBtn').removeAttr("style")
            }
         });
});


