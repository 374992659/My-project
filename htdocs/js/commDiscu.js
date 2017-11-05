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
                    console.log(data.data);
                    console.log(data.data.Number_data.length);
                    $.each(data.data.Number_data,function(i,item){
                        html+=`
                         <li class="lf">
                          <img style="width: 35px;height: 35px" src="${item.portrait}" alt="">
                      </li>
                        `
                    });
                    $(".flockMember").prepend(html);
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
        if(confirm("确认禁言")){
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
                        $(".setSpeak").val(0)
                    }else{
                        $(document).on('click','#show-success',function(){
                            $.toptip(data.errmsg, 'success');
                        });
                    }
                },
                error:function(){
                }
            })
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





























