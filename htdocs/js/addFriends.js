$(document).ready(function(){
    $("#searchInput").on("input",function(){
        $(".keyFriend").empty();
        var key=$("#searchInput").val();
        console.log(key);
        var apptoken=localStorage.getItem("apptoken");
        if(key!==""){
            $(".addFriendCondition").hide();
            $(".keyFriend").show();
        }else{
            $(".keyFriend").hide();
            $(".addFriendCondition").show();
        }
        //数据格式转换
       data=["",JSON.stringify({"account":key,"apptoken":apptoken})];
        console.log(data);
        //数据加密
        jsonEncryptDate=jsEncryptData(data);
        //发起ajax请求
        $.ajax({
            url:url+"friends_searchUserCode",
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
                    <a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg"
                    title="${item.friend_user_code}" value="1">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" src="${item.friend_portrait}" alt="">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title name">${item.friend_nickname}</h4>
                            <p class="weui-media-box__desc">${item.friend_signature}</p>
                        </div>
                        <button class="addFriend">加为好友</button>
                    </a>
                    `
                });
                var keyFriend=$(".keyFriend");
                keyFriend.append(html);
                keyFriend.show();
            }else if(data.errcode===301){
                // var html=`
                //      <p style="text-align: center">${data.errmsg}</p>
                // `;
                // $(".keyFriend").html(html);
            }else{

            }

            }
        });

    });
    $(".keyFriend .weui-media-box").on("click",".addFriend",function(){
        console.log(123);
        //获取account_code
        var title=$(this).parent().attr("title");
        //获取分组id
        var group_id=$(this).parent().attr("value");
        //获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        //数据格式转换
        data=["",JSON.stringify({"apptoken":apptoken,"account_code":title,"param group_id":group_id})];
        console.log(data);
        //数据加密
        jsonEncryptDate=jsEncryptData(data);
        //请求添加好友借口
        $.ajax({
            url:url+"friends_addFriend",
            type:"POST",
            data:{"data":jsonEncryptDate},
            success:function(data){
                //数据解密
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    alert("添加好友成功");
                }else{
                    alert("添加失败");
                }
            }
        })

    })

});