$(document).ready(function(){
    "use strict";
    // 获取用户user_code;
    var user_code="";
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken"),
    // 获取话题发布所属的小区
        garden_code=270113,
    // 获取话题id
        subject_id=localStorage.getItem("subject_id");
    // 数据格式转换
    // 功能1  页面加载完成调用的函数
    var pageSuccess=function(){
        var data=["",JSON.stringify({"apptoken":apptoken,"garden_code":garden_code,"subject_id":subject_id})],
            // 加密
            jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"Subject_getSubjectInfo",
            type:"post",
            data:{"data":jsonEncryptData},
            success:function(data){
                // 解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    var result=data.data;
                    var user_code=result.user_code;
                    // 投票选项
                    var option="";
                    // 每个选项的投票情况投票选项
                    var choise="";
                    var html="";
                    var  myDiscuss="";
                    var allDiscuss="";
                       // 循环评论
                    if(result.commont_list){
                        $.each(result.commont_list,function(i,item){
                            if(item.user_code===user_code){
                                if(item.is_likes==0){
                                // 移除点赞功能

                            }
                                //自己的评论
                                myDiscuss+=`
                                <div class="weui-media-box weui-media-box_text">
                                 <div class="topic">
                                     <a href="">
                                         <p class="weui-media-box__title lf">${item.nickname}</p>
                                     </a>
                       
                                     <span class="right" style="font-size: 12px">${item.create_time}</span>
                                 </div>
                                 <p class="weui-media-box__desc">
                                     ${item.content}
                                 </p>
                                 <div style="text-align: right;font-size: 12px" class="praise">
                                     <img src=" image/del.png"  title="${item.commont_id}" class="delImg" alt="" style="width: 15px;margin-right: 10px"/>
                                     <img class="disPraiseImg" title="${item.commont_id}" src="image/no_praise.png" alt="" style="display: inline-block;width: 20px;margin-top: 10px">
                                     <span>${item.commont_likes_num}</span>
                                 </div>
                             </div>
                       
                                `;

                            }
                            //所有的评轮
                            allDiscuss+=`
                            <div class="weui-media-box weui-media-box_text">
                                 <div class="topic">
                                   <a href="">
                                        <p class="weui-media-box__title lf">${item.nickname}</p>
                                     </a>
                       
                                     <span class="right" style="font-size: 12px">${item.create_tiem}</span>
                                 </div>
                                 <p class="weui-media-box__desc">
                                     ${item.content}
                                 </p>
                                 <div style="text-align: right;font-size: 12px"  class="praise">
                                     <img src=" image/del.png"  title="${item.commont_id}" class="delImg" alt="" style="width: 15px;margin-right: 10px"/>
                                     <img class="disPraiseImg" title="${item.commont_id}" src="image/no_praise.png" alt="" style="display: inline-block;width: 20px;margin-top: 10px">
                                     <span>${item.commont_likes_num}</span>
                                 </div>
                             </div>
                       
                            `;
                        });
                    }
                    // 循环投票选项
                    if(result.choise_votes){
                        $.each(result.choise_votes,function(i,item){
                            choise+=`
                            <div class="weui-cell">
                            <div class="weui-cell__bd">
                                  <p>${item.content}</p>
                            </div>
                             <div class="weui-cell__ft">${item.num}</div>
                        </div>
                            
                            `
                        })
                      }
                      // 循环添加投票选项
                    if(result.choise_votes){
                          $.each(result.choise_votes,function(i,item){
                              option+=`
                <label class="weui-cell weui-check__label" >
                    <div class="weui-cell__bd">
                        <p>${item.content}</p>
                    </div>
                    <div class="weui-cell__ft">
                        <input type="radio" class="weui-check" name="radio1">
                        <span class="weui-icon-checked"></span>
                    </div>
                </label>
                        `
                          });

                    }
                        html=`
                    <div class="weui-media-box weui-media-box_text">
                        <h4 class="weui-media-box__title" style="text-align: center;font-size: 15px">${result.title}</h4>
                        <ul class="weui-media-box__info" style="font-size: 10px;color: #BEBEBE">
                            <li class="weui-media-box__info__meta">作者：<span>${result.nickname}</span></li>
                            <li class="weui-media-box__info__meta">时间：${result.create_time}</li>
                           
                        </ul>
                        <p class="weui-media-box__desc" style=" text-indent:2em">
                            ${result.content}
                        </p>
                        <div style="text-align: right;font-size: 12px" class="readNum">
                            阅读量 <span>${result.read_num}</span>
                            <img class="CommonPraiseImg" src="image/no_praise.png" style="width: 20px;margin-right: 5px" alt=""><span>${result.total_votes}</span>
                            <span class="topicDiscu">评论 ${result.commont_num}</span>
                            <span>分享</span>
                        </div>
                    </div>
                    <div class="weui-cells choiseList">
                       
                    </div>
                        `;
                    $(".hotTopicContent").html(html);
                    $(".myDiscuss").append(myDiscuss);
                    $(".allDiscuss").append(allDiscuss);
                    $(".choiseList").append(choise);
                    $(".optionList").append(option);
                }
            }
        })

    };pageSuccess();
    // 功能2 话题评论
    (function(){
        $(".hotTopicContent ").on("click",".weui-media-box .readNum .topicDiscu",function(){
            var publishDis=$(".publishDis");
            if(publishDis.is(":hidden")){
                publishDis.show();
            }else{
                publishDis.hide();
            }
        });
        $(".publishBtn").click(function(){
                // 获取评论内容
            var content=$(".commentText").val(),
            //数据格式转换
             data=["",JSON.stringify({"apptoken":apptoken,"garden_code":garden_code,"subject_id":parseInt(subject_id),"content":content})],
            //数据加密
            jsonEncryptData=jsEncryptData(data);
            console.log(data);
            $.ajax({
                url:url+"Subject_addSubjectCommont",
                type:"POST",
                data:{"data":jsonEncryptData},
                success:function(data){
                    //解密数据
                    var data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        localStorage.setItem("apptoken",data.apptoken);
                        $(".publishDis").hide();
                    }else{
                        console.log(data.errmsg);
                    }
                }
            })

        })
    })();
    // 功能3 点赞/取消点赞话题
    $(".hotTopicContent").on("click",".weui-media-box_text .readNum .CommonPraiseImg",function(){
        //数据格式转换
      var img=$(this);
        var data=["",JSON.stringify({"apptoken":apptoken,"garden_code":garden_code,"subject_id":subject_id})],
        //加密
        jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"Subject_editSubjectLikes",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                //解密
            var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    img.attr("src","image/praise.png");
                }else{
                    console.log(data.errmsg);
                }
            }
        })
    });
    // 功能4 点赞/取消点赞话题评论
    $(".discuss").on("click",".weui-media-box .praise .disPraiseImg",function(){
        //获取评论id
      var  discu_id=$(this).attr("title"),
        //数据格式转换
          data=["",JSON.stringify({"apptoken":apptoken,"garden_code":garden_code,"subject_id":subject_id,"commont_id": discu_id})],

        //加密
          jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"Subject_editSubjectCommontLikes",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                //解密数据
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoen);
                    $(this).attr("src","image/praise.png");
                }else{
                    console.log(data.errmsg);
                }
            }
        })
    });
    // 功能5 删除评论
    $(".myDiscuss").on("click",".weui-media-box .praise .delImg",function(){
        //获取评论id
        var discu_id=$(this).attr("title"),
        //数据格式转换
         data=["",JSON.stringify({"apptoken":apptoken,"garden_code":garden_code,"subject_id":subject_id,"commont_id":discu_id})],
        //加密
            jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"Subject_delSubjectCommont",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                //解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                }else{
                    console.log(data.errmsg);
                }
            }
        })
    });
    // 功能6 话题投票
    $(".Vote").click(function(){
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken"),
            garden_code=270113,
            subject_id=localStorage.getItem("subject_id"),
            choise={},
            content=$(".contentVote").val();
            $(".optionList input[name=radio1]:checked").each(function(i,item){
                choise[parseInt(i+1)]=$(this).parent().prev().children().html()
            });
            console.log(choise);
        // 数据格式转换
        var data=["",JSON.stringify({"apptoken":apptoken,"garden_code":garden_code,"subject_id":subject_id,"choise":choise,"content":content})],
        // 加密
        jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"Subject_addSubjectVote",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                // 解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken)
                }
            }
        })
    })

});