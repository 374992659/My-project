$(document).ready(function(){
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    // 数据格式转换
    var data=["",JSON.stringify({"apptoken":apptoken})];
    // 加密
    var jsonEncryptData=jsEncryptData(data);
    console.log(data);
    $.ajax({
        url:url+"UserCenter_getGardenMessageList",
        type:"POST",
        data:{"data":jsonEncryptData},
        success:function(data){
            // 解密
            var data=jsDecodeData(data);
            console.log(data);
            if(data.errcode===0){
                localStorage.setItem("apptoken",data.apptoken);
                var html="";
                $.each(data.data,function(i,item){
                    console.log(item);
                    if(parseInt(item.status)===1){
                        console.log(1);
                        html+=`
                <div  class="weui-media-box weui-media-box_appmsg" title="${item.id}" value="${item.garden_code}">
                    <div class="weui-media-box__bd">
                        <span style="float: right;color: green;font-size: 14px">时间：${item.create_time}</span>
                        <h4 class="weui-media-box__title">${item.title}</h4>
                        <p style="font-size: 14px;" class="weui-media-box__desc">
                           ${item.content}
                        </p>
                        <span class="right" style="margin-top: 10px;color: red">暂未受理</span>
                    </div>
                </div>
                        
                        `
                    }else if(item.status===2){
                        html+=`
                <div  class="weui-media-box weui-media-box_appmsg" title="${item.id}" value="${item.garden_code}">
                    <div class="weui-media-box__bd">
                        <span style="float: right;color: green;font-size: 14px">时间：${item.create_time}</span>
                        <h4 class="weui-media-box__title">${item.title}</h4>
                        <p style="font-size: 14px;" class="weui-media-box__desc">
                           ${item.content}
                        </p>
                        <span class="right" style="margin-top: 10px;color: red">正在处理</span>
                    </div>
                </div>
                        
                        `
                    }else if(item.status===3){
                        html+=`
                <div  class="weui-media-box weui-media-box_appmsg" title="${item.id}" value="${item.garden_code}">
                    <div class="weui-media-box__bd">
                        <span style="float: right;color: green;font-size: 14px">时间：${item.create_time}</span>
                        <h4 class="weui-media-box__title">${item.title}</h4>
                        <p style="font-size: 14px;" class="weui-media-box__desc">
                            ${item.content}
                        </p>
                        <span class="right" style="margin-top: 10px;color: red">已采纳</span>
                    </div>
                </div>
                        
                        `
                    }else if(item.status===4){
                        html+=`
                <div  class="weui-media-box weui-media-box_appmsg" title="${item.id}" value="${item.garden_code}">
                    <div class="weui-media-box__bd">
                        <span style="float: right;color: green;font-size: 14px">时间：${item.create_time}</span>
                        <h4 class="weui-media-box__title">${item.title}</h4>
                        <p style="font-size: 14px;" class="weui-media-box__desc">
                            ${item.content}
                        </p>
                        <span class="right" style="margin-top: 10px;color: red">意见驳回</span>
                    </div>
                </div>
                        
                        `
                    }else if(item.status===5){
                        html+=`
                <div  class="weui-media-box weui-media-box_appmsg" title="${item.id}" value="${item.garden_code}">
                    <div class="weui-media-box__bd">
                        <span style="float: right;color: green;font-size: 14px">时间：${item.create_time}</span>
                        <h4 class="weui-media-box__title">${item.title}</h4>
                        <p style="font-size: 14px;" class="weui-media-box__desc">
                            ${item.content}
                        </p>
                        <span class="right" style="margin-top: 10px;color: green">已解决</span>
                    </div>
                </div>
                        
                        `
                    }
                })
            }
            $(".ideaBoxList").html(html);
        },
        error:function(){}
    });
    // 绑定点击事件获取详情页面需要的参数
    $(".ideaBoxList").on("click",".weui-media-box",function(){
        // 获取意见id
        var id=$(this).attr("title");
        // 获取garden_code 小区code
        var code=$(this).attr("value");
        localStorage.setItem("ideaBoxID",id);
        localStorage.setItem("ideaBoxGarden_code",code);
        if(id&&code){
            window.location.href="ideaContent.html";//跳转到详情页面
        }
    })
});