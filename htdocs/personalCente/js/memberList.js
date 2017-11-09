$(document).ready(function(){
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    // 数据格式转换
    var data=["",JSON.stringify({"apptoken":apptoken})];
    // 加密
    var jsonEncryptData=jsEncryptData(data);
    console.log(data);
    $.ajax({
        url:url+"UserCenter_getMyOwnRoomNum",
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
                        html+=`                   
        <tr title="${item.application_id}" value="${item.city_id}">
            <td>${item.real_name}</td>
            <td class="relation">${item.relation_name}</td>
            <td>2017.03.3</td>
            <td><button>删除</button></td>
        </tr>
                    
                    `
                    });
                });
                $(".memberList").append(html);
               var relation=$(".relation");
               console.log(relation.text());
               $.each(relation.text(),function(i,item){
                   if(item===null){
                       relation.html("本人")
                   }
               });
               
            }
        },
        error:function(){}
    });
    // 页面跳转保存数据
    $(".memberList").on("click","tr",function(){
        // 获取当前的city_id
        var city_id=$(this).attr("value");
        // 获取application_id
        var application_id=$(this).attr("title");
        // 存在本地下一个跳转页面用
        localStorage.setItem("personalCity_id",city_id);
        localStorage.setItem("application_id",application_id);
        window.location.href="owenerMemberDetails.html";//跳转到成员业主认证详情页面
    })
});