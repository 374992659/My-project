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
                                     <img src="http://wx.junxiang.ren/project/${item}" alt="" style="width: 79px;height: 79px" class="pushSpit_Img">
                                     <img src="image/del.png" alt="" width="20px" class="delImg">
                                 </li>
                        `
                    });
                    $(".picPlace").append(LiImg);
                }else{
                    console.log(data.errmsg);
                }
            }
        })
    });
    //删除图片
    $("#uploaderFiles").on("click",".weui-uploader__file .delImg",function(){
        $(this).parent().remove();
    });
    //获取小区code
    (function(){
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        var data=["",JSON.stringify({"apptoken":apptoken})];
        var json=jsEncryptData(data);
        console.log("获取小区");
        $.ajax({
            url:url+"UserCenter_getApplicationGarden",
            type:"POST",
            data:{"data":json},
            success:function(data){
                console.log(data);
                // 解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                  var  html="";
                    $.each(data.data,function(i,item){
                        html+=`
                         <option title="${item.garden_code}">${item.garden_name}</option>                     
                        `
                    });
                    $("#house").html(html);
                }
                else if(data.errcode===5){
                    $("#spitTopic").hide();
                    html=`
                      <div style="text-align: center">
                        <p>你还没有认证的小区不能发布槽点，请到个人心进行认证</p>
                        <a href="http://wx.junxiang.ren/project/htdocs/personalCente/" style="background: red;color: white">点我到个人中心</a>
                    </div>
                    `;
                    $("body").html(html)
                }
            }
        })
    })();
    // 发送数据
    var empty=function(a){
        var that=a;
        var value=that.val();
        if(!value){
            that.attr("placeholder","该项必填");
            that.attr("style","color:red");
        }
    };
    $(".subBtn").click(function(){
        var garden_code=$("#house option:selected").attr("title");
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        // 参数：title 标题
         var   title=$(".title").val();
                empty($(".title"));
        // 参数：content 内容
          var   content=$(".content").val();
        empty($(".content"));
        // 参数：garden_code 小区
           // garden_code=$("#house option:selected").attr("title"),
        // 参数：garden_name 小区名称
          var   garden_name=$("#house option:selected").text();
        // 参数：c 选择项 json格式
          var   choise={};
        // 参数：end_time 结束时间
           var  endTime=$("#gathertime").val();
                empty($("#gathertime"));
            // 转换时间戳
         //timestamp2 = Date.parse(new Date(endTime)),
        // end_time= timestamp2 / 1000,
        var arr = endTime.split(/[- : \/]/),
            date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4]);
        var end_time= date / 1000;
        // 参数：picture 图片 可填
         var picture={};
         var Url=$(".picPlace").find(".pushSpit_Img");
         Url.each(function(i,item){
             picture[parseInt(i+1)]=$(this).attr("src");
         });
        // 参数：type 选择类型
         var   type=parseInt($("#type option:selected").val()),
        // 参数：is_public 是否公开
            is_public=parseInt($("#isPublic option:selected").val()),
        // 参数：is_push 是否需要推送
            is_push=parseInt($("#isPush option:selected").val());
        // 获取选项内容
      var  option= $("input[name='option']");
      option.each(function(i){
          choise[parseInt(i+1)]=$(this).val();
      });
        empty($("input[name='option']"));
        // 数据格式转换
        var data=["",JSON.stringify({"apptoken":apptoken,"title":title,"content":content,"garden_code":parseInt(garden_code),"garden_name":garden_name,"choise":JSON.stringify(choise),"end_time":end_time,"picture":JSON.stringify(picture),"type":parseInt(type),"is_public":parseInt(is_public),"is_push":parseInt(is_push)})];
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

