class class_TableView extends HTMLElement {
	connectedCallback() {
		var myHTML = `
			<style>
				.jsc_id {
					font-size: var(--h4-text-size);
					width: 1.2ch;	
					margin: 1px;
					box-sizing: border-box;
					border: 2px solid #ccc;
					border-radius: 4px;
				}
				.jsc_id_header_class {
					background-color: grey;
				}
				.jsc_id_header_textleft_class {
					float: left;
				}
				.jsc_id_header_textright_class {
					float: right;
				}

				.jsc_id_cell_class {
					white-space: nowrap;
				}
				.jsc_id_row_class {
					background: var(--input-bg-color);
				}
				.jsc_id_row_class_with_hover {
					background: var(--input-bg-color);
				}
				
				.jsc_id_row_class_with_hover:hover {
						
					background: var(--control-hover-color);
				}

				.jsc_id_table_class {
					width: 100%;
					box-sizing: border-box;
					border: 2px solid #ccc;
					border-radius: 4px;
					position: relative;
					background-color: white;
					padding: 0px 0px 0px 0px;
					border-spacing: 2;
				}
				#jsc_id_menu {
					position: fixed;
					z-index: 9999; /* Most times is 2000 used as middle */
					visibility: hidden;
					opacity: 0;
				  
					padding: 0px;
					font-family: sans-serif;
					font-size: 11px;
					background: #fff;
					color: #555;
					border: 1px solid #C6C6C6;
				  
					-webkit-transition: opacity .5s ease-in-out;
					-moz-transition: opacity .5s ease-in-out;
					transition: opacity .5s ease-in-out;
				  
					-webkit-box-shadow: 2px 2px 2px 0px rgba(143, 144, 145, 1);
					-moz-box-shadow: 2px 2px 2px 0px rgba(143, 144, 145, 1);
					box-shadow: 2px 2px 2px 0px rgba(143, 144, 145, 1);
				}

				#jsc_id_menu a {
				  display: block;
				  color: #555;
				  text-decoration: none;
				  padding: 6px 8px 6px 30px;
				  width: 250px;
				  position: relative;
				}

				#jsc_id_menu a img,
				#jsc_id_menu a i.fa {
				  height: 20px;
				  font-size: var{--h2-text-size};
				  width: 20px;
				  position: absolute;
				  left: 5px;
				  top: 2px;
				}

				#jsc_id_menu a span {
				  color: #BCB1B3;
				  float: right;
				}

				#jsc_id_menu a:hover {
				  color: #fff;
				  background: #3879D9;
				}

				#jsc_id_menu hr {
				  border: 1px solid #EBEBEB;
						border-bottom: 0;
				}
			</style>
			<div id="jsc_id_menu">
			</div>
			<div style="overflow-x:auto;">
			<table class="jsc_id_table_class" id='jsc_id'>
			</table>
			</div>
			`;


		this.jsc_id = jsc_AddObject();
		
		this.pageBreak = 10;
		if(this.hasAttribute('pagebreak'))
			this.pageBreak = this.getAttribute('pagebreak');
		
		// Starting row for pagination
		this.rowStart = 0;
		
		// for getting column identenfier for database updates
		this.uniqueColumn = '';
		if(this.hasAttribute('uniquecolumn'))
			this.uniqueColumn = this.getAttribute('uniquecolumn');
		this.uniqueColumnNumber = -1;
		
		// check if row selection is enabled
		if(this.hasAttribute('rowdoubleclick'))
			this.rowdoubleclick = this.getAttribute('rowdoubleclick');
		else
			this.rowdoubleclick = '';
		
		// sort by this column
		this.sortbyColumn='0';
		if(this.hasAttribute('sortcolumn'))
			this.sortbyColumn = this.getAttribute('sortcolumn');

			console.log("set sort col " + this.sortbyColumn);
		

		
		
		// update the id of the div in the control
		myHTML =  myHTML.replace(/jsc_id/g,this.jsc_id);
		this.innerHTML = myHTML;


	}
	contextClick(evt)
	{
		evt = (evt) ? evt : window.event;
		
		evt.preventDefault();
		this.showMenu(evt.clientX,evt.clientY);
	}
	showMenu(x, y) {
		
		var i = document.getElementById(this.jsc_id + "_menu").style;
		i.top = y + "px";
		i.left = x + "px";
		i.visibility = "visible";
		i.opacity = "1";
	}
	toggleColumnFromMenu(column)
	{

		this.columnVisible[column] = !this.columnVisible[column];
		var i = document.getElementById(this.jsc_id + "_menu").style;
		
		i.opacity = "0";
		setTimeout(function() {
			i.visibility = "hidden";
			}, 501);
		this.makeMenu();
		this.drawTable();
	}
	toggleColumn(column,status,draw)
	{

		this.columnVisible[column] = status;
		this.makeMenu();
		if(draw)
			this.drawTable();
	}

