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
                    console.log(data.data.file_path);
                    localStorage.setItem("flockCommPic",data.data.file_path);
                    var img=`
                    <img src="${Url}" alt="" style="width: 77px" class="img2">
                    `;
                    $(".picture li").append(img);
                }
            },
            error:function (data) {
                console.log(data);
            }
        });
    });
    //功能2 点击上传图片
    $(".noticeBtn").click(function(){
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
        data=["",JSON.stringify({"title":title,"content":content,"portrait":commPic,"group_num":flockCode,"apptoken":apptoken})],
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
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    alert("发布成功");
                    window.location.href="floclComm.html";
                }else{
                    console.log(data.errmsg);
                }
            }
        })
    });

});