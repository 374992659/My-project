$(document).ready(function(){
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    // 数据格式转换
    var data=["",JSON.stringify({"apptoken":apptoken})];
    // 加密
    var jsonEncryptData=jsEncryptData(data);
    console.log(data);
    $.ajax({
        url:url+"UserCenter_getMyTenantRoomNum",
        type:"POST",
        data:{"data":jsonEncryptData},
        success:function(data){
            // 解密
            var data=jsDecodeData(data);
            console.log(data);
            if(data.errcode===0){
                localStorage.setItem("apptoken",data.apptoken);
                var html="";
                $.each(data.data,function(i,item){
                    $.each(item,function(i,item){
                        console.log(item);
                        html+=`
                    <tr title="${item.application_id}" value="${item.city_id}" class="renterList">
                        <td>${item.real_name}</td>
                        <td>${item.relation_name}</td>
                        <td>${item.room_num}</td>
                        <td><button value="${item.garden_code}" title="${item.room_num}">删除</button></td>
                    </tr>
                    `
                    });
                });
                $(".renterMemberList").append(html);
            }
        },
        error:function(){}
    });
    // 帮顶点击事件获取去下一个页面需要的参数
    $(".renterMemberList").on("click",".renterList",function(){
        // 获取application_id
        var application_id=$(this).attr("title");
        // 获取城市id
        var city_id=$(this).attr("value");
        // 存在本地
        localStorage.setItem("application_id",application_id);
        localStorage.setItem("renterCity_id",city_id);
        if(application_id&&city_id){
            window.location.href="renterMemberDetails.html";//跳转到租户成员详情页面
        }
    });
    //删除成员
  
    //删除成员
    $(".renterMemberList").on("click","tr td button",function () {
        var apptoken=localStorage.getItem("apptoken");
        var garden_code=$(this).attr("value");
        var room_num=$(this).attr("title");
        var application_id=$(this).parent().attr("title");
        var city_id=$(this).parent().attr("value");
        var data=["",JSON.stringify({"apptoken":apptoken,"application_id":application_id,"city_id":city_id,"garden_code":garden_code,"room_num":room_num})];
        var jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"UserCenter_ownerDelNum",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                console.log(data);
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcoode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    showHide(data.errmsg)
                }else{
                    showHide(data.errmsg)
                }
            }
        });
        return false;
    });
});