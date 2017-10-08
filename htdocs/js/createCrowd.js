
$(document).ready(function(){
    $(".particpation").click(function(e){
        //获取当前元素子元素的最后一个子元素
        var groupList=$(this).find(".weui-panel__bd");
        console.log(groupList);
        //获取img
        var Img=$(this).find(".imgBtn");
        console.log(Img);
        //获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        //当前的群类型title
        var title=$(this).attr("title");
        console.log(title);
        //数据格式转换
        data=["",JSON.stringify({"apptoken":apptoken,"value":title})];
        //数据加密
        console.log(data);
        jsonEncryptDate=jsEncryptData(data);
        //发起ajax请求
        $.ajax({
            url:url+"group_getMyGroup",
            type:"POST",
            data:{"data":data},
            success:function(data){
                //数据解密
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    var html="";
                    $.each(data.data,function(i,item){
                        if(item.role==title){
                            html+=`
                        <a href="flockChat.html" class="weui-media-box weui-media-box_appmsg">
                            <div class="weui-media-box__hd" style="width:50px;height: 50px;border-radius: 50px;overflow: hidden">
                                <img class="weui-media-box__thumb " src="${item.group_portrait}" alt="" >
                            </div>
                            <div class="weui-media-box__bd">
                                <h4 class="weui-media-box__title" style="font-size: 15px">${item.group_name}</h4>
                                <p class="weui-media-box__desc">${item.group_type_name}</p>
                            </div>
                        </a>
                            `
                        }
                    });
                    $(".weui-panel__bd").html(html);
                    if(groupList.is(":hidden")){
                                groupList.show();
                               Img.css("transform","rotate(90deg)");
                          }else{
                        groupList.hide();
                        Img.removeAttr("style");
                            }
                }else{
                    alert(data.errmsg);
                }
            }

        })
    });

    //<!--我创建的群-->
    //$(".creaFlock").click(function(){
    //
    //    console.log(123);
    //    if($(".myCreate").is(":hidden")){
    //        $(".myCreate").show();
    //        $(".creaFlBtn").css("transform","rotate(90deg)");
    //    }else{
    //        $(".myCreate").hide();
    //        $(".creaFlBtn").removeAttr("style");
    //    }
    //});
    //<!--我管理的群-->
    //$(".manageFlock").click(function(){
    //    if($(".myManage").is(":hidden")){
    //        $(".myManage").show();
    //        $(".manageFlBtn").css("transform","rotate(90deg)");
    //    }else{
    //        $(".myManage").hide();
    //        $(".manageFlBtn").removeAttr("style");
    //    }
    //});
    //
    //<!--我加入的群-->
    //$(".joinFlock").click(function(){
    //    if($(".myJoin").is(":hidden")){
    //        $(".myJoin").show();
    //        $(".joinFlBtn").css("transform","rotate(90deg)");
    //    }else{
    //        $(".myJoin").hide();
    //        $(".joinFlBtn").removeAttr("style");
    //    }
    //});

});
