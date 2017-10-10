$(document).ready(function(){
    // 获取群号码
    var code=localStorage.getItem("group_num");
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    // 获取投票id
    var vote_id=localStorage.getItem("vote_id");
    // 数据格式转换
    data =["",JSON.stringify({"apptoken":apptoken,"group_nue":code,"vote_id":vote_id})];
// 加密
    jsonEncryptData=jsEncryptData(data);
    $.ajax({
        url:url+"group_getVoteInfo",
        type:"POST",
        data:{"data":jsonEncryptData},
        success:function (data) {
            // 解密
            data=jsDecodeData(data);
            if(data.errcode===0){
                localStorage.setItem("apptoken",data.apptoken);
                var html=`
                
                
                
                
                `;

            }else{
                console.log(data.errmsg);
            }
        }
    })
});