/**
 * Created by Administrator on 2017/10/14 0014.
 */
$(document).ready(function(){
    "use strict";
    //获取apptoken
    var apptoken=localStorage.getItem("apptoken"),
        city_id=localStorage.getItem("city_id"),
        garden_code="132156";
    //功能1 获取全部广告
    var allAd=function(){
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
                if(data.errcode===0){
                    console.log(data);
                    localStorage.setItem("apptoken",data.apptoekn);
                    var allAdList="";
                    $.each(data.data,function(i,item){
                        allAdList+=`
                        <a href="hotTopic_addCon.html" title="${item.adverse_id}"  class="adList">
                            <div class="weui-media-box weui-media-box_text" style="border-bottom:1px solid #b2b2b2;margin-top: 10px ">
                                <h4 class="weui-media-box__title" style="font-size: 13px">${item.title}</h4>
                                <p class="weui-media-box__desc">${item.content}</p>
                            </div>
                        </a>
                        `
                    });
                    $(".allAdList").append(allAdList)
                }
            }
        })
    };allAd();
    //功能2 获取我的广告
    var myAd=function(){
        //数据格式转换
        var data=["",JSON.stringify({"apptoken":apptoken,"city_id":city_id," garden_code": garden_code})],
            //加密
            jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"Subject_getMyAdList",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                //解密
                var data=jsDecodeData(data);
                if(data.errcode===0){
                    console.log(data);
                    localStorage.setItem("apptoken",data.apptoekn);
                    var myAdList="";
                    $.each(data.data,function(i,item){
                        myAdList+=`
                        <a href="hotTopic_addCon.html" title="${item.adverse_id}"  class="adList">
                            <div class="weui-media-box weui-media-box_text" style="border-bottom:1px solid #b2b2b2;margin-top: 10px ">
                                <h4 class="weui-media-box__title" style="font-size: 13px">${item.title}</h4>
                                <p class="weui-media-box__desc">${item.content}</p>
                            </div>
                        </a>
                        `
                    });
                    $(".myAdList").append( myAdList)
                }
            }
        })
    }; myAd();
    //功能3 发布广告
    $(".addBtn").click(function(){
        var pushAd=function(){
            var apptoken=localStorage.getItem("apptoken");
            //获取主题
            var title=$(".adTitle").val(),
                //获取内容
                content=$(".adContent").val(),
                //城市id
                city_id=$("#city option:selected").val(),
                //小区id
                garden_code="2701123";
            //数据格式转换
            var data=["",JSON.stringify({"apptoken":apptoken,"city_id":city_id,"garden_code":garden_code,"title":title,"content":content})];
            //加密
            var jsonEncryptData=jsEncryptData(data);
            console.log(data);
            $.ajax({
                url:url+"Subject_addAd",
                type:"POST",
                data:{"data":jsonEncryptData},
                success:function(data){
                    //解密
                    var data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        localStorage.setItem("apptoken",data.apptoken);
                        myAd();
                        allAd();
                        $(document).on('click','#show-success',function(){
                            $.toptip('操作成功', 'success');
                        });
                    }
                }
            })
        };
        pushAd();
    });

});