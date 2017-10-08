$(document).ready(function(){
    $('#uploaderInput').change(function(event) {
        // 根据这个 <input> 获取文件的 HTML5 js 对象
        var files = event.target.files, file;
        //获取图片路径
        var url=files[0].name;
        localStorage.setItem("url",url);
        //获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        //预览图片
        if (files && files.length > 0) {
            var data = new FormData();
            console.log(data);
            // 获取目前上传的文件路径
            file = files[0];
            // 来在控制台看看到底这个对象是什么
            console.log(file.name);

            // 那么我们可以做一下诸如文件大小校验的动作
            if(file.size > 1024 * 1024 * 2) {
                alert('图片大小不能超过 2MB!');
                return false;
            }
            // !!!!!!
            // 下面是关键的关键，通过这个 file 对象生成一个可用的图像 URL
            // 获取 window 的 URL 工具
            var URL = window.URL || window.webkitURL;
            // 通过 file 生成目标 url
            var imgURL = URL.createObjectURL(file);
            var upload=$(".upload");
            var flockHead=$(".flockHead");
            if(upload.is(":hidden")){
                upload.show();
                flockHead.hide();
            }else{
                upload.hide();
                flockHead.show();
                $('.flockHead img').attr('src', imgURL);
            }

        }
        //对图片和apptoken进行数据转换

        //加密数据
        //上传图片
        //$.ajax({
        //    url:url+"group_uploadGroupP",
        //    type:"POST",
        //    data:{},
        //    success:function(data){
        //
        //    }
        //});
    });
    $(".createBtn").click(function(){
        //获取群头像
        var url=localStorage.getItem("url");
        //获取群名字
        var name=$("#flockName").val();
        //获取群分类id
        var  id=$("#flockClass option:selected").val();
        console.log(id);
        //获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        //获取小区code（可填）

        //数据格式转换
        data=["",JSON.stringify({"group_name":name,"group_portrait":url,"group_type":id,"apptoken":apptoken})]
        console.log(data);
        //数据加密
        jsonEncryptDate=jsEncryptData(data);
        //发起ajax请求
        $.ajax({
            url:url+"group_addGroup",
            type:"POST",
            data:{"data":data},
            success:function(data){
                //解密数据
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    alert("创建成功");
                    window.location.href="createCrowd.html"
                }else{
                    if(data.errcode===114){
                        alert("登录超时请重新登录");
                        //window.location.href="landing.html"
                    }else{
                        alert(data.errmsg);
                    }
                }
            }
        })
    });
});

