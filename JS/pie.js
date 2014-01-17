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
	this.icons = _icons;
	this.data = _data;
	var	_self = this;
	
	//div for visualization
	this.vis = d3.select(sel)
	    .append("svg:svg")
	        .attr("width", this.w)
	        .attr("height", this.w)
	
	//make a group to hold our pie ui
	this.svg = this.vis
	    .append("svg:g")                
	       .attr("transform", "translate(" + this.offset.x + "," + this.offset.y + ")")    
			.attr("class","pie")
			_rad = this.r;

	//Helper to create paths from arc data
	this.arc = d3.svg.arc()
	    .outerRadius( this.r ).innerRadius(90);

	

		
	this.pie = d3.layout.pie()           //this will create arc data for us given a list of values
	    .value(function(d) { return d.weight; }).sort(null);    //we must tell it out to access the value of each element in our data array
	

	this.slices = this.svg.selectAll("g.slice")     
		.data(this.pie(this.data))     //bind data to the pie layout            
		.enter()                          
		.append("svg:g")                
		.attr("class", "slice")
	

	
	this.handles = this.svg.selectAll("g.handles").data(this.pie(this.data)).enter().append("g");
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
	
	this.polyR = 	[{"x":gutter, "y":cy-arrH}, {"x":gutter, "y":cy+arrH}, {"x":gutter+arrW, "y":cy}];
	this.polyL = 	[{"x":-gutter, "y":cy-arrH}, {"x":-gutter, "y":cy+arrH}, {"x":-gutter-arrW, "y":cy}];
	
	
	this.handles.append("polygon")
	    .attr("points",function(d) { 
	        return _self.polyR.map(function(d) { return [d.x,d.y].join(" "); }).join(",");}).attr("class","handle arrow right");

	this.handles.append("polygon")
	    .attr("points",function(d) { 
	        return _self.polyL.map(function(d) { return [d.x,d.y].join(" "); }).join(",");}).attr("class","handle arrow left");
	
	this.handles.attr("filter","url(#glow)");
	
	this.slices.append("svg:path")
	            .attr("fill", function(d, i) { return null } ) //set the color for each slice to be chosen from the color function defined above
	            .style("fill-opacity","0")	
				.attr("d", this.arc)                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

	this.icongroup = this.slices.append("g").attr("class","icongroup").attr("id", function(d){return d.data.ser_id })   
		.attr("transform", function(d) {                    //set the icon's origin to the center of the arc
	            //we have to make sure to set these before calling arc.centroid
	            d.innerRadius = 0;
	            d.outerRadius = r;
	            return "translate(" + _self.arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
	        })
	
	this.scaleByWeight = function(d){
		var scale = +d.data.weight;
		scale /= 100;
		scale *= _self.sliceScale;
		return scale;
	}

	this.slices.each(function(d){
		var changeType = function ( elem ){
			var nElem = document.createElement("g");
			elem = elem.cloneNode(true);
			while (elem.firstChild){
				nElem.appendChild(elem.firstChild);
			}
			return nElem;
		}
						_self.initScale = d.data.weight;
					
						document.getElementById(d.data.ser_id).appendChild( _self.icons[d.data.ser_id] );		
	});

	this.icongroup.select("svg").attr({
		"x":function(d){
			return - _self.scaleByWeight(d)/2;
		},
		"y":function(d){
			return -_self.scaleByWeight(d)/2;
		},
		"transform":null,
		"height":function( d){ return _self.scaleByWeight(d);},
		"width":function( d){ return _self.scaleByWeight(d);},
		"style":null,
		"version":null
		
	});
	
	this.foreignBody = this.icongroup.append("foreignObject")
		.attr({
			"width":function( d){ return _self.scaleByWeight(d) * 1.5;},
			"height":"100px",
			"x":function(d){ return -_self.scaleByWeight(d)/2 * 1.5},"y":function(d){ return _self.scaleByWeight(d)/2 },
			"style":"color:white"
		}).append("xhtml:body").attr("class","foreign");
		
		this.foreignBody.append("p")                                     //add a label to each slice
			.attr({
				"class":"series_label",
			}).text(function(d, i) { return _self.data[i].program_name; });        //get the label from our original data array  */
		this.weightLabel = this.foreignBody.append("h2")                                     //add a label to each slice
			.attr({
				"class":"series_weight",
			}).text(function(d, i) { return _self.data[i].weight.toFixed(0)+"%"; });        //get the label from our original data array  */
			var initA;
			var lastA;
			
		//drag icon
		this.dragProp = {
			w:+100,
			h:+100,
			off: +50
		}
		this.dragBody = this.svg.append("foreignObject")
			.attr({
				"width":this.dragProp.w,
				"height":this.dragProp.h,
				"class": "dragBody inactive"
			});
			
		this.dragBody.append("xhtml:body").attr("class","dragImg").append("img").attr("src","SVG/drag.svg")
		
		
		//set up custom drag action
	/*	this.drag = d3.behavior.drag()
			.origin(null).on("dragstart", function(){
				initA = ev2point(d3.event).deg;
				lastA = initA;
				//console.log("initial Angle :: "+initA);
			})
			.on("drag", function(d, i){
				_self.dragBody.classed("inactive", false);
			
				dData = _self.data;
				var point = ev2point(d3.event);
					_self.dragBody.attr({
						//x: point.x-_self.dragProp.off,
						//y: point.y-_self.dragProp.off,
						transform: "translate("+(point.x-_self.dragProp.off)+" "+(point.y-_self.dragProp.off)+" ) rotate("+point.deg+" 50 50)"
					})
				delta = point.deg - lastA;
				thisI = i;
				if(Math.abs(delta) < 10){  //limit "jumpiness"
					dData.forEach(function(e, ei){
						check = (thisI == ei)
						dData[ei].weight += (check) ? delta/3.6 : -delta/3.6; //update slice values
					})
				}
				_self.dataset = dData;	//this is a setter, automatically re-draws
				lastA = point.deg;
			}).on("dragend", function(){
				_self.dragBody.classed("inactive", true);
			}) */
			//helper function for drag 
			
			this.drag = d3.behavior.drag()
				.origin(null).on("dragstart", function(){
					initA = ev2point(d3.event).deg;
					lastA = initA;
					console.log("dragstart");
					//console.log("initial Angle :: "+initA);
				})
				.on("drag", function(d, i){
					dData = _self.data;
					var point = ev2point(d3.event);
						_self.dragBody.attr({
							transform: "translate("+(point.x-_self.dragProp.off)+" "+(point.y-_self.dragProp.off)+" ) rotate("+point.deg+" 50 50)"
						})
					delta = point.deg - lastA;
					thisI = i;
					//if(Math.abs(delta) < 10){
					if(Math.abs(delta) < 10){  //threshold "jumpiness"
						_self.startAngle =  _self.deg2rad(delta);
						var isRight = (delta > 1) ? true : false;
						console.log(d3.event);
						//this.select(".right").classed("active", isRight);
						//this.select(".left").classed("active", !isRight);
						deltaPercentage = delta/3.6;
						var lastI =  (thisI == 0 ) ? dData.length - 1 : thisI - 1;
						console.log("dragging");
						dData[i].weight += -deltaPercentage;
						dData[lastI].weight += deltaPercentage;
							
						_self.dataset = dData;	//this is a setter, automatically re-draws
					}
					
					lastA = point.deg;
				}).on("dragend", function(){
					_self.dragBody.classed("inactive", true);
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
	var _maxScale = 2;


	_self = this;
		this.pie.data = this.data;
		this.slices    
		    .data(this.pie(this.data)) //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
		
		this.slices.select("path")
		            .attr("d", this.arc) ;  //this creates the actual SVG path using the associated data (pie) with the arc drawing function
				//	.transition().duration(100)
		
		this.handles.data(this.pie(this.data));
		
		this.handles.attr(
	    "transform", 
		function(d,i){
			var angle = +d.startAngle;
			//console.log(angle);
	        return "rotate("+_self.rad2deg(angle)+")"
		})
		
					
		this.slices.select(".icongroup")
			.attr("transform", function(d) { //set the icon/label's origin to the center of the arc
				d.innerRadius = 0;
				d.outerRadius = r;
				var _scale = d.data.weight/_self.initScale;
				_scale = (_scale > 1) ? 1 : _scale;
				return "translate(" + _self.arc.centroid(d) + ") scale("+_scale+","+_scale+")";        //this gives us a pair of coordinates like [50, 50]
	        })
	
		this.foreignBody.select("h2")  //update label for each foreignBody
			.text(function(d, i) { return _self.data[i].weight.toFixed(2)+"%"; });        
	
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
			rate: averageRate.toFixed(2),
		});
		this.handles.call(this.drag);
				

}
