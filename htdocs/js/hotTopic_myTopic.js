/**
 * Created by Administrator on 2017/10/14 0014.
 */
$(document).ready(function(){
    "use strict";
    //获取apptoken
    var apptoken=localStorage.getItem("apptoken"),
    //格式转换
        data=["",JSON.stringify({"apptoken":apptoken})];
    //加密
    var jsonEncryptData=jsEncryptData(data);
    console.log(data);
    $.ajax({
        url:url+"Subject_mySubejct",
        type:"POST",
        data:{"data":jsonEncryptData},
        success:function(data){
            //解密
            var data=jsDecodeData(data);
            console.log(data);
            if(data.errcode===0){
                localStorage.setItem("apptoken",data.apptoken);
                var html="";
                var statusSpan="";
                $.each(data.data,function(i,item){
                    if(parseInt(item.status)===1){
                        statusSpan=`
                   <span class="right" style="font-size: 13px;color: red">未解决</span>
                    `
                    }else{
                        statusSpan=`
                    
                    <span class="right" style="font-size: 13px;color: green">已经解决</span>
                    `
                    }
                    html+=`
                <div title="${item.subject_id}" class="myTopic_id" value="${item.garden_code}">
                    <div class="weui-media-box weui-media-box_text" style="padding-bottom: 5px;border-bottom: 1px solid #b2b2b2">
                        <div class="headline">
                            <h4 class="weui-media-box__title lf" style="font-size: 15px;">${item.title}</h4>
                           
                        </div>
                        <p class="weui-media-box__desc" style="font-size: 12px">${item.content}</p>
                        <button class="delBtn" title="${item.subject_id}">删除</button>
                        <div style="font-size: 12px;text-align: right;color: #c2c0be">阅读量 <span>${item.read_num}</span> 回帖数 <span>${item.commont_num}</span></div>
                    </div>
                </div>
                `
                });

                $(".myTopicList").append(html);
                $(".headline").append(statusSpan);

            }else{
                var html=`
                <p style="text-align: center">${data.errmsg}</p>
                
                
                `;
                $(".myTopicList").append(html);
            }
        }

    });
//点击话题的时候执行的函数
//功能 把话题id存在本地
        $(".myTopicList").on("click",".myTopic_id",function(){
            //获取话题id
            var subject_id=$(this).attr("title");
            var garden_code=$(this).attr("value");
            console.log(subject_id);
            console.log(garden_code);
            localStorage.setItem("subject_id",subject_id);
            localStorage.setItem("garden_code",garden_code);
            if(subject_id&&garden_code){
                window.location.href="hotTopic_myTopicText.html";
            }

        });
        //删除 热门话题
    $(".myTopicList").on("click",".myTopic_id .weui-media-box .delBtn",function(e){
        if(confirm("删除话题")){
            var apptoken=localStorage.getItem("apptoken");
            // city_id 城市id
            var city_id=localStorage.getItem("city_id");
            // 参数：subject_id 话题id
            var subject_id=$(this).attr("title");
            var data=["",JSON.stringify({"apptoken":apptoken,"city_id":city_id,"subject_id":subject_id})];
            var jsonEncryptData=jsEncryptData(data);
            $.ajax({
                url:url+"Subject_delSubject",
                type:"POST",
                data:{"data":jsonEncryptData},
                success:function(data){
                    var data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        localStorage.setItem("apptoken",data.apptoken);
                        showHide(data.errmsg);
                        $(e.target).parent().parent().remove();
                    }else{
                        showHide(data.errmsg)
                    }
                }
            });
        }
        return false
    })
});