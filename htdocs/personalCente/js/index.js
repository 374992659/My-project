$(document).ready(function(){
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    // 签到
    $("")
    // 进入页面请求接口加载页面如果没人有登录跳转到登录页面
    (function(){
        // 数据格式转换
        var data=["",JSON.stringify({"apptoken":apptoken})],
            // 加密
            jsonEncryptData=jsEncryptData(data);
        console.log(data);
        console.log(jsonEncryptData);
        $.ajax({
            url:url+"UserCenter_getMyInfo",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                // 解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    var result=data.data;
                    localStorage.setItem("apptoken",data.apptoken);
                    localStorage.setItem("account",result.account);
                  var  html=`        
                        <div class="weui-panel weui-panel_access">
                            <div class="weui-panel__bd">
                                <div class="weui-media-box weui-media-box_appmsg">
                                    <div class="weui-media-box__hd">
                                        <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${result.portrait}">
                                    </div>
                                    <div class="weui-media-box__bd">
                                        <a href="myData.html" style="float: right;color:green">完善个人资料</a>
                                        <div style="clear: both"></div>
                                        <h4 class="weui-media-box__title">昵称：<span>${result.nickname}</span> </h4>
                                        <h4 class="weui-media-box__title">账号：<span>${result.account}</span></h4>
                                        <h4 class="weui-media-box__title">积分：
                                            <span>${result.total_point}</span>
                                            <a href="checkIntegral.html" style="color: green">查看</a>
                                            <a>兑换</a>
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>                      
                        <div class="weui-cells">
                            <div class="weui-cell">
                                <div class="weui-cell__bd">
                                    <label class="left">名字：</label>
                                    <span>${result.realname}</span>
                                    <a href="myTeam.html" style="float: right;color: green">我的团队</a>
                                </div>
                            </div>
                        </div>                       
                        <div class="weui-cells">
                            <div class="weui-cell">
                                <div class="weui-cell__bd">
                                    <label class="left">电话：</label>
                                    <span>${result.phone}</span>
                                </div>
                            </div>
                        </div>                      
                        <div class="weui-cells">
                            <div class="weui-cell">
                                <div class="weui-cell__bd">
                                    <label class="left">微信：</label>
                                    <span>${result.wechat_num}</span>
                                </div>
                            </div>
                        </div>                     
                        <div class="weui-cells">
                            <div class="weui-cell">
                                <div class="weui-cell__bd">
                                    <label class="left">QQ：</label>
                                    <span>${result.qq_num}</span>
                                </div>
                            </div>
                        </div>                    
                        <div class="weui-cells">
                            <div class="weui-cell">
                                <div class="weui-cell__bd">
                                    <label class="left" style="vertical-align: top">喜好：</label>
                                    <ul class="likes">
                                      <li>${result.hobby}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>                     
                        <div class="weui-cells">
                            <div class="weui-cell">
                                <div class="weui-cell__bd">
                                    <label class="left">常住小区：</label>
                                    <span>${result.default_garden}</span>
                                </div>
                            </div>
                        </div>                     
                        <div class="weui-cells">
                            <div class="weui-cell">
                                <div class="weui-cell__bd">
                                    <label class="left">出生年月：</label>
                                    <span>${result.birth_year}${result.birth_month}</span>
                                </div>
                            </div>
                        </div>                   
                        <div class="weui-cells">
                            <div class="weui-cell">
                                <div class="weui-cell__bd">
                                    <label class="left" style="vertical-align: top">拥有楼盘：</label>
                                    <ul class="likes ownerPlot">
                                       
                                        
                                    </ul>
                                </div>
                            </div>
                        </div>                     
                        <div class="weui-cells">
                            <div class="weui-cell">
                                <div class="weui-cell__bd">
                                    <label class="left">律师援助：</label>
                                    <a>了解费用</a>
                                    <a>律师团队</a>
                                </div>
                            </div>
                        </div>                    
                        <div class="weui-cells">
                            <div class="weui-cell">
                                <div class="weui-cell__bd">
                                    <label class="left">注册时间：</label>
                                    <span class="time">${result.create_time}</span>
                                </div>
                            </div>
                        </div>                            
                    `;
                  $(".personal").html(html);
                  // 遍历认证楼盘
                    var RenZplot="";
                    if(result.user_garden){
                    $.each(result.user_garden,function(i,item){
                        RenZplot+=`
                         <li>${item.garden_name}</li>
                        `
                        })
                    }
                    $(".ownerPlot").append(RenZplot);
                    // 获取时间戳在转成时间
                    var times=$(".time"),
                        time= times.text(),
                        a=getLocalTime(time);
                        times.html(a);

                }else{
                     window.location.href="http://wx.junxiang.ren/project/htdocs/landing.html"
                }
            },
            error:function(){}
        })
    })();
    // 验证手机号
    // 验证身份证号
    $(".Identity").blur(function(){
        // 获取身份证号
        var Identity_code=$(this).val();
        if(!(/^d{15}|d{}18$/.test(Identity_code))){
             alert("身份证有误，请重填");
            return false;
        }
    });
});