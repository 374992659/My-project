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
                    if(item.role===3){
                        var httP=item.portrait.split(":")[0];
                        var portrait="";
                        if(httP==="http"){
                            portrait=item.portrait;
                        }else{
                            portrait="http://wx.junxiang.ren/project/"+item.portrait
                        }
                        memberHtml+=`
                <div  class="weui-media-box weui-media-box_appmsg">
                    <div class="weui-media-box__hd">
                      <img class="weui-media-box__thumb" src="${portrait}" alt="">
                    </div>
                    <div class="weui-media-box__bd">
                      <h4 class="weui-media-box__title">${item.nickname}</h4>

                    </div>
                </div>
                       
                        `;
                        memberNum++
                    }else{
                        var httPs=item.portrait.split(":")[0];
                        var portraits="";
                        if(httPs==="http"){
                            portrait=item.portrait;
                        }else{
                            portrait="http://wx.junxiang.ren/project/"+item.portrait
                        }
                        manageHtml+=`
                 <div  class="weui-media-box weui-media-box_appmsg">
                    <div class="weui-media-box__hd">
                      <img class="weui-media-box__thumb" src="${portrait}" alt="">
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
                $(".memberNum").html(memberNum);
                $(".manegeNum").html(manegeNum);
            }
        },
        error:function(){}
    })

});