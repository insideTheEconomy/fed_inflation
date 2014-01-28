var w = 300,                        //width
h = 300,                            //height
r = 100,                            //radius
color = d3.scale.category20c();     //builtin range of colors



var inPie = function( _w, _h) {
	this.maxIconScale = 1.5;
	this.initScale = 1;
	this.icons = [];
	this.w = _w;
	this.h = _h;
	this.r = Math.min(this.w, this.h) / 2;
	this.offset = {x: this.w/2, y:this.h/2}
	this.textPad = 12;
	this.sliceScale = this.r;
	this.startAngle = 0;
	this.offset.angle = 0;
	this.segProp = {r: this.r-12}
	this.precision = 1;
}
inPp = inPie.prototype;

Object.defineProperty(inPp, "dataset",{
	get: function(){return this.data},
	set: function(ds){
		this.data = ds;
		//console.log("DATASET RECEIVED");
		this.update();
		}});
		
inPp.rad2deg = function(rad){
	return +rad*(180/Math.PI); 
}

inPp.deg2rad = function(deg){
	return +deg*(Math.PI/180); 
}


inPp.build = function(sel, _data, _icons){
	var _self  = this;
	this.icons = _icons;
	this.data = _data;

	
	//div for visualization
	this.vis = d3.select(sel)
	    .append("svg:svg").data([this.data])
	        .attr("width", this.w)
	        .attr("height", this.w)
	
	//make a group to hold our pie ui
	this.svg = this.vis
	    .append("svg:g")                
	       .attr("transform", "translate(" + this.offset.x + "," + this.offset.y + ")")    
			.attr("class","pie")
			_rad = this.r;
	this.sliceGroup = this.svg.append("g");

	//Helper to create paths from arc data
	this.arc = d3.svg.arc()
	    .outerRadius( this.r ).innerRadius(90);

	

		
	this.pie = d3.layout.pie()           //this will create arc data for us given a list of values
	    .value(function(d) { return d.weight; }).sort(null);    //we must tell it out to access the value of each element in our data array
	

	this.slices = this.sliceGroup.selectAll("g.slice")     
		.data(this.pie)     //bind data to the pie layout            
		.enter()                          
		.append("svg:g")                
		.attr("class", "slice")
	

	
	
	
/*	this.slices.append("svg:path")
	            .attr("fill", function(d, i) { return null } ) //set the color for each slice to be chosen from the color function defined above
	            .style("fill-opacity","0")	
				.attr("d", this.arc)     */                               //this creates the actual SVG path using the associated data (pie) with the arc drawing function
	this.buildLabels();
	this.buildIcongroups();
	this.buildHandles();		
		//drag icon
		this.dragProp = {
			w:+100,
			h:+100,
			off: +50
		}
			var initA;
			var lastA;
			
			this.drag = d3.behavior.drag()
				.origin(null).on("dragstart", function(){
					//init angle is based on startAngle of handle
					initA = _self.rad2deg(d.startAngle);
					lastA = initA;
				})
				.on("drag", function(d, i){
					
					dData = _self.data;
					//point representing current mouse position
					var point = ev2point(d3.event);
					//change in rotation(in degrees)
					delta = point.deg - lastA;
					thisI = i;
					//if(Math.abs(delta) < 10){
					var jumpy = Math.abs(delta) < 10;
					if(jumpy){  //threshold "jumpiness"
					
						//wrap the index of the "neighbor" slice
						var lastI =  (thisI == 0 ) ? dData.length - 1 : thisI - 1;
						
						//direction of rotation
						var isCW = (delta > 0) ? true : false;
						
						if (dData[thisI].weight <= 6 && isCW) return false;
						else if (dData[lastI].weight <= 6 && !isCW ) return false;
						else{
							//offset the whole thing, since [0].startAngle is always 0
							if(thisI == 0){ _self.offset.angle +=  _self.deg2rad(delta); }
							//console.log(d3.event);
							deltaPercentage = delta/3.6;

							//console.log("dragging");
							dData[i].weight += -deltaPercentage;
							dData[lastI].weight += deltaPercentage;


							_self.handles.each(function(e,j){
								if(thisI == j){
									d3.select(this).selectAll(".arrow.right").classed("active", isCW);
									d3.select(this).selectAll(".arrow.left").classed("active", !isCW);
								}

							})	

							_self.dataset = dData;	//this is a setter, automatically re-draws
						}
						
					}
					
					lastA = point.deg;
				}).on("dragend", function(){
					d3.select(this).selectAll(".arrow").classed("active", false);
				})
			//using d3 drag event, return a point and rad/deg rotation around the origin
		var ev2point = function(ev){
			//console.log(ev);

			var pi = Math.PI;
			res = {}
			var mouse = {};
			var client = {};
			client.x = ev.sourceEvent.clientX;
			client.y = ev.sourceEvent.clientY;
			
			mouse.x = ev.sourceEvent.clientX - _self.offset.x +16;
			mouse.y = ev.sourceEvent.clientY - _self.offset.y +32;
			
		//	console.log("client Mouse: "+client.x+","+client.y);
		//	console.log("obj Mouse: "+mouse.x+","+mouse.y)
			res.x = +ev.x;
			res.y = +ev.y;
			res.client = client;
			res.mouse = mouse;
		//	res.radians = Math.atan2(res.mouse.y, res.mouse.x) + pi;
			res.radians = Math.atan2(res.y, res.x) + pi;
			res.deg = res.radians*(180/pi);
			return res;
		}
		
		this.handles.call(this.drag);

}

