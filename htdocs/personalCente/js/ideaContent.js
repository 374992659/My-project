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
                var result=data.data;
                var pic="";
                if(parseInt(result.status)===1){
                    //添加图片
                    if(result.picture){
                        var ideaPic=JSON.parse(result.picture);
                        $.each(ideaPic,function (i,item) {
                            pic+=`
                                <li><<img src="${item.pic}" alt="">></li>
                           
                            `
                        })
                    }
                    var   html=`
            <h3 class="weui-media-box__title" style="text-align: center;font-weight:bold ">${result.title}</h3>
            <ul class="ideaPic">
                
            </ul>
            <p class="weui-media-box__desc">
                ${result.content}
            </p>
            <ul class="right">
                <li class=""><span style="color:red;">你的意见正在解决</span></li>
                <li class="">处理人：<span>${result.nickname}</span></li>
                <li class="">联系方式：<span>${result.dealer_phone}</span></li>
            </ul>
                    
                    `;
                }else{
                    var   html=`
            <h4 class="weui-media-box__title" style="text-align: center">${result.title}</h4>
            <p class="weui-media-box__desc">
                ${result.content}
            </p>
            <ul class="right">
                <li class=""><span style="color:green;">你的意见已经解决</span></li>
                <li class="">处理人：<span>${result.dealer_name}</span></li>
                <li class="">联系方式：<span>${result.dealer_phone}</span></li>
            </ul>
                    
                    `;
                }
                $(".ideaContent").html(html);
                $(".ideaPic").html(pic);
            }
        },
        error:function () {

        }
    })
});