$(document).ready(function(){
        var area="";
        var agelength=[];
        var sex="";
        $("#city").change(function(){
           area=$(this).val();
           console.log(area);
            return area;
        });
        // 获取年龄段
        $('.age').bind('change', function () {
            //将会得到选中的text值
            agelen=$('.age  option:selected').text();
            // 年龄段
            agelength=agelen.split("-");
            console.log(agelength);
            return agelength;
        });
        // 性别
        $(".gender").change(function(){
             sex=$(this).val();
            console.log(sex);
            return sex;
        });
    $(".searchBtn").click(function() {
        var apptoken = localStorage.getItem("apptoken");
        var paramarea_id = area,
            parammin_age = agelength[0],
            parammax_age = agelength[1],
            paramsex = sex;
        data = ["", JSON.stringify({
            "apptoken": apptoken,
            "area_id":paramarea_id,
            "min_age":parammin_age,
            "max_age":parammax_age,
            "sex":paramsex
        })];
        // 加密数据
        josnEncyptData=jsEncryptData( data );
        console.log(data);
        $.ajax({
            url:url+"friends_searchUser",
            type:"POST",
            data:{"data":josnEncyptData},
            success:function(data){
                //解密数据
                data=jsDecodeData(data);
                localStorage.setItem("apptoken",data.apptoken);
                info=[JSON.stringify({"data":data.data})];
                localStorage.setItem("data",info);
                console.log(data);
                if(data.errcode===0){
                    console.log(data);
                 window.location.href="nearbyFriend.html"
                }else if(data.errocde===114){
                    window.location.href="landing.html"
                }else{
                   showHide(data.errmsg)

                }
            }
        });
    })
});
