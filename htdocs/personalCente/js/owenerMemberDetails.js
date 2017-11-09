$(document).ready(function(){
    // 获取 1 apptoken
    var apptoken=localStorage.getItem("apptoken");
    // 参数 2 application_id 认证id
    var application_id=localStorage.getItem("application_id");
    // 参数 3 city_id 城市id
    var city_id=localStorage.getItem("personalCity_id");
    // 数据格式转换
    var data=["",JSON.stringify({"apptoken":apptoken,"application_id":application_id,"city_id":city_id})];
    // 加密
    var jsonEncryptData=jsEncryptData(data);
    console.log(data);
    $.ajax({
        url:url+"UserCenter_getMyOwnNumInfo",
        type:"POST",
        data:{"data":jsonEncryptData},
        success:function(data){
            // 解密
            var data=jsDecodeData(data);
            console.log(data);
            if(data.errcode===0){
                localStorage.setItem("apptoken",data.apptoken);
                var result=data.data;
              var  html=`
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
                        <img src="image/firenda.jpg" alt="" >
                        <img src="image/firenda.jpg" alt="" >
                </div>
            </div>
        </div>
        <!--个人照片-->
        <div class="weui-cells">
            <div class="weui-cell">
                <div class="weui-cell__bd myPic">
                    <label class="left" style="vertical-align: top">个人照片：</label>
                    <div class="likes">
                        <img src="image/firenda.jpg" alt="" >
                        <img src="image/firenda.jpg" alt="" >
                        <img src="image/firenda.jpg" alt="" >
                        <img src="image/firenda.jpg" alt="" >
                    </div>
                </div>
            </div>
        </div>
                
                `;
              $(".RenZdetails").html(html);
              if(result.relation_name===null){
                  $(".relation").html("本人")
              }
              if(result.garden_addr===null){
                  $(".garden_addr").html("主人太懒什么都没有留下");
              }
            }
        },
        error:function(){}
    })
});