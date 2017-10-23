$(document).ready(function(){
    var apptoken = localStorage.getItem('apptoken');
    if(!apptoken)alert('请重新登录');
    var ws = new WebSocket('ws://39.108.237.198:8282'); //发起绑定
    ws.onmessage = function (e) {
        var result = JSON.parse(e.data);                   //服务器返回结果
        console.log(result);
        switch(parseInt(result.type)){
            case 1:            //1 .在线好友、好友未读消息、群未读消息
                if(parseInt(result.errcode) === 0){
                    var data = (result.data);
                    localStorage.setItem('online_friends',data.online_friends);         //本地保存在线好友列表
                    var friends_new_message = data.friends_new_message;
                    if(friends_new_message){              //好友新消息  已按用户分组 时间倒序排列
                        console.log(friends_new_message);
                        var html="";
                        $.each(friends_new_message,function(i,item){
                            html+=`
                <div class="weui-media-box weui-media-box_appmsg friendChat" title="${item.sender_code}" value="${item.sender_portrait}">
                    <div class="weui-media-box__hd">
                        <span class="newsNum">${item.message_num}</span>
                        <img class="weui-media-box__thumb" src="${item.sender_portrait}"><!--头像-->
                    </div>
                    <div class="weui-media-box__bd">
                        <h4 class="weui-media-box__title">${item.sender_nickname}</h4><!--昵称-->
                        <p class="weui-media-box__desc"></p><!--最新的消息-->
                    </div>
                </div>                           
                            `;
                        });
                        $(".newsList").append(html);
                    }
                    var group_new_message = data.group_new_message;
                    if(group_new_message){              //群组新消息  已按群分组 时间倒序排列
                                var html="";
                                $.each(group_new_message,function(i,item){
                                    html+=`
                                    <div class="weui-media-box weui-media-box_appmsg groupChat" title="${item.group_num}" value="${item.group_}">
                    <div class="weui-media-box__hd">
                        <span class="newsNum">13</span>
                        <img class="weui-media-box__thumb" src="image/firenda.jpg"><!--头像-->
                    </div>
                    <div class="weui-media-box__bd">
                        <h4 class="weui-media-box__title">${item.group_name}</h4><!--昵称-->
                        <p class="weui-media-box__desc">最新消息</p><!--最新的消息-->
                    </div>
                </div>
                                    
                                    `
                                })
                    }
                    var friends_new_apply = data.friends_new_apply;
                    if(friends_new_apply){                      //用户添加好友的申请

                    }
                }
                break;
            case 2:           //2.好友上线通知 更新本地在线好友列表
                if(parseInt(result.errcode) === 0){
                    var data = (result.data);
                    var friend_code = data.user_code;
                    var online_friends = localStorage.getItem('online_friends');
                    if(!contains(online_friends,friend_code)){
                        online_friends.push(friend_code);
                    }
                    localStorage.setItem('online_friends',online_friends);
                }
                break;
            case 3:           //3.好友下线通知 更新本地在线好友列表
                if(parseInt(result.errcode) === 0){
                    var data = (result.data);
                    var friend_code = data.user_code;
                    var online_friends = localStorage.getItem('online_friends');
                    if(contains(online_friends,friend_code)){
                        var i = online_friends.length;
                        while (i--) {
                            if (arr[i] === obj) {
                                online_friends.splice(i,1);
                            }
                        }
                        localStorage.setItem('online_friends',online_friends);
                    }
                }
                break;
            case 4:          //4.接收到好友消息
                if(parseInt(result.errcode) === 0){
                    var data =(result.data);
                    var pathname = window.location.pathname;
                    var patharr  = pathname.split('/');
                    var html = patharr[parseInt(patharr.length-1)];
                    if(html ==='***.html'){             //如果当前页面在好友聊天界面  ***.html为好友聊天页面
                        var current_code = $(".elements").val('user_code');   //获取当前聊天好友code
                        if(current_code === data.sender_code){      //为同一个人 直接将聊天信息展示在页面内 向服务器读取了该消息的通知
                            //展示好友发送的聊天信息

                            //发送通知给服务器
                            var sendMessage = JSON.stringify({'apptoken':apptoken,'type':6,'account_code':current_code});
                            ws.send(sendMessage);
                        }
                    }else{    //其他页面 暂不处理

                    }
                }
                break;
            case 5:         //接收到群消息
                if(parseInt(result.errcode) === 0){
                    var data =(result.data);
                    var pathname = window.location.pathname;
                    var patharr  = pathname.split('/');
                    var html = patharr[parseInt(patharr.length-1)];
                    if(html ==='***.html'){             //如果当前页面在群聊天界面  ***.html为群聊天页面
                        var current_code = $(".elements").val('group_code');   //获取当前聊天群的群code
                        if(current_code === data.group){      //为同一个人 直接将聊天信息展示在页面内 向服务器读取了该消息的通知
                            //展示好友发送的聊天信息

                            //发送通知给服务器
                            var sendMessage = JSON.stringify({'apptoken':apptoken,'type':7,'group_code':current_code});
                            ws.send(sendMessage);
                        }
                    }else{    //其他页面 暂不处理

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
    // 点击跳转到好友聊天页面
    $(".newsList").on("click",".friendChat",function(){
        // 获取发送方的信息
       var sender_code=$(this).attr("title"),
            header=$(this).find("img").attr("src");
       console.log(header);
       // 存在本地
        localStorage.setItem("sender_code",sender_code);
        localStorage.setItem("header",header);
        // window.location.href="friendChat.html";
    });
// 点击跳转到群聊天页面
    $(".newsList").on("click",".groupChat",function(){
        // 获取群code
        var group_num=$(this).attr("title"),
            // 群头像
            group_head=$(this).find("img").attr("src");
       // 存本地
        localStorage.setItem("group_num",group_num);
        localStorage.setItem("group_head",group_head);
        window.location.href="flockChat.html";
    })
});