inPp.update = function(){
	var _self  = this;
	var _maxScale = 2;
		this.slices    
		    .data(this.pie) //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
		
	this.updateSegs();
	
		
	/*	this.slices.select("path")
		            .attr("d", this.arc);   //this creates the actual SVG path using the associated data (pie) with the arc drawing function*/
		this.handles.data(this.pie);
		this.perc.data(this.pie);
		
		
		
		this.sliceGroup.attr(
	    "transform", 
		function(d,i){
	        return "rotate("+_self.rad2deg( _self.offset.angle )+")"
		})
		
		this.handles.attr(
	    "transform", 
		function(d,i){
			var angle = +d.startAngle + _self.offset.angle;
			//console.log(angle);
	        return "rotate("+_self.rad2deg( angle )+")"
		})
		
		this.perc.attr({
			transform: function(d,i){
				_c = (d.endAngle - d.startAngle);
				console.log("_c: "+_c);
				var angle = d.startAngle + (_c/2) + _self.offset.angle;
				console.log("angle "+angle);
				//console.log(angle);
		        return "rotate("+_self.rad2deg(angle)+") translate( 0 "+(-_self.r+24)+")"
		    }
		})
		
		this.perc.selectAll(".percentage").text(function(d){
				return d.data.weight.toFixed(_self.precision)+"%";
		})
					
		this.slices.select(".icongroup")
			.attr("transform", function(d) { //set the icon/label's origin to the center of the arc
				d.innerRadius = 0;
				d.outerRadius = r;
				var _scale = d.data.weight/_self.initScale;
				_scale = (_scale > 1) ? 1 : (_scale < 0.5 )? 0.5 : _scale;
				return "translate(" + _self.arc.centroid(d) + ") scale("+_scale+","+_scale+") rotate("+ _self.rad2deg( -_self.offset.angle )+")";        //this gives us a pair of coordinates like [50, 50]
	        })
	
				this.foreignRate.attr("transform", function(d) {                    //set the icon's origin to the center of the arc
					            //we have to make sure to set these before calling arc.centroid
					            d.innerRadius = 0;
					            d.outerRadius = r;
					            return "translate(" + _self.arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
					        })
	
		this.foreignBody.select(".weight")  //update label for each foreignBody
			.text(function(d, i) { return _self.data[i].weight.toFixed(_self.precision)+"%"; });        
	
		var weightedSum = 0;
		var vals = "";
		var weights = "";
		this.data.forEach(function(d,i){
			var weightedValue = d.value * d.weight;
			vals += d.value+",";
			//console.log("weighted value :" +weightedValue);
			weightedSum += weightedValue;
		})
		//console.log("Weighted sum: "+weightedSum / 100);
		//console.log("values: "+vals);
		//console.log("sum :"+weightedSum);
		var averageRate = weightedSum / 100;
		//console.log("average rate :"+averageRate);
		$.event.trigger({
			type: "RATE",
			rate: averageRate.toFixed(_self.precision),
		});
	
				
	
}

