$(document).ready(function() {
    "use strict";
    // 获取自己的个人信息
    (function(){
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken"),
            // 数据格式转换
            data=['',JSON.stringify({"apptoken":apptoken})],
            // 加密
            json=jsEncryptData(data);
        $.ajax({
            url:url+"UserCenter_getMyAcoountCode",
            type:"POST",
            data:{"data":json},
            success:function(data){
                // 解密
                var data=jsDecodeData(data);

                var account_code=data.data.account_code;
               var  str = parseInt(account_code.substring(0, 6));

               localStorage.setItem("city_id",str);
                //判断返回的头像是否为自定义的
                if(data.data.portrait){
                    var nickname=data.data.portrait.split(":");
                    if(nickname[0]==="http"){
                        localStorage.setItem("my_head",data.data.portrait);
                    }else{
                        localStorage.setItem("my_head","http://wx.junxiang.ren/project/"+data.data.portrait);
                    }
                    localStorage.setItem("apptoken",data.apptoken);
                    localStorage.setItem("my_code",data.data.account_code);
                    }
            }
        })
    })();
    // 获取所有好友
    (function(){
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken"),
        // 数据格式转换
            data=['',JSON.stringify({"apptoken":apptoken})],
        // 加密
            json=jsEncryptData(data);
        $.ajax({
            url:url+"Friends_getAllFriends",
            type:"POST",
            data:{"data":json},
            success:function(data){
                // 解密
                var data=jsDecodeData(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    var allFriend_code=[];
                    $.each(data.data,function(i,item){
                        allFriend_code[i]=item.friend_user_code;
                    });

                    localStorage.setItem("allFriend_code",JSON.stringify(allFriend_code))
                }
            },
            error:function(){}
        });
    })();
    // 及时通讯
    (function(){
        var apptoken = localStorage.getItem('apptoken');
        if(!apptoken)alert('请重新登录');
        var ws = new WebSocket('ws://39.108.237.198:8282'); //发起绑定
        ws.onmessage = function (e){
            var result = JSON.parse(e.data);                   //服务器返回结果
            console.log(e.data);
            var friends_new_messageNum=0,
                group_new_messageNum=0,
                friends_new_applyNum=0;
            console.log(result);
            // 对接收到的消息存本地进行处理
            (function(){
                console.log(result.errmsg);
                if(result.errmsg==="群消息"){
                }else if(result.errmsg==="好友消息"){
                    // // 保存聊天的好友资料
                    (function(){
                        var httP=result.data.send_portrait.split(":")[0];
                        var pic="";

                        if(httP==="http"){
                            pic=result.data.send_portrait;
                        }else{
                            pic="http://wx.junxiang.ren/project/"+result.data.send_portrait
                        }
                        var history_chat = localStorage.getItem("friend_info");
                        var json = "{'sender_code':'"+result.data.sender_code+"','type':'"+result.data.type+"','send_time':'"+result.data.send_time+"','content':'"+result.data.content+"','nickname':'"+result.data.sender_nickname+"','portrait':'"+pic+"'}";
                        if(!history_chat){
                            var history_chat = new Array();
                            history_chat=[json];
                            localStorage.setItem("friend_info",JSON.stringify(history_chat));
                        }else {
                            var history= $.parseJSON(history_chat);
                            var jsonObj = eval('('+history+')');

                            data=[];
                            $.each(history,function(i,item){
                                var jsonObj = eval('('+item+')');
                                data[i]=jsonObj;
                            });
                            console.log(data);
                            var a=0;
                            for(var i=0,len=data.length;i<len;i++){
                                if(parseInt(data[i].sender_code)===parseInt(result.data.sender_code)){

                                    a++;
                                }
                            }
                            if(a===0){

                                history_chat = JSON.parse(history_chat);
                                history_chat[history_chat.length] = json;
                                localStorage.setItem("friend_info", JSON.stringify(history_chat));
                            }
                        }
                    })();
                }
            })();
            switch(parseInt(result.type)){
                case 1:            //1 .在线好友、好友未读消息、群未读消息
                    if(parseInt(result.errcode)===0){
                        var data = (result.data);
                        // 在线好友
                        var online_friends=data.online_friends;

                        if(online_friends){
                            // 获取在线好友code
                           var onlineFried=[];
                            $.each(online_friends,function(i,item){
                                onlineFried.push(item);
                            });
                            // 把在线好友压入数组

                            $.each(onlineFried,function(i,item){

                               var title= $("#"+parseInt(item)).attr("title");

                            });
                            //$(".online").html(onlineFried.length);
                            // 把在线好友存在本地
                            localStorage.setItem("online_friends",JSON.stringify(onlineFried));
                        }
                        // 好友未读新消息
                        var friends_new_message=data.friends_new_message;
                        if(friends_new_message){              //好友新消息  已按用户分组 时间倒序排列
                            $.each(friends_new_message,function(i,item){
                                friends_new_messageNum+=item.message_num;
                                // 存在本地的聊天记录

                                var sender_code=item.sender_code;
                                var sender_nickname=item.sender_nickname;
                                var sender_portrait=item.sender_portrait;
                                var httP=sender_portrait.split(":")[0];
                                var senderPIC="";
                                if(httP==="http"){
                                    senderPIC=item.sender_portrait;
                                }else{
                                    senderPIC="http://wx.junxiang.ren/project/"+sender_portrait
                                }
                                $.each(item.content,function(i,item){

                                    var sendTime=item.send_time;

                                    // 本地未读聊天记录
                                    var json_str = "{'sender_code':'"+sender_code+"','type':'"+item.type+"','send_time':'"+item.send_time+"','content':'"+item.content+"','nickname':'"+sender_nickname+"','portrait':'"+senderPIC+"'}";
                                    var history_chats = localStorage.getItem('history_'+ sender_code);
                                    if(!history_chats){
                                        var history_chats = new Array();
                                        history_chats=[json_str];
                                        localStorage.setItem('history_'+sender_code,JSON.stringify(history_chats));
                                    }else{ history_chats = JSON.parse(history_chats);
                                        var jsonObj = eval('('+history_chats+')');

                                        data=[];
                                        $.each(history_chats,function(i,item){
                                            var jsonObj = eval('('+item+')');
                                            data[i]=jsonObj;
                                        });


                                        for(var i=0,len=data.length;i<len;i++){
                                            if(!data[i].send_time===sendTime){
                                                history_chats[history_chats.length] = json_str;
                                                if(history_chats.length>20){
                                                    history_chats.shift();
                                                }
                                                localStorage.setItem('history_' + sender_code, JSON.stringify(history_chats));
                                            }
                                        }
                                    }
                                    // 保存聊天的好友资料
                                    (function(){
                                        var history_chat = localStorage.getItem("friend_info");
                                        var json = "{'sender_code':'"+sender_code+"','type':'"+item.type+"','send_time':'"+item.send_time+"','content':'"+item.content+"','nickname':'"+sender_nickname+"','portrait':'"+senderPIC+"'}";
                                        if(!history_chat){
                                            var history_chat = new Array();
                                            history_chat=[json];
                                            localStorage.setItem("friend_info",JSON.stringify(history_chat));
                                        }else {
                                            var history= $.parseJSON(history_chat);
                                            var jsonObj = eval('('+history+')');
                                            data=[];
                                            $.each(history,function(i,item){
                                                var jsonObj = eval('('+item+')');
                                                data[i]=jsonObj;
                                            });

                                            var a=0;
                                            for(var i=0,len=data.length;i<len;i++){
                                                if(parseInt(data[i].sender_code)===parseInt(sender_code)){

                                                    a++;
                                                }
                                            }
                                            if(a===0){

                                                history_chat = JSON.parse(history_chat);
                                                history_chat[history_chat.length] = json;
                                                localStorage.setItem("friend_info", JSON.stringify(history_chat));
                                            }
                                        }
                                    })();
                                })
                            })
                        }
                        // 群未读新消息
                        var group_new_message=data.group_new_message;
                        if(group_new_message){

                            //群组新消息  已按群分组 时间倒序排列
                            $.each(group_new_message,function(i,item){
                                group_new_messageNum+=item.count;
                            })
                        }
                        //好友未读申请通知
                        var friends_new_apply=data.friends_new_apply;
                        if(friends_new_apply){                      //用户添加好友的申请
                            friends_new_applyNum=friends_new_apply.length
                        }
                        // 把消息数量添加到页面
                        if(friends_new_messageNum+group_new_messageNum+friends_new_applyNum==0){
                            $("#newsNum").html();
                        }else{
                            $("#newsNum").html(parseInt(friends_new_messageNum)+parseInt(group_new_messageNum)+parseInt(friends_new_applyNum));
                            $("#newsNum").attr("style","padding:0 4px");
                        }
                    }
                    break;
                case 2:    //2.好友上线通知 更新本地在线好友列表
                    if(parseInt(result.errcode)===0){
                        var data = (result.data);
                        var friend_code = data.user_code;
                        var online_friends =localStorage.getItem('online_friends');

                        if(!contains(online_friends,friend_code)){

                           var newOnline = parseInt(JSON.parse(online_friends));

                            // newOnline.push(friend_code);
                            // 上线好友的头像变亮
                            // var online=$("#"+parseInt(friend_code));
                            // var id=online.attr("title");

                            // online.attr("style","opacity: 1");
                            // var clone=online.parent().parent().clone(true);
                            // online.parent().parent().remove();
                            // $("#"+id).prepend(clone);
                            // 在线好友数量加1
                            // var num=parseInt($("."+id).html());
                            // var   onlineNum=num+1;
                            // $("."+id).html(onlineNum);
                        }
                        // localStorage.setItem('online_friends',newOnline);
                    }
                    break;
                case 3:           //3.好友下线通知 更新本地在线好友列表
                    if(parseInt(result.errcode) === 0){
                        var data = (result.data);
                        var friend_code = data.user_code;
                        var online_friends = localStorage.getItem('online_friends');

                        if(contains(online_friends,friend_code)){


                            var i = online_friends.length;
                            while (i--){
                                if (arr[i] === obj){
                                    online_friends.splice(i,1);
                                }
                            }
                            localStorage.setItem('online_friends',online_friends);
                        }
                    }
                    break;
                case 4:        //4.接收到好友消息
                    if(parseInt(result.errcode) === 0){
                        var data =(result.data);
                        var pathname = window.location.pathname;
                        var patharr  = pathname.split('/');
                        var html = patharr[parseInt(patharr.length-1)];
                        if(html ==='index.html'){             //如果当前页面在好友聊天界面  ***.html为好友聊天页面
                           var num=$("#newsNum").html();
                           $("#newsNum").attr("style","padding:0 4px");

                            num++;
                            $("#newsNum").text(num);
                            // 把接收到的好友信息存在本地
                            var arr={}
                        }
                    }
                    break;
                case 5:         //接收到群消息
                    if(parseInt(result.errcode) === 0){
                        var data =(result.data);
                        var pathname = window.location.pathname;
                        var patharr  = pathname.split('/');
                        var html = patharr[parseInt(patharr.length-1)];
                        if(html ==='index.html'){             //如果当前页面在群聊天界面  ***.html为群聊天页面
                            var num=$("#newsNum").html();
                            $("#newsNum").attr("style","padding:0 4px");

                            num++;
                            $("#newsNum").text(num);
                        }
                    }
                    break;
            }
        };
        ws.onopen=function(e){
            ws.send(JSON.stringify({'type' : 1,'apptoken' :apptoken}));
        };
        //群聊点击发送
        $(".elements").click(function(){
            var content=$(".elements").val('content');                //获取页面发送内容
            var group =$(".elements").val('group_code');           //获取发送好友的code
            var message_type = 1;                      //消息类型        1:文字消息 2:语音消息 3：文件消息
            ws.send(JSON.stringify({'type' : 3, 'content' : content,'apptoken' : apptoken,'account_code':account_code,'message_type':message_type}));
        });


        //发送消息给好友
        $(".elements").click(function(){
            var content=$(".elements").val('content');                        //获取页面发送内容
            var account_code =$(".elements").val('user_code');          //获取发送好友的code
            var message_type = 1;                      //消息类型  1:文字消息 2:语音消息 3：文件消息
            ws.send(JSON.stringify({'type' : 2, 'content' : content,'apptoken' : apptoken,'account_code':account_code,'message_type':message_type}));
        });
        /*
        * 判断是否存在元素
        * */
        function contains(arr, obj) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === obj) {
                    return true;
                }
            }
            return false;
        }
    })();
    //功能1 请求好友分组列表
    var getGroup=function(){
        var apptoken=localStorage.getItem("apptoken"),
            data=["", JSON.stringify({"apptoken":apptoken})],
            jsonEncryptData = jsEncryptData(data);
        $.ajax({
            url:url+"friends_getGroup",
            type:"POST",
            data:{"data":jsonEncryptData},
            success: function (data){
                data = jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    $.each(data.data,function(i, item){
                        var group_id=item.id;
                        var html = "";
                        var friend="";
                        var arr=[];
                        $.each(item.friend_user,function(i,tem){
                            // 获取所有在线好友
                            if(localStorage.getItem("online_friends")){
                                var onlineFriend=JSON.parse(localStorage.getItem("online_friends"));
                                $.each(onlineFriend,function(i,online){
                                    if(parseInt(tem.friend_user_code)===parseInt(online)){
                                        arr.push(tem.friend_user_code);
                                    }
                                })
                            }
                        });
                        //分组下的好友信息
                        $.each(item.friend_user,function (i,item) {
                            "use strict";
                            var portrait=item.friend_portrait;
                            var htP=portrait.split(":")[0];
                            if(htP==="http"){
                                friend+=`
                    <div class="weui-media-box weui-media-box_appmsg skipChat" title="${item.friend_user_code}">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb " title="${group_id}" value="${item.friend_user_code}" style="opacity: .6" src="${item.friend_portrait}"   id="${item.friend_user_code}">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title">${item.friend_nickname}</h4>
                            <p class="weui-media-box__desc remark">${item.friend_signature}</p>
                        </div>
                    </div>
                            `
                            }else{
                                friend+=`
                    <div class="weui-media-box weui-media-box_appmsg skipChat" title="${item.friend_user_code}">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb " title="${group_id}" style="opacity: .6" src="http://wx.junxiang.ren/project/${item.friend_portrait}"   id="${item.friend_user_code}">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title">${item.friend_nickname}</h4>
                            <p class="weui-media-box__desc remark">${item.friend_signature}</p>
                        </div>
                    </div>
                            `;
                            }
                        });
                        var online=arr.length;
                        html+=`
                         <div class="weui-cells" title="${item.id}">
                            <div class="weui-cell LinkBtn"  title="${item.id}" style="position: relative;z-index: 1000">
                                <div class="weui-cell__hd ">
                                   <img class="linkBtn img${item.id}" src="image/right.png "  title="${item.id}">
                                </div>
                                <div class="weui-cell__bd">
                                    <p style="">${item.group_name}</p>
                                </div>
                                <div class="weui-cell__ft" style="">
                                    <span class="online ${item.id}" style="font-size: 18px">${online}</span>/${item.total}
                                </div>
                            </div>
                            <div class="weui-panel weui-panel_access friendList friend fri${item.id}" id="user${item.id}" style="display: none">
                                
                            </div>

                         </div>

                            `;
                        $(".group").append(html);
                        $("#user"+item.id).html(friend);
                        //在线好友头像亮起来
                        var allfriend=JSON.parse(localStorage.getItem("allFriend_code"));
                        console.log(allfriend);
                        var online=JSON.parse(localStorage.getItem("online_friends"));
                        console.log(online);
                        for(var i=0 ,len=allfriend.length;i<len;i++){
                            for(var j=0,le=online.length;j<le;j++){
                                if(allfriend[i]==online[j]){
                                    $("#"+online[j]).attr("style","opacity: 1");
                                    //var clone=$("#"+online[j]).parent().parent().clone(true);
                                    $("#"+online[j]).parent().parent().remove();
                                    var a=$("#"+online[j]).attr("title");
                                    console.log($("#"+online[j]));
                                    console.log(a);
                                   // $("#user"+a).prepend(clone);
                                }
                            }
                        }
                    });


                }else{
                    window.location.href ="landing.html";
                }
            }
        });
    };getGroup();
    //显示隐藏好友分组
    $(".group").on("click",".weui-cells .LinkBtn",function(){
        var that=$(this);
        if(that.next().is(":hidden")){
                that.next().show();
             that.children(":first").children("img").css("transform","rotate(90deg)");
        }else{
            that.next().hide();
            that.children(":first").children("img").css("transform","rotate(0deg)");
        }

    });
    // (function(){
    //     var apptoken=localStorage.getItem("apptoken");
    //     var title=1;
    //     var data=["",JSON.stringify({"group_id":title,"apptoken":apptoken})];
    //     var  jsonEncryptData = jsEncryptData(data);
    //     $.ajax({
    //         url:url+"friends_getGroupFriends",
    //         type:"POST",
    //         data:{"data":jsonEncryptData},
    //         success:function(data){
    //             // 解密
    //             var data=jsDecodeData(data);
    //             console.log(data);
    //             if(data.errcode===0){
    //                 var html="";
    //                 var result=data.data;
    //                 localStorage.setItem("apptoken",data.apptoken);
    //                 $.each(result,function(i,item){
    //                     var httP=item.friend_portrait.split(":")[0];
    //                         if(httP==="http"){
    //                             if(item.friend_signature===null){
    //                                 html+=`
    //                 <div class="weui-media-box weui-media-box_appmsg skipChat" title="${item.friend_user_code}">
    //                     <div class="weui-media-box__hd">
    //                         <img class="weui-media-box__thumb " title="${item.group_id}" style="opacity: .6" src="${item.friend_portrait}"   id="${item.friend_user_code}">
    //                     </div>
    //                     <div class="weui-media-box__bd">
    //                         <h4 class="weui-media-box__title">${item.friend_nickname}</h4>
    //                         <p class="weui-media-box__desc remark">此人很懒什么都没有留下</p>
    //                     </div>
    //                 </div>
    //                         `
    //                             }else{
    //                                 html+=`
    //                 <div class="weui-media-box weui-media-box_appmsg skipChat" title="${item.friend_user_code}">
    //                     <div class="weui-media-box__hd">
    //                         <img class="weui-media-box__thumb " title="${item.group_id}" style="opacity: .6" src="${item.friend_portrait}"   id="${item.friend_user_code}">
    //                     </div>
    //                     <div class="weui-media-box__bd">
    //                         <h4 class="weui-media-box__title">${item.friend_nickname}</h4>
    //                         <p class="weui-media-box__desc remark">${item.friend_signature}</p>
    //                     </div>
    //                 </div>
    //                         `
    //                             }
    //
    //                         }else{
    //                             if(item.friend_signature===null){
    //                                 html+=`
    //                 <div class="weui-media-box weui-media-box_appmsg skipChat" title="${item.friend_user_code}">
    //                     <div class="weui-media-box__hd">
    //                         <img class="weui-media-box__thumb " title="${item.group_id}" style="opacity: .6" src="http://wx.junxiang.ren/project/${item.friend_portrait}"   id="${item.friend_user_code}">
    //                     </div>
    //                     <div class="weui-media-box__bd">
    //                         <h4 class="weui-media-box__title">${item.friend_nickname}</h4>
    //                         <p class="weui-media-box__desc remark">此人很懒什么都没有留下</p>
    //                     </div>
    //                 </div>
    //                         `
    //                             }else{
    //                                 html+=`
    //                 <div class="weui-media-box weui-media-box_appmsg skipChat" title="${item.friend_user_code}">
    //                     <div class="weui-media-box__hd">
    //                         <img class="weui-media-box__thumb " title="${item.group_id}" style="opacity: .6" src="http://wx.junxiang.ren/project/${item.friend_portrait}"   id="${item.friend_user_code}">
    //                     </div>
    //                     <div class="weui-media-box__bd">
    //                         <h4 class="weui-media-box__title">${item.friend_nickname}</h4>
    //                         <p class="weui-media-box__desc remark">${item.friend_signature}</p>
    //                     </div>
    //                 </div>
    //                         `
    //                             }
    //                         }
    //                 });
    //                 $("#user1").html(html);
    //                 //$("#1").parent().prev().find("img").css("transform","rotate(90deg)");
    //                 $(".img1").css("transform","rotate(90deg)");
    //                 $(".fri1").show();
    //                 //好友在线情况
    //                 var allfriend=JSON.parse(localStorage.getItem("allFriend_code"));
    //                 var online=JSON.parse(localStorage.getItem("online_friends"));
    //                 for(var i=0 ,len=allfriend.length;i<len;i++){
    //                     for(var j=0,le=online.length;j<le;j++){
    //                         if(allfriend[i]==online[j]){
    //                             $("#"+online[j]).attr("style","opacity: 1");
    //                             var clone=$("#"+online[j]).parent().parent().clone(true);
    //                             $("#"+online[j]).parent().parent().remove();
    //                             $("#user1").prepend(clone);
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     })
    // })();
    // 功能2 请求好友分组下的好友信息
    // $(".group").on("click", ".weui-cells .LinkBtn",function(e){
    //         //获取好友分组id
    //         var that=$(this);
    //         var group_id=$(this).attr("title");
    //
    //         var apptoken=localStorage.getItem("apptoken");
    //         var data=["",JSON.stringify({"group_id":group_id,"apptoken":apptoken})];
    //         var  jsonEncryptData = jsEncryptData(data);
    //         console.log(data);
    //         $.ajax({
    //             url:url+"friends_getGroupFriends",
    //             type:"POST",
    //             data:{"data":jsonEncryptData},
    //             success:function(data){
    //                 data=jsDecodeData(data);
    //                 console.log(data);
    //                 if(data.errcode===0){
    //                     localStorage.setItem("apptoken",data.apptoken);
    //                     var html="";
    //                     $.each(data.data,function(i,item){
    //                         "use strict";
    //                         var portrait=item.friend_portrait;
    //                         var htP=portrait.split(":")[0];
    //                             if(htP==="http"){
    //                                 html+=`
    //                 <div class="weui-media-box weui-media-box_appmsg skipChat" title="${item.friend_user_code}">
    //                     <div class="weui-media-box__hd">
    //                         <img class="weui-media-box__thumb " title="${item.group_id}" value="${item.friend_user_code}" style="opacity: .6" src="${item.friend_portrait}"   id="${item.friend_user_code}">
    //                     </div>
    //                     <div class="weui-media-box__bd">
    //                         <h4 class="weui-media-box__title">${item.friend_nickname}</h4>
    //                         <p class="weui-media-box__desc remark">${item.friend_signature}</p>
    //                     </div>
    //                 </div>
    //                         `
    //                             }else{
    //                                 html+=`
    //                 <div class="weui-media-box weui-media-box_appmsg skipChat" title="${item.friend_user_code}">
    //                     <div class="weui-media-box__hd">
    //                         <img class="weui-media-box__thumb " title="${item.group_id}" style="opacity: .6" src="http://wx.junxiang.ren/project/${item.friend_portrait}"   id="${item.friend_user_code}">
    //                     </div>
    //                     <div class="weui-media-box__bd">
    //                         <h4 class="weui-media-box__title">${item.friend_nickname}</h4>
    //                         <p class="weui-media-box__desc remark">${item.friend_signature}</p>
    //                     </div>
    //                 </div>
    //                         `;
    //                             }
    //                     });
    //                     $("#user"+group_id).html(html);
    //                     var allfriend=JSON.parse(localStorage.getItem("allFriend_code"));
    //                     var online=JSON.parse(localStorage.getItem("online_friends"));
    //                     for(var i=0 ,len=allfriend.length;i<len;i++){
    //                         for(var j=0,le=online.length;j<le;j++){
    //                             if(allfriend[i]==online[j]){
    //                                $("#"+online[j]).attr("style","opacity: 1");
    //                                 var clone=$("#"+online[j]).parent().parent().clone(true);
    //                                 $("#"+online[j]).parent().parent().remove();
    //                                 $("#user"+group_id).prepend(clone);
    //                             }
    //                         }
    //                     }
    //                     // 功能显示隐藏分组下的好友信息
    //                     console.log("显示好友分组");
    //                     if(that.next().is(":hidden")){
    //                         that.next().show();
    //                         that.children(":first").children("img").css("transform","rotate(90deg)");
    //                     }else{
    //                         that.next().empty();
    //                         that.next().hide();
    //                         that.children(":first").children("img").css("transform","rotate(0deg)");
    //                     }
    //                 }
    //             }
    //         });
    // });
    //搜索框内容的清楚
    $("#searchClear").click(function(){
        $(".keyFriend").empty();
        $(".group").show();
    });
    $("#searchCancel").click(function(){
        $(".keyFriend").empty();
        $(".group").show();
    });
    // 按关键词搜索好友
    $("#searchInput").on("input",function(){
        $(".keyFriend").empty();
        var key=$("#searchInput").val();

        var apptoken=localStorage.getItem("apptoken");
        if(key){
            $(".group").hide();
            $(".keyFriend").show();
        }else{
            $(".keyFriend").hide();
            $(".group").show();
        }
        //数据格式转换
      var  data=["",JSON.stringify({"key":key,"apptoken":apptoken})],
        //数据加密
        jsonEncryptDate=jsEncryptData(data);
        //发起ajax请求
        $.ajax({
            url:url+"friends_searchFriends",
            type:"POST",
            data:{"data":jsonEncryptDate},
            success:function(data){
                //解密数据
                data=jsDecodeData(data);
                if(data.errcode===0){

                    localStorage.setItem("apptoken",data.apptoken);
                    var html="";
                    $.each(data.data,function(i,item){
                        var portrait=item.friend_portrait;
                        var htP=portrait.split(":")[0];
                        if(item.friend_signature===null){
                            if(htP==="http"){
                                html+=`
                    <div class="weui-media-box weui-media-box_appmsg skipChat" title="${item.friend_user_code}" value="${item.friend_nickname}">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" src="${item.friend_portrait}" alt="">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title name">${item.friend_nickname}</h4>
                            <p class="weui-media-box__desc searchRemark">次人很懒什么也没有说</p>
                        </div>
                    </div>
                    `
                            }else{
                                html+=`
                    <div class="weui-media-box weui-media-box_appmsg skipChat" title="${item.friend_user_code}" value="${item.friend_nickname}">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${item.friend_portrait}" alt="">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title name">${item.friend_nickname}</h4>
                            <p class="weui-media-box__desc searchRemark">次人很懒什么也没有说</p>
                        </div>
                    </div>
                    `
                            }
                        }else{
                            if(htP==="http"){
                                html+=`
                    <div class="weui-media-box weui-media-box_appmsg skipChat" title="${item.friend_user_code}" value="${item.friend_nickname}">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" src="${item.friend_portrait}" alt="">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title name">${item.friend_nickname}</h4>
                            <p class="weui-media-box__desc searchRemark">${item.friend_signature}</p>
                        </div>
                    </div>
                    `

                            }else{
                                html+=`
                    <div class="weui-media-box weui-media-box_appmsg skipChat" title="${item.friend_user_code}" value="${item.friend_nickname}">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${item.friend_portrait}" alt="">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title name">${item.friend_nickname}</h4>
                            <p class="weui-media-box__desc searchRemark">${item.friend_signature}</p>
                        </div>
                    </div>
                    `
                            }
                        }
                    });
                    $(".keyFriend").append(html);
                }else if(data.errcode===301){
                    var html=`
                     <p style="text-align: center">${data.errmsg}</p>               
                        `;
                    $(".keyFriend").html(html);
                }else{

                }

            }
        });

    });
    // 点击好友跳转到聊天页面
    $(".group").on("click",".skipChat",function(){
        var my_code=localStorage.getItem("my_code");
        var apptoken=localStorage.getItem("apptoken");
        //好友名字
        var sender_name=$(this).find("h4").text();
        // 获取好友code
        var sender_code=$(this).attr("title"),
        // 头像
            header=$(this).find("img").attr("src");
        // 数据转换
        localStorage.setItem("sender_code",sender_code);
        localStorage.setItem("header",header);
        localStorage.setItem("sender_name",sender_name);
        var data=["",JSON.stringify({"apptoken":apptoken,"user_code":sender_code})];
        // 加密
        var jsonEncryptData=jsEncryptData(data);
        $.ajax({
            url:url+"Friends_updateFriendsInfo",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                // 解密
                var data=jsDecodeData(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                }
            },
            error:function(){}
        });
        // 存本地

        if(parseInt(sender_code)===parseInt(my_code)){
            window.location.href="myDatum.html";
        }else{
            window.location.href="friendChat.html";
        }

    });
    //点击头像跳转到
    $(".group").on("click",".skipChat .weui-media-box__hd .weui-media-box__thumb ",function () {
        var user_code=$(this).attr("id");
        localStorage.setItem("user_code",user_code);
        var my_code=localStorage.getItem("my_code");
        if(parseInt(user_code)===parseInt(my_code)){
            window.location.href="myDatum.html";
        }else{
            window.location.href="friendDetails.html";
        }

        return false;
    });
    //搜索好友跳转到聊天页面
    $(".keyFriend").on("click",".skipChat",function(){
        //好友名字
        var sender_name=$(this).find("h4").text();
        // 获取好友code
        var sender_code=$(this).attr("title"),
        // 头像
            header=$(this).find("img").attr("src");
        console.log(my_code);
        console.log(sender_code);
        // 存本地
        localStorage.setItem("sender_code",sender_code);
        localStorage.setItem("header",header);
        localStorage.setItem("sender_name",sender_name);
        window.location.href="friendChat.html";
    });
    // 退出登录
    $(".logOut").click(function(){
        localStorage.clear();
        window.location.href="landing.html";
    });
});
