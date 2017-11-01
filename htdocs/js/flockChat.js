$(document).ready(function(){
    var apptoken = localStorage.getItem('apptoken');
    // 时间戳的转换
    function getLocalTime(nS) {
        return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
    }
    if(!apptoken)alert('请重新登录');
    var ws = new WebSocket('ws://39.108.237.198:8282'); //发起绑定
    ws.onmessage = function (e) {
        var result = JSON.parse(e.data);                   //服务器返回结果
        switch(parseInt(result.type)){
            case 1:            //1 .在线好友、好友未读消息、群未读消息
                if(parseInt(result.errcode) === 0){
                    var data = (result.data);
                    localStorage.setItem('online_friends',data.online_friends);         //本地保存在线好友列表
                    var friends_new_message = data.friends_new_message;
                    if(friends_new_message){              //好友新消息  已按用户分组 时间倒序排列

                    }
                    var group_new_message = data.group_new_message;
                    if(group_new_message){              //群组新消息  已按群分组 时间倒序排列

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
                        // online_friends.push(friend_code);
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
                    // 获取自己code
                    var my_code=localStorage.getItem("my_code");
                    console.log(data);
                    if(html ==='flockChat.html'){             //如果当前页面在群聊天界面  ***.html为群聊天页面
                        var current_code = localStorage.getItem("group_code");   //获取当前聊天群的群code
                        if(current_code === data.group){      //为同一个人 直接将聊天信息展示在页面内 向服务器读取了该消息的通知
                            //展示好友发送的聊天信息
                            var html="";
                            if(my_code===data.sender_code){
                                html=`
                                 <p style="font-size: 12px;text-align: center">${(new Date()).toLocaleDateString()}</p>
        <div class="weui-media-box weui-media-box_appmsg">
             <div class="weui-media-box__bd">
                 <span class="weui-media-box__desc right" style="background:#66CD00;font-size: 13px;color: black">${content}</span>
            </div>
             <div class="weui-media-box__hd" style="margin-left:.8em;">
                 <img class="weui-media-box__thumb" src="image/firendb.jpg" alt="">
             </div>
         </div>
                                                              
                                `
                            }else{
                                html=`
                                <p style="font-size: 12px;text-align: center">${getLocalTime(data.send_time)}</p>
                <div class="weui-media-box weui-media-box_appmsg" style="vertical-align: top">
                    <div class="weui-media-box__hd" style="margin-right:.8em;margin-top: 0" >
                        <img class="weui-media-box__thumb" src="${data.send_portrait}" alt="">
                    </div>
                    <div class="weui-media-box__bd">
                            <span class="weui-media-box__desc" style="background:white;font-size: 13px;color:black">
                               ${data.content}
                             
                            </span>
                   </div>                   
                </div> 
                                
                                `
                            }
                            $("#chatPage").prepend(html);
                            document.body.scrollTop=$("#chatPage").height();
                            //发送通知给服务器
                            var sendMessage = JSON.stringify({'apptoken':apptoken,'type':7,'group_code':current_code});
                            ws.send(sendMessage);
                        }
                    }else{    //其他页面 暂不处理
                    }
                }
                break;
            case 8:
                console.log(result);
                break;
            case 9://历史消息




                break;
        }
    };
    ws.onopen=function(e){
        ws.send(JSON.stringify({'type' : 1,'apptoken' :apptoken}));
    };
    //群聊点击发送
    $(".pushBtn").click(function(){
        var content=$(".chatContent").val();                //获取页面发送内容
        var group =localStorage.getItem("group_code");           //获取发送好友的群code
        var message_type = 1;                      //消息类型        1:文字消息 2:语音消息 3：文件消息
        console.log(JSON.stringify({'type':3,'content':content,'apptoken':apptoken,'account_code':group,'message_type':message_type}));
        ws.send(JSON.stringify({"group":group,'type' : 3,'content':content,'apptoken':apptoken,'message_type':message_type}));
        // 添加本地页面
        $(".chatContent").val("");

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
});