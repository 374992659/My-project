$(document).ready(function(){
    // 获取小区code
    $("#gardenName").on("input",function(){
        var apptoken=localStorage.getItem("apptoken");
        var cityid=$("#city option:selected").val();
        var key=$("#gardenName").val();
        if(key){
            $(".allGarden").empty();
            // 数据格式转换
            var data=["",JSON.stringify({"apptoken":apptoken,"city_id":cityid,"key":key})];
            // 加密
            var jsonEncryptData=jsEncryptData(data);
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
                }
            })
        }else{
           $(".allGarden").empty();
        }
    });
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
    // 提交
    $(".weui-btn").click(function(){
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        // real_name 真实姓名
        var real_name=$("#name").val();
        // phone 手机号码
        var phone=$("#phone").val();
        // room_num 房间号码
        var dongNum=$("#dongNum option:selected").val();
        var floorNum=$("#floorNum option:selected").val();
        var roomNum=$("#roomNum option:selected").val();
        var room_num=dongNum+"-"+floorNum+"-"+roomNum;
        // id_card_num 身份证号码
        var id_card_num=$("#identityCard").val();
        // garden_code 小区code
        var garden_code=$("#gardenName").attr("title");
        // garden_name 小区名称
        var garden_name=$("#gardenName").val();
        // city_id 城市id
        var city_id=$("#city option:selected").val();
        // relation_name 关系
        var relation_name=$("#rela option:selected").val();
        // id_card_pictures 身份证照片 可填
        var a=$(".flockHeadA img").attr("src");
        var b=$(".flockHeadB img").attr("src");
        var id_card_pictures="{'a':'"+a+"','b':'"+b+"'}";
        // yourself_picture 个人照片  可填
        var myPic=$(".myPic").find("img");
        var yourself_picture={};
        myPic.each(function(i,item){
            var _this=$(this);
            var src=_this.attr("src");
            yourself_picture[i]=src
        });
        // account 添加用户的账户 可填
        var account="";
        // 数据转换格式
        var data=["",JSON.stringify({"apptoken":apptoken,"real_name":real_name,"phone":phone,"room_num":room_num,"id_card_num":id_card_num,"garden_code":garden_code,"garden_name":garden_name,"city_id":city_id,"relation_name":relation_name,"id_card_pictures":id_card_pictures,"yourself_picture":yourself_picture,"account":account})];
        // 加密
        var jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"UserCenter_ownerAddNum",
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
    })
});