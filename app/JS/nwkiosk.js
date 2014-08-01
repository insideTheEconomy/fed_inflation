var nwKiosk = function(){
	var fs = require("fs");
	var mouseHidden =true;
	var kioskMode=true;
	var devTools=true;
	var gui =require('nw.gui');
	var when = require('when');
	//setInterval(focus_window,5000);
	
	var win = gui.Window.get();
	this.win = win;
	var dataF = gui.App.dataPath;
	this.settingsPath = dataF+"/settings.json";
	var self = this;
	this.goFull = function(){
		win.enterKioskMode();
		$("html").css("cursor","none");
		kioskMode = true;
		mouseHidden = true;
	}
	this.setup = function(){
	//	var dfd = when.defer();
		
		$(window).keypress(function(d){
			console.log("keypressed");
			switch(d.keyCode)
				{
				case 107:
					console.log("changeKioskMode "+!kioskMode);
				  (kioskMode) ? win.enterKioskMode() : win.leaveKioskMode() ;
				  kioskMode = !kioskMode;
				  break;
				case 109:
					console.log("changemouse ")
					
					if(mouseHidden){
						$("html").css("cursor","default");
					}else{
						$("html").css("cursor","none")
					}
				  	mouseHidden=!mouseHidden;
				  break;
				case 100:
				  (devTools) ? gui.Window.get().showDevTools() : gui.Window.get().closeDevTools();
				  devTools=!devTools;
				  break;
				}
		});
		
		
		

		
	}
	
	this.hideMouse = function(){
		$("body").css("cursor","none");
		mouseHidden = true;
	}
	this.showMouse = function(){
		$("body").css("cursor","pointer");
		mouseHidden = false;
	}
	
}