inPp.buildHandles = function(){
	var _self  = this;
	this.handles = this.svg.selectAll("g.handles").data(this.pie).enter().append("g");
	this.handles.attr({
	    "class":"handles",
	    transform: function(d,i){
			var angle = +d.startAngle;
			//console.log(angle);
	        return "rotate("+_self.rad2deg(angle)+")"
	    }

	}).append("line").attr({
	    x1: 0, y1: 0,
	    x2: 0, y2: -_self.r,
	    "class": "handle bar"
	});
	

	
	var arrH = 12;
	var arrW = 24;
	var gutter = 2;
	var cy = -(this.r-arrH);
	
	this.handles.append("circle").attr({
		"cy": cy, r: 30, "class":"handleArea"
	})
	
	this.polyR = 	[{"x":gutter, "y":cy-arrH}, {"x":gutter, "y":cy+arrH}, {"x":gutter+arrW, "y":cy}];
	this.polyL = 	[{"x":-gutter, "y":cy-arrH}, {"x":-gutter, "y":cy+arrH}, {"x":-gutter-arrW, "y":cy}];
	
	
	this.handles.append("polygon")
	    .attr("points",function(d) { 
	        return _self.polyR.map(function(d) { return [d.x,d.y].join(" "); }).join(",");}).attr("class","handle arrow right");

	this.handles.append("polygon")
	    .attr("points",function(d) { 
	        return _self.polyL.map(function(d) { return [d.x,d.y].join(" "); }).join(",");}).attr("class","handle arrow left");
	
	this.handles.attr("filter","url(#glowie)");
	this.buildSegs();
}



inPp.buildLabels = function(){
	var _self  = this;
	this.perc = this.svg.selectAll("g.perc").data(this.pie).enter().append("g");
	this.perc.attr({
	    "class":"perc",
	    transform: function(d,i){
			_c = (d.endAngle - d.startAngle);
		
			console.log("_c: "+_c);
			var angle = d.startAngle + (_c/2);
				d.midAngle = angle;
			console.log("angle "+angle);
			//console.log(angle);
	        return "rotate("+_self.rad2deg(angle)+") translate( 0 "+(-_self.r+24)+")"
	    }

	}).append("text").attr("class","percentage").attr("text-anchor","middle").text(function(d){
			return d.data.weight.toFixed(_self.precision)+"%";
	}).attr("transform",function(d){
		_c = (d.endAngle - d.startAngle);
		check = ((_self.rad2deg(d.midAngle)+90)%360 >= 180)
		_ro = (check) ? 180 : 0;
		_off = (check) ? 18 : 0;
		return "rotate("+_ro+") translate( 0 "+_off+")"
	});
	

	
}



