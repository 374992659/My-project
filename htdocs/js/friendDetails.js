$(document).ready(function(){
    //获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    var user_code=localStorage.getItem("user_code");
    var data=["",JSON.stringify({"apptoken":apptoken})];
    var jsonEncryptData=jsEncryptData(data);
    var group_id="";
   //功能一 获取好友资料
    (function () {
        var data=["",JSON.stringify({"apptoken":apptoken,"user_code":user_code})];
        var jsonEncryptData=jsEncryptData(data);
        $.ajax({
            url:url+"friends_getFriendInfo",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                var data=jsDecodeData(data);
                console.log(data);
                var result=data.data;
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    group_id=result.group_id;
                    var httP=result.portrait.split(":")[0];
                    var pic="";
                    if(httP==="http"){
                        pic=result.portrait
                    }else{
                        pic="http://wx.junxiang.ren/project/"+result.portrait
                    }
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
                        </div>
                    </div>
                </div>
                <!--电话-->
                <div class="weui-cells">
                    <div class="weui-cell">
                        <div class="weui-cell__bd">
                            <label class="left">电话：</label>
                            <span>${result.phone}</span>
                        </div>
                    </div>
                </div>              
                <!--修改好友分组-->
                <div class="weui-cells">
                    <div class="weui-cell">
                        <div class="weui-cell__bd">
                            <label class="left">好友分组：</label>
                            <select name="" id="group">
                            </select>
                        </div>
                    </div>
                </div>
                <div class="weui-flex__item">
                    <!--常住小区-->
                    <div class="weui-cells">
                        <div class="weui-cell">
                            <div class="weui-cell__bd">
                                <label class="left">常住小区：</label>
                                <span>${garden}</span>
                            </div>
                        </div>
                    </div>                
                    <!--注册时间-->
                    <div class="weui-cells">
                        <div class="weui-cell">
                            <div class="weui-cell__bd">
                                <label class="left">注册时间：</label>
                                <span>${getLocalTime(result.create_time)}</span>
                            </div>
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
                                  
                                </ul>
                            </div>
                        </div>
                    </div>
                <!--拥有楼盘-->
                <div class="weui-cells">
                        <div class="weui-cell">
                            <div class="weui-cell__bd">
                                <label class="left" style="vertical-align: top">拥有楼盘：</label>
                                <ul class="likes ownerPlot">
                                                                      
                                </ul>
                            </div>
                        </div>
                </div>                    
                <div class="weui-flex">
                      <div class="weui-flex__item"><button  class="weui-btn weui-btn_default delFriend">删除好友</button></div>
                      <div class="weui-flex__item"><button  class="weui-btn weui-btn_primary revampGroup">确认修改</button></div>
                </div>    
                    `
                }
                $("#tab1").html(html);
                $(".ownerPlot").html(house);

                //功能二 获取好友分组
                (function () {
                    $.ajax({
                        url:url+"friends_getGroup",
                        type:"POST",
                        data:{"data":jsonEncryptData},
                        success:function(data){
                            var data=jsDecodeData(data);
                            console.log(data);
                            if(data.errcode===0){
                                var html="";
                                localStorage.setItem("apptoken",data.apptoken);
                                $.each(data.data,function(i,item){
                                    html+=`
                <option title="${item.id}">${item.group_name}</option>>
                             
                `
                                });
                                $("#group").html(html);
                                $("#group").find("option[title=group_id]").attr("selected",true);
                            }
                        }
                    })
                })();

            }
        })
    })();
    //修改好友分组
    (function () {
        $("#tab1").on("click",".weui-flex .weui-flex__item .revampGroup",function () {
            //新分组id
            var id=$("#group option:selected").attr("title");
            var data=["",JSON.stringify({"apptoken":apptoken,"user_code":user_code,"group_id":id})];
            console.log(data);
            var jsonEncryptData=jsEncryptData(data);
            $.ajax({
                url:url+"friends_changeFriendGroup",
                type:"POST",
                data:{"data":jsonEncryptData},
                success:function (data) {
                    var data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        localStorage.setItem("apptoken",data.apptoken);
                        showHide(data.errmsg);
                        window.location.href="index.html";
                    }else{
                        showHide(data.errmsg)
                    }
                }

            })
        })
    })();
    //删除好友
    (function () {
        $("#tab1").on("click",".weui-flex .weui-flex__item .delFriend",function () {
            //新分组id
            var data=["",JSON.stringify({"apptoken":apptoken,"user_code":user_code})];
            console.log(data);
            var jsonEncryptData=jsEncryptData(data);
            if(confirm("删除好友")){
                $.ajax({
                    url:url+"friends_delFriend",
                    type:"POST",
                    data:{"data":jsonEncryptData},
                    success:function (data) {
                        var data=jsDecodeData(data);
                        console.log(data);
                        if(data.errcode===0){
                            localStorage.setItem("apptoken",data.apptoken);
                            showHide(data.errmsg);
                            window.location.href="index.html";
                        }else{
                            showHide(data.errmsg)
                        }
                    }

                })
            }

        })
    })();
});