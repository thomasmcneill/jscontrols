
class class_BasicSwitch extends HTMLElement {
	connectedCallback() {
		var myHTML = `
				<style>
				.jsc_id_switch {
					font-size: var(--h4-text-size);
					padding: 1.2ch 2ch;

					margin: var(--control-margin);
					position: relative;
					margin-right: 6ch;
			  	}
				  

				.jsc_id_slider {
					font-size: var(--h4-text-size);

					position: absolute;
					cursor: pointer;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background-color: var(--checkbox-unchecked-color);
					transition: .4s;
					width: 8ch;
					height: 5ch;
				}
				.jsc_id_slider_round {
					border-radius: 4ch;
				}

				/* draw the toggle */
				.jsc_id_slider:before {
					font-size: var(--h4-text-size);
					position: absolute;
					content: "";
					height: 4ch;
					width: 4ch;
					left: 2px;
					bottom: 4px;
					background-color: white;
					-webkit-transition: .4s;
					transition: .4s;
				}	
				.jsc_id_slider_round:before
				{
					border-radius: 50%;

				}
				  
				.jsc_id_slider_checked:before {
					transform: translateX(3.5ch);
				}

				/* change background color when it is checked */
				.jsc_id_slider_checked {
					background-color: var(--checkbox-checked-color);
				}
			</style>
				<span class="jsc_id_switch">
					  <span id="jsc_id_span" class="jsc_id_slider" onclick="jsc_parent.toggle()"></span>
				</span>
			
			`;

		this.jsc_id = jsc_AddObject();
		this.checked = false;
		// update the id of the div in the control
		myHTML =  myHTML.replace(/jsc_id/g,this.jsc_id);
		// update the placeholder text in the control

		this.myonclick = "";
		if(this.hasAttribute('myonclick'))
			this.myonclick =  this.getAttribute('myonclick');
			

		// update any function calls back
		var parentElementString = `document.getElementById('${this.getAttribute('id')}')`;
		myHTML =  myHTML.replace(/jsc_parent/g,parentElementString);

		this.innerHTML = myHTML;

		if(this.hasAttribute('round'))
		{
			document.getElementById(this.jsc_id + "_span").classList.add(this.jsc_id + "_slider_round");
		}

	}
	toggle()
	{
		var ele = document.getElementById(this.jsc_id + "_span");
		var cl = this.jsc_id + '_slider_checked';

		if(this.checked) {
			ele.classList.remove(cl);
		} else {
			ele.classList.add(cl);

		}
		this.checked = !this.checked;

		
		// find object
		var fn = window[this.myonclick];
		// is object a function?
		if (typeof fn === "function") fn(this.checked);


	}
	getValue()
	{
		return this.checked;
	}
	setValue(value)
	{
		this.checked=value;
		var ele = document.getElementById(this.jsc_id + "_span");
		var cl = this.jsc_id + '_slider_checked';

		if(this.checked) {
			ele.classList.remove(cl);
		} else {
			ele.classList.add(cl);

		}

	}
	get text() {
		return document.getElementById(this.jsc_id);
	}
	set text(value) 
	{
		document.getElementById(this.jsc_id) = value;
	}
	


}

customElements.define('basic-switch', class_BasicSwitch);



