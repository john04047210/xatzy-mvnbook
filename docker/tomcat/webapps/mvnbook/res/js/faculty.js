/**
 * Created by qiaopeng on 16-6-24.
 */
$(function(){
    //$('#books_dg').datagrid({'data':[]}).datagrid('clientPaging');    // 如果使用使用分页功能 此方法初始化分页信息
    $(window).resize(function(){
        $('#faculty_dg').datagrid('resize');
    });
    searchfacultyAll();
});

// 检索系库信息
function searchfacultyAll(){
    var url = 'async/table/getfaculty.cc';
    var queryParams = {'code':'','value':''};
    loadDataGrid_data('faculty_dg', url, queryParams, 'GET');
}

// 检索系库信息
function searchfaculty(value,name){
    var bool = $('#facultySearcherForm').form('enableValidation').form('validate');
    if(!bool) return bool;
    var faculty_code = '';
    var faculty_text = '';
    if('faculty_code' == name) {
        faculty_code = value;
    }
    if('faculty_text' == name) {
        faculty_text = value;
    }
    var url = 'async/table/getfaculty.cc';
    var queryParams = {'code':faculty_code,'value':faculty_text};
    loadDataGrid_data('faculty_dg', url, queryParams, 'POST');
}

function editfaculty(type) {
    var rows = $('#faculty_dg').datagrid('getSelections');
    if(2 != type && rows.length) {
        for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if(0 == type) {
                // 删除
                delFacultyDlg(row.code,row.value);
            } else if(1 == type) {
                // 更新
                uptFacultyDlg(row.code,row.value);
            }
        }
    } else if(2 == type) {
        // 新增
        addFacultyDlg();
    } else {
        $.messager.alert('提示','请选中要修改的行','info');
    }
}

// 新增系信息对话框
function addFacultyDlg() {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '新增系信息',
        width: 526,
        height: 320,
        closed: false,
        cache: false,
        href: 'table/addfacultydlg.html',
        modal: true,
        onLoad:function(){
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addfacultydlg').form('enableValidation').form('validate');
                if(bool) {
                    addFacultyServ($('#faculty_code').val(), $('#faculty_text').val());
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

// 新增系信息逻辑(服务器交互)
function addFacultyServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/addfaculty.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '新增信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchfacultyAll();
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
                $.messager.alert('错误','新增系信息失败','error',function(){$('#dlgPopup').dialog('close');});
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误','error',function(){$('#dlgPopup').dialog('close');});
        }
    });
    return;
}

// 变更系信息对话框
function uptFacultyDlg(code, value) {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '变更系名称',
        width: 526,
        height: 320,
        closed: false,
        cache: false,
        href: 'table/addfacultydlg.html',
        modal: true,
        onLoad:function(){
            $('#faculty_code').textbox('readonly',true);
            $('#faculty_code').textbox('setValue',code);
            $('#faculty_text').textbox('setValue',value);
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addfacultydlg').form('enableValidation').form('validate');
                if(bool) {
                    uptFacultyServ($('#faculty_code').val(), $('#faculty_text').val());
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

// 变更系信息逻辑(服务器交互)
function uptFacultyServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/uptfaculty.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '变更信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchfacultyAll();
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
                $.messager.alert('错误','变更系信息失败','error',function(){$('#dlgPopup').dialog('close');});
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误','error',function(){$('#dlgPopup').dialog('close');});
        }
    });
    return;
}

// 删除系信息对话框
function delFacultyDlg(code, value) {
    $.messager.confirm('确认','确定要删除此信息[' + code + ':' + value + ']...',function(r){
        if(r) {
            delFacultyServ(code, value);
        }
    });
}

// 删除系信息逻辑(服务器交互)
function delFacultyServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/delfaculty.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code},
        success:function(resp){
            if(200 == resp.code) {
                msg = '删除信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchfacultyAll();
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
