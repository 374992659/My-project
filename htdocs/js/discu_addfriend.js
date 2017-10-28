$(document).ready(function(){"use strict";
//加载好友分组
    var getGroup=function(){
        //获取apptoken
        var apptoken=localStorage.getItem("apptoken"),
        //数据转换
            data=["",JSON.stringify({"apptoken":apptoken})],
        //加密
            jsonEncryptData=jsEncryptData(data);
        console.log(data);
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
            },
            error:function(){}

        })
    };getGroup();
//加载好友分组下的好友
    var getGroup_friend=function(){
        //    获取apptoken
        var apptoken=localStorage.getItem("apptoken"),
        //    获取分组id
            group_id=$(this).attr("title"),
        //数据格式转换
            data=["",JSON.stringify({"apptoken":apptoken,"group_id":group_id})],
        //        加密
            jsonEncryptData=jsEncryptData(data);
        console.log(data);

        $.ajax({
            url:url+"friends_getGroupFriends",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                //解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    var html="";
                    $.each(data.data,function(i,item){
                        if(item.group_id==group_id){
                            html+=`
                        <div class="weui-cells weui-cells_checkbox">
                            <label class="weui-cell weui-check__label" for="s1">
                                <div class="weui-cell__hd">
                                    <input type="checkbox" class="weui-check" name="checkbox1" id="s1" title="${item.friend_user_code}">
                                    <i class="weui-icon-checked"></i>
                                </div>
                                <div class="weui-cell__bd">
                                    <div class="weui-panel__bd">
                                        <div  class="weui-media-box weui-media-box_appmsg">
                                            <div class="weui-media-box__hd">
                                                <img class="weui-media-box__thumb" src="${item.friend_portrait}">
                                            </div>
                                            <div class="weui-media-box__bd">
                                                <h4 class="weui-media-box__title">${item.friend_nickname}</h4>
                                                <!--<p class="weui-media-box__desc">个人说明</p>-->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </label>
                        </div>
                        `
                        }
                    });
                    $(".linkList").append(html);
                }else{
                    console.log(data.errmsg);
                }
            },
            error:function(){}

        });
    };getGroup_friend();
//好友列表的显示隐藏
    $(".friendList").on("click",".linkman .weui-cells .LinkBtn",function(){

        console.log($(this));
        if($(this).next().is(":hidden")){
            $(this).next().show();
            $(this).children(".weui-cell__hd").children("img").css("transform","rotate(90deg)");
        }else{
            $(this).next().hide();
            $(this).children(".weui-cell__hd").children("img").removeAttr("style")
        }
    });

    //添加好友

});