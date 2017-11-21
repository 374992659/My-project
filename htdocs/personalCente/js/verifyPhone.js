//验证手机号码
function validate4(element){
    var reg = /^0?1[3|4|5|8][0-9]\d{8}$/;
    var byzz=document.getElementById(element).value;
    if(byzz=="" ||byzz.length!=11 ||  !reg.test(byzz)){
        return false;
    }
    return true;
}