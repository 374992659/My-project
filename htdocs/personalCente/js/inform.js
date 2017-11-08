$(document).ready(function(){
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    // 数据格式转换
    var data=["",JSON.stringify({"apptoken":apptoken})];
    // 加密
    var jsonEncryptData=jsEncryptData(data);
    console.log(data);
    $.ajax({
        url:url+"UserCenter_getMyGardenMessage",
        type:"POST",
        data:{"data":jsonEncryptData},
        success:function(data){
            // 解密
            var data=jsDecodeData(data);
            console.log(data);
            if(data.errcode===0){
                localStorage.setItem("apptoken",data.apptoken);
                var html="";
                $.each(data.data,function(i,item){
                    console.log(item);
                    html+=`
                        <div title="${item.id}" class="weui-media-box weui-media-box_text" style="padding-bottom: 5px;border-bottom: 1px solid #b2b2b2">
                            <div class="headline">
                                <h4 class="weui-media-box__title" style="font-size: 16px;">${item.title}</h4>
                            </div>
                            <p class="weui-media-box__desc" style="font-size: 14px">
                                ${item.content}
                            </p>
                            <div style="font-size: 14px;text-align: right;color:green;margin-top: 5px">时间 <span>${item.create_time}</span></div>
                        </div>
                    
                    `
                });
                $(".informList").prepend(html);
            }
        },
        error:function(){}
    });
    // 绑定点击事件获取获取去通知id在通知详情页面做判断用
    $(".informList").on("click",".weui-media-box",function(){
        // 获取通知id
        var id=$(this).attr("title");
        localStorage.setItem("informID",id);
        if(id){
            window.localtion.href="informContent.html";//跳转通知详情页面
        }
    })
});