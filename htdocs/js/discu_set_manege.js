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
                    var manegeNum="";
                    var htmlAdministrator="";
                    var htmlMember="";
                    $.each(data.data.Number_data,function(i,item){
                        if(item.role==1||item.role==2){
                            console.log(item);
                            htmlAdministrator+=`
                    <div  class="weui-media-box weui-media-box_appmsg">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" src="${item.portrait}">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title">${item.nickname}</h4>                           
                        </div>
                        <button class="setBtn" title="${item.user_code}">撤销</button>
                    </div>
                    `;
                            manegeNum=i+1;
                        }else{
                            htmlMember+=`
                    <div  class="weui-media-box weui-media-box_appmsg">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" src="{item.portrait}">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title">${item.nickname}</h4>
                          
                        </div>
                        <button class="setBtn" title="${item.user_code}">添加</button>
                    </div>
                        `;
                            ueserNum=i+1;
                        }
                    });
                    $(".administrator").html(htmlAdministrator);
                    $(".member").html(htmlMember);
                    $(".manegeNum span").append(manegeNum);
                    $(".userNum span").append(ueserNum);
                    console.log(2);
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
    $(".linkman").on("click",".weui-panel__bd .weui-media-box .setBtn",function(){
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
                    var html=`
                     <p style="text-align: center;background: green;font-size: 15px">${data.errmsg}</p>
                    `;
                    success.html(html);
                    setTimeout(hideTop,3000);
                    getGroupUser();
                }else{
                    var html=`
                     <p style="text-align: center;background: green;font-size: 15px">${data.errmsg}</p>
                    `;
                    success.html(html);
                    setTimeout(hideTop,3000);
                }
            }
        })
    })
});