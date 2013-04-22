/*
Copyright (C) 2012 Shaohuan Li <shaohuan.li@gmail.com>, Ashish Sharma <ashish.sharma@emory.edu>
This file is part of Biomedical Image Viewer developed under the Google of Summer of Code 2012 program.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

var extractDir = function()
{
        var host = window.document.location.host;
        var protocol = window.document.location.protocol;
        var path = window.location.pathname.split('/');
        var Dir2 = protocol + '//' + host;
        var i = 0;
        for(i = 1; i < path.length-1; i++)
        {
                Dir2 = Dir2 + '/' + path[i];
        }
        return Dir2;
}

var Dir = extractDir();

var MD5 = function (string) {

        function RotateLeft(lValue, iShiftBits) {
                return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
        }

        function AddUnsigned(lX,lY) {
                var lX4,lY4,lX8,lY8,lResult;
                lX8 = (lX & 0x80000000);
                lY8 = (lY & 0x80000000);
                lX4 = (lX & 0x40000000);
                lY4 = (lY & 0x40000000);
                lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
                if (lX4 & lY4) {
                        return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
                }
                if (lX4 | lY4) {
                        if (lResult & 0x40000000) {
                                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                        } else {
                                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                        }
                } else {
                        return (lResult ^ lX8 ^ lY8);
                }
        }

        function F(x,y,z) { return (x & y) | ((~x) & z); }
	function G(x,y,z) { return (x & z) | (y & (~z)); }
        function H(x,y,z) { return (x ^ y ^ z); }
        function I(x,y,z) { return (y ^ (x | (~z))); }

        function FF(a,b,c,d,x,s,ac) {
                a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
                return AddUnsigned(RotateLeft(a, s), b);
        };

        function GG(a,b,c,d,x,s,ac) {
                a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
                return AddUnsigned(RotateLeft(a, s), b);
        };

        function HH(a,b,c,d,x,s,ac) {
                a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
                return AddUnsigned(RotateLeft(a, s), b);
        };

        function II(a,b,c,d,x,s,ac) {
                a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
                return AddUnsigned(RotateLeft(a, s), b);
        };

        function ConvertToWordArray(string) {
                var lWordCount;
                var lMessageLength = string.length;
                var lNumberOfWords_temp1=lMessageLength + 8;
                var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
                var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
                var lWordArray=Array(lNumberOfWords-1);
                var lBytePosition = 0;
                var lByteCount = 0;
		while ( lByteCount < lMessageLength ) {
                        lWordCount = (lByteCount-(lByteCount % 4))/4;
                        lBytePosition = (lByteCount % 4)*8;
                        lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
                        lByteCount++;
                }
                lWordCount = (lByteCount-(lByteCount % 4))/4;
                lBytePosition = (lByteCount % 4)*8;
                lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
                lWordArray[lNumberOfWords-2] = lMessageLength<<3;
                lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
                return lWordArray;
        };

        function WordToHex(lValue) {
                var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
                for (lCount = 0;lCount<=3;lCount++) {
                        lByte = (lValue>>>(lCount*8)) & 255;
                        WordToHexValue_temp = "0" + lByte.toString(16);
                        WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
                }
                return WordToHexValue;
        };

        function Utf8Encode(string) {
                string = string.replace(/\r\n/g,"\n");
                var utftext = "";

                for (var n = 0; n < string.length; n++) {

                        var c = string.charCodeAt(n);

                        if (c < 128) {
				 utftext += String.fromCharCode(c);
                        }
                        else if((c > 127) && (c < 2048)) {
                                utftext += String.fromCharCode((c >> 6) | 192);
                                utftext += String.fromCharCode((c & 63) | 128);
                        }
                        else {
                                utftext += String.fromCharCode((c >> 12) | 224);
                                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                                utftext += String.fromCharCode((c & 63) | 128);
                        }

                }

                return utftext;
        };

        var x=Array();
        var k,AA,BB,CC,DD,a,b,c,d;
        var S11=7, S12=12, S13=17, S14=22;
        var S21=5, S22=9 , S23=14, S24=20;
        var S31=4, S32=11, S33=16, S34=23;
        var S41=6, S42=10, S43=15, S44=21;

        string = Utf8Encode(string);

        x = ConvertToWordArray(string);

        a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

        for (k=0;k<x.length;k+=16) {
                AA=a; BB=b; CC=c; DD=d;
                a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
		d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
                c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
                b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
                a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
                d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
                c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
                b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
                a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
                d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
                c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
                b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
                a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
                d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
                c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
                b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
                a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
                d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
                c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
                b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
                a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
                d=GG(d,a,b,c,x[k+10],S22,0x2441453);
                c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
                b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
                a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
                d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
                c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
                b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
                a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
                d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
                c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
                b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
                a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
                d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
                c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
                b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
                a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
                d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
		c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
                b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
                a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
                d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
                c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
                b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
                a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
                d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
                c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
                b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
                a=II(a,b,c,d,x[k+0], S41,0xF4292244);
                d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
                c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
                b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
                a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
                d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
                c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
                b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
                a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
                d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
                c=II(c,d,a,b,x[k+6], S43,0xA3014314);
                b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
                a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
                d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
                c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
                b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
                a=AddUnsigned(a,AA);
                b=AddUnsigned(b,BB);
                c=AddUnsigned(c,CC);
                d=AddUnsigned(d,DD);
        }

        var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

        return temp.toLowerCase();
};

var annotools = new Class({
    initialize: function(element,options){
        this.source = element;//The Tool Source Element
        this.left=options.left|| '0px';//The Tool Location
        this.ratio=options.ratio||0.005;//One pixel equals to the length in real situation. Will be used in the measurement tool
        this.maxWidth=options.maxWidth||4000;//MaxWidth of the Image
        this.maxHeight=options.maxHeight||800;////MaxHeight of the Image
        this.top=options.top|| '0px';
        this.color=options.color||'lime';//Default Annotation Color
        this.height=options.height||'20px';
        this.width=options.width|| '200px';
        this.zindex=options.zindex|| '100';//To Make Sure The Tool Appears in the Front
        this.canvas=options.canvas;//The canvas Element that The Use will be drawing annotatoins on.
	this.iid=options.iid||null;//The Image ID
        this.iidDecoded = decodeURI(options.iid);
        this.annotVisible=true;//The Annotations are Set to be visible at the First Loading
        this.mode='default';//The Mode is Set to Default
	window.addEvent("domready",function(){ this.getAnnot();this.createButtons();}.bind(this));//Get the annotation information and Create Buttons
        window.addEvent("keydown",function(event){this.keyPress(event.code)}.bind(this));//Add KeyDown Events
    },
    createButtons:function()//Create Buttons
    {
        this.tool=document.id(this.source);//Get The Element with the Source ID.
        this.tool.setStyles({'position':'absolute','left':this.left,'top':this.top,'width':this.width,'height':this.height,'z-index':this.zindex});
        this.tool.addClass('annotools');//Update Styles
        this.tool.makeDraggable();//Make it Draggable.
	this.rectbutton=new Element('img',{'title':'rectangle','class':'toolButton','src':'images/rect.svg'}).inject(this.tool);//Create Rectangle Tool
	this.ellipsebutton=new Element('img',{'title':'ellipse','class':'toolButton','src':'images/ellipse.svg'}).inject(this.tool);//Ellipse Tool
	this.polybutton=new Element('img',{'title':'polyline','class':'toolButton','src':'images/poly.svg'}).inject(this.tool);//Polygon Tool
	this.pencilbutton=new Element('img',{'title':'pencil','class':'toolButton','src':'images/pencil.svg'}).inject(this.tool);//Pencil Tool
	this.colorbutton=new Element('img',{'title':'Change Color','class':'toolButton','src':'images/color.svg'}).inject(this.tool);//Select Color
	this.measurebutton=new Element('img',{'title':'measure','class':'toolButton','src':'images/measure.svg'}).inject(this.tool);//Measurement Tool
	this.magnifybutton=new Element('img',{'title':'magnify','class':'toolButton','src':'images/magnify.svg'}).inject(this.tool);//Magnify Tool
	this.hidebutton=new Element('img',{'title':'hide','class':'toolButton','src':'images/hide.svg'}).inject(this.tool);//Show/Hide Button
	this.savebutton=new Element('img',{'title':'Save Current State','class':'toolButton','src':'images/save.svg'}).inject(this.tool);//Save Button
	this.quitbutton=new Element('img',{'title':'quit','class':'toolButton','src':'images/quit.svg'}).inject(this.tool);//Quit Button
        this.rectbutton.addEvents({'click':function(){this.mode='rect';this.drawMarkups();}.bind(this)});//Change Mode
        this.ellipsebutton.addEvents({'click':function(){this.mode='ellipse';this.drawMarkups();}.bind(this)});
        this.polybutton.addEvents({'click':function(){this.mode='polyline';this.drawMarkups();}.bind(this)});
        this.pencilbutton.addEvents({'click':function(){this.mode='pencil';this.drawMarkups();}.bind(this)});
        this.measurebutton.addEvents({'click':function(){this.mode='measure';this.drawMarkups();}.bind(this)});
        this.magnifybutton.addEvents({'click':function(){this.mode='magnify';this.magnify();}.bind(this)});
        this.colorbutton.addEvents({'click':function(){this.selectColor()}.bind(this)});
        this.hidebutton.addEvents({'click':function(){this.toggleMarkups()}.bind(this)});
        this.savebutton.addEvents({'click':function(){this.saveState()}.bind(this)});
        this.quitbutton.addEvents({'click':function(){this.quitMode();this.quitbutton.hide();}.bind(this)});
        this.quitbutton.hide();//Quit Button Will Be Used To Return To the Default Mode
        var toolButtons=document.getElements(".toolButton");
        for(var i=0;i<toolButtons.length;i++)
        {toolButtons[i].addEvents({'mouseenter':function(){this.addClass('selected')},'mouseleave':function(){this.removeClass('selected')}});}
        this.messageBox=new Element('div',{'id':'messageBox'}).inject(document.body);//Create A Message Box
        this.showMessage("Press white space to toggle annotations");
	this.drawLayer= new Element('div',{html:"",styles:{position:'absolute','z-index':1}}).inject(document.body);//drawLayer will hide by default
        this.drawCanvas= new Element('canvas').inject(this.drawLayer);
        this.drawLayer.hide();
        this.magnifyGlass=new Element('div',{'class':'magnify'}).inject(document.body);//Magnify glass will hide by default
        this.magnifyGlass.hide();
    },
    getAnnot:function()//Get Annotation from the API
    {
		 if(this.iid)//When the database is set. User can refer to the annotation.php for saving the annotations
		{
		//################Changed call to reference php code that connects to mongo instead of my sql
			var jsonRequest = new Request.JSON({url:Dir + "/api/annotation.php", onSuccess: function(e){
			if(e=='NoAnnotations')  this.annotations=new Array();
                        else  this.annotations=e;
                        this.displayAnnot();//Display The Annotations
                        console.log("successfully get annotations");
			}.bind(this),onFailure:function(e){this.showMessage("cannot get the annotations,please check your getAnnot function");}.bind(this)}).get({'iid':this.iid}); 
		}
		else //When the database is not set, one TXT file will be used to save the Annotation Data. Please Refer to annot.php in the API folder
		{
			var jsonRequest = new Request.JSON({url: Dir+'/api/annot.php', onSuccess: function(e){
			var annot=JSON.decode(e);
			if(annot==null) annot=new Array();
			this.annotations=annot;//Display The Annotations
			this.displayAnnot();console.log("successfully get annotations");
			}.bind(this),onFailure:function(e){this.showMessage("cannot get the annotations,please check your getAnnot funciton");}.bind(this)}).get(); 
		}
    },
    keyPress:function(code)//Key Down Events Handler
    {
        switch (code)
        {
           case 84://press t to toggle tools
           this.tool.toggle();
           break;
           case 81://press q to quit current mode and return to the default mode
           this.quitMode();
	   this.quitbutton.hide();
           break;
           case 32://press white space to toggle annotations
	   this.toggleMarkups();
           break;
	   case 49://1 for rectangle mode
           this.mode='rect';this.drawMarkups();
           break;
	   case 50:// 2 for ellipse mode
           this.mode='ellipse';this.drawMarkups();
           break;
           case 51:// 3 for polyline mode
           this.mode='polyline';this.drawMarkups();
           break;
           case 52:// 4 for pencil mode
           this.mode='pencil';this.drawMarkups();
           break;
           case 53:// 5 for measurement mode
           this.mode='measure';this.drawMarkups();
           break;
           case 54:// 6 for magnify mode
           this.mode='magnify';this.magnify();
           break;
        }
    },
    drawMarkups:function()//Draw Markups
    {
        this.showMessage();//Show Message
        this.drawCanvas.removeEvents('mouseup');
        this.drawCanvas.removeEvents('mousedown');
        this.drawCanvas.removeEvents('mousemove');
        this.drawLayer.show();  //Show The Drawing Layer
	this.quitbutton.show(); //Show The Quit Button
	this.magnifyGlass.hide();//Hide The Magnifying Tool
        this.container=document.id(this.canvas); //Get The Canvas Container
        if(this.container)
        {
           var left=parseInt(this.container.offsetLeft),//Get The Container Location
	   top=parseInt(this.container.offsetTop),
	   width=parseInt(this.container.offsetWidth),
	   height=parseInt(this.container.offsetHeight),
	   oleft=left,
	   otop=top,
	   owidth=width,
	   oheight=height;
	   if (left<0){left=0;width=window.innerWidth;}//See Whether The Container is outside The Current ViewPort
	   if (top<0){top=0;height=window.innerHeight;}
           //Recreate The CreateAnnotation Layer Because of The ViewPort Change Issue.
           this.drawLayer.set({'styles':{left:left,top:top,width:width,height:height}});
	   //Create Canvas on the CreateAnnotation Layer
           this.drawCanvas.set({width:width,height:height});
           //The canvas context
	   var ctx=this.drawCanvas.getContext("2d");
	   //Draw Markups on Canvas
	   switch (this.mode)
	  {
	      case "rect":
	      //Draw Rectangles
	      var started=false;
	      var x,//start location x
		  y,//start location y
		  w,//width
		  h;//height
	      this.drawCanvas.addEvent('mousedown',function(e){started=true;x=e.event.layerX;y=e.event.layerY;});
	      this.drawCanvas.addEvent('mousemove',function(e){
	      if(started){
		  ctx.clearRect(0,0,this.drawCanvas.width,this.drawCanvas.height);
		  x=Math.min(e.event.layerX,x);
		  y=Math.min(e.event.layerY,y);
		  w=Math.abs(e.event.layerX-x);
		  h=Math.abs(e.event.layerY-y);
		  ctx.strokeStyle = this.color;
		  ctx.strokeRect(x,y,w,h);
	    	}
	      }.bind(this));
	      this.drawCanvas.addEvent('mouseup',function(e){
		started= false;
		//Save the Percentage Relative to the Container
		x=(x+left-oleft)/owidth;
		y=(y+top-otop)/oheight;
		w=w/owidth;
		h=h/oheight;
		var tip=prompt("Please Enter Some Descriptions","");
		if (tip!=null)
		{
		        //Update Annotations
			//###### Introduce Annot Id
			var annotId = MD5(this.iidDecoded + "_" + x + "_" + h + "_" + "rect");
                        var newAnnot= {x:x,y:y,w:w,h:h,type:"rect",text:tip,color:this.color, iid:this.iidDecoded,annotId:annotId};
			this.addnewAnnot(newAnnot);
                        this.drawMarkups();
		}
                else{ ctx.clearRect(0,0,this.drawCanvas.width,this.drawCanvas.height);}
	     }.bind(this));
	     break;
             case "ellipse":
	     //Draw Ellipse
	     var started=false;
	     var x,//start location x
		  y,//start location y
		  w,//width
		  h;//height
	     this.drawCanvas.addEvent('mousedown',function(e){started=true;x=e.event.layerX;y=e.event.layerY;});
	     this.drawCanvas.addEvent('mousemove',function(e){ 
	     if(started){
		ctx.clearRect(0,0,this.drawCanvas.width,this.drawCanvas.height);
		x=Math.min(e.event.layerX,x);
		y=Math.min(e.event.layerY,y);
		w=Math.abs(e.event.layerX-x);
		h=Math.abs(e.event.layerY-y);
		var kappa = .5522848;
		var ox = (w / 2) * kappa; // control point offset horizontal
		var oy = (h / 2) * kappa; // control point offset vertical
		var xe = x + w;          // x-end
		var ye = y + h;           // y-end
		var xm = x + w / 2;      // x-middle
		var ym = y + h / 2;       // y-middle
		ctx.beginPath();
		ctx.moveTo(x, ym);
		ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
		ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
		ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
		ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
		ctx.closePath();
		ctx.strokeStyle = this.color;
		ctx.stroke();
	    	}
	     }.bind(this));
	     this.drawCanvas.addEvent('mouseup',function(e){
		started= false;
		//Save the Percentage Relative to the Container
		x=(x+left-oleft)/owidth;
		y=(y+top-otop)/oheight;
		w=w/owidth;
		h=h/oheight;
		var tip=prompt("Please Enter Some Descriptions","");
		if (tip!=null)
		{
		        //Update Annotations
			//Introduce annotation Id
			var annotId = MD5(this.iidDecoded + "_" + x + "_" + h + "_" + "ellipse");
			var newAnnot= {x:x,y:y,w:w,h:h,type:"ellipse",text:tip,color:this.color,iid:this.iidDecoded,annotId:annotId};
			this.addnewAnnot(newAnnot);
                        this.drawMarkups();
		}
                else{ ctx.clearRect(0,0,this.drawCanvas.width,this.drawCanvas.height);}
	     }.bind(this));
	     break;
	     case "pencil":
	     //Draw Pencil
	     var started=false;
	     var pencil=[];//The Pencil Object
	     var newpoly=[];//Every Stroke is treated as a Continous Polyline
	     this.drawCanvas.addEvent('mousedown',function(e){ 
		started=true;
		newpoly.push( {"x":e.event.layerX,"y":e.event.layerY});//The percentage will be saved
		ctx.beginPath();
		ctx.moveTo(e.event.layerX, e.event.layerY);
		ctx.strokeStyle = this.color;
		ctx.stroke();
	     }.bind(this));
	     this.drawCanvas.addEvent('mousemove',function(e){ 
	       if(started)
	       {
		     newpoly.push( {"x":e.event.layerX,"y":e.event.layerY});
		     ctx.lineTo(e.event.layerX,e.event.layerY);
		     ctx.stroke();
		}
	      });
	     this.drawCanvas.addEvent('mouseup',function(e){ 
		started=false;
		pencil.push(newpoly);//Push the Stroke to the Pencil Object
		newpoly=[];//Clear the Stroke
		numpoint=0;//Clear the Points
		var tip=prompt("Please Enter Some Descriptions","");
		var x,y,w,h;
		x=pencil[0][0].x;
		y=pencil[0][0].y;
		var maxdistance=0;//The Most Remote Point to Determine the Markup Size
		var points="";
		for (var i=0;i<pencil.length;i++)
		{
		    newpoly=pencil[i];
		    for(j=0;j<newpoly.length;j++)
		    {
		   	 points+=(newpoly[j].x+left-oleft)/owidth+','+(newpoly[j].y+top-otop)/oheight+' ';
		         if (((newpoly[j].x-x)*(newpoly[j].x-x)+(newpoly[j].y-y)*(newpoly[j].y-y))>maxdistance)
		         {
		             maxdistance=((newpoly[j].x-x)*(newpoly[j].x-x)+(newpoly[j].y-y)*(newpoly[j].y-y));
		             w=Math.abs(newpoly[j].x-x)/owidth;
		             h=Math.abs(newpoly[j].y-y)/oheight;
		         }
		    }
		    points=points.slice(0, -1)
		    points+=';';
		} 
		points=points.slice(0,-1);
		x=(x+left-oleft)/owidth;
		y=(y+top-otop)/oheight;
		if (tip!=null)
		{
                        //Save Annotations
			//Introduce Annot Id
			var annotId = MD5(this.iidDecoded + "_" + x + "_" + h + "_" + "pencil");
			var newAnnot={x:x,y:y,w:w,h:h,type:"pencil",points:points,text:tip,color:this.color,iid:this.iidDecoded,annotId:annotId}; 
			this.addnewAnnot(newAnnot);
                        this.drawMarkups();
		}
                else{ ctx.clearRect(0,0,this.drawCanvas.width,this.drawCanvas.height);}
	     }.bind(this));
	     break;
	     case "polyline":
		//Create Polylines
		var newpoly=[];//New Polyline
		var numpoint=0;//Number of Points
		this.drawCanvas.addEvent('mousedown',function(e){ 
	   	ctx.fillStyle=this.color;
		ctx.beginPath();
		ctx.arc(e.event.layerX,e.event.layerY,2,0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();
		newpoly.push( {"x":e.event.layerX,"y":e.event.layerY});
		if(numpoint>0)
		{
			ctx.beginPath();
			ctx.moveTo(newpoly[numpoint].x, newpoly[numpoint].y);
			ctx.lineTo(newpoly[numpoint-1].x, newpoly[numpoint-1].y);
			ctx.strokeStyle = this.color;
			ctx.stroke();
		}
		numpoint++;
		}.bind(this));
		this.drawCanvas.addEvent('dblclick',function(e){
		ctx.beginPath();
		ctx.moveTo(newpoly[numpoint-1].x, newpoly[numpoint-1].y);
		ctx.lineTo(newpoly[0].x, newpoly[0].y);
		ctx.strokeStyle = this.color;
		ctx.stroke();
		var x,y,w,h;
		x=newpoly[0].x;
		y=newpoly[0].y;
		var maxdistance=0;
		var tip=prompt("Please Enter Some Descriptions","");
		var points="";
		for (var i=0;i<numpoint-1;i++)
		{
		   points+=(newpoly[i].x+left-oleft)/owidth+','+(newpoly[i].y+top-otop)/oheight+' ';
	 	   if (((newpoly[i].x-x)*(newpoly[i].x-x)+(newpoly[i].y-y)*(newpoly[i].y-y))>maxdistance)
		         {
		             maxdistance=((newpoly[i].x-x)*(newpoly[i].x-x)+(newpoly[i].y-y)*(newpoly[i].y-y));
		             w=Math.abs(newpoly[i].x-x)/owidth;
		             h=Math.abs(newpoly[i].y-y)/oheight;
		         }

		} 
		points+=(newpoly[i].x+left-oleft)/owidth+','+(newpoly[i].y+top-otop)/oheight;
		x=(x+left-oleft)/owidth;
		y=(y+top-otop)/oheight;
		if(tip!=null)
		{
			var annotId = MD5(this.iidDecoded + "_" + x + "_" + h + "_" + "polyline");
			var newAnnot={x:x,y:y,w:w,h:h,type:"polyline",points:points,text:tip,color:this.color,iid:this.iidDecoded,annotId:annotId}; 
			this.addnewAnnot(newAnnot);
                        this.drawMarkups();
		}
                else{ ctx.clearRect(0,0,this.drawCanvas.width,this.drawCanvas.height);}
	       }.bind(this));
	     break;
	     case "measure"://Measurement Tool
	     var started=false;
	     var x0,y0,x1,y1;
	     var length;
             var maxWidth=this.maxWidth;
             var maxHeight=this.maxHeight;
             var ratio=this.ratio;
	     this.ruler=new Element('div',{styles:{background:'black',position:'absolute',color:'white',width:'200px'}}).inject(this.container);
             this.ruler.hide();
	     this.drawCanvas.addEvent('mousedown',function(e){ 
	       if (!started)
	       {
			x0=e.event.layerX;
			y0=e.event.layerY;
		        started=true;
		        this.ruler.show();
	       }
	       else
	       {
			x1=e.event.layerX;
			y1=e.event.layerY;
			ctx.beginPath();
			ctx.moveTo(x0, y0);
			ctx.lineTo(x1, y1);
			ctx.strokeStyle = this.color;
			ctx.stroke();
		        ctx.closePath();
			var tip=prompt("Save This?",length);
	 		if(tip!=null)
	    	        {
				x=(x0+left-oleft)/owidth;
		       	        y=(y0+top-otop)/oheight;
		                w=Math.abs(x1-x0)/owidth;
		                h=Math.abs(y1-y0)/oheight;
		                points=(x1+left-oleft)/owidth+","+(y1+top-otop)/oheight;
                                this.ruler.destroy();
				var annotId = MD5(this.iidDecoded + "_" + x + "_" + h + "_" + "line");
				var newAnnot={x:x,y:y,w:w,h:h,type:"line",points:points,text:tip,color:this.color,iid:this.iidDecoded,annotId:annotId}; 
				this.addnewAnnot(newAnnot);
                                this.drawMarkups();
	     		}
               	        else{ ctx.clearRect(0,0,this.drawCanvas.width,this.drawCanvas.height);}
		        started=false;
			this.ruler.destroy();
		}
	    }.bind(this));
	    this.drawCanvas.addEvent('mousemove',function(e){ 
	       if ( started)
	       {
		  	ctx.clearRect(0,0,iip.wid,iip.hei);
			x1=e.event.layerX;
			y1=e.event.layerY;
		        var maxLength=(Math.sqrt(maxWidth*maxWidth+maxHeight*maxHeight));
		        var screen=(Math.sqrt(owidth*owidth+oheight*oheight));
			length=((Math.sqrt((x0-x1)*(x0-x1)+(y0-y1)*(y0-y1)))/screen)*maxLength*ratio+'mm';
		        this.ruler.set({html:length,styles:{left:x1+left-oleft+10,top:y1+top-otop}});
			ctx.beginPath();
			ctx.moveTo(x0, y0);
			ctx.lineTo(x1, y1);
			ctx.strokeStyle = this.color;
			ctx.stroke();
		        ctx.closePath();
		        
	       }
	    }.bind(this));
	    break;
	}
       }
       else this.showMessage("Container Not SET Correctly Or Not Fully Loaded Yet");
    },
    magnify:function()//Magnify Tool
   {
	   this.quitbutton.show();
           this.drawLayer.hide();
           this.magnifyGlass.hide();
           this.magnifyGlass.set({html:''});
	   var content=new Element('div',{'class':"magnified_content",styles:{width:document.getSize().x,height:document.getSize().y}});
	   content.set({html:document.body.innerHTML});
           content.inject(this.magnifyGlass);
	   var scale=2.0;
	   var left=parseInt(this.magnifyGlass.style.left);
	   var top=parseInt(this.magnifyGlass.style.top);
	   this.magnifyGlass.set({'styles':{left:left,top:top}});
           content.set({'styles':{left:-scale*left,top:-scale*top}});
           this.magnifyGlass.show();
	   this.magnifyGlass.makeDraggable({
	   onDrag: function(draggable){
                this.showMessage("drag the magnifying glass");
		var left=parseInt(this.magnifyGlass.style.left);
		var top=parseInt(this.magnifyGlass.style.top);
		this.magnifyGlass.set({'styles':{left:left,top:top}});
		content.set({'styles':{left:-scale*left,top:-scale*top}});
	    }.bind(this),
	    onDrop: function(draggable){
              this.showMessage("Press q to quit");
	    }.bind(this)
	  });
    },
    selectColor:function()//Pick A Color
    {
      
	this.colorContainer=new Element('div').inject(this.tool);
        var blackColor=new Element('img',{'class':'colorButton','title':'black',	
				'styles':{'background-color':'black'},
				'events':{'click':function(){this.color='black';this.colorContainer.destroy();}.bind(this)
					 }}).inject(this.colorContainer);
	var redColor=new Element('img',{'class':'colorButton','title':'Default',
				'styles':{'background-color':'red'},
				'events':{'click':function(){this.color='red';this.colorContainer.destroy();}.bind(this)
					 }}).inject(this.colorContainer);
	var blueColor=new Element('img',{'class':'colorButton','title':'blue',	
				'styles':{'background-color':'blue'},
				'events':{'click':function(){this.color='blue';this.colorContainer.destroy();}.bind(this)
					 }}).inject(this.colorContainer);
	var greenColor=new Element('img',{'class':'colorButton','title':'lime',	
				'styles':{'background-color':'lime'},
				'events':{'click':function(){this.color='lime';this.colorContainer.destroy();}.bind(this)
					 }}).inject(this.colorContainer);
	var purpleColor=new Element('img',{'class':'colorButton','title':'purple',	
				'styles':{'background-color':'purple'},
				'events':{'click':function(){this.color='purple';this.colorContainer.destroy();}.bind(this)
					 }}).inject(this.colorContainer);
	var orangeColor=new Element('img',{'class':'colorButton','title':'orange',	
				'styles':{'background-color':'orange'},
				'events':{'click':function(){this.color='orange';this.colorContainer.destroy();}.bind(this)
					 }}).inject(this.colorContainer);
	var yellowColor=new Element('img',{'class':'colorButton','title':'yellow',	
				'styles':{'background-color':'yellow'},
				'events':{ 'click':function(){this.color='yellow';this.colorContainer.destroy();}.bind(this)
					 }}).inject(this.colorContainer);
	var pinkColor=new Element('img',{'class':'colorButton','title':'pink',	
				'styles':{'background-color':'pink'},
				'events':{'click':function(){this.color='pink';this.colorContainer.destroy();}.bind(this)
					 }}).inject(this.colorContainer);
	var colorButtons=document.getElements(".colorButton");
        for(var i=0;i<colorButtons.length;i++){colorButtons[i].addEvents({'mouseenter':function(){this.addClass('selected')},'mouseleave':function(){this.removeClass('selected')}});}
	},
        addnewAnnot:function(newAnnot)//Add New Annotations
        {
		this.annotations.push(newAnnot); 
		this.saveAnnot();
                this.displayAnnot();
        },
        quitMode:function()//Return To the Default Mode
        {
           this.drawLayer.hide();
           this.magnifyGlass.hide();
        },
        toggleMarkups:function()//Toggle Markups
        {
           if(this.svg)
           {
		   if(this.annotVisible)
		   {this.annotVisible=false;this.svg.hide();document.getElements(".annotcontainer").hide();}
		   else {this.annotVisible=true;this.displayAnnot();document.getElements(".annotcontainer").show();}
           }
           else { this.annotVisible=true;this.displayAnnot();}
           this.showMessage("annotation toggled");
	},
        showMessage:function(msg)//Show Messages
        {
               if(!(msg)) msg=this.mode+" mode,press q to quit";
               this.messageBox.set({html:msg});
		var myFx = new Fx.Tween('messageBox', {
		    duration: 'long',
		    transition: 'bounce:out',
		    link: 'cancel',
		    property: 'opacity'
		}).start(0,1).chain(
   		 function(){ this.start(0.5,0); });
        },
        displayAnnot:function()//Display SVG Annotations
        {
            var a = [], b;
            var container=document.id(this.canvas);
            if(container)
            {
		    var left=parseInt(container.offsetLeft),
		    top=parseInt(container.offsetTop),
		    width=parseInt(container.offsetWidth),
		    height=parseInt(container.offsetHeight);
                    this.drawLayer.hide();
	 	    this.magnifyGlass.hide();
		    for (b in this.annotations) this.annotations[b].id = b, a.push(this.annotations[b]);
		    container.getElements(".annotcontainer").destroy();
		    if(this.svg){ this.svg.html='';this.svg.destroy();}
               //This part is for displaying SVG annotations
                if(this.annotVisible)
               {
		var svgHtml='<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'px" height="'+height+'px" version="1.1">';
                for (b = 0; b < a.length; b++) 
                {
                    if(((width*a[b].x+left)>0)&&((width*a[b].x+left+width*a[b].w)<window.innerWidth)&&((height*a[b].y+top)>0)&&((height*a[b].y+top+height*a[b].h)<window.innerHeight))
                    {
		       switch (a[b].type)
		       {
			  case "rect":
			  svgHtml+='<rect x="'+width*a[b].x+'" y="'+height*a[b].y+'" width="'+width*a[b].w+'" height="'+height*a[b].h+'" stroke="'+a[b].color+'" stroke-width="2" fill="none"/>';
			  break;
			  case "ellipse":
		          var cx=parseFloat(a[b].x)+parseFloat(a[b].w)/2;
			  var cy=parseFloat(a[b].y)+parseFloat(a[b].h)/2;
			  var rx=parseFloat(a[b].w)/2;
			  var ry=parseFloat(a[b].h)/2;
			  svgHtml+='<ellipse cx="'+width*cx+'" cy="'+height*cy+'" rx="'+width*rx+'" ry="'+height*ry+'" style="fill:none;stroke:'+a[b].color+';stroke-width:2"/>';
                          break;
			  case "pencil":
	 		  var points=a[b].points;
			  var poly=String.split(points,';');
			  for (var k=0;k<poly.length;k++)
			  {
			     var p=String.split(poly[k],' ');
			     svgHtml+='<polyline points="';         
		             for (var j=0;j<p.length;j++)
		             {
				  point=String.split(p[j],',');
				  px=point[0]*width;
				  py=point[1]*height;
				  svgHtml+=px+','+py+' ';
		             }
			     svgHtml+='" style="fill:none;stroke:'+a[b].color+';stroke-width:2"/>';
			  }
			  break;
			  case "polyline":
 			  var points=a[b].points;
			  var poly=String.split(points,';');
			  for (var k=0;k<poly.length;k++)
			  {
			     var p=String.split(poly[k],' ');
			     svgHtml+='<polygon points="';         
		             for (var j=0;j<p.length;j++)
		             {
				  point=String.split(p[j],',');
				  px=point[0]*width;
				  py=point[1]*height;
				  svgHtml+=px+','+py+' ';
		             }
			     svgHtml+='" style="fill:none;stroke:'+a[b].color+';stroke-width:2"/>';
			  }
			  break;
                          case "line":
                          var points=String.split(a[b].points,',');
                          svgHtml+='<line x1="'+a[b].x*width+'" y1="'+a[b].y*height+'" x2="'+parseFloat(points[0])*width+'" y2="'+parseFloat(points[1])*height+'" style="stroke:'+a[b].color+';stroke-width:2"/>';
			  break;
		       }
 		   var d = new Element("div", {
                        id: a[b].id,
                        "class": 'annotcontainer',
                        styles: {
                            position:'absolute',
                            left: Math.round(width * a[b].x),
                            top: Math.round(height * a[b].y),
                            width: Math.round(width * a[b].w),
                            height: Math.round(height * a[b].h)
                        }
		    }).inject(container);
                    var c=this;
                    d.addEvents({'mouseenter':function(e){e.stop;c.displayTip(this.id)},
                                 'mouseleave':function(e){e.stop;c.destroyTip()},
                                 'dblclick':function(e){ e.stop();c.editTip(this.id)}}); 
                    }
                }
		 svgHtml+='</svg>';
                 if (this.annotations.length>0)
                 {
		 //inject the SVG Annotations to this.Canvas
	   	 this.svg = new Element("div", {
		 styles: {
		     position:"absolute",
		     left: 0,
		     top: 0,
		     width: '100%',
		     height: '100%'
		   },
	     	   html:svgHtml
		}).inject(container);
                }
                else {this.showMessage("Please Press white space to toggle the Annotations");}
             }
            }else{this.showMessage("Canvas Container Not Ready");}
	},
        displayTip:function(id)//Display Tips
        { 

            var container=document.id(this.canvas);
            var width=parseInt(container.offsetWidth),
	        height=parseInt(container.offsetHeight),
                annot=this.annotations[id];
             var d = new Element("div", {
                        "class": 'annotip',
                        styles: {
                            position:'absolute',
                            left: Math.round(width*annot.x),
                            top: Math.round(height*annot.y)
                        },
                        html:annot.text
		    }).inject(container);
             this.showMessage("Double Click to Edit");
        },
        destroyTip:function()//Destroy Tips
        {    
            var container=document.id(this.canvas);
                container.getElements(".annotip").destroy();
        },
        editTip:function(id)//Edit Tips
        {
            var container=document.id(this.canvas);
                container.getElements(".annotip").destroy();
            var width=parseInt(container.offsetWidth),
	        height=parseInt(container.offsetHeight),
 		left=parseInt(container.offsetLeft),
	        top=parseInt(container.offsetTop),
                annot=this.annotations[id];
            var d = new Element("div", {
                        "class": 'edittip',
                        styles: {
                            position:'absolute',
                            left: Math.round(width*annot.x+left),
                            top: Math.round(height*annot.y+height*annot.h+top)
                        }
		    }).inject(document.body);
            d.makeDraggable();
            var deleteButton=new Element("button",{html:'Delete',events:{'click':function(){d.destroy();this.deleteAnnot(id)}.bind(this)}}).inject(d);
           var editButton=new Element("button",{html:'Edit',events:{'click':function(){
		      var tip=prompt("Make some changes",annot.text);
                      if(tip!=null)
	    	      {
                          var newAnnotation = this.annotations[id];
			  newAnnotation.text = tip;
			  this.deleteAnnot(id);
			
			  this.addnewAnnot(newAnnotation);
			  d.destroy();
	     	      }
                      else d.destroy();
               }.bind(this)}}).inject(d);
            var cancelButton=new Element("button",{html:'Cancel',events:{'click':function(){
                     d.destroy();
               }}}).inject(d);
        },
        deleteAnnot:function(id)//Delete Annotations
        {
              var testAnnotId = this.annotations[id].annotId;	
	      this.annotations.splice(id,1);
	      //this.saveAnnot();
	      //########### Do the delete using bindaas instead of on local list.
	      if(this.iid)
              {
                var jsonRequest = new Request.JSON({url: Dir+'/api/deleteAnnot.php',onSuccess: function(e){
                        this.showMessage("deleted from server");
                }.bind(this),onFailure:function(e){
                        this.showMessage("Error deleting the Annotations, please check your deleteAnnot php");}.bind(this)}).get({'annotId':testAnnotId});
              }
              this.displayAnnot();
        },
        saveAnnot:function()//Save Annotations
        {
                if(this.iid)
                {
		   var jsonRequest = new Request.JSON({url: Dir+'/api/annotation.php',
                         onSuccess: function(e){
			this.showMessage("saved to the server");
			}.bind(this),onFailure:function(e){
                       this.showMessage("Error Saving the Annotations,please check you saveAnnot funciton");}.bind(this)}).post({'iid':this.iid,'annot':this.annotations});

                }
                else
                {
		   var jsonRequest = new Request.JSON({url: Dir+'/api/annot.php',
                         onSuccess: function(e){
			this.showMessage("saved to the server");
			}.bind(this),onFailure:function(e){
                       this.showMessage("Error Saving the Annotations,please check you saveAnnot funciton and the api/annot.php function");}.bind(this)}).post({'annot':this.annotations});
                }
        },
        saveState:function()
        {
               if(this.iid)
                {
		   var jsonRequest = new Request.JSON({url: Dir+'/api/state.php',
                         onSuccess: function(e){
			this.showMessage("saved to the server");
			}.bind(this),onFailure:function(e){
                       this.showMessage("Error Saving the state,please check you saveState funciton");}.bind(this)}).post({'iid':this.iid,'zoom':iip.view.res,'left':iip.view.x,'top':iip.view.y});

                }else this.showMessage("Sorry, This Function is Only Supported With the Database Version");
        }
});

