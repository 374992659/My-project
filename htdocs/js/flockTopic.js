$(document).ready(function(){
    "use strict";
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    // 获取群号码
    var group_num=localStorage.getItem("group_num");
    // 数据格式转换
    var data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num})];
    // 数据加密
    var jsonEncryptDate=jsEncryptData(data);
    $.ajax({
        url:url+"group_getGroupSubjectList",
        type:"POST",
        data:{"data":jsonEncryptDate},
        success:function(data){
            // 解密数据
           var  data=jsDecodeData(data);
           if(data.errcode===0){
               localStorage.setItem("apptoken",data.apptoken);
               var html="";
               $.each(data.data,function(i,item){
                   html+=`
                   <a href="" class="weui-media-box weui-media-box_appmsg" title="${item.subject_id}">
                        <div class="weui-media-box__bd">
                            <div class="topic">
                                <h4 class="weui-media-box__title lf" style="font-size: 13px">${item.title}</h4>
                                <span class="right" style="font-size: 10px">已解决</span>
                            </div>
                            <p class="weui-media-box__desc">${item.content}</p>
                            <div style="margin-top: .5rem;text-align: right;font-size: 10px">阅读量：<span>${item.read_num}</span> 回帖数：<span>${item.commont_num}</span></div>
                        </div>
                   </a>                 
                  `
               });
               $(".GroupSubjectList").append(html);
           }
        },
    });
// 为a绑定点击事件存储话题id
    $(".GroupSubjectList").on("click",".weui-media-box",function(){
        // 获取话题id
        var topic_id=$(this).attr("title");
        localStorage.setItem("subject_id",topic_id);
        window.location.href="flockTopic_content.html";
    })
});