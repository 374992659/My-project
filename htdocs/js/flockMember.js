$(document).ready(function(){
    var group_header=localStorage.getItem("group_header"),
        // 获取apptoken
        apptoken=localStorage.getItem("apptoken"),
        // 获取群号码
        group_num=localStorage.getItem("group_num"),
        // 数据格式转换
        data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num})],
        // 加密
        jsonEncryptData=jsEncryptData(data);
        console.log(data);
    $.ajax({
        url:url+"group_getGroupUser",
        type:"POST",
        data:{"data":jsonEncryptData},
        success:function(data){
            //解密
            var data=jsDecodeData(data);
            var member=data.data.Number_data;
            console.log(data);
            var memberHtml="";
            var memberNum=0;
            var manageHtml="";
            var manegeNum=0;
            if(data.errcode===0){
                localStorage.setItem("apptoken",data.apptoken);
                $.each(member,function(i,item){
                    console.log(item);
                    if(parseInt(item.role)===3){
                        var httP=item.portrait.split(":")[0];
                        var portrait="";
                        if(httP==="http"){
                            portrait=item.portrait;
                        }else{
                            portrait="http://wx.junxiang.ren/project/"+item.portrait
                        }
                        memberHtml+=`
    <div class="weui-cell weui-cell_swiped">
        <div class="weui-cell__bd">
            <div class="weui-cell">
                <div class="weui-cell__hd"><img src="${portrait}" alt="" style="width:40px;height:40px;margin-right:5px;display:block"></div>
                <div class="weui-cell__bd">
                    <p>${item.nickname}</p>
                </div>
            </div>
        </div>
        <div class="weui-cell__ft">
            <button class="weui-swiped-btn weui-swiped-btn_warn delete-swipeout"  title="${item.user_code}" style="">删除</button>
        </div>
    </div>
                      
                        `;
                        memberNum++
                    }else if(parseInt(item.role)===2){
                        var httPs=item.portrait.split(":")[0];
                        var portraits="";
                        if(httPs==="http"){
                            portraits=item.portrait;
                        }else{
                            portraits="http://wx.junxiang.ren/project/"+item.portrait
                        }
                        manageHtml+=`
                 <div class="weui-cell weui-cell_swiped">
        <div class="weui-cell__bd">
            <div class="weui-cell">
                <div class="weui-cell__hd"><img src="${portraits}" alt="" style="width:40px;height:40px;margin-right:5px;display:block"></div>
                <div class="weui-cell__bd">
                    <p>${item.nickname}</p>
                </div>
            </div>
        </div>
        <div class="weui-cell__ft">
            <button class="weui-swiped-btn weui-swiped-btn_warn delete-swipeout" title="${item.user_code}"  style="">删除</button>
        </div>
    </div>
                        `;
                        manegeNum++
                    }else{
                        var httPs=item.portrait.split(":")[0];
                        var portraits="";
                        if(httPs==="http"){
                            portraits=item.portrait;
                        }else{
                            portraits="http://wx.junxiang.ren/project/"+item.portrait
                        }
                        manageHtml+=`
                            <div class="weui-cell">
                                <div class="weui-cell__bd">
                                    <div class="weui-cell" style="padding: 0">
                                        <div class="weui-cell__hd"><img src="${portraits}" alt=""  title="${item.user_code}" style="width:40px;height:40px;margin-right:5px;display:block"></div>
                                        <div class="weui-cell__bd">
                                            <p>${item.nickname}</p>
                                        </div>
                                        </div>
                                 </div>
      
                            </div>
                        `;
                        manegeNum++
                    }

                });
                $(".manage").html(manageHtml);
                $(".member").html(memberHtml);
                $(".memberNum").html((memberNum));
                $(".manageNum").html(manegeNum);
                $('.weui-cell_swiped').swipeout();
            }
        },
        error:function(){}
    });
    $(".manage").on("click",".weui-media-box",function(){
        //获取user_code
        var user_code=$(this).attr("title");
        //nickname
        var nickname=$(this).val();

    });
    $(".member").on("click",".weui-media-box",function(){
        //获取user_code
        var user_code=$(this).attr("title");
        //nickname
        var nickname=$(this).val();

    });
    //删除群成员
    $(".member").on("click",".weui-cell_swiped .weui-cell__ft .weui-swiped-btn",function(){
        // group_num群号码
        var group_num=localStorage.getItem("apptoken");
        // 参数：user_code 被移出用户code
        var user_code=$(this).attr("title");
        //apptoken
        var apptoken=localStorage.getItem("apptoken");
        //数据格式转换
        if(confirm("删除群成员")){
            var data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num,"user_code":user_code})];
            // 加密
            var jsonEncryptData=jsEncryptData(data);
            $.ajax({
                url:url+"group_delGroupNum",
                type:"POST",
                data:{"data":jsonEncryptData},
                success:function(data){
                    console.log(data);
                    //解密
                    var data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        localStorage.setItem("apptoken",data.apptoken)

                    }
                }
            })
        }


    })
});