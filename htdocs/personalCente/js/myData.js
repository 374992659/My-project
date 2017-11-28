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
                                        <input id="uploaderInput" name="uploaderInput" class="weui-uploader__input" type="file" v-on:change="chooseFileChange($event)" capture/>
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
                        <input type="text" id="name"  value="${result.realname}">
                    </div>
                </div>
            </div>
            <!--年龄-->
            <div class="weui-cells">
                <div class="weui-cell">
                    <div class="weui-cell__bd">
                        <label class="left" for="sex">性别：<span style="color: green">*</span></label>                    
                         <select name='' id='sex'>
                             <option value="0">保密</option>
                             <option value="1">男</option>
                             <option value="2">女</option>
                         </select>
                    </div>
                </div>
            </div>
            <!--电话-->
            <div class="weui-cells">
                    <div class="weui-cell weui-cell_vcode" style="padding:10px 15px;">
                        <div class="weui-cell__hd" style="width:30%">
                            <label class="weui-label" style="width:100%;text-align: right;">手机号：<span style="color: green">*</span></label>
                        </div>
                        <div class="weui-cell__bd"  style="width:40%">
                            <input class="weui-input phone" type="number" placeholder="请输入手机号" value="${result.phone}"  style="width:100%">
                        </div>
                        <div class="weui-cell__ft" style="width:35%">
                            <button class="weui-vcode-btn getCodeBtn" style="font-size: 12px"  style="width:100%">获取验证码</button>
                        </div>
                    </div>
                    <!--验证码-->
                    <div class="weui-cell weui-cell_vcode" style="padding:10px 15px;">
                        <div class="weui-cell__hd"  style="width:30%">
                            <label class="weui-label" style="width:100%;text-align: right;">验证码：<span style="color: green">*</span></label>
                        </div>
                        <div class="weui-cell__bd"  style="width:70%">
                            <input class="weui-input code" type="number" placeholder="输入验证码" style="width:100%">
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
                        <input type="number" id="QQ" placeholder="" value="${result.qq_num}"  pattern="[0-9]*">
                    </div>
                </div>
            </div>
            <!--常住小区-->
            <div class="weui-cells garden" >
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
                            <option value="01">01</option>
                                                       
                        </select>月

                    </div>
                </div>
            </div>
            <!--喜好-->
            <div class="weui-cells">
                <div class="weui-cell">
                    <div class="weui-cell__bd">
                        <label class="left" for="likes">爱好：<span style="color: green">*</span></label>
                        <input type="text" id="likes" placeholder="例如(游泳,足球)" value="${result.hobby}">
                    </div>
                </div>
            </div>
                    `;
                  $(".myInfo").html(html);
                  if(result.phone){
                      localStorage.setItem("phone",result.phone);
                  }
                   //如果微信号为null value值为空
                   //  var weiXin=$("#weiXin").val();
                   //  if(weiXin==="null"){
                   //      $("#weiXin").val("");
                   //
                   //  }
                    //如果爱好为空
                    // var hobby=$("#likes").val();
                    // console.log(hobby);
                    // if(hobby==="null"){
                    //     $("#likes").val("");
                    //
                    // }
                    if(parseInt(result.sex)===0){
                        $("#sex").find("option[value='0']").attr("selected",true);
                    }else if(parseInt(result.sex)===1){
                        $("#sex").find("option[value='1']").attr("selected",true);
                    }else{
                        $("#sex").find("option[value='2']").attr("selected",true);
                    }
                    // 功能4 检测手机号是否正确
                    $(".phone").blur(function(){
                        var phone=$(".phone").val();
                        console.log(phone);
                       var reg=/^[1][3,4,5,7,8][0-9]{9}$/;
                        if(!reg.test(phone)){
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
                    });
                    //获取认证了的小区
                    $.ajax({
                        url:url+'UserCenter_getApplicationGarden',
                        type:'POST',
                        data:{'data':jsonEncryptData},
                        success:function(data){
                            var data=jsDecodeData(data);
                            console.log(data);
                            if(data.errcode === 5){
                                $(".garden").hide();
                            }else if(data.errcode  === 0){
                                var html='';
                                $.each(data.data,function(i,item){
                                    html+= `
                    <option value="${item.garden_code}">${item.garden_name}</option>

                        `;
                                });
                                $('#gardenLIst').append(html);
                            }
                        }
                    })
                }

            },
            error:function(){}
        });

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
    var myInfo=$(".myInfo");
    // 功能5 上传用户头像
    myInfo.on("change",".weui-panel .weui-panel__bd .weui-media-box .weui-media-box__hd .weui-cells .weui-uploader__input-box #uploaderInput",function(e) {
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
    //获取验证码
  myInfo.on("click",".weui-cells .weui-cell_vcode .weui-cell__ft .getCodeBtn",function(){
        //获取以前的手机号
        var beforePhone=localStorage.getItem("phone");
        var apptoken=localStorage.getItem("apptoken");
        var phone=$(".phone").val();
        console.log(phone);
        // 转换数据格式json
        data=["",JSON.stringify({"phone":phone,"apptoken":apptoken})];
        // 加密数据
        console.log(data);
        jsonEncryptDate=jsEncryptData(data);
        console.log(jsonEncryptDate);
        if(parseInt(beforePhone)===parseInt(phone)){
            showHide("你的手机号没有变不用验证")
        }else{
            $.ajax({
                url:url+"UserCenter_SendBindMessage",
                type:"POST",
                data:{"data":jsonEncryptDate},
                success:function(data){
                    // 解密返回的数据
                    data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        // 保存apptoken
                        localStorage.setItem("apptoken",data.apptoken);
                        console.log(data.errcode);
                        function invokeSettime(obj){
                            var countdown=60;
                            settime(obj);
                            function settime(obj) {
                                if (countdown == 0) {
                                    $(obj).attr("disabled",false);
                                    $(obj).text("获取验证码");
                                    countdown = 60;
                                    return;
                                } else {
                                    $(obj).attr("disabled",true);
                                    $(obj).text("(" + countdown + ") s 重新发送");
                                    countdown--;
                                }
                                setTimeout(function() {
                                        settime(obj) }
                                    ,1000)
                            }
                        }
                        new invokeSettime(".getCodeBtn");
                    }else{
                    }
                }
            });
            return phone;
        }
    });
    // 功能6 提交用户资料
    myInfo.on("click",".weui-panel .weui-panel__bd .weui-media-box .weui-media-box__bd .finishBtn",function(){
            // 获取apptoken
                    var  apptoken= localStorage.getItem("apptoken");
            // 获取头像
                    var  portrait=$(".flockHead img").attr("src");
            // 获取昵称
                    var  nickname=$("#nickname").val();
            // 获取真实姓名（可填）
                    var  realname=$("#name").val();
            //获取性别
                    var  sex=$("#sex option:selected").val();
            // 手机号（可填）
                    var  phone=$(".phone").val();
            //验证码
                    var  code=$(".code").val();
            // 微信（可填）
                    var  wechat_num=$("#weiXin").val();
            // QQ（可填）
                    var  qq_num=$("#QQ").val();
            // 常住小区（可填）
                    var  garden_code = $('#gardenLIst option:selected').attr('value');
                    var  garden_name = $('#gardenLIst option:selected').text();
                    var  arr={};
                    arr[garden_code]=garden_name;
                    default_garden=$("#house").val()==='暂无认证通过的小区'?'':JSON.stringify(arr);
            // 出生年份（可填）
                    var  birth_year=$("#yearBirth option:selected").val();
            // 出生月份（可填）
                    var  birth_month=$("#mouthBirth option:selected").val();
            // 爱好（可填）
                    var  hobby=$("#likes").val();
                    hobby=hobby.replace(/，/ig,',');
            //数据格式验证
            if(isChina(wechat_num)){
                alert('微信号格式不正确');
                return;
            }else if(isChina(qq_num)){
                alert('QQ号不能包含中文');
                return;
            }else if(phone){
                if(!(/^1[34578]\d{9}$/.test(phone))){
                    alert('手机号码格式错误');
                    return;
                }
            }
            // 数据格式转换
                    data=["",JSON.stringify({"apptoken":apptoken,"portrait":portrait,"nickname":nickname,"realname":realname,"phone":phone,"wechat_num":wechat_num,"qq_num":qq_num,"default_garden":default_garden,"birth_year":birth_year,"birth_month":birth_month,"hobby":hobby,"code":code,"sex":parseInt(sex)})];
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
var mycode=localStorage.getItem("my_code");
    $("#qrcode").qrcode({
        width: 220,//二维码宽度
        height:220,//二维码高度
        text:'http://'+location.host+'/project/htdocs/login.html?inviter_code='+mycode,//此处填写生成二维码的生成数据 （拼接了inviter_code的注册页面地址，注册页面在url中获取到inviter_code传递给后台注册接口）
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
//判断字符为数字字母
function checkRate(nubmer)
{
    var re =  /^[0-9a-zA-Z]*$/g;  //判断字符串是否为数字和字母组合     //判断正整数 /^[1-9]+[0-9]*]*$/
    if (!re.test(nubmer))
    {
        return false;
    }else{
        return true;
    }
}