$(document).ready(function(){
    "use strict";
    function getPlay(apptoken,city_id,garden_code) {
        this.apptoken=apptoken;
        this.city_id=city_id;
        this.garden_code=garden_code;
        this.playList= function () {
            var   data=["",JSON.stringify({"apptoken":apptoken,"city_id":city_id,"garden_code":garden_code})];
            //  加密
            var jsonEncryptData=jsEncryptData(data);
            console.log(data);
            $.ajax({
                url:url+"Activity_getActivityList",
                type:"POST",
                data:{"data":jsonEncryptData},
                success:function(data){
                    // 解密数据
                    var data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        localStorage.setItem("apptoken",data.apptoken);
                        var html="";
                        $.each(data.data,function(i,item){
                            var picStr=item.picture;
                            var picObj=JSON.parse(picStr);
                            var data=[];
                            if(picObj){
                                $.each(picObj,function(i,item){
                                    data.push(item);
                                });
                            }else{
                                data.push("http://wx.junxiang.ren/project/Application/Common/Source/Img/default_portrait.jpg");
                            }
                            console.log(data);
                            html+=`
                  <div class="weui-media-box weui-media-box_appmsg storePlay_id" title="${item.activity_id}">
                    <div class="weui-media-box__hd">
                        <img class="weui-media-box__thumb ${item.activity_id}" src="${data[0]}">
                    </div>
                    <div class="weui-media-box__bd">
                        <h4 class="weui-media-box__title" style="font-size: 15px">${item.title}</h4>
                        <div class="weui-media-box__desc" style="font-size: 10px">发起人：<span>${item.nickname}</span></div>
                        <div style="font-size: 10px" class="weui-media-box__desc" >集合时间；<span>${getLocalTime(item.collection_time)}</span></div>
                        <div style="font-size: 10px" class="weui-media-box__desc" >集合地点：<span>${item.collection_place}</span></div>
                    </div>
                </div>
                  `
                        });
                        $(".flockPlayList").append(html);
                    }else{
                        var html=`
                         <p class="weui-media-box__desc">${data.errmsg}</p>
                        `;
                        $(".flockPlayList").append(html)
                    }
                }
            });
        }
    }
    //用户已经认证通过的小区
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
    //用户进入页面首先展示注册城市的约玩
    (function () {
        var apptoken=localStorage.getItem("apptoken");
        var city_id=localStorage.getItem("city_id");
        var garden_code="";
        var getPlayList=new getPlay(apptoken,city_id,garden_code);
        getPlayList.playList();
    })();
   //当城市发送改变的时候获取相应城市的广告
    (function () {
        $(".city1").change(function () {
            $(".flockPlayList").empty();
            var apptoken=localStorage.getItem("apptoken");
            var city_id=$(".city1 option:selected").val();
            var garden_code="";
            var getPlayList=new getPlay(apptoken,city_id,garden_code);
            getPlayList.playList();
        });
    })();
    //当小区发送改变的时候获取相应小区的广告
    (function () {
        $(".plot").change(function () {
            $(".flockPlayList").empty();
            var apptoken=localStorage.getItem("apptoken");
            var city_id=$(".city1 option:selected").val();
            var garden_code=$(".plot option:selected").attr("title");
            var getPlayList=new getPlay(apptoken,city_id,garden_code);
            getPlayList.playList();
        });
    })();
    $(".flockPlayList").on("click",".storePlay_id",function(){
        // 获取id
        var activity_id=$(this).attr("title");
        localStorage.setItem("activity_id",activity_id);
        window.location.href="hotTopic_playDetails.html";
    });
});