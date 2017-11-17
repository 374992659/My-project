$(document).ready(function(){
    "use strict";
    // 上传图片及预览
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
                                     <img src="http://wx.junxiang.ren/project/${item}" alt="" style="width: 79px;height: 79px" class="pushTopic_Img">
                                     <img src="image/del.png" alt="" width="20px" class="delImg">
                                 </li>
                        `
                    });
                    $(".topicPlace").append(LiImg);
                }else{
                    console.log(data.errmsg);
                }
            }
        })
    });
    // 取消删除图片
    $("#uploaderFiles").on("click",".weui-uploader__file .delImg",function(){
        $(this).parent().remove();
    });
    // 图片放大预览
    (function(){
        $("#uploaderFiles").on("click",".weui-uploader__file .pushTopic_Img",function(){
            console.log(123);
           var URL=$(this).attr("src");
            if($(".weui-gallery").is(":hidden")){
                $(".weui-gallery").show();
                $(".weui-gallery__img").attr("style","background-image: url("+URL+")")
            }
        });
        $(".weui-gallery").click(function(){
            $(".weui-gallery").hide();

        });
    })();
    // 发布话题
    $(".sumBtn").click(function(){
        var success=$(".sccuss");
        var hideTop=function(){
            success.empty()};
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        // 获取群号码
        var group_num=localStorage.getItem("group_num");
        // 获取图片
        var topicPic={};
        var Img=$("#uploaderFiles").find(".pushTopic_Img");
        Img.each(function(i,item){
            topicPic[parseInt(i+1)]=$(this).attr("src");
        });
       var picTopic=JSON.stringify(topicPic);
       console.log(typeof picTopic);
        // 获取标题
        var title=$(".topicTitle").val();
        // 获取内容
        var content=$(".topicContent").val();
        // 数据格式转换
       var data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num,"picture":picTopic,"title":title,"content":content})];
       console.log(data);
        // 数据加密
       var jsonEncryptData=jsEncryptData(data);
       console.log(data);
        $.ajax({
            url:url+"group_addGroupSubject",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                // 数据解密
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    //window.location.href="flocktTopic.html";
                }else{
                    showHide(data.errmsg);
                    setTimeout(hideTop,3000);
                }
            }

        })

    });




});