	makeMenu()
	{
		var myNode = document.getElementById(this.jsc_id+'_menu');
		
		while (myNode.firstChild) {
			myNode.removeChild(myNode.lastChild);
		}

		var menuHTML = `<a href="#" onclick="jsc_click" >
							<i class="jsc_status"></i> jsc_text 
						</a>`;
		var myHTML = "";			
		for(var t=0;t<this.headerNames.length;t++)
		{
			var click = `document.getElementById('` + this.getAttribute('id') + `').toggleColumnFromMenu(` + t + `)`;
			var font = this.columnVisible[t] ? "fa fa-check-square" : "fa fa-square";
			var item = menuHTML;
			
			item=item.replace(/jsc_click/,click);
			item=item.replace(/jsc_status/,font);
			item=item.replace(/jsc_text/,this.headerNames[t]);
			myHTML+=item;
			
			
		}
		myNode.innerHTML=myHTML;

	}
	processTest(sdf)
	{
		this.rowStart = 0;
		console.log('test');
	}
	processJSON(rows)
	{
		console.log(rows);
		try {
			this.rowStart=0;

			if(rows != '')
			{
				this.totalRows = rows.length;
				this.rowData = [];
				console.log('TotalRows: '+this.totalRows);
				if(this.totalRows > 0) {
					this.headerNames = Object.keys(rows[0]);
					this.columnVisible = Object.keys(rows[0]);
					this.totalColumns = this.headerNames.length;
					console.log('TotalColumns: '+this.totalColumns);
					for(var t=0;t<this.totalColumns;t++) {
						console.log(this.headerNames[t]);
						this.columnVisible[t] = true;
						if(this.headerNames[t]==this.uniqueColumn )
							this.uniqueColumnNumber = t;
					}
					
					
					for(var row=0;row<this.totalRows;row++) {
						this.rowData.push([0])
						for(var column=0;column < this.totalColumns;column++) {
							
							var value = rows[row][this.headerNames[column]];
							
							this.rowData[row][column] = value;
						}
					}
				} else {
					this.headerNames = [];
				}
				
			}
			//this.sortByColumnNumber(0,false);
			this.makeMenu();
0		}
		catch (e) {
			console.log(`${e.name}: ${e.message}`);
		}
	}
	sortByColumnNumber(column,draw)
	{
		this.sortbyColumn = column;
		this.sortRows();
		if(draw==true)
			this.drawTable();
	}
	sortByColumnName(column,draw)
	{
		this.sortbyColumn = 0;
		for(var t=0;t< this.headerNames.length;t++)
		{
			if(column == this.headerNames[t]) {
				this.sortbyColumn = t;
				break;
			}
		}
		this.sortRows();
		if(draw==true)
			this.drawTable();
	}

