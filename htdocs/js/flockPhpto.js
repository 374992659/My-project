$(document).ready(function(){
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
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    var html="";
                    var Li="";
                    $.each(data.data,function(i,item){
                        $.each(item.picture_path,function(i,item){
                            Li+=`
                               <li class="lf">
                                    <img src="http://wx.junxiang.ren/project/${item[0]}" alt="" class="addPic">
                               </li>
                            `
                        });
                        html+=`
                        <div class="weui-panel weui-panel_access">
                            <div class="weui-panel__bd">
                                <div  class="weui-media-box weui-media-box_appmsg" >
                                    <div class="weui-media-box__hd">
                                        <img class="weui-media-box__thumb" src="image/frihead.jpg" style="border-radius: 50px">
                                    </div>
                                    <div class="weui-media-box__bd" >
                                        <h4 class="weui-media-box__title" style="font-size: 14px;">${item.user_code}</h4>
                                        <button class="right delBtn" title="${item.id}">删除</button>
                                        <span class="weui-media-box__desc" style="font-size: 12px">${item.create_time}</span>
                                    </div>
                                </div>
                                <p style="font-size: 13px;padding: 0 5px"></p>
                                <ul class="img">
                                  <!--<li class="lf">-->
                                       <!--<img src="image/firendb.jpg" alt="" class="addPic">-->
                                  <!--</li>-->
                                </ul>
                            </div>
                        </div>
                        `;
                    });
                    $(".img").append(Li);
                    $("#flockPhoto").append(html);
                }
            }
        })

    };photo();
    //上传图片
    $('#uploaderInput').change(function() {
        var fileId = $(this).attr("id");
         var t_files = this.files;
                var imglength =  $("#view_" + fileId).parent().parent().find(".upload-img").length;
                 if (imglength==1) {
                        if (t_files.length > 5) {
                                 new Message().showMsg("最多选择五张图片");
                                 return false;
                           } else if (t_files.length < 1) {
                               new Message().showMsg("至少选择一张图片");
                             return false;
                             }
                    }else if(t_files.length+imglength>6) {
                         new Message().showMsg('最多再选择'+ (6-parseInt(imglength)) +'张图片');
                          return false;
                    }
                 var formData = new FormData();
                  for (var i=0;i<t_files.length;i++){
                     formData.append('file',t_files[i]);
                      formData.append('randomCode',fileId+i);
                      formData.append('upDir','comment')
                      }
        var Url=window.URL.createObjectURL(this.files[0]);
        console.log(Url);
       // var formData= new FormData();
        var apptoken=localStorage.getItem("apptoken");
        var group_num=localStorage.getItem("group_num");
       // formData.append("file",$("#uploaderInput")[0].files[0]);
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
                    // var LiImg=`
                    //   <li class="weui-uploader__file img1" ><img style="height: 77px;width: 77px" class="img" src="${Url}" alt=""/></li>
                    // `;
                    // $("#uploaderFiles").append(LiImg);
                    photo()
                }
            },
            error:function (data) {
                console.log(data);
            }
        });
    });

    //删除群相册
    $("#flockPhoto").on("click",".delBtn",function(){
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
                        photo();
                    }else{
                        console.log(data.errmsg);
                    }
                }

            })
        }





    })
});