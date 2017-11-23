$(document).ready(function(){
    "use strict";
    // 获取用户user_code;
    var user_code="";
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken"),
    // 获取话题发布所属的小区
        garden_code=localStorage.getItem("garden_code"),
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
            url:url+"Subject_mySubejct",
            type:"post",
            data:{"data":jsonEncryptData},
            success:function(data){
                // 解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    var result=data.data;
                    var user_code=localStorage.getItem("my_code");
                    // 投票选项
                    var option="";
                    // 每个选项的投票情况投票选项
                    var html="";
                    var choise="";
                    var  myDiscuss="";
                    var allDiscuss="";
                       // 循环评论
                    if(result.commont_list){
                        $.each(result.commont_list,function(i,item){
                            if(item.user_code===user_code){
                            //自己的评论
                                if(parseInt(item.is_likes)===1){
                                    myDiscuss+=`
                                <div class="weui-media-box weui-media-box_text">
                                 <div class="topic">
                                     <a href="">
                                         <p class="weui-media-box__title lf">${item.nickname}</p>
                                     </a>
                                     <span class="right" style="font-size: 12px">${getLocalTime(item.create_time)}</span>
                                 </div>                               
                                 <p class="weui-media-box__desc">
                                     ${item.content}
                                 </p>
                                 <div style="text-align: right;font-size: 12px" class="praise">
                                     <img src=" image/del.png"  title="${item.commont_id}" class="delImg" alt="" style="width: 15px;margin-right: 10px"/>
                                     <img class="disPraiseImg" title="${item.commont_id}" value="${item.is_likes}" src="image/praise.png" alt="" style="display: inline-block;width: 20px;margin-top: 10px">
                                     <span>${item.commont_likes_num}</span>
                                 </div>
                             </div>
                                `
                                }else{
                                    myDiscuss+=`
                                <div class="weui-media-box weui-media-box_text">
                                 <div class="topic">
                                     <a href="">
                                         <p class="weui-media-box__title lf">${item.nickname}</p>
                                     </a>
                                     <span class="right" style="font-size: 12px">${getLocalTime(item.create_time)}</span>
                                 </div>
                              
                                 <p class="weui-media-box__desc">
                                     ${item.content}
                                 </p>
                                 <div style="text-align: right;font-size: 12px" class="praise">
                                     <img src=" image/del.png"  title="${item.commont_id}" class="delImg" alt="" style="width: 15px;margin-right: 10px"/>
                                     <img class="disPraiseImg" title="${item.commont_id}" value="${item.is_likes}" src="image/no_praise.png" alt="" style="display: inline-block;width: 20px;margin-top: 10px">
                                     <span>${item.commont_likes_num}</span>
                                 </div>
                             </div>
                                `
                                }
                            }
                            //所有的评轮
                            if(parseInt(item.is_likes)===1){
                                allDiscuss+=`
                            <div class="weui-media-box weui-media-box_text">
                                 <div class="topic">
                                   <a href="">
                                        <p class="weui-media-box__title lf">${item.nickname}</p>
                                     </a>

                                     <span class="right" style="font-size: 12px">${getLocalTime(item.create_time)}</span>
                                 </div>
                                 <p class="weui-media-box__desc">
                                     ${item.content}
                                 </p>
                                 <div style="text-align: right;font-size: 12px"  class="praise">
                                     <img class="disPraiseImg" title="${item.commont_id}" value="${item.is_likes}"  src="image/praise.png" alt="" style="display: inline-block;width: 20px;margin-top: 10px">
                                     <span>${item.commont_likes_num}</span>
                                 </div>
                             </div>

                            `
                            }else{
                                allDiscuss+=`
                            <div class="weui-media-box weui-media-box_text">
                                 <div class="topic">
                                   <a href="">
                                        <p class="weui-media-box__title lf">${item.nickname}</p>
                                     </a>

                                     <span class="right" style="font-size: 12px">${getLocalTime(item.create_time)}</span>
                                 </div>
                                 <p class="weui-media-box__desc">
                                     ${item.content}
                                 </p>
                                 <div style="text-align: right;font-size: 12px"  class="praise">
                                     <img class="disPraiseImg" title="${item.commont_id}" value="${item.is_likes}"  src="image/no_praise.png" alt="" style="display: inline-block;width: 20px;margin-top: 10px">
                                     <span>${item.commont_likes_num}</span>
                                 </div>
                             </div>
                             
                            `
                            }
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
                    if(result.choise){
                        var options=JSON.parse(result.choise);
                        $.each(options,function (i,item) {
                            if(parseInt(result.type)===1){//单选
                                option+=`
                <label class="weui-cell weui-check__label" >
                    <div class="weui-cell__bd">
                        <p>${item}</p>
                    </div>
                    <div class="weui-cell__ft">
                        <input type="radio" class="weui-check" name="radio1" value="${i}">
                        <span class="weui-icon-checked"></span>
                    </div>
                </label>
                        `
                            }else{//多选
                                option+=`
                <label class="weui-cell weui-check__label" >
                    <div class="weui-cell__bd">
                        <p>${item}</p>
                    </div>
                    <div class="weui-cell__ft">
                        <input type="checkbox" class="weui-check" name="radio1" value="${i}">
                        <span class="weui-icon-checked"></span>
                    </div>
                </label>
                        `
                            }
                        });
                    }
                    //添加图片
                    var topicPic="";
                    var pic=JSON.parse(result.picture);
                    $.each(pic,function(i,item){
                        topicPic+=`
                                <li style="display: inline-block">
                                    <img src="${item}" alt="" class="topic" width="80px">
                                </li>
                        
                        `
                    });
                    //加载页面内容
                    if(parseInt(result.is_likes)===1){
                        html=`
                    <div class="weui-media-box weui-media-box_text">
                        <h4 class="weui-media-box__title" style="text-align: center;font-size: 15px">${result.title}</h4>
                        <ul class="weui-media-box__info" style="font-size: 10px;color: #BEBEBE">
                            <li class="weui-media-box__info__meta">作者：<span>${result.nickname}</span></li>
                            <li class="weui-media-box__info__meta">时间：${getLocalTime(result.create_time)}</li>

                        </ul>
                        <ul class="picPlace">
                        
                        </ul>
                        <p class="weui-media-box__desc" style=" text-indent:2em">
                            ${result.content}
                        </p>
                        <div style="text-align: right;font-size: 12px" class="readNum">
                            阅读量 <span>${result.read_num}</span>
                            <img class="CommonPraiseImg" title="${result.is_likes}" src="image/praise.png" style="width: 20px;margin-right: 5px" alt=""><span>${result.likes_num}</span>
                            <span class="topicDiscu">评论 ${result.commont_num}</span>
                            <span>分享</span>
                        </div>
                        <div style="text-align: right;font-size: 15px;color: #b2b2b2">
                                <span class="lf type" style="font-size: 15px">单选</span>
                                <span class="lf anonymous" style="font-size: 15px">（匿名）</span> 票数：<span style="font-size: 15px">${result.total_votes}</span>
                            </div>
                    </div>
                    <div class="weui-cells choiseList">
                    </div>
                        `
                    }else{
                        html=`
                    <div class="weui-media-box weui-media-box_text">
                        <h4 class="weui-media-box__title" style="text-align: center;font-size: 15px">${result.title}</h4>
                        <ul class="weui-media-box__info" style="font-size: 10px;color: #BEBEBE">
                            <li class="weui-media-box__info__meta">作者：<span>${result.nickname}</span></li>
                            <li class="weui-media-box__info__meta">时间：${getLocalTime(result.create_time)}</li>

                        </ul>
                        <ul class="picPlace">
                        
                        </ul>
                        <p class="weui-media-box__desc" style=" text-indent:2em">
                            ${result.content}
                        </p>
                        <div style="text-align: right;font-size: 12px" class="readNum">
                            阅读量 <span>${result.read_num}</span>
                            <img class="CommonPraiseImg" src="image/no_praise.png" style="width: 20px;margin-right: 5px" alt=""><span>${result.likes_num}</span>
                            <span class="topicDiscu">评论${result.commont_num}</span>
                            <span>分享</span>
                        </div>
                        <div style="text-align: right;font-size: 15px;color: #b2b2b2">
                                <span class="lf type" style="font-size: 15px">单选</span>
                                <span class="lf anonymous" style="font-size: 15px">（匿名）</span> 票数：<span style="font-size: 15px">${result.total_votes}</span>
                            </div>
                    </div>
                    <div class="weui-cells choiseList">
                    </div>
                        `
                    }
                    $(".hotTopicContent").html(html);
                    $(".myDiscuss").append(myDiscuss);
                    $(".allDiscuss").append(allDiscuss);
                    $(".choiseList").html(choise);
                    $(".optionList").append(option);
                    $(".picPlace").html(topicPic);
                    if(parseInt(result.type)===1){
                        console.log("单选");
                        $(".type").html("单选");
                    }else{
                        console.log("多选");
                        $(".type").html("多选");
                    }
                    if(result.is_push===1){
                        $(".anonymous").html("(匿名)");
                    }else{
                        $(".anonymous").html("(公开)");
                    }
                    $(".discuss").show();
                    $(".topicVote").show();
                    $(".prestrain").hide();
                    if(parseInt(result.is_choised)===1){
                        $(".topicVote").hide();
                    }else{
                        $(".topicVote").show();
                    }
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
                        // $(".optionList").empty();
                         window.location.reload();
                        // pageSuccess();
                    }else{
                        console.log(data.errmsg);
                    }
                }
            })
        })
    })();
    // 功能3 点赞/取消点赞话题
    $(".hotTopicContent").on("click",".weui-media-box_text .readNum .CommonPraiseImg",function(e){
        if(parseInt($(this).attr("title"))===1){
            //取消点赞
            console.log("取消点赞");
            var data=["",JSON.stringify({"apptoken":apptoken,"garden_code":garden_code,"subject_id":subject_id,"is_cancel":1})],
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
                        $(e.target).attr("src","image/no_praise.png");
                        $(e.target).attr("title","0");
                        //获取当前元素的下一个兄弟元素的内容+1
                        var disNum= $(e.target).next().html();
                        $(e.target).next().html(parseInt(disNum)-1);
                    }else{
                        console.log(data.errmsg);
                    }
                }
            })
        }else{
            //点赞
            console.log("点赞");
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
                        $(e.target).attr("src","image/praise.png");
                        $(e.target).attr("title","1");
                        //获取当前元素的下一个兄弟元素的内容+1
                        var disNum= $(e.target).next().html();
                        $(e.target).next().html(parseInt(disNum)+1);
                    }else{
                        console.log(data.errmsg);
                    }
                }
            })
        }
    });
    // 功能4 点赞/取消点赞话题评论
    $(".discuss").on("click",".weui-media-box .praise .disPraiseImg",function(e){
        if(parseInt($(this).attr("value"))===1){//取消点赞
            console.log("取消点赞");
            //获取评论id
                var  discu_id=$(this).attr("title"),
                //数据格式转换
                data=["",JSON.stringify({"apptoken":apptoken,"garden_code":garden_code,"subject_id":subject_id,"commont_id": discu_id,"is_cancel":1})],
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
                        localStorage.setItem("apptoken",data.apptoken);
                        $(e.target).attr("src","image/no_praise.png");
                        $(e.target).attr("value","0");
                        //获取当前元素的下一个兄弟元素的内容+1
                        var disNum= $(e.target).next().html();
                        $(e.target).next().html(parseInt(disNum)-1);
                        console.log(data.errmsg);
                    }
                }
            })
        }else{//点赞
            console.log("点赞");
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
                        localStorage.setItem("apptoken",data.apptoken);
                        $(e.target).attr("src","image/praise.png");
                        $(e.target).attr("value","1");
                        //获取当前元素的下一个兄弟元素的内容+1
                        var disNum= $(e.target).next().html();
                        $(e.target).next().html(parseInt(disNum)+1);
                        console.log(data.errmsg);
                    }
                }
            })
        }
    });
    // 功能5 删除评论
    $(".myDiscuss").on("click",".weui-media-box .praise .delImg",function(e){
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
                    console.log("删除评论");
                    localStorage.setItem("apptoken",data.apptoken);
                   $(e.target).parent().parent().remove();
                }else{
                    showHide(data.errmsg);
                }
            }
        })
    });
    // 功能6 话题投票
    $(".Vote").click(function(){
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken"),
            garden_code=localStorage.getItem("garden_code"),
            subject_id=localStorage.getItem("subject_id"),
            content=$(".contentVote").val();
        var choise={};
        $("input[name=radio1]:checked").each(function(i,item){
            choise[parseInt($(this).val())]=$(this).parent().prev().find("p").text();
        });
        choise=JSON.stringify(choise);
        console.log(typeof choise);
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
                    localStorage.setItem("apptoken",data.apptoken);
                    showHide(data.errmsg);
                    window.location.reload();
                }
            }
        })
    });
    //删除

});