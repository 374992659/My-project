$(document).ready(function(){
    // 获取小区code
    (function(){
        var apptoken=localStorage.getItem("apptoken");
        $("#houseName").on("input",function(){
            var city_id=$("#city option:selected").val();
            var key=$("#houseName").val();
            if(key){

            }else{

            }
            // 数据格式转换
            var data=["",JSON.stringify({"apptoken":apptoken,"city_id":city_id,"key":key})],
                // 加密
                jsonEncryptData=jsEncryptData(data);
            console.log("通过关键词搜索小区");
            console.log(data);
            $.ajax({
                url:url+"UserCenter_getGardenInfo",
                type:"POST",
                data:{"data":jsonEncryptData},
                success:function(data){
                    // 解密
                    var data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        console.log(data.data);
                        localStorage.setItem("apptoken",data.apptoken);
                        $.each(data.data,function(i,item){
                            console.log(item);
                            $("#houseName").attr("title",item.garden_code)
                        });

                    }
                },
                error:function(){}
            })
        });

    })();
    // 提交
    $(".sumBtn").click(function(){
        var success=$(".success");
        var hideTop=function(){
            success.empty()};
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        // 参数：garden_code 小区code
        var garden_code=$("#houseName").attr("title");
        // 参数：garden_name 小区名
        var garden_name=$("#houseName").val();
        // 参数：title 名称
        var title=$(".Title").val();
        // 参数：content 意见内容
        var content=$(".Content").val();
        // 参数：picture 意见图片 可填
        var picture="";
        // 数据格式转换
        var data=["",JSON.stringify({"apptoken":apptoken,"garden_code":garden_code,"garden_name":garden_name,"title":title,"content":content,"picture":picture})];
        // 加密
        var jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"UserCenter_addGardenMessage",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                // 解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                   showHide(data.errmsg);
                   window.location.href="ideaBox.html";
                }else{
                    showHide(data.errmsg)

                }
            },
            error:function(){}
        })


    })

});




















