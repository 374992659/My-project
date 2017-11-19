$(document).ready(function(){
    "use strict";
    //获取认证小区情况
    (function(){
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        var data=["",JSON.stringify({"apptoken":apptoken})];
        var json=jsEncryptData(data);
        $.ajax({
            url:url+"UserCenter_getApplicationGarden",
            type:"POST",
            data:{"data":json},
            success:function(data){
                // 解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    var html="";
                    $.each(data.data,function(i,item){
                        html+=`
                         <option title="${item.garden_code}">${item.garden_name}</option>                     
                        `
                    });
                    $(".plot").append(html);
                }
            }
        })
    })();
    //获取apptoken
    //功能1 获取全部广告
    var apptoken=localStorage.getItem("apptoken"),
        city_id= localStorage.getItem("city_id"),
        garden_code=$(".plot option:selected").attr("title");
    var allAd=function(apptoken,city_id,garden_code){
        // apptoken
        this.apptoken=apptoken;
        // 城市id在注册的时候就存本地
        this.city_id=city_id;
        // 小区id
        this.garden_code=garden_code;
        //数据格式转换
        this.add=function(){
            var data=["",JSON.stringify({"apptoken":this.apptoken,"city_id":this.city_id," garden_code": this.garden_code})],
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
                        <div title="${item.adverse_id}"  class="adList">
                            <div class="weui-media-box weui-media-box_text" style="border-bottom:1px solid #b2b2b2;margin-top: 10px ">
                                <h4 class="weui-media-box__title" style="font-size: 13px">${item.title}</h4>
                                <p class="weui-media-box__desc">${item.content}</p>
                            </div>
                        </div>
                        `
                        });
                        $(".allAdList").append(allAdList)
                    }
                }
            })
        };
    };
    //加载页面的时候获取全广告
    allAd(apptoken,city_id,garden_code);
    // 获取其他城市的广告
    $("#tab1 .city").change(function(){
        $(".adList").empty();
        // 获取城市id
       var cityid=$("#tab1 .city option:selected").val();
       var garden_code=$("#tab1 .plot option:selected").val();
        allAd(apptoken,cityid,garden_code);
    });
    //功能2 获取我的广告
    var myAd=function(){
        var apptoken=localStorage.getItem("apptoken"),
            city_id=localStorage.getItem("city_id"),
            garden_code=$("#tab2 .plot option:selected").val();
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
                garden_code=$("#plot option:selected").val();
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
    //跳转到所有公告详情页面存广告id
    $(".allAdList").on("click",".adList",function(){
        //获取广告id
        var adID=$(this).attr("title");
        console.log(adID);
        //存在本地跳转下一个详情页面判断用
        localStorage.setItem("adID",adID);
        window.location.href="hotTopic_addCon.html";
    });
});