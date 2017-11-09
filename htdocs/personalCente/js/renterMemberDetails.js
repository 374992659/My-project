$(document).ready(function(){
    //apptoken
    var apptoken=localStorage.getItem("apptoken");
    // 参数：application_id 认证id
    var application_id=localStorage.getItem("application_id");
    // 参数：city_id 城市id
    var city_id=localStorage.getItem("renterCity_id");
    // 数据格式转换
    var data=["",JSON.stringify({"apptoken":apptoken,"application_id":application_id,"city_id":city_id})];
    // 加密
    var jsonEncryptData=jsEncryptData(data);
    console.log(data);
    $.ajax({
        url:url+"UserCenter_getTenantNumInfo",
        type:"POST",
        data:{"data":jsonEncryptData},
        success:function(data){
            // 解密
            var data=jsDecodeData(data);
            console.log(data);
            var result=data.data;
            if(data.errcode===0){
                localStorage.setItem("apptoken",data.apptoken);
                var html=`
                 <!--姓名-->
                    <div class="weui-cells">
                        <div class="weui-cell">
                            <div class="weui-cell__bd">
                                <label class="left">名字：</label>
                                <span>${result.real_name}</span>
                            </div>
                        </div>
                    </div>
                    <!--电话-->
                    <div class="weui-cells">
                        <div class="weui-cell">
                            <div class="weui-cell__bd">
                                <label class="left">电话：</label>
                                <span>${result.phone}</span>
                            </div>
                        </div>
                    </div>
                    <!--房号-->
                    <div class="weui-cells">
                        <div class="weui-cell">
                            <div class="weui-cell__bd">
                                <label class="left">房号：</label>
                                <span>${result.room_num}</span>
                            </div>
                        </div>
                    </div>
                    <!--关系-->
                    <div class="weui-cells">
                        <div class="weui-cell">
                            <div class="weui-cell__bd">
                                <label class="left">关系：</label>
                                <span class="relation">${result.relation_name}</span>
                            </div>
                        </div>
                    </div>
                    <!--小区名-->
                    <div class="weui-cells">
                        <div class="weui-cell">
                            <div class="weui-cell__bd">
                                <label class="left">小区名：</label>
                                <span>${result.garden_name}</span>
                            </div>
                        </div>
                    </div>
                    <!--小区地址-->
                    <div class="weui-cells">
                        <div class="weui-cell">
                            <div class="weui-cell__bd">
                                <label class="left">小区地址：</label>
                                <span class="garden_addr">${result.garden_addr}</span>
                            </div>
                        </div>
                    </div>
                    <!--身份证-->
                    <div class="weui-cells">
                        <div class="weui-cell">
                            <div class="weui-cell__bd">
                                <label class="left">身份证：</label>
                                <span>${result.id_card_num}</span>
                            </div>
                        </div>
                    </div>
                    <!--门禁二维码-->
                    <div class="weui-cells">
                        <div class="weui-cell">
                            <div class="weui-cell__bd">
                                <label class="left" style="vertical-align: top">门禁二维码：</label>
                                <img src="image/firenda.jpg" alt="" style="width: 59%;" >
                            </div>
                        </div>
                    </div>
                    <!--证件照-->
                    <div class="weui-cells">
                        <div class="weui-cell">
                            <div class="weui-cell__bd papersPic">
                                <label class="left" style="vertical-align: top">证件照：</label>
                                
                            </div>
                        </div>
                    </div>
                    <!--小区照片-->
                     <div class="weui-cells">
                        <div class="weui-cell">
                            <div class="weui-cell__bd">
                                <label class="left" style="vertical-align: top">小区照片：</label>
                                <div class="likes gardenPic">
                                   
                                </div>
                            </div>
                        </div>
                    </div>       
                    <!--个人照片-->
                    <div class="weui-cells">
                        <div class="weui-cell">
                            <div class="weui-cell__bd">
                                <label class="left" style="vertical-align: top">个人照片：</label>
                                <div class="likes myPic">
                                    <img src="image/firenda.jpg" alt="" >
                                    <img src="image/firenda.jpg" alt="" >
                                    <img src="image/firenda.jpg" alt="" >
                                    <img src="image/firenda.jpg" alt="" >
                                </div>
                            </div>
                        </div>
                    </div>                             
                `;
                $(".memberDetails").html(html);
                // 身份证照片
                var id_cardPic="";
                var id_cardPicObj=eval('('+result.id_card_pictures+')');
                if(id_cardPicObj){
                    $.each(id_cardPicObj,function(i,item){
                        id_cardPic+=`
                         <img src="http://wx.junxiang.ren/project/${item}" alt="" >
                        `
                    });
                }$(".papersPic").append(id_cardPic);
                // 个人照片
                var myPic="";
                var myPicObj=eval('('+result.yourself_picture+')');
                if(myPicObj){
                    $.each(myPicObj,function(i,item){
                        myPic+=`
                     <img src="${item}" alt="" >
                    `
                    });
                }$(".myPic").append(myPic);
                //   小区照片
                var gardenPic="";
                var gardenPicObj=eval('('+ result.garden_picture+')');
                if(gardenPicObj){
                    $.each(gardenPicObj,function(i,item){
                        gardenPic+=`
                     <img src="${item}" alt="" >
                    
                    `
                    })
                }$(".gardenPic").append(gardenPic);
                if(result.relation_name===null){
                    $(".relation").html("本人")
                }
                if(result.garden_addr==="null"){
                    $(".garden_addr").html("主人太懒什么都没有留下");
                }
            }
        },
        error:function(){}
    })

});
