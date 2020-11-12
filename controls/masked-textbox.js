class class_MaskedTextBox extends HTMLElement {
	connectedCallback() {
		var myHTML = `
			<style>
				.jsc_id {
					font-size: var(--h4-text-size);
					width: 2ch;	
					margin: var(--control-margin);
					box-sizing: border-box;
					border: 2px solid #ccc;
					border-radius: 4px;
				}
				
				#jsc_id_wrapper{
					width: 100%;
					box-sizing: border-box;
					border: 2px solid #ccc;
					border-radius: 4px;
					position: relative;
					background-color: white;
				  padding: 5px 5px 5px 5px;
				}

			</style>
			<div id="jsc_id_wrapper">
				jsc_label INPUT_PLACEHOLDER
			</div>
			`;
		this.jsc_id = jsc_AddObject();
		
		this.Numeric = "0123456789";
		this.Alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		this.myFormat = this.getAttribute('format');

		// update the id of the div in the control
		myHTML =  myHTML.replace(/jsc_id/g,this.jsc_id);

		// update the name in the control
		myHTML =  myHTML.replace(/jsc_name/g,this.getAttribute('name'));

		// update the placeholder text in the control
		var placeholder = '';


		for(var t=0;t<this.myFormat.length;t++)
		{
			var c = this.myFormat.charAt(t);
			if(c == 'A' || c=='0' || c=='L')
				placeholder=placeholder+'_';
			else
				placeholder=placeholder+c;
		}
		var label = '';
		if(this.hasAttribute('label'))
			label=this.getAttribute('label');
		myHTML =  myHTML.replace(/jsc_label/g,label);
		
		var onkeydownfunc = "document.getElementById('" + this.getAttribute('id') + "').myKeyDown()";
		var onkeyupfunc = "document.getElementById('" + this.getAttribute('id') + "').myKeyUp()";

		var InputBoxes = "";
		for(var t=0;t<this.myFormat.length;t++)
		{
			var c = this.myFormat.charAt(t);
			if(c=='A' || c=='L' || c=='0')
				c='';
			var text = `<input type='text' class='jsc_class' id='jsc_id_tag' onkeydown=\"return jsc_onkeydown\" onkeyup=\"return jsc_onkeyup\"  maxlength='1' size='1' value='jsc_value'>`;
			
			text =  text.replace(/jsc_class/g,this.jsc_id);
			text =  text.replace(/jsc_id_tag/g,this.jsc_id+'_' + t);
			text =  text.replace(/jsc_onkeydown/g,onkeydownfunc);
			text =  text.replace(/jsc_onkeyup/g,onkeyupfunc);
			text =  text.replace(/jsc_value/g,c);
			InputBoxes+=text;


		}
		myHTML =  myHTML.replace(/INPUT_PLACEHOLDER/g,InputBoxes);
		this.innerHTML =   myHTML;

	}
	autoFillCharacter() {
		for(var t=0;t<this.myFormat.length;t++)
		{
			var newid = this.jsc_id+'_'+t;
			var c=this.myFormat.charAt(t);
			if(c!='A' && c!='L' && c!='0')
				document.getElementById(newid).value=c;
		}		
	}

	myKeyUp(evt)
	{
			return true;
		
	}
	myKeyDown(evt) {
		/* 
			0 – Digit
			L - Letter
			A - Alphanumeric
		*/
		evt = (evt) ? evt : window.event;
		var key =  evt.key;
		var char_position = evt.target.id.substring(evt.target.id.lastIndexOf('_') + 1);
		

		if(key == 'ArrowLeft' ) { // right arrow
			if(char_position == 0)	// if we are in the first cell just make sure cursor is at the beginning
			{
				evt.target.selectionStart = 0;
				evt.target.selectionEnd = 0;
				this.autoFillCharacter();
				return false;
			}
			char_position--;
			var newid = this.jsc_id+'_'+char_position;
			document.getElementById(newid).focus();
			document.getElementById(newid).selectionStart=0;
			document.getElementById(newid).selectionEnd=0;
			console.log( char_position);
			this.autoFillCharacter();
			return false;
		}
		if(key == 'ArrowRight' || key=='Tab') { // right arrow
			if(char_position == this.myFormat.length - 1)	// if we are in the last cell just make sure cursor is at the beginning
			{
				evt.target.selectionStart = 0;
				evt.target.selectionEnd = 0;
				this.autoFillCharacter();
				return false;
			}
			char_position++;
			var newid = this.jsc_id+'_'+char_position;
			document.getElementById(newid).focus();
			document.getElementById(newid).selectionStart=0;
			document.getElementById(newid).selectionEnd=0;
			console.log( char_position);
			this.autoFillCharacter();

			return false;
		}
		if(key=='Backspace') { // right arrow
			if(char_position == 0)	// if we are in the first cell just make sure cursor is at the beginning
			{
				evt.target.selectionStart = 0;
				evt.target.selectionEnd = 0;
				this.autoFillCharacter();
				return false;
			}
			if(evt.target.selectionStart == 1)
			{
				evt.target.value='';
			}
			char_position--;
			var newid = this.jsc_id+'_'+char_position;
			document.getElementById(newid).focus();
			if(document.getElementById(newid).value.length > 0) {
				document.getElementById(newid).selectionStart=1;
			}
			console.log( char_position);

			this.autoFillCharacter();

			return false;
		}

		if(evt.key=='Delete') {
			evt.target.value='';
			this.autoFillCharacter();
			return false;
		}
		
		if(evt.target.selectionStart > 0)
		{
			char_position++;
			if(char_position >= this.myFormat.length)
				return false;
			
			var newid = this.jsc_id+'_'+char_position;
			document.getElementById(newid).focus();
			
		}
		var id = this.jsc_id+'_'+char_position;
		var hit=false;
		if(this.myFormat.charAt(char_position) == '0') {
			if(this.Numeric.includes(key) ) {
				document.getElementById(id).value=key;
				hit=true;
			}
		} 
		
		if(this.myFormat.charAt(char_position) == 'L') {
			if(this.Alphabet.includes(key) ) {
				document.getElementById(id).value=key;
				hit=true;
			}
		} 
		
		if(this.myFormat.charAt(char_position) == 'A') {
				document.getElementById(id).value=key;
				hit=true;
		} 
		
		if(this.myFormat.charAt(char_position) == key) {
				document.getElementById(id).value=key;
				hit=true;
		}
		
		if(hit==false) {
			this.autoFillCharacter();
			return false;
		}
		
		this.autoFillCharacter();
		while(1==1) {
			char_position++;
			if(char_position <= this.myFormat.length -1) {
				var newid = this.jsc_id+'_'+char_position;
				console.log(newid);
				document.getElementById(newid).focus();
				document.getElementById(newid).selectionStart=0;
				document.getElementById(newid).selectionEnd=0;
				
			} else {
				return false;
			}
			var c = this.myFormat.charAt(char_position);
			if(c=='0' || c=='L' || c== 'A')
				return false;
		}

		return false;
		
	}
	
	getValue() {
		this.autoFillCharacter();
		var result='';
		for(var t=0;t<this.myFormat.length;t++)
		{
			var newid = this.jsc_id+'_'+t;
			result=result+document.getElementById(newid).value;
		}
		

		return result;
	}
	setValue(value) 
	{
		for(var t=0;t<value.length;t++)
		{
			var newid = this.jsc_id+'_'+t;
			document.getElementById(newid).value=value.charAt(t);
		}
		this.autoFillCharacter();
	}
	


}
customElements.define('masked-textbox', class_MaskedTextBox);

