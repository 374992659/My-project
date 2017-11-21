$(document).ready(function(){
    //上传身份证照片
    (function(){
        // 上传身份证正面A
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
        // 上传身份证正面B
        $('#uploaderInputB').change(function(e) {
            var Url=window.URL.createObjectURL(this.files[0]);
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
                fileElementId:'uploaderInputB',
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
                        localStorage.setItem("myPicB",data.data[0]);
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
    // 上传房产证照片
    (function(){
        // A
        $('#PPuploaderInputA').change(function(e) {
            var Url=window.URL.createObjectURL(this.files[0]) ;
            var formData= new FormData();
            var apptoken=localStorage.getItem("apptoken");
            formData.append("file",$("#PPuploaderInputA")[0].files[0]);
            var data=["",JSON.stringify({"apptoken":apptoken})];
            var json=jsEncryptData(data);
            formData.append("data",json);
            console.log(formData);
            $.ajax({
                type:"POST",
                url:url+"UserCenter_uploadOwnerApplicationPic",
                fileElementId:'PPuploaderInputA',
                data:formData,
                processData : false,
                contentType : false,
                secureuri:false,
                success : function(data){
                    // 解密
                    data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        console.log(data.data[0]);
                        $(".PPflockHeadA img").attr("src","http://wx.junxiang.ren/project/"+data.data[0]);
                        $(".PPloaderA").attr("style","position:absolute;left:40%;opacity: 0;");
                        $(".PPflockHeadA").attr("style","display:block");
                    }
                },
                error:function (data) {
                    console.log(data);
                }
            });
        });
        // B
        $('#PPuploaderInputB').change(function(e) {
            var Url=window.URL.createObjectURL(this.files[0]) ;
            var formData= new FormData();
            var apptoken=localStorage.getItem("apptoken");
            formData.append("file",$("#PPuploaderInputB")[0].files[0]);
            var data=["",JSON.stringify({"apptoken":apptoken})];
            var json=jsEncryptData(data);
            formData.append("data",json);
            console.log(formData);
            $.ajax({
                type:"POST",
                url:url+"UserCenter_uploadOwnerApplicationPic",
                fileElementId:'PPuploaderInputB',
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
                        $(".PPflockHeadB img").attr("src","http://wx.junxiang.ren/project/"+data.data[0]);
                        $(".PPloaderB").attr("style","position:absolute;left:40%;opacity: 0;");
                        $(".PPflockHeadB").attr("style","display:block");
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
        $('#MyPicuploaderInput').change(function(e) {
            var Url=window.URL.createObjectURL(this.files[0]) ;
            var formData= new FormData();
            var apptoken=localStorage.getItem("apptoken");
            formData.append("file",$("#MyPicuploaderInput")[0].files[0]);
            var data=["",JSON.stringify({"apptoken":apptoken})];
            var json=jsEncryptData(data);
            formData.append("data",json);
            console.log(formData);
            $.ajax({
                type:"POST",
                url:url+"UserCenter_uploadOwnerApplicationPic",
                fileElementId:'MyPicuploaderInput',
                data:formData,
                processData : false,
                contentType : false,
                secureuri:false,
                success : function(data){
                    // 解密
                    data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        console.log(data.data[0]);
                        var html="";
                        if(Url){
                            html+=`
                        <li class="lf" style="margin-right: 10px">
                            <img  src="http://wx.junxiang.ren/project/${data.data[0]}" style="height: 79px;width: 79px" alt="" >
                        </li>             
               `
                        }
                        $(".myPic").prepend(html);

                    }
                },
                error:function (data) {
                    console.log(data);
                }
            });
        });
    })();
    // 上传小区照片
    (function(){
        $('#plotPicuploaderInput').change(function(e) {
            var Url=window.URL.createObjectURL(this.files[0]) ;
            var formData= new FormData();
            var apptoken=localStorage.getItem("apptoken");
            formData.append("file",$("#plotPicuploaderInput")[0].files[0]);
            var data=["",JSON.stringify({"apptoken":apptoken})];
            var json=jsEncryptData(data);
            formData.append("data",json);
            console.log(formData);
            $.ajax({
                type:"POST",
                url:url+"UserCenter_uploadOwnerApplicationPic",
                fileElementId:'plotPicuploaderInput',
                data:formData,
                processData : false,
                contentType : false,
                secureuri:false,
                success : function(data){
                    // 解密
                    data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        console.log(data.data[0]);
                        var html="";
                        if(Url){
                            html+=`
                        <li class="lf" style="margin-right: 10px">
                            <img  src="http://wx.junxiang.ren/project/${data.data[0]}" style="height: 79px;width: 79px" alt="" >
                        </li>             
               `
                        }
                        $(".placePlot").prepend(html);
                    }
                },
                error:function (data) {
                    console.log(data);
                }
            });
        });
    })();
    //根据城市id以及关键词获取小区信息
    (function(){
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        $("#gardenName").on("input",function(){
            var city_id=$("#city option:selected").val();  // 获取城市id
            var key=$("#gardenName").val();
            if(key){
                $(".allGarden").empty();
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
                            var li="";
                            localStorage.setItem("apptoken",data.apptoken);
                            $.each(data.data,function(i,item){
                                console.log(item);
                                li+=`
                        <li title="${item.garden_code}">${item.garden_name}</li>
                        
                        `
                            });
                            var allGarden= $(".allGarden");
                            allGarden.append(li);
                            allGarden.show();
                            allGarden.on("click","li",function(){
                                // 获取其值
                                var garden_Name=$(this).html();
                                var gardenCode=$(this).attr("title");
                                var gardenName= $("#gardenName");
                                gardenName.val("");
                                gardenName.val(garden_Name);
                                gardenName.attr("title","");
                                gardenName.attr("title",gardenCode);
                                allGarden.hide();
                            })
                        }
                    },
                    error:function(){}
                })
            }else{
                $(".allGarden").empty()
            }
        })
    })();
    //判断手机号格式是否正确
    (function () {
        $("#phone").blur(function () {
            // 获取号码
        var phoneNum=$("#phone").val();
            validate4(phoneNum);
        });
    })();
    //判断身份证号格式是否正确
    (function () {
        $("#identityCard").blur(function () {
            var idCard=$("#identityCard").val();
            console.log(idCard);
            isCardNo(idCard)
        })
    })();
    $(".weui-btn").click(function(){
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken"),
        // 姓名
           real_name=$("#name").val(),
        // 手机号
            phone=$("#phone").val();
        // 房号“1-2-3”字符串格式
            var dongNum=$("#dongNum option:selected").val();
            var floorNum=$("#floorNum option:selected").val();
            var roomNum=$("#roomNum option:selected").val();
        room_num=dongNum+"-"+floorNum+"-"+roomNum;
        console.log(room_num);
        console.log(typeof room_num);
        // 身份证号
         var   id_card_num=$("#identityCard").val();
        // 身份证照片json字符串格式
        var myPicA=localStorage.getItem("myPicA");
        var myPicB=localStorage.getItem("myPicB");
        var id_card_picture= "{'a':'"+myPicA+"','b':'"+myPicB+"'}",
            id_card_picture=JSON.stringify(id_card_picture),
        // 小区名字
            garden_name=$("#gardenName").val(),
        // 小区code（没有可不填）
            garden_code=$("#gardenName").attr("title"),
        // 小区所属城市
            city_id=$("#city option:selected").val(),
        // 小区详细地址
        //     garden_addr=$("#plotPlace").val();
            garden_addr=$("#province option:selected").text()+$("#city option:selected").text()+$("#gardenName").val();
        console.log(garden_code);
        // 小区照片
        var garden_picture={};
           var a=$(".placePlot").find("img");
          a.each(function(i,item){
              var _this=$(this);
             var  src=_this.attr("src");
              garden_picture[i]=src;
          });
       pica=JSON.stringify(garden_picture);
        console.log(typeof pica);
        // 合同房产证照片（可填）
        var PPa=$(".PPflockHeadA img").attr("src");
        var PPb=$(".PPflockHeadB img").attr("src");
        var picture="{'a':'"+PPa+"':'b':'"+PPb+"'}";
        // 个人照片（可填）
        var yourself_picture={};
        var  myImg=$(".myPic").find("img");
        myImg.each(function(i,item){
            var _this=$(this);
            var src=_this.attr("src");
            yourself_picture[i]=src;
        });
        var role=1;
        // 数据格式转换
        var data=["",JSON.stringify({"apptoken":apptoken,"real_name":real_name,"phone":phone,"room_num":room_num,"id_card_num":id_card_num,"id_card_pictures":JSON.stringify(id_card_picture),"garden_name":garden_name,"city_id":city_id,"garden_addr":garden_addr,"garden_picture":JSON.stringify(garden_picture),"picture":JSON.stringify(picture),"yourself_picture":JSON.stringify(yourself_picture),"garden_code":garden_code})],
        //    数据加密
            jsonEncryptData=jsEncryptData(data);
        console.log(data);
        //验证该楼盘是房号否已经认证
        if(garden_code){
            (function () {
                var data=["",JSON.stringify({"apptoken":apptoken,"city_id":city_id,"room_num":room_num,"garden_code":garden_code,"role":role})];
                var jsonEncryptData=jsEncryptData(data);
                $.ajax({
                    url:url+"UserCenter_roomRoleExists",
                    type:"POST",
                    data:{"data":jsonEncryptData},
                    success:function(data){
                        var data=jsDecodeData(data);
                        console.log(data);
                        if(data.errcode===0){
                            localStorage.setItem("apptoken",data.apptoken);
                            var data=["",JSON.stringify({"apptoken":apptoken,"real_name":real_name,"phone":phone,"room_num":room_num,"id_card_num":id_card_num,"id_card_pictures":JSON.stringify(id_card_picture),"garden_name":garden_name,"city_id":city_id,"garden_addr":garden_addr,"garden_picture":JSON.stringify(garden_picture),"picture":JSON.stringify(picture),"yourself_picture":JSON.stringify(yourself_picture),"garden_code":garden_code})],
                                //    数据加密
                                jsonEncryptData=jsEncryptData(data);
                                console.log(data);
                                $.ajax({
                                    url:url+"UserCenter_ownerApplication",
                                    type:"POST",
                                    data:{"data":jsonEncryptData},
                                    success:function(data){
                                        // 解密
                                        var data=jsDecodeData(data);
                                        console.log(data);
                                        if(data.errcode===0){
                                            localStorage.setItem("apptoken",data.apptoken);
                                            showHide(data.errmsg);
                                        }else{
                                            showHide(data.errmsg);
                                        }
                                    },
                                    error:function(){}
                                })
                        }else {
                            showHide(data.errmsg)
                        }
                    }
                })
            })();
        }else {
            $.ajax({
                url:url+"UserCenter_ownerApplication",
                type:"POST",
                data:{"data":jsonEncryptData},
                success:function(data){
                    // 解密
                    var data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        localStorage.setItem("apptoken",data.apptoken);
                        showHide(data.errmsg);
                    }else{
                        showHide(data.errmsg);
                    }
                },
                error:function(){}
            })
        }


    })
});