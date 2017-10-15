// 图片上传
var addpic=function(obj){
    "use strict";
    var that=$(obj);
    that.change(function(e){
        var targetElement = e.target,
            file = targetElement.files[0],
            url=window.URL.createObjectURL(this.files[0]) ;
        console.log(file.name);
        var fd = new FormData();
        fd.append('fileToUpload', file);
        localStorage.setItem("flockPlayPic",fd);
        if(url){
            var html=`
                <li><img class="pushPlayImg" src="${url}" alt="" style="width:80px ;height: 80px" >
                <img src="image/del.png" alt="" class="delImg">
                </li>              
               `
        }
        localStorage.setItem("pic",url);
        $(".picPlace").append(html);
        // 取消删除图片
        $(".picPlace").on("click","li .delImg",function(){
            $(this).parent().remove();
        });
// 图片放大预览
        (function(){
            $(".picPlace").on("click","li .pushPlayImg",function(){
                console.log(123);
                var url=localStorage.getItem("pic");
                if($(".weui-gallery").is(":hidden")){
                    $(".weui-gallery").show();
                    $(".weui-gallery__img img").attr("src",url)
                }
            });
            $(".weui-gallery").click(function(){
                $(".weui-gallery").hide();
            });
        })();


    });

};




