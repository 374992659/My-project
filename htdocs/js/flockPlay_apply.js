$(document).ready(function(){
    "use strict";
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    // 获取群号
    var group_num=localStorage.getItem("group_num");
    // 获取活动id
    var activity_id=localStorage.getItem("activity_id");
    // 绑定点击事件
    $(".Btn").click(function(){
        // 获取姓名
        var name=$("#name").val();
        //   电话
        var phone=$("#phone").val();
        // 人数
        var number=$("#number").val();
        // 所属小区
        var plot=$("#ploct").val();
        // 人均消费
        var consume=$("#consime").val();
        // 数据格式转换
       var  data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num,"activity_id":activity_id,"name":name,"phone":phone,"number":number,"plot":plot,"consume":consume})];
        // 加密
        var jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"group_enrollGroupActivity",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                // 解密
                var data=jsDecodeData(data);
                console.log(data);
                var success=$(".success");
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);

                    success.show();
                    // 定时器
                    $(function(){
                        function hidden(){
                            success.hide();
                        }
                        setInterval(hidden,3000);
                    });
                }else{
                    console.log(data.errmsg);
                    success.html(data.errmsg);
                    success.attr("color",red);
                    success.show();
                    // 定时器
                    $(function(){
                        function hidden(){
                            success.hide();
                        }
                        setInterval(hidden,3000);
                    });
                }
            }
        })
    })
});