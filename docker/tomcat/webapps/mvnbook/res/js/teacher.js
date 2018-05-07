/**
 * Created by qiaopeng on 16-6-25.
 */
$(function(){
    $(window).resize(function(){
        $('#teacher_dg').datagrid('resize');
    });
    searchteacherAll();
});

// 检索教师库信息
function searchteacherAll(){
    var url = 'async/table/getteacher.cc';
    var queryParams = {'code':'','dcode':'','scode':'','value':''};
    loadDataGrid_data('teacher_dg', url, queryParams, 'GET');
}

// 检索教师库信息
function searchteacher(value,name){
    var bool = $('#teacherSearcherForm').form('enableValidation').form('validate');
    if(!bool) return bool;
    var teacher_code = '';
    var teacher_dcode = '';
    var teacher_scode = '';
    var teacher_text = '';
    if('teacher_code' == name) {
        teacher_code = value;
    }
    if('teacher_dcode' == name) {
        teacher_dcode = value;
    }
    if('teacher_scode' == name) {
        teacher_scode = value;
    }
    if('teacher_text' == name) {
        teacher_text = value;
    }
    var url = 'async/table/getteacher.cc';
    var queryParams = {'code':teacher_code,'dcode':teacher_dcode,'scode':teacher_scode,'value':teacher_text};
    loadDataGrid_data('teacher_dg', url, queryParams, 'POST');
}

function editteacher(type) {
    var rows = $('#teacher_dg').datagrid('getSelections');
    if(2 != type && rows.length) {
        for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if(0 == type) {
                // 删除
                delTeacherDlg(row.code,row.value);
            } else if(1 == type) {
                // 更新
                uptTeacherDlg(row.code,row.dcode,row.scode,row.value);
            }
        }
    } else if(2 == type) {
        // 新增
        addTeacherDlg();
    } else {
        $.messager.alert('提示','请选中要修改的行','info');
    }
}

// 新增教师信息对话框
function addTeacherDlg() {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '新增教师',
        width: 300,
        height: 200,
        closed: false,
        cache: false,
        href: 'table/addteacherdlg.html',
        modal: true,
        onLoad:function(){
            $('#teacher_dcode').combobox({
                onSelect : function(rec) {
                    var url = 'async/table/staffroom.cc?code=&value=&dcode='+rec.code;
                    $('#teacher_scode').combobox('reload',url);
                }
            });
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addteacherdlg').form('enableValidation').form('validate');
                if(bool) {
                    addTeacherServ($('#teacher_code').val(), $('#teacher_dcode').combobox('getValue'), $('#teacher_scode').combobox('getValue'), $('#teacher_text').val());
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

// 新增教师信息逻辑(服务器交互)
function addTeacherServ(code, dcode, scode, value) {
    var msg = '';

    $.ajax({
        url:'async/table/addteacher.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'dcode':dcode,'scode':scode,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '新增信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchteacherAll();
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

// 变更教师信息对话框
function uptTeacherDlg(code, dcode, scode, value) {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '变更教师',
        width: 300,
        height: 200,
        closed: false,
        cache: false,
        href: 'table/addteacherdlg.html',
        modal: true,
        onLoad:function(){
            $('#teacher_dcode').combobox({
                onSelect : function(rec) {
                    var url = 'async/table/staffroom.cc?code=&value=&dcode='+rec.code;
                    $('#teacher_scode').combobox('reload',url);
                }
            });
            $('#teacher_code').textbox('readonly',true);
            $('#teacher_code').textbox('setValue',code);
            $('#teacher_text').textbox('setValue',value);
            $('#teacher_dcode').combobox('select',dcode);
            $('#teacher_scode').combobox('select',scode);
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addteacherdlg').form('enableValidation').form('validate');
                if(bool) {
                    uptTeacherServ($('#teacher_code').val(), $('#teacher_dcode').combobox('getValue'), $('#teacher_scode').combobox('getValue'), $('#teacher_text').val());
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

// 变更教师信息逻辑(服务器交互)
function uptTeacherServ(code, dcode, scode, value) {
    var msg = '';

    $.ajax({
        url:'async/table/uptteacher.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'dcode':dcode,'scode':scode,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '变更信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchteacherAll();
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

// 删除教师信息对话框
function delTeacherDlg(code, value) {
    $.messager.confirm('确认','确定要删除此信息[' + code + ':' + value + ']...',function(r){
        if(r) {
            delTeacherServ(code, value);
        }
    });
}

// 删除教师信息逻辑(服务器交互)
function delTeacherServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/delteacher.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code},
        success:function(resp){
            if(200 == resp.code) {
                msg = '删除信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchteacherAll();
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

