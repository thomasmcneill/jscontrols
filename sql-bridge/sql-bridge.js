class class_SQLBridge
{
    constructor(path, token) {

        this.URL = path;
        this.AuthToken = token;
      }

    loadForm(formID,table,callback)
    {
        var SQL = `SELECT * FROM ${table} WHERE `;
        var value = '';
        var elements = jsc_getAllDescendents(formID);
        for(var t=0;t<elements.length;t++)
        {
            try 
            {
                if(elements[t].hasAttribute('uuid')) 
                {
                    if(elements[t].getAttribute('dbCol') != null) 
                    {
                        
                        SQL+=elements[t].getAttribute('dbCol') + "=?";
                        value=elements[t].getValue();
                        this.simple(SQL,callback,value);
                    }
                }
            }
            catch (err)
            {
            }

        }


    }  
    loadForm_DisplayResult(formID,result)
    {
        console.log('loadForm_DisplayResult');
        console.log(result);
        var elements = jsc_getAllDescendents(formID);
        for(var t=0;t<elements.length;t++)
        {
            try 
            {
                if(elements[t].getAttribute('dbCol') != null) 
                {
                    if(elements[t].hasAttribute('uuid'))
                        continue;
                    try {
                        console.log(elements[t].getAttribute('dbCol') + "=" + result[0][elements[t].getAttribute('dbCol')]);
                        elements[t].setValue(result[0][elements[t].getAttribute('dbCol')]); //
                    }
                    catch (e) {
                        console.log(`${e.name}: ${e.message}`);
                    }
                }
            }
            catch (err)
            {
            }

        }


    }

    insertFromForm(formID,table,callback)
    {
        var SQL = `INSERT INTO ${table} (`;
        var Values = [];

        var elements = jsc_getAllDescendents(formID);
        for(var t=0;t<elements.length;t++)
        {
            try 
            {
                if(elements[t].hasAttribute('dbCol')) 
                {
                    if(elements[t].getAttribute('dbCol') != null) 
                    {
                        
                        SQL+=elements[t].getAttribute('dbCol')+",";
                        Values.push(elements[t].getValue());
                    }
                }
            }
            catch (err)
            {
            }

        }

        // trim last comma
        var lastChar = SQL.slice(-1);
        if (lastChar == ',') {
            SQL = SQL.slice(0, -1);
        }

        // put a question mark for every item in the array
        SQL+=") VALUES(";
        for(var t=0;t<Values.length;t++)
        {
            SQL+="?,"
        }

        // trim last comma
        lastChar = SQL.slice(-1);
        if (lastChar == ',') {
            SQL = SQL.slice(0, -1);
        }

        SQL+=")";

        var args = [];
        args.push(SQL);
        args.push(callback);
        args.push(...Values);
        this.simple(...args);
    }

    simple(sql,callback) {
        console.log(sql);
		var request = new XMLHttpRequest();

        // get first word to determine function
        var sqlfunc = sql.split(" ")[0].toLowerCase();
        if(sqlfunc == 'select' || sqlfunc == 'insert' || sqlfunc == 'update')
        {

        } else {
            console.log('simple only works on select insert and update')
            return false;
        }
		var obj = { "function":sqlfunc,
					"sql":sql,
        };

        // do we have more arguments
        if(arguments.length > 2)
        {
            for(var t=2;t<arguments.length;t++)
            {
                obj[t-2]= arguments[t];
            }
        }
        var myJSON = JSON.stringify(obj);
        console.log(myJSON);
        var URLwToken = this.URL + "simple.php?token=" + this.AuthToken;
        console.log(URLwToken);
		request.open('POST', URLwToken, true);
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		request.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
                try {
                    var myObj = JSON.parse(this.responseText);
                    if(myObj['status'] == "success")
                    {
                    
                        var result = myObj['result'];
                        callback(result);
                    }
                }
                catch (e) {
                    console.log(`${e.name}: ${e.message}`);
                }

			} else {
            }
		};
		request.send("data=" + myJSON);
        return true;
    }




}

