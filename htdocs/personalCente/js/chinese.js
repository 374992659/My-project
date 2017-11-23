function checkChinese(a){
    var name=$("#"+a);
    if(!/^[\u4e00-\u9fa5]+$/gi.test(name.value))
        alert("只能输入汉字");

    else
        alert("提交成功");
}
