$(document).ready(function(){
    "use strict";
    var apptoken=localStorage.getItem("apptoken"),
        city_id= localStorage.getItem("city_id"),
        garden_code=$(".plot1 option:selected").attr("title");
    //功能1 获取认证小区情况
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
    //获取全部广告的构造函数
    function allAd(apptoken,city_id,garden_code){
        console.log("广告");
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
                    console.log(data);
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
                    }else{
                        var html=`
                         <p class="weui-media-box__desc">${data.errmsg}</p>
                        `;
                        $(".allAdList").append(html)
                    }
                }
            })
        };
    }
    //获取我的广告构造函数
   function myaD(apptoken,city_id,garden_code){
       // apptoken
       this.apptoken=apptoken;
       // 城市id在注册的时候就存本地
       this.city_id=city_id;
       // 小区id
       this.garden_code=garden_code;
        // var apptoken=localStorage.getItem("apptoken"),
        //     city_id=localStorage.getItem("city_id"),
        //     garden_code=$("#tab2 .plot option:selected").val();
        //数据格式转换
       this.otherAD=function(){
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
                        <div title="${item.adverse_id}"  sort="${i}" class="adList">
                            <div class="weui-media-box weui-media-box_text" style="border-bottom:1px solid #b2b2b2;margin-top: 10px ">
                                <h4 class="weui-media-box__title" style="font-size: 13px">${item.title}</h4>
                                <p class="weui-media-box__desc">${item.content}</p>
                                <button class="delBtn" sort="${i}" title="${item.adverse_id}">删除</button>
                            </div>
                        </div>
                        `
                       });
                       $(".myAdList").append( myAdList)
                   }else{
                       var html=`
                         <p class="weui-media-box__desc">${data.errmsg}</p>
                        `;
                       $(".myAdList").append(html)
                   }
               }
           })
       };
    }
    //功能2-1 加载页面的时候获取全广告
    var allad=  new allAd(apptoken,city_id,garden_code);
    allad.add();
    //功能2-2 当城市发生改变的时候获取其他城市的广告
    $(".city1").change(function(){
        $(".allAdList").empty();
        // 获取城市id
        var cityid=$(".city1 option:selected").val();
        localStorage.setItem("city_id",cityid);
        var garden_code=$(".plot1 option:selected").attr("title");
        var otherAd=new allAd(apptoken,cityid,garden_code);
        otherAd.add();
    });
    //功能2-3 当小区改变的时候活区小区广告
    $(".plot1").change(function(){
        //清空列表
        $(".allAdList").empty();
        //获取城市id
        var cityID=$(".city1 option:selected").val();
        var garden_code=$(".plot1 option:selected").attr("title");
        localStorage.setItem("city_id",cityID);
        localStorage.setItem("garden_code",garden_code);
        var otherAd=new allAd(apptoken,cityID,garden_code);
        otherAd.add();
    });
    //功能3-1 加载页面的时候获取我的广告
    var myAD=new myaD(apptoken,city_id,garden_code);
        myAD.otherAD();
   //功能3-2 当城市发生改变的时候发获取我的广告
    $(".city2").change(function(){
        $(".myAdList").empty();
        // 获取城市id
        var cityid=$(".city2 option:selected").val();
        var garden_code=$(".plot1 option:selected").attr("title");
            localStorage.setItem("city_id",cityid);
        var cityChang=new myaD(apptoken,cityid,garden_code);
        cityChang.otherAD();
    });
    //功能3-3 当小区发生变化的时候获取我的广告
    $(".plot2").change(function(){
        $(".myAdList").empty();
        var cityID=$(".city2 option:selected").val();
        var garden_code=$(".plot2 option:selected").attr("title");
        localStorage.setItem("city_id",cityID);
        localStorage.setItem("garden_code",garden_code);
        var cityChang=new myaD(apptoken,cityID,garden_code);
        cityChang.otherAD();
    });
    //功能4 发布广告
    $(".addBtn").click(function(){
            var apptoken=localStorage.getItem("apptoken");
            //获取主题
            var title=$(".adTitle").val(),
                //获取内容
                content=$(".adContent").val(),
                //城市id
                city_id=$("#city option:selected").val(),
                //小区id
                garden_code=$("#plot option:selected").attr("title");
            var picture={};
            var Img=
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
    //功能5 广告删除
    $(".myAdList").on("click",".adList .weui-media-box .delBtn",function(e){
        var apptoken=localStorage.getItem("apptoken"),
            city_id=localStorage.getItem("city_id"),
            adverse_id=$(this).attr("title"),
        //格式转换
        data=["",JSON.stringify({"apptoken":apptoken,"city_id":city_id,"adverse_id":adverse_id})],
        //加密
        json=jsEncryptData(data);
        console.log(data);
        if(confirm("删除公告")){
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
                        // $(".adList [title="+adverse_id+']').remove();
                        $(e.target).parent().parent().remove();
                    }else{
                        console.log(data.errmsg);
                    }
                }
            });
        }

        return false;
    });
    //功能6 跳转到所有公告详情页面存广告id
    $(".allAdList").on("click",".adList",function(){
        //获取广告id
        var adID=$(this).attr("title");
        console.log(adID);
        //存在本地跳转下一个详情页面判断用
        localStorage.setItem("adID",adID);
        window.location.href="hotTopic_addCon.html";
    });
    //功能7 跳转到我的广告详情页面
    $(".myAdList").on("click",".adList",function(){
        //获取广告id
        var adID=$(this).attr("title");
        console.log(adID);
        //存在本地跳转下一个详情页面判断用
        localStorage.setItem("adID",adID);
        window.location.href="hotTopic_addCon.html";

    });
    //上传图片
    //功能8 上传图片
    $("#uploaderInput").change(function(e){
        // 图片信息组成的数组
        var file =$("#uploaderInput")[0].files;
        console.log(file[0].name);
        var formData = new FormData();
        for(var i=0,len=file.length;i<len;i++){
            formData.append("topic"+i,file[i]);
        }
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        var data=["",JSON.stringify({"apptoken":apptoken})];
        var json=jsEncryptData(data);
        formData.append("data",json);
        console.log(data);
        $.ajax({
            url:url+"group_uploaSubjectPic",
            type:"POST",
            data:formData,
            processData : false,
            contentType : false,
            secureuri:false,
            success:function(data){
                // 解密
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    var LiImg="";
                    $.each(data.data,function(i,item){
                        LiImg+=`
                         <li class="weui-uploader__file" >
                                     <img src="http://wx.junxiang.ren/project/${item}" alt="" style="width: 79px;height: 79px" class="pushSpit_Img">
                                     <img src="image/del.png" alt="" width="20px" class="delImg">
                                 </li>
                        `
                    });
                    $(".picPlace").append(LiImg);
                }else{
                    console.log(data.errmsg);
                }
            }
        })
    });
    //功能9 删除图片
    $("#uploaderFiles").on("click",".weui-uploader__file .delImg",function(){
        $(this).parent().remove();
    });
});