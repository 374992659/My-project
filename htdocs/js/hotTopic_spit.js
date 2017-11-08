$(document).ready(function(){ "use strict";
//添加选项
    $(".addOption").click(function(){
        var $li=`
        <li class="option">         
            <label for="" style="" class="label">  
                       <img src="image/dell.png" id="delImg" style="width: 20px;vertical-align: middle;position: relative;z-index: 1000" alt="">           
            选项：                               
            </label>
            <input type="text" name="option" value="">
        </li>
        
        
        `;
        $(".addOption").before($li);
  //删除选项
        $(".topicList").on("click",".option .label",function(){
            console.log(123);
            $(this).parent().remove();
        });
    $(".delImg").click(function(e){
        });
    });
    // 结束时间
    $.date('#gathertime');
    // 上传图片
    (function(){
        var that=$("#uploaderInput");
        that.change(function(e){
            var targetElement = e.target,
                file = targetElement.files[0],
                url=window.URL.createObjectURL(this.files[0]) ;
            console.log(file.name);
            var fd = new FormData();
            fd.append('fileToUpload', file);
            localStorage.setItem("hotTopicPic",fd);
            if(url){
                var html=`
                <li><img class="pushPlayImg" src="${url}" alt="" style="width:78px ;height: 78px;" >
                <img src="image/del.png" alt="" class="delImg">
                </li>              
               `
            }
            localStorage.setItem("pic",url);
            $("#uploaderFiles").append(html);
            // 取消删除图片
            $(".picPlace").on("click","li .delImg",function(){
                console.log(132);
                $(this).parent().remove();
            });
            // 图片放大预览
            (function(){
                $(".picPlace").on("click","li .pushPlayImg",function(){
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
    })();
    // 发送数据
    $(".subBtn").click(function(){
        var success=$(".success");
        var hideTop=function(){
            success.empty()};
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken"),
        // 参数：title 标题
            title=$(".title").val(),
        // 参数：content 内容
            content=$(".content").val(),
        // 参数：garden_code 小区
            garden_code="270113",
        // 参数：garden_name 小区名称
            garden_name=$("#house option:selected").text(),
        // 参数：c 选择项 json格式
            choise={},
        // 参数：end_time 结束时间
            endTime=$("#gathertime").val(),
            // 转换时间戳
         timestamp2 = Date.parse(new Date(endTime)),
         end_time= timestamp2 / 1000,
        // 参数：picture 图片 可填
            picture="asdasd",
        // 参数：type 选择类型
            type=parseInt($("#type option:selected").val()),
        // 参数：is_public 是否公开
            is_public=parseInt($("#isPublic option:selected").val()),
        // 参数：is_push 是否需要推送
            is_push=parseInt($("#isPush option:selected").val());
        // 获取选项内容
      var  option= $("input[name='option']");
      option.each(function(i){
          choise[parseInt(i+1)]=$(this).val();
      });
        choise=JSON.stringify(choise);
        // 数据格式转换
        var data=["",JSON.stringify({"apptoken":apptoken,"title":title,"content":content,"garden_code":garden_code,"garden_name":garden_name,"choise":choise,"end_time":end_time,"picture":picture,"type":type,"is_public":is_public,"is_push":is_push})];
        // 加密
        var  jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"Subject_addSubject",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                // 解密
               var data=jsDecodeData(data);
                console.log(data);
                var success=$(".success");
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    showHide(data.errmsg);
                    window.location.href="hotTopic2.html"
                }else{
                    showHide(data.errmsg);
                }
            }
        })

    })
});

