$(document).ready(function(){
    //apptoken
    var apptoken=localStorage.getItem("apptoken");
    // 参数：id 意见id
    var id=localStorage.getItem("ideaBoxID");
    // 参数：garden_code 小区code
    var garden_code=localStorage.getItem("ideaBoxGarden_code");
    // 数据格式转换
    var data=["",JSON.stringify({"apptoken":apptoken,"id":id,"garden_code":garden_code})];
    // 数据加密
    var jsonEncryptData=jsEncryptData(data);
    console.log(data);
    $.ajax({
        url:url+"UserCenter_getGardenMessageInfo",
        type:"POST",
        data:{"data":jsonEncryptData},
        success:function(data){
            console.log(data);
            // 解密
            var data=jsDecodeData(data);
            console.log(data);
            if(data.errcode===0){
                localStorage.setItem("apptoken",data.apptoken);
                var html="";
                $.each(data.data,function(i,item){
                    console.log(item);
                        html=`
                    <h4 class="weui-media-box__title" style="text-align: center">${item.title}</h4>
            <p class="weui-media-box__desc">
                ${item.content}
            </p>
            <ul class="right">
                <li class=""><span style="color:red;;">你的意见正在解决</span></li>
                <li class="">处理人：<span>${item.dealer_name}</span></li>
                <li class="">联系方式：<span>${item.dealer_phone}</span></li>
            </ul>
                    
                    `
                });
                $(".ideaContent").html(html)
            }
        },
        error:function () {

        }
    })
});