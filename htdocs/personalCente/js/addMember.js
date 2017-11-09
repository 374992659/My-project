$(document).ready(function(){
    // 获取小区code
    var code="";
    $("#gardenName").on("input",function(){
        var apptoken=localStorage.getItem("apptoken");
        var cityid=$("#city option:selected").val();
        var key=$("#gardenName").val();
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
                    });

                }
            }
        })
    });
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
        var garden_code=code;
        // garden_name 小区名称
        var garden_name=$("#gardenName").val();
        // city_id 城市id
        var city_id=$("#city option:selected").val();
        // relation_name 关系
        var relation_name=$("#rela option:selected").val();
        // id_card_pictures 身份证照片 可填
        var id_card_pictures="";
        // yourself_picture 个人照片  可填
        var yourself_picture="";
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
                    localStorage.setItem("apptoken",data.apptoken)
                }

            },
            error:function(){}
        })

    })

});