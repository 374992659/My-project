<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="Generator" content="EditPlus®">
    <meta name="Author" content="">
    <meta name="Keywords" content="">
    <meta name="Description" content="">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0,minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>用户登录</title>
    <link rel="stylesheet" href="JQuery_weui/weui.min.css">
    <link rel="stylesheet" href="JQuery_weui/jquery-weui.css">
    <link rel="stylesheet" href="JQuery_weui/demos.css">
    <link rel="stylesheet" href="css/userLanding.css">
    <!--<script>-->
        <!--document.documentElement.style.fontSize = document.documentElement.clientWidth /30 + 'px';-->
    <!--</script>-->
    <style>
        label{
            font-size: 15px;
        }
        .weui-input{
            font-size: 12px;
        }
        select{
            font-size: 10px;
        }
        .weui-cell {
            padding: 15px 10px;
        }
        .weui-vcode-btn{
            height: 20px;
            line-height: 20px;
        }
        .weui-media-box__desc {

            -webkit-line-clamp: 3;
        }
        .weui-media-box {
            padding: 25px 15px 15px 15px;
            position: relative;
        }
        .weui-btn {
            position: relative;
            display: block;
            margin-left: auto;
            margin-right: auto;
            padding-left: 14px;
            padding-right: 14px;
            box-sizing: border-box;
            font-size: 18px;
            text-align: center;
            text-decoration: none;
            color: #fff;
            line-height: 2;
            border-radius: 5px;
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            overflow: hidden;
        }
        select{
            font-size: 12px;
        }
    </style>
</head>
<body>
   <div id="userLand">
      <div class="weui-cells">
           <div class="weui-cell">
               <div class="weui-cell__bd" style="text-align: center">
                   <h3>用户登录</h3>
               </div>
           </div>
       </div>
       <!--信息输入-->
       <div class="weui-cells weui-cells_form">

           <div class="weui-cell weui-cell_vcode">
               <div class="weui-cell__hd">
                   <label class="weui-label">手机号</label>
               </div>
               <div class="weui-cell__bd">
                   <input class="weui-input phone" type="tel" placeholder="请输入手机号" >
               </div>
               <div class="weui-cell__ft">
                   <button class="weui-vcode-btn phoneBtn" style="font-size: 12px">获取验证码</button>
               </div>
           </div>


           <div class="weui-cell weui-cell_vcode">
               <div class="weui-cell__hd"><label class="weui-label">验证码</label></div>
               <div class="weui-cell__bd">
                   <input class="weui-input" type="number" placeholder="请输入验证码">
               </div>

           </div>

           <div class="weui-cell weui-cell_vcode">
               <div class="weui-cell__hd"><label class="weui-label">楼盘区域</label></div>
               <div class="weui-cell__bd" id="sanji" >
                   <select name="province" id="province">
                       <option value="">请选择</option>
                   </select>
                   <select name="city" id="city">
                       <option value="">请选择</option>
                   </select>
                   <select name="districtAndCounty" id="districtAndCounty">
                       <option value="">请选择</option>
                   </select>
               </div>
           </div>
       </div>
       <!--登录按钮-->
       <div class='demos-content-padded'>
           <a href="friend.html" id='show-success' class="weui-btn weui-btn_primary">登录</a>
       </div>
       <!--底部说明-->
       <div class="weui-panel__bd">
           <div class="weui-media-box weui-media-box_text" style="text-align: center">
               <p class="weui-media-box__desc">只在第一次登陆的时候需要输入信息，以后用此设备
                   登陆不需要重复登陆，感谢对’“美e家园”的支持</p>
               <p  class="weui-media-box__desc" style="color:#FF77FF;margin-top: 20px">更多精彩陆续上线敬请期待</p>
           </div>
       </div>
       <!--底部链接-->
       <div class="weui-footer" style="margin-top: 20px">
           <p class="weui-footer__links">
               <a href="http://www.baidu.com" class="weui-footer__link">美e家园 首页</a>
           </p>
           <p class="weui-footer__text">Copyright © 2016 jqweui.io</p>
       </div>
   </div>
   <script src="js/jquery-1.11.3.js"></script>
   <script src="JQuery_weui/fastclick.js"></script>
   <script>
       $(function () {
           FastClick.attach(document.body);
       });
   </script>
   <script src="js/url.js"></script>
   <script src="JQuery_weui/jquery-weui.js"></script>
   <script src="js/aes.js"></script>
   <script src="js/pad-zeropadding.js"></script>
   <script src="js/encrypt-decode.js"></script>
   <script src="js/usersLanding.js"></script>
   <script src="js/addRess.js"></script>
   <script >
       addRess();
   </script>

</body>
</html>