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
    //根据城市id以及关键词获取小区信息
    (function(){
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        $("#plotName").on("input",function(){
            var city_id=$("#city option:selected").val();  // 获取城市id
            var key=$("#plotName").val();
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
    //获取已经认证通过的小区
    (function () {
        var apptoken=localStorage.getItem("apptoken");
        var role=2;
        var data=["",JSON.stringify({"apptoken":apptoken,"role":role})];
        var jsonEncryptData=jsEncryptData(data);
        $.ajax({
            url:url+"UserCenter_getApplicationGarden",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    var  html="";
                    $.each(data.data,function(i,item){
                        html+=`
                         <option value="${item.city_id}" title="${item.garden_code}">${item.garden_name}</option>                    
                        `
                    });
                    $("#gardenName").html(html);
                    //调用构造函数获取房号
                    (function(){
                        var apptoken=localStorage.getItem("apptoken");
                        var garden_code=$("#gardenName option:selected").attr("title");
                        var role=2;
                        console.log(typeof role);
                        console.log(garden_code);
                        if(garden_code){
                            console.log(garden_code);
                            var gardenNum=new houseNum(apptoken,garden_code,role);
                            gardenNum.getHouseNum();
                        }
                    })();
                }else if(data.errcode===5){
                    console.log("租户没有认证的小区");
                    $(".addMember").hide();
                    html=`
                      <div style="text-align: center">
                        <p>你还没有认证的小区添加成员，请去进行认证</p>
                        <a href="renter.html" style="background: red;color: white">点我到租户认证中心</a>
                    </div>
                    `;
                    $("body").append(html)
                }

            }
        })
    })();
    //检测手机格式
    (function () {
        $("#phone").blur(function () {
            var phone=$("#phone").val();
            validate4(phone);
        })
    })();
    //检测身份证格式
    (function () {
        $("#identityCard").blur(function () {
           $("#identityCard").blur(function () {
                var idCard=$("#identityCard").val();
               isCardNo(idCard);
            })
        })
    })();
    // 提交
    $(".weui-btn").click(function(){
        // 1参数：apptoken
        var apptoken=localStorage.getItem("apptoken");
        // 2 参数：real_name 真实姓名
        var real_name=$("#name").val();
        // 3 参数：phone手机号码
        var phone=$("#phone").val();
        // 4 参数：room_num房间号码
        var dongNum=$("#dongNum option:selected").val();
        var floorNum=$("#floorNum option:selected").val();
        var roomNum=$("#roomNum option:selected").val();
        var room_num=dongNum+"-"+floorNum+"-"+roomNum;
        // 5 参数：id_card_num身份证号码
        var id_card_num=$("#identityCard").val();
        // 6 参数：garden_code小区code
        var garden_code=$("#gardenName option:selected").attr("title");
        // 7 参数：garden_name 小区名称
        var garden_name=$("#gardenName option:selected").text();
        // 8 参数：city_id 城市id
        var city_id=$("#gardenName option:selected").val();
        // 9 参数：relation_name关系
        var relation_name=$("#rela option:selected").val();
        // 10 参数：contract_period合同期限
        var time=$("#date2").val();
        var arr=time.split(/[年 月 日 \/]/);
        console.log(arr);
        var data=new Date(arr[0],arr[1]-1,arr[2]);
        var contract_period=data/1000;
        // 11 参数：id_card_pictures身份证照片可填
        var A=$(".flockHeadA img").attr("src");
        var B=$(".flockHeadB img").attr("src");
        var id_card_pictures="{'a':'"+A+"','b':'"+B+"'}";
        console.log(typeof id_card_pictures);
        // 12 参数：yourself_picture个人照片可填
        var yourself_picture={};
        var myPic=$(".myPic").find("img");
        myPic.each(function(i,item){
            var _this=$(this);
            var src=_this.attr("src");
            yourself_picture[i]=src
        });
        console.log(typeof yourself_picture);
        // 13 参数：account 添加用户的账户 可填
        var account=$("#account").val();
        // 数据格式转换
        var data=["",JSON.stringify({"apptoken":apptoken,"real_name":real_name,"phone":phone,"room_num":room_num,"id_card_num":id_card_num,"garden_code":garden_code,"garden_name":garden_name,"city_id":city_id,"relation_name":relation_name,"contract_period":contract_period,"id_card_pictures":id_card_pictures,"yourself_picture":JSON.stringify(yourself_picture),"account":account})];
        // 加密
        var jsonEncryptData=jsEncryptData(data);
        console.log(data);
        !real_name?alert("输入姓名"):
            !phone?alert("输入手机"):
                !contract_period?alert("选择合同有效期"):
                    !id_card_num?alert("输入身份证号码"):
        $.ajax({
            url:url+"UserCenter_tenantAddNum",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                // 解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    showHide(data.errmsg)
                }else{
                    showHide(data.errmsg)
                }
            },
            error:function(){}
        })
    });
    //根据小区名字找到相应的认证房号构造函数
    function houseNum(apptoken,garden_code,role){
        this.apptoken=apptoken;
        this.garden_code=garden_code;
        this.role=role;
        this.getHouseNum=function(){
            var data=["",JSON.stringify({"apptoken":apptoken,"garden_code":garden_code,"role":role})];
            var jsonEncryptData=jsEncryptData(data);
            console.log(data);
            $.ajax({
                url:url+"UserCenter_getMyRoomList",
                type:"POST",
                data:{"data":jsonEncryptData},
                success:function(data){
                    var data=jsDecodeData(data);
                    var result=data.data;
                    console.log(data);
                    if(data.errcode===0){
                        localStorage.setItem("apptoken",data.apptoken);
                        var html="";
                        $.each(result,function (i,item) {
                            html+=`
                                             <option>${item.room_num}</option> 
                                            `
                        });
                        $("#houseNum").html(html);
                    }
                }
            })
        }
    }
    //当小区方式改变的时候重新获取认证的房号
    (function () {
        $("#gardenName").change(function () {
            $("#houseNum").empty();
            var apptoken=localStorage.getItem("apptoken");
            var garden_code=$("#gardenName option:selected").attr("title");
            var role=2;
            console.log(garden_code);
            if(garden_code){
                console.log(garden_code);
                var gardenNum=new houseNum(apptoken,garden_code,role);
                gardenNum.getHouseNum();
            }
        })
    })();
});