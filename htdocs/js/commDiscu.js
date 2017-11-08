$(document).ready(function(){
    "use strict";
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
                    console.log(data.data.community_status);
                    if(parseInt(data.data.community_status)===2){
                        $(".setSpeak").prop("checked",true)
                    }
                    $.each(data.data.Number_data,function(i,item){
                        html+=`
                         <li class="lf">
                          <img style="width: 35px;height: 35px" src="${item.portrait}" alt="">
                      </li>
                        `
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
        if(parseInt(val)===1){//设置禁言判断
            if(confirm("确认禁言")){
                $(this).attr("checked","checked");
                console.log($(this).attr("checked"));
                //获取apptoken
                var apptoken=localStorage.getItem("apptoken"),
                //获取群号
                    group_num=localStorage.getItem("group_num"),
                    is_cancel=$(this).val(),
                //数据格转换
                    data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num,"is_cancel":is_cancel})],
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
                            $(".setSpeak").attr("value",0);

                        }else{
                            $(document).on('click','#show-success',function(){
                                $.toptip(data.errmsg, 'success');
                            });
                        }
                    },
                    error:function(){
                    }
                })
            }else{

            }
        }else if(parseInt(val)===0){//取消禁言判断
            if(confirm("取消禁言")){
                $(this).attr("checked","checked");
                console.log($(this).attr("checked"));
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
                            $(".setSpeak").attr("value",1);

                        }else{
                            $(document).on('click','#show-success',function(){
                                $.toptip(data.errmsg, 'success');
                            });
                        }
                    },
                    error:function(){
                    }
                })
            }else{


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
                        $(document).on('click','#show-success',function(){
                            $.toptip(data.errmsg, 'success');
                        });
                    }else{
                        $(document).on('click','#show-success',function(){
                            $.toptip(data.errmsg, 'success');
                        });
                    }
                },
                error:function(){}
            })
        }

    })
});





























