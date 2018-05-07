/**
 * Created by qiaopeng on 16-7-9.
 */
$(function(){
    $(window).resize(function(){
        $('#jiaoshitj_dg').datagrid('resize');
    });
    searchjiaoshitjall();
});

// 检索评价库信息
function searchjiaoshitjall(){
    var url = 'async/diaocha/getrsjiaoshi.cc';
    var queryParams = {'jiaocai':'','banji':'','jiaoshi':''};
    loadDataGrid_data('jiaoshitj_dg', url, queryParams, 'GET');
}

// 检索评价库信息
function searchjiaoshitj(value,name){
    var bool = $('#jiaoshitjSearcherForm').form('enableValidation').form('validate');
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
    var url = 'async/diaocha/getrsjiaoshi.cc';
    var queryParams = {'jiaocai':jiaocai,'banji':banji,'jiaoshi':jiaoshi};
    loadDataGrid_data('jiaoshitj_dg', url, queryParams, 'POST');
}

function editjiaoshitj(type) {
    var rows = $('#jiaoshitj_dg').datagrid('getSelections');
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

// 保存评价库信息
function savejiaoshitj(){
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
            saveFile('#jiaoshitj_dg');
        }
    });
}