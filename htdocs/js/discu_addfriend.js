$(document).ready(function(){"use strict";
    //���غ��ѷ���
        var getGroup=function(){
            //��ȡapptoken
            var apptoken=localStorage.getItem("apptoken"),
                //����ת��
                data=["",JSON.stringify({"apptoken":apptoken})],
                //����
                jsonEncryptData=jsEncryptData(data);
            console.log(data);
            $.ajax({
                url:url+"friends_getGroup",
                type:"POST",
                data:{"data":jsonEncryptData},
                success:function(data){
                    //����
                    data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        localStorage.setItem("apptoken",data.apptoken);
                        var html="";
                        $.each(data.data,function(i,item){
                            html+=`
            <div class="linkman" title="${item.group_id}">
                <!--�ҵĺ���-->
                <div class="weui-cells">
                    <div class="weui-cell LinkBtn"  title="${item.group_id}">
                        <div class="weui-cell__hd">
                            <img class="linkBtn" src="image/right.png">
                        </div>
                        <div class="weui-cell__bd">
                            <p style="font-size: 12px">${item.group_name}</p>
                        </div>
                        <div class="weui-cell__ft">
                            <span>${item.online_num}</span>/<span>${item.total}</span>
                        </div>
                    </div>
                    <!--�ҵĺ��Ѹ���-->
                    <div class="weui-panel weui-panel_access linkList" style="display: none">
                     <!--����λ��-->
                    </div>
                </div>
            </div>
                            `;
                        });
                        $(".friendList").append(html);
                    }else{
                        console.log(data.errmsg);
                    }
                },
                error:function(){}

            })
        };getGroup();

    $(".friendList").on("click",".linkman .weui-cells . LinkBtn",function(){
        //���غ��ѷ����µĺ���
        //    ��ȡapptoken
            var apptoken=localStorage.getItem("apptoken"),
        //    ��ȡ����id
                group_id=$(this).attr("tilte"),
        //���ݸ�ʽת��
                data=["",JSON.stringify({"apptoken":apptoken,"group_id":group_id})],
        //        ����
                jsonEncryptData=jsEncryptData(data);
        console.log();
        $.ajax({
            url:url+"friends_getGroupFriends",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                //����
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    var html="";
                    $.each(data.data,function(i,item){
                        if(item.group_id==group_id){
                            html+=`
                        <div class="weui-cells weui-cells_checkbox">
                            <label class="weui-cell weui-check__label" for="s1">
                                <div class="weui-cell__hd">
                                    <input type="checkbox" class="weui-check" name="checkbox1" id="s1" title="${item.friend_user_code}">
                                    <i class="weui-icon-checked"></i>
                                </div>
                                <div class="weui-cell__bd">
                                    <div class="weui-panel__bd">
                                        <div  class="weui-media-box weui-media-box_appmsg">
                                            <div class="weui-media-box__hd">
                                                <img class="weui-media-box__thumb" src="${item.friend_portrait}">
                                            </div>
                                            <div class="weui-media-box__bd">
                                                <h4 class="weui-media-box__title">${item.friend_nickname}</h4>
                                                <!--<p class="weui-media-box__desc">����˵��</p>-->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </label>
                        </div>
                        `
                        }
                    });
                    $(".linkList").append(html);
                }else{
                console.log(data.errmsg);
                }
            },
            error:function(){}


        });
        //�����б����ʾ����
        console.log($(this));
        if($(this).next().is(":hidden")){
            $(this).next().show();
            $(this).children(".weui-cell__hd").children("img").css("transform","rotate(90deg)");
        }else{
            $(this).next().hide();
            $(this).children(".weui-cell__hd").children("img").removeAttr("style")
        }
    });

    //��Ӻ���

});