class class_TitleBar extends HTMLElement {
	connectedCallback() 
	{
		var myHTML = `
			<style>

				.jsc_id_div {
					width: 100%;
					position: absolute;
					top: 0;
					left: var(--side-bar-closed-width);
					margin: 0px;

					font-size: var(--h4-text-size);
					height: var(--title-bar-height);
					background-color: var(--control-bg-color);
					color: var(--control-text-color);
					


				}


			</style>
			<div class="jsc_id_div">jsc_text</div>
		`;		

		this.jsc_id = jsc_AddObject();
		this.text = this.innerHTML;
		// update the id of the div in the control
		myHTML =  myHTML.replace(/jsc_id/g,this.jsc_id);
		//myHTML =  myHTML.replace(/jsc_text/g,this.text);

		// update any function calls back to this
		var parentElementString = "document.getElementById('" + this.getAttribute('id') + "')";
		myHTML =  myHTML.replace(/jsc_parent/g,parentElementString);

		this.innerHTML = myHTML;

		document.getElementById(this.getAttribute('id')).style.padding='20px;'
		document.getElementById(this.getAttribute('id')).style.margin='0px;'
		document.getElementById(this.getAttribute('id')).style.display='';
		


	}
	

}
customElements.define('title-bar', class_TitleBar);

