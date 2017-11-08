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
                console.log(1);
                localStorage.setItem("apptoken",data.apptoken);
                var html="";
                $.each(data.data,function(i,item){
                    console.log(2);
                    if(parseInt(item.status)===0){
                        console.log(3);
                        html+=`
                <td tilte="${item.id}">${item.garden_name}</td>
                    <td>${item.room_num}</td>
                    <td>待审核</td>
                    <td><button>删除</button></td>
                </tr>
                            `
                    }else if(parseInt(item.status)===1){
                        html+=`
                <td tilte="${item.id}">${item.garden_name}</td>
                    <td>${item.room_num}</td>
                    <td>已通过</td>
                    <td><button>删除</button></td>
                </tr>
                            `
                    }else{
                        html+=`
                <td tilte="${item.id}">${item.garden_name}</td>
                    <td>${item.room_num}</td>
                    <td>已拒绝</td>
                    <td><button>删除</button></td>
                </tr>
                            `
                    }
                });
                $(".RZlist").append(html);
            }
        },
        error:function(){}
    })
});