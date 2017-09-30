
$(document).ready(function() {
    //强制跳转到登录页面
    var apptoken=localStorage.getItem("apptoken");
    data=["", JSON.stringify({"apptoken":apptoken})];
    console.log(data);
    encreptdata = jsEncryptData(data);
    $.ajax({
        url: url + "friends_getGroup",
        data: {"data": encreptdata},
        type: 'post',
        success: function (data) {
            data = jsDecodeData(data);
            localStorage.setItem("apptoken",apptoken);
            console.log(data);
            if(data.errcode === 114) {
                window.location.href ="landing.html";
            }
        }
    });
    // 功能1、获取好友分组信息
    var token=localStorage.getItem("apptoken");
    data=["", JSON.stringify({"apptoken":token})];

    $.ajax({
        url:url+"friends_getGroup",
        type:"POST",
        data:{"data":data},
        success:function (data){
            // 解密返回数据
            data = jsDecodeData(data);
            console.log(data);
            localStorage.setItem("apptoken", data.apptoken);
            var html = "";
            $.each(data.data, function (i, item) {
                html += `
    <div class="weui-cells">
        <div class="weui-cell LinkBtn" title="${item.group_id}">
            <div class="weui-cell__hd "><img class="linkBtn" style="" src="image/right.png" ></div>
            <div class="weui-cell__bd">
                <p style="">${item.group_name}</p>
            </div>
            <div class="weui-cell__ft" style="">${item.online_num}/${item.total}</div>
        </div>
        
    </div>
     <div class="weui-panel weui-panel_access friendList" style="display: none">
        <div class="weui-panel__bd friend"></div>
     </div>>               
                    `
            });
            $(".group").html(html);
        }
    });
    // 功能2、获取分组下的好友信息
    $(".group .weui-cells").on("click", ".LinkBtn", function () {
        // 获取group_id
        var apptoken=localStorage.getItem("apptoken");
        var title=$(this).attr("title");
        data=["",JSON.stringify({"group_id":title,"apptoken":apptoken})];
        console.log(data);
        encreptdata = jsEncryptData(data);
        console.log(encreptdata);
        $.ajax({
            url:url+"friends_getGroupFriends",
            type:"POST",
            data:{"data":encreptdata},
            success:function(data){
                data=jsDecodeData(data);
                localStorage.setItem("apptoken",data.apptoken);
                if(data===0){
                    var html="";
                    $.each(data.data,function(i,item){
                        if(item.group_id===title){
                            html+=`
                              
                    <a href="friendChat.html" class="weui-media-box weui-media-box_appmsg">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" src="${item.friend_signature}">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title">${item.friend_nicname}</h4>
                            <p class="weui-media-box__desc">由各种物质组成的巨型球状天体星球有一定的形状，有自己的运行轨道。</p>
                        </div>
                    </a>                                  
                
                                                            
                           `
                        }

                    });
                    $(".friend").html(html)
                }
            }
        });

        if($(this).next().is(":hidden")){
            $(this).next().show();
            $(this).children().children("img").css("transform","rotate(90deg)");
        }else{
            $(this).next().hide();
            $(this).children().children("img").css("transform","rotate(0deg)");
        }

    });

});
