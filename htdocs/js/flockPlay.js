$(document).ready(function(){
    "use strict";
    // 时间戳转换函数
    function getLocalTime(nS) {
        return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
    }
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken"),
// 获取群号
    group_num=localStorage.getItem("group_num"),
   // 数据格式转换
    data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num})],
   //  加密
 jsonEncryptData=jsEncryptData(data);
  console.log(data);
  $.ajax({
      url:url+"group_getGroupActivityList",
      type:"POST",
      data:{"data":jsonEncryptData},
      success:function(data){
          // 解密数据
          var data=jsDecodeData(data);
          console.log(data);
          if(data.errcode===0){
              localStorage.setItem("apptoken",data.apptoken);
              var html="";

              $.each(data.data,function(i,item){
                  console.log(item.picture);
                  var pictureStr=item.picture;
                  var pictureObj=JSON.parse(pictureStr);
                  $.each(pictureObj,function (i,item) {
                    var pic=  pictureObj[0];
                      console.log(pic);
                  });
                  html+=`
                  <div class="weui-media-box weui-media-box_appmsg storePlay_id" title="${item.activity_id}">
                    <div class="weui-media-box__hd">
                        <img class="weui-media-box__thumb" src="">
                    </div>
                    <div class="weui-media-box__bd">
                        <h4 class="weui-media-box__title" style="font-size: 15px">${item.title}</h4>
                        <div class="weui-media-box__desc" style="font-size: 10px">发起人：<span>${item.nickname}</span></div>
                        <div style="font-size: 10px" class="weui-media-box__desc" >集合时间；<span>${getLocalTime(item.collection_time)}</span></div>
                        <div style="font-size: 10px" class="weui-media-box__desc" >集合地点：<span>${item.collection_place}</span></div>
                    </div>
                </div>
                  `
              });
              $(".flockPlayList").append(html);
          }else{
              console.log(data.errmsg);
          }
      }
  });
    $(".flockPlayList").on("click",".storePlay_id",function(){
        // 获取id
        var activity_id=$(this).attr("title");
        localStorage.setItem("activity_id",activity_id);
        window.location.href="flockPlay_details.html";
    });
});