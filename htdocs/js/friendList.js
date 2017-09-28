
$(document).ready(function(){
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
    if($_GET["openId"]){
        window.location.href="index.html?openId="+$_GET["openId"];
    }
     //强制跳转到登录页面
    var apptoken=localStorage.getItem("apptoken");
    data=['',JSON.stringify({'url':window.location.href,"apptoken":apptoken})];
    console.log(data);
    encreptdata = jsEncryptData(data);

     $.ajax({
         url:url+"friends_getGroup",
         data:{"data":encreptdata},
        type:'post',
          success:function(data){
             data=jsDecodeData(data);
             localStorage.setItem("apptoken",data.apptoken);
              console.log(data);
              var url=data.data;
              console.log(url);
            if(data.errcode===114){
                window.location.href=url;
            }


       }
    });
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


