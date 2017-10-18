$(document).ready(function(){
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    // 获取群号码
    var code=localStorage.getItem("group_code");
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
                html+=`
                <div style="padding: 0 10px" class="weui-panel weui-panel_access" title="${item.vote_id}">
            <div class="weui-panel__bd">
                <a href=" flockVote_content.html">
                    <div  class="weui-media-box weui-media-box_appmsg">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" src="${item.portrait}">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title" style="font-size: 13px">${item.nickname}</h4>
                            <span class="weui-media-box__desc" style="font-size: 10px">${item.create_time}</span>
                           
                        </div>
                    </div>
                    <div class="weui-media-box__bd">
                        <h4 class="weui-media-box__title" style="font-size: 10px">${item.title}</h4>
                        <ul>
                            <li class="lf">
                                <img src="${item.picture}" alt="" class="topic">
                            </li>                          
                        </ul>
                        <div style="text-align: right">
                            <span style="font-size: 10px;">票数：</span>
                            <span style="font-size: 10px;">${item.total_user}</span>
                        </div>
                    </div>
                </a>
            </div>
        </div>
            `
            });
        $(".flockVote").append(html);
        }else{
            console.log(data.errmsg);
        }
    }
});
// 存储投票id
$(".flockVote").on("click",".weui-panel",function(){
    // 获取当title
    var vote_id=$(this).attr("title");
    localStorage.setItem("vote_id",vote_id)
    });
});