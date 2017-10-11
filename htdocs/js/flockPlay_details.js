$(document).ready(function(){
    "use strict";
        // 获取apptoken
    var apptoken=localStorage.getItem("apptoken");
        // 获取群号
    var group_num=localStorage.getItem("group)num");
        // 获取活动id
    var acticity_id=localStorage.getItem("acticity_id");
    // 数据格式转换
    var data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num,"acticity_id":acticity_id})];
     // 加密
    var jsonEncryptData=jsEncryptData(data);
    $.ajax({
        url:url+"group _getGroupActivityInfo",
        type:"POST",
        data:{"data":jsonEncryptData},
        success:function(data){
            // 解密
            var data=jsDecodeData(data);
            if(data.errcode===0){
                localStorage.setItem("apptoken",data.apptoekn);
                var html=`
                
                
                
                
                `;
                $("").html(html);
            }
        }
    })
});