class class_TextBox extends HTMLElement {
	connectedCallback() {
		var myHTML = `
			<style>
				#jsc_id {
				  width: 100%;
				  box-sizing: border-box;
				  border: 2px solid var(--input-border-color);
				  border-radius: 4px;
				  font-size: var(--h4-text-size);
				  background-color: var(--input-bg-color);
				  padding: 1.2ch 2ch 1.2ch 2ch;
				  margin: var(--control-margin);
				}
			</style>
			<input type="text" id='jsc_id' name="jsc_name" value="jsc_value" placeholder="jsc_placeholder">
			`;
		this.jsc_id = jsc_AddObject();
		console.log(this.jsc_id);


		// update the id of the div in the control
		myHTML =  myHTML.replace(/jsc_id/g,this.jsc_id);
		// update the name in the control
		myHTML =  myHTML.replace(/jsc_name/g,this.getAttribute('name'));

		// update the value in the control
		if(this.hasAttribute('value'))
			myHTML =  myHTML.replace(/jsc_value/g,this.getAttribute('value'));
		else
			myHTML =  myHTML.replace(/jsc_value/g,'');

		if(this.hasAttribute('uuid'))
				this.uuid = true;
		else
				this.uuid = false;

		// update the placeholder text in the control
		myHTML =  myHTML.replace(/jsc_placeholder/g,this.getAttribute('placeholder'));
		

		// update any function calls back to this using parent
		var parentElementString = "document.getElementById('" + this.getAttribute('id') + "')";
		myHTML =  myHTML.replace(/jsc_parent/g,parentElementString);

		this.innerHTML = myHTML;

	}
	getValue() {

		return document.getElementById(this.jsc_id).value;
	}
	setValue(text) {
		document.getElementById(this.jsc_id).value = text;
	}

	get text() {
		return document.getElementById(this.jsc_id).value;

	}
	set text(value) 
	{
		document.getElementById(this.jsc_id).value = value;
	}
	


}
customElements.define('text-box', class_TextBox);

