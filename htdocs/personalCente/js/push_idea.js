$(document).ready(function(){
    // 获取小区code
    (function(){
        var apptoken=localStorage.getItem("apptoken");
        $("#houseName").on("input",function(){
            var city_id=$("#city option:selected").val();
            var key=$("#houseName").val();
            if(key){

            }else{

            }
            // 数据格式转换
            var data=["",JSON.stringify({"apptoken":apptoken,"city_id":city_id,"key":key})],
                // 加密
                jsonEncryptData=jsEncryptData(data);
            console.log("通过关键词搜索小区");
            console.log(data);
            $.ajax({
                url:url+"UserCenter_getGardenInfo",
                type:"POST",
                data:{"data":jsonEncryptData},
                success:function(data){
                    // 解密
                    var data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        console.log(data.data);
                        localStorage.setItem("apptoken",data.apptoken);
                        $.each(data.data,function(i,item){
                            console.log(item);
                            $("#houseName").attr("title",item.garden_code)
                        });

                    }
                },
                error:function(){}
            })
        });
    })();
    //上传照片
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
    // 提交
    $(".sumBtn").click(function(){
        var success=$(".success");
        var hideTop=function(){
            success.empty()};
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        // 参数：garden_code 小区code
        var garden_code=$("#houseName").attr("title");
        // 参数：garden_name 小区名
        var garden_name=$("#houseName").val();
        // 参数：title 名称
        var title=$(".Title").val();
        // 参数：content 意见内容
        var content=$(".Content").val();
        // 参数：picture 意见图片 可填
        var picture="";
        // 数据格式转换
        var data=["",JSON.stringify({"apptoken":apptoken,"garden_code":garden_code,"garden_name":garden_name,"title":title,"content":content,"picture":picture})];
        // 加密
        var jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"UserCenter_addGardenMessage",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                // 解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                   showHide(data.errmsg);
                   window.location.href="ideaBox.html";
                }else{
                    showHide(data.errmsg)

                }
            },
            error:function(){}
        })


    })

});




















