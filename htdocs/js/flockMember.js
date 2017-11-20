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
                <div  class="weui-media-box weui-media-box_appmsg weui-cell weui-cell_swiped" title="${item.user_code}" value="${item.nickname}">
                    <div class="weui-media-box__hd">
                      <img class="weui-media-box__thumb" src="${portrait}" alt="">
                    </div>
                    <div class="weui-media-box__bd">
                      <h4 class="weui-media-box__title">${item.nickname}</h4>

                    </div>
                    <div class="weui-cell__ft">
                        <a class="weui-swiped-btn weui-swiped-btn_warn delete-swipeout" href="javascript:">删除</a>
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
                 <div  class="weui-media-box weui-media-box_appmsg weui-cell weui-cell_swiped" title="${item.user_code}" value="${item.nickname}">
                    <div class="weui-media-box__hd">
                      <img class="weui-media-box__thumb" src="${portraits}" alt="">
                    </div>
                    <div class="weui-media-box__bd">
                      <h4 class="weui-media-box__title">${item.nickname}</h4>

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
                 <div  class="weui-media-box weui-media-box_appmsg" title="${item.user_code}" value="${item.nickname}">
                    <div class="weui-media-box__hd">
                      <img class="weui-media-box__thumb" src="${portraits}" alt="">
                    </div>
                    <div class="weui-media-box__bd">
                      <h4 class="weui-media-box__title">${item.nickname}</h4>

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
    $('.weui-cell_swiped').swipeout();

});