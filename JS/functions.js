var data;
var container;
var node;
var svg
$.fn.redraw = function(){
  $(this).each(function(){
    var redraw = this.offsetHeight;
  });
};
var p;
var init = function(){
	//console.log("loading data");
/*	d3.json("data.json", function(error, json){
		data = json;
		//console.log("error");
		drawIcons();
	})*/
	drawIcons();
	$(".phase1").click(function(){
		//console.log("going to phase 2");
		iconsOff();
		$(this).toggleClass("phase1 phase2");
	})
	
}
var duration = 300;

jQuery.easing.def = "easeInCirc";
var $selected;
var selected = [];

var getTileData = function(){
	$selected = $(".inBin");
	numSelected = $selected.length;
	$selected.each(function(i,o){ 
		var datum = $(o).prop("__data__");
		datum.weight = 100/numSelected;
		selected.push(datum); 
	})
	return selected;
}

var makePie = function(){
	binW = $(".bin").width();
	p = new inPie(binW, binW);
	p.build(".bin", selected, icons);

	$(document).on("RATE", function(e){
			var rate = e.rate;
			$(".live_rate").text(rate).parent().toggleClass("inactive",false).redraw();
		});
}

var iconsOff = function(){
	getTileData();
	$tiles = $(".tile:not(.inBin)");
	numtiles = $tiles.length;
	$tiles.each( function(i, o){ 
		var ii = numtiles - i;
		//console.log(this);
	//	$(o).delay(duration*ii).animate({"top":"+=768"} ), duration/ii, 'easeInCirc'
		$(o).delay(duration*(ii/(3+Math.random())))
			.animate({"top":"+=768"}, duration, 'easeInCirc')
	}).delay(1000).queue(function(){$(this).remove()})
	

	off = $(".left").width();
	delayDuration = duration*numtiles/3;
	
	$("#container").delay(delayDuration).queue(function(n){
		$(this).addClass("phase2")
	})
	
	$(".bin").delay(delayDuration+1000).queue(function(n){
		$(this).addClass("phase2").delay(1000);
		setTimeout(makePie, 1000);
	});
	
	$(".right").find("h1, h2").delay(delayDuration/2).queue(function(n){
		$(this).addClass("inactive")
		$selected.each(function(i, o){
			$(this).find("p").css("opacity","0");
			$(this).find("svg, .icon, p").animate({
				width:"0px",
				height:"0px",
				"pointer-events":"none"
			}, duration, function(){ $(this).remove()})
		}).delay(1000).queue(function(){$(this).remove()})
	})
}

var icons = {};
var drawIcons = function (){
	//console.log(data_json);
	container = d3.select(".left");
	//console.log("drawing icons")
	tile = container.selectAll("div").data(data_json).enter()
		.append("div").attr("class","tile")
			
			tile.append("div").attr("class","icon").attr("id",function(d){return d.ser_id});
				tile.select(".icon").each(function(d){
				
					var fileString = "SVG/"+d.ser_id+".svg";
					//console.log(fileString);
					
					d3.xml(fileString, "image/svg+xml", function(_doc){
						svg = _doc.getElementsByTagName("g");
						node = document.importNode(_doc.documentElement, true);
						icons[d.ser_id] = node;
						document.getElementById(d.ser_id).appendChild(node);
					});
					
				});
			tile.append("p").text(function(d){return d.program_name})
			
			$(".tile").draggable({

				create : function(e, ui){
					$this = $(this);
					thisPos = $this.offset();
				},
				start : function(e, ui){
					$(this).find(".icon").toggleClass("active", true);
					$(this).find("p").fadeOut(200);
				},
				stop : function(e, ui){
					$this = $(this);
					$this.find(".icon").toggleClass("active", false);
					$this.find("p").fadeIn(200);
					//console.log(this);
					if (!$this.hasClass("inBin")){
						//console.log("not in bin");
						$this.animate({
							left : 0,
							top : 0
						})
					}
				}
			})
			
			$(".bin").droppable({
				accept : ".tile",
				activeClass : "active",
				hoverClass : "drop-hover",
				tolerance: "fit",
				drop : function(e,ui){
					ui.draggable.toggleClass("inBin", true);
					$(".lab").toggleClass("inactive", true);
				}
			})
			
			$(".left").droppable({
				accept : ".inBin",
				activeClass : ".active",
				hoverClass : ".drop-hover",
				drop : function(e,ui){
					ui.draggable.toggleClass("inBin", false)
				}
			})
};




	
	
