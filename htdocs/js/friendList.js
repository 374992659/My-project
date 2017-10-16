
$(document).ready(function() {
    //功能1 请求好友分组
    var apptoken=localStorage.getItem("apptoken");
    data=["", JSON.stringify({"apptoken":apptoken})];
    console.log(data);
    encreptdata = jsEncryptData(data);
    $.ajax({
        url:url+"friends_getGroup",
        type:"POST",
        data:{"data":encreptdata},
        success: function (data) {
            data = jsDecodeData(data);
            console.log(data);
            if(data.errcode === 0) {
                localStorage.setItem("apptoken",data.apptoken);
                var html = "";
                $.each(data.data, function (i, item) {
                    console.log(123);
                    html += `
     <div class="weui-cells">
        <div class="weui-cell LinkBtn"  title="${item.group_id}">
            <div class="weui-cell__hd ">
               <img class="linkBtn" style="" src="image/right.png" >
            </div>
            <div class="weui-cell__bd">
                <p style="">${item.group_name}</p>
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
                    // window.location.href ="landing.html";
                }
               console.log()
            }
        }
    });
    $(".group").on("click", ".weui-cells .LinkBtn", function (event) {
        // 功能2 请求好友分组下的好友信息
        (function(){
            // 获取group_id
            var apptoken=localStorage.getItem("apptoken");
            var title=$(this).attr("title");
            console.log($(this));
            data=["",JSON.stringify({"group_id":1,"apptoken":apptoken})];
            console.log(data);
            encreptdata = jsEncryptData(data);
            console.log(encreptdata);
            $.ajax({
                url:url+"friends_getGroupFriends",
                type:"POST",
                data:{"data":encreptdata},
                success:function(data){
                    data=jsDecodeData(data);
                    console.log(data);
                    if(data===0){
                        console.log(132);
                        localStorage.setItem("apptoken",data.apptoken);
                        var html="";
                        $.each(data.data,function(i,item){
                            console.log(item);
                            if(item.group_id===1){
                                html+=`                             
                    <a href="friendChat.html" class="weui-media-box weui-media-box_appmsg">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" src="${item.friend_portrait}">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title">${item.friend_nickname}</h4>
                            <p class="weui-media-box__desc">${item.friend_signature}</p>
                        </div>
                    </a>
                           `
                            }
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

});
