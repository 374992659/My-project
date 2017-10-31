$(document).ready(function(){
             // 获取好友头像
         var header=localStorage.getItem("header"),
            // 获取送好友的code
            sender_code=localStorage.getItem("sender_code"),
            // 我自己的code
            my_code=localStorage.getItem("my_code"),
            // 我自己的头像
            my_portrait=localStorage.getItem("my_portrait"),
            // 我自己名字
            my_nickname=localStorage.getItem("my_nickname");
    (function(){
        // 获取apptoken
        var apptoken = localStorage.getItem('apptoken');
        // 时间戳的转换
        function getLocalTime(nS) {
            return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
        }
        if(!apptoken)alert('请重新登录');
        var ws = new WebSocket('ws://39.108.237.198:8282'); //发起绑定


        ws.onmessage=function(e){
            var result = JSON.parse(e.data);                   //服务器返回结果
           console.log(result);
            switch(parseInt(result.type)){
                case 1:            //1 .在线好友、好友未读消息、群未读消息
                    if(parseInt(result.errcode)===0){
                        // 获取本地存储的历史信息
                        var data = (result.data);
                        localStorage.setItem('online_friends',data.online_friends);         //本地保存在线好友列表
                        var friends_new_message = data.friends_new_message;
                        if(friends_new_message){//好友新消息  已按用户分组 时间倒序排列
                            var html="";
                            $.each(friends_new_message,function(i,item){
                                if(item.sender_code===sender_code){
                                    $.each(item.content,function(i,item){
                                        html+=`
                <p style="font-size: 10px;text-align: center">${getLocalTime(item.send_time)}</p>
                <div class="weui-media-box weui-media-box_appmsg" style="vertical-align: top">
                    <div class="weui-media-box__hd" style="margin-right:.8em;margin-top: 0" >
                        <img class="weui-media-box__thumb header_img" src="${item.sender_portrait}" alt="">
                    </div>
                    <div class="weui-media-box__bd content">
                        <span class="weui-media-box__desc" style="background:white;font-size: 13px;color:black">${item.content}</span>
                    </div>
                </div>
                                       `
                                    });
                                var chatPage=$("#chatPage");
                                    chatPage.prepend(html);
                                    $(".header_img").attr("src",header);
                                    document.body.scrollTop=chatPage.height()
                                }
                            });
                        }
                        var group_new_message=data.group_new_message;
                        if(group_new_message){//群组新消息  已按群分组 时间倒序排列

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
                    if(parseInt(result.errcode)===0){
                        var data =(result.data);
                        var pathname = window.location.pathname;
                        var patharr  = pathname.split('/');
                        var html = patharr[parseInt(patharr.length-1)];
                        if(html ==='friendChat.html'){             //如果当前页面在好友聊天界面  ***.html为好友聊天页面
                            var current_code = localStorage.getItem("sender_code");   //获取当前聊天好友code
                            if(current_code === data.sender_code){      //为同一个人 直接将聊天信息展示在页面内 向服务器读取了该消息的通知
                               // 把好友消息存在本地
                             console.log(data.content);
                             var img=data.content.split("/");
                             var http=img[0];
                             var chatPage=$("#chatPage");
                             // 存在本地的聊天记录
                             var json_str = "{'sender_code':'"+data.sender_code+"','type':'"+data.type+"','send_time':'"+data.send_time+"','content':'"+data.content+"','nickname':'"+data.sender_nickname+"','portrait':'"+data.send_portrait+"'}";
                               console.log(json_str);
                                var history_chats = localStorage.getItem('history_'+data.sender_code);
                                if(!history_chats){
                                    history_chat = new Array();
                                    history_chats=[json_str];
                                    localStorage.setItem('history_'+data.sender_code,JSON.stringify(history_chats));
                                }else{
                                    history_chats = JSON.parse(history_chats);
                                    history_chats[history_chats.length] = json_str;
                                    localStorage.setItem('history_'+data.sender_code,JSON.stringify(history_chats));
                                }


                             // var sender_code = data.sender_code;
                             //    history_chats = localStorage.getItem('history_'+data.sender_code);
                             //    if(history_chats){
                             //        alert(typeof (history_chats));
                             //        var length = history_chats.length;
                             //        history_chats[length]= json_str;
                             //        console.log(JSON.stringify(history_chats));
                             //        localStorage.setItem('history_'+data.sender_code,JSON.stringify(history_chats));
                             //    }else{
                             //        history_chats= [json_str];
                             //        localStorage.setItem('history_'+data.sender_code,JSON.stringify(history_chats));
                             //    }


                                 // var   arr={};
                                 //  arr[sender_code]=[];
                                 //  var hash=[];
                                 //  hash["content"]=data.content;
                                 //  hash["time"]=data.send_time;
                                 //  arr.sender_code.push(hash);
                                 //  console.log(arr);
                                 //  var string=JSON.stringify(arr);
                                 //  console.log(typeof string);
                                 //  localStorage.setItem("history",string);
                                //展示好友发送的聊天信息
                                if(http==="http:"){
                                    var  html=`
                <p style="font-size: 12px;text-align: center">${getLocalTime(data.send_time)}</p>
                <div class="weui-media-box weui-media-box_appmsg" style="vertical-align: top">
                    <div class="weui-media-box__hd" style="margin-right:.8em;margin-top: 0" >
                        <img class="weui-media-box__thumb" src="${data.send_portrait}" alt="">
                    </div>
                    <div class="weui-media-box__bd">
                            <span class="weui-media-box__desc" style="padding: 0">
                              
                              <img src="${data.content}" alt="" style="width: 80px">
                            </span>
                   </div>                   
                </div>                  `;
                                    chatPage.append(html);
                                }else{
                                    var  html=`
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
                </div>                  `;
                                    chatPage.append(html);
                                }
                                document.body.scrollTop=chatPage.height();
                                //发送通知给服务器
                                console.log(JSON.stringify({'apptoken':apptoken,'type':6,'account_code':current_code}));
                                var sendMessage = JSON.stringify({'apptoken':apptoken,'type':6,'account_code':current_code});
                                ws.send(sendMessage);
                            }
                        }
                    }
                    break;
                case 5:         //接收到群消息
                    if(parseInt(result.errcode)===-0){
                        var data =(result.data);
                        var pathname = window.location.pathname;
                        var patharr  = pathname.split('/');
                        var html = patharr[parseInt(patharr.length-1)];
                        console.log(data);
                        console.log(apptoken);
                        if(html ==='flockChat.html'){             //如果当前页面在群聊天界面  ***.html为群聊天页面
                            var current_code = localStorage.getItem("group_code");   //获取当前聊天群的群code
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
                case 8:
                    console.log(result);
                    break;
                case 9:
                    if(parseInt(result.errcode)===0){
                        console.log(1);
                        console.log(result.data);
                        var html="";
                        $.each(result.data,function(i,item){
                            if(item.sender_code==sender_code){
                                html+=`
                <div class="sendHtml">
                     <p style="font-size: 12px;text-align: center">${getLocalTime(item.send_time)}</p>
                     <div class="weui-media-box weui-media-box_appmsg" style="vertical-align: top">
                        <div class="weui-media-box__hd" style="margin-right:.8em;margin-top: 0" >
                            <img class="weui-media-box__thumb" src="${item.getter_portrait}" alt="">
                        </div>
                        <div class="weui-media-box__bd">
                                <span class="weui-media-box__desc" style="background:white;font-size: 13px;color: black">
                                   ${item.content}
                                </span>
                       </div>                   
                    </div>                
                </div>
                                `
                            }else if(item.getter_code==sender_code){
                                html+=`
                            <div class="getHtml">
                                <p style="font-size: 12px;text-align: center">${getLocalTime(item.send_time)}</p>
                                 <div class="weui-media-box weui-media-box_appmsg">
                                    <div class="weui-media-box__bd">
                                        <span class="weui-media-box__desc right"  style="background:#66CD00;font-size: 13px;color: black">${item.content}</span>
                                    </div>
                                    <div class="weui-media-box__hd" style="margin-left:.8em;">
                                        <img class="weui-media-box__thumb" src="image/firendb.jpg" alt="">
                                    </div>
                                 </div>   
                            </div>
                                 
                                `
                            }
                        });
                        $("#chatPage").prepend(html);

                    }
                    break
            }
        };
        ws.onopen=function(e){
            ws.send(JSON.stringify({'type' : 1,'apptoken' :apptoken}));
            (function(){
                var pathname = window.location.pathname;
                var patharr  = pathname.split('/');
                var html = patharr[parseInt(patharr.length-1)];
                if(html==="friendChat.html"){
                    var sendMessage = JSON.stringify({'apptoken':apptoken,'type':6,'account_code':sender_code});
                    ws.send(sendMessage);
                }
            })();

        };
         //获取本地聊天记录
        (function(){
            var history_chat = localStorage.getItem('history_'+sender_code);
            console.log(typeof history_chat);
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
                    if(item.sender_code===sender_code){
                        html+=`
                <div class="sendHtml">
                     <p style="font-size: 12px;text-align: center">${getLocalTime(item.send_time)}</p>
                     <div class="weui-media-box weui-media-box_appmsg" style="vertical-align: top">
                        <div class="weui-media-box__hd" style="margin-right:.8em;margin-top: 0" >
                            <img class="weui-media-box__thumb" src="${item.portrait}" alt="">
                        </div>
                        <div class="weui-media-box__bd">
                                <span class="weui-media-box__desc" style="background:white;font-size: 13px;color: black">
                                   ${item.content}
                                </span>
                       </div>                   
                    </div>                
                </div>
                                `
                    }else{
                        html+=`
                            <div class="getHtml">
                                <p style="font-size: 12px;text-align: center">${getLocalTime(item.send_time)}</p>
                                 <div class="weui-media-box weui-media-box_appmsg">
                                    <div class="weui-media-box__bd">
                                        <span class="weui-media-box__desc right"  style="background:#66CD00;font-size: 13px;color: black">${item.content}</span>
                                    </div>
                                    <div class="weui-media-box__hd" style="margin-left:.8em;">
                                        <img class="weui-media-box__thumb" src="image/firendb.jpg" alt="">
                                    </div>
                                 </div>   
                            </div>
                                 
                                `
                    }
                });
                var chatPage=$("#chatPage");
                chatPage.prepend(html);
                document.body.scrollTop=chatPage.height();
            }

        })();

        // 聊天历史记录
        $(".historyNews").click(function(){
            ws.send(JSON.stringify({'type':9,'apptoken' : apptoken,'user_code':sender_code}));
        });
        //群聊点击发送
        $(" ").click(function(){
            var content=$(".chatContent").val();                 //获取页面发送内容
            var group =localStorage.getItem("group_code");       //获取发送好友的code
            var message_type = 1;                      //消息类型 1:文字消息 2:语音消息 3：文件消息
            ws.send(JSON.stringify({'type':2,'content':content,'apptoken' : apptoken,'account_code':group,'message_type':message_type}));
        });
        //发送消息给好友
        $(".pushBtn").click(function(){
            var apptoken=localStorage.getItem("apptoken");
            var content=$(".chatContent").val();
            //获取页面发送内容
            var account_code =sender_code;          //获取发送好友的code
            var message_type = 1;                      //消息类型  1:文字消息 2:语音消息 3：文件消息
            console.log(JSON.stringify({'type':2,'content':content,'apptoken':apptoken,'account_code':account_code,'message_type':message_type}));
            ws.send(JSON.stringify({'type':2,'content':content,'apptoken':apptoken,'account_code':account_code,'message_type':message_type}));
            // 添加本地页面
            var  html=`
         <p style="font-size: 12px;text-align: center">${(new Date()).toLocaleDateString()}</p>
        <div class="weui-media-box weui-media-box_appmsg">
             <div class="weui-media-box__bd">
                 <span class="weui-media-box__desc right" style="background:#66CD00;font-size: 13px;color: black">${content}</span>
            </div>
             <div class="weui-media-box__hd" style="margin-left:.8em;">
                 <img class="weui-media-box__thumb" src="image/firendb.jpg" alt="">
             </div>
         </div>
            `;
            var chatPage=$("#chatPage");
            chatPage.append(html);
            $(".chatContent").val("");
            //保持滚动条一直在最底部
            document.body.scrollTop=chatPage.height();
            // 自己发送的消息存本地
            // 把好友消息存在本地
            // 获取发送的时间戳
            var sender=localStorage.getItem("sender_code");
           var time= (new Date()).toLocaleDateString();
            var json_str = "{'sender_code':'"+my_code+"','type':'"+message_type+"','send_time':'"+time+"','content':'"+content+"','nickname':'"+my_nickname+"','portrait':'"+my_portrait+"'}";
            console.log(json_str);
            var history_chats = localStorage.getItem('history_'+sender_code);
            if(!history_chats){
                history_chat = new Array();
                history_chats=[json_str];
                localStorage.setItem('history_'+sender,JSON.stringify(history_chats));
            }else{
                history_chats = JSON.parse(history_chats);
                history_chats[history_chats.length] = json_str;
                localStorage.setItem('history_'+sender,JSON.stringify(history_chats));
            }


        });
        // 发送图片
        $("#uploaderInputPic").change(function(){
            var formData= new FormData();
            console.log($("#uploaderInputPic")[0].files[0]);
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
                        var  html=`
         <p style="font-size: 12px;text-align: center">${(new Date()).toLocaleDateString()}</p>
        <div class="weui-media-box weui-media-box_appmsg">
             <div class="weui-media-box__bd">
                 <span class="weui-media-box__desc right" style="font-size: 13px;color: black;padding: 0;border: 0">
                    <img style="width: 80px" src="http://wx.junxiang.ren/project/${data.data[0]}" alt=""/>
                 </span>
            </div>
             <div class="weui-media-box__hd" style="margin-left:.8em;">
                 <img class="weui-media-box__thumb" src="image/firendb.jpg" alt="">
             </div>
         </div>
            `;
                        var chatPage=$("#chatPage");
                        chatPage.append(html);
                        $(".chatContent").val("");
                        var content=localStorage.getItem("friendPic");
                        console.log(content);
                        var message_type = 2;
                        var account_code =sender_code;
                        ws.send(JSON.stringify({'type':2,'content':content,'apptoken' : apptoken,'account_code':account_code,'message_type':message_type}));
                    }
                },
                error:function (data) {
                    console.log(data);
                }
            });

             }
         );
        /*
        * 判断是否存在元素
        * */
        function contains(arr, obj){
            var i = arr.length;
            while (i--){
                if (arr[i] === obj){
                    return true;
                }
            }
            return false;
        }
        /*
        * 生成随机唯一字符
        * */
        function getRandCode(){
            var key = new Date().getTime()+(Math.random()*100000000);
            return key;
        }
    })();
    $(".imgBtn").click(function(){
        if($(".weui-grids").is(":hidden")){
            $(".weui-grids").show();
        }else{
            $(".weui-grids").hide();
        }
    });
    //上传图片
    // $('#uploaderInputPic').change(function(e) {
    //     // var Url=window.URL.createObjectURL(this.files[0]) ;
    //     // console.log(Url);
    //     var formData= new FormData();
    //     console.log($("#uploaderInputPic")[0].files[0]);
    //     var apptoken=localStorage.getItem("apptoken");
    //     formData.append("file",$("#uploaderInputPic")[0].files[0]);
    //     var data=["",JSON.stringify({"apptoken":apptoken})];
    //     var json=jsEncryptData(data);
    //     formData.append("data",json);
    //     console.log(formData);
    //     $.ajax({
    //         type:"POST",
    //         url:url+"ChatMessage_uploadGroupFile",
    //         fileElementId:'uploaderInput',
    //         data:formData,
    //         processData : false,
    //         contentType : false,
    //         secureuri:false,
    //         success : function(data){
    //             // 解密
    //             data=jsDecodeData(data);
    //             console.log(data);
    //             if(data.errcode===0){
    //                 localStorage.setItem("apptoken",data.apptoken);
    //                 console.log(data.data[0]);
    //                 localStorage.setItem("friendPic","http://wx.junxiang.ren/project/"+data.data[0]);
    //                 var  html=`
    //      <p style="font-size: 12px;text-align: center">${(new Date()).toLocaleDateString()}</p>
    //     <div class="weui-media-box weui-media-box_appmsg">
    //          <div class="weui-media-box__bd">
    //              <span class="weui-media-box__desc right" style="font-size: 13px;color: black;padding: 0;border: 0">
    //                 <img style="width: 100px" src="http://wx.junxiang.ren/project/${data.data[0]}" alt=""/>
    //              </span>
    //         </div>
    //          <div class="weui-media-box__hd" style="margin-left:.8em;">
    //              <img class="weui-media-box__thumb" src="image/firendb.jpg" alt="">
    //          </div>
    //      </div>
    //         `;
    //                 var chatPage=$("#chatPage");
    //                 chatPage.append(html);
    //                 $(".chatContent").val("");
    //             }
    //         },
    //         error:function (data) {
    //             console.log(data);
    //         }
    //     });
    // });
    //上传文件
    $('#uploaderInputFile').change(function(e) {
        var Url=window.URL.createObjectURL(this.files[0]) ;
        var formData= new FormData();
        console.log($("#uploaderInputFile")[0]);
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
                    localStorage.setItem("apptoekn",data.apptoekn);
                    console.log(data.data[0]);
                    var  html=`
         <p style="font-size: 12px;text-align: center">${(new Date()).toLocaleDateString()}</p>
        <div class="weui-media-box weui-media-box_appmsg">
             <div class="weui-media-box__bd">
                 <span class="weui-media-box__desc right" style="font-size: 13px;color: black;padding: 0;border: 0">
                    <img style="width: 100px" src="http://wx.junxiang.ren/project/${data.data[0]}" alt=""/>
                 </span>
            </div>
             <div class="weui-media-box__hd" style="margin-left:.8em;">
                 <img class="weui-media-box__thumb" src="image/firendb.jpg" alt="">
             </div>
         </div>
            `;
                    var chatPage=$("#chatPage");
                    chatPage.append(html);
                    $(".chatContent").val("");
                }
            },
            error:function (data) {
                console.log(data);
            }
        });
    });
    //上传语音
});