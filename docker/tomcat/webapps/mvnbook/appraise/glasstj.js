/**
 * Created by qiaopeng on 16-7-9.
 */
$(function(){
    $(window).resize(function(){
        $('#glasstj_dg').datagrid('resize');
    });
    searchglasstjall();
});

// 检索评价库信息
function searchglasstjall(){
    var url = 'async/diaocha/getrsglass.cc';
    var queryParams = {'jiaocai':'','banji':'','jiaoshi':''};
    loadDataGrid_data('glasstj_dg', url, queryParams, 'GET');
}

// 检索评价库信息
function searchglasstj(value,name){
    var bool = $('#glasstjSearcherForm').form('enableValidation').form('validate');
    if(!bool) return bool;
    var jiaocai = '';
    var banji = '';
    var jiaoshi = '';
    if('jiaocai' == name) {
        jiaocai = value.trim();
    }
    if('banji' == name) {
        banji = value.trim();
    }
    if('jiaoshi' == name) {
        jiaoshi = value.trim();
    }
    var url = 'async/diaocha/getrsglass.cc';
    var queryParams = {'jiaocai':jiaocai,'banji':banji,'jiaoshi':jiaoshi};
    loadDataGrid_data('glasstj_dg', url, queryParams, 'POST');
}

function rebacktj() {
    var rows = $('#glasstj_dg').datagrid('getSelections');
    if(rows.length) {
        uuids = [];
        for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            // 撤销指定教材评价
            uuids.push(row.uuid);
        }
        rebackAppdetailSevr(uuids);
    } else {
        $.messager.alert('提示','请选中要撤销的行','info');
    }
}

// 撤销指定教材评价逻辑(服务器交互)
function rebackAppdetailSevr(uuids) {
    var msg = '';

    $.ajax({
        url:'async/diaocha/rebackrs1.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'uuid':uuids.join(',')},
        success:function(resp){
            if(200 == resp.code) {
                msg = '操作成功';
                searchglasstjall();
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
                $.messager.alert('错误','操作失败','error',function(){$('#dlgPopup').dialog('close');});
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误','error',function(){$('#dlgPopup').dialog('close');});
        }
    });
    return;
}

// 保存评价库信息
function saveglasstj(){
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '导出文件',
        width: 526,
        height: 220,
        closed: false,
        cache: false,
        href: 'appraise/savefiledlg.html',
        modal: true,
        onLoad:function(){
            saveFile('#glasstj_dg');
        }
    });
}