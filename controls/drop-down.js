class class_DropDown extends HTMLElement {
	connectedCallback() {
		var myHTML = `
			<style>
				.jsc_id {
					position: relative;
  					display: inline-block;
					margin: var(--control-margin);
				}
				.jsc_id_button_class {

					border: 2px solid var(--input-border-color);
					border-radius: 4px;
					  
					background-color: var(--input-bg-color);
					padding: 1.2ch 2ch 1.2ch 2ch;
					font-size: var(--h4-text-size);
					cursor: pointer;
				}
				.jsc_id_dropdown {
					position: relative;
					display: inline-block;
				}
				.jsc_id_dropdown a:hover {
					background-color: var(--control-hover-color);
				}

				.jsc_id_dropdown_content {
					display: none;
					position: absolute;
					background-color: var(--control-bg-color);
					min-width: 230px;
					overflow: auto;
					border: 1px solid #ddd;
					z-index: 1;
					max-height: 200px;
    				overflow: auto;
				}
				.jsc_id_dropdown_content a {
					color: black;
					padding: 1ch 1ch;
					text-decoration: none;
					display: block;
				}

				#jsc_id_input {
					box-sizing: border-box;
					background-image: url('searchicon.png');
					background-position: 14px 12px;
					background-repeat: no-repeat;
					font-size: 16px;
					padding: 14px 20px 12px 45px;
					border: none;
					border-bottom: 1px solid #ddd;
				  }
				  .jsc_id_show {
					  display: block;
					}
			</style>


			<div class="jsc_id_dropdown">
				<button onclick="jsc_onshowfunc" id="jsc_id_button" class="jsc_id_button_class">jsc_text<i class="fa fa-angle-down"></i></button>
				<div id="jsc_id_div_dropdown" class="jsc_id_dropdown_content">
					
				</div>
			</div>

			`;


		this.jsc_id = jsc_AddObject();
		
		var onshowfunc = "document.getElementById('" + this.getAttribute('id') + "').showDrop()";


		this.myPlaceHolder = "";
		if(this.hasAttribute('placeholder')) {
			this.myPlaceHolder = this.getAttribute('placeholder');
		}

		this.mySelectedValue="";
		if(this.hasAttribute('selectedval')) {
			this.mySelectedValue = this.getAttribute('selectedval');
		}


		// for getting column identenfier for database updates
		//if(this.hasAttribute('uniquecolumn'))
		//	this.uniqueColumn = this.getAttribute('uniquecolumn');
		
		var text = "Select Value";
		if(this.myPlaceHolder.length > 0)
			text=this.myPlaceHolder;
		if(this.mySelectedValue.length > 0)
			text=this.mySelectedValue;
		
		// update the id of the div in the control
		myHTML =  myHTML.replace(/jsc_text/g,text);
		myHTML =  myHTML.replace(/jsc_id/g,this.jsc_id);
		myHTML =  myHTML.replace(/jsc_onshowfunc/g,onshowfunc);
		this.innerHTML = myHTML;


		console.log("this.mySelectedValue=" + this.mySelectedValue);
		this.myMenuItems = window[this.getAttribute('items')];


		var onkeyfunc = "document.getElementById('" + this.getAttribute('id') + "').buildList()";
		var myHTML = `					<input type="text" placeholder="Search.." id="jsc_id_input" onkeyup="` + onkeyfunc + `">`;
		myHTML =  myHTML.replace(/jsc_id/g,this.jsc_id);
		document.getElementById(this.jsc_id + "_div_dropdown").innerHTML = myHTML;

		this.buildList();




	}

	showDrop() {
		document.getElementById(this.jsc_id + "_div_dropdown").classList.add(this.jsc_id + "_show");
	}
	selectValue(text) {
		document.getElementById(this.jsc_id + "_div_dropdown").classList.remove(this.jsc_id + "_show");
		document.getElementById(this.jsc_id + "_button").innerHTML = `${text}<i class="fa fa-angle-down">`;
		this.mySelectedValue=text;

	}
	buildList() {

		var match = "";
		if (document.getElementById(this.jsc_id + "_input") != 'undefined' && document.getElementById(this.jsc_id + "_input") != null)
		{
			match = document.getElementById(this.jsc_id + "_input").value;
			match = match.toUpperCase();
		}


		// get drop down element
		var cntnt = document.getElementById(this.jsc_id + "_div_dropdown");

		// remove existing elements from dropdown
		const elements = document.getElementsByClassName(this.jsc_id + "_item");
		while (elements.length > 0) elements[0].remove();


		var myHTML = '';

		if(this.hasAttribute('items'))
		{
			
			for(var outer=0;outer<this.myMenuItems.length;outer++) {
				var text = this.myMenuItems[outer][0];
				var dbid = '';
				var css = '';
				var func = '';
				if(this.myMenuItems[outer].length > 1)
					dbid = this.myMenuItems[outer][1];

				if(this.myMenuItems[outer].length > 2)
					css =  this.myMenuItems[outer][2];

				if(this.myMenuItems[outer].length > 3)
					func = this.myMenuItems[outer][3];

				if(dbid='')
				{
					dbid=text;
				}
				if(func=='')
				{
					func = `document.getElementById('${this.getAttribute('id')}').selectValue('${text}')`;
				}
				if(text.toUpperCase().indexOf(match) > -1 || match.length == 0) {
					
					//var node = document.createElement("A");
					if(text == this.mySelectedValue)
					text = text + `<i class="fa fa-check"></i>`;
					css = this.jsc_id + "_item" + " " + css;
					myHTML+= `<a style="${css}" dbid="${dbid}" onclick="${func}">${text}</a>`;

				}
			}
		}
		cntnt.innerHTML = myHTML;


	}
	setValue(text)
	{
		this.selectValue(text);
		document.getElementById(this.jsc_id + "_div_dropdown").classList.remove(this.jsc_id + "_show");

	}
	getValue()
	{
		return this.mySelectedValue;
	}


}
customElements.define('drop-down', class_DropDown);

