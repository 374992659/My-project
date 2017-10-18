$(document).ready(function(){
    "use strict";
    // 上传图片及预览
    $("#uploaderInput").change(function(e){
        // let targetElement = e.target,
        // 图片信息组成的数组
        var file =$("#uploaderInput")[0].files;
        // url=window.URL.createObjectURL(this.files[0]);
        // 输出地址
        console.log(file[0].name);
        var formData = new FormData();
        for(var i=0,len=file.length;i<len;i++){
            console.log(file[i]);
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
                    localStorage.setItem("apptoken",data.apptoken)
                }else{
                    console.log(data.errmsg);
                }
            }
        })
        // if(url){
        //    var  LiImg=`
        //     <li class="weui-uploader__file" >
        //                             <img src="${url}" alt="" style="width: 79px;height: 79px" class="pushTopic_Img">
        //                             <img src="image/del.png" alt="" width="20px" class="delImg">
        //                         </li>
        //
        //     `
        // }
        // localStorage.setItem("pushTopic_Img",url);
        // $("#uploaderFiles").append(LiImg);

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
                    console.log("发布成功");
                }else{
                    console.log(data.errmsg);
                }
            }

        })

    });




});