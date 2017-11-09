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
                    console.log(item);
                    $.each(item,function(i,item){
                        console.log(item);
                        html+=`
                    <tr title="${item.application_id}" value="${item.city_id}" class="renterList">
                        <td>${item.real_name}</td>
                        <td>${item.relation_name}</td>
                        <td>2017.03.3</td>
                        <td><button>删除</button></td>
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
    })
});