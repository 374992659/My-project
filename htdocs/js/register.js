$(document).ready(function(){
    // 图片验证码刷新
    $(".refreshImg").click(function(){
        console.log(123);
        var timestamp = new Date().getTime();
        $(this).attr('src',"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=getPicCode&p="+timestamp );
    });
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    //
    var area_id=null;
    $("#city").change(function(){
        area_id=$(this).val();
        return area_id;
    });
    $(".regBtn").click(function(){
        // 获取账号
        var numeber=$(".account").val();
        // 密码
         var password=$(".password").val();
         //重复密码
        var repassword=$(".repassword").val();
        // 获取验证码
        var  code=$(".code").val();
        // 数据加密
    info=['', JSON.stringify({"account":numeber,"area_id":area_id,"password":password,'repassword':repassword,"apptoken":apptoken,"piccode":code})];
        console.log(info);
        // 加密后的数据
        var afterDate=jsEncryptData( info );
        console.log(afterDate);
        // ajax向后台传输数据
        $.ajax({
            url:"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=regiest&is_wap=1",
            type:"POST",
            data:{"data":afterDate},
            success:function(data){
                data=jsDecodeData( data );
                console.log(data.apptoken);
                localStorage.setItem("apptoken",data.apptoken);
               var  cityID=$("#city option:selected").val();

                console.log(data);
                console.log(data.errcode);
                if(data.errcode===0){
                    var html=`
                     <p style="text-align: center;background: green;font-size: 15px">${data.errmsg}</p>
                    `;
                    $(".topHint").html(html);
                    $(".topHint").show();
                    function hide() {
                        $(".topHint").hide()
                    }
                    setTimeout(hide(),3000);
                    localStorage.setItem("city_id",cityID);
                   window.location.href="friend.html";
                }else{
                   
                    var html=`
                     <p style="text-align: center;background: green;font-size: 15px">${data.errmsg}</p>
                    `;
                    $(".topHint").html(html);
                    $(".topHint").show();
                    function hide() {
                        $(".topHint").hide()
                    }
                    setTimeout(hide(),3000);
                    console.log(123);
                }
            }
        })

    });





});