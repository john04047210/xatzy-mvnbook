/**
 * Created by qiaopeng on 16-7-7.
 */
$(function(){
    $(window).resize(function(){
        $('#apprec_dg').datagrid('resize');
    });
});

// 检索评价库信息
function searchapprec(){
    var bool = $('#apprecSearcherForm').form('enableValidation').form('validate');
    if(!bool) return bool;
    var dep = '';
    var term = '';
    var sr = '';
    var tr = '';
    dep = $('#apprec_dep').combobox('getValue');
    term = $('#apprec_term').combobox('getValue');
    sr = $('#apprec_sr').combobox('getValue');
    tr = $('#apprec_tr').combobox('getValue');
    var url = 'async/appraise/getapprec.cc';
    var queryParams = {'dep':dep,'term':term,'sr':sr,'tr':tr};
    loadDataGrid_data('apprec_dg', url, queryParams, 'POST');
}

// 保存评价库信息
function saveapprec(){
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
            saveFile('#apprec_dg');
        }
    });
}
