$(document).ready(function(){
    "use strict";
    // 功能1 上传图片
    $('#uploaderInput').change(function(e) {
        var Url=window.URL.createObjectURL(this.files[0]) ;
        var formData= new FormData();
        var apptoken=localStorage.getItem("apptoken");
        formData.append("file",$("#uploaderInput")[0].files[0]);
        var data=["",JSON.stringify({"apptoken":apptoken})];
        var json=jsEncryptData(data);
        formData.append("data",json);
        console.log(formData);
        $.ajax({
            type:"POST",
            url:url+"group_uploadNoticePic",
            fileElementId:'uploaderInput',
            data:formData,
            processData : false,
            contentType : false,
            secureuri:false,
            success : function(data){
                // 解密
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    console.log(data.data[0]);
                    localStorage.setItem("flockCommPic",data.data[0]);
                    console.log(data.data[0]);
                    $(".img").attr({
                        "src":Url,
                        "style":"width:77px;height:77px"
                    });

                }
            },
            error:function (data) {
                console.log(data);
            }
        });
    });
    // 取消删除图片
    $(".delImg").click(function(){
        console.log(132);
        $(this).attr("src","");
    });
    // 图片放大预览
    (function(){
        $(".img").click(function(){
            var url=$(this).attr("src");
            console.log("图片放大");
            console.log(url);
            if($(".weui-gallery").is(":hidden")){
                $(".weui-gallery").show();
                $(".weui-gallery__img").attr("style","background-image:url("+url+")")
            }
        });
        $(".weui-gallery").click(function(){
            $(".weui-gallery").hide();
        });
    })();
    //功能2 点击上传图片
    $(".noticeBtn").click(function(){
        var success=$(".success");
        var hideTop=function(){
            success.empty()};
        //获取apptoken
        var apptoken=localStorage.getItem("apptoken"),
        //获取群号
         group_num=localStorage.getItem("group_num"),
        //获取公告标题
         title=$(".noticeTitle").val(),
        //获取公告内容
         content=$(".noticeContent").val(),
        //获取公告图片路径
         commPic=localStorage.getItem("flockCommPic"),
         // 数据格式转换
        data=["",JSON.stringify({"title":title,"content":content,"portrait":commPic,"group_num":group_num,"apptoken":apptoken})],
        // 数据加密
        jsonEncryptDate=jsEncryptData(data);
        console.log(data);
        // 发起ajax请求
        $.ajax({
            url:url+"group_addGroupNotice",
            type:"POST",
            data:{"data":jsonEncryptDate},
            success:function(data){
                // 解密数据
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                   showHide(data.errmsg);
                    window.location.href="floclComm.html";
                }else{
                    showHide(data.errmsg);
                }
            }
        })
    });

});