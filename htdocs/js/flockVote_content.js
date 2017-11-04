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
                            <span class="voteNum">${item.num}</span>
                        </div>
                    </label>
                    `
                });
               var html=`
                    <div class="weui-panel__bd">
                        <div  class="weui-media-box weui-media-box_appmsg">
                            <div class="weui-media-box__hd">
                                <img class="weui-media-box__thumb" src="${result.portrait}">
                            </div>
                            <div class="weui-media-box__bd">
                                <h4 class="weui-media-box__title" style="font-size: 18px">${result.nickname}</h4>
                                <span class="weui-media-box__desc" style="font-size: 14px">${result.create_time}</span>
                                <button style="font-size: 14px" class="right delBtn" title="${result.vote_id}">删除</button>
                            </div>
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title" style="font-size: 15px">${result.title}</h4>
                            <ul>
                                <li class="lf">
                                    <img src="http://wx.junxiang.ren/project/${result.picture}" alt="" class="topic">
                                </li>
                            </ul>
                            <div style="text-align: right;font-size: 15px;color: #b2b2b2">
                                <span class="lf" style="font-size: 15px">单选</span>
                                <span class="lf" style="font-size: 15px">（匿名投票）</span> 票数：<span style="font-size: 15px">${result.total_user}</span>
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
                                <span style="font-size: 15px">${result.end_time}</span>
                            </div>
                        </div>
                    </div>
                    <div class="demos-content-padded">
                        <button class="weui-btn weui-btn_primary voteBtn">投票</button>
                    </div>
                `;
                $(".voteContent").append(html);
                $(".optionList").append(voteList);
                console.log($("input[type=radio]:checked"));
                if($("input[type=radio]:checked")){
                    console.log("票数");
                    //获取票数内容
                  var a=  $("input[type=radio]:checked").siblings(".voteNum").html();
                    console.log(a);
                }
            }else{
                console.log(data.errmsg);
            }
        }
    });
    // 功能2 删除投票
    $(".voteContent").on("click",".weui-panel__bd .weui-media-box .weui-media-box__bd .delBtn",function(){
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
                    console.log("删除成功")
                }else{
                    console.log(data.errmsg);
                }
            }
        })

    });
    //功能3 我要投票
    $(".voteContent").on("click",".demos-content-padded .voteBtn",function(){
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken"),
        // 群号
            group_num=localStorage.getItem("group_num"),
        // 投票id
            vote_id=localStorage.getItem("vote_id"),
        // 获取choised
            choised=$("input[name=radio1]:checked").attr("id");
        // 数据格式转换
        data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num,"vote_id":vote_id,"choised":choised})];
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
                    localStorage.setItem("apptoken",data.apptoken)
                }
            }
        })
    });
});