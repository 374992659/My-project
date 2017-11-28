$(document).ready(function(){
    "use strict";
    //获取apptoken
    var apptoken=localStorage.getItem("apptoken"),
        city_id=localStorage.getItem("city_id"),
        garden_code="";
    //获取广告id
    var adID=localStorage.getItem("adID");
    console.log(adID);
    //数据格式转换
    var data=["",JSON.stringify({"apptoken":apptoken,"city_id":city_id," garden_code": garden_code})],
    //加密
        jsonEncryptData=jsEncryptData(data);
    console.log(data);
    $.ajax({
        url:url+"Subject_getAdList",
        type:"POST",
        data:{"data":jsonEncryptData},
        success:function(data){
            //解密
            var data=jsDecodeData(data);
            console.log(data);
            var html="";
            var pic="";
            $.each(data.data,function(i,item){
                console.log(item);
                if(parseInt(item.adverse_id)===parseInt(adID)){
                    //添加图片
                    if(item.picture){
                        var PIC=JSON.parse(item.picture);
                        $.each(PIC,function(i,item){
                            pic+=`
                    <li style="display: inline-block">
                          <img src="${item}" alt="" class="topic" width="80px">
                    </li>
                    
                    `
                        });

                    }
                    console.log("广告");
                    html=`
                    <h4 class="weui-media-box__title" style="text-align: center;font-size: 15px">${item.title}</h4>
                    <ul class="picPlace">
                       
                    </ul>
                    <p class="weui-media-box__desc">
                       ${item.content}
                    </p>
                    <ul class="weui-media-box__info" style="font-size: 12px">
                        <li class="weui-media-box__info__meta">文字来源 <span>李四</span></li>
                        <li class="weui-media-box__info__meta">时间 <span>${getLocalTime(item.create_time)}</span></li>
                    </ul>
                    <ul class="weui-media-box__info share" style="font-size: 12px;color: blue;text-align: right">
                        <li class="weui-media-box__info__meta">分享</li>
                        <li class="weui-media-box__info__meta">分享量 <span>2017.12.05</span></li>
                        <li class="weui-media-box__info__meta">阅读量 <span>1</span></li>
                    </ul>
                    `;
                }
            });
            $(".weui-media-box").html(html);
            $(".picPlace").html(pic);
        },
        error:function(){}
    });
    //功能8 图片放大
    (function () {
        $(".weui-media-box").on("click",".picPlace li img",function(){
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


});

