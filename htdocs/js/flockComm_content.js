$(document).ready(function(){
    // $(".delBtn").click(function(){
    //     var a=confirm("删除公告");
    //     console.log(a)
    //
    // });
    // 获取群号码
    var num=localStorage.getItem("group_num");
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    // 数据格式转换
    data=["",JSON.stringify({"group_num":num,"apptoken":apptoken})];
    // 数据加密
    jsonEncryptDate=jsEncryptData(data);
    console.log(data);
    // 发起ajax请求
   $.ajax({
       url:url+"group_getGroupNotice",
        type:"POST",
       data:{"data":jsonEncryptDate},
       success:function(data){
           // 解密数据
           data=jsDecodeData(data);
           console.log(data);
           if(data.errcode===0){
               localStorage.setItem("apptoken",data.apptoken);
               // 获取公告id
               var id=localStorage.getItem("commId");
               var html="";
               $.each(data.data,function(i,item){
                   if(item.id==id){
                       html=`
                
                    <h4 class="weui-media-box__title" style="text-align: center;white-space:normal">${item.title}</h4>
            <ul class="weui-media-box__info" style="margin:0 0 15px 0;">
                <li class="weui-media-box__info__meta">文字来源：${item.nickname}<span></span></li>
                <li class="weui-media-box__info__meta">时间：<span>${getLocalTime(item.create_time)}</span></li>
            </ul>
            <ul class="ulPicture">
                <li class="lf flockPic">
                    <img src="http://wx.junxiang.ren/project/${item.portrait}" alt="" style="width: 100px">
                </li>             
            </ul>
            <p class="weui-media-box__desc" style="-webkit-line-clamp:100000;color:black;text-indent:2em">
                    ${item.content}
                
            </p>
            <button title="${item.id}" class="weui-btn weui-btn_mini weui-btn_primary delBtn">删除</button>
                   
                   `
                   }
               });
               $(".flockContent").html(html);
               $(".flockContent").on("click",".delBtn",function(){
                    if(confirm("删除公告")){
                        // 获取apptoken
                        var apptoken=localStorage.getItem("apptoken");
                        // 获取群公告id
                        var id=$(".delBtn").attr("title");
                        // 获取群号码
                        var code=localStorage.getItem("group_num");
                        // 数据格式转换
                        data=["",JSON.stringify({"apptoken":apptoken,"id":id,"group_num":code})];
                        console.log(data);
                        // 加密数据
                        jsonEncryptDate=jsEncryptData(data);
                        // 发起删除请求
                        $.ajax({
                            url:url+"group_delGroupNotice",
                            type:"POST",
                            data:{"data":jsonEncryptDate},
                            success:function(data){
                                // 解密数据
                                data=jsDecodeData(data);
                                console.log(data);
                                if(data.errcode===0){
                                    localStorage.setItem("apptoken",data.apptoken);
                                    $(".success").show();
                                    window.location.href="floclComm.html";
                                }else{
                                    alert(data.errmsg);
                                }
                            }
                        })

                    }
               })
           }
       }
   });
    // 图片放大预览
    (function(){
        $(".flockContent").on("click",".ulPicture .flockPic img",function(){
            var url=$(this).attr("src");
            console.log(url);
            if($(".weui-gallery").is(":hidden")){
                $(".weui-gallery").show();
                $(".weui-gallery__img").attr("style","background-image: url("+url+")")
            }
        });
        $(".weui-gallery").click(function(){
            $(".weui-gallery").hide();
        });
    })();

});













