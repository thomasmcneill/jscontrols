
class class_Gauge extends HTMLElement {
	connectedCallback() {
		var myHTML = `
				<style>
					#jsc_id {
						font-size: var(--h4-text-size);
						display: inline-block;
						margin: var(--control-margin);
					}
				</style>
                                <canvas id="jsc_id" ></canvas>
				
			
			`;

		this.jsc_id = jsc_AddObject();
		
		// update the id of the div in the control
		myHTML =  myHTML.replace(/jsc_id/g,this.jsc_id);
			

		// update any function calls back
		var parentElementString = "document.getElementById('" + this.getAttribute('id') + "')";
		myHTML =  myHTML.replace(/jsc_parent/g,parentElementString);

                this.myCurrentValue = 0;
                if(this.hasAttribute('value')) {
			this.myCurrentValue = this.getAttribute('value');
		}

                this.myUpdateMS = 1000;
		if(this.hasAttribute('updatems')) {
			this.myUpdateMS = this.getAttribute('updatems');
		}

                this.myName = "";
		if(this.hasAttribute('name')) {
			this.myName = this.getAttribute('name');
		}

                this.myBackColor = 'white';
		if(this.hasAttribute('backcolor')) {
			this.myBackColor = this.getAttribute('backcolor');
		}

                this.myWidth = 200;
		if(this.hasAttribute('width')) {
			this.myWidth = this.getAttribute('width');
		}

                this.myHeight = this.myWidth;
		if(this.hasAttribute('height')) {
			this.myHeight = this.getAttribute('height');
		}

                this.myWatch = "";
		if(this.hasAttribute('watch')) {
			this.myWatch = this.getAttribute('watch');
		}

                this.myMin = 0;
		if(this.hasAttribute('min')) {
			this.myMin = this.getAttribute('min');
		}
                this.myMax = 255;
		if(this.hasAttribute('max')) {
			this.myMax = this.getAttribute('max');
		}
                this.myGuage_Range = this.myMax - this.myMin;
                console.log('myGuage_Range='+this.myGuage_Range);

                this.myLowZoneEnd =this.myMin;
		if(this.hasAttribute('lowzoneend')) {
			this.myLowZoneEnd = this.getAttribute('lowzoneend');
		}
                this.myLowZoneColor = "orange";
		if(this.hasAttribute('lowzonecolor')) {
			this.myLowZoneColor = this.getAttribute('lowzonecolor');
		}

                this.myHighZoneStart = this.myMax;
		if(this.hasAttribute('highzonestart')) {
			this.myHighZoneStart = this.getAttribute('highzonestart');
		}

                this.myHighZoneColor = "red";
		if(this.hasAttribute('highzonecolor')) {
			this.myHighZoneColor = this.getAttribute('highzonecolor');
		}

                this.myNormalColor = "green";
		if(this.hasAttribute('normalcolor')) {
			this.myNormalColor = this.getAttribute('normalcolor');
                        console.log(this.myNormalColor);
		}

                
                this.LowRange_ArcEnd = 180 * (this.myLowZoneEnd/this.myGuage_Range);
                this.HighRange_ArcStart = 180 * (this.myHighZoneStart/this.myGuage_Range);
                console.log('HighRange_ArcStart='+this.HighRange_ArcStart);
                console.log('LowRange_ArcEnd='+this.LowRange_ArcEnd);
                

		this.innerHTML = myHTML;
                
                this.drawGuage();
                setInterval(function() { this.drawGuage(); }.bind(this), 1000);
               
               

	}

        SetInternvalCallback(id)
        {
                var ele = document.getElementById(id); 
                
                console.log(ele);
                ele.setAttribute('value',window[this.getAttribute('watch')]);

                
        }
        gauge_degreesToRadians(degrees) 
        {
               
                return degrees * (Math.PI/180);   
        }
             
        gauge_radiansToDegrees(radians) 
        {
                return radians * (180/Math.PI);
        }
        gauge_drawPieSlice(ctx,centerX, centerY, radius, startAngle, endAngle, color )
        {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.moveTo(centerX,centerY);
                ctx.arc(centerX, centerY, radius,this.gauge_degreesToRadians( startAngle),this.gauge_degreesToRadians(endAngle));
                //console.log(this.gauge_radiansToDegrees( startAngle) + ":"+this.gauge_radiansToDegrees(endAngle));
                ctx.closePath();
                ctx.fill();
        }
        drawGuage()
        {
                var canvas = document.getElementById(this.jsc_id);
                var margin = 10;

                console.log("drawGuage " + this.jsc_id);
                var context = canvas.getContext("2d");

                context.canvas.width = this.myWidth;
                context.canvas.height = this.myHeight;

                var centerX = (canvas.width / 2);
                var centerY =10 + canvas.height / 2;
                var radius = (canvas.height / 2) - margin;
                var shadedBandThickness = 0.80;
        
                context.fillStyle = this.myBackColor ;
                context.fillRect(0, 0, canvas.width, canvas.height);
        
                //Draw Full Arc
                this.gauge_drawPieSlice(context,centerX,centerY,radius,180,360,this.myNormalColor);
                
                //// Draw Low Range
                this.gauge_drawPieSlice(context,centerX,centerY,radius,180,180+this.LowRange_ArcEnd ,this.myLowZoneColor);
        
                //// Draw high Range
                this.gauge_drawPieSlice(context,centerX,centerY,radius,180+this.HighRange_ArcStart,360,this.myHighZoneColor);
        
                // Cut out center
                context.beginPath();
                context.moveTo(centerX,centerY);
                context.arc(centerX, centerY,radius*shadedBandThickness , 1*Math.PI,  2*Math.PI, false);
                context.fillStyle = this.myBackColor;
                context.closePath();
                context.fill();
                
                // Draw Min Text
                context.fillStyle = 'black';
                context.font = "14px Arial";
                var textWidth = context.measureText(this.myMin+ " ").width
                context.fillText(this.myMin,  radius*(1-shadedBandThickness) + textWidth + margin, centerY);

                // Draw max Value
                context.fillStyle = 'black';
                context.font = "14px Arial";
                textWidth = context.measureText(this.myMax + " ").width
                context.fillText(this.myMax, canvas.width - radius*(1-shadedBandThickness) - textWidth - margin, centerY);

                //Draw Max
                textWidth = context.measureText(this.myCurrentValue).width;
                context.fillText(this.myCurrentValue, (canvas.width/2) - (textWidth/2), centerY+14);
                
                // Draw Needle
                this.myCurrentValue = window[this.getAttribute('watch')];
                var ArcValue = (this.myCurrentValue / this.myMax) * 180;
                this.gauge_drawPieSlice(context,centerX,centerY,radius,180+ArcValue,180+ArcValue+1,"black");



                var textHeight = 0;
                var fontSize = 4;
                var maxHeight = (canvas.height / 2) - 2*margin;
                var maxWidth = canvas.width - 2*margin;
                for(fontSize = 4;fontSize < 100;fontSize++)
                {
                        context.font = fontSize + 'px Arial';
                        textHeight = context.measureText(this.myName).height;
                        textWidth = context.measureText(this.myName+" ").width
                
                        if(textHeight > maxHeight)
                        {
                                fontSize--;
                                break;
                        }        
                        if(textWidth > maxWidth)
                        {
                                fontSize--;
                                break;
                        }        
                        
                }

                context.font = fontSize + 'px Arial';
                textWidth = context.measureText(this.myName).width;
                context.fillText(this.myName, (canvas.width/2) -  (textWidth/2), centerY + (centerY/2));

        }


} 

customElements.define('needle-gauge', class_Gauge);


