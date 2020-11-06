function showNewCustomers()
{
    jsc_hide_all_viewports();
    jsc_show_divbyID("view_newcustomer");

}
function SaveNewCustomer()
{
    SQLBridge.insertFromForm("view_newcustomer",'customers',NewCustomerSaveCallback);
    
}
function NewCustomerSaveCallback()
{

}
