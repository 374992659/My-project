$(document).ready(function(){
    // 上传身份证照片
    (function () {
        // 正面
        $('#uploaderInputA').change(function(e) {
            var Url=window.URL.createObjectURL(this.files[0]) ;
            var formData= new FormData();
            var apptoken=localStorage.getItem("apptoken");
            formData.append("file",$("#uploaderInputA")[0].files[0]);
            var data=["",JSON.stringify({"apptoken":apptoken})];
            var json=jsEncryptData(data);
            formData.append("data",json);
            console.log(formData);
            $.ajax({
                type:"POST",
                url:url+"UserCenter_uploadTenantApplicationPic",
                fileElementId:'uploaderInputA',
                data:formData,
                processData : false,
                contentType : false,
                secureuri:false,
                success : function(data){
                    // 解密
                    data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        console.log(data.data);
                        $(".flockHeadA img").attr("src","http://wx.junxiang.ren/project/"+data.data[0]);
                        $(".loaderA").attr("style","position:absolute;left:40%;opacity: 0;");
                        $(".flockHeadA").attr("style","display:block");
                    }
                },
                error:function (data) {
                    console.log(data);
                }
            });
        });
        // 反面
        $('#uploaderInputB').change(function(e) {
            var Url=window.URL.createObjectURL(this.files[0]) ;
            var formData= new FormData();
            var apptoken=localStorage.getItem("apptoken");
            formData.append("file",$("#uploaderInputB")[0].files[0]);
            var data=["",JSON.stringify({"apptoken":apptoken})];
            var json=jsEncryptData(data);
            formData.append("data",json);
            console.log(formData);
            $.ajax({
                type:"POST",
                url:url+"UserCenter_uploadTenantApplicationPic",
                fileElementId:'uploaderInputA',
                data:formData,
                processData : false,
                contentType : false,
                secureuri:false,
                success : function(data){
                    // 解密
                    data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        console.log(data.data);
                        $(".flockHeadB img").attr("src","http://wx.junxiang.ren/project/"+data.data[0]);
                        $(".loaderB").attr("style","position:absolute;left:40%;opacity: 0;");
                        $(".flockHeadB").attr("style","display:block");
                    }
                },
                error:function (data) {
                    console.log(data);
                }
            });
        });
    })();
    // 上传个人照片
    (function(){
        var apptoken=localStorage.getItem("apptoken");
        $("#plotName").on("input",function(){
            var city_id=$("#city option:selected").val();
            var key=$("#plotName").val();
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
                            $("#plotName").attr("title",item.garden_code)
                        });

                    }
                },
                error:function(){}
            })
        });

    })();
    // 获取小区code

    $(".weui-btn").click(function(){
        // 参数：apptoken
        var apptoken=localStorage.getItem("apptoken");
        // 参数：real_name 真实姓名
        var real_name=$("#name").val();
        // 参数：phone 手机号码
        var phone=$("#phone").val();
        // 参数：room_num 房间号码
        var dongNum=$("#dongNum option:selected").val();
        var floorNum=$("floorNum option:selected").val();
        var roomNum=$("roomNum option:selected").val();
        var room_num=dongNum+"-"+floorNum+"-"+roomNum;
        // 参数：id_card_num 身份证号码
        var id_card_num=$("#identityCard").val();
        // 参数：garden_code 小区code
        var garden_code=$("#plotName").attr("title");
        // 参数：garden_name 小区名称
        var garden_name=$("#plotName").val();
        // 参数：city_id 城市id
        var city_id=$("#city option:selected").val();
        // 参数：relation_name 关系
        var relation_name=$("#rela option:selected").val();
        // 参数：contract_period 合同期限
        var contract_period=$("#date2").val();
        // 参数：id_card_pictures 身份证照片  可填
        var A=$(".flockHeadA img").attr("src");
        var B=$(".flockHeadB img").attr("src");
        var id_card_pictures="{'a':'"+A+"','b':'"+B+"'}";
        // 参数：yourself_picture 个人照片  可填
        var yourself_picture="";
        // 参数：account 添加用户的账户 可填
        var account="";
    })


});