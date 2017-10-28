$(document).ready(function(){
    "use strict";
    //功能1 获取群列表
    var getGroupUser=function(){
        //获取群号码
        var group_num=localStorage.getItem("group_num"),
            //获取apptoken
            apptoken=localStorage.getItem("apptoken"),
            //数据格式转换
            data=["",JSON.stringify({"group_num":group_num,"apptoken":apptoken})],
            //数据加密
            jsonEncryptData=jsEncryptData(data);
        $.ajax({
            url:url+"group_getGroupUser",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                //解密数据
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    console.log(1);
                    localStorage.setItem("apptoken",data.apptoken);
                    var ueserNum="",
                     manegeNum="",
                     manege="",
                     user="";
                    $.each(data.data.Number_data,function(i,item){
                        if(item.role==1||item.role==2){
                            console.log(item);
                            manege+=`
                <div class="weui-cells weui-cells_checkbox ">
                    <label class="weui-cell weui-check__label" for="${item.user_code}">
                        <div class="weui-cell__hd">
                            <input type="radio" class="weui-check" name="checkbox1" id="${item.user_code}" >
                            <i class="weui-icon-checked"></i>
                        </div>
                        <div class="weui-cell__bd">
                            <div class="weui-panel__bd">
                                <div  class="weui-media-box weui-media-box_appmsg">
                                    <div class="weui-media-box__hd">
                                        <img class="weui-media-box__thumb" src="${item.portrait}">
                                    </div>
                                    <div class="weui-media-box__bd">
                                        <h4 class="weui-media-box__title">${item.nickname}</h4>
                                        <p class="weui-media-box__desc"></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </label>
                </div>
                    `;
                            manegeNum=i+1;
                        }else{
                            user+=`
                <div class="weui-cells weui-cells_checkbox ">
                    <label class="weui-cell weui-check__label" for="${item.user_code}">
                        <div class="weui-cell__hd">
                            <input type="radio" class="weui-check" name="checkbox1" id="${item.user_code}" >
                            <i class="weui-icon-checked"></i>
                        </div>
                        <div class="weui-cell__bd">
                            <div class="weui-panel__bd">
                                <div  class="weui-media-box weui-media-box_appmsg">
                                    <div class="weui-media-box__hd">
                                        <img class="weui-media-box__thumb" src="${item.portrait}">
                                    </div>
                                    <div class="weui-media-box__bd">
                                        <h4 class="weui-media-box__title">${item.nickname}</h4>                                                        <p class="weui-media-box__desc"></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </label>
                </div>
                        `;
                            ueserNum=i+1;
                        }
                    });
                    $(".manegeList").html(manege);
                    $(".userList").html(user);
                    $(".manageNum span").append(manegeNum);
                    $(".userNum span").append(ueserNum);
                    console.log(2);
                }
            }

        });
    };getGroupUser();
    //功能2 显示隐藏
    $(".LinkBtn").click(function(){
        console.log($(this));
        if($(this).next().is(":hidden")){
            $(this).next().show();
            $(this).children(".weui-cell__hd").children("img").css("transform","rotate(90deg)");
        }else{
            $(this).next().hide();
            $(this).children(".weui-cell__hd").children("img").removeAttr("style")
        }
    });
    //功能2 转让群
    $(".affirmBtn").click(function(){
        var success=$(".success");
        var hideTop=function(){
            success.empty();
        };
        // 获取群号
        var group_num=localStorage.getItem("group_num"),
        // 获取用户code
            user_code=$('input:radio[name="checkbox1"]:checked').attr("id"),
        // 获取apptoken
            apptoken=localStorage.getItem("apptoken"),
        // 数据格式转换
        data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num,"user_code":user_code})],
        // 数据加密
        jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"group_setGroupManager",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                // 解密
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    var html=`
                     <p style="text-align: center;background: green;font-size: 15px">${data.errmsg}</p>
                    `;
                    success.html(html);
                    setTimeout(hideTop,3000);
                }else{
                    var html=`
                     <p style="text-align: center;background: green;font-size: 15px">${data.errmsg}</p>
                    `;
                    $(".success").html(html);
                    setTimeout(hideTop,3000);

                }
            }
        })
    });
    //单选框取消功能
    $(".linkList .weui-cells .weui-cell .weui-cell__hd input:radio").click(function(){
        var domName = $(this).attr('name');//获取当前单选框控件name 属性值
        console.log(domName);
        var checkedState = $(this).attr('checked');//记录当前选中状态
        $("input:radio[name='" + domName + "']").attr('checked',false);//1.
        $(this).attr('checked',true);//2.
        if(checkedState == 'checked'){
            $(this).attr('checked',false); //3.
        }
    });
});