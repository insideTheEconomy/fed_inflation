var data;
var container;
var node;
var svg;
var resetContent;
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
	$(".static_rate").html(national_rate.toFixed(2));
	drawIcons();
	window.setTimeout( function(){
	//	d3.selectAll("path, circle, polygon, line").attr("fill",  null).attr("stroke",null);
	}, 1000)
	
	$("#footer").on("click", "#button.phase1", function(){
		//console.log("going to phase 2");
		phase2Transition();
		$(this).toggleClass("phase1 phase2");
	});
	
	$("#footer").on("click", "#button.phase2", function(){
		$(this).toggleClass("phase2 phase3");
		$(this).find("h3").text("RESET");
		phase3Transition();
	});
	$("#footer").on("click", "#button.phase3", function(){
		$("#container").addClass("loading");
		location.reload();
	});
	


	
	

	
	
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
	$("#button").toggleClass("noclick");
	$(document).on("RATE", function(e){
			var rate = e.rate;
			$(".live_rate").text(rate).parent().toggleClass("inactive",false).redraw();
		});
}

var phase2Transition = function(){
	$("#button").toggleClass("noclick");
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

var phase3Transition = function(){
	var heading ="HOW DOES YOUR RATE COMPARE?"
	var body = "You might be spending money on things that have a different inflation rate from the national rate."
		$(".phase2.heading").text(heading).redraw();
		$(".phase2.body").text(body).redraw();
		$(".natl.rate, .lab").removeClass("inactive");
		$(".prompt").removeClass("inactive");
		p.addClickHandlers();
	

}

var icons = {};
var drawIcons = function (){
	//console.log(data_json);
	container = d3.select(".left");
	//console.log("drawing icons")
	tile = container.selectAll("div").data(data_json).enter()
		.append("div").attr("class","tile");
			
	tile.append("div").attr("class","icon").attr("id",function(d){return d.ser_id});
	tile.select(".icon").each(function(d){
	
		var fileString = "SVG/"+d.ser_id+".svg";
		//console.log(fileString);
		
		d3.xml(fileString, "image/svg+xml", function(_doc){
			//console.log(_doc)
			node = document.importNode(_doc.documentElement, true);
			//console.log($(node));
			$(node).find("path, circle, polygon, line").attr("fill","#A4DBE8");
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
			if ($(".inBin").length >= 5){
				alert("You've already got 5 items, you'll need to remove one to add any more.");
				return false;
			}else{
				var hasItems = ($(".inBin").length > 0);
				$("#button").toggleClass("inactive", !hasItems);
			}
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
	 $("#container").removeClass("loading");

};




	
	
