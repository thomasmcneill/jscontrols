function showTable()
{
    jsc_hide_all_viewports();
    jsc_show_divbyID("view_table");

    var elem = document.getElementById('table');
    SQLBridge.simple('SELECT * From t1',UpdateTable);

}

function GetTable()
{
    var elem = document.getElementById('table');
    SQLBridge.simple('SELECT * From t1',UpdateTable);
}
function UpdateTable(json)
{
    var elem = document.getElementById('table');
    elem.processJSON(json);
    elem.drawTable();

}

