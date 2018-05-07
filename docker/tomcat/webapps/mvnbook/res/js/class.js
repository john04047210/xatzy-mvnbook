/**
 * Created by qiaopeng on 16-6-25.
 */
$(function(){
    $(window).resize(function(){
        $('#class_dg').datagrid('resize');
    });
    searchclassAll();
});

// 检索班级库信息
function searchclassAll(){
    var url = 'async/table/getclass.cc';
    var queryParams = {'code':'','sycode':'','value':''};
    loadDataGrid_data('class_dg', url, queryParams, 'GET');
}

// 检索班级库信息
function searchclass(value,name){
    var bool = $('#classSearcherForm').form('enableValidation').form('validate');
    if(!bool) return bool;
    var class_code = '';
    var class_sycode = '';
    var class_text = '';
    if('class_code' == name) {
        class_code = value;
    }
    if('class_sycode' == name) {
        class_sycode = value;
    }
    if('class_text' == name) {
        class_text = value;
    }
    var url = 'async/table/getclass.cc';
    var queryParams = {'code':class_code,'sycode':class_sycode,'value':class_text};
    loadDataGrid_data('class_dg', url, queryParams, 'POST');
}

function editclass(type) {
    var rows = $('#class_dg').datagrid('getSelections');
    if(2 != type && rows.length) {
        for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if(0 == type) {
                // 删除
                delClassDlg(row.code,row.value);
            } else if(1 == type) {
                // 更新
                uptClassDlg(row.code,row.sycode,row.value);
            }
        }
    } else if(2 == type) {
        // 新增
        addClassDlg();
    } else {
        $.messager.alert('提示','请选中要修改的行','info');
    }
}

// 新增班级信息对话框
function addClassDlg() {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '新增班级',
        width: 270,
        height: 160,
        closed: false,
        cache: false,
        href: 'table/addclassdlg.html',
        modal: true,
        onLoad:function(){
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addclassdlg').form('enableValidation').form('validate');
                if(bool) {
                    addClassServ($('#class_code').val(), $('#class_sycode').combobox('getValue'), $('#class_text').val());
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

// 新增班级信息逻辑(服务器交互)
function addClassServ(code, sycode, value) {
    var msg = '';

    $.ajax({
        url:'async/table/addclass.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'sycode':sycode,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '新增信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchclassAll();
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

// 变更班级信息对话框
function uptClassDlg(code, sycode, value) {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '变更班级',
        width: 270,
        height: 160,
        closed: false,
        cache: false,
        href: 'table/addclassdlg.html',
        modal: true,
        onLoad:function(){
            $('#class_code').textbox('readonly',true);
            $('#class_code').textbox('setValue',code);
            $('#class_text').textbox('setValue',value);
            $('#class_sycode').combobox('select',sycode);
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addclassdlg').form('enableValidation').form('validate');
                if(bool) {
                    uptClassServ($('#class_code').val(), $('#class_sycode').combobox('getValue'), $('#class_text').val());
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

// 变更班级信息逻辑(服务器交互)
function uptClassServ(code, sycode, value) {
    var msg = '';

    $.ajax({
        url:'async/table/uptclass.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'sycode':sycode,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '变更信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchclassAll();
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

// 删除班级信息对话框
function delClassDlg(code, value) {
    $.messager.confirm('确认','确定要删除此信息[' + code + ':' + value + ']...',function(r){
        if(r) {
            delClassServ(code, value);
        }
    });
}

// 删除班级信息逻辑(服务器交互)
function delClassServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/delclass.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code},
        success:function(resp){
            if(200 == resp.code) {
                msg = '删除信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchclassAll();
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

