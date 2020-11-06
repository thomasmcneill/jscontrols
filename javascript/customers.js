function showCustomers()
{
    jsc_hide_all_viewports();

    var elem = document.getElementById('customertable');
    SQLBridge.simple('SELECT * From customers',UpdateCustomerTable);

    jsc_show_divbyID("view_customers");

}

function UpdateCustomerTable(json)
{
    var elem = document.getElementById('customertable');
    elem.processJSON(json);
    elem.drawTable();

}


function loadCustomer(id)
{
    document.getElementById('formCustomerID').setValue(id);  // set dbid
    SQLBridge.loadForm('view_newcustomer','customers',loadCustomerDone); // load form data and execute callback when done


}
function loadCustomerDone(result)
{

    console.log('loadCustomerDone');
    SQLBridge.loadForm_DisplayResult('view_newcustomer',result);    // display form from json data

    jsc_hide_all_viewports();
    jsc_show_divbyID("view_newcustomer");

}