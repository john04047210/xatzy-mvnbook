/**
 * Created by qiaopeng on 16-7-9.
 */
$(function(){
    $(window).resize(function(){
        $('#notappraised_dg').datagrid('resize');
    });
});

// 检索评价库信息
function searchnotappraised(value,name){
    var bool = $('#notappraisedSearcherForm').form('enableValidation').form('validate');
    if(!bool) return bool;
    var yuanxi = '';
    if('yuanxi' == name) {
        yuanxi = value.trim();
    }
    var url = 'async/diaocha/notappraised.cc';
    var queryParams = {'yuanxi':yuanxi};
    loadDataGrid_data('notappraised_dg', url, queryParams, 'POST');
}

// 保存评价库信息
function savenotappraised(){
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
            saveFile('#notappraised_dg');
        }
    });
}