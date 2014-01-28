var w=300,h=300,r=100,color=d3.scale.category20c(),inPie=function(e,t){this.maxIconScale=1.5;this.initScale=1;this.icons=[];this.w=e;this.h=t;this.r=Math.min(this.w,this.h)/2;this.offset={x:this.w/2,y:this.h/2};this.textPad=12;this.sliceScale=this.r;this.startAngle=0;this.offset.angle=0;this.segProp={r:this.r-12};this.precision=1};inPp=inPie.prototype;Object.defineProperty(inPp,"dataset",{get:function(){return this.data},set:function(e){this.data=e;this.update()}});inPp.rad2deg=function(e){return+e*(180/Math.PI)};inPp.deg2rad=function(e){return+e*(Math.PI/180)};inPp.build=function(e,t,n){var r=this;this.icons=n;this.data=t;this.vis=d3.select(e).append("svg:svg").data([this.data]).attr("width",this.w).attr("height",this.w);this.svg=this.vis.append("svg:g").attr("transform","translate("+this.offset.x+","+this.offset.y+")").attr("class","pie");_rad=this.r;this.sliceGroup=this.svg.append("g");this.arc=d3.svg.arc().outerRadius(this.r).innerRadius(90);this.pie=d3.layout.pie().value(function(e){return e.weight}).sort(null);this.slices=this.sliceGroup.selectAll("g.slice").data(this.pie).enter().append("svg:g").attr("class","slice");this.buildLabels();this.buildIcongroups();this.buildHandles();this.dragProp={w:100,h:100,off:50};var i,s;this.drag=d3.behavior.drag().origin(null).on("dragstart",function(){i=r.rad2deg(d.startAngle);s=i}).on("drag",function(e,t){dData=r.data;var n=o(d3.event);delta=n.deg-s;thisI=t;var i=Math.abs(delta)<10;if(i){var u=thisI==0?dData.length-1:thisI-1,a=delta>0?!0:!1;if(dData[thisI].weight<=6&&a)return!1;if(dData[u].weight<=6&&!a)return!1;thisI==0&&(r.offset.angle+=r.deg2rad(delta));deltaPercentage=delta/3.6;dData[t].weight+=-deltaPercentage;dData[u].weight+=deltaPercentage;r.handles.each(function(e,t){if(thisI==t){d3.select(this).selectAll(".arrow.right").classed("active",a);d3.select(this).selectAll(".arrow.left").classed("active",!a)}});r.dataset=dData}s=n.deg}).on("dragend",function(){d3.select(this).selectAll(".arrow").classed("active",!1)});var o=function(e){var t=Math.PI;res={};var n={},i={};i.x=e.sourceEvent.clientX;i.y=e.sourceEvent.clientY;n.x=e.sourceEvent.clientX-r.offset.x+16;n.y=e.sourceEvent.clientY-r.offset.y+32;res.x=+e.x;res.y=+e.y;res.client=i;res.mouse=n;res.radians=Math.atan2(res.y,res.x)+t;res.deg=res.radians*(180/t);return res};this.handles.call(this.drag)};inPp.update=function(){var e=this,t=2;this.slices.data(this.pie);this.updateSegs();this.handles.data(this.pie);this.perc.data(this.pie);this.sliceGroup.attr("transform",function(t,n){return"rotate("+e.rad2deg(e.offset.angle)+")"});this.handles.attr("transform",function(t,n){var r=+t.startAngle+e.offset.angle;return"rotate("+e.rad2deg(r)+")"});this.perc.attr({transform:function(t,n){_c=t.endAngle-t.startAngle;console.log("_c: "+_c);var r=t.startAngle+_c/2+e.offset.angle;console.log("angle "+r);return"rotate("+e.rad2deg(r)+") translate( 0 "+(-e.r+24)+")"}});this.perc.selectAll(".percentage").text(function(t){return t.data.weight.toFixed(e.precision)+"%"});this.slices.select(".icongroup").attr("transform",function(t){t.innerRadius=0;t.outerRadius=r;var n=t.data.weight/e.initScale;n=n>1?1:n<.5?.5:n;return"translate("+e.arc.centroid(t)+") scale("+n+","+n+") rotate("+e.rad2deg(-e.offset.angle)+")"});this.foreignRate.attr("transform",function(t){t.innerRadius=0;t.outerRadius=r;return"translate("+e.arc.centroid(t)+")"});this.foreignBody.select(".weight").text(function(t,n){return e.data[n].weight.toFixed(e.precision)+"%"});var n=0,i="",s="";this.data.forEach(function(e,t){var r=e.value*e.weight;i+=e.value+",";n+=r});var o=n/100;$.event.trigger({type:"RATE",rate:o.toFixed(e.precision)})};inPp.buildHandles=function(){var e=this;this.handles=this.svg.selectAll("g.handles").data(this.pie).enter().append("g");this.handles.attr({"class":"handles",transform:function(t,n){var r=+t.startAngle;return"rotate("+e.rad2deg(r)+")"}}).append("line").attr({x1:0,y1:0,x2:0,y2:-e.r,"class":"handle bar"});var t=12,n=24,r=2,i=-(this.r-t);this.handles.append("circle").attr({cy:i,r:30,"class":"handleArea"});this.polyR=[{x:r,y:i-t},{x:r,y:i+t},{x:r+n,y:i}];this.polyL=[{x:-r,y:i-t},{x:-r,y:i+t},{x:-r-n,y:i}];this.handles.append("polygon").attr("points",function(t){return e.polyR.map(function(e){return[e.x,e.y].join(" ")}).join(",")}).attr("class","handle arrow right");this.handles.append("polygon").attr("points",function(t){return e.polyL.map(function(e){return[e.x,e.y].join(" ")}).join(",")}).attr("class","handle arrow left");this.handles.attr("filter","url(#glowie)");this.buildSegs()};inPp.buildLabels=function(){var e=this;this.perc=this.svg.selectAll("g.perc").data(this.pie).enter().append("g");this.perc.attr({"class":"perc",transform:function(t,n){_c=t.endAngle-t.startAngle;console.log("_c: "+_c);var r=t.startAngle+_c/2;t.midAngle=r;console.log("angle "+r);return"rotate("+e.rad2deg(r)+") translate( 0 "+(-e.r+24)+")"}}).append("text").attr("class","percentage").attr("text-anchor","middle").text(function(t){return t.data.weight.toFixed(e.precision)+"%"}).attr("transform",function(t){_c=t.endAngle-t.startAngle;check=(e.rad2deg(t.midAngle)+90)%360>=180;_ro=check?180:0;_off=check?18:0;return"rotate("+_ro+") translate( 0 "+_off+")"})};inPp.buildIcongroups=function(){var e=100,t=100,n=e*1.5,i=t*1.5,s=e/2,o=t/2,u=n/2,a=i/2,f=25,l=0,c=6;_self=this;this.icongroup=this.slices.append("g").attr("class","icongroup").attr("id",function(e){return e.data.ser_id}).attr("transform",function(e){e.innerRadius=0;e.outerRadius=r;return"translate("+_self.arc.centroid(e)+")"});this.foreignRate=this.slices.append("foreignObject").attr({width:e,height:t,x:-s,y:-t}).attr("transform",function(e){e.innerRadius=0;e.outerRadius=r;return"translate("+_self.arc.centroid(e)+")"});this.rateBody=this.foreignRate.append("xhtml:body").attr("class","foreign");this.rateLabel=this.rateBody.append("div").attr({"class":"series rate"}).style({height:t}).append("h2").text(function(e,t){var n=+e.data.value;n=+n;n=n.toFixed(_self.precision);return n+"%"});this.slices.each(function(e){_self.initScale=e.data.weight;document.getElementById(e.data.ser_id).appendChild(_self.icons[e.data.ser_id])});this.icongroup.select("svg").attr({x:-s,y:-o-f,transform:null,height:e,width:t,style:null,version:null}).append("rect").attr({width:e,height:t,fill:"#ffee00","class":"handleArea"});this.icongroup.each(function(e){e.rateMode=!1});this.foreignBody=this.icongroup.append("foreignObject").attr({"class":"foreignBody",width:n,height:o,x:-u,y:o,style:"color:white"}).append("xhtml:body").attr("class","foreign");this.foreignBody.append("p").attr({"class":"series label"}).style("margin-top",c).text(function(e,t){return _self.data[t].program_name})};inPp.calcSegs=function(){this.slices.each(function(e){_pad=_self.deg2rad(6);_start=e.startAngle+_pad;_end=e.endAngle-_pad;_size=_end-_start;_steps=Math.floor(_self.rad2deg(_size)/2);_step=(_end-_start)/_steps;var t=d3.range(_steps+1).map(function(e){return e*_step+_start});e.angles=t})};inPp.buildSegs=function(){this.calcSegs();this.segLine=d3.svg.line.radial().interpolate("cardinal").radius(this.segProp.r).angle(function(e,t){return e});this.segs=this.slices.append("g").attr("class","segments");this.segs.datum(function(e){return e.angles});this.segs.append("path").attr("class","seg").attr("d",this.segLine).attr("stroke-dasharray","5,5")};inPp.updateSegs=function(){this.calcSegs();_segs=this.slices.select(".segments").attr("class","segments").datum(function(e){return e.angles});_segs.select(".seg").attr("d",this.segLine).attr("stroke-dasharray","5,5")};inPp.addClickHandlers=function(){console.log("adding click handlers");this.slices.on("click",function(e,t){console.log("Click!");e.rateMode=!e.rateMode;$this=$(this);$this.find(".series.rate").toggleClass("inactive");_self.update()})};