$('#loginBtn').click(function(){

    var check = false;
    check = checkLogin();
    if(!check){ return; }

    var username = $("#userName").val();
    var password = $("#password").val();
    
    $.ajax({
        url:"async/ssmp/login.cc",
        type:"post",
        async:false,
        dataType:"json",
        data:{
            "username":username,
            "password":password
        },
        success:function(resp){
            if(null != resp) {
                if(200 == resp.code) {
                    window.location.href=com.global.index_href;
                } else {
                    $("#password").val('');
                    $("#password").focus();
                    window.alert(resp.msg);
                }
            } else {
                window.alert("服务器异常");
            }
        },
        error:function(err){
        }
    });
});

function checkLogin() {
    var fm = window.document.login;
    var user = fm.userName;
    user.value = trim(user.value);
    
    if(null == user.value || "" == user.value) {
        window.alert("\请输入您的账号...");
        user.focus();
        window.event.returnValue = false;
        return false;
    }
    if("" == fm.password.value) {
        window.alert("\请输入您的密码...");
        fm.password.focus();
        window.event.returnValue = false;
        return false;
    }
    if(16 < fm.password.value.length) {
        fm.password.value = fm.password.value.substr(0,16);
    }
    //fm.password.value = md5(md5(fm.password.value));
    fm.password.value = md5(fm.password.value);
    return true;
}

function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
}
