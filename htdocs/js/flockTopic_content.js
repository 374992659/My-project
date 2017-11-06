$(document).ready(function(){
    // 时间戳转换函数
    function getLocalTime(nS){
        return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,17)}
    "use strict";
    // 加载页面
    var getPage=function(){
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        // 获取群号码
        var group_num=localStorage.getItem("group_num");
        // 获取话题id
        var subject_id=localStorage.getItem("subject_id");
        console.log(typeof subject_id);
    // 数据格式转换
        var data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num,"subject_id":subject_id})];
    // 数据加密
        var jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"group_getGroupSubjectInfo",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                // 解密数据
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    // 获取用户的id
                    var userCode=data.data.user_code;
                    localStorage.setItem("apptoken",data.apptoken);
                    // 所有评论
                    var alldiscuss="";
                    // 我的评论
                    var mydiscuss="";
                    if(data.data.is_like==1){
                        var html=`
        <div class="weui-panel weui-panel_access">
            <div class="weui-panel__bd" style="background: #F0F0F0">
                <div class="weui-media-box weui-media-box_text">
                    <h4 class="weui-media-box__title" style="text-align: center;font-size: 15px">${data.data.title}</h4>
                    <ul class="weui-media-box__info" style="font-size: 15px;color: #BEBEBE">
                        <li class="weui-media-box__info__meta">作者：<a href=""><span>${data.data.nickname}</span></a></li>
                        <li class="weui-media-box__info__meta">时间：${data.data.create_time}</li>

                    </ul>
                    <p class="weui-media-box__desc" style=" text-indent:1em;font-size: 16px;color:black">
                        ${data.data.content}
                    </p>
                </div>
                <div class="weui-media-box weui-media-box_text" style="background: 	#FCFCFC">
                    <div class="weui-media-box__desc" style="font-size: 15px">
                        <div class="weui-flex">
                            <div class="weui-flex__item" style="color: black">
                                阅读数量：<span>${data.data.read_num}</span>
                            </div>
                            <div class="weui-flex__item" style="color: black">
                                评论：<span >${data.data.commont_num}</span>
                            </div>
                        </div>
                        <div class="weui-flex" style="margin-top: 10px">
                            <div class="weui-flex__item" style="color: black">
                                点赞：
                                <img class="CommonPraiseImg" title="${data.data.is_like}" src="image/praise.png" style="width: 20px;margin-right: 5px" alt="">
                                <span class="praiseNum">
                                ${data.data.likes_num}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="weui-media-box__desc" style="margin-top: 10px;font-size: 15px;color: black">
                        <a href="" style="">律师援助</a>
                        <span style="margin-left:10px ">分享</span>
                        <span style="margin-left:10px " class="commentBtn">评论</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="Discuss">
            <div class="weui-tab">
                <div class="weui-navbar">
                    <a class="weui-navbar__item weui-bar__item--on" href="#tab1">
                        我的评论
                    </a>
                    <a class="weui-navbar__item" href="#tab2">
                        全部评论
                    </a>
                </div>
                <div class="weui-tab__bd">
                    <!--我的评论-->
                    <div id="tab1" class="weui-tab__bd-item weui-tab__bd-item--active">
                        <div class="weui-panel__bd myDiscuss discuss">                                                    
                        </div>
                    </div>
                    <!--全部评论-->
                    <div id="tab2" class="weui-tab__bd-item">
                        <div class="weui-panel__bd allDiscuss discuss">
                            
                         
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
                    `
                    }else{
                        var html=`
        <div class="weui-panel weui-panel_access">
            <div class="weui-panel__bd" style="background: #F0F0F0">
                <div class="weui-media-box weui-media-box_text">
                    <h4 class="weui-media-box__title" style="text-align: center;font-size: 15px">${data.data.title}</h4>
                    <ul class="weui-media-box__info" style="font-size: 15px;color: #BEBEBE">
                        <li class="weui-media-box__info__meta">作者：<a href=""><span>${data.data.nickname}</span></a></li>
                        <li class="weui-media-box__info__meta">时间：${data.data.create_time}</li>

                    </ul>
                    <p class="weui-media-box__desc" style=" text-indent:1em;font-size: 16px;color:black">
                        ${data.data.content}
                    </p>
                </div>
                <div class="weui-media-box weui-media-box_text" style="background: 	#FCFCFC">
                    <div class="weui-media-box__desc" style="font-size: 15px">
                        <div class="weui-flex">
                            <div class="weui-flex__item" style="color: black">
                                阅读数量：<span>${data.data.read_num}</span>
                            </div>
                            <div class="weui-flex__item" style="color: black">
                                评论：<span >${data.data.commont_num}</span>
                            </div>
                        </div>
                        <div class="weui-flex" style="margin-top: 10px">
                            <div class="weui-flex__item" style="color: black">
                                点赞：
                                <img class="CommonPraiseImg"  title="${data.data.is_like}" src="image/no_praise.png" style="width: 20px;margin-right: 5px" alt="">
                                <span class="praiseNum">
                                ${data.data.likes_num}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="weui-media-box__desc" style="margin-top: 10px;font-size: 15px;color: black">
                        <a href="" style="">律师援助</a>
                        <span style="margin-left:10px ">分享</span>
                        <span style="margin-left:10px " class="commentBtn">评论</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="Discuss">
            <div class="weui-tab">
                <div class="weui-navbar">
                    <a class="weui-navbar__item weui-bar__item--on" href="#tab1">
                        我的评论
                    </a>
                    <a class="weui-navbar__item" href="#tab2">
                        全部评论
                    </a>
                </div>
                <div class="weui-tab__bd">
                    <!--我的评论-->
                    <div id="tab1" class="weui-tab__bd-item weui-tab__bd-item--active">
                        <div class="weui-panel__bd myDiscuss discuss">                                                    
                        </div>
                    </div>
                    <!--全部评论-->
                    <div id="tab2" class="weui-tab__bd-item">
                        <div class="weui-panel__bd allDiscuss discuss">
                            
                         
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
                    `
                    }
                     // 对所有评论循环遍历
                    if(data.data.commont_list){
                        $.each(data.data.commont_list,function(i,item){
                            if(item.user_code=userCode){
                                if(parseInt(item.is_likes)===1){
                                    mydiscuss+=`
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
                             <div style="text-align: right;font-size: 12px" class="delPraise">
                                 <img src=" image/del.png" class="delImg" alt="" style="width: 16px;margin-right: 10px"/>
                                  <img title="${item.id}" value="${item.is_likes}" class="disPraiseImg" src="image/praise.png" alt="" style="display: inline-block;width: 16px;margin-top: 10px;position: relative;z-index: 10000">
                                 <span class="praiseNum">${item.commont_likes}</span>
                             </div>
                        </div>
                              `
                                }else{
                                    mydiscuss+=`
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
                             <div style="text-align: right;font-size: 12px" class="delPraise">
                                 <img src=" image/del.png" class="delImg" alt="" style="width: 16px;margin-right: 10px"/>
                                  <img title="${item.id}" value="${item.is_likes}" class="disPraiseImg" src="image/no_praise.png" alt="" style="display: inline-block;width: 16px;margin-top: 10px;position: relative;z-index: 10000">
                                 <span class="praiseNum">${item.commont_likes}</span>
                             </div>
                        </div>
                              `
                                }
                            }
                            if(parseInt(item.is_likes)===1){
                                alldiscuss+=`
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
                              <div style="text-align: right;font-size: 12px"  class="praise">
                               <img title="${item.id}" value="${item.is_likes}" class="disPraiseImg" src="image/praise.png" alt="" style="display: inline-block;width: 16px;margin-top: 10px;position: relative;z-index: 10000">                               
                                 <span class="praiseNum">${item.commont_likes}</span>
                             </div>
                          </div>                   
                         `
                            }else{
                                alldiscuss+=`
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
                              <div style="text-align: right;font-size: 12px"  class="praise">
                               <img title="${item.id}" value="${item.is_like}" class="disPraiseImg" src="image/no_praise.png" alt="" style="display: inline-block;width: 16px;margin-top: 10px;position: relative;z-index: 10000">                               
                                 <span class="praiseNum">${item.commont_likes}</span>
                             </div>
                          </div>                   
                         `
                            }
                        });
                    }
                    $("#topicText").html(html);
                    $(".myDiscuss").append(mydiscuss);
                    $(".allDiscuss").append(alldiscuss);
                }
            }
        });
    };getPage();
    // 发表评论
    (function(){
        // 弹出评论窗口
        $("#topicText").on("click",".weui-panel .weui-panel__bd .weui-media-box__desc .commentBtn",function(){
            $(".publishDis").show();
        });
        // 发表评论内容
        $(".publishBtn").click(function(){
            // 获取apptoken
            var apptoken=localStorage.getItem("apptoken");
            // 获取群号码
            var group_num=localStorage.getItem("group_num");
            // 获取话题id
            var subject_id=localStorage.getItem("subject_id");
            // 获取内容
            var content=$(".commentText").val();
            // 数据格式转换
            var data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num,"subject_id":subject_id,"content":content})];
            // 加密
            var jsonEncryptData=jsEncryptData(data);
            console.log(data);
            $.ajax({
                url:url+"group_addGroupSubjectCommon",
                type:"POST",
                data:{"data":jsonEncryptData},
                success:function(data){
                    // 解密数据
                    data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        localStorage.setItem("apptoken",data.apptoken);

                        $(".publishDis").hide();
                    }else{
                        console.log(data.errmsg);
                    }
                }
            });
        });
    })();
    // 群话题点赞
    $("#topicText").on("click",".weui-panel .weui-panel__bd .weui-media-box .weui-media-box__desc .weui-flex .weui-flex__item .CommonPraiseImg",function(e){
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        // 获取群号码
        var group_num=localStorage.getItem("group_num");
        // 获取话题id
        var subject_id=localStorage.getItem("subject_id");
        if(parseInt($(this).attr("value"))===1){//取消点赞
            console.log("取消点赞");
            var data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num,"subject_id":subject_id,"is_cancle":1})];
            // 加密
            var jsonEncryptData=jsEncryptData(data);
            console.log(data);
            $.ajax({
                url:url+"group_addGroupSubjectLikes",
                type:"POST",
                data:{"data":jsonEncryptData},
                success:function (data) {
                    // 解密
                    data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        localStorage.setItem("apptoken",data.apptoken);
                        $(".CommonPraiseImg").attr("src","image/no_praise.png");
                        $(".CommonPraiseImg").attr("title","0");
                        var a=$(e.target).siblings().html();
                        a=parseInt(a);
                        $(e.target).siblings().html(a-1)
                    }else{
                        console.log(data.errmsg);

                    }
                }
            });
        }else{
            var data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num,"subject_id":subject_id})];
            // 加密
            var jsonEncryptData=jsEncryptData(data);
            console.log(data);
            $.ajax({
                url:url+"group_addGroupSubjectLikes",
                type:"POST",
                data:{"data":jsonEncryptData},
                success:function (data) {
                    // 解密
                    data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        localStorage.setItem("apptoken",data.apptoken);
                        $(".CommonPraiseImg").attr("src","image/praise.png");
                        $(".CommonPraiseImg").attr("title","1");
                        var a=$(e.target).siblings().html();
                        a=parseInt(a);
                        $(e.target).siblings().html(a+1)
                    }else{
                        console.log(data.errmsg);

                    }
                }
            });
        }
    });
    //   评论点赞
    $("#topicText").on("click",".Discuss .weui-tab .weui-tab__bd .weui-tab__bd-item .discuss .weui-media-box .delPraise .disPraiseImg",function(e){
        var commont_id=$(this).attr("title");
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        // 获取群号码
        var group_num=localStorage.getItem("group_num");
        // 获取话题id
        var subject_id=localStorage.getItem("subject_id");
        if(parseInt($(this).attr("value"))===1){//取消点赞
        // 数据格式转换
        var data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num,"subject_id":subject_id,"commont_id":commont_id,"is_cancel":1})];
        // 数据加密
        var jsonEncryptData=jsEncryptData(data);
        console.log(data);
            $.ajax({
                url:url+'group_addGroupSubjectCommontLikes',
                type:"POST",
                data:{"data":jsonEncryptData},
                success:function(data){
                    // 解密
                    var data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        localStorage.setItem("apptoken",data.apptoken);
                        $(this).attr("src","image/no_praise.png");
                        $(this).attr("value","0");
                        var a=$(e.target).siblings().html();
                        a=parseInt(a);
                        $(e.target).siblings().html(a-1)
                    }else{
                        console.log(data.errmsg);
                    }
                }
            })
        }else{//点赞
            // 数据格式转换
            var data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num,"subject_id":subject_id,"commont_id":commont_id,"is_cancel":1})];
            // 数据加密
            var jsonEncryptData=jsEncryptData(data);
            console.log(data);
            $.ajax({
                url:url+'group_addGroupSubjectCommontLikes',
                type:"POST",
                data:{"data":jsonEncryptData},
                success:function(data){
                    // 解密
                    var data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        localStorage.setItem("apptoken",data.apptoken);
                        $(this).attr("src","image/no_praise.png");
                        $(this).attr("value","1");
                        var a=$(e.target).siblings().html();
                        a=parseInt(a);
                        $(e.target).siblings().html(a+1)
                    }else{
                        console.log(data.errmsg);
                    }
                }
            })
        }
    });
    $(".commentBtn").click(function(){
        if($(".publishDis").is(":hidden")){
            $(".publishDis").show();
        }else{
            $(".publishDis").hide();
        }
    });
    $(".publishBtn").click(function(){
        $(".publishDis").hide();
    });
});