$(document).ready(function(){
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        // 数据格式转换
        var data=["",JSON.stringify({"apptoken":apptoken})];
        // 加密
        var jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"UserCenter_getMyTenantApplicationInfo",
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
                        if(parseInt(item.status)===0){
                            html+=`
                        <tr title="${item.id}">
                            <td>${item.garden_name}</td>
                            <td>${item.room_num}</td>
                            <td style="color: red">待审核</td>
                            <td><button>删除</button></td>
                        </tr> 
                         `
                        }else if(parseInt(item.status)===1){
                            html+=`
                        <tr title="${item.id}">
                            <td>${item.garden_name}</td>
                            <td>${item.room_num}</td>
                            <td style="color: green">认证通过</td>
                            <td><button>删除</button></td>
                        </tr> 
                         `
                        }else{
                            html+=`
                        <tr title="${item.id}">
                            <td>${item.garden_name}</td>
                            <td>${item.room_num}</td>
                            <td style="color: red">认证拒绝</td>
                            <td><button>删除</button></td>
                        </tr> 
                         `
                        }
                    });
                    $(".renterRZlist").append(html);
                }

            },
            error:function(){}
        })
    });