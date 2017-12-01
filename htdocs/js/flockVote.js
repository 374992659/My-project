$(document).ready(function(){
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    // 获取群号码
    var code=localStorage.getItem("group_num");
    // 数据格式转换
    data=["",JSON.stringify({"apptoken":apptoken,"group_num":code})];
    // 加密
    jsonEncryptData=jsEncryptData(data);
    console.log(data);
    // 加载页面
$.ajax({
    url:url+"group_getVoteList",
    type:"POST",
    data:{"data":jsonEncryptData},
    success:function(data){
        // 解密
        data=jsDecodeData(data);
        console.log(data);
        if(data.errcode===0){
            localStorage.setItem("apptoken",data.apptoken);
            var html="";
            $.each(data.data,function(i,item){
                console.log(item);
                var httP=item.portrait.split(":")[0];
                if(httP==="http"){
                    html+=`
                <div style="padding: 0 10px" class="weui-panel weui-panel_access voteID" title="${item.vote_id}">
            <div class="weui-panel__bd">
                <div>
                    <div  class="weui-media-box weui-media-box_appmsg">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" src="${item.portrait}">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title" style="font-size: 15px">${item.nickname}</h4>
                            <span class="weui-media-box__desc" style="font-size: 14px">${getLocalTime(item.create_time)}</span>
                           
                        </div>
                    </div>
                    <div class="weui-media-box__bd">
                        <h4 class="weui-media-box__title" style="font-size: 15px">主题：${item.title}</h4>
                        <ul>
                            <li class="lf">
                                <img src="${item.picture}" alt="" class="topic">
                            </li>                          
                        </ul>
                        <div style="text-align: right">
                            <span style="font-size: 15px;">总票数：</span>
                            <span style="font-size: 15px;">${item.total_user}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            `
                }else{
                    html+=`
                <div style="padding: 0 10px" class="weui-panel weui-panel_access voteID" title="${item.vote_id}">
            <div class="weui-panel__bd">
                <div>
                    <div  class="weui-media-box weui-media-box_appmsg">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${item.portrait}">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title" style="font-size: 15px">${item.nickname}</h4>
                            <span class="weui-media-box__desc" style="font-size: 14px">${getLocalTime(item.create_time)}</span>
                           
                        </div>
                    </div>
                    <div class="weui-media-box__bd">
                        <h4 class="weui-media-box__title" style="font-size: 15px">主题：${item.title}</h4>
                        <ul>
                            <li class="lf">
                                <img src="${item.picture}" alt="" class="topic">
                            </li>                          
                        </ul>
                        <div style="text-align: right">
                            <span style="font-size: 15px;">总票数：</span>
                            <span style="font-size: 15px;">${item.total_user}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            `
                }

            });
        $("#flockVote").append(html);
        }else{
            console.log(data.errmsg);
        }
    }
});
// 存储投票id
$("#flockVote").on("click",".voteID",function(){
    // 获取当title
    var vote_id=$(this).attr("title");
    localStorage.setItem("vote_id",vote_id);
    window.location.href="flockVote_content.html"
    });
    // 图片放大预览
    (function(){
        $(".flockContent").on("click",".voteID .weui-panel__bd .weui-media-box__bd ul li img",function(){
            var url=$(this).attr("src");
            console.log(url);
            if($(".weui-gallery").is(":hidden")){
                $(".weui-gallery").show();
                $(".weui-gallery__img").attr("style","background-image: url("+url+")")
            }
        });
        $(".weui-gallery").click(function(){
            $(".weui-gallery").hide();
        });
    })();
    //返回群信息页面
    $(function(){
        pushHistory();
        window.addEventListener("popstate", function(e) {
            window.location.href="commDiscu.html";
        }, true);
        function pushHistory() {
            var state = {
                title: "title",
                url: "#"
            };
            window.history.pushState(state, "title", "#");
        }
    });
});