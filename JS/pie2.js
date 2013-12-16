var w = 300,                        //width
h = 300,                            //height
r = 100,                            //radius
color = d3.scale.category20c();     //builtin range of colors



var inPie = function() {
	this.w = 300;
	this.h = 400;
	this.r = 100;
	this.data = [{"label":"one", "value":10}, 
	        {"label":"two", "value":10}, 
	        {"label":"three", "value":40}]; 
}

inPp = inPie.prototype;
inPp.makePie = function(){	
this.pie = d3.layout.pie()
    .value(function(d) { return d.value; })
    .sort(null);

this.arc = d3.svg.arc()
    .innerRadius(this.r - 100)
    .outerRadius(this.r - 20);

this.svg = d3.select("body").append("svg")
    .attr("width", this.w)
    .attr("height", this.h)
  	.append("g")
    .attr("transform", "translate(" + this.w / 2 + "," + this.w / 2 + ")");



	this.path = this.svg.datum(this.data).selectAll("path")
      .data(this.pie)
    .enter().append("path")
      .attr("fill", function(d, i) { return this.color(i); })
      .attr("d", this.arc)
      .each(function(d) { this._current = d; }); // store the initial angles
}

inPp.change =  function() {
    var value = this.value;
    this.path = this.path.data(pie); // compute the new angles
    this.path.transition().duration(750).attrTween("d", this.arcTween); // redraw the arcs
 }




// Store the displayed angles in _current.
// Then, interpolate from _current to the new angles.
// During the transition, _current is updated in-place by d3.interpolate.
inPp.arcTween = function(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}