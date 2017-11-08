$(document).ready(function(){
    // 上传租户身份证照片
    (function(){
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
                url:url+"UserCenter_uploadOwnerApplicationPic",
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
                        localStorage.setItem("myPicA",data.data[0]);
                        $(".flockHeadA img").attr("src",Url);
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
                url:url+"UserCenter_uploadOwnerApplicationPic",
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
                        localStorage.setItem("myPicA",data.data[0]);
                        $(".flockHeadB img").attr("src",Url);
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
    // 上传房主身份证照片
    (function(){
        // 正面
        $('#ownerUploaderInputA').change(function(e) {
            var Url=window.URL.createObjectURL(this.files[0]) ;
            var formData= new FormData();
            var apptoken=localStorage.getItem("apptoken");
            formData.append("file",$("#ownerUploaderInputA")[0].files[0]);
            var data=["",JSON.stringify({"apptoken":apptoken})];
            var json=jsEncryptData(data);
            formData.append("data",json);
            console.log(formData);
            $.ajax({
                type:"POST",
                url:url+"UserCenter_uploadOwnerApplicationPic",
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
                        localStorage.setItem("myPicA",data.data[0]);
                        $(".ownerFlockHeadA img").attr("src",data.data[0]);
                        $(".ownerLoaderA").attr("style","position:absolute;left:40%;opacity: 0;");
                        $(".ownerFlockHeadA").attr("style","display:block");
                    }
                },
                error:function (data) {
                    console.log(data);
                }
            });
        });
        // 发面
        $('#ownerUploaderInputB').change(function(e) {
            var Url=window.URL.createObjectURL(this.files[0]) ;
            var formData= new FormData();
            var apptoken=localStorage.getItem("apptoken");
            formData.append("file",$("#ownerUploaderInputB")[0].files[0]);
            var data=["",JSON.stringify({"apptoken":apptoken})];
            var json=jsEncryptData(data);
            formData.append("data",json);
            console.log(formData);
            $.ajax({
                type:"POST",
                url:url+"UserCenter_uploadOwnerApplicationPic",
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
                        localStorage.setItem("myPicA","http://wx.junxiang.ren/project/"+data.data[0]);
                        $(".ownerFlockHeadB img").attr("src",Url);
                        $(".ownerLoaderB").attr("style","position:absolute;left:40%;opacity: 0;");
                        $(".ownerFlockHeadB").attr("style","display:block");
                    }
                },
                error:function (data) {
                    console.log(data);
                }
            });
        });
    })();
    // 上传合同照片
    (function(){


    })();
    // 上传个人照片
    (function(){


    })();
    $(".weui-btn").click(function () {
    //1 参数：apptoken
        var apptoken=localStorage.getItem("apptoken");
    //2 参数：real_name 真实姓名
        var real_name=$("#renterName").val();
    //3 参数：phone 手机号码
        var phone=$("#renterPhone").val();
    //4 参数：room_num 房号
        var houseNum=$("#houseNum option:selected").val();
        var floorNum=$("#floorNum option:selected").val();
        var roomNum=$("#roomNum option:selected").val();
        var room_num=houseNum+"-"+floorNum+"-"+roomNum;
    //5 参数：id_card_num 身份证号码
        var id_card_num=$("#renter_owner_Identity").val();
    //6 参数：id_card_pictures 身份证照片
        var A=$(".flockHeadA img").attr("src");
        var B=$(".flockHeadB img").attr("src");
        var id_card_pictures="{'a':'"+A+"','b':'"+B+"'}";
    //7 参数：owner_id_card_num 房东身份证号码 可填
        var owner_id_card_num=$("#renter_IdentityCard").val();
    //8 参数：owner_id_card_picture 房东身份证照片 可填
        var ownerA=$(".ownerFlockHeadA img").attr("src");
        var ownerB=$(".ownerFlockHeadB img").attr("src");
        var owner_id_card_picture="{'a':'"+ownerA+"','b':'"+ownerB+"'}";
    //9 参数：city_id 小区所在城市
        var city_id=$("#city option:selected").val();
    //10 参数：garden_name 小区名
        var garden_name=$("#houseName").val();
    //11 参数：garden_code 小区code 可填 用户若选择检索出的小区则传递其code至后台否则不传递
        var garden_code="";
    //12 参数：garden_addr 楼盘地址
        var garden_addr=$("#province option:selected").text()+$("#city option:selected").text()+$("#houseName").val();
    //13 参数：contract_period 合同期限 10位时间戳 整型
        var contract_period=$("#date2").val();
    //14 参数：pictures 合同照
        var  ContractPic=$(".ContractPic img").attr("src");
        var  pictures="{'a':'"+yourselfPic+"'}";
    //15 参数：yourself_picture 个人照片 可填
        var yourself_picture="";
        // 数据格式转换
        var data=["",JSON.stringify({"apptoken":apptoken,"real_name":real_name,"phone":phone,"room_num":room_num,"id_card_num":id_card_num,"id_card_pictures":id_card_pictures,"owner_id_card_num":owner_id_card_num,"owner_id_card_picture":owner_id_card_picture,"city_id":city_id,"garden_name":garden_name,"garden_code":garden_code,"garden_addr":garden_addr,"contract_period":contract_period,"pictures":pictures,"yourself_picture":yourself_picture})];
        // 加密
        var jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"UserCenter_tenantApplication",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                // 解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken)

                }
            },
            error:function (){}
        })
        });


});