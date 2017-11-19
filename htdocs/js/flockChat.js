$(document).ready(function(){
    var apptoken = localStorage.getItem('apptoken');
    // 时间戳的转换
    function getLocalTime(nS) {
        return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
    }
    if(!apptoken)alert('请重新登录');
    var ws = new WebSocket('ws://39.108.237.198:8282');//发起绑定
    ws.onmessage = function (e){
        var result = JSON.parse(e.data);                   //服务器返回结果
        console.log(result);
        switch(parseInt(result.type)){
            case 1:            //1 .在线好友、好友未读消息、群未读消息
                if(parseInt(result.errcode) === 0){
                    var data = (result.data);
                    var arr=[];
                    arr.push(data.online_friends);
                    localStorage.setItem('online_friends',JSON.stringify(arr));         //本地保存在线好友列表
                    var friends_new_message = data.friends_new_message;
                    if(friends_new_message){              //好友新消息  已按用户分组 时间倒序排列

                    }
                    var group_new_message = data.group_new_message;
                    if(group_new_message){              //群组新消息  已按群分组 时间倒序排列
                        console.log("群消息");
                        console.log(group_new_message);
                        var html="";
                        //群组新消息  已按群分组 时间倒序排列
                        $.each(group_new_message,function(i,item){
                            console.log("未读群消息");
                            console.log(item);
                            var group_num=item.group_num;
                            var group_code=item.group_code;
                            var group_portrait=item.group_portrait;
                            if(item.content){
                                $.each(item.content,function(i,item){
                                    var httP=item.sender_portrait.split(":")[0];
                                    var sender_portrait="";
                                    if(httP==="http"){
                                        sender_portrait=item.sender_portrait;
                                    }else{
                                        sender_portrait="http://wx.junxiang.ren/project/"+item.sender_portrait
                                    }
                                    console.log(item);
                                    if(parseInt(item.type)===2){//图片、文件
                                        html+=`
                <p style="font-size: 12px;text-align: center">${getLocalTime(item.send_time)}</p>
                <div class="weui-media-box weui-media-box_appmsg" style="vertical-align: top">
                    <div class="weui-media-box__hd" style="margin-right:.8em;margin-top: 0" >
                        <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${sender_portrait}" alt="">
                    </div>
                    <div class="weui-media-box__bd">
                            <h6>${item.sender_nickname}</h6>
                            <span class="weui-media-box__desc" style="padding: 0">                            
                              <img src="${item.content}" alt="" style="width: 80px">
                            </span>
                   </div>                   
                </div>                  `
                                    } else if(parseInt(item.type)===3){//语音
                                        html+=`
                                <p style="font-size: 12px;text-align: center">${getLocalTime(item.send_time)}</p>
                <div class="weui-media-box weui-media-box_appmsg" style="vertical-align: top">
                    <div class="weui-media-box__hd" style="margin-right:.8em;margin-top: 0" >
                        <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${sender_portrait}" alt="">
                    </div>
                    <div class="weui-media-box__bd">
                             <h6>${item.sender_nickname}</h6>
                            <span class="weui-media-box__desc playVoice" style="background:white;font-size: 13px;color:black" title="${item.content}">
                              播放语音
                            
                            </span>
                   </div>                   
                </div> 
                                
                                `
                                    }else{//文字
                                        html+=`
                                <p style="font-size: 12px;text-align: center">${getLocalTime(item.send_time)}</p>
                <div class="weui-media-box weui-media-box_appmsg" style="vertical-align: top">
                    <div class="weui-media-box__hd" style="margin-right:.8em;margin-top: 0" >
                        <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${sender_portrait}" alt="">
                    </div>
                    <div class="weui-media-box__bd">
                             <h6>${item.sender_nickname}</h6>
                            <span class="weui-media-box__desc" style="background:white;font-size: 13px;color:black">
                               ${item.content}
                             
                            </span>
                   </div>                   
                </div> 
                                
                                `
                                    }
                                    // 本地未读聊天记录保存
                                    (function(){
                                        var json_str = "{'sender_code':'"+item.sender_code+"','type':'"+item.type+"','send_time':'"+item.send_time+"','content':'"+item.content+"','nickname':'"+item.sender_nickname+"','portrait':'"+sender_portrait+"'}";
                                        console.log(json_str);
                                        var history_chats = localStorage.getItem('history_'+group_code);
                                        if(!history_chats){
                                            history_chats = new Array();
                                            history_chats=[json_str];
                                            localStorage.setItem('history_'+group_code,JSON.stringify(history_chats));
                                        }else{
                                            history_chats = JSON.parse(history_chats);
                                            history_chats[history_chats.length] = json_str;
                                            if(history_chats.length>20){
                                                history_chats.shift();
                                            }
                                            localStorage.setItem('history_'+group_code,JSON.stringify(history_chats));
                                        }
                                    })();
                                    //保存聊天的好友资料
                                })
                            }
                        });
                        //向页面添加元素
                        var chatPage=$("#chatPage");
                        chatPage.append(html);
                        document.body.scrollTop=chatPage.height()+100;
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
                        while (i--){
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
                           // 本地存储聊天记录
                            var json_str = "{'sender_code':'"+data.sender_code+"','type':'"+data.type+"','send_time':'"+data.send_time+"','content':'"+data.content+"','nickname':'"+data.send_nickname+"','portrait':'"+data.send_portrait+"'}";
                            console.log(json_str);
                            var history_chats = localStorage.getItem('history_'+data.group);
                            if(!history_chats){
                                history_chats = new Array();
                                history_chats=[json_str];
                                localStorage.setItem('history_'+data.group,JSON.stringify(history_chats));
                            }else{
                                history_chats = JSON.parse(history_chats);
                                history_chats[history_chats.length] = json_str;
                                if(history_chats.length>20){
                                    history_chats.shift();
                                }
                                localStorage.setItem('history_'+data.group,JSON.stringify(history_chats));
                            }
                            //展示好友发送的聊天信息
                            var html="";
                            if(my_code===data.sender_code){//我自己的信息
                                var httP=data.send_portrait.split(":")[0];
                               var  send_portrait="";
                               if(httP==="http"){
                                   send_portrait=data.send_portrait
                               }else{
                                   send_portrait="http://wx.junxiang.ren/project/"+data.send_portrait
                               }
                               console.log(send_portrait);
                                if(data.type===2){//图片、文件
                                    html=`
                                    <p style="font-size: 12px;text-align: center">${(new Date()).toLocaleDateString()}</p>
        <div class="weui-media-box weui-media-box_appmsg">
             <div class="weui-media-box__bd">
                 <span class="weui-media-box__desc right" style="font-size: 13px;color: black;padding: 0;border: 0">
                    <img style="width: 80px" src="${data.content}" alt=""/>
                 </span>
            </div>          
             <div class="weui-media-box__hd" style="margin-left:.8em;">
                 <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${send_portrait}" alt="">
             </div>
         </div>
                                    `
                                } else if(data.type===3){//语音
                                    html=`
                                 <p style="font-size: 12px;text-align: center">${getLocalTime(data.send_time)}</p>
        <div class="weui-media-box weui-media-box_appmsg">
             <div class="weui-media-box__bd">
                 <span class="weui-media-box__desc right playVoice" style="background:#66CD00;font-size: 13px;color: black" title="${data.content}">
                    播放语音
                 </span>
            </div>
           
             <div class="weui-media-box__hd" style="margin-left:.8em;">
                 <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${send_portrait}" alt="">
             </div>
         </div>
                                                              
                                `
                                }else{//文字
                                    html=`
                                 <p style="font-size: 12px;text-align: center">${getLocalTime(data.send_time)}</p>
        <div class="weui-media-box weui-media-box_appmsg">
             <div class="weui-media-box__bd">
                 <span class="weui-media-box__desc right" style="background:#66CD00;font-size: 13px;color: black">${data.content}</span>
            </div>
           
             <div class="weui-media-box__hd" style="margin-left:.8em;">
                 <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${send_portrait}" alt="">
             </div>
         </div>
                                                              
                                `
                                }
                            }else{//群里其他人发的信息
                                var httPs=data.send_portrait.split(":")[0];
                                var  send_portraits="";
                                if(httP==="http"){
                                    send_portraits=data.send_portrait
                                }else{
                                    send_portraits="http://wx.junxiang.ren/project/"+data.send_portrait
                                }
                                if(data.type===2){//图片、文件
                                    html=`
                <p style="font-size: 12px;text-align: center">${getLocalTime(data.send_time)}</p>
                <div class="weui-media-box weui-media-box_appmsg" style="vertical-align: top">
                    <div class="weui-media-box__hd" style="margin-right:.8em;margin-top: 0" >
                        <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${send_portraits}" alt="">
                    </div>
                    <div class="weui-media-box__bd">
                     <h6>${data.send_nickname}</h6>
                            <span class="weui-media-box__desc" style="padding: 0">                            
                              <img src="${data.content}" alt="" style="width: 80px">
                            </span>
                   </div>                   
                </div>                  `
                                } else if(data.type===3){//语音
                                    html=`
                                <p style="font-size: 12px;text-align: center">${getLocalTime(data.send_time)}</p>
                <div class="weui-media-box weui-media-box_appmsg" style="vertical-align: top">
                    <div class="weui-media-box__hd" style="margin-right:.8em;margin-top: 0" >
                        <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${send_portraits}" alt="">
                    </div>
                    <div class="weui-media-box__bd">
                             <h6>${data.send_nickname}</h6>
                            <span class="weui-media-box__desc playVoice" style="background:white;font-size: 13px;color:black" title="${data.content}">
                              播放语音
                            
                            </span>
                   </div>                   
                </div> 
                                
                                `
                                }else{//文字
                                    html=`
                                <p style="font-size: 12px;text-align: center">${getLocalTime(data.send_time)}</p>
                <div class="weui-media-box weui-media-box_appmsg" style="vertical-align: top">
                    <div class="weui-media-box__hd" style="margin-right:.8em;margin-top: 0" >
                        <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${send_portraits}" alt="">
                    </div>
                    <div class="weui-media-box__bd">
                             <h6>${data.send_nickname}</h6>
                            <span class="weui-media-box__desc" style="background:white;font-size: 13px;color:black">
                               ${data.content}
                             
                            </span>
                   </div>                   
                </div> 
                                
                                `
                                }
                            }
                            var chatPage=$("#chatPage");
                            chatPage.append(html);
                            document.body.scrollTop=chatPage.height()+100;
                            //发送通知给服务器
                            var sendMessage=JSON.stringify({'apptoken':apptoken,'type':7,'group_code':current_code});
                            ws.send(sendMessage);
                            //播放语音
                            var num=0;
                            chatPage.on("click",".weui-media-box .weui-media-box__bd .playVoice",function(){
                                //从微信服务器下载因为返回的服务器id在存本地id
                                //获取服务器id
                                num++;
                                var id=$(this).attr("title");
                                console.log(id);
                                wx.downloadVoice({
                                    serverId: id, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
                                    isShowProgressTips: 1, // 默认为1，显示进度提示
                                    success: function (res){
                                        console.log("下载语音成功");
                                        var localId=res.localId; // 返回音频的本地ID
                                        if(num%2===1){
                                            wx.playVoice({
                                                localId:localId,  // 需要播放的音频的本地ID，由stopRecord接口获得
                                                success: function(){
                                                    console.log("播放语音成功");
                                                },
                                                fail:function () {
                                                    console.log("播放语音失败");
                                                }
                                            });
                                        }else{
                                            wx.pauseVoice({
                                                localId: localId, // 需要暂停的音频的本地ID，由stopRecord接口获得
                                                success:function () {
                                                    console.log("暂停成功");
                                                },
                                                fail:function(){
                                                    console.log("暂停失败");
                                                }
                                            });
                                        }

                                    },
                                    fail:function () {
                                        console.log("下载语音失败");
                                    }
                                });
                            });
                        }
                    }else{    //其他页面 暂不处理
                    }
                }
                break;
            case 8:
                console.log(result);
                if(result.errmsg==="该群已被禁言"){
                    showHide(result.errmsg);
                }

                break;
            case 9://历史消息


                break;
        }
    };
    ws.onopen=function(e){
        ws.send(JSON.stringify({'type' : 1,'apptoken' :apptoken}));
        (function(){
            var group=localStorage.getItem("group_code");
            console.log(group);
            var pathname = window.location.pathname;
            var patharr  = pathname.split('/');
            var html = patharr[parseInt(patharr.length-1)];
            if(html==="flockChat.html"){
                var sendMessage = JSON.stringify({'apptoken':apptoken,'type':7,'group_code':group});
                ws.send(sendMessage);
            }
        })();
    };
    //获取本地聊天记录
    (function(){
        var group=localStorage.getItem("group_code");
        var history_chat = localStorage.getItem('history_'+group);
        var my_code=localStorage.getItem("my_code");
        if(history_chat){
            var history= $.parseJSON(history_chat);
            var jsonObj = eval('(' + history + ')');
            console.log(jsonObj);
            data=[];
            $.each(history,function(i,item){
                var jsonObj = eval('(' + item + ')');
                data[i]=jsonObj;
            });
            console.log(data);
            var html="";
            $.each(data,function(i,item){
                var httP=item.portrait.split(":")[0];
                if(item.sender_code===my_code){//我的自己的聊天记录
                    console.log("聊天记录");
                    if(parseInt(item.type)===2){//内容为图片、文件
                        if(httP==="http"){//完整路径
                            html+=`
                                    <p style="font-size: 12px;text-align: center">${getLocalTime(item.send_time)}</p>
        <div class="weui-media-box weui-media-box_appmsg">
             <div class="weui-media-box__bd">
                 <span class="weui-media-box__desc right" style="font-size: 13px;color: black;padding: 0;border: 0">
                    <img style="width: 80px" src="${item.content}" alt=""/>
                 </span>
            </div>           
             <div class="weui-media-box__hd" style="margin-left:.8em;">
                 <img class="weui-media-box__thumb" src="${item.portrait}" alt="">
             </div>
         </div>
                                    `
                        }else{//相对路径
                            html+=`
                                    <p style="font-size: 12px;text-align: center">${getLocalTime(item.send_time)}</p>
        <div class="weui-media-box weui-media-box_appmsg">
             <div class="weui-media-box__bd">
                 <span class="weui-media-box__desc right" style="font-size: 13px;color: black;padding: 0;border: 0">
                    <img style="width: 80px" src="${item.content}" alt=""/>
                 </span>
            </div>           
             <div class="weui-media-box__hd" style="margin-left:.8em;">
                 <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${item.portrait}" alt="">
             </div>
         </div>
                                    `
                        }
                    } else if(parseInt(item.type)===3){//内容为语音
                        if(httP==="http"){//绝对路径
                            html+=`
                                 <p style="font-size: 12px;text-align: center">${getLocalTime(item.send_time)}</p>
        <div class="weui-media-box weui-media-box_appmsg">
             <div class="weui-media-box__bd">
                 <span class="weui-media-box__desc right playVoice" style="background:#66CD00;font-size: 13px;color: black" title="${item.content}">
                 语音播放
                 </span>
            </div>
             <div class="weui-media-box__hd" style="margin-left:.8em;">
                 <img class="weui-media-box__thumb" src="${item.portrait}" alt="">
             </div>
         </div>                                                              
                `
                        }else{//相对路径
                            html+=`
                                 <p style="font-size: 12px;text-align: center">${getLocalTime(item.send_time)}</p>
        <div class="weui-media-box weui-media-box_appmsg">
             <div class="weui-media-box__bd">
                 <span class="weui-media-box__desc right playVoice" style="background:#66CD00;font-size: 13px;color: black" title="${item.content}">
                 语音播放
                 </span>
            </div>
             <div class="weui-media-box__hd" style="margin-left:.8em;">
                 <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${item.portrait}" alt="">
             </div>
         </div>                                                              
                `
                        }

                    }else{//内容为文字
                        if(httP==="http"){//绝对路径
                            html+=`
                                 <p style="font-size: 12px;text-align: center">${getLocalTime(item.send_time)}</p>
        <div class="weui-media-box weui-media-box_appmsg">
             <div class="weui-media-box__bd">
                 <span class="weui-media-box__desc right" style="background:#66CD00;font-size: 13px;color: black">${item.content}</span>
            </div>
             <div class="weui-media-box__hd" style="margin-left:.8em;">
                 <img class="weui-media-box__thumb" src="${item.portrait}" alt="">
             </div>
         </div>                                                              
                `
                        }else{//相对路径
                            html+=`
                                 <p style="font-size: 12px;text-align: center">${getLocalTime(item.send_time)}</p>
        <div class="weui-media-box weui-media-box_appmsg">
             <div class="weui-media-box__bd">
                 <span class="weui-media-box__desc right" style="background:#66CD00;font-size: 13px;color: black">${item.content}</span>
            </div>
             <div class="weui-media-box__hd" style="margin-left:.8em;">
                 <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${item.portrait}" alt="">
             </div>
         </div>                                                              
                `
                        }

                    }
                }else{//好友的聊天记录
                    if(parseInt(item.type)===2){//内容为图片、文件
                        if(httP==="http"){
                            html+=`
                <p style="font-size: 12px;text-align: center">${getLocalTime(item.send_time)}</p>
                <div class="weui-media-box weui-media-box_appmsg" style="vertical-align: top">
                    <div class="weui-media-box__hd" style="margin-right:.8em;margin-top: 0" >
                        <img class="weui-media-box__thumb" src="${item.portrait}" alt="">
                    </div>
                    
                    <div class="weui-media-box__bd">
                    <h6>${item.nickname}</h6>
                            <span class="weui-media-box__desc" style="padding: 0">                            
                              <img src="${item.content}" alt="" style="width: 80px">
                            </span>
                   </div>                   
                </div> `
                        }else{
                            html+=`
                <p style="font-size: 12px;text-align: center">${getLocalTime(item.send_time)}</p>
                <div class="weui-media-box weui-media-box_appmsg" style="vertical-align: top">
                    <div class="weui-media-box__hd" style="margin-right:.8em;margin-top: 0" >
                        <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${item.portrait}" alt="">
                    </div>
                    
                    <div class="weui-media-box__bd">
                    <h6>${item.nickname}</h6>
                            <span class="weui-media-box__desc" style="padding: 0">                            
                              <img src="${item.content}" alt="" style="width: 80px">
                            </span>
                   </div>                   
                </div> `
                        }

                    } else if(parseInt(item.type)===3){//内容为语音
                        if(httP==="http"){
                            html+=`
                                <p style="font-size: 12px;text-align: center">${getLocalTime(item.send_time)}</p>
                <div class="weui-media-box weui-media-box_appmsg" style="vertical-align: top">
                    <div class="weui-media-box__hd" style="margin-right:.8em;margin-top: 0" >
                        <img class="weui-media-box__thumb" src="${item.portrait}" alt="">
                    </div>
                   
                   
                    <div class="weui-media-box__bd">
                     <h6>${item.nickname}</h6>
                        <span class="weui-media-box__desc playVoice" style="background:white;font-size: 13px;color:black" title="${item.content}">
                               播放语音                            
                        </span>
                   </div>                   
                </div> 
                                
                                `
                        }else{
                            if(httP==="http"){
                                html+=`
                                <p style="font-size: 12px;text-align: center">${getLocalTime(item.send_time)}</p>
                <div class="weui-media-box weui-media-box_appmsg" style="vertical-align: top">
                    <div class="weui-media-box__hd" style="margin-right:.8em;margin-top: 0" >
                        <img class="weui-media-box__thumb" src="${item.portrait}" alt="">
                    </div>
                   
                   
                    <div class="weui-media-box__bd">
                     <h6>${item.nickname}</h6>
                        <span class="weui-media-box__desc playVoice" style="background:white;font-size: 13px;color:black" title="${item.content}">
                               播放语音                            
                        </span>
                   </div>                   
                </div> 
                                
                                `
                            }else{
                                html+=`
                                <p style="font-size: 12px;text-align: center">${getLocalTime(item.send_time)}</p>
                <div class="weui-media-box weui-media-box_appmsg" style="vertical-align: top">
                    <div class="weui-media-box__hd" style="margin-right:.8em;margin-top: 0" >
                        <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${item.portrait}" alt="">
                    </div>                                     
                    <div class="weui-media-box__bd">
                     <h6>${item.nickname}</h6>
                        <span class="weui-media-box__desc playVoice" style="background:white;font-size: 13px;color:black" title="${item.content}">
                               播放语音                            
                        </span>
                   </div>                   
                </div> 
                                
                                `
                            }
                        }
                    }else{//内容为文字
                        if(httP==="http"){
                            html+=`
                                <p style="font-size: 12px;text-align: center">${getLocalTime(item.send_time)}</p>
                <div class="weui-media-box weui-media-box_appmsg" style="vertical-align: top">
                    <div class="weui-media-box__hd" style="margin-right:.8em;margin-top: 0" >
                        <img class="weui-media-box__thumb" src="${item.portrait}" alt="">
                    </div>
                   
                   
                    <div class="weui-media-box__bd">
                     <h6>${item.nickname}</h6>
                        <span class="weui-media-box__desc" style="background:white;font-size: 13px;color:black">
                               ${item.content}                            
                        </span>
                   </div>                   
                </div> 
                                
                                `
                        }else{
                            html+=`
                                <p style="font-size: 12px;text-align: center">${getLocalTime(item.send_time)}</p>
                <div class="weui-media-box weui-media-box_appmsg" style="vertical-align: top">
                    <div class="weui-media-box__hd" style="margin-right:.8em;margin-top: 0" >
                        <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${item.portrait}" alt="">
                    </div>
                   
                   
                    <div class="weui-media-box__bd">
                     <h6>${item.nickname}</h6>
                        <span class="weui-media-box__desc" style="background:white;font-size: 13px;color:black">
                               ${item.content}                            
                        </span>
                   </div>                   
                </div> 
                                
                                `
                        }

                    }
                }
            });
            var chatPage=$("#chatPage");
            chatPage.html(html);
            document.body.scrollTop=chatPage.height()+100;
            //播放语音
            var number=0;
            chatPage.on("click",".weui-media-box .weui-media-box__bd .playVoice",function(){
                //从微信服务器下载因为返回的服务器id在存本地id
                //获取服务器id
                number++;
                var id=$(this).attr("title");
                console.log(id);
                wx.downloadVoice({
                    serverId: id, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res){
                        console.log("下载语音成功");
                        var localId=res.localId; // 返回音频的本地ID
                        if(number%2===1){
                            wx.playVoice({
                                localId:localId,  // 需要播放的音频的本地ID，由stopRecord接口获得
                                success: function(){
                                    console.log("播放语音成功");
                                },
                                fail:function () {
                                    console.log("播放语音失败");
                                }
                            });
                        }else{
                            wx.pauseVoice({
                                localId: localId, // 需要暂停的音频的本地ID，由stopRecord接口获得
                                success:function () {
                                    console.log("暂停成功");
                                },
                                fail:function(){
                                    console.log("暂停失败");
                                }
                            });
                        }

                    },
                    fail:function () {
                        console.log("下载语音失败");
                    }
                });
            });
        }
    })();
    // 聊天历史记录
    $(".historyNews").click(function(){
        var group=localStorage.getItem("group_code");
        console.log(group);
        ws.send(JSON.stringify({'type':9,'apptoken' : apptoken,'group':group}));
    });
    //群聊点击发送
    $(".pushBtn").click(function(){
        var chatContent=$(".chatContent");
        var content=chatContent.val();                //获取页面发送内容
        var group =localStorage.getItem("group_code");           //获取发送好友的群code
        var message_type=1;                      //消息类型        1:文字消息 2:语音消息 3：文件消息
        console.log(JSON.stringify({'type':3,'content':content,'apptoken':apptoken,'account_code':group,'message_type':message_type}));
        ws.send(JSON.stringify({"group":group,'type' : 3,'content':content,'apptoken':apptoken,'message_type':message_type}));
        // 添加本地页面
        chatContent.val("");

    });
    //发送消息给好友
    $(".elements").click(function(){
        var elements=$(".elements");
        var content=elements.val('content');                        //获取页面发送内容
        var account_code =elements.val('user_code');          //获取发送好友的code
        var message_type = 1;                      //消息类型  1:文字消息 2:语音消息 3：文件消息
        ws.send(JSON.stringify({'type' : 2, 'content' : content,'apptoken' : apptoken,'account_code':account_code,'message_type':message_type}));
    });
    // 发送图片
    $("#uploaderInputPic").change(function(){
            var formData= new FormData();
            var apptoken=localStorage.getItem("apptoken");
            formData.append("file",$("#uploaderInputPic")[0].files[0]);
            var data=["",JSON.stringify({"apptoken":apptoken})];
            var json=jsEncryptData(data);
            formData.append("data",json);
            console.log(formData);
            $.ajax({
                type:"POST",
                url:url+"ChatMessage_uploadGroupFile",
                fileElementId:'uploaderInput',
                data:formData,
                processData : false,
                contentType : false,
                secureuri:false,
                success : function(data){
                    // 解密
                    data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        localStorage.setItem("apptoken",data.apptoken);
                        console.log(data.data[0]);
                        localStorage.setItem("friendPic","http://wx.junxiang.ren/project/"+data.data[0]);
                        $(".chatContent").val("");
                        var content=localStorage.getItem("friendPic");
                        var group =localStorage.getItem("group_code");           //获取发送好友的群code
                        console.log(content);
                        var message_type = 2;
                        ws.send(JSON.stringify({"group":group,'type' : 3,'content':content,'apptoken':apptoken,'message_type':message_type}));
                    }
                },
                error:function (data) {
                    console.log(data);
                }
            });

        }
    );
    // 上传文件
    $("#uploaderInputFile").change(function(){
            var formData= new FormData();
            var apptoken=localStorage.getItem("apptoken");
            formData.append("file",$("#uploaderInputFile")[0].files[0]);
            var data=["",JSON.stringify({"apptoken":apptoken})];
            var json=jsEncryptData(data);
            formData.append("data",json);
            console.log(formData);
            $.ajax({
                type:"POST",
                url:url+"ChatMessage_uploadGroupFile",
                fileElementId:'uploaderInput',
                data:formData,
                processData : false,
                contentType : false,
                secureuri:false,
                success : function(data){
                    // 解密
                    data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        localStorage.setItem("apptoken",data.apptoken);
                        console.log(data.data[0]);
                        localStorage.setItem("friendPic","http://wx.junxiang.ren/project/"+data.data[0]);
                        $(".chatContent").val("");
                        var content=localStorage.getItem("friendPic");
                        var group =localStorage.getItem("group_code");           //获取发送好友的群code
                        console.log(content);
                        var message_type = 2;
                        ws.send(JSON.stringify({"group":group,'type' : 3,'content':content,'apptoken':apptoken,'message_type':message_type}));
                    }
                },
                error:function (data){
                    console.log(data);
                }
            });

        }
    );

    // 发送语音功能
    (function(){
        var localId="",
            signature = '',
            serverId='';
        $.ajax({
            url:'http://39.108.237.198/project/index.php?m=Api&c=JsSdk&a=getSignPackage&debugging=test',
            type:'POST',
            data : {'url':location.href},
            success:function(data){
                console.log(data);
                signature = data.data;
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: signature.appId, // 必填，公众号的唯一标识
                    timestamp:signature.timestamp , // 必填，生成签名的时间戳
                    nonceStr: signature.nonceStr, // 必填，生成签名的随机串
                    signature: signature.signature,// 必填，签名，见附录1
                    jsApiList: [ 'startRecord','stopRecord','playVoice','stopVoice','downloadVoice','uploadVoice','pauseVoice','onVoiceRecordEnd'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
            }
        });
        wx.ready(function(){
            wx.onVoicePlayEnd({
                success: function(res){
                    stopWave();
                }
            });
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        });
        wx.error(function(res){
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        });
        // 开始录音
        function starRecord(event){
            event.preventDefault();
            START = new Date().getTime();
            recordTimer = setTimeout(function(){
                wx.startRecord({
                    success: function(){
                        localStorage.rainAllowRecord='true';
                    },
                    cancel: function () {
                        alert('用户拒绝授权录音');
                    }
                });
            },300);
        }
        //结束录音
        function stopRecord(event) {
            event.preventDefault();
            END = new Date().getTime();
            if((END - START) < 300){
                END = 0;
                START = 0;
                //小于300ms，不录音
                clearTimeout(recordTimer);
            }else{
                wx.stopRecord({
                    success: function (res) {
                        localId=res.localId;
                        uploadRecord();
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
            }
        }
        //监听录音自动停止接口
        function onVoiceRecordEnd(){
            wx.onVoiceRecordEnd({
                // 录音时间超过一分钟没有停止的时候会执行 complete 回调
                complete: function (res) {
                    localId = res.localId;
                }
            });
        }
        // 播放语音文件
        function playRecord(local_id,serverId){
            wx.playVoice({
                localId:local_id,  // 需要播放的音频的本地ID，由stopRecord接口获得
                success: function(){
                    wx.stopVoice({
                        localId:local_id
                    });
                },
                fail:function(){
                    wx.downloadVoice({
                        serverId:serverId,
                        isShowProgressTips: 1,
                        success: function (res) {
                            localId = res.localId;
                            playRecord(localId,serverId);
                        }
                    });
                }
            });
        }
        //暂停播放语音文件
        function pauseRecCord(){
            wx.pauseVoice({
                localId: localId // 需要暂停的音频的本地ID，由stopRecord接口获得
            });
        }
        //停止播放语音文件
        function stopPlayRecord(){
            wx.stopVoice({
                localId: localId // 需要停止的音频的本地ID，由stopRecord接口获得
            });
        }
        //上传录音
        function uploadRecord(){
            //调用微信的上传录音接口把本地录音先上传到微信的服务器
            //不过，微信只保留3天，而我们需要长期保存，我们需要把资源从微信服务器下载到自己的服务器
            wx.uploadVoice({
                localId:localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                    //把录音在微信服务器上的id（res.serverId）发送到自己的服务器供下载。
                    serverId = res.serverId; // 返回音频的服务器端ID
                    var group =localStorage.getItem("group_code");
                    var  message_type=3;
                    ws.send(JSON.stringify({"group":group,'type' : 3,'content':serverId,'apptoken':apptoken,'message_type':message_type}));
                }
            });
        }
        // 下载录音
        function downloadRecord(){
            wx.ready(function () {
                wx.downloadVoice({
                    serverId: serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        localId = res.localId; // 返回音频的本地ID
                        return localId;
                    }
                });
            })
        }
        // 调用函数
        //按下开始录音
        $("#talk_btn").on("touchstart",function(){
            starRecord(event);
        });
        //松手结束录音
        $("#talk_btn").on("touchend",function(){
            stopRecord(event);
        });
    })();

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
    $(".imgBtn").click(function(){
        var grids=$(".weui-grids");
        if(grids.is(":hidden")){
            grids.show();
        }else{
            grids.hide();
        }
    });
    // 获取群名字
    var group_name =localStorage.getItem("group_name");
    $(".group_name").html(group_name);
    // 图片放大预览
    (function(){
        var gallery=$(".weui-gallery");
        $("#chatPage").on("click",".weui-media-box .weui-media-box__bd .weui-media-box__desc img",function(){
            var url=$(this).attr("src");
            if(gallery.is(":hidden")){
                gallery.show();
                $(".weui-gallery__img").attr("style","background-image: url("+url +")")
            }
        });
       gallery.click(function(){
            $(".weui-gallery").hide();
        });
    })();
});