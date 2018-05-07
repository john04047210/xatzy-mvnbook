/**
 * Created by qiaopeng on 16-6-24.
 */
$(function(){
    //$('#books_dg').datagrid({'data':[]}).datagrid('clientPaging');    // 如果使用使用分页功能 此方法初始化分页信息
    $(window).resize(function(){
        $('#department_dg').datagrid('resize');
    });
    searchdepartmentAll();
});

// 检索系库信息
function searchdepartmentAll(){
    var url = 'async/table/getdepartment.cc';
    var queryParams = {'code':'','value':''};
    loadDataGrid_data('department_dg', url, queryParams, 'GET');
}

// 检索系库信息
function searchdepartment(value,name){
    var bool = $('#departmentSearcherForm').form('enableValidation').form('validate');
    if(!bool) return bool;
    var department_code = '';
    var department_text = '';
    if('department_code' == name) {
        department_code = value;
    }
    if('department_text' == name) {
        department_text = value;
    }
    var url = 'async/table/getdepartment.cc';
    var queryParams = {'code':department_code,'value':department_text};
    loadDataGrid_data('department_dg', url, queryParams, 'POST');
}

function editdepartment(type) {
    var rows = $('#department_dg').datagrid('getSelections');
    if(2 != type && rows.length) {
        for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if(0 == type) {
                // 删除
                delDepartmentDlg(row.code,row.value);
            } else if(1 == type) {
                // 更新
                uptDepartmentDlg(row.code,row.value);
            }
        }
    } else if(2 == type) {
        // 新增
        addDepartmentDlg();
    } else {
        $.messager.alert('提示','请选中要修改的行','info');
    }
}

// 新增承担单位信息对话框
function addDepartmentDlg() {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '新增承担单位信息',
        width: 526,
        height: 320,
        closed: false,
        cache: false,
        href: 'table/adddepartmentdlg.html',
        modal: true,
        onLoad:function(){
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#adddepartmentdlg').form('enableValidation').form('validate');
                if(bool) {
                    addDepartmentServ($('#department_code').val(), $('#department_text').val());
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

// 新增承担单位信息逻辑(服务器交互)
function addDepartmentServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/adddepartment.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '新增信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchdepartmentAll();
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

// 变更系信息对话框
function uptDepartmentDlg(code, value) {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '变更承担单位名称',
        width: 526,
        height: 320,
        closed: false,
        cache: false,
        href: 'table/adddepartmentdlg.html',
        modal: true,
        onLoad:function(){
            $('#department_code').textbox('readonly',true);
            $('#department_code').textbox('setValue',code);
            $('#department_text').textbox('setValue',value);
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#adddepartmentdlg').form('enableValidation').form('validate');
                if(bool) {
                    uptDepartmentServ($('#department_code').val(), $('#department_text').val());
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

// 变更承担单位信息逻辑(服务器交互)
function uptDepartmentServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/uptdepartment.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '变更信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchdepartmentAll();
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

// 删除系信息对话框
function delDepartmentDlg(code, value) {
    $.messager.confirm('确认','确定要删除此信息[' + code + ':' + value + ']...',function(r){
        if(r) {
            delDepartmentServ(code, value);
        }
    });
}

// 删除承担单位信息逻辑(服务器交互)
function delDepartmentServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/deldepartment.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code},
        success:function(resp){
            if(200 == resp.code) {
                msg = '删除信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchdepartmentAll();
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
