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
                        $(".CardA").hide();
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
                        $(".CardB").hide();
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
    //栋数判断
    //判断手机号格式是否正确
    (function () {
       $("#phone").blur(function(){
           // 获取号码
       var phoneNum=$("#phone").val();
           validate4(phoneNum);
       });
    })();
    //判断身份证号格式是否正确
    (function () {
       $("#identityCard").blur(function(){
           var idCard=$("#identityCard").val();
           isCardNo(idCard)
       })
    })();
    //验证该楼盘是房号否已经认证
    //     $("#roomNum").blur(function (){
    //         var apptoken=localStorage.getItem("apptoken");
    //         var city_id=$("#city option:selected").val();
    //         var garden_code=$("#gardenName").val();
    //         console.log(garden_code);
    //         var dongNum=$("#dongNum").val();
    //         var floorNum=$("#floorNum").val();
    //         var roomNum=$("#roomNum").val();
    //         var room_num=dongNum+"-"+floorNum+"-"+roomNum;
    //         var role=1;
    //         var data=["",JSON.stringify({"apptoken":apptoken,"city_id":city_id,"garden_name":garden_code,"room_num":room_num,"role":role})];
    //         var jsonEncryptData=jsEncryptData(data);
    //         console.log(data);
    //         if(garden_code){
    //             $.ajax({
    //                 url:url+"UserCenter_roomRoleExists",
    //                 type:"POST",
    //                 data:{"data":jsonEncryptData},
    //                 success:function (data) {
    //                     var data=jsDecodeData(data);
    //                     console.log(data);
    //                     if(data.errcode===0){
    //                         localStorage.setItem("apptoken",data.apptoken);
    //                         $("#gardenName").attr("title","");
    //                         showHide("该房号还没有认证可以认证哦")
    //                     }else{
    //                         showHide(data.errmsg);
    //                     }
    //                 }
    //             })
    //         }
    //     });
        //验证房号是否被认证
    function verityHouseNum(element) {
        var that=$(element);
        that.blur(function () {
            var apptoken=localStorage.getItem("apptoken");
            var city_id=$("#city option:selected").val();
            var garden_code=$("#gardenName").val();
            console.log(garden_code);
            var dongNum=$("#dongNum").val();
            var floorNum=$("#floorNum").val();
            var roomNum=$("#roomNum").val();
            var room_num=dongNum+"-"+floorNum+"-"+roomNum;
            var role=1;
            var data=["",JSON.stringify({"apptoken":apptoken,"city_id":city_id,"garden_name":garden_code,"room_num":room_num,"role":role})];
            var jsonEncryptData=jsEncryptData(data);
            console.log(data);
            if(city_id&&garden_code&&dongNum&&floorNum&&roomNum){
                $.ajax({
                    url:url+"UserCenter_roomRoleExists",
                    type:"POST",
                    data:{"data":jsonEncryptData},
                    success:function (data) {
                        var data=jsDecodeData(data);
                        console.log(data);
                        if(data.errcode===0){
                            localStorage.setItem("apptoken",data.apptoken);
                            $("#gardenName").attr("title","");
                            if(parseInt(data.data.status)===1){
                                showHide("该房号还没有认证")
                            }else{
                                showHide("该房号已经被认证")
                            }

                        }else{
                            showHide(data.errmsg);
                        }
                    }
                })
            }
        })
    }
    verityHouseNum("#dongNum");
    verityHouseNum("#floorNum");
    verityHouseNum("#roomNum");
    $(".weui-btn").click(function(){
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        // 姓名
        var   real_name=$("#name").val();
        // 手机号
          var  phone=$("#phone").val();
              //$("#phone").attr("placeholder","手机号没填哦");
        // 房号“1-2-3”字符串格式
            var dongNum=$("#dongNum").val();
            var floorNum=$("#floorNum").val();
            var roomNum=$("#roomNum").val();
            var room_num=dongNum+"-"+floorNum+"-"+roomNum;
        // 身份证号
         var   id_card_num=$("#identityCard").val();
        // 身份证照片json字符串格式
        var myPicA=$(".flockHeadA img").attr("src");
        var myPicB=$(".flockHeadB img").attr("src");
        var id_card_picture= "{'a':'"+myPicA+"','b':'"+myPicB+"'}";
        // 小区名字
          var   garden_name=$("#gardenName").val();
        // 小区code（没有可不填）
          var garden_code=$("#gardenName").attr("title");
        // 小区所属城市
          var city_id=$("#city option:selected").val();
        // 小区详细地址
        //    garden_addr=$("#plotPlace").val();
          var garden_addr=$("#province option:selected").text()+$("#city option:selected").text()+$("#gardenName").val();
        console.log(garden_code);
        // 小区照片
        var garden_picture={};
           var a=$(".placePlot").find("img");
        if(a){
            a.each(function(i,item){
                var _this=$(this);
                var  src=_this.attr("src");
                garden_picture[i]=src;
            });
        }
        console.log(typeof garden_picture);
        // 合同房产证照片（可填）
        var PPa=$(".PPflockHeadA img").attr("src");
        var PPb=$(".PPflockHeadB img").attr("src");
        var picture={a:PPa,b:PPb};
        console.log(typeof picture);
        // 个人照片（可填）
        var yourself_picture={};
        var  myImg=$(".myPic").find("img");
        myImg.each(function(i,item){
            var _this=$(this);
            var src=_this.attr("src");
            yourself_picture[i]=src;
        });
        console.log(typeof yourself_picture);
            var data=["",JSON.stringify({"apptoken":apptoken,"real_name":real_name,"phone":phone,"room_num":room_num,"id_card_num":id_card_num,"id_card_pictures":id_card_picture,"garden_name":garden_name,"city_id":city_id,"garden_addr":garden_addr,"garden_picture":JSON.stringify(garden_picture),"picture":JSON.stringify(picture),"yourself_picture":JSON.stringify(yourself_picture),"garden_code":garden_code})],
                //    数据加密
                jsonEncryptData=jsEncryptData(data);
            console.log(data);
            !real_name?alert("名字没有填"):
                !phone?alert("没填手机号"):
                    !dongNum?alert("房号不正确"):
                        !floorNum?alert("房号不正确"):
                            !roomNum?alert("房号不正确"):
                                !id_card_num?alert("没填证件号"):
                                    !myPicA?alert("证件正反两面"):
                                        !myPicB?alert("证件正反两面"):
                                            !city_id?alert("没选城市"):
                                                !a?alert("小区照片"):
                                                    !garden_name?alert("没有填小区"):
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
                        window.location.href="myRenZ.html";
                    }else{
                        showHide(data.errmsg);
                    }
                },
                error:function(){}
            })
    })
});