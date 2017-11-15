$(document).ready(function(){
    "use strict";
    //��ȡapptoken
    var apptoken=localStorage.getItem("apptoken");
    //city_id ����id
    var city_id=localStorage.getItem("city_id");
    //������garden_code С��code ����
    var garden_code=2017113;
    //��ȡ���id
    var adID=localStorage.getItem("adID");
    //���ݸ�ʽת��
   var data=["",JSON.stringify({"apptoken":apptoken,"city_id":city_id,"garden_code":garden_code})];
    //����
    var jsonEncryptData=jsEncryptData(data);
    console.log(data);
    $.ajax({
        url:url+"Subject_getAdList",
        type:"POST",
        data:{"data":jsonEncryptData},
        success:function(data){
            //����
            var data=jsDecodeData(data);
            console.log(data);
            var html="";
            $.each(data.data,function(i,item){
                console.log(item);
                if(item.adverse_id===adID){
                    html=`
                    <h4 class="weui-media-box__title" style="text-align: center;font-size: 15px">${item.title}</h4>
            <p class="weui-media-box__desc">
               ${item.content}
            </p>
            <ul class="weui-media-box__info" style="font-size: 12px">
                <li class="weui-media-box__info__meta">������Դ <span>����</span></li>
                <li class="weui-media-box__info__meta">ʱ�� <span>${item.create_time}</span></li>
            </ul>
            <ul class="weui-media-box__info share" style="font-size: 12px;color: blue;text-align: right">
                <li class="weui-media-box__info__meta">����</li>
                <li class="weui-media-box__info__meta">������ <span>2017.12.05</span></li>
                <li class="weui-media-box__info__meta">�Ķ��� <span>1</span></li>
            </ul>
                    `;
                }

            });
            $(".weui-media-box").html(html)
        },
        error:function(){}
    })
});

