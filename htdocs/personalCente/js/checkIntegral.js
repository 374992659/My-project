$(document).ready(function(){
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    //获取积分记录
    (function () {
        var data=["",JSON.stringify({"apptoken":apptoken})];
        var jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"UserCenter_getMyPointRecord",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function (data) {
                console.log(data);
                //解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    var html="";
                    $.each(data.data,function (i,item) {
                        if(parseInt(item.type)===1){//加分
                            html+=`
                    <tr>
                        <td>${item.name}</td>
                        <td></td>
                        <td>+</td>
                        <td>${item.value}</td>
                    </tr>
                        
                        `
                        }else{//减分
                            html+=`
                    <tr>
                        <td>${item.name}</td>
                        <td></td>
                        <td>-</td>
                        <td>${item.value}</td>
                    </tr>
                        
                        `
                        }

                    });
                    $(".integralBox").append(html)
                }

            }

        })
    })();
    $(".integralInform").click(function(){
        var data=["",JSON.stringify({"apptoken":apptoken})];
        var jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"UserCenter_pointNoticeWords",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function (data) {
                console.log(data);
                //解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken)
                }

            }
        })
    });

});