	sortRows()
	{
		var hit = true;

		while(hit) {
			
			hit=false;
			
			for(var t=1;t<this.rowData.length;t++)
			{
				if(this.rowData[t][this.sortbyColumn] < this.rowData[t-1][this.sortbyColumn])
				{
					var a = this.rowData[t];
					var b = this.rowData[t-1];
					this.rowData[t] = b;
					this.rowData[t-1] = a;
					hit=true;
				}
				
			}
			
			
		}
	}
	
	removeTable()
	{
		var myNode = document.getElementById(this.jsc_id);
		
		while (myNode.firstChild) {
			myNode.removeChild(myNode.lastChild);
		}
	}
	drawTable()
	{
		
		console.log('drawTable' + this.jsc_id);
		this.removeTable();

		console.log('drawTable column section');

		try {

			//////
			// Header Section
			/////
			// create context menu item for right click on header
			var id = this.getAttribute('id');
			var contextmenu = `document.getElementById('${id}').contextClick()`;


			var myHTML = `<tr class='${this.jsc_id + "_row_class"}' oncontextmenu='${oncontextmenu}'>\r\n`;
			for(var column=0;column < this.totalColumns;column++)
			{
				console.log('drawTable column' + column);

				if(this.columnVisible[column]) {
					var hearderclick = `document.getElementById('${id}').sortByColumnNumber(${column},true)`;

					var sortarrow = "";
					if(this.sortbyColumn == column)
						sortarrow = `<span class='${this.jsc_id + "_header_textright_class"}'><i class='fa fa-arrow-down'></i></span>`;

					myHTML+=`<th class='${this.jsc_id + "_header_class"}' onclick='${hearderclick}'   oncontextmenu='${contextmenu}' contextmenu='${contextmenu}'  ><span class='${this.jsc_id + "_header_textleft_class"}'>${this.headerNames[column]}</span>${sortarrow}</th>\r\n`;
				}
			}
			myHTML+='</tr>\r\n';
		}
		catch (e) {
			console.log(`${e.name}: ${e.message}`);
		}
		try {
			console.log('drawTable data section');

			/// Data
			for(var row=this.rowStart;row<this.rowStart+this.pageBreak;row++)
			{

				if(row < this.totalRows) {
					console.log('drawTable row ' + row);
					// Row
					// Get the unique ID and create function statement

					var func = ""
					var funccss = this.jsc_id + "_row_class";
					if(this.rowdoubleclick.length > 0) {
						func=`${this.rowdoubleclick}(${this.rowData[row][this.uniqueColumnNumber]})`;
						funccss = this.jsc_id + "_row_class_with_hover";
					}
					

					
					myHTML+= `<tr class='${funccss}' ondblclick='${func}'>\r\n`;
					for(var column=0;column < this.totalColumns;column++)
					{
						// Cell
						if(this.columnVisible[column]) {
							var value = this.rowData[row][column];
							myHTML+=`<td class='${this.jsc_id + "_cell_class"}'>${value}</td>\r\n`;
						}
					}
					myHTML+='</tr>\r\n';
				}
				
			}
		}
		catch (e) {
			console.log(`${e.name}: ${e.message}`);
		}
		try {
			console.log('drawTable pagination');
			// pagination
			if(this.totalRows > this.pageBreak) {
				myHTML+=`<tr><td colspan="${this.headerNames.length}">\r\n`;
				var lastrow = parseInt(this.rowStart) + parseInt(this.pageBreak);
				var rowstart = parseInt(this.rowStart) + 1;
				myHTML+=`<i class='fa fa-arrow-left'></i>${rowstart}  to ${lastrow}\r\n`;
				myHTML+=`<i class='fa fa-arrow-right'></i>\r\n`;
				myHTML+=`</td></tr>\r\n`;
			}
			console.log(this.jsc_id);
			document.getElementById(this.jsc_id).innerHTML =myHTML;
		}
		catch (e) {
			console.log(`${e.name}: ${e.message}`);
		}
	
	}
}
customElements.define('table-view', class_TableView);

