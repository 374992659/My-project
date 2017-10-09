/**
 * Created by Administrator on 2017/10/8 0008.
 */
$(document).ready(function(){
    //获取群号码
    var code=localStorage.getItem("group_num");
    //获取apptoken
    var apptoken=localStorage.getItem("apptoken");
     //数据格式转换
    data=["",JSON.stringify({"group_num":code,"apptoken":apptoken})];
        //数据加密
     jsonEncryptData=jsEncryptData(data);
        //发起ajax请求
        $.ajax({
            url:url+"group_getGroupNotice",
            type:"POST",
            data:{},
            success:function(data){
                //解密数据
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    var html="";
                    $.each(data.data,function(i,item){
                        html+=`
                        <a href="flockComm_content.html" class="weui-media-box weui-media-box_appmsg" title="${item.id}">
                            <div class="weui-media-box__bd">
                                <h4 class="weui-media-box__title" style="font-size: 15px">${item.title}</h4>
                                <p class="weui-media-box__desc">${item.content}</p>
                                <span class="right time" style="font-size: 12px;color:#b1b3b5;">${item.create_time}</span>
                            </div>
                        </a>
                        `
                    });
                    $(".groupNotice").html(html);
                }else{
                    if(errcode===114){
                        alert("登录超时");
                        window.location.href="landing.html"
                    }
                }
            }

        });
        $(".groupNotice").on("click",".weui-media-box",function () {
            var commId=$(this).attr("title");
            localStorage.setItem("commId",commId);
        })
    }

);