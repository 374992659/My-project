$(document).ready(function(){
    // 获取群号码
    var code=localStorage.getItem("group_num");
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    // 获取投票id
    var vote_id=localStorage.getItem("vote_id");
    // 数据格式转换
    data =["",JSON.stringify({"apptoken":apptoken,"group_num":code,"vote_id":vote_id})];
// 加密
    jsonEncryptData=jsEncryptData(data);
    console.log(data);
    $.ajax({
        url:url+"group_getVoteInfo",
        type:"POST",
        data:{"data":jsonEncryptData},
        success:function (data) {
            // 解密
            data=jsDecodeData(data);
            console.log(data);
            if(data.errcode===0){
                localStorage.setItem("apptoken",data.apptoken);
                var result=data.data;
                var voteList="";
                console.log(result.vote_info);
                var httP=result.portrait.split(":")[0];
                if(result.have_choise===null){//已经投票
                    $.each(result.vote_info,function(i,item){
                        console.log(item);
                        voteList+=`
                    <label class="weui-cell weui-check__label" style="padding: 5px 0" for="${i}">
                        <div class="weui-cell__bd">
                            <p>${item.comtent}</p>
                        </div>
                        <div class="weui-cell__ft">                          
                            <span class="weui-icon-checked"></span>
                            <span class="voteNum">${item.num}</span>
                        </div>
                    </label>
                    `
                    });
                    if(httP==="http"){
                        var html=`
                    <div class="weui-panel__bd">
                        <div  class="weui-media-box weui-media-box_appmsg">
                            <div class="weui-media-box__hd">
                                <img class="weui-media-box__thumb" src="${result.portrait}">
                            </div>
                            <div class="weui-media-box__bd">
                                <h4 class="weui-media-box__title" style="font-size: 18px">${result.nickname}</h4>
                                <span class="weui-media-box__desc" style="font-size: 14px">${getLocalTime(result.create_time)}</span>
                                <button style="font-size: 14px" class="right delBtn" title="${result.vote_id}">删除</button>
                            </div>
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title" style="font-size: 15px">主题：${result.title}</h4>
                            <p>内容：${result.content}</p>
                            <ul>
                                <li class="lf">
                                    <img src="${result.picture}" alt="" class="topic">
                                </li>
                            </ul>
                            <div style="text-align: right;font-size: 15px;color: #b2b2b2">
                                <span class="lf type" style="font-size: 15px">单选</span>
                                <span class="lf anonymous" style="font-size: 15px">（匿名投票）</span> 票数：<span style="font-size: 15px">${result.total_user}</span>
                            </div>
                        </div>
                    </div>
                        <!--选项-->
                    <div class="weui-cells weui-cells_radio optionList" style="display: block">
                    </div>
                            <!--截止时间-->
                    <div class="weui-cells">
                        <div class="weui-cell">
                            <div class="weui-cell__bd" style="color: #bbbbbb">
                                <span  style="font-size: 15px">截止时间：</span>
                                <span style="font-size: 15px">${getLocalTime(result.end_time)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="demos-content-padded">
                        <button class="weui-btn weui-btn_primary voteBtn">投票</button>
                    </div>
                `;
                    }else{
                        var html=`
                    <div class="weui-panel__bd">
                        <div  class="weui-media-box weui-media-box_appmsg">
                            <div class="weui-media-box__hd">
                                <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${result.portrait}">
                            </div>
                            <div class="weui-media-box__bd">
                                <h4 class="weui-media-box__title" style="font-size: 18px">${result.nickname}</h4>
                                <span class="weui-media-box__desc" style="font-size: 14px">${getLocalTime(result.create_time)}</span>
                                <button style="font-size: 14px" class="right delBtn" title="${result.vote_id}">删除</button>
                            </div>
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title" style="font-size: 15px">主题：${result.title}</h4>
                            <p>内容：${result.content}</p>
                            <ul>
                                <li class="lf">
                                    <img src="${result.picture}" alt="" class="topic">
                                </li>
                            </ul>
                            <div style="text-align: right;font-size: 15px;color: #b2b2b2">
                                <span class="lf type" style="font-size: 15px">单选</span>
                                <span class="lf anonymous" style="font-size: 15px">（匿名投票）</span> 票数：<span style="font-size: 15px">${result.total_user}</span>
                            </div>
                        </div>
                    </div>
                        <!--选项-->
                    <div class="weui-cells weui-cells_radio optionList" style="display: block">
                    </div>
                            <!--截止时间-->
                    <div class="weui-cells">
                        <div class="weui-cell">
                            <div class="weui-cell__bd" style="color: #bbbbbb">
                                <span  style="font-size: 15px">截止时间：</span>
                                <span style="font-size: 15px">${getLocalTime(result.end_time)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="demos-content-padded">
                        <button class="weui-btn weui-btn_primary voteBtn">投票</button>
                    </div>
                `;
                    }

                }else{//没有投票
                    if(parseInt(result.type)===1){//单选
                        $.each(result.vote_info,function(i,item){
                            console.log(item);
                            voteList+=`
                    <label class="weui-cell weui-check__label" style="padding: 5px 0" for="${i}">
                        <div class="weui-cell__bd">
                            <p>${item.comtent}</p>
                        </div>
                        <div class="weui-cell__ft">
                            <input type="radio" class="weui-check" name="radio1" id="${i}">
                            <span class="weui-icon-checked"></span>
                           
                        </div>
                    </label>
                    `
                        });
                    }else{//多选
                        $.each(result.vote_info,function(i,item){
                            console.log(item);
                            voteList+=`
                    <label class="weui-cell weui-check__label" style="padding: 5px 0" for="${i}">
                        <div class="weui-cell__bd">
                            <p>${item.comtent}</p>
                        </div>
                        <div class="weui-cell__ft">
                            <input type="checkbox" class="weui-check" name="radio1" id="${i}">
                            <span class="weui-icon-checked"></span>
                           
                        </div>
                    </label>
                    `
                        });
                    }
                    if(httP==="http"){
                        var html=`
                    <div class="weui-panel__bd">
                        <div  class="weui-media-box weui-media-box_appmsg">
                            <div class="weui-media-box__hd">
                                <img class="weui-media-box__thumb" src="${result.portrait}">
                            </div>
                            <div class="weui-media-box__bd">
                                <h4 class="weui-media-box__title" style="font-size: 18px">${result.nickname}</h4>
                                <span class="weui-media-box__desc" style="font-size: 14px">${getLocalTime(result.create_time)}</span>
                                <button style="font-size: 14px" class="right delBtn" title="${result.vote_id}">删除</button>
                            </div>
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title" style="font-size: 15px">主题：${result.title}</h4>
                            <p>内容：${result.content}</p>
                            <ul>
                                <li class="lf">
                                    <img src="${result.picture}" alt="" class="topic">
                                </li>
                            </ul>
                            <div style="text-align: right;font-size: 15px;color: #b2b2b2">
                                <span class="lf type" style="font-size: 15px">单选</span>
                                <span class="lf anonymous" style="font-size: 15px">（匿名投票）</span> 票数：<span style="font-size: 15px">${result.total_user}</span>
                            </div>
                        </div>
                    </div>
                        <!--选项-->
                    <div class="weui-cells weui-cells_radio optionList" style="display: block">
                    </div>
                            <!--截止时间-->
                    <div class="weui-cells">
                        <div class="weui-cell">
                            <div class="weui-cell__bd" style="color: #bbbbbb">
                                <span  style="font-size: 15px">截止时间：</span>
                                <span style="font-size: 15px">${getLocalTime(result.end_time)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="demos-content-padded">
                        <button class="weui-btn weui-btn_primary voteBtn">投票</button>
                    </div>
                `;
                    }else{
                        var html=`
                    <div class="weui-panel__bd">
                        <div  class="weui-media-box weui-media-box_appmsg">
                            <div class="weui-media-box__hd">
                                <img class="weui-media-box__thumb" src="http://wx.junxiang.ren/project/${result.portrait}">
                            </div>
                            <div class="weui-media-box__bd">
                                <h4 class="weui-media-box__title" style="font-size: 18px">${result.nickname}</h4>
                                <span class="weui-media-box__desc" style="font-size: 14px">${getLocalTime(result.create_time)}</span>
                                <button style="font-size: 14px" class="right delBtn" title="${result.vote_id}">删除</button>
                            </div>
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title" style="font-size: 15px">主题：${result.title}</h4>
                            <p>内容：${result.content}</p>
                            <ul>
                                <li class="lf">
                                    <img src="${result.picture}" alt="" class="topic">
                                </li>
                            </ul>
                            <div style="text-align: right;font-size: 15px;color: #b2b2b2">
                                <span class="lf type" style="font-size: 15px">单选</span>
                                <span class="lf anonymous" style="font-size: 15px">（匿名投票）</span> 票数：<span style="font-size: 15px">${result.total_user}</span>
                            </div>
                        </div>
                    </div>
                        <!--选项-->
                    <div class="weui-cells weui-cells_radio optionList" style="display: block">
                    </div>
                            <!--截止时间-->
                    <div class="weui-cells">
                        <div class="weui-cell">
                            <div class="weui-cell__bd" style="color: #bbbbbb">
                                <span  style="font-size: 15px">截止时间：</span>
                                <span style="font-size: 15px">${getLocalTime(result.end_time)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="demos-content-padded">
                        <button class="weui-btn weui-btn_primary voteBtn">投票</button>
                    </div>
                `;
                    }
                }
                $(".voteContent").append(html);
                $(".optionList").append(voteList);
                if(parseInt(result.anonymous)===1){
                    $(".anonymous").html("（实名投票）")
                }else{
                    $(".anonymous").html("（匿名投票）")
                }
                if(parseInt(result.type)===1){
                    $(".type").html("单选");
                }else{
                    $(".type").html("多选");
                }
               //  console.log("票数");
               // $("input").click(function(e){
               //     if($(this).prop('checked')){
               //         var a=parseInt($(this).siblings(".voteNum").html());
               //         a=a+1;
               //         $(this).siblings(".voteNum").html(a)
               //     }
               // });

            }else{
                console.log(data.errmsg);
            }
        }
    });
    // 功能2 删除投票
    $(".voteContent").on("click",".weui-panel__bd .weui-media-box .weui-media-box__bd .delBtn",function(){
        var success=$(".success");
        var hideTop=function(){
            success.empty()};
        if(confirm("删除投票")){
            // 获取群号
            var code=localStorage.getItem("group_num");
            // 获取投票id
            var vote_id=$(this).attr("title");
            // 获取apptoken
            var apptoken=localStorage.getItem("apptoken");
            // 数据格式转换
            data=["",JSON.stringify({"apptoken":apptoken,"group_num":code,"vote_id":vote_id})];
            // 加密
            jsonEncryptData=jsEncryptData(data);
            console.log(data);
            $.ajax({
                url:url+"group_delVote",
                type:"POST",
                data:{"data":jsonEncryptData},
                success:function (data) {
                    // 解密
                    data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        localStorage.setItem("apptoken",data.apptoken);
                       showHide(data.errmsg);
                        window.location.href="flockVote.html";
                    }else{
                        showHide(data.errmsg);
                    }
                }
            })
        }
    });
    //功能3 我要投票
    $(".voteContent").on("click",".demos-content-padded .voteBtn",function(){
        var success=$(".success");
        var hideTop=function(){
            success.empty();};
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken"),
        // 群号
            group_num=localStorage.getItem("group_num"),
        // 投票id
            vote_id=localStorage.getItem("vote_id");
        // 获取choised
           // choised=$("input[name=radio1]:checked").attr("id");
        var arr={};
        $("input[name=radio1]:checked").each(function(i,item){
            arr[parseInt(i+1)]=$(this).parent().prev().find("p").text();
        });
        console.log(arr);
        // 数据格式转换
        data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num,"vote_id":vote_id,"choised":arr})];
        // 加密
        jsonEncryptData=jsEncryptData(data);
        console.log(data);
        $.ajax({
            url:url+"group_makeVoteChoice",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                // 解密
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    window.location.reload();
                    showHide(data.errmsg)
                }else{
                   showHide(data.errmsg)
                }
            }
        })
    });
    // 图片放大预览
    (function(){
        $(".voteContent").on("click",".weui-panel__bd .weui-media-box__bd ul li img",function(){
            var url=$(this).attr("src");
            console.log(url);
            if($(".weui-gallery").is(":hidden")){
                $(".weui-gallery").show();
                $(".weui-gallery__img").attr("style","background-image: url("+url+")")
            }
        });
        $(".weui-gallery").click(function(){
            $(".weui-gallery").hide();
        });
    })();
});