$(document).ready(function(){
    //获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    var data=["",JSON.stringify({"apptoken":apptoken})];
    var jsonEncryptData=jsEncryptData(data);
    //功能1 获取好友分组
    (function () {
        $.ajax({
            url:url+"friends_getGroup",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    var html="";
                    localStorage.setItem("apptoken",data.apptoken);
                    $.each(data.data,function(i,item){
                        html+=`
                <option>${item.group_name}</option>>
                             
                `
                    });
                    $("#group").html(html)
                }

            }

        })
    })();
   //功能二 获取好友资料
    (function () {
        $.ajax({
            url:url+"",

        })
    })();

});