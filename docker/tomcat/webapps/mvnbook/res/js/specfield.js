/**
 * Created by qiaopeng on 16-6-25.
 */
$(function(){
    $(window).resize(function(){
        $('#specfield_dg').datagrid('resize');
    });
    searchspecfieldAll();
});

// 检索专业库信息
function searchspecfieldAll(){
    var url = 'async/table/getspecfield.cc';
    var queryParams = {'code':'','fcode':'','value':''};
    loadDataGrid_data('specfield_dg', url, queryParams, 'GET');
}

// 检索专业库信息
function searchspecfield(value,name){
    var bool = $('#specfieldSearcherForm').form('enableValidation').form('validate');
    if(!bool) return bool;
    var specfield_code = '';
    var specfield_fcode = '';
    var specfield_text = '';
    if('specfield_code' == name) {
        specfield_code = value;
    }
    if('specfield_fcode' == name) {
        specfield_fcode = value;
    }
    if('specfield_text' == name) {
        specfield_text = value;
    }
    var url = 'async/table/getspecfield.cc';
    var queryParams = {'code':specfield_code,'fcode':specfield_fcode,'value':specfield_text};
    loadDataGrid_data('specfield_dg', url, queryParams, 'POST');
}

function editspecfield(type) {
    var rows = $('#specfield_dg').datagrid('getSelections');
    if(2 != type && rows.length) {
        for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if(0 == type) {
                // 删除
                delSpecfieldDlg(row.code,row.value);
            } else if(1 == type) {
                // 更新
                uptSpecfieldDlg(row.code,row.fcode,row.value);
            }
        }
    } else if(2 == type) {
        // 新增
        addSpecfieldDlg();
    } else {
        $.messager.alert('提示','请选中要修改的行','info');
    }
}

// 新增专业信息对话框
function addSpecfieldDlg() {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '新增专业',
        width: 526,
        height: 320,
        closed: false,
        cache: false,
        href: 'table/addspecfielddlg.html',
        modal: true,
        onLoad:function(){
            // 自动请求专业CD
            $('#specfield_fcode').combobox({
                onSelect : function(rec) {
                    getSpecfieldCD_Next(rec.code);
                }
            });
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addspecfielddlg').form('enableValidation').form('validate');
                if(bool) {
                    addSpecfieldServ($('#specfield_code').val(), $('#specfield_fcode').combobox('getValue'), $('#specfield_text').val());
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

// 新增专业信息逻辑(服务器交互)
function addSpecfieldServ(code, fcode, value) {
    var msg = '';

    $.ajax({
        url:'async/table/addspecfield.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'fcode':fcode,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '新增信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchspecfieldAll();
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

// 变更专业信息对话框
function uptSpecfieldDlg(code, fcode, value) {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '变更专业',
        width: 526,
        height: 320,
        closed: false,
        cache: false,
        href: 'table/addspecfielddlg.html',
        modal: true,
        onLoad:function(){
            $('#specfield_fcode').textbox('readonly',true);
            $('#specfield_code').textbox('setValue',code);
            $('#specfield_text').textbox('setValue',value);
            $('#specfield_fcode').combobox('select',fcode);
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addspecfielddlg').form('enableValidation').form('validate');
                if(bool) {
                    uptSpecfieldServ($('#specfield_code').val(), $('#specfield_fcode').combobox('getValue'), $('#specfield_text').val());
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

// 变更专业信息逻辑(服务器交互)
function uptSpecfieldServ(code, fcode, value) {
    var msg = '';

    $.ajax({
        url:'async/table/uptspecfield.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'fcode':fcode,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '变更信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchspecfieldAll();
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

// 删除专业信息对话框
function delSpecfieldDlg(code, value) {
    $.messager.confirm('确认','确定要删除此信息[' + code + ':' + value + ']...',function(r){
        if(r) {
            delSpecfieldServ(code, value);
        }
    });
}

// 删除专业信息逻辑(服务器交互)
function delSpecfieldServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/delspecfield.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code},
        success:function(resp){
            if(200 == resp.code) {
                msg = '删除信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchspecfieldAll();
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

// 获取下一个专业CD
function getSpecfieldCD_Next(fcode) {
    $.ajax({
        url:'async/table/getspecfieldcd_next.cc',
        type:'GET',
        async:true,
        dataType:'json',
        data:{'fcode':fcode},
        success:function(resp){
            if(200 == resp.code) {
                $('#specfield_code').textbox('setValue',resp.data);
            } else {
                $.messager.alert('错误','获取专业CD失败','error');
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误..','error');
        }
    });
}

