/**
 * Created by qiaopeng on 16-7-5.
 */
$(function(){
    $(window).resize(function(){
        $('#roles_dg').datagrid('resize');
    });
    searchrolesAll();
});

// 检索角色库信息
function searchrolesAll(){
    var url = 'async/nav/getroles.cc';
    var queryParams = {'code':'','value':''};
    loadDataGrid_data('roles_dg', url, queryParams, 'GET');
}

function editroles(type) {
    var rows = $('#roles_dg').datagrid('getSelections');
    if(2 != type && rows.length) {
        for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if(0 == type) {
                // 删除
                delRolesDlg(row.code,row.value);
            } else if(1 == type) {
                // 更新
                uptRolesDlg(row.code,row.value);
            }
        }
    } else if(2 == type) {
        // 新增
        addRolesDlg();
    } else {
        $.messager.alert('提示','请选中要修改的行','info');
    }
}

// 新增角色信息对话框
function addRolesDlg() {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '新增角色',
        width: 526,
        height: 320,
        closed: false,
        cache: false,
        href: 'sysrole/addrolesdlg.html',
        modal: true,
        onLoad:function(){
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addrolesdlg').form('enableValidation').form('validate');
                if(bool) {
                    addRolesServ($('#roles_code').val(), $('#roles_text').val());
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

// 新增角色信息逻辑(服务器交互)
function addRolesServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/nav/addroles.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '新增信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchrolesAll();
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
                $.messager.alert('错误','新增信息失败','error',function(){$('#dlgPopup').dialog('close');});
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误','error',function(){$('#dlgPopup').dialog('close');});
        }
    });
    return;
}

// 变更角色信息对话框
function uptRolesDlg(code, value) {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '变更角色',
        width: 526,
        height: 320,
        closed: false,
        cache: false,
        href: 'sysrole/addrolesdlg.html',
        modal: true,
        onLoad:function(){
            $('#roles_code').textbox('readonly',true);
            $('#roles_code').textbox('setValue',code);
            $('#roles_text').textbox('setValue',value);
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addrolesdlg').form('enableValidation').form('validate');
                if(bool) {
                    uptRolesServ($('#roles_code').val(), $('#roles_text').val());
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

// 变更角色信息逻辑(服务器交互)
function uptRolesServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/nav/uptroles.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '变更信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchrolesAll();
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
                $.messager.alert('错误','变更信息失败','error',function(){$('#dlgPopup').dialog('close');});
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误','error',function(){$('#dlgPopup').dialog('close');});
        }
    });
    return;
}

// 删除角色信息对话框
function delRolesDlg(code, value) {
    $.messager.confirm('确认','确定要删除此信息[' + code + ':' + value + ']...',function(r){
        if(r) {
            delRolesServ(code, value);
        }
    });
}

// 删除角色信息逻辑(服务器交互)
function delRolesServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/nav/delroles.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code},
        success:function(resp){
            if(200 == resp.code) {
                msg = '删除信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchrolesAll();
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
                $.messager.alert('错误','删除信息失败','error',function(){$('#dlgPopup').dialog('close');});
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误','error',function(){$('#dlgPopup').dialog('close');});
        }
    });
    return;
}
