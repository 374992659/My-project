//验证手机号码
function validate4(phone){
    var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    if(!myreg.test(phone)){
        alert("请输入有效的手机号！");
    }else{
        alert("手机号有效");
    }
}