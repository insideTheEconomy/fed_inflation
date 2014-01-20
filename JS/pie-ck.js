var w=300,h=300,r=100,color=d3.scale.category20c(),inPie=function(e,t){this.maxIconScale=1.5;this.initScale=1;this.icons=[];this.w=e;this.h=t;this.r=Math.min(this.w,this.h)/2;this.offset={x:this.w/2,y:this.h/2};this.textPad=12;this.sliceScale=this.r;this.startAngle=0;this.offset.angle=0};inPp=inPie.prototype;Object.defineProperty(inPp,"dataset",{get:function(){return this.data},set:function(e){this.data=e;this.update()}});inPp.rad2deg=function(e){return+e*(180/Math.PI)};inPp.deg2rad=function(e){return+e*(Math.PI/180)};inPp.build=function(e,t,n){this.icons=n;this.data=t;var i=this;this.vis=d3.select(e).append("svg:svg").data([this.data]).attr("width",this.w).attr("height",this.w);this.svg=this.vis.append("svg:g").attr("transform","translate("+this.offset.x+","+this.offset.y+")").attr("class","pie");_rad=this.r;this.sliceGroup=this.svg.append("g");this.arc=d3.svg.arc().outerRadius(this.r).innerRadius(90);this.pie=d3.layout.pie().value(function(e){return e.weight}).sort(null);this.slices=this.sliceGroup.selectAll("g.slice").data(this.pie).enter().append("svg:g").attr("class","slice");this.handles=this.svg.selectAll("g.handles").data(this.pie).enter().append("g");this.handles.attr({"class":"handles",transform:function(e,t){var n=+e.startAngle;return"rotate("+i.rad2deg(n)+")"}}).append("line").attr({x1:0,y1:0,x2:0,y2:-i.r,"class":"handle bar"});var s=12,o=24,u=2,a=-(this.r-s);this.handles.append("circle").attr({cy:a,r:30,"class":"handleArea"});this.polyR=[{x:u,y:a-s},{x:u,y:a+s},{x:u+o,y:a}];this.polyL=[{x:-u,y:a-s},{x:-u,y:a+s},{x:-u-o,y:a}];this.handles.append("polygon").attr("points",function(e){return i.polyR.map(function(e){return[e.x,e.y].join(" ")}).join(",")}).attr("class","handle arrow right");this.handles.append("polygon").attr("points",function(e){return i.polyL.map(function(e){return[e.x,e.y].join(" ")}).join(",")}).attr("class","handle arrow left");this.handles.attr("filter","url(#glow)");this.slices.append("svg:path").attr("fill",function(e,t){return null}).style("fill-opacity","0").attr("d",this.arc);this.icongroup=this.slices.append("g").attr("class","icongroup").attr("id",function(e){return e.data.ser_id}).attr("transform",function(e){e.innerRadius=0;e.outerRadius=r;return"translate("+i.arc.centroid(e)+")"});this.scaleByWeight=function(e){var t=+e.data.weight;t/=100;t*=i.sliceScale;return t};this.slices.each(function(e){var t=function(e){var t=document.createElement("g");e=e.cloneNode(!0);while(e.firstChild)t.appendChild(e.firstChild);return t};i.initScale=e.data.weight;document.getElementById(e.data.ser_id).appendChild(i.icons[e.data.ser_id])});this.icongroup.select("svg").attr({x:function(e){return-i.scaleByWeight(e)/2},y:function(e){return-i.scaleByWeight(e)},transform:null,height:function(e){return i.scaleByWeight(e)},width:function(e){return i.scaleByWeight(e)},style:null,version:null});this.icongroup.each(function(e){e.rateMode=!1});var f=50;this.foreignBody=this.icongroup.append("foreignObject").attr({"class":"foreignBody",width:function(e){return i.scaleByWeight(e)*1.5},height:"260px",x:function(e){return-i.scaleByWeight(e)/2*1.5},y:function(e){return-i.scaleByWeight(e)-f},style:"color:white"}).append("xhtml:body").attr("class","foreign");this.rateLabel=this.foreignBody.append("div").attr({"class":"series rate inactive",style:function(e){return"height: "+f}}).append("h2").text(function(e,t){console.log("series_rate");console.log(e);return e.data.value+"%"});this.foreignBody.append("p").attr({"class":"series label"}).style("margin-top",function(e){return i.scaleByWeight(e)}).text(function(e,t){return i.data[t].program_name});this.weightLabel=this.foreignBody.append("h2").attr({"class":"series weight"}).text(function(e,t){return i.data[t].weight.toFixed(0)+"%"});var l,c,l,c;this.dragProp={w:100,h:100,off:50};this.drag=d3.behavior.drag().origin(null).on("dragstart",function(){l=h(d3.event).deg;c=l}).on("drag",function(e,t){dData=i.data;var n=h(d3.event);delta=n.deg-c;thisI=t;if(Math.abs(delta)<10){t==0&&(i.offset.angle+=i.deg2rad(delta));var r=delta>0?!0:!1;deltaPercentage=delta/3.6;var s=thisI==0?dData.length-1:thisI-1;dData[t].weight+=-deltaPercentage;dData[s].weight+=deltaPercentage;i.handles.each(function(e,t){if(thisI==t){d3.select(this).selectAll(".arrow.right").classed("active",r);d3.select(this).selectAll(".arrow.left").classed("active",!r)}});i.dataset=dData}c=n.deg}).on("dragend",function(){d3.select(this).selectAll(".arrow").classed("active",!1)});var h=function(e){var t=Math.PI;res={};var n={},r={};r.x=e.sourceEvent.clientX;r.y=e.sourceEvent.clientY;n.x=e.sourceEvent.clientX-i.offset.x+16;n.y=e.sourceEvent.clientY-i.offset.y+32;res.x=+e.x;res.y=+e.y;res.client=r;res.mouse=n;res.radians=Math.atan2(res.y,res.x)+t;res.deg=res.radians*(180/t);return res};this.handles.call(this.drag)};inPp.update=function(){var e=2;_self=this;this.slices.data(this.pie);this.slices.select("path").attr("d",this.arc);this.handles.data(this.pie);this.sliceGroup.attr("transform",function(e,t){return"rotate("+_self.rad2deg(_self.offset.angle)+")"});this.handles.attr("transform",function(e,t){var n=+e.startAngle+_self.offset.angle;return"rotate("+_self.rad2deg(n)+")"});this.slices.select(".icongroup").attr("transform",function(e){e.innerRadius=0;e.outerRadius=r;var t=e.data.weight/_self.initScale;t=t>1?1:t;return"translate("+_self.arc.centroid(e)+") scale("+t+","+t+") rotate("+_self.rad2deg(-_self.offset.angle)+")"});this.foreignBody.select(".weight").text(function(e,t){return _self.data[t].weight.toFixed(2)+"%"});var t=0,n="",i="";this.data.forEach(function(e,r){var i=e.value*e.weight;n+=e.value+",";t+=i});var s=t/100;$.event.trigger({type:"RATE",rate:s.toFixed(2)});this.handles.call(this.drag)};inPp.addClickHandlers=function(){this.icongroup.on("click",function(e,t){e.rateMode=!e.rateMode;$this=$(this);$(this).find(".series").toggleClass("inactive")})};