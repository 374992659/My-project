$(document).ready(function(){
    var data=localStorage.getItem("data");
    console.log(data);
    // 把json中为数组
    info=JSON.parse(data);
    console.log(info);
    console.log(info.data);
    var apptoken=localStorage.getItem("apptoken");
    var html="";
    $.each(info.data,function(i,item){
        if(item.signature===null){
            html+=`
        <a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg" title="${item.account_code}" value="1">
            <div class="weui-media-box__hd">
                <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${item.portrait}" alt="">
            </div>
            <div class="weui-media-box__bd">
                <h4 class="weui-media-box__title name">${item.nickname}</h4>
                <p class="weui-media-box__desc">此人很懒什么都没有留下</p>
            </div>
            <button class="addFriend">加为好友</button>
        </a>
        `
        }else{
            html+=`
        <a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg" title="${item.account_code}" value="1">
            <div class="weui-media-box__hd">
                <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${item.portrait}" alt="">
            </div>
            <div class="weui-media-box__bd">
                <h4 class="weui-media-box__title name">${item.nickname}</h4>
                <p class="weui-media-box__desc">${item.signature}</p>
            </div>
            <button class="addFriend">加为好友</button>
        </a>
        `
        }

    });
    $(".weui-panel__bd").append(html);
    // 添加好友
    $(".nearFriend .weui-media-box").on("click",".addFriend",function(){
        //获取account_code
            var title=$(this).parent().attr("title");
        //获取分组id
            var group_id=$(this).parent().attr("value");
        //数据格式转换
        data=["",JSON.stringify({"apptoken":apptoken,"account_code":title,"group_id":group_id})];
        //数据加密
        jsonEncryptDate=jsEncryptData(data);
        console.log(data);
        //发起ajax请求
        $.ajax({
            url:url+"friends_addFriend",
            type:"POST",
            data:{"data":jsonEncryptDate},
            success:function(data){
                //解密数据
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
    })
});