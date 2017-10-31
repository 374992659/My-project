$(document).ready(function() {
    "use strict";

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
                        console.log(item.friend_user_code);
                        allFriend_code[i]=item.friend_user_code;
                    });
                    console.log(allFriend_code);
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
        ws.onmessage = function (e) {
            var result = JSON.parse(e.data);                   //服务器返回结果
            var friends_new_messageNum=0,
                group_new_messageNum=0,
                friends_new_applyNum=0;
            console.log(result);
            switch(parseInt(result.type)){
                case 1:            //1 .在线好友、好友未读消息、群未读消息
                    if(parseInt(result.errcode)===0){
                        var data = (result.data);
                        // 在线好友
                        var online_friends=data.online_friends;
                        console.log(data);
                        if(online_friends){
                            // 获取所有好友的code
                            // 获取在线好友code
                           var onlineFried=[];
                            $.each(online_friends,function(i,item){
                                onlineFried.push(item);
                            });
                            $(".online").html(onlineFried.length);
                            // 获取所有好友
                            var allFriend=localStorage.getItem("allFriend_code");
                              console.log(typeof allFriend);
                             var all=JSON.parse(allFriend);
                             console.log(typeof all);
                            console.log(all);
                            console.log(onlineFried);
                            for(var i=0 ,len=all.length;i<len;i++){
                                console.log(all[i]);
                                for(var j=0,le=onlineFried.length;j<le;j++){
                                    if(all[i]==onlineFried[j]){
                                        console.log(onlineFried[j]);
                                        $("#"+onlineFried[j]).attr("style","opacity: .6");
                                        console.log($("#"+onlineFried[j]));
                                        console.log(123);
                                    }
                                }
                            }
                            console.log(onlineFried.length);

                            localStorage.setItem("online_friends",JSON.stringify(onlineFried));
                        }
                        // 好友未读新消息
                        var friends_new_message=data.friends_new_message;
                        if(friends_new_message){              //好友新消息  已按用户分组 时间倒序排列
                            $.each(friends_new_message,function(i,item){
                                friends_new_messageNum+=item.message_num;
                                // 存在本地的聊天记录
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
                        }
                    }
                    break;

                case 2:           //2.好友上线通知 更新本地在线好友列表
                    if(parseInt(result.errcode)===0){
                        var data = (result.data);
                        var friend_code = data.user_code;
                        var online_friends = localStorage.getItem('online_friends');
                        console.log(online_friends);
                        if(!contains(online_friends,friend_code)){
                            // var newOnline = JSON.parse(online_friends);
                            // newOnline.push(friend_code);
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
                           console.log(num);
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
                            console.log(num);
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
    //功能1 请求好友分组
    var apptoken=localStorage.getItem("apptoken"),
    data=["", JSON.stringify({"apptoken":apptoken})],
    encreptdata = jsEncryptData(data);
    console.log(data);
    $.ajax({
        url:url+"friends_getGroup",
        type:"POST",
        data:{"data":encreptdata},
        success: function (data){
            data = jsDecodeData(data);
            console.log(data);
            if(data.errcode===0){
                localStorage.setItem("apptoken",data.apptoken);
                console.log(data.data.user_code);
                localStorage.setItem("my_code",data.data.user_code);
                var html = "";
                $.each(data.data,function(i, item){
                    html += `
     <div class="weui-cells">
        <div class="weui-cell LinkBtn"  title="${item.id}">
            <div class="weui-cell__hd ">
               <img class="linkBtn" src="image/right.png "  title="${item.id}">
            </div>
            <div class="weui-cell__bd">
                <p style=""  title="${item.id}">${item.group_name}</p>
            </div>
            <div class="weui-cell__ft" style="">
                <span class="online" style="font-size: 15px"></span>/${item.total}
            </div>
        </div>
        <div class="weui-panel weui-panel_access friendList friend" style="display: none">
            <div class="weui-panel__bd " id="${item.id}">
                    
            </div>
        </div> 
     </div>                  
        `
                });
          $(".group").append(html);
            }else{
                    window.location.href ="landing.html";
            }
        }
    });
    $(".group").on("click", ".weui-cells .LinkBtn", function (e) {
        // 功能2 请求好友分组下的好友信息
        (function(){
            //获取好友分组id
            var id=$(e.target).attr("title");
            console.log(id);
            // 获取group_id
            var apptoken=localStorage.getItem("apptoken");
            var title=$(e.target).attr("title");
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
                            if(item.group_id==id){
                                html+=`
                    <div class="weui-media-box weui-media-box_appmsg skipChat" title="${item.friend_user_code}"">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb " src="${item.friend_portrait}"   id="${item.friend_user_code}">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title">${item.friend_nickname}</h4>
                            <p class="weui-media-box__desc remark">${item.friend_signature}</p>
                        </div>
                    </div>
                            `
                            }
                        });
                        $("#"+id).html(html);
                        console.log( $("#"+id));
                        //获取个人介绍的内容
                        var remark=$(".remark");
                        console.log(remark.html());
                        if(remark.html()){
                            remark.html("此人很懒哦什么都没有留下")
                        }
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
        console.log(key);
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
        console.log(data);
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
                    <div class="weui-media-box weui-media-box_appmsg skipChat" title="${item.friend_user_code}">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" src="${item.friend_portrait}" alt="">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title name">${item.friend_nickname}</h4>
                            <p class="weui-media-box__desc searchRemark">${item.friend_signature}</p>
                        </div>                      
                    </div>
                    `
                    });
                    $(".keyFriend").append(html);
                    //获取个人介绍的内容
                    var remark=$(".searchRemark");
                    console.log(remark.html());
                    if(!remark.html()){
                        remark.html("此人很懒哦什么都没有留下")
                    }
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
    });
    //搜索好友跳转到聊天页面
    $(".keyFriend").on("click",".skipChat",function(){
        console.log(123);
        // 获取好友code
        var sender_code=$(this).attr("title"),
        // 头像
            header=$(this).find("img").attr("src");
        // 存本地
        localStorage.setItem("sender_code",sender_code);
        localStorage.setItem("header",header);
        window.location.href="friendChat.html";
    });
    // 退出登录
    $(".logOut").click(function(){
        localStorage.removeItem("apptoken");
        window.location.href="landing.html";
    });
    window.addEventListener("popstate", function(e) {
        alert("我监听到了浏览器的返回按钮事件啦");//根据自己的需求实现自己的功能
    }, false);
});
