/**
 * Created by Administrator on 2017/10/8 0008.
 */
$(document).ready(function(){
    $("#uploaderInput").change(function(e){
        var targetElement = e.target,
            file = targetElement.files[0],
            url=window.URL.createObjectURL(this.files[0]) ;
        console.log(url);
        var fd = new FormData();
        fd.append('fileToUpload', file);
        localStorage.setItem("flockComm_push",fd);
        if(url){
            console.log(url);
            var   li= $("<li style=\"\" class=\"lf\">\n" +
                "                            <img src="+ url+" alt=\"\" style=\"height:77px;\" class=\"img1\">\n" +
                "                        </li>")

        }
        $(".picture").append(li);

    });
    $(".noticeBtn").click(function(){
        //获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        //获取群号
        var flockCode="";
        //获取公告标题
        var title=$(".noticeTitle").val();
        //获取公告内容
        var content=$(".noticeContent").val();
        //获取公告图片
         var commPic="";
         // 数据格式转换
        data=["",JSON.stringify({"title":title,"content":content,"portrait":commPic,"group_num":flockCode,"apptoken":apptoken})];
        console.log(data);
        // 数据加密
        jsonEncryptDate=jsEncryptData(data);
    });
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