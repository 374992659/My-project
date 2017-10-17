$(document).ready(function(){
    "use strict";
    // 获取群内用户
    var getGroupUser=function(){
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken"),
        // 获取群号码
            group_num=localStorage.getItem("group_num");
        // 数据格式转换
        var data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num})],
        // 加密
            jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"group_getGroupUser",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                // 解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoekn);
                    var  html="";
                    for(var i=0;i<3;i++){
                        html+=$("<li class=\"lf\">\n" +
                            "                          <img src="+data.data[i].portrait+" alt=\"\">\n" +
                            "                      </li>")
                    }
                    $(".flockMember").prepend(html);
                }
            }
        })
    };getGroupUser();

});