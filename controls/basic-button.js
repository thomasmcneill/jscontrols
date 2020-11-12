
class class_BasicButton extends HTMLElement {
	connectedCallback() {
		var myHTML = `
				<style>
					#jsc_id {
						font-size: var(--h4-text-size);
						background-color: var(--control-bg-color);

						border: none;
						color: white;
						padding: 1.2ch 2ch;
						text-align: center;
						text-decoration: none;
						display: inline-block;
						margin: var(--control-margin);

						cursor: pointer;
					}
				</style>
				<button id='jsc_id' onclick='jsc_onclick'>jsc_text</button>
			
			`;

		this.jsc_id = jsc_AddObject();
		
		// update the id of the div in the control
		myHTML =  myHTML.replace(/jsc_id/g,this.jsc_id);
		// update the placeholder text in the control
		myHTML =  myHTML.replace(/jsc_text/g,this.getAttribute('text'));
		myHTML =  myHTML.replace(/jsc_onclick/g,this.getAttribute('myonclick'));
			

		// update any function calls back
		var parentElementString = "document.getElementById('" + this.getAttribute('id') + "')";
		myHTML =  myHTML.replace(/jsc_parent/g,parentElementString);

		this.innerHTML = myHTML;

	}
	
	get text() {
		return document.getElementById(this.jsc_id);
	}
	set text(value) 
	{
		document.getElementById(this.jsc_id) = value;
	}
	


}

customElements.define('basic-button', class_BasicButton);


