$(document).ready(function(){
    //获取群号码
    var code="";
    //上传图片
    $("#file_input").change(function(e){
        var targetElement = e.target,
            file = targetElement.files[0],
            url=window.URL.createObjectURL(this.files[0]) ;
        var photoAlbum = new FormData();
        photoAlbum.append('fileToUpload', file);
        if(url){
                localStorage.setItem("photoUrl",url);
            window.location.href="flockPhpto_push.html";
        }

    });
    //向页面添加数据
    //自调函数
    var photo=function(){
        //获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        //转换数据格式
        data=["",JSON.stringify({"group_num":code,"apptoken":apptoken})];
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
                    $.each(data.data,function(i,item){
                        var Li="";
                        var img=item.picture_path;
                        $.each(img,function(){
                           Li+=`
                               <li class="lf">
                                    <img src="${this}" alt="" class="addPic">
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
                                        <button class="right delBtn" tiltle="${item.id}">删除</button>
                                        <span class="weui-media-box__desc" style="font-size: 12px">${item.create_time}</span>
                                    </div>
                                </div>
                                <ul class="img">
                                //    <li class="lf">
                                //        <img src="image/firendb.jpg" alt="" class="addPic">
                                //    </li>
                                </ul>
                            </div>
                        </div>
                        `
                        $(".img").append(Li);
                    });
                    $("#flockPhoto").append(html);
                }
            }
        })

    };photo();
    //删除群相册
    $("#flockPhoto").on("click",".delBtn",function(){
        var affirm=confirm("删除公告");
        if(affirm===ture){
            //获取apptoken
            var apptoken=localStorage.getItem("apptoken");
            //获取相册编号
            var PhotoCode=$(this).attr("title");
            //数据格式转换
            data=["",JSON.stringify({"apptoken":apptoken,"picture_id":PhotoCode,"group_num":code})];
            //数据加密
            josnEncyptData=jsEncryptData(data);
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
                        window.location.reload();
                    }else{
                        console.log(data.errmsg);
                    }
                }

            })
        }





    })
});