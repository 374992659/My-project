$(document).ready(function(){
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken"),
    // 数据格式转换
     data=["",JSON.stringify({"apptoken":apptoken})],
    // 加密
     jsonEncryptData=jsEncryptData(data);
    console.log(data);
    $.ajax({
        url:url+"UserCenter_getMyOwnerApplicationInfo",
        type:"POST",
        data:{"data":jsonEncryptData},
        success:function(data){
            // var 解密
            var data=jsDecodeData(data);
            console.log(data);
            if(data.errcode===0){
                localStorage.setItem("apptoken",data.apptoken);
                var html="";
                $.each(data.data,function(i,item){
                    if(parseInt(item.status)==0){
                        console.log(3);
                        html+=`
                <tr tilte="${item.id}">
                    <td>${item.garden_name}</td>
                    <td>${item.room_num}</td>
                    <td>待审核</td>
                    <td><button title="${item.id}">删除</button></td>
                </tr>
                            `
                    }else if(parseInt(item.status)===1){
                        console.log(4);
                        html+=`
                <tr tilte="${item.id}" class="renZdetails">
                    <td >${item.garden_name}</td>
                    <td>${item.room_num}</td>
                    <td style="color: green">已通过</td>
                    <td><button title="${item.id}">删除</button></td>
                </tr>
                            `
                    }else{
                        html+=`
                <tr tilte="${item.id}">
                    <td>${item.garden_name}</td>
                    <td>${item.room_num}</td>
                    <td style="color: red">已拒绝</td>
                    <td><button title="${item.id}">删除</button></td>
                </tr>
                            `
                    }
                });
                $(".RZlist").append(html);
            }
        },
        error:function(){}
    });
    $(".RZlist").on("click",".renZdetails",function(e){
        // 获取认证id
      var  renZ_ID=$(this).attr("tilte");
      // 保存在本地在认证详情页面提取
    localStorage.setItem("personalRenZID",renZ_ID);
    window.location.href="myRenZdetails.html";
    });
    //删除我的认证
    $(".RZlist").on("click",".renZdetails td button",function () {
        var apptoken=localStorage.getItem("apptoken");
        var id=parseInt($(this).attr("title"));
        var type=1;
        var data=["",JSON.stringify({"apptoken":apptoken,"application_id":id,"type":type})];
        var jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"UserCenter_delApplication",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
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
    })
});