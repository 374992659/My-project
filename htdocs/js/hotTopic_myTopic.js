/**
 * Created by Administrator on 2017/10/14 0014.
 */
$(document).ready(function(){
    "use strict";
    //��ȡapptoken
    var apptoken=localStorage.getItem("apptoken"),
    //��ʽת��
    data=["",JSON.stringify({"apptoken":apptoken})];
    //����
    var jsonEncryptData=jsEncryptData(data);
    console.log(data);
$.ajax({
    url:url+"Subject_mySubejct",
    type:"POST",
    data:{"data":jsonEncryptData},
    success:function(data){
        //����
        var data=jsDecodeData(data);
        console.log(data);
        if(data.errcode===0){
            localStorage.setItem("apptoken",data.apptoken);
            var html="";
            var statusSpan="";
            $.each(data.data,function(i,item){
                if(item.status===1){
                    statusSpan=`
                    <span class="right" style="font-size: 13px;color: green">�Ѿ����</span>
                    `
                }else{
                    statusSpan=`
                    <span class="right" style="font-size: 13px;color: red">δ���</span>
                    `
                }
                    html+=`
                <a href="" title="${item.subject_id}" class="myTopic_id">
                    <div class="weui-media-box weui-media-box_text" style="padding-bottom: 5px;border-bottom: 1px solid #b2b2b2">
                        <div class="headline">
                            <h4 class="weui-media-box__title lf" style="font-size: 15px;">${item.title}</h4>
                            <span class="right" style="font-size: 13px;color: green">�Ѿ����</span>
                        </div>

                        <p class="weui-media-box__desc" style="font-size: 12px">${item.content}</p>
                        <div style="font-size: 12px;text-align: right;color: #c2c0be">�Ķ��� <span>${item.read_num}</span> ������ <span>${item.commont_num}</span></div>
                    </div>
                </a>
                `


            });
            $(".headline").append(statusSpan);
            $(".myTopicList").append(html);
            myLopicID();
            window.local.href="hotTopic_myTopicText.html";
        }else{
            console.log(data.errmsg);
        }
    }

});
//��������ʱ��ִ�еĺ���
//���� �ѻ���id���ڱ���
    var myLopicID=function(){
        $(".myTopicList").on("click",".myTopic_id",function(){
            //��ȡ����id
            var subject_id=$(thsi).attr("title");
            localStorage.setItem("subject_id",subject_id)
        })
    };
});