$(document).ready(function(){
    //获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    var data=["",JSON.stringify({"apptoken":apptoken})];
    var jsonEncryptData=jsEncryptData(data);
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
                html+=`
                <option></option>>
                             
                `
            }

        }

    })

});