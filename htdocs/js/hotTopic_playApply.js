$(document).ready(function(){
    "use strict";
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    // 获取活动id
    var activity_id=localStorage.getItem("activity_id");
    //城市id
    var city_id=localStorage.getItem("city_id");
    //验证手机的正确性
    $("#phone").blur(function(){
        var phone=$("#phone").val();
        validate4(phone)
    });
    // 绑定点击事件
    $(".Btn").click(function(){
        // 获取姓名
        var name=$("#name").val();
        //   电话
        var phone=$("#phone").val();
        // 人数
        var number=$("#number").val();
        // 数据格式转换
        var  data=["",JSON.stringify({"apptoken":apptoken,"activity_id":activity_id,"name":name,"phone":phone,"num":number,"city_id":city_id})];
        // 加密
        var jsonEncryptData=jsEncryptData(data);
        console.log(data);
        !name?alert("没有姓名"):
            !phone?alert("电话"):
                !number?alert("报名人数"):
                    $.ajax({
                        url:url+"Activity_enrollActivity",
                        type:"POST",
                        data:{"data":jsonEncryptData},
                        success:function(data){
                            // 解密
                            var data=jsDecodeData(data);
                            console.log(data);
                            if(data.errcode===0){
                                localStorage.setItem("apptoken",data.apptoken);
                                showHide(data.errmsg);
                                // window.location.href="";
                            }else{
                                showHide(data.errmsg)
                            }
                        }
                    })
    })
});