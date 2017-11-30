$(document).ready(function(){
    //获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    var user_code=localStorage.getItem("user_code");
    //功能一 获取好友资料
    (function () {
        var data=["",JSON.stringify({"apptoken":apptoken,"user_code":user_code})];
        var jsonEncryptData=jsEncryptData(data);
        $.ajax({
            url:url+"friends_getFriendInfo",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                console.log(data);
                var data=jsDecodeData(data);
                console.log(data);
                var result=data.data;
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    group_id=result.group_id;
                    var hide_field=result.hide_field;

                    var httP=result.portrait.split(":")[0];
                    var pic="";
                    if(httP==="http"){
                        pic=result.portrait
                    }else{
                        pic="http://wx.junxiang.ren/project/"+result.portrait
                    }
                    //判断哪些资料以及隐藏
                    if(hide_field){
                        var hide_fieldArr=result.hide_field.split(",");
                    }
                    console.log(typeof hide_fieldArr);
                    //拥有楼盘
                    var house="";
                    if(result.user_garden){
                        console.log("拥有楼盘");
                        $.each(result.user_garden,function(i,item){
                            house+=`
                             <li>${item}</li>
                            `
                        });
                    }
                    var garden="";
                    if(result.default_garden){
                        console.log("常住小区");
                        var a=JSON.parse(result.default_garden);
                        $.each(a,function (i,item) {
                            garden=item;
                        })
                    }
                    console.log(garden);
                    html=`
                <div style="text-align: center">
                    <img src="${pic}" alt="" style="width: 80px">
                    <div>
                        昵称：<span>${result.nickname}</span>
                    </div>
                   
                </div>
                <div class="weui-cells">
                    <div class="weui-cell">
                        <div class="weui-cell__bd">
                            <label class="left">名字：</label>
                            <span>${result.realname}</span>
                            <button class="right" value="realname">隐藏</button>
                        </div>
                    </div>
                   
                </div>
                <!--电话-->
                <div class="weui-cells">
                    <div class="weui-cell">
                        <div class="weui-cell__bd">
                            <label class="left">电话：</label>
                            <span>${result.phone}</span>
                            <button class="right" value="phone" title="0">隐藏</button>
                        </div>
                    </div>
                
                </div>                          
               
                    <!--常住小区-->
                    <div class="weui-cells">
                        <div class="weui-cell">
                            <div class="weui-cell__bd">
                                <label class="left">常住小区：</label>
                                <span>${garden}</span>
                                <button class="right" value="default_garden" title="0">隐藏</button>
                            </div>
                        </div>
                    </div>                
                    <!--注册时间-->
                    <div class="weui-cells">
                        <div class="weui-cell">
                            <div class="weui-cell__bd">
                                <label class="left">注册时间：</label>
                                <span>${getLocalTime(result.create_time)}</span>
                                <button class="right" value="create_time" title="0">隐藏</button>
                            </div>
                        </div>
                       
                    </div>
               
                <!--喜好-->
                <div class="weui-cells">
                        <div class="weui-cell">
                            <div class="weui-cell__bd">
                                <label class="left" style="vertical-align: top">喜好：</label>
                                <ul class="likes">
                                    <li>${result.hobby}</li> 
                                    <li>asd asd </li>      
                                    <li>asd asd </li>                         
                                </ul>
                                <button class="right" value="hobby" title="0">隐藏</button>
                            </div>
                        </div>
                      
                    </div>
                <!--拥有楼盘-->
                <div class="weui-cells">
                        <div class="weui-cell">
                            <div class="weui-cell__bd">
                                <label class="left" style="vertical-align: top">拥有楼盘：</label>
                                <ul class="likes ownerPlot">
                                                   <li>asd </li>  
                                                   <li>asd asd asd </li>  
                                                   <li>asd as d</li>               
                                </ul>
                                <button class="right" value="user_garden" title="0">隐藏</button>
                            </div>
                        </div>                     
                </div>                    
                <div class="weui-flex">
                     
                      <div class="weui-flex__item"><button  class="weui-btn weui-btn_primary revampGroup">确认</button></div>
                </div>    
                    `
                }
                $("#tab1").html(html);
                $(".ownerPlot").html(house);
                $.each(hide_fieldArr,function (i,item) {
                    console.log(item);
                });
            }
        })
    })();
    $("#tab1").on("click",".weui-cells .weui-cell .weui-cell__bd button",function () {
        // 获取button内容
       var content= $(this).text();
       if(content==="隐藏"){
           $(this).text("显示");
           $(this).attr("title","1");
       }else{
           $(this).text("隐藏");
           $(this).attr("title","0");
       }
       console.log(content);
    });
    $("#tab1").on("click",".weui-flex .weui-flex__item .revampGroup",function () {
        // 找到所有button
       var allBut= $("#tab1").find("button");
        hide_field="";
       allBut.each(function (i,item) {
           var that=$(this).attr("title");
           if(parseInt(that)===1){
               if(!hide_field){
                   hide_field+=$(this).attr("value");
               }else{
                   hide_field+=","+$(this).attr("value");
               }
           }

       });
       console.log(hide_field);
        var apptoken=localStorage.getItem("apptoken");
        var data=["",JSON.stringify({"apptoken":apptoken,"hide_field":hide_field})];
        var jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"friends_settingHideField",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);

                }else{

                }

            }


        })
    });
});