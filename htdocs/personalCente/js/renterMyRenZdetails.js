$(document).ready(function(){
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    // 获取id
    var id=localStorage.getItem("renterID");
    // 数据格式转换
    var data=["",JSON.stringify({"apptoken":apptoken})];
    // 加密
    var jsonEncryptData=jsEncryptData(data);
    console.log(data);
    $.ajax({
        url:url+"UserCenter_getMyTenantApplicationInfo",
        type:"POST",
        data:{"data":jsonEncryptData},
        success:function(data){
            // 解密
            var data=jsDecodeData(data);
            console.log(data);
            if(data.errcode===0){
                localStorage.setItem("apptoken",data.apptoken);
                $.each(data.data,function(i,item){
                    console.log(item);
                    if(item.id===id){
                        var html=`
                    <!--姓名-->
    <div class="weui-cells">
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <label class="left">名字：</label>
                <span>${item.real_name}</span>
            </div>
        </div>
    </div>
    <!--电话-->
    <div class="weui-cells">
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <label class="left">电话：</label>
                <span>${item.phone}</span>
            </div>
        </div>
    </div>
    <!--房号-->
    <div class="weui-cells">
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <label class="left">房号：</label>
                <span>${item.room_num}</span>
            </div>
        </div>
    </div>
    <!--关系-->
    <div class="weui-cells">
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <label class="left">关系：</label>
                <span>${item.relation_name}</span>
            </div>
        </div>
    </div>
    <!--小区名-->
    <div class="weui-cells">
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <label class="left">小区名：</label>
                <span>${item.garden_name}</span>
            </div>
        </div>
    </div>
    <!--小区地址-->
    <div class="weui-cells">
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <label class="left">小区地址：</label>
                <span>${item.garden_addr}</span>
            </div>
        </div>
    </div>
    <!--身份证-->
    <div class="weui-cells">
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <label class="left">身份证：</label>
                <span>${item.id_card_num}</span>
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
                <!--<img src="image/firenda.jpg" alt="" >-->
                <!--<img src="image/firenda.jpg" alt="" >-->
        </div>
        </div>
    </div>
    <!--个人照片-->
    <div class="weui-cells">
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <label class="left" style="vertical-align: top">个人照片：</label>
                <div class="likes  myPic">
                    <!--<img src="image/firenda.jpg" alt="" >-->
                    <!--<img src="image/firenda.jpg" alt="" >-->
                    <!--<img src="image/firenda.jpg" alt="" >-->
                    <!--<img src="image/firenda.jpg" alt="" >-->
            </div>
        </div>
        </div>
    </div>                                                       
                   `;
                        // 循环证件照
                        var id_card_pictures="";
                        if(item.id_card_pictures){
                            var obj = eval('(' + item.id_card_pictures + ')');
                            $.each(obj,function(i,item){
                                id_card_pictures+=`
                              <img src="${item}" alt="" >
                              `
                            });
                        }
                        //循环个人照片
                        var gardenPic="";
                        if(item.yourself_picture){
                            var gardenPicObj=eval('('+item.yourself_picture +')');
                            $.each(gardenPicObj,function(i,item){
                                gardenPic+=`
                                 <img src="${item}" alt="" >
                                `
                            })
                        }

                    }
                    $(".RenZdetails").html(html);
                    $(".papersPic").append(id_card_pictures);
                    $(".myPic").append(gardenPic);
                });
            }
        },
        error:function () {

        }
    })
});