$(document).ready(function(){
//添加选项
    $(".addOption").click(function(){
        var $li=$("<li class=\"option\">\n" +
            "<img src=\"image/del.png\" class=\"delImg\" style=\"width: 20px;vertical-align: middle;position: relative;z-index: 1000\" alt=\"\">\n" +
            "<label for=\"\" style=\"width: 21.5%\">选项：</label>\n" +
            "<input type=\"text\">\n" +
            "</li>");
        $(".addOption").before($li);
  //删除选项
    $(".delImg").click(function(e){
        $(e.target).parent().remove();
        num=2;
    });

    });
    // 结束时间
    $.date('#other-date1');
    // 上传图片
    var upload=$("#uploaderFiles");
    addpic(upload);
});

