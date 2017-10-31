$(document).ready(function(){
        "use strict";
    //获取apptoken
        var getGroup=function(){
            var apptoken=localStorage.getItem("apptoken"),
            //数据格式转换
                data=["",JSON.stringify({"apptoken":apptoken})],
            //加密
                jsonEncryptData=jsEncryptData(data);
            console.log(jsonEncryptData);
            $.ajax({
                url:url+"friends_getGroup",
                type:"POST",
                data:{"data":jsonEncryptData},
                success:function(data){
                    //解密
                    data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        localStorage.setItem("apptoken",data.apptoken);
                        var html="";
                        $.each(data.data,function(i,item){
                            html+=`
            <div class="linkman" title="${item.id}">
                <!--我的好友-->
                <div class="weui-cells">
                    <div class="weui-cell LinkBtn"  title="${item.id}">
                        <div class="weui-cell__hd">
                            <img class="linkBtn" src="image/right.png">
                        </div>
                        <div class="weui-cell__bd">
                            <p style="font-size: 15px">${item.group_name}</p>
                        </div>
                        <div class="weui-cell__ft">
                            <span>${item.online_num}</span>/<span>${item.total}</span>
                        </div>
                    </div>
                    <!--我的好友个数-->
                    <div class="weui-panel weui-panel_access linkList" style="display: none">
                     <!--好友位置-->
                    </div>
                </div>
            </div>
                            `;
                        });
                        $(".friendList").append(html);
                    }else{
                        console.log(data.errmsg);
                    }
                }

            })

        };getGroup();


    }
);