inPp.buildIcongroups = function(){
	var icnW = 100;
	var icnH = 100;
	
	var bodyW = icnW*1.5;
	var bodyH = icnH*1.5;
	
	var icnCX = icnW/2;
	var icnCY = icnH/2;
	
	var bodyCX = bodyW/2;
	var bodyCY = bodyH/2;
	var vOff = 25;
	var fOff = 0;
	var labelPad = 6;
	
	_self = this;
	this.icongroup = this.slices.append("g").attr("class","icongroup").attr("id", function(d){return d.data.ser_id })   
		.attr("transform", function(d) {                    //set the icon's origin to the center of the arc
	            //we have to make sure to set these before calling arc.centroid
	            d.innerRadius = 0;
	            d.outerRadius = r;
	            return "translate(" + _self.arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
	        })
	
	this.foreignRate = this.slices.append("foreignObject")
		.attr({
			"width":icnW,
			"height":icnH,
			"x":-icnCX, "y":-icnH
		}).attr("transform", function(d) {                    //set the icon's origin to the center of the arc
		            //we have to make sure to set these before calling arc.centroid
		            d.innerRadius = 0;
		            d.outerRadius = r;
		            return "translate(" + _self.arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
		        })
		
	this.rateBody = this.foreignRate.append("xhtml:body").attr("class","foreign");
	
	this.rateLabel = this.rateBody.append("div")                                     //add a label to each slice
		.attr({
			"class":"series rate",
		}).style({
			height:icnH
		}).append("h2").text(function(d, i) { 
			var rate = +d.data.value;
			rate = +rate;
			rate = rate.toFixed(_self.precision);
			return rate+"%";
		})
	
	
	this.slices.each(function(d){
		
		_self.initScale = d.data.weight;
		document.getElementById(d.data.ser_id).appendChild( _self.icons[d.data.ser_id] );		
	});
	
	
	this.icongroup.select("svg").attr({ //svg contains icon path vector
		"x":-icnCX,
		"y":-icnCY-vOff,
		"transform":null,
		"height":icnW,
		"width":icnH,
		"style":null,
		"version":null
	}).append("rect").attr({
		width: icnW, height: icnH, fill:"#ffee00", "class":"handleArea"
	});
	
	this.icongroup.each(function(d){d.rateMode = false});
	
	
	

	
	
	this.foreignBody = this.icongroup.append("foreignObject")
		.attr({
			"class": "foreignBody",
			"width":bodyW,
			"height":icnCY,
			"x":-bodyCX,
			"y":icnCY,
			"style":"color:white"
		}).append("xhtml:body").attr("class","foreign");
		
		
		
			
		this.foreignBody.append("p")                                     //add a label to each slice
			.attr({
				"class":"series label",
			}).style("margin-top", labelPad).text(function(d, i) { return _self.data[i].program_name; });        //get the label from our original data array  */
			
	/*	this.weightLabel = this.foreignBody.append("h2")                                     //add a label to each slice
			.attr({
				"class":"series weight active",
			}).text(function(d, i) { return d.data.weight.toFixed(_self.precision)+"%"; });        //get the label from our original data array  */
		
		
		      //get the label from our original data array  */
		
}


inPp.calcSegs = function(){
	this.slices.each(function(d){
		_pad = _self.deg2rad(6);
	    _start = d.startAngle+_pad;
	    _end = d.endAngle-_pad;
	    _size = _end-_start;
	    _steps = Math.floor(_self.rad2deg(_size)/2);
	    _step = (_end-_start)/_steps;
	    var _d = d3.range(_steps+1).map(function(i){
	        return (i*_step)+_start
	    })
	    d.angles=_d;
	    //console.log(d);
	})
}

inPp.buildSegs = function(){
	this.calcSegs();
	this.segLine = d3.svg.line.radial()
	    .interpolate("cardinal")
	    .radius(this.segProp.r)
	    .angle(function(d, i) { return d });

	this.segs = this.slices
	    .append("g").attr("class","segments");
	this.segs.datum(function(d){return d.angles});

	this.segs.append("path").attr("class", "seg").attr("d", this.segLine).attr("stroke-dasharray","5,5");
}

inPp.updateSegs = function(){
		this.calcSegs();
		
		_segs = this.slices
		    .select(".segments").attr("class","segments").datum(function(d){return d.angles});

		_segs.select(".seg").attr("d", this.segLine).attr("stroke-dasharray","5,5");
	
}

inPp.addClickHandlers = function(){
	console.log("adding click handlers");
	this.slices.on("click", function(d,i) {
		console.log("Click!");
		d.rateMode = !d.rateMode;
		$this = $(this);
		
		$this.find(".series.rate").toggleClass("inactive");
		
	
		
		_self.update();
	});
}







