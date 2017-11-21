$(document).ready(function(){
    var mycode=localStorage.getItem("my_code");
    console.log(mycode);
        //向页面添加数据
   var photo=function(){
        // 获取群号
        var group_num=localStorage.getItem("group_num");
        //获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        //转换数据格式
        data=["",JSON.stringify({"group_num":group_num,"apptoken":apptoken})];
        //加密数据
        jsonEncryptData=jsEncryptData(data);
        $.ajax({
            url:url+"group_getGroupPic",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                //解密数据
              var  data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    $.each(data.data,function(i,item){
                        var httP=item.portrait.split(":")[0];
                        var pic="";
                        if(httP==="http"){
                            pic=item.portrait;
                        }else{
                            pic="http://wx.junxiang.ren/project/"+item.portrait;
                        }
                        console.log(pic);
                        var html="";
                        var Li="";
                        console.log(item);
                        html+=`
                        <div class="weui-panel weui-panel_access">
                            <div class="weui-panel__bd">
                                <div  class="weui-media-box weui-media-box_appmsg">
                                    <div class="weui-media-box__hd">
                                        <img class="weui-media-box__thumb" src="${pic}" style="border-radius: 50px">
                                    </div>
                                    <div class="weui-media-box__bd" >
                                        <h4 class="weui-media-box__title" style="font-size: 15px;">${item.nickname}</h4>
                                        <button class="right delBtn" title="${item.id}" style="font-size: 14px">删除</button>
                                        <span class="weui-media-box__desc" style="font-size: 14px">${getLocalTime(item.create_time)}</span>
                                    </div>
                                </div>
                                <p style="font-size: 13px;padding: 0 5px"></p>
                            </div>
                            <ul class="${item.id}">
                                  
                            </ul>
                        </div>
                        `;
                        // 对图片进行循环
                        $.each(item.picture_path,function(i,item){
                            console.log(item);
                            Li+=`
                               <li class="lf">
                                    <img src="http://wx.junxiang.ren/project/${item}" alt="" class="addPic">
                               </li>
                            `
                        });
                        console.log(Li);
                        $(".picPlace").prepend(html);
                        $("."+item.id).append(Li);
                        // 获取flockInfo
                        var flockInfo=localStorage.getItem("flockInfo");
                        flockInfo=JSON.parse(flockInfo);
                        console.log(typeof flockInfo);
                       $.each(flockInfo,function (i,item) {
                          if(parseInt(item)===parseInt(mycode)){
                            console.log("群相册");
                          }else{
                              $(".delBtn").hide();
                          }
                       });
                    });

                }
            }
        })
    };photo();
    //上传图片
    $('#uploaderInput').change(function(){
        // 实例化forDate
        var formData= new FormData();
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        // 获取群号
        var group_num=localStorage.getItem("group_num");
        var file=$("#uploaderInput")[0].files;
        console.log(file);
        // 向formDate添加文件
        for(var i=0,len=file.length;i<len;i++){
            console.log(file[i]);
            formData.append("file"+i,file[i]);
        }
        var data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num})];
        var json=jsEncryptData(data);
        formData.append("data",json);
        console.log(formData);
        $.ajax({
            type:"POST",
            url:url+"group_addGroupPic",
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
                    localStorage.setItem("apptoken",data.apptoken);
                    window.location.reload();
                }
            },
            error:function (data) {
                console.log(data);
            }
        });
    });
    //删除群相册
    $("#flockPhoto").on("click",".delBtn",function(e){
        if(confirm("删除相册")){
            var group_num=localStorage.getItem("group_num");
            //获取apptoken
            var apptoken=localStorage.getItem("apptoken");
            //获取相册编号
            var PhotoCode=$(this).attr("title");
            //数据格式转换
            data=["",JSON.stringify({"apptoken":apptoken,"picture_id":PhotoCode,"group_num":group_num})];
            //数据加密
            josnEncyptData=jsEncryptData(data);
            console.log(data);
            //发起请求
            $.ajax({
                url:url+"group_delGroupPic",
                type:"POST",
                data:{"data":josnEncyptData},
                success:function(data){
                    //解密数据
                    data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        localStorage.setItem("apptoken",data.apptoken);
                        $(e.target).parent().parent().parent().parent().remove();
                    }else{
                        console.log(data.errmsg);
                    }
                }

            })
        }
    });
    // 图片预览功能
    $(".picPlace").on("click",".weui-panel ul li .addPic",function(){
        var url=$(this).attr("src");
        console.log(url);
        if($(".weui-gallery").is(":hidden")){
            $(".weui-gallery").show();
            $(".weui-gallery__img").attr("style","background-image:url("+url+")")
        }
    });
    $(".weui-gallery").click(function(){
        $(".weui-gallery").hide();
    });
});