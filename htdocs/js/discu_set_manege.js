$(document).ready(function(){
    //��ȡȺ����
    var code="";
    //��ȡapptoken
    var apptoken=localStorage.getItem("apptoken");
    //���ݸ�ʽת��
    data=["",JSON.stringify({"group_num":code,"apptoken":apptoken})];
    //���ݼ���
    $.ajax({
        url:url+"group_getGroupUser",
        type:"POST",
        data:{"data":data},
        success:function(data){
            //��������
            data=jsDecodeData(data);
            console.log(data);
            if(data.errcode===0){
                localStorage.setItem("apptoken",data.apptoken);
                var htmlAdministrator="";
                var htmlMember="";
                $.each(data.data,function(i,item){
                    if(item.role==1||item.role==2){
                        htmlAdministrator+=`
                    <div  class="weui-media-box weui-media-box_appmsg" title="${item.user_code}">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" src="image/2.jpg">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title">�ǳ�</h4>
                            <p class="weui-media-box__desc">�ɸ���������ɵľ�����״���壬��������������һ������״�����Լ������й����</p>
                        </div>
                        <button class="setBtn">����</button>
                    </div>
                    `
                    }else{
                        htmlMember+=`
                    <div  class="weui-media-box weui-media-box_appmsg" tiltle="${item.user_code}">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" src="image/2.jpg">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title">�ǳ�</h4>
                            <p class="weui-media-box__desc">�ɸ���������ɵľ�����״���壬��������������һ������״�����Լ������й����</p>
                        </div>
                        <button class="setBtn">���</button>
                    </div>
                        `
                    }
                });
                $(".administrator").html(htmlAdministrator);
                $(".member").html(htmlMember);
            }
        }

    });

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
    //������ ���ù���Ա
    $(".linkman").on(".setBtn","click",function(){
        //��ȡgroup_num Ⱥ����
        var code="";
        //��ȡuser_code �û�code
        var title=$(this).attr("title");
        //��ȡapptoken
        var apptoken=localStorage.getItem("apptoken");
        //���ݸ�ʽת��
        data=["",JSON.stringify({"group_num":code,"user_code":title,"apptoken":apptoken})];
        //���ݼ���
        jsonEncryptData=jsEncryptData(data);
        //����ajax����
        $.ajax({
            url:url+"group_setGroupManager",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                //��������
                data=jsDecodeData(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    window.location.reload()
                }else{
                    alert(data.errmsg);
                }
            }
        })
    })
});