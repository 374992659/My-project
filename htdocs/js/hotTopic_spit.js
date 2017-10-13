$(document).ready(function(){ "use strict";
//添加选项
    $(".addOption").click(function(){
        var $li=`
        <li class="option">         
            <label for="" style="" class="label">  
                       <img src="image/dell.png" id="delImg" style="width: 20px;vertical-align: middle; alt="">           
            选项：                               
            </label>
            <input type="text" name="option">
        </li>
        
        
        `;
        $(".addOption").before($li);
  //删除选项
        $(".topicList").on("click",".option .label #delImg",function(e){
console.log(123);
            $(e.target).parent().remove();
        });
    $(".delImg").click(function(e){


    });

    });
    // 结束时间
    $.date('#other-date1');
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

    })();
    // 发送数据
    $(".subBtn").click(function(){
        // 获取apptoken
        var apptone=localStorage.getItem("apptoken"),
        // 参数：title 标题
            title=$(".title").val(),
        // 参数：content 内容
            content=$(".content").val(),
        // 参数：garden_code 小区
            garden_code="",
        // 参数：garden_name 小区名称
            garden_name="",
        // 参数：c 选择项 json格式
            choise={
            optionArr:[]
            },
        // 参数：end_time 结束时间
            end_time=$("#gathertime").val(),
        // 参数：picture 图片 可填
            picture="",
        // 参数：type 选择类型
            type=null,
        // 参数：is_public 是否公开
            is_public=null,
        // 参数：is_push 是否需要推送
            is_push=null;
        // 获取选项内容
      var  option= $("input[name='option']");
      $.each(option,function(i,item){
          choise.optionArr.push($(this).text())

      });
        // 获取图片数据

        // 获取选择类型
        $("#type").change(function(){
            type= $(this).val();

        });
        // 获取是否公开
        $("#isPublic").change(function(){
            is_public=$(this).val()

        });
        // 获取是否推送物管
        $("#isPush").change(function(){
            is_push=$(this).val()
        });
        // 数据格式转换
        var data=["",JSON.stringify({"apptoken":apptoken,"title":title,"content":content,"garden_code":garden_code,"garden_name":garden_name,"choise":choise,"end_time":end_time,"picture":picture,"type":type,"is_public":is_public,"is_push":is_push})];
        // 加密
        var  jsonEncryptData=jsEncryptData(data);
        $.ajax({
            url:url+"Subject_addSubject",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                // 解密
                var data=jsDecodeData(data);
                var success=$(".success");
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoeken);
                    success.show();
                    // 定时器
                    $(function(){
                        function hidden(){
                            success.hide();
                        }
                        setInterval(hidden,3000);
                    });
                }else{
                    console.log(data.errmsg);
                    success.html("失败请重新操作");
                    success.attr("color",red)
                    success.show();
                    // 定时器
                    $(function(){
                        function hidden(){
                            success.hide();
                        }
                        setInterval(hidden,3000);
                    });
                }
            }
        })

    })
});

