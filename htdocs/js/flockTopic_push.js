$(document).ready(function(){
    "use strict";
    // 上传图片及预览
    $("#uploaderInput").change(function(e){
        let targetElement = e.target,
            file = targetElement.files[0],
            url=window.URL.createObjectURL(this.files[0]) ;
        console.log(file.name);
        let fd = new FormData();
        fd.append('fileToUpload', file);
        if(url){
           var  LiImg=`
            <li class="weui-uploader__file" >
                                    <img src="${url}" alt="" style="width: 79px;height: 79px" class="pushTopic_Img">
                                    <img src="image/del.png" alt="" class="delImg">
                                </li>
            
            `
        }
        localStorage.setItem("pushTopic_Img",url);
        $("#uploaderFiles").append(LiImg);

    });
    // 取消删除图片
    $("#uploaderFiles").on("click",".weui-uploader__file .delImg",function(){
        $(this).parent().remove();
    });
    // 图片放大预览
    (function(){
        $("#uploaderFiles").on("click",".weui-uploader__file .pushTopic_Img",function(){
            console.log(123);
            var url=localStorage.getItem("pushTopic_Img");
            if($(".weui-gallery").is(":hidden")){
                $(".weui-gallery").show();
                $(".weui-gallery__img img").attr("src",url)
            }
        });
        $(".weui-gallery").click(function(){
            $(".weui-gallery").hide();

        });
    })();
    // 发布话题
    $(".sumBtn").click(function(){
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        // 获取群号码
        var group_num=localStorage.getItem("group_num");
        // 获取图片
        var topicPic="";
        // 获取标题
        var title=$(".topicTitle").val();
        // 获取内容
        var content=$(".topicContent").val();
        // 数据格式转换
       var data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num,"picture":topicPic,"title":title,"content":content})];
       console.log(data);
        // 数据加密
       var jsonEncryptData=jsEncryptData(data);
        $.ajax({
            url:url+"group_addGroupSubject",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                // 数据解密
                data=jsDecodeData(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    console.log("发布成功");
                }else{
                    console.log(data.errmsg);
                }
            }

        })

    });




});