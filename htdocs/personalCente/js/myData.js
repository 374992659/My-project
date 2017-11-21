$(document).ready(function(){
    //获取个人资料
    (function(){
        var apptoken=localStorage.getItem("apptoken");
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
                //解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    var result=data.data;
                    var header=result.portrait;
                    var httP=header.split(":")[0];
                    var pic="";
                    if(httP==="http"){
                        pic=header;
                    }else{
                        pic="http://wx.junxiang.ren/project/"+header
                    }
                    console.log(pic);
                  var   html=`                
            <div class="weui-panel weui-panel_access">
                <div class="weui-panel__bd">
                    <div class="weui-media-box weui-media-box_appmsg">
                        <div class="weui-media-box__hd">
                            <div class="weui-cells weui-cells_form">
                                <div class="weui-uploader__input-box loader">
                                    <form action="" id="form" enctype="multipart/form-data">
                                        <input id="uploaderInput" name="uploaderInput" class="weui-uploader__input" type="file">
                                    </form>
                                </div>
                                <div class="flockHead" style="position: absolute;top:1px;left: 1px">
                                    <img src="${pic}" alt="" style="width: 68px;height: 68px" >
                                </div>
                            </div>
                        </div>
                        <div class="weui-media-box__bd">
                            <button  class="finishBtn" style="float: right;background: white;border: none;font-size: 18px;color: green">完成</button>
                            <h4 class="weui-media-box__title">昵称：
                                <input type="text" id="nickname" placeholder="" autofocus="autofocus" style="border: none" value="${result.nickname}">
                            </h4>
                            <h4 class="weui-media-box__title ">账号：<span class="account">${result.account}</span></h4>
                        </div>
                    </div>
                </div>
            </div>
            <!--姓名-->
            <div class="weui-cells">
                <div class="weui-cell">
                    <div class="weui-cell__bd">
                        <label class="left" for="name">姓名：<span style="color: green">*</span></label>
                        <input type="text" id="name" autofocus="autofocus" value="${result.realname}">
                    </div>
                </div>
            </div>
            <!--电话-->
            <div class="weui-cells">
                <div class="weui-cell">
                    <div class="weui-cell__bd">
                        <label class="left" for="phone">电话：<span style="color: green">*</span></label>
                        <input type="text" id="phone" placeholder="" value="${result.phone}">
                    </div>
                </div>
            </div>
            <!--微信-->
            <div class="weui-cells">
                <div class="weui-cell">
                    <div class="weui-cell__bd">
                        <label class="left" for="weiXin">微信：<span style="color: green">*</span></label>
                        <input type="text" id="weiXin" placeholder="" value="${result.wechat_num}">
                    </div>
                </div>
            </div>
            <!--QQ-->
            <div class="weui-cells">
                <div class="weui-cell">
                    <div class="weui-cell__bd">
                        <label class="left" for="QQ">QQ：<span style="color: green">*</span></label>
                        <input type="number" id="QQ" placeholder="" value="${result.qq_num}">
                    </div>
                </div>
            </div>
            <!--常住小区-->
            <div class="weui-cells">
                <div class="weui-cell">
                    <div class="weui-cell__bd">
                        <label class="left" for="house">常住小区：<span style="color: green">*</span></label>
                      
                        <select name='' id='gardenLIst'></select>
                    </div>
                </div>
            </div>
            <!--出生年月-->
            <div class="weui-cells">
                <div class="weui-cell">
                    <div class="weui-cell__bd">
                        <label class="left" for="">出生年月：<span style="color: green">*</span></label>
                        <select name="" id="yearBirth">
                            <option value="1980">1980</option>
                            
                        </select>年
                        <select name="" id="mouthBirth">
                            <option value="1">1</option>
                           
                        </select>月

                    </div>
                </div>
            </div>
            <!--喜好-->
            <div class="weui-cells">
                <div class="weui-cell">
                    <div class="weui-cell__bd">
                        <label class="left" for="likes">爱好：<span style="color: green">*</span></label>
                        <input type="text" id="likes" placeholder="" value="${result.hobby}">
                    </div>
                </div>
            </div>
                    `;
                  $(".myInfo").html(html);
                    // 功能4 检测手机号是否正确
                    var phone=$("#weiXin").val();
                    console.log(phone);
                    if(phone==="null"){
                        $("#weiXin").val("");
                    }
                    $("#phone").blur(function(){

                        console.log(phone);
                        if(!(/^1[34578]\d{9}$/.test(phone))){
                            alert("手机号码有误，请重填");
                            return false;
                        }
                    });
                    $("#weiXin").blur(function(){
                        var wechat_num=$("#weiXin").val();
                        if(isChina(wechat_num)){
                            alert("微信号有误");
                            return;
                        }
                    });
                    $("#QQ").blur(function(){
                        var QQ_num=$("#QQ").val();
                        if(isChina(QQ_num)){
                            alert("QQ号有误");
                            return;
                        }
                    })
                }

            },
            error:function(){}
        });
        $.ajax({
            url:url+'UserCenter_getApplicationGarden',
            type:'POST',
            data:{'data':jsonEncryptData},
            success:function(data){
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode === 5){
                    $('#house').val('暂无认证通过的小区');
                }else if(data.errcode  === 0){
                    var html='';
                    $.each(data.data,function(i,item){
                        html+= `
                    <option value='"+item.garden_code+"'>${item.garden_name}</option>

                        `;
                    });
                    $('#gardenLIst').append(html);
                }
            }
        })
    })();
    // 获取个人账号
    var account=localStorage.getItem("account");
    $(".account").text(account);
    // 刷新验证码
    $(".refreshImg").click(function(){
        // 获取时间戳
        var timestamp = new Date().getTime();
        console.log(timestamp);
        $(this).attr('src',"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=getPicCode&p="+timestamp );
    });
    // 功能1 获取验证手机验证码
    $(".weui-vcode-btn").click(function(){
        // 获取电话号码
        var phone=$("#phone").val();
        console.log(phone);
    });

    // 功能5 上传用户头像
    $('.myInfo').on("change",".weui-panel .weui-panel__bd .weui-media-box .weui-media-box__hd .weui-cells .weui-uploader__input-box #uploaderInput",function(e) {
        var Url=window.URL.createObjectURL(this.files[0]) ;
        var formData= new FormData();
        var apptoken=localStorage.getItem("apptoken");
        formData.append("file",$("#uploaderInput")[0].files[0]);
        var data=["",JSON.stringify({"apptoken":apptoken})];
        var json=jsEncryptData(data);
        formData.append("data",json);
        console.log(formData);
        $.ajax({
            type:"POST",
            url:url+"group_uploadGroupP",
            fileElementId:'uploaderInput',
            data:formData,
            processData : false,
            contentType : false,
            secureuri:false,
            success : function(data){
                // 解密
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    console.log(data.data.file_path);
                    localStorage.setItem("myPortrait",data.data.file_path);
                    $(".flockHead img").attr("src","http://wx.junxiang.ren/project/"+data.data.file_path);
                    $(".loader").attr("style","position:absolute;left:40%;opacity: 0;");
                    $(".flockHead").attr("style","display:block");
                }
            },
            error:function (data) {
                console.log(data);
            }
        });
    });
    // 功能6 提交用户资料
    $(".myInfo").on("click",".weui-panel .weui-panel__bd .weui-media-box .weui-media-box__bd .finishBtn",function(){
        var success=$(".success");
        var hideTop=function(){
            success.empty()};
            // 获取apptoken
               var apptoken= localStorage.getItem("apptoken");
            // 获取头像
                   portrait=$(".flockHead img").attr("src");
            // 获取昵称
                    nickname=$("#nickname").val();
            // 获取真实姓名（可填）
                    realname=$("#name").val();
            // 手机号（可填）
                    phone=$("#phone").val();
            // 微信（可填）
                    wechat_num=$("#weiXin").val();
            // QQ（可填）
                    qq_num=$("#QQ").val();
            // 常住小区（可填）
                    var garden_code = $('#house').attr('garden_code');
                    var garden_name = $('#house').val();
                    default_garden=$("#house").val()==='暂无认证通过的小区'?'':JSON.stringify({garden_code:garden_name});//
            // 出生年份（可填）
                    birth_year=$("#yearBirth option:selected").val(),
            // 出生月份（可填）
                    birth_month=$("#mouthBirth option:selected").val(),
            // 爱好（可填）
                    hobby=$("#likes").val();
            //数据格式验证
            if(isChina(wechat_num)){
                alert('微信号码不能包含中文');
                return;
            }else if(isChina(wechat_num)){
                alert('QQ号不能包含中文');
                return;
            }else if(phone){
                if(!(/^1[34578]\d{9}$/.test(phone))){
                    alert('手机号码格式错误');
                    return;
                }
            }
            // 数据格式转换
                    data=["",JSON.stringify({"apptoken":apptoken,"portrait":portrait,"nickname":nickname,"realname":realname,"phone":phone,"wechat_num":wechat_num,"qq_num":qq_num,"default_garden":default_garden,"birth_year":birth_year,"birth_month":birth_month,"hobby":hobby})];
            // 加密
                    jsonEncryptData=jsEncryptData(data);
                    console.log(data);
        $.ajax({
            url:url+"UserCenter_updateUserInfo",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                // 解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    showHide(data.errmsg);
                    window.location.href="index.html";
                }else{
                    showHide(data.errmsg);
                }
            },
            error:function(){}
        })
    });
    // 生成二维码
    $("#qrcode").qrcode({
        width: 220,//二维码宽度
        height:220,//二维码高度
        text: 'http://www.baidu.com',//此处填写生成二维码的生成数据 （拼接了inviter_code的注册页面地址，注册页面在url中获取到inviter_code传递给后台注册接口）
    });
    //判断字符是否是中文字符
    function isChina(s)
    {
        if (/.*[\u4e00-\u9fa5]+.*/.test(s)) {
            return true;
        } else {
            return false;
        }
    }
});