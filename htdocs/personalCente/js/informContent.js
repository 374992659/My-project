$(document).ready(function(){
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    // 数据格式转换
    var data =["",JSON.stringify({"apptoken":apptoken})];
    // 加密
    var jsonEncryptData=jsEncryptData(data);
    console.log(data);
    $.ajax({
        url:uri+"UserCenter_getMyGardenMessage",
        type:"POST",
        data:{"data":jsonEncryptData},
        success:function(data){
            // 解密
            var data=jsDecodeData(data);
            console.log(data);
            if(data.errcode===0){
                localStorage.setItem("apptoken",data.apptoken);
                var html="";
                // 获取informID
                var informID=localStorage.getItem("informID");
                $.each(data.data,function(i,item){
                    if(item.id===informID){
                        html=`
                        <h4 class="weui-media-box__title" style="text-align: center">${item.title}</h4>
                        <p class="weui-media-box__desc">
                          ${item.content}
                        </p>
                        <ul class="weui-media-box__info">
                            <li class="weui-media-box__info__meta">文字来源 <span>${item.garden_name}</span></li>
                            <li class="weui-media-box__info__meta">时间 <span>${item.create_time}</span></li>
                            <li class="weui-media-box__info__meta weui-media-box__info__meta_extra">其它信息</li>
                        </ul>
                        `
                    }
                });
                $(".informContent").html(html);
            }
        },
        error:function(){}
    })
});