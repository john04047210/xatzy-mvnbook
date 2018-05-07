/**
 * Created by qiaopeng on 16-6-24.
 */
$(function(){
    $(window).resize(function(){
        $('#schoolyear_dg').datagrid('resize');
    });
    searchschoolyearAll();
});

// 检索学年库信息
function searchschoolyearAll(){
    var url = 'async/table/getschoolyear.cc';
    var queryParams = {'code':'','value':''};
    loadDataGrid_data('schoolyear_dg', url, queryParams, 'GET');
}

// 检索学年库信息
function searchschoolyear(value,name){
    var bool = $('#schoolyearSearcherForm').form('enableValidation').form('validate');
    if(!bool) return bool;
    var schoolyear_code = '';
    var schoolyear_text = '';
    if('schoolyear_code' == name) {
        schoolyear_code = value;
    }
    if('schoolyear_text' == name) {
        schoolyear_text = value;
    }
    var url = 'async/table/getschoolyear.cc';
    var queryParams = {'code':schoolyear_code,'value':schoolyear_text};
    loadDataGrid_data('schoolyear_dg', url, queryParams, 'POST');
}

function editschoolyear(type) {
    var rows = $('#schoolyear_dg').datagrid('getSelections');
    if(2 != type && rows.length) {
        for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if(0 == type) {
                // 删除
                delSchoolyearDlg(row.code,row.value);
            } else if(1 == type) {
                // 更新
                uptSchoolyearDlg(row.code,row.value);
            }
        }
    } else if(2 == type) {
        // 新增
        addSchoolyearDlg();
    } else {
        $.messager.alert('提示','请选中要修改的行','info');
    }
}

// 新增学年信息对话框
function addSchoolyearDlg() {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '新增学年',
        width: 526,
        height: 320,
        closed: false,
        cache: false,
        href: 'table/addschoolyeardlg.html',
        modal: true,
        onLoad:function(){
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addschoolyeardlg').form('enableValidation').form('validate');
                if(bool) {
                    addSchoolyearServ($('#schoolyear_code').val(), $('#schoolyear_text').val());
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

// 新增学年信息逻辑(服务器交互)
function addSchoolyearServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/addschoolyear.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '新增信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchschoolyearAll();
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

// 变更学年信息对话框
function uptSchoolyearDlg(code, value) {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '变更学年',
        width: 526,
        height: 320,
        closed: false,
        cache: false,
        href: 'table/addschoolyeardlg.html',
        modal: true,
        onLoad:function(){
            $('#schoolyear_code').textbox('readonly',true);
            $('#schoolyear_code').textbox('setValue',code);
            $('#schoolyear_text').textbox('setValue',value);
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addschoolyeardlg').form('enableValidation').form('validate');
                if(bool) {
                    uptSchoolyearServ($('#schoolyear_code').val(), $('#schoolyear_text').val());
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

// 变更学年信息逻辑(服务器交互)
function uptSchoolyearServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/uptschoolyear.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '变更信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchschoolyearAll();
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

// 删除学年信息对话框
function delSchoolyearDlg(code, value) {
    $.messager.confirm('确认','确定要删除此信息[' + code + ':' + value + ']...',function(r){
        if(r) {
            delSchoolyearServ(code, value);
        }
    });
}

// 删除学年信息逻辑(服务器交互)
function delSchoolyearServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/delschoolyear.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code},
        success:function(resp){
            if(200 == resp.code) {
                msg = '删除信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchschoolyearAll();
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

