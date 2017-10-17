
$(document).ready(function(){
    "use strict";
    $(".particpation").click(function(){
        //获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        //当前的群类型title
        var title=$(this).attr("title");
        console.log(title);
        //数据格式转换
       var data=["",JSON.stringify({"apptoken":apptoken,"value":title})];
        //数据加密
        console.log(data);
       var jsonEncryptDate=jsEncryptData(data);
        //发起ajax请求
        $.ajax({
            url:url+"group_getMyGroup",
            type:"POST",
            data:{"data":jsonEncryptDate},
            success:function(data,e){
                //数据解密
              var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    console.log(123);
                    localStorage.setItem("apptoken",data.apptoken);
                    var html="";
                    $.each(data.data,function(i,item){
                        console.log(item);
                            html+=`
                        <div class="weui-media-box weui-media-box_appmsg saveGroupNum" title="${item.group_num}">
                            <div class="weui-media-box__hd" style="width:50px;height: 50px;border-radius: 50px;overflow: hidden">
                                <img style="width: 50px;height: 50px" class="weui-media-box__thumb " src="http://wx.junxiang.ren/project/${item.group_portrait}" alt="" >
                            </div>
                            <div class="weui-media-box__bd">
                                <h4 class="weui-media-box__title" style="font-size: 15px">${item.group_name}</h4>
                                <p class="weui-media-box__desc">${item.group_type_name}</p>
                            </div>
                        </div>
                            `
                    });
                    var groupList=$(this).find(".groupList");
                    groupList.append(html);
                    console.log(groupList);
                    var img=$(this).find(".imgBtn");
                    console.log(img);
                    if(groupList.is(":hidden")){
                        console.log(1);
                        groupList.show();
                        img.css("transform","rotate(90deg)");
                    }else{
                        console.log(2);
                        groupList.hide();
                        img.removeAttr("style");
                    }
                    console.log(3);
                }else{
                    console.log(data.errmsg);
                }
            }
        })
    });
    // 跳转页面之前保存群号码
    $(".groupList").on("click",".saveGroupNum",function(){
        console.log(132);
        // 获取当前group_num群号码
        var groupCode=$(this).attr("title");
        console.log(groupCode);
        // 存在本地
        localStorage.setItem("group_num",groupCode);
        window.location.href="flockChat.html";
    });
    //<!--我创建的群-->
  //  $(".creaFlock").click(function(){
  //    console.log(123);
  //    if($(".myCreate").is(":hidden")){
  //          $(".myCreate").show();
  //        $(".creaFlBtn").css("transform","rotate(90deg)");
  //      }else{
  //         $(".myCreate").hide();
  //           $(".creaFlBtn").removeAttr("style");
  //      }
  //  });
  //   //<!--我管理的群-->
  //  $(".manageFlock").click(function(){
  //      if($(".myManage").is(":hidden")){
  //           $(".myManage").show();
  //           $(".manageFlBtn").css("transform","rotate(90deg)");
  //       }else{
  //         $(".myManage").hide();
  //         $(".manageFlBtn").removeAttr("style");
  //      }
  //   });
  //
  //   //<!--我加入的群-->
  // $(".joinFlock").click(function(){
  //     if($(".myJoin").is(":hidden")){
  //          $(".myJoin").show();
  //           $(".joinFlBtn").css("transform","rotate(90deg)");
  //       }else{
  //          $(".myJoin").hide();
  //     }
  //   });

});
