$(document).ready(function() {
    // 及时通讯
    (function(){
        var apptoken = localStorage.getItem('apptoken');
        if(!apptoken)alert('请重新登录');
        var ws = new WebSocket('ws://39.108.237.198:8282'); //发起绑定
        console.log(132);
        ws.onmessage = function (e) {
            var result = JSON.parse(e.data);                   //服务器返回结果
            console.log(result);
            switch(parseInt(result.type)){
                case 1:            //1 .在线好友、好友未读消息、群未读消息
                    if(parseInt(result.errcode) === 0){
                        var friends_new_messageNum=0,
                            group_new_messageNum=0,
                            friends_new_applyNum=0;
                        var data = (result.data);
                        localStorage.setItem('online_friends',data.online_friends);         //本地保存在线好友列表
                        var friends_new_message=data.friends_new_message;
                        if(friends_new_message){              //好友新消息  已按用户分组 时间倒序排列
                            console.log(friends_new_messageNum);
                            $.each(friends_new_message,function(i,item){
                                friends_new_messageNum+=item.message.num;
                            })
                        }
                        var group_new_message=data.group_new_message;
                        if(group_new_message){              //群组新消息  已按群分组 时间倒序排列
                            $.each(group_new_messageNum,function(i,item){
                                group_new_messageNum+=item.count;
                                console.log(item.count);
                            })
                        }
                        var friends_new_apply=data.friends_new_apply;
                        if(friends_new_apply){                      //用户添加好友的申请
                            friends_new_applyNum=friends_new_apply.length
                        }

                        // 把消息数量添加到页面
                        $("#newsNum").html(friends_new_messageNum+group_new_messageNum+friends_new_applyNum);
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
            ws.send(JSON.stringify({'type' : 1,'apptoken':apptoken}));
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
        /**判断是否存在元素**/
        function contains(arr, obj) {
            var i = arr.length;
            while (i--){
                if (arr[i] === obj){
                    return true;
                }
            }
            return false;
        }
    })();
    //功能1 请求好友分组
    var apptoken=localStorage.getItem("apptoken");
    data=["", JSON.stringify({"apptoken":apptoken})];
    console.log(data);
    encreptdata = jsEncryptData(data);
    $.ajax({
        url:url+"friends_getGroup",
        type:"POST",
        data:{"data":encreptdata},
        success: function (data){
            data = jsDecodeData(data);
            console.log(data);
            if(data.errcode === 0) {
                localStorage.setItem("apptoken",data.apptoken);
                var html = "";
                $.each(data.data, function (i, item) {
                    html += `
     <div class="weui-cells">
        <div class="weui-cell LinkBtn"  title="${item.id}">
            <div class="weui-cell__hd ">
               <img class="linkBtn" style="" src="image/right.png"  title="${item.id}">
            </div>
            <div class="weui-cell__bd">
                <p style=""  title="${item.id}">${item.group_name}</p>
            </div>
            <div class="weui-cell__ft" style="">
                ${item.online_num}/${item.total}
            </div>
        </div>
        <div class="weui-panel weui-panel_access friendList" style="display: none">
            <div class="weui-panel__bd friend">
                    
            </div>
        </div> 
     </div>                  
        `
                });
          $(".group").append(html);
            }else{
                if(data.errcode===114){
                    window.location.href ="landing.html";
                }
               console.log()
            }
        }
    });
    $(".group").on("click", ".weui-cells .LinkBtn", function (e) {
        // 功能2 请求好友分组下的好友信息
        (function(){
            // 获取group_id
            var apptoken=localStorage.getItem("apptoken");
            var title=$(e.target).attr("title");
            console.log(title);
            data=["",JSON.stringify({"group_id":title,"apptoken":apptoken})];
            console.log(data);
            encreptdata = jsEncryptData(data);
            $.ajax({
                url:url+"friends_getGroupFriends",
                type:"POST",
                data:{"data":encreptdata},
                success:function(data){
                    data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        localStorage.setItem("apptoken",data.apptoken);
                        var html="";
                        $.each(data.data,function(i,item){
                            "use strict";
                            html+=`
                    <div class="weui-media-box weui-media-box_appmsg skipChat" title="${item.friend_user_code}">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" src="${item.friend_portrait}">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title">${item.friend_nickname}</h4>
                            <p class="weui-media-box__desc">${item.friend_signature}</p>
                        </div>
                    </div>
                            `
                        });
                        $(".friend").html(html);
                    }
                }
            });
        })();
        // 功能显示隐藏分组下的好友信息
        if($(this).next().is(":hidden")){
            $(this).next().show();
            $(this).children().children("img").css("transform","rotate(90deg)");
        }else{
            $(this).next().hide();
            $(this).children().children("img").css("transform","rotate(0deg)");
        }
    });
    // 按关键词搜索好友
    $("#searchInput").on("input",function(){
        $(".keyFriend").empty();
        var key=$("#searchInput").val();
        console.log(key);
        var apptoken=localStorage.getItem("apptoken");
        if(key!==""){
            $(".group").hide();
            $(".keyFriend").show();
        }else{
            $(".keyFriend").hide();
            $(".group").show();
        }
        //数据格式转换
        data=["",JSON.stringify({"key":key,"apptoken":apptoken})];
        console.log(data);
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
                    console.log(data);
                    localStorage.setItem("apptoken",data.apptoken);
                    var html="";
                    $.each(data.data,function(i,item){
                        html+=`
                    <a href="friendChat.html" class="weui-media-box weui-media-box_appmsg skipChat"
                    title="${item.friend_user_code}" value="1">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" src="${item.friend_portrait}" alt="">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title name">${item.friend_nickname}</h4>
                            <p class="weui-media-box__desc">${item.friend_signature}</p>
                        </div>                      
                    </a>
                    `
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
        console.log(123);
        // 获取好友code
        var sender_code=$(this).attr("title"),
        // 头像
            header=$(this).find("img").attr("src");
        // 存本地
        localStorage.setItem("sender_code",sender_code);
        localStorage.setItem("header",header);
        window.location.href="friendChat.html";
    })
});
