$(document).ready(function(){
    //获取群号码
    var code="";
    //获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    //数据格式转换
    data=["",JSON.stringify({"group_num":code,"apptoken":apptoken})];
    //数据加密
    $.ajax({
        url:url+"group_getGroupUser",
        type:"POST",
        data:{"data":data},
        success:function(data){
            //解密数据
            data=jsDecodeData(data);
            console.log(data);
            if(data.errcode===0){
                localStorage.setItem("apptoken",data.apptoken);
                var htmlAdministrator="";
                var htmlMember="";
                $.each(data.data,function(i,item){
                    if(item.role==1||item.role==2){
                        htmlAdministrator+=`
                    <div  class="weui-media-box weui-media-box_appmsg" title="${item.user_code}">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" src="image/2.jpg">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title">昵称</h4>
                            <p class="weui-media-box__desc">由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。</p>
                        </div>
                        <button class="setBtn">撤销</button>
                    </div>
                    `
                    }else{
                        htmlMember+=`
                    <div  class="weui-media-box weui-media-box_appmsg" tiltle="${item.user_code}">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" src="image/2.jpg">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title">昵称</h4>
                            <p class="weui-media-box__desc">由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。</p>
                        </div>
                        <button class="setBtn">添加</button>
                    </div>
                        `
                    }
                });
                $(".administrator").html(htmlAdministrator);
                $(".member").html(htmlMember);
            }
        }

    });

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
    $(".linkman").on(".setBtn","click",function(){
        //获取group_num 群号码
        var code="";
        //获取user_code 用户code
        var title=$(this).attr("title");
        //获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        //数据格式转换
        data=["",JSON.stringify({"group_num":code,"user_code":title,"apptoken":apptoken})];
        //数据加密
        jsonEncryptData=jsEncryptData(data);
        //发起ajax请求
        $.ajax({
            url:url+"group_setGroupManager",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                //解密数据
                data=jsDecodeData(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    window.location.reload()
                }else{
                    alert(data.errmsg);
                }
            }
        })
    })
});