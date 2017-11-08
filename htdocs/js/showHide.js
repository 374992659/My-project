var showHide=function(){
    "use strict";
    var success=$(".success");
    var show=function(){
        success.show()
    };
    var hide=function(){
        success.hide()
    };
    success.html(data.errmsg);
    setTimeout(hide,3000)

};
