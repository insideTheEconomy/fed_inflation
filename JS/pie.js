var w = 300,                        //width
h = 300,                            //height
r = 100,                            //radius
color = d3.scale.category20c();     //builtin range of colors



var inPie = function( _w, _h) {
	this.initScale = 1;
	this.icons = [];
	this.w = _w;
	this.h = _h;
	this.r = Math.min(this.w, this.h) / 2;
	this.offset = {x: this.w/2, y:this.h/2}
	this.textPad = 12;
	this.sliceScale = this.r;
	this.data = [{"label":"one", "value":1,"weight":2}, 
	        {"label":"two", "value":1,"weight":2}, 
	        {"label":"three", "value":2,"weight":2},{"label":"four", "value":3,"weight":2}]; 
}
inPp = inPie.prototype;

Object.defineProperty(inPp, "dataset",{
	get: function(){return this.data},
	set: function(ds){
		this.data = ds;
		console.log("DATASET RECEIVED");
		this.update();
		}});



inPp.build = function(sel, _data, _icons){
	this.icons = _icons;
	this.data = _data;
	var	_self = this;
	
	this.vis = d3.select(sel)
	    .append("svg:svg")              //create the SVG element inside the <body>
	        .attr("width", this.w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
	        .attr("height", this.w)
	
	this.svg = this.vis
	    .append("svg:g")                //make a group to hold our pie chart
	       .attr("transform", "translate(" + this.offset.x + "," + this.offset.y + ")")    //move the center of the pie chart from 0, 0 to radius, radius
			.attr("class","pie")
			_rad = this.r;

	this.arc = d3.svg.arc()              //this will create <path> elements for us using arc data
	    .outerRadius( this.r ).innerRadius(0);

	
	var initA;
	var lastA;
	var ev2point = function(ev){
//		console.log(ev);
		var pi = Math.PI;
		res = {}
		var mouse = {};
		mouse.x = ev.sourceEvent.clientX - _self.offset.x;
		mouse.y = ev.sourceEvent.clientY - _self.offset.y;
		res.mouse = mouse;
		res.radians = Math.atan2(res.mouse.y, res.mouse.x) + pi;
		res.deg = res.radians*(180/pi);
		return res;
	}
	
	function circleWrap( pt ){
		delta = pt - lastA;
		/*if(delta < 0){
			res = 360 + delta;
		}else{
			res = delta;
		}*/
		
		return delta;
	}	
	this.drag = d3.behavior.drag()
		.origin(null).on("dragstart", function(){
			initA = ev2point(d3.event).deg;
			lastA = initA;
			console.log("initial Angle :: "+initA);
		})
		.on("drag", function(d, i){
		//	var thisI = i;
			dData = _self.data;
		//	dData[+i].weight += (d3.event.dx-d3.event.dy)/100;
			
			var point = ev2point(d3.event);
			delta = point.deg - lastA;
			
			thisI = i;
			if(Math.abs(delta) < 10){
			dData.forEach(function(e, ei){
				check = (thisI == ei)
				dData[ei].weight += (check) ? delta/3.6 : -delta/3.6;
				
			})}
			
			
			_self.dataset = dData;	
		//	d3.select(".debug").text("delta: "+delta+"/ total :"+(dData[0].weight+dData[1].weight+dData[2].weight));
			lastA = point.deg;
		})	
		
	this.pie = d3.layout.pie()           //this will create arc data for us given a list of values
	    .value(function(d) { return d.weight; }).sort(null);    //we must tell it out to access the value of each element in our data array

	this.arcs = this.svg.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
	    .data(this.pie(this.data))     
	this.slices = this.arcs                     //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
	    .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
	        .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
	            .attr("class", "slice")
	
	
	
	
	this.arcs.call(this.drag);


	this.arcs.append("svg:path")
	            .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
	            .attr("d", this.arc)                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

	this.icongroup = this.slices.append("g").attr("class","icongroup").attr("id", function(d){return d.data.ser_id })   //allow us to style things in the slices (like text)
		.attr("transform", function(d) {                    //set the label's origin to the center of the arc
	            //we have to make sure to set these before calling arc.centroid
	            d.innerRadius = 0;
	            d.outerRadius = r;
	            return "translate(" + _self.arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
	        })
	this.icongroup.selectAll("path").attr("fill",null);
	this.scaleByWeight = function(d){
		var scale = +d.data.weight;
		scale /= 200;
		scale *= _self.sliceScale;
		return scale;
	}
			
	this.slices.each(function(d){
						_self.initScale = d.data.weight;
						document.getElementById(d.data.ser_id).appendChild(icons[d.data.ser_id]);
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
		"style":null
		
	});
	
	this.icongroup.append("svg:text")                                     //add a label to each slice
			.attr({
				"text-anchor":"middle",
				"class":"series_label",
				"y":function(d){ return _self.scaleByWeight(d)/2 + _self.textPad},
				"width":function(d){return _self.scaleByWeight(d)},
			})                //center the text on it's origin
	        .text(function(d, i) { return _self.data[i].program_name; });        //get the label from our original data array  */
		/*	this.arcs.select("svg")
				.attr("x",null).attr("y",null)
				.attr("x", function(d) {                    //set the label's origin to the center of the arc
		            //we have to make sure to set these before calling arc.centroid
		            d.innerRadius = 0;
		            d.outerRadius = r;
		            return  _self.arc.centroid(d)[0];        //this gives us a pair of coordinates like [50, 50]
		        }).attr("y", function(d) {                    //set the label's origin to the center of the arc
			            //we have to make sure to set these before calling arc.centroid
			            d.innerRadius = 0;
			            d.outerRadius = r;
			            return  _self.arc.centroid(d)[1];        //this gives us a pair of coordinates like [50, 50]
			        })*/

	
}

inPp.update = function(){


	_self = this;

		this.arcs    //this selects all <g> elements with class slice (there aren't any yet)
		    .data(this.pie(this.data))                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
		
		this.arcs.select("path")
		            .attr("d", this.arc)   //this creates the actual SVG path using the associated data (pie) with the arc drawing function
					.transition().duration(100)
					
		this.arcs.select(".icongroup")                                     //add a label to each slice
	            .attr("transform", function(d) {                    //set the label's origin to the center of the arc
	            //we have to make sure to set these before calling arc.centroid
	            d.innerRadius = 0;
	            d.outerRadius = r;
	            return "translate(" + _self.arc.centroid(d) + ") scale("+(d.data.weight/_self.initScale)+","+(d.data.weight/_self.initScale)+")";        //this gives us a pair of coordinates like [50, 50]
	        })
	
	/*	this.icongroup.select("svg").attr({
				"height":function( d){ return _self.scaleByWeight(d);},
				"width":function( d){ return _self.scaleByWeight(d);},
				"style":null

			});
			this.icongroup.select(".series_label")                                     //add a label to each slice
					.attr({
						"y":function(d){ return _self.scaleByWeight(d)/2},
						"x":0,
						"width":function(d){return _self.scaleByWeight(d)},
					})    
					*/            //center the text on it's origin
		var weightedSum = 0;
		
		this.data.forEach(function(d,i){
			
			var weightedValue = d.value * d.weight;
			console.log("weighted value :" +weightedValue);
			weightedSum += weightedValue;
		})
		console.log("sum :"+weightedSum);
		var averageRate = weightedSum / 100;
		console.log("average rate :"+averageRate);
		$.event.trigger({
					type: "RATE",
					rate: averageRate.toFixed(2),
				});

}

inPp.timeout = setTimeout(function(){
	
})
// Store the displayed angles in _current.
// Then, interpolate from _current to the new angles.
// During the transition, _current is updated in-place by d3.interpolate.
inPp.arcTween = function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}

inPp.randomize = function(){
	this.dataset = [{"label":"one", "value":Math.random()*99}, 
	        {"label":"two", "value":Math.random()*99}, 
	        {"label":"three", "value":Math.random()*99}];
}