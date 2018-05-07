/**
 * Created by qiaopeng on 16-7-9.
 */
$(function(){
    $(window).resize(function(){
        $('#appdetail_dg').datagrid('resize');
    });
});

// 检索评价库信息
function searchappdetailall(){
    var url = 'async/diaocha/getrs1.cc';
    var queryParams = {'jiaocai':'','banji':'','jiaoshi':''};
    loadDataGrid_data('appdetail_dg', url, queryParams, 'GET');
}

// 检索评价库信息
function searchappdetail(value,name){
    var bool = $('#appdetailSearcherForm').form('enableValidation').form('validate');
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
    var url = 'async/diaocha/getrs1.cc';
    var queryParams = {'jiaocai':jiaocai,'banji':banji,'jiaoshi':jiaoshi};
    loadDataGrid_data('appdetail_dg', url, queryParams, 'POST');
}

function editappdetail(type) {
    var rows = $('#appdetail_dg').datagrid('getSelections');
    if(2 != type && rows.length) {
        for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if(0 == type) {
                // 删除
                delAccountDlg(row.uid);
            } else if(1 == type) {
                // 更新
                uptAccountDlg(row.uid, row.phone, row.nickname, row.powercd);
            } else if(3 == type) {
                // 结束指定教材评价
                endAppdetailDlg(row.uuid);
            }
        }
    } else if(2 == type) {
        // 新增
        addAccountDlg();
    } else {
        $.messager.alert('提示','请选中要修改的行','info');
    }
}

// 结束指定教材评价对话框
function endAppdetailDlg(uuid) {
    endAppdetailSevr(uuid);
}
// 结束指定教材评价逻辑(服务器交互)
function endAppdetailSevr(uuid) {
    var msg = '';

    $.ajax({
        url:'async/diaocha/creaters1.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'uuid':uuid},
        success:function(resp){
            if(200 == resp.code) {
                msg = '操作成功';
                searchappdetailall();
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
function saveappdetail(){
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
            saveFile('#appdetail_dg');
        }
    });
}