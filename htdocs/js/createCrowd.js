
$(document).ready(function(){
    $(".particpation").click(function(){
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
            data:{"data":jsonEncryptDate},
            success:function(data){
                //数据解密
              var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    var html="";
                    $.each(data.data,function(i,item){
                        if(item.role===title){
                            html+=`
                        <a href="flockChat.html" class="weui-media-box weui-media-box_appmsg" title="${item.group_num}">
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
                    $(".groupList").html(html);
                }else{
                    console.log(data.errmsg);
                }
            }

        })
    });

    //<!--我创建的群-->
   $(".creaFlock").click(function(){

     console.log(123);
     if($(".myCreate").is(":hidden")){
           $(".myCreate").show();
         $(".creaFlBtn").css("transform","rotate(90deg)");
       }else{
          $(".myCreate").hide();
            $(".creaFlBtn").removeAttr("style");
       }
   });
    //<!--我管理的群-->
   $(".manageFlock").click(function(){
       if($(".myManage").is(":hidden")){
            $(".myManage").show();
            $(".manageFlBtn").css("transform","rotate(90deg)");
        }else{
          $(".myManage").hide();
          $(".manageFlBtn").removeAttr("style");
       }
    });

    //<!--我加入的群-->
  $(".joinFlock").click(function(){
      if($(".myJoin").is(":hidden")){
           $(".myJoin").show();
            $(".joinFlBtn").css("transform","rotate(90deg)");
        }else{
           $(".myJoin").hide();
      }
    });

});
