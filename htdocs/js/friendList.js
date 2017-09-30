
$(document).ready(function(){
     //强制跳转到登录页面
    var apptoken=localStorage.getItem("apptoken");
    data=['',JSON.stringify({'url':"http://wx.junxiang.ren/project/htdocs/landing.html","apptoken":apptoken})];
    console.log(data);
    encreptdata = jsEncryptData(data);
     $.ajax({
         url:url+"friends_getGroup",
         data:{"data":encreptdata},
        type:'post',
          success:function(data){
             data=jsDecodeData(data);
             localStorage.setItem("apptoken",data.apptoken);
              console.log(data);
              var url=data.data;
              console.log(url);
              if(data.errcode===114){
                   window.location.href=url;
              }
       }
    });

     // 功能1、 获取好友分组信息
        $.ajax({
            url:url+"friends_getGroup",
            type:"POST",
            success:function(data){
                data=jsDecodeData(data);
                var result=data.data;
                if(data.errcode===0){
                    for(var i=0,len=result.length;i<len;i++){
                        var item=$("<div title="+result[i].group_id +" class=\"weui-cells\"><div class=\"weui-cell LinkBtn\">\n" +
                            "            <div class=\"weui-cell__hd \"><img class=\"linkBtn\" style=\"\" src=\"image/right.png\" ></div>\n" +
                            "            <div class=\"weui-cell__bd\">\n" +
                            "                <p style=\"\">"+result[i].group_name +"</p>\n" +
                            "            </div>\n" +
                            "            <div class=\"weui-cell__ft\" style=\"\">"+result[i].online_num +"/"+result[i].total +"</div>\n" +
                            "        </div></div>");
                        $(".weui-tab").after(item);
                    }
                }
            }

        });
        // 功能2、获取分组下的好友信息

    $(".LinkBtn").click(function(e){
            // 获取group_id
            var apptoken=localStorage.getItem("apptoken");
            var value=$(this).attr("title");
            data=["",JSON.stringify({"group_id":value})];
            console.log(data);
            encreptdata = jsEncryptData(data);
            console.log(encreptdata);
         $.ajax({
             url:url+"friends_getGroupFriends",
             type:"POST",
             data:{"data":encreptdata,"apptoken":apptoken},
             success:function(data){
                 // 解密数据
                 data=jsDecodeData(data);
                 console.log(data);
                 var html="";
                 var result=data.data;
                    $.each(result,function(i,item){
                        if(item.group_id===value){
                            html+=`
                 <a href="friendChat.html" class="weui-media-box weui-media-box_appmsg">
                    <div class="weui-media-box__hd">
                        <img class="weui-media-box__thumb" src="${item.frien_signature}">
                    </div>
                    <div class="weui-media-box__bd">
                        <h4 class="weui-media-box__title">${item.frien_nickname}</h4>
                        <p class="weui-media-box__desc">由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。</p>
                    </div>
                </a>
                    `
                        }
                    });
                $(".friend").html(html);
            console.log(13);


                }

         });

        if($(this).next().is(":hidden")){
            $(this).next().show();
            $(this).children().children("img").css("transform","rotate(90deg)");
        }else{
            $(this).next().hide();
            $(this).children().children("img").css("transform","rotate(0deg)");
        }
    });


});


