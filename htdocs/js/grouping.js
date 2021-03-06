$(document).ready(function(){
    "use strict";
    //  获取好友分组接口
    var group=function(){
        var apptoken=localStorage.getItem("apptoken");
        var  data=["",JSON.stringify({"apptoken":apptoken})];
        console.log(data);
        var jsonEncryptData=jsEncryptData(data);
        console.log(apptoken);
        $.ajax({
            url:url+"friends_getGroup",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
//              解密获取的数据
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    var html="";
                    $.each(data.data,function(i,item){
                        html+=`
            <div class="weui-cell">
                <div class="weui-cell__hd"><img src=""></div>
                <div class="weui-cell__bd">
                     <div class="weui-cell__bd">
                         <input class="weui-input" style="color:black" type="text" placeholder="" value="${item.group_name}">
                     </div>
                </div>
                <button class="delBtn"  style="" title="${item.id}">删除</button>
                <button class="alterBtn" style="" title="${item.id}">确认修改</button>
            </div>
                        `
                    });
                    $(".groupList").html(html);
                }else{
                     showHide(data.errmsg)
                }
            }
        });
    };group();

//   功能1 删除好友分组
    $(".groupList").on("click"," .weui-cell .delBtn",function(e){
        console.log(132);
        //获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        //获取当前group_id
        var group_id=$(e.target).attr("title");
        //数据转换
        var  data=["",JSON.stringify({"apptoken":apptoken,"group_id":group_id})];
        console.log(data);
        //数据加密
      var  jsonEncryptDate=jsEncryptData(data);
        console.log(jsonEncryptDate);
        if(confirm("确认删除?")){
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
                    }else{
                       showHide(data.errmsg)
                    }
                }
            });
        }

    });
//   功能2 新建好友分组
    $(".addGroupBtn").click(function(){
        var apptoken=localStorage.getItem("apptoken");
//   获取好友分组名字
        var groupName= $(".groupName").val();
        var data=["",JSON.stringify({"group_name":groupName,"apptoken":apptoken})];
//                对名字进行加密
        var jsonEncryptData=jsEncryptData(data);
//        向后台传送数据
        if(groupName){
            $.ajax({
                url:url+"friends_addGroup",
                type:"POST",
                data:{"data":jsonEncryptData},
                success:function(data){
                    //数据解密
                    data=jsDecodeData(data);
                    if(data.errcode===0){
                        localStorage.setItem("apptoken",data.apptoken);
                        console.log(data.errmsg);
                        group();
                        showHide(data.errmsg)
                    }else{
                        showHide(data.errmsg)
                    }
                }
            });
        }else{
            showHide("请输入分组名称")
        }
      });
    //  功能3修改好友分组
    $(".groupList").on("click",".weui-cell .alterBtn",function(e){
        console.log(123);
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken"),
            // 分组id
            group_id=$(this).attr("title"),
            // 新分组名字
            group_name=$(e.target).parent().find("input").val();
        // 数据格式转换
        var data=["",JSON.stringify({"apptoken":apptoken,"group_id":group_id,"group_name":group_name})];
        console.log(data);
        // 加密
        var jsonEncryptData=jsEncryptData(data);
        if(group_name){
            $.ajax({
                url:url+"friends_editGroup",
                type:"POST",
                data:{"data":jsonEncryptData},
                success:function(data){
                    // 解密
                    data=jsDecodeData(data);
                    if(data.errcode===0){
                        console.log(data);
                        localStorage.setItem("apptoken",data.apptoken);
                        group();
                        showHide(data.errmsg)
                    }else{
                        showHide(data.errmsg)
                    }
                }
            })
        }else{
            showHide("必须有分组名字");
        }
    });
    // $(function(){
    //     pushHistory();
    //     window.addEventListener("popstate", function(e) {
    //         window.location.href="index.html";
    //     }, true);
    //     function pushHistory() {
    //         var state = {
    //             title: "title",
    //             url: "#"
    //         };
    //         window.history.pushState(state, "title", "#");
    //     }
    // });

});