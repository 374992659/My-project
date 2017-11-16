$(document).ready(function(){
    "use strict";
    var getGroupUser=function(){
        //获取群号码
        var group_num=localStorage.getItem("group_num"),
        //获取apptoken
        apptoken=localStorage.getItem("apptoken"),
        //数据格式转换
        data=["",JSON.stringify({"group_num":group_num,"apptoken":apptoken})],
        //数据加密
        jsonEncryptData=jsEncryptData(data);
        $.ajax({
            url:url+"group_getGroupUser",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                //解密数据
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    console.log(1);
                    localStorage.setItem("apptoken",data.apptoken);
                    var ueserNum="";
                    var manegeNum=0;
                    var htmlAdministrator="";
                    var htmlMember="";
                    console.log(data.data.Number_data);
                    $.each(data.data.Number_data,function(i,item){
                        var httP=item.portrait.split(":")[0];
                        console.log(item);
                        if(item.role==2){
                            if(httP==="http"){
                                htmlAdministrator+=`
                    <div  class="weui-media-box weui-media-box_appmsg">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" src="${item.portrait}">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title">${item.nickname}</h4>                           
                        </div>
                        <button class="cancelBtn" title="${item.user_code}">撤销</button>
                    </div>
                    `;
                                manegeNum++;
                            }else{
                                htmlAdministrator+=`
                    <div  class="weui-media-box weui-media-box_appmsg">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${item.portrait}">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title">${item.nickname}</h4>                           
                        </div>
                        <button class="cancelBtn" title="${item.user_code}">撤销</button>
                    </div>
                    `;
                                manegeNum++;
                            }

                        }else if(item.role==3){
                            if(httP==="http"){
                                htmlMember+=`
                    <div  class="weui-media-box weui-media-box_appmsg">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" src="${item.portrait}">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title">${item.nickname}</h4>
                          
                        </div>
                        <button class="addBtn" title="${item.user_code}">添加</button>
                    </div>
                        `;
                                ueserNum=i;
                            }else{
                                htmlMember+=`
                    <div  class="weui-media-box weui-media-box_appmsg">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${item.portrait}">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title">${item.nickname}</h4>
                          
                        </div>
                        <button class="addBtn" title="${item.user_code}">添加</button>
                    </div>
                        `;
                                ueserNum=i;
                            }
                        }
                    });
                    $(".administrator").html(htmlAdministrator);
                    $(".member").html(htmlMember);
                    $(".manegeNum span").append(manegeNum);
                    $(".userNum span").append(ueserNum);
                }
            }

        });
    };getGroupUser();
    $(".LinkBtn").click(function(){
        console.log($(this));
        if($(this).next().is(":hidden")){
            $(this).next().show();
            $(this).children(".weui-cell__hd").children("img").css("transform","rotate(90deg)");
        }else{
            $(this).next().hide();
            $(this).children(".weui-cell__hd").children("img").removeAttr("style")
        }
    });
    //功能三 设置管理员
    $(".member").on("click",".weui-media-box .addBtn",function(){
        var success=$(".success");
        var hideTop=function(){
            success.empty();
        };
        //获取group_num 群号码
        var group_num=localStorage.getItem("group_num"),
        //获取user_code 用户code
         title=$(this).attr("title"),
        //获取apptoken
         apptoken=localStorage.getItem("apptoken"),
        //数据格式转换
        data=["",JSON.stringify({"group_num":group_num,"user_code":title,"apptoken":apptoken})],
        //数据加密
        jsonEncryptData=jsEncryptData(data);
        console.log(data);
        //发起ajax请求
        $.ajax({
            url:url+"group_setGroupManager",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                //解密数据
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    showHide(data.errmsg)
                }else{
                    showHide(data.errmsg)
                }
            }
        })
    });
    //取消管理员
    $(".administrator").on("click",".weui-media-box .cancelBtn",function(){
        //获取apptoken
        var apptoken=localStorage.getItem("apptoken"),
        //群号码
            group_num=localStorage.getItem("group_num"),
        //用户user_code
            user_code=$(this).attr("title"),
        //数据格式转换
            data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num,"user_code":user_code})],
        //   加密
            jsonEncryptData=jsEncryptData(data);
        $.ajax({
            url:url+"group_unsetGroupManager",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                //解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    showHide(data.errmsg)
                }else{
                    showHide(data.errmsg)
                }
            },
            error:function(){}
        })
    })
});



