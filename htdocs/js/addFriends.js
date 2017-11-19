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
                var result=data.data;
                    console.log(result);
                    var httP=result.portrait.split(":")[0];
                    if(httP==="http"){
                        html+=`
                    <div class="weui-media-box weui-media-box_appmsg" title="${result.account}" value="1">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" src="${result.portrait}" alt="">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title name">${result.nickname}</h4>
                            <p class="weui-media-box__desc">${result.signature}</p>
                        </div>
                        <button class="addFriend">加为好友</button>
                    </div>
                    `
                    }else{
                        html+=`
                    <div class="weui-media-box weui-media-box_appmsg" title="${result.account}" value="1">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${result.portrait}" alt="">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title name">${result.nickname}</h4>
                            <p class="weui-media-box__desc">${result.signature}</p>
                        </div>
                        <button class="addFriend">加为好友</button>
                    </div>
                    `

                    }


                var keyFriend=$(".keyFriend");
                console.log(html);
                keyFriend.append(html);
                if($(".weui-media-box__desc").html()==="null"){
                    $(".weui-media-box__desc").html("此人太懒")
                }
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
    $(".keyFriend").on("click"," .weui-media-box .addFriend",function(){
        console.log(123);
        //获取account_code
        var title=$(this).parent().attr("title");
        //获取分组id
        var group_id=$(this).parent().attr("value");
        //获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        //数据格式转换
        data=["",JSON.stringify({"apptoken":apptoken,"account_code":title,"group_id":group_id})];
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
                    showHide(data.errmsg)
                }else{
                    showHide(data.errmsg)
                }
            }
        })

    });
    $("#searchClear").click(function(){
        $(".keyFriend").empty();
        $(".group").show();
    });
    $("#searchCancel").click(function(){
        $(".keyFriend").empty();
        $(".group").show();
    });
});