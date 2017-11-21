//验证手机号码
function validate4(element){
    var reg = /^0?1[3|4|5|8][0-9]\d{8}$/;
    if(element=="" ||element.length!=11 ||  !reg.test(element)){
        alert("手机号有误");
        return false;
    }
    return true;
}