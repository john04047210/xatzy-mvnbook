/**
 * Created by qiaopeng on 16-7-5.
 */
$(function(){
    $(window).resize(function(){
        $('#account_dg').datagrid('resize');
    });
    searchaccountall();
});

// 检索帐号库信息
function searchaccountall(){
    var url = 'async/nav/getaccount.cc';
    var queryParams = {'power':9};
    loadDataGrid_data('account_dg', url, queryParams, 'GET');
}
function searchaccount(){
    var url = 'async/nav/getaccount.cc';
    var queryParams = {'power':9};
    loadDataGrid_data('account_dg', url, queryParams, 'GET');
}

function editaccount(type) {
    var rows = $('#account_dg').datagrid('getSelections');
    if(2 != type && rows.length) {
        for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if(0 == type) {
                // 删除
                delAccountDlg(row.uid);
            } else if(1 == type) {
                // 更新
                uptAccountDlg(row.uid, row.phone, row.nickname, row.powercd);
            }
        }
    } else if(2 == type) {
        // 新增
        addAccountDlg();
    } else {
        $.messager.alert('提示','请选中要修改的行','info');
    }
}

// 新增帐号信息对话框
function addAccountDlg() {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '新增帐号',
        width: 526,
        height: 320,
        closed: false,
        cache: false,
        href: 'sysrole/addaccountdlg.html',
        modal: true,
        onLoad:function(){
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addaccountdlg').form('enableValidation').form('validate');
                if(bool) {
                    addAccountServ($('#phone').val(),$('#pwd').val(), $('#nickname').val(),$('#userpower').combobox('getValue'));
                }
                return bool;
            }
        },{
            text:'Cancle',
            handler:function(){
                $('#dlgPopup').dialog('close');
            }
        }]
    });
}

// 新增帐号信息逻辑(服务器交互)
function addAccountServ(phone, pwd, nickname, power) {
    var msg = '';
    var pwd_md5 = md5(pwd);

    $.ajax({
        url:'async/nav/addaccount.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'phone':phone,'password':pwd_md5,'nickname':nickname,'power':power},
        success:function(resp){
            if(200 == resp.code) {
                msg = '新增帐号信息成功<br/>帐号: ' + phone + '<br/>昵称：' + nickname;
                searchaccountall();
                $.messager.alert('提示',msg,'info',function(){$('#dlgPopup').dialog('close');});
            } else if(401 == resp.code) {
                $.messager.alert('错误','登陆失效，请重新登陆','error',function(){window.location.href=com.global.login_href;});
            } else if(406 == resp.code) {
                // 操作安全码校验失败
                $.messager.alert('错误',resp.msg,'error',function(){$('#dlgPopup').dialog('close');});
            } else if(412 <= resp.code) {
                // 验证码校验失败
                $.messager.alert('错误',resp.msg,'error');
            } else {
                $.messager.alert('错误','新增帐号信息失败','error',function(){$('#dlgPopup').dialog('close');});
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误','error',function(){$('#dlgPopup').dialog('close');});
        }
    });
    return;
}

// 更新帐号信息对话框
function uptAccountDlg(uid, phone, nickname, power) {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '更新帐号',
        width: 526,
        height: 320,
        closed: false,
        cache: false,
        href: 'sysrole/addaccountdlg.html',
        modal: true,
        onLoad:function(){
            $('#uid').textbox('readonly',true);
            $('#uid').textbox('setValue',uid);
            $('#phone').textbox('setValue',phone);
            $('#nickname').textbox('setValue',nickname);
            $('#userpower').combobox('select',power);
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addaccountdlg').form('enableValidation').form('validate');
                if(bool) {
                    uptAccountServ($('#uid').val(), $('#phone').val(),$('#pwd').val(), $('#nickname').val(), $('#userpower').combobox('getValue'));
                }
                return bool;
            }
        },{
            text:'Cancle',
            handler:function(){
                $('#dlgPopup').dialog('close');
            }
        }]
    });
}

// 更新帐号信息逻辑(服务器交互)
function uptAccountServ(uid, phone, pwd, nickname, power) {
    var msg = '';
    var pwd_md5 = md5(pwd);

    $.ajax({
        url:'async/nav/uptaccount.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'uid':uid,'phone':phone,'password':pwd_md5,'nickname':nickname,'power':power},
        success:function(resp){
            if(200 == resp.code) {
                msg = '更新帐号信息成功<br/>帐号: ' + phone + '<br/>昵称：' + nickname;
                searchaccountall();
                $.messager.alert('提示',msg,'info',function(){$('#dlgPopup').dialog('close');});
            } else if(401 == resp.code) {
                $.messager.alert('错误','登陆失效，请重新登陆','error',function(){window.location.href=com.global.login_href;});
            } else if(406 == resp.code) {
                // 操作安全码校验失败
                $.messager.alert('错误',resp.msg,'error',function(){$('#dlgPopup').dialog('close');});
            } else if(412 <= resp.code) {
                // 验证码校验失败
                $.messager.alert('错误',resp.msg,'error');
            } else {
                $.messager.alert('错误','更新帐号信息失败','error',function(){$('#dlgPopup').dialog('close');});
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误','error',function(){$('#dlgPopup').dialog('close');});
        }
    });
    return;
}

// 删除帐号信息对话框
function delAccountDlg(uid,nickname) {
    $.messager.confirm('确认','确定要删除此帐号[' + nickname + ']...',function(r){
        if(r) {
            delAccountServ(uid, nickname);
        }
    });
}

// 删除帐号信息逻辑(服务器交互)
function delAccountServ(uid, nickname) {
    var msg = '';

    $.ajax({
        url:'async/nav/delaccount.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'uid':uid},
        success:function(resp){
            if(200 == resp.code) {
                msg = '删除帐号成功<br/>昵称: ' + nickname;
                searchaccountall();
                $.messager.alert('提示',msg,'info',function(){$('#dlgPopup').dialog('close');});
            } else if(401 == resp.code) {
                $.messager.alert('错误','登陆失效，请重新登陆','error',function(){window.location.href=com.global.login_href;});
            } else if(406 == resp.code) {
                // 操作安全码校验失败
                $.messager.alert('错误',resp.msg,'error',function(){$('#dlgPopup').dialog('close');});
            } else if(412 <= resp.code) {
                // 验证码校验失败
                $.messager.alert('错误',resp.msg,'error');
            } else {
                $.messager.alert('错误','删除帐号信息失败','error',function(){$('#dlgPopup').dialog('close');});
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误','error',function(){$('#dlgPopup').dialog('close');});
        }
    });
    return;
}
