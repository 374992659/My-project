//截止时间的自调函数
(function(){
    $("#time").datetimePicker({
        title: '出发时间',
        min: "2017-12-12",
        max: "2022-12-12 12:12",
        onChange: function (picker, values, displayValues) {
            console.log(values);
        }
    });
    $("#time2").datetimePicker({
        times: function () {
            return [
                {
                    values: (function () {
                        var hours = [];
                        for (var i=0; i<24; i++) hours.push(i > 9 ? i : '0'+i);
                        return hours;
                    })()
                },
                {
                    divider: true,  // 这是一个分隔符
                    content: '-'
                }
            ];
        },
        onChange: function (picker, values, displayValues) {
            console.log(values);
        }
    });
    $("#time3").datetimePicker({
        times: function () {
            return [
                {
                    values: ['上午', '下午']
                }
            ];
        },
        value: '2012-12-12 上午',
        onChange: function (picker, values, displayValues) {
            console.log(values);
        }
    });
    $("#time4").datetimePicker({
        times: function () {
            return [
                {
                    values: ['上午8点', '下午2点', '晚上8点']
                }
            ];
        },
        max: '2013-12-12',
        onChange: function (picker, values, displayValues) {
            console.log(values);
        }
    });

    $("#time-format").datetimePicker({
        title: '自定义格式',
        yearSplit: '-',
        monthSplit: '-',
        dateSplit: '',
        times: function () {
            return [  // 自定义的时间
                {
                    values: (function () {
                        var hours = [];
                        for (var i=0; i<24; i++) hours.push(i > 9 ? i : '0'+i);
                        return hours;
                    })()
                },
                {
                    divider: true,  // 这是一个分隔符
                    content: ':'
                },
                {
                    values: (function () {
                        var minutes = [];
                        for (var i=0; i<59; i++) minutes.push(i > 9 ? i : '0'+i);
                        return minutes;
                    })()
                },
                {
                    divider: true,  // 这是一个分隔符
                    content: ''
                }
            ];
        },
        onChange: function (picker, values, displayValues) {
            console.log(values);
        }
    });
    $("#time-inline").datetimePicker({
        container: '#time-container',
        onChange: function (picker, values, displayValues) {
            console.log(values);
        }

    });
})();

// 添加选项
(function(){
var num=2;
    $(".add").click(function(){
        num++;
        var option=$("<div class=\"weui-cell \">\n" +
            "                <div class=\"weui-cell__bd addOption\">\n" +
            "                    <span><img style=\"width: 20px;position: relative;z-index: 100\" src=\"image/minus.png\" alt=\"\" class=\"delImg\"></span>\n" +
            "                    <input class=\"weui-input delImg\" name='option' type=\"text\" placeholder=\"选项"+num +"\"  maxlength=\"40\" style=\"font-size: 12px\">\n" +
            "                </div>\n" +
            "            </div>");
        $(this).before(option);
        console.log(num);

        });
    // 删除选项函数
    $(".option").on("click",".weui-cell .addOption span .delImg",function () {
        console.log(123);
        $(this).parent().parent().parent().remove();

    });

})();
// 是否匿名名
(function(){
    var num=0;
    $(".switch").click(function(){
        num++;
        if(num%2===0){
            $(".switch").attr("value",1)
        }else{
            $(".switch").attr("value",2)
        }
        console.log(num);
    });

})();
// 请求数据
$(document).ready(function(){
    // 上传图片
    $('#uploaderInput').change(function() {
        var Url=window.URL.createObjectURL(this.files[0]) ;
        var formData= new FormData();
        var apptoken=localStorage.getItem("apptoken");
        formData.append("file",$("#uploaderInput")[0].files[0]);
        var data=["",JSON.stringify({"apptoken":apptoken})];
        var json=jsEncryptData(data);
        formData.append("data",json);
        console.log(formData);
        $.ajax({
            type:"POST",
            url:url+"group_uploadNoticePic",
            fileElementId:'uploaderInput',
            data:formData,
            processData : false,
            contentType : false,
            secureuri:false,
            success : function(data){
                // 解密
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    console.log(data.data[0]);
                    localStorage.setItem("flockVotePic",data.data[0]);
                    console.log(data.data[0]);
                    $(".img").attr({
                        "src":Url,
                        "style":"width:77px;height:77px"
                    });

                }
            },
            error:function (data) {
                console.log(data);
            }
        });
    });
    // 图片预览功能
$(".voteImg").click(function(){
    var url=$(this).attr("src");
    console.log(url);
    if($(".weui-gallery").is(":hidden")){
        $(".weui-gallery").show();
        $(".weui-gallery__img").attr("style","background-image:url("+url+")")
    }
});
$(".weui-gallery").click(function(){
    $(".weui-gallery").hide();
});
// 删除功能
    $(".weui-icon-delete").click(function(){
        console.log(123);
        $(".voteImg").removeAttr("src");
        console.log(321);
    });
    //获取小区code
    (function(){
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        var data=["",JSON.stringify({"apptoken":apptoken})];
        var json=jsEncryptData(data);
        $.ajax({
            url:url+"UserCenter_getApplicationGarden",
            type:"POST",
            data:{"data":json},
            success:function(data){
                // 解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    html="";
                    $.each(data.data,function(i,item){
                        html+=`
                         <option value="2" title="${item.garden_code}">${item.garden_name}</option>                     
                        `
                    });
                    $(".votoGarden").html(html);
                }
            }
        })
    })();
// 发布投票
    $(".submitBtn").click(function(){
        var success=$(".success");
        var hideTop=function(){
            success.empty()};
        // 获取图片
        var picture=localStorage.getItem("flockVotePic");
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken"),
        // 获取群号码
            group_code=localStorage.getItem("group_num"),
        // 获取主题
            title=$(".title").val(),
        // 获取内容
            content=$(".content").val();
            console.log(content);
        // 获取选项内容
            var   option={};
            $("input[name='option']").each(function(i,item){
                option[parseInt(i+1)]=$(this).val();
            });
            console.log(option);
        // 获取话题类型
        var type=$(".voteType").val();
       console.log(typeof type);
        console.log(type);
        // 获取小区code
        var garden_code=$(".votoGarden option:selected").attr("title");
        // 获取结束时间
        var time=$(".voteEndTime").val();
        // 转换成时间戳
       // var timestamp2 = Date.parse(new Date(time));
       // var timestamp2=new Date(time);
       // var overTime= timestamp2 / 1000;
        var arr = time.split(/[- : \/]/),
             date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4]);
            alert(date);
        var overTime= date / 1000;
        // 获取是否匿名
        var anonymous=$(".switch").val();
        // 数据格式转换
        // Choice=JSON.stringify(option);
        data=["",JSON.stringify({"apptoken":apptoken,"title":title,"content":content,"picture":picture,"type":type,"garden_code":garden_code,"group_num":group_code,"end_time":overTime,"anonymous":anonymous,"choice":JSON.stringify(option)})];
        alert(data);
        // console.log(Choice);
// 数据加密
    jsonEncryptData=jsEncryptData(data);
    // choice=jsonEncryptData(Choice);
    // 发起ajax请求
        $.ajax({
            url:url+"group_addVote",
            type:"POST",
            data:{"data":jsonEncryptData},
            success:function(data){
                // 解密数据
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    showHide(data.errmsg);
                    //window.location.href="flockVote.html";
                }else{
                    showHide(data.errmsg);
                }
            }
        })






    });



});


