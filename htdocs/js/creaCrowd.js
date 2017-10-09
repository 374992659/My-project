$(document).ready(function(){
    $('#uploaderInput').change(function(e) {
        var targetElement = e.target,
            file = targetElement.files[0],
            url=window.URL.createObjectURL(this.files[0]) ;
        console.log(file.name);
        var fd = new FormData();
        fd.append('fileToUpload', file);
        localStorage.setItem("fd",fd);
        if(url){
            $(".flockHead img").attr("src", url);
            $(".loader").attr("style","position:absolute;left:40%;opacity: 0;");
            $(".flockHead").attr("style","display:block");
        }


    });

    $(".createBtn").click(function(){
        //鑾峰彇鍥剧墖
        var pic=localStorage.getItem("fd");
        var name=$("#flockName").val();

        var  id=$("#flockClass option:selected").val();
        console.log(id);
        var apptoken=localStorage.getItem("apptoken");
        //鏁版嵁鏍煎紡杞崲
        data=["",JSON.stringify({"group_name":name,"group_portrait":pic,"group_type":id,"apptoken":apptoken})];
        console.log(data);
        //鍔犲瘑鏁版嵁
        jsonEncryptDate=jsEncryptData(data);
        //鍙戣捣璇锋眰
        $.ajax({
            url:url+"group_addGroup",
            type:"POST",
            data:{"data":jsonEncryptDate},
            success:function(data){
                //瑙ｅ瘑鏁版嵁
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    alert("鍒涘缓鎴愬姛");
                    window.location.href="createCrowd.html"
                }else{
                    if(data.errcode===114){
                        alert("");
                        //window.location.href="landing.html"
                    }else{
                        alert(data.errmsg);
                    }
                }
            }
        })
    });
});

