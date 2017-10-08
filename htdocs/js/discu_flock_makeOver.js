$(document).ready(function(){
    //获取群号码
    var code="";
    //获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    //数据格式转换
    data=["",JSON.stringify({"group_num":code,"apptoken":apptoken})];
    //数据加密
    $.ajax({
        url:url+"group_getGroupUser",
        type:"POST",
        data:{"data":data},
        success:function(data){
            //解密数据
            data=jsDecodeData(data);
            console.log(data);
            if(data.errcode===0){
                localStorage.setItem("apptoken",data.apptoken);
                var htmlAdministrator="";
                var htmlMember="";
                $.each(data.data,function(i,item){
                    if(item.role==1||item.role==2){
                        htmlAdministrator+=`
                    <div class="weui-cells weui-cells_checkbox" title="${item.user_code}">
                         <label class="weui-cell weui-check__label" for="s1">
                            <div class="weui-cell__hd">
                                <input type="checkbox" class="weui-check" name="checkbox1" id="s1" value="${item.usere_code}">
                                <i class="weui-icon-checked"></i>
                            </div>
                            <div class="weui-cell__bd">
                                <div class="weui-panel__bd">
                                    <div  class="weui-media-box weui-media-box_appmsg">
                                        <div class="weui-media-box__hd">
                                            <img class="weui-media-box__thumb" src="${item.portrait}">
                                        </div>
                                        <div class="weui-media-box__bd">
                                            <h4 class="weui-media-box__title">${item.nicename}</h4>
                                            <p class="weui-media-box__desc">由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                         </label>
                    </div>
                        `
                    }else{
                        htmlMember+=`
                    <div class="weui-cells weui-cells_checkbox" title="${item.user_code}">
                        <label class="weui-cell weui-check__label" for="s1">
                            <div class="weui-cell__hd">
                                <input type="checkbox" class="weui-check" name="checkbox1" id="s1" value="${item.user_code}">
                                <i class="weui-icon-checked"></i>
                            </div>
                            <div class="weui-cell__bd">
                                <div class="weui-panel__bd">
                                    <div  class="weui-media-box weui-media-box_appmsg">
                                        <div class="weui-media-box__hd">
                                            <img class="weui-media-box__thumb" src="${item.portrait}">
                                        </div>
                                        <div class="weui-media-box__bd">
                                            <h4 class="weui-media-box__title">${item.nicename}</h4>
                                            <p class="weui-media-box__desc">由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </label>
                    </div>
                        `
                    }
                });
                $(".administrator").html(htmlAdministrator);
                $(".member").html(htmlMember);
            }
        }

    });


    $(".LinkBtn").click(function(){
        console.log($(this));
        if($(this).next().is(":hidden")){
            $(this).next().show();
            $(this).children(".weui-cell__hd").children("img").css("transform","rotate(90deg)");
        }else{
            $(this).next().hide();
            $(this).children(".weui-cell__hd").children("img").removeAttr("style")
        }
    });
    //群转让提交
    //获取用户code
    var title=$('input:radio:checked').val();
});