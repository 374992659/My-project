var showHide=function(a){
    "use strict";
    var success=$(".success");
    var show=function(){
        success.show()
    };
    var hide=function(){
        success.hide()
    };
    success.html(a);
    show();
    setTimeout(hide,3000)

};
