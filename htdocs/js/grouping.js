$(document).ready(function(){
//   功能1删除好友分组
    $(".delBtn").click(function(){
        $.ajax({
            url:url+"friends_delGroup",
            type:"POST",
            success:function(data){


            }

        });


    });
//   功能2新建好友分组
    $(".addGroupBtn").click(function(){
        var apptoken=localStorage.getItem(apptoken);
        console.log(apptoken);
        console.log(1);
//                请求添加好友分组接口
//                获取好友分组名字
        var groupName= $(".groupName").val();
        console.log(groupName);
//                转换好友名称数据格式
        groupName=["",JSON.stringify({"groupName":groupName})];
//                对名字进行加密
        var name=jsEncryptData(groupName);
        console.log(name);
//                向后台传送数据
        $.ajax({
            url:url+"friends_addGroup",
            type:"POST",
            data:{"data.group_name":name},
            success:function(data){
                data=jsDecodeData(data);
             localStorage.setItem("apptoken",apptoken);
                if(data.errcode===0){
                    console.log(data.errmsg)
                }else{
                    console.log(data.errmsg);
                }
            }

        });
//              当添加了新的好友分组后马上  请求->获取好友分组接口
        $.ajax({
            url:url+"friends_getGroup",
            type:"POST",
            data:{},
            success:function(data){
                console.log(data);
//                        解密获取的数据
                data=jsDecodeData( data );
                console.log(data);
                if(data.errcode===0){
                    var groupName=data.group_name;
                    for(var i=0;i<groupName.length;i++){
                        var item=$("<div class=\"weui-cell\">\n" +
                            "<div class=\"weui-cell__hd\"><img src=\"\"></div>\n" +
                            "<div class=\"weui-cell__bd\">\n" +
                            "<p style=\"font-size: 15px\">"+groupName[i] +"</p>\n" +
                            "</div>\n" +
                            "<div class=\"weui-cell__ft\" style=\"font-size: 12px\">10/20</div>\n" +
                            "<button class=\"delBtn\" style=\"margin-left: 10px\">删除</button>\n" +
                            "</div>");
                        $(".groupList").append(item);
                    }
                }else{
                    console.log(data.errmsg)
                }
            }

        });
    });
});