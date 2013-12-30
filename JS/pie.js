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
	    .outerRadius( this.r ).innerRadius(0);

	

		
	this.pie = d3.layout.pie()           //this will create arc data for us given a list of values
	    .value(function(d) { return d.weight; }).sort(null);    //we must tell it out to access the value of each element in our data array

	this.slices = this.svg.selectAll("g.slice")     
		.data(this.pie(this.data))     //bind data to the pie layout            
		.enter()                          
		.append("svg:g")                
		.attr("class", "slice")
	

	
	this.slices.append("svg:path")
	            .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
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
			}).text(function(d, i) { return +_self.data[i].weight.toFixed(2); });        //get the label from our original data array  */
			var initA;
			var lastA;
			
			
		//set up custom drag action
		this.drag = d3.behavior.drag()
			.origin(null).on("dragstart", function(){
				initA = ev2point(d3.event).deg;
				lastA = initA;
				console.log("initial Angle :: "+initA);
			})
			.on("drag", function(d, i){
				dData = _self.data;
				var point = ev2point(d3.event);
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
			})	
			//helper function for drag 
			//using d3 drag event, return a point and rad/deg rotation around the origin
		var ev2point = function(ev){
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
		
		this.slices.call(this.drag);

}

inPp.update = function(){
	var _maxScale = 2;


	_self = this;

		this.slices    
		    .data(this.pie(this.data)) //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
		
		this.slices.select("path")
		            .attr("d", this.arc)   //this creates the actual SVG path using the associated data (pie) with the arc drawing function
					.transition().duration(100)
					
		this.slices.select(".icongroup")
			.attr("transform", function(d) { //set the icon/label's origin to the center of the arc
				//we have to make sure to set these before calling arc.centroid
				d.innerRadius = 0;
				d.outerRadius = r;
				var _scale = d.data.weight/_self.initScale;
				return "translate(" + _self.arc.centroid(d) + ") scale("+_scale+","+_scale+")";        //this gives us a pair of coordinates like [50, 50]
	        })
	
		this.foreignBody.select("h2")  //update label for each foreignBody
			.text(function(d, i) { return +_self.data[i].weight.toFixed(2); });        
	
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
