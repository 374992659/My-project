/**
 * Created by Administrator on 2017/10/14 0014.
 */
$(document).ready(function(){
    "use strict";
    //��ȡapptoken
    var apptoken=localStorage.getItem("apptoken"),
        city_id=localStorage.getItem("city_id"),
        garden_code="";
    //����1 ��ȡȫ�����
    var allAd=function(){
        //���ݸ�ʽת��
        var data=["",JSON.stringify({"apptoken":apptoken,"city_id":city_id," garden_code": garden_code})],
        //����
        jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"Subject_getAdList",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                //����
               var data=jsDecodeData(data);
                if(data.errcode===0){
                    console.log(data);
                    localStorage.setItem("apptoken",data.apptoekn);
                    var allAdList="";
                    $.each(data.data,function(i,item){
                        allAdList+=`
                        <a href="hotTopic_addCon.html" title="${item.adverse_id}"  class="adList">
                            <div class="weui-media-box weui-media-box_text" style="border-bottom:1px solid #b2b2b2;margin-top: 10px ">
                                <h4 class="weui-media-box__title" style="font-size: 13px">${item.title}</h4>
                                <p class="weui-media-box__desc">${item.content}</p>
                            </div>
                        </a>
                        `
                    });
                    $(".allAdList").append(allAdList)
                }
            }
        })
    };allAd();
    //����2 ��ȡ�ҵĹ��
    var myAd=function(){
        //���ݸ�ʽת��
        var data=["",JSON.stringify({"apptoken":apptoken,"city_id":city_id," garden_code": garden_code})],
        //����
            jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"Subject_getMyAdList",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                //����
                var data=jsDecodeData(data);
                if(data.errcode===0){
                    console.log(data);
                    localStorage.setItem("apptoken",data.apptoekn);
                    var myAdList="";
                    $.each(data.data,function(i,item){
                        myAdList+=`
                        <a href="hotTopic_addCon.html" title="${item.adverse_id}"  class="adList">
                            <div class="weui-media-box weui-media-box_text" style="border-bottom:1px solid #b2b2b2;margin-top: 10px ">
                                <h4 class="weui-media-box__title" style="font-size: 13px">${item.title}</h4>
                                <p class="weui-media-box__desc">${item.content}</p>
                            </div>
                        </a>
                        `
                    });
                    $(".myAdList").append( myAdList)
                }
            }
        })
    }; myAd();
    //����3 �������
    $(".addBtn").click(function(){
        pushAd();
    });
    var pushAd=function(){
        var apptoken=localStorage.getItem("apptoken");
        //��ȡ����
        var title=$(".adTitle").val(),
        //��ȡ����
           content=$(".adContent").val(),
         //����id
            city_id="",
            //С��id
            garden_code="";
        $("#city").change(function(){
            city_id=  $(this).val();
        });
        //���ݸ�ʽת��
        var data=["",JSON.stringify({"apptoken":apptoken,"city_id":city_id,"garden_code":garden_code,"title":title,"content":content})];
        //����
        var jsonEncryptData=jsEncryptData(data);
        $.ajax({
            url:url+"Subject_addAd",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                //����
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                   localStorage.setItem("apptoken",data.apptoken);
                    myAd();
                    allAd();
                    $(document).on('click','#show-success',function(){
                        $.toptip('�����ɹ�', 'success');
                    });
                }
            }
        })
    };
});