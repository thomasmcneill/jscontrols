class class_SideBar extends HTMLElement {
	connectedCallback() 
	{
		var myHTML = `
			<style>

				.jsc_id_button_div {
					width: var(--side-bar-closed-width);
					position: absolute;
					top: 0;
					left: 0px;
					margin: 0px;
					padding: 0px;
					height: var(--title-bar-height);
				}
				.jsc_id_openbtn {
					width: var(--side-bar-closed-width);
					height: 100%;
					font-size: var(--h4-text-size);
					cursor: pointer;
					background-color: var(--control-bg-color);
					color: white;
					border: none;
					margin: 0px;
					text-align: left;
				}

				.jsc_id_openbtn:hover {
					background-color: var(--control-hover-color);
				  }
  

				.jsc_id_sidebar {
					height: 0%; 
					width: var(--side-bar-closed-width);
					position: absolute; 
					z-index: 1; /* on top */
					top: 0;
					left: 0;
					background-color: var(--control-bg-color);
					overflow-x: hidden; /* no scroll */
					overflow: hidden;
					transition: 0.5s; 
				}
				.jsc_id_sidebar a, a:visited {
					padding: 8px 8px 8px 32px;
					text-decoration: none;
					font-size: var(--h4-text-size);
					color: var(--control-text-color);
					display: block;
					transition: 0.3s;
				}

				.jsc_id_sidebar a:hover {
					background-color: var(--control-hover-color);
				}
  

				.jsc_id_closebtn  {
					text-align: right;

				}



				/* smaller screens */
				@media screen and (max-height: 450px) {
				  .jsc_id_sidebar {padding-top: 15px;}
				  .jsc_id_sidebar a {font-size: 18px;}
				}
			</style>
			<div class="jsc_id_button_div">
				<button id="jsc_id_openbtn" class="jsc_id_openbtn" onclick="jsc_parent.open()"><i class="fas fa-bars"></i></button>
			</div>
			<div id="jsc_id" class="jsc_id_sidebar">
			</div>
		`;		

		this.jsc_id = jsc_AddObject();
		
		// update the id of the div in the control
		myHTML =  myHTML.replace(/jsc_id/g,this.jsc_id);

		// update any function calls back to this
		var parentElementString = "document.getElementById('" + this.getAttribute('id') + "')";
		myHTML =  myHTML.replace(/jsc_parent/g,parentElementString);
		this.innerHTML = myHTML;

		/////////////////////////////////
		// Place text in button
		this.myText = '';
		if(this.hasAttribute('mytext'))
		{
			this.myText = this.getAttribute('mytext');
			document.getElementById(this.jsc_id+ "_openbtn").innerHTML = this.myText;

		}



		////////////////////////////////////
		// Update HTML with Menu Items
		myHTML = document.getElementById(this.jsc_id).innerHTML;
		myHTML = `<a href="javascript:void(0)" class="jsc_id_closebtn" onclick="jsc_parent.close()">&times;</a>`;
		myHTML =  myHTML.replace(/jsc_parent/g,parentElementString);
		myHTML =  myHTML.replace(/jsc_id/g,this.jsc_id);
		this.myMenuItems = '';
		
		var closefunc = "document.getElementById('" + this.getAttribute('id') + "').close()";

		if(this.hasAttribute('items'))
		{
			this.myMenuItems = window[this.getAttribute('items')];
			
			for(var outer=0;outer<this.myMenuItems.length;outer++) {
				var text = this.myMenuItems[outer][0];
				var css = this.myMenuItems[outer][1];
				var func = this.myMenuItems[outer][2];
				myHTML=myHTML +  `<a href="#" class="` + css + `" onclick="` + func + `; ` + closefunc + `;"> ` + text + `</a>`;  
			}
		}
		
		document.getElementById(this.jsc_id).innerHTML=myHTML;
		


	}
	open() {
		document.getElementById(this.jsc_id).style.height = "100%";
		document.getElementById(this.jsc_id).style.width = "var(--side-bar-open-width)";
		var divsToHide = document.getElementsByClassName("jsc_viewport"); 
		for(var i = 0; i < divsToHide.length; i++){
		   var el = divsToHide[i];
		   el.style.marginLeft = "250px";
		}
	  
	}
	close() {
		document.getElementById(this.jsc_id).style.height = "0";
		document.getElementById(this.jsc_id).style.width = "var(-side-bar-closed-width)";
		var divsToHide = document.getElementsByClassName("jsc_viewport"); 
		for(var i = 0; i < divsToHide.length; i++){
		   var el = divsToHide[i];
		   el.style.marginLeft = "0px";
		}

	}

}
customElements.define('side-bar', class_SideBar);

