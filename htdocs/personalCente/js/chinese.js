function checkChinese(a){
    var name=$("#"+a);
    if(!/^[\u4e00-\u9fa5]+$/gi.test(name.value))
        alert("ֻ�����뺺��");

    else
        alert("�ύ�ɹ�");
}
