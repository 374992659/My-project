$(document).ready(function(){
    "use strict";
    localStorage.setItem("city_id",2701);
    //获取apptoken
    //功能1 获取全部广告
    var allAd=function(){
        var apptoken=localStorage.getItem("apptoken"),
            city_id=localStorage.getItem("city_id"),
            garden_code="2701113";
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
                    localStorage.setItem("apptoken",data.apptoken);
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
        var apptoken=localStorage.getItem("apptoken"),
            city_id=localStorage.getItem("city_id"),
            garden_code="2701113";
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
                console.log(data);
                if(data.errcode===0){
                    console.log(data);
                    localStorage.setItem("apptoken",data.apptoken);
                    var myAdList="";
                    $.each(data.data,function(i,item){
                        myAdList+=`
                        <div title="${item.adverse_id}"  class="adList">
                            <div class="weui-media-box weui-media-box_text" style="border-bottom:1px solid #b2b2b2;margin-top: 10px ">
                                <h4 class="weui-media-box__title" style="font-size: 13px">${item.title}</h4>
                                <p class="weui-media-box__desc">${item.content}</p>
                                <button class="delBtn" title="${item.adverse_id}">删除</button>
                            </div>
                        </div>
                        `
                    });
                    $(".myAdList").append( myAdList)
                }
            }
        })
    }; myAd();
    //功能3 发布广告
    $(".addBtn").click(function(){
            var apptoken=localStorage.getItem("apptoken");
            //获取主题
            var title=$(".adTitle").val(),
                //获取内容
                content=$(".adContent").val(),
                //城市id
                city_id=$("#city option:selected").val(),
                //小区id
                garden_code="270113";
                localStorage.setItem("city_id",city_id);
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
                        window.location.reload();
                       showHide(data.errmsg)
                    }else{
                        showHide(data.errmsg)
                    }
                }
            })
    });
    //广告删除
    $(".myAdList").on("click",".adList .weui-media-box .delBtn",function(){
        var apptoken=localStorage.getItem("apptoken"),
            city_id=localStorage.getItem("city_id"),
            adverse_id=$(this).attr("title"),
        //格式转换
        data=["",JSON.stringify({"apptoken":apptoken,"city_id":city_id,"adverse_id":adverse_id})],
        //加密
        json=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"Subject_delAd",
            type:"POST",
            data:{"data":json},
            success:function(data){
                //解密
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    myAd();
                    allAd();
                }else{
                    console.log(data.errmsg);
                }
            }

        })
    });
    //跳转到公告详情页面存广告id
});