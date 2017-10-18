$(document).ready(function(){
    //上传图片跳转
    $(".pushPic").click(function(){
            window.location.href="flockPhpto_push.html";
    });
    //向页面添加数据
    //自调函数
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
                                    <img src="http://wx.junxiang.ren/project/${item}" alt="" class="addPic">
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
                                  <li class="lf">
                                       <img src="image/firendb.jpg" alt="" class="addPic">
                                  </li>
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
                        photo()
                    }else{
                        console.log(data.errmsg);
                    }
                }

            })
        }





    })
});