/**
 * Created by Administrator on 2017/10/8 0008.
 */
$(document).ready(function(){
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
            //获取上传文件的dom对象
            var file=document.querySelector("#uploaderInput").files;
        //实例化一个表单数据对象
        var pic=new FormData(file);
        console.log(pic);
        console.log(file);
        // 遍历图片文件列表，插入到表单数据中
        for (var i=0;i<file.length;i++) {
            // 文件名称，文件对象
            pic.append("file_path",file[i]);
        }
        console.log(formData.get(pic));
        var a =formData.get("qweqwe");
        console.log(a);
        //contentType: false,processData: false
    })


});