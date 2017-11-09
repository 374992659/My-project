$(document).ready(function(){
    // 获取apptoken
        var apptoken=localStorage.getItem("apptoken");
    // 获取id
       var id=localStorage.getItem("personalRenZID");
       console.log(id);
       // 数据格式转换
        var data=["",JSON.stringify({"apptoken":apptoken})];
       //  加密
      var jsonEncryptData=jsEncryptData(data);
      console.log(data);
      $.ajax({
          url:url+"UserCenter_getMyOwnerApplicationInfo",
          type:"POST",
          data:{"data":jsonEncryptData},
          success:function(data){
              // 解密
              var data=jsDecodeData(data);
              var result=data.data;
              console.log(data);
              console.log(result);
              if(data.errcode===0){
                  console.log(1);
                  localStorage.setItem("apptoken",data.apptoken);
                  $.each(result,function(i,item){
                      console.log(item);
                      if(item.id===id){
                          console.log(3);
                          var html=`
                     <!--姓名-->
    <div class="weui-cells">
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <label class="left">名字：</label>
                <span>${item.real_name}</span>
            </div>
        </div>
    </div>
    <!--电话-->
    <div class="weui-cells">
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <label class="left">电话：</label>
                <span>${item.phone}</span>
            </div>
        </div>
    </div>
    <!--房号-->
    <div class="weui-cells">
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <label class="left">房号：</label>
                <span>${item.room_num}</span>
            </div>
        </div>
    </div>
    <!--关系-->
    <div class="weui-cells">
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <label class="left">关系：</label>
                <span class="relation">${item.relation_name}</span>
            </div>
        </div>
    </div>
    <!--小区名-->
    <div class="weui-cells">
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <label class="left">小区名：</label>
                <span>${item.garden_name}</span>
            </div>
        </div>
    </div>
    <!--小区地址-->
    <div class="weui-cells">
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <label class="left">小区地址：</label>
                <span>${item.garden_addr}</span>
            </div>
        </div>
    </div>
    <!--身份证-->
    <div class="weui-cells">
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <label class="left">身份证：</label>
                <span>${item.id_card_num}</span>
            </div>
        </div>
    </div>
    <!--门禁二维码-->
    <div class="weui-cells">
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <label class="left" style="vertical-align: top">门禁二维码：</label>
                <img src="image/firenda.jpg" alt="" style="width: 59%;" >
            </div>
        </div>
    </div>
    <!--证件照-->
    <div class="weui-cells">
        <div class="weui-cell">
            <div class="weui-cell__bd papersPic">
                <label class="left" style="vertical-align: top">证件照：</label>
                <!--<img src="image/firenda.jpg" alt="" >-->
                <!--<img src="image/firenda.jpg" alt="" >-->
            </div>
        </div>
    </div>
    <!--小区照片-->
    <div class="weui-cells">
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <label class="left" style="vertical-align: top">小区照片：</label>
                <div class="likes plotPic">
                    <!--<img src="image/firenda.jpg" alt="" >-->
                    <!--<img src="image/firenda.jpg" alt="" >-->
                    <!--<img src="image/firenda.jpg" alt="" >-->
                    <!--<img src="image/firenda.jpg" alt="" >-->
                </div>
            </div>
        </div>
    </div>
    <!--个人照片-->
    <div class="weui-cells">
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <label class="left" style="vertical-align: top">个人照片：</label>
                <div class="likes myPic">
                    <!--<img src="image/firenda.jpg" alt="" >-->
                    <!--<img src="image/firenda.jpg" alt="" >-->
                    <!--<img src="image/firenda.jpg" alt="" >-->
                    <!--<img src="image/firenda.jpg" alt="" >-->
                </div>
            </div>
        </div>
    </div>                                   
                  `;
                  // 循环证件照
                          var id_card_pictures="";
                          var obj = eval('(' + item.id_card_pictures + ')');
                          $.each(obj,function(i,item){
                              id_card_pictures+=`
                              <img src="http://wx.junxiang.ren/project/${item}" alt="" >
                              `
                          });
                  //循环小区照片
                  var plotPic="";
                  //将json字符串转换成数组
                  var garden_picture=eval('(' + item.garden_picture + ')');
                  $.each(garden_picture,function(i,item){
                      plotPic+=`
                      <img src="${item}" alt="" >
                      `
                  });
                    //循环个人照片
                  var myPic="";
                        var myPicObj=eval('('+item.yourself_picture+')');
                        if(myPicObj){
                            $.each(myPicObj,function(i,item){
                                myPic+=`
                                 <img src="http://wx.junxiang.ren/project/${item}" alt="" >                               
                                `
                            });
                        }
                      }
                      $(".RenZdetails").html(html);
                      $(".papersPic").append(id_card_pictures);
                      $(".plotPic").append(plotPic);
                      $(".myPic").append(myPic);
                  });
                  var relation=$(".relation");
                  if(relation.text()==="null"){
                      relation.html("本人");
                  }
              }
          },
          error:function(){}
      })
});