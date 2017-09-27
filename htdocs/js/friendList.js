


$(document).ready(function(){
      $.post(url+"friends_getGroup&debugging=test","",function(data){
        data=jsDecodeData(data);
          console.log(data);
         console.log(data.errcode);
         if(data.errcode=114){
             window.location.href='index.html';

          }

     });
     //强制跳转到登录页面
    // $.ajax({
    //      url:url+"friends_getGroup",
    //     type:'post',
    //      success:function(data){
    //          data=jsDecodeData(data);
    //          console.log(data);
    //          var result=data.data;
    //
    //
    //
    //          // if(data.errcode=114){
    //         //     window.location.href='index.html';
    //          // }
    //    }
    // });
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


