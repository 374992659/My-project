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
                    <tr title="${item.application_id}">
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
    })
});