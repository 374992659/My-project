$(document).ready(function(e){
//   功能1 删除好友分组
    $(".groupList .weui-cell").on("click","delBtn",function(){
        //获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        //获取当前group_id
        var group_id=$(e.target).parent().attr("title");
        //数据转换
        var  data=["",JSON.stringify({"apptoken":apptoken,"group_id":group_id})];
        console.log(data);
        //数据加密
        jsonEncryptDate=jsEncryptData(data);
        console.log(jsonEncryptDate);
        $.ajax({
            url:url+"friends_delGroup",
            type:"POST",
            data:{"data":jsonEncryptDate},
            success:function(data){
            //数据解密
                data=jsDecodeData(data);
            if(data.errcode===0){
                localStorage.setItem("apptoken",data.apptoken);
                $(e.target).parent().remove();
                alert("确认删除?");
                alert("删除成功")
            }else{
                alert("删除失败")
            }
           }

        });


    });
//   功能2 新建好友分组
    $(".addGroupBtn").click(function(){
        var apptoken=localStorage.getItem("apptoken");
        console.log(apptoken);
        console.log(1);
//                请求添加好友分组接口
//                获取好友分组名字
        var groupName= $(".groupName").val();
        console.log(groupName);
//                转换好友名称数据格式
        data=["",JSON.stringify({"group_name":groupName,"apptoken":apptoken})];
//                对名字进行加密
        console.log(data);
         jsonEncryptData=jsEncryptData(data);
//        向后台传送数据
        $.ajax({
            url:url+"friends_addGroup",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                //数据解密
                data=jsDecodeData(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    console.log(data.errmsg)
                }else{
                    console.log(data.errmsg);
                }
            }

        });
//  当创建了新的好友分组后马上请求->获取好友分组接口
        
      var apptoken=localStorage.getItem("apptoken");
      data=["",JSON.stringify({"apptoken":apptoken})];
      jsonEncryptData=jsEncryptData(data);
      console.log(apptoken);
        $.ajax({
            url:url+"friends_getGroup",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
//           解密获取的数据
                data=jsDecodeData( data );
                console.log(data);
                if(data.errcode===0){
                localStorage.setItem("apptoken",data.apptoken);
                var html="";
                    $.each(data.data,function(i,item){
                        html+=`
                        <div class="weui-cell" title="${item.group_id}">
                            <div class="weui-cell__hd">
                                <img src="">
                            </div>
                            <div class="weui-cell__bd">
                                <p style="font-size: 15px">${item.group_name}</p>
                            </div>
                            <div class="weui-cell__ft" style="font-size: 12px">${item.online_num}/${item.total}</div>
                            <button class="delBtn" style="margin-left: 10px">删除</button>
                        </div>
                        `
                    });
                    $(".groupList").html(html);
                    $(document).on('click','#show-success',function(){
                            $.toptip('操作成功', 'success');
                        });
                }else{
                    console.log(data.errmsg)
                }
            }

        });
    });
});