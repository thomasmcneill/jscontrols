var jsc_ObjectsDict = new Object();

function jsc_AddObject(id) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < 10; i++ ) {
	  result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   result = 'jsc_' + result;
   jsc_ObjectsDict[id] = result;
   return result;
}			

function jsc_toggle_display_byID(id)
{
   var el = document.getElementById(id);
   if (el.style.display === "none") {
      /* check to see if previous style was saved and restore it */
      if(el.hasAttribute("jsc_oldstyle"))
      {
         el.style.display = el.getAttribute("jsc_display_oldstyle");
      } else {
         el.style.display = "block";
      }
   } else {
      /* Save previous style.  It may not be block so that when he toggle it back it displays correctly. */

      var oldstyle = el.style.display;
      el.setAttribute("jsc_display_oldstyle",oldstyle);
      el.style.display = "none";
   }
}
function jsc_hide_all_viewports()
{
   var divsToHide = document.getElementsByClassName("jsc_viewport"); 
   for(var i = 0; i < divsToHide.length; i++){
      var el = divsToHide[i];
      var oldstyle = el.style.display;
      el.setAttribute("jsc_display_oldstyle",oldstyle);
      el.style.display = "none";
   }

}
function jsc_hide_divbyID(id)
{
   var el = document.getElementById(id);
   var oldstyle = el.style.display;
   el.setAttribute("jsc_display_oldstyle",oldstyle);
   el.style.display = "none";
}

function jsc_show_divbyID(id)
{
   var el = document.getElementById(id);
   /* check to see if previous style was saved and restore it */
   if(el.hasAttribute("jsc_oldstyle"))
   {
      el.style.display = el.getAttribute("jsc_display_oldstyle");
   } else {
      el.style.display = "block";
   }
}


function jsc_getAllDescendents(id)
{
   var allDescendents =  [];
   var t = document.getElementById(id).childNodes;
   for(let i = 0; i < t.length; i++) {
      allDescendents.push(t[i]);
      if(t[i].hasChildNodes)
         jsc_getAllDescendentsRecurse(t[i], allDescendents);

   }
   return allDescendents;
}
function jsc_getAllDescendentsRecurse(el, descendants) {

   var children = el.childNodes;
   for(let i=0; i < children.length; i++) 
   {
      descendants.push(children[i]);
      if(children[i].hasChildNodes)
         jsc_getAllDescendentsRecurse(children[i],descendants);
   }
}
