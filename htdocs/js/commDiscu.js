$(document).ready(function(){
    "use strict";
    var success=$(".success");
    var show=function(){
        success.show()
    };
    var hide=function(){
        success.hide()
    };
    // 获取群内用户
    var getGroupUser=function(){
        //获取群头像
        var group_header=localStorage.getItem("group_header"),
        // 获取apptoken
            apptoken=localStorage.getItem("apptoken"),
        // 获取群号码
            group_num=localStorage.getItem("group_num"),
        // 数据格式转换
            data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num})],
        // 加密
            jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"group_getGroupUser",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                // 解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    var  html="";
                    if(parseInt(data.data.community_status)===2){
                        $(".setSpeak").prop("checked",true);
                        $(".setSpeak").val(data.data.community_status)
                    }else{
                        $(".setSpeak").val(data.data.community_status)
                    }
                    $.each(data.data.Number_data,function(i,item){
                        var httP=item.portrait.split(":")[0];
                        if(httP==="http"){
                            html+=`
                         <li class="lf">
                          <img style="width: 35px;height: 35px" src="${item.portrait}" alt="">
                      </li>
                        `
                        }else{
                            html+=`
                         <li class="lf">
                          <img style="width: 35px;height: 35px" src="http://wx.junxiang.ren/project/${item.portrait}" alt="">
                      </li>
                        `
                        }

                    });
                    $(".flockMember").prepend(html);
                    $(".userMember").html(data.data.Number_data.length);
                    $(".headImg").attr("src",group_header)
                }
            }
        })
    };getGroupUser();
    // 页面跳转到添加群成员页面
    $(".addGroupUser").click(function(){
        window.location.href="discu_addfriend.html";
    });
    //设置禁言
    $(".setSpeak").click(function(){
        var val=$(this).val();
        console.log($(".setSpeak").val());
        if(parseInt($(".setSpeak").val())===1){//设置禁言判断
            if(confirm("确认禁言")){
                //获取apptoken
                var apptoken=localStorage.getItem("apptoken"),
                //获取群号
                    group_num=localStorage.getItem("group_num"),
                    is_cancel=$(this).val(),
                //数据格转换
                    data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num})],
                    jsonEncryptData=jsEncryptData(data);
                console.log(data);
                $.ajax({
                    url:url+"group_setGroupCommunity",
                    type:"POST",
                    data:{"data":jsonEncryptData},
                    success:function(data){
                        //解密
                        var data=jsDecodeData(data);
                        console.log(data);
                        if(data.errcode===0){
                            localStorage.setItem("apptoken",data.apptoken);
                            $(document).on('click','#show-success',function(){
                                $.toptip(data.errmsg, 'success');
                            });
                            $(".setSpeak").attr("value",2);
                            success.html(data.errmsg);
                            show();
                            setTimeout(hide,3000);
                            $(this).prop("checked",true)
                        }else{
                            success.html(data.errmsg);
                            show();
                            setTimeout(hide,3000)
                        }
                    },
                    error:function(){
                    }
                })
            }else{
                $(this).prop("checked",false);
            }
        }else if(parseInt($(".setSpeak").val())===2){//取消禁言判断
            if(confirm("取消禁言")){
                //获取apptoken
                var apptoken=localStorage.getItem("apptoken"),
                //获取群号
                    group_num=localStorage.getItem("group_num"),
                    is_cancel=$(this).val(),
                //数据格转换
                    data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num,is_cancel:1})],
                    jsonEncryptData=jsEncryptData(data);
                console.log(data);
                $.ajax({
                    url:url+"group_setGroupCommunity",
                    type:"POST",
                    data:{"data":jsonEncryptData},
                    success:function(data){
                        //解密
                        var data=jsDecodeData(data);
                        console.log(data);
                        if(data.errcode===0){
                            localStorage.setItem("apptoken",data.apptoken);
                            $(document).on('click','#show-success',function(){
                                $.toptip(data.errmsg, 'success');
                            });
                            $(".setSpeak").attr("value",1);
                            $(this).prop("checked",false);
                            success.html(data.errmsg);
                            show();
                            setTimeout(hide,3000)
                        }else{
                            success.html(data.errmsg);
                            show();
                            setTimeout(hide,3000)
                        }
                    },
                    error:function(){
                    }
                })
            }else{
                $(this).prop("checked",true);
            }
        }

    });
    //解散群
    $(".dissolveFlock").click(function(){
        if(confirm("确认解散")){
            //获取群号码
            var group_num=localStorage.getItem("group_num"),
            //获取apptoken
                apptoken=localStorage.getItem("apptoken"),
            //数据格式转换
                data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num})],
                jsonEncryptData=jsEncryptData(data);
            console.log(data);
            $.ajax({
                url:url+"group_setGroupStatus",
                type:"POST",
                data:{"data":jsonEncryptData},
                success:function(data){
                    //解密
                    var data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        localStorage.setItem("apptoken",data.apptoken);
                        $(this).prop("checked",true);
                        success.html(data.errmsg);
                        show();
                        setTimeout(hide,3000);
                    }else{
                        success.html(data.errmsg);
                        show();
                        setTimeout(hide,3000);
                    }
                },
                error:function(){}
            })
        }else{
            $(this).prop("checked",false);
        }

    })
});





























