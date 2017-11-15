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
                            <img class="linkBtn" src="image/right.png" style="width: 35px">
                        </div>
                        <div class="weui-cell__bd">
                            <p style="font-size: 18px">${item.group_name}</p>
                        </div>
                        <div class="weui-cell__ft">
                            <span style="font-size: 15px">0</span>/<span style="font-size: 15px">${item.total}</span>
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
        $(".friendList").on("click",".linkman .weui-cells .LinkBtn",function(){
            //加载好友分组下的好友
            $(".linkList").empty();
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
                                var httP=item.friend_portrait.split(":")[0];
                                if(httP==="http"){
                                    html+=`
                        <div class="weui-cells weui-cells_checkbox">
                            <label class="weui-cell weui-check__label" for="${item.friend_user_code}">
                                <div class="weui-cell__hd">
                                    <input type="checkbox" class="weui-check" value="${item.friend_user_code}" name="checkbox1"  src="${item.friend_portrait}" id="${item.friend_user_code}" title="${item.friend_user_code}">
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
                                }else{
                                    html+=`
                        <div class="weui-cells weui-cells_checkbox">
                            <label class="weui-cell weui-check__label" for="${item.friend_user_code}">
                                <div class="weui-cell__hd">
                                    <input type="checkbox" class="weui-check" value="${item.friend_user_code}" name="checkbox1"  src="${item.friend_portrait}" id="${item.friend_user_code}" title="${item.friend_user_code}">
                                    <i class="weui-icon-checked"></i>
                                </div>
                                <div class="weui-cell__bd">
                                    <div class="weui-panel__bd">
                                        <div  class="weui-media-box weui-media-box_appmsg">
                                            <div class="weui-media-box__hd">
                                                <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${item.friend_portrait}">
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

                            }
                        });
                        $(".linkList").append(html);
                    }else{
                        console.log(data.errmsg);
                    }
                },
                error:function(){}
            });
//好友列表的显示隐藏
            console.log($(this));
            if($(this).next().is(":hidden")){
                $(this).next().show();
                $(this).children(".weui-cell__hd").children("img").css("transform","rotate(90deg)");
            }else{
                $(this).next().hide();
                $(this).children(".weui-cell__hd").children("img").removeAttr("style")
            }
        });
        //监听被选中的input
        //if($("input").attr("checked") == "checked"){
        //    var url=$(this).attr("src");
        //    var html=`
        //    <span class="flock_member_head">
        //          <img src="${url}" alt="">
        //     </span>
        //`;
        //    $(".group_friendPIC").append(html);
        //}else{
        //    url=null;
        //}
        //添加好友
        $(".addBtn").click(function(){
            //获取  apptoken
            var apptoken=localStorage.getItem("apptoken"),
            // 获取群号码
                group_num=localStorage.getItem("group_num");
            var  user_code=$("input[type=checkbox]:checked").val();
            console.log(user_code);
            //数据格式转换
               var data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num,"user_code":user_code})],
            // 加密
               jsonEncryptData=jsEncryptData(data);
            console.log(data);
            $.ajax({
                url:url+"group_addGroupUser",
                type:"POST",
                data:{"data":jsonEncryptData},
                success:function(data){
                    console.log(data);
                    //解密
                    var data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        localStorage.setItem("apptoken",data.apptoken);
                        showHide(data.errmsg);
                    }else{
                        showHide(data.errmsg);
                    }
                },
                error:function(){}

            })
        })

    }
);