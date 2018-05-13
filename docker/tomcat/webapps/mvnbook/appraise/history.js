/**
 * Created by qiaopeng on 16-7-9.
 */
$(function(){
    $(window).resize(function(){
        $('#history_dg').datagrid('resize');
    });
});

// 检索评价库信息
function searchhistory(value,name){
    var bool = $('#historySearcherForm').form('enableValidation').form('validate');
    if(!bool) return bool;
    var isbn = '';
    var jiaocai = '';
    if('isbn' == name) {
        isbn = value;
    }
    if('jiaocai' == name) {
        jiaocai = value;
    }
    var url = 'async/diaocha/getpjhistory.cc';
    var queryParams = {'isbn':isbn,'jiaocai':jiaocai};
    loadDataGrid_data('history_dg', url, queryParams, 'POST');
}

// 保存评价库信息
function savehistory(){
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
            saveFile('#history_dg');
        }
    });
}