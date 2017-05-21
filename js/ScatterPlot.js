    /**
 * Created by sophiasi on 5/6/17.
 */
ScatterPlot = function(_parentElement, _title){

    this.parentElement = _parentElement;
    this.data;
    this.title = _title;
    this.initVis();

}
/*
 * Initialize ScatterPlot
 */

ScatterPlot.prototype.initVis = function() {
    var vis = this; // read about the this

    // console.log(vis.data);
    vis.margin = {top: 10, right: 0, bottom: 10, left: 30},
        // vis.margin2 = {top: 300, right: 10, bottom: 20, left: 40},

        vis.width = 220  - vis.margin.left - vis.margin.right,
        vis.height = 450 - vis.margin.top - vis.margin.bottom,


        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom);


    vis.g = vis.svg.append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    vis.g.append('text')
        .text(vis.title)
        .style("cursor", "pointer")
        .style("font-size", 18)
        .attr("fill", "#2C3E50")
        .attr("text-anchor","middle")
        // .attr("class","title")
        .attr("transform", "translate(" + vis.width/2+ "," + vis.height + ")")
        .on("click",function(d){
            // console.log("click");
            loadData(type_dict[vis.title]);

        })
        .on("mouseover", function (d) {
            d3.select(this)
                .attr("fill", "rgb(255, 0, 0)")
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .attr("fill", "#2C3E50")
        });




    vis.colorScale = d3.scaleLinear()
        .domain([0, 2.5,5])
        .range(["rgb(0, 0, 0)", "rgb(128, 64, 64)", "rgb(255, 0, 0)"]);

    vis.cell = vis.g.append("g")
        .attr("class", "cells");
    //


    vis.yv = d3.scaleLinear()
        .range([vis.height, 0])
        .domain([0, 5.2]); //to avoid error cause by 5

    vis.xv = d3.scaleLinear()
        .range([ 0, vis.width])
        .domain([0,80]) // the largest possible number
        .nice();


    vis.violin = vis.g.append("g")
        .attr("class", "violin");
        // .attr("transform","translate(100, " + 0 + ")");

    vis.violin.append("g")
        .attr("class","axis")
        .attr("transform","translate(0, " + vis.height + ")");
        // .call(d3.axisBottom(vis.xv).ticks(10));


    if (vis.parentElement == 'all_res'){
        vis.violin.append("g")
            .attr("class","axis")
            .attr("transform","translate(0, " + 0 + ")")
            .call(d3.axisLeft(vis.yv).ticks(10))
            .select(".domain")
            .remove();

        vis.violin
            .append('g')
            .attr("transform","translate(0, " + 0 + ")")
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("EM Stars");
    }
    else {
        // vis.violin.append("g")
        //     .attr("class","axis")
        //     .attr("transform","translate(0, " + 0 + ")");
    }


    vis.gPlus = vis.violin.append("g");
    vis.gMinus = vis.violin.append("g");

    vis.gPlus.line = vis.gPlus.append("path");
    vis.gMinus.line =  vis.gMinus.append("path");

    vis.gPlus.area = vis.gPlus.append("path");
    vis.gMinus.area =  vis.gMinus.append("path");

}


ScatterPlot.prototype.updateVisViolin =  function (_newData) {

    var vis =  this;

    vis.len = _newData.length;


    vis.resolution = Math.floor((d3.max(_newData, function (d) {return d})
        - d3.min(_newData, function (d) {return d}))/0.25);


    var histogram = d3.histogram()
        .domain([d3.min(_newData, function (d) {
            return d
        }) , d3.max(_newData, function (d) {
            return d
        }) ])
        .thresholds(vis.resolution);

    vis.data2 = histogram(_newData);


    vis.area = d3.area()
        .curve(d3.curveCardinal)
        .y(function(d) {
            return vis.yv((d.x0 + d.x1)/2)
        })
        .x0(vis.xv(0))
        .x1(function(d) { return vis.xv(d.length); });

    vis.line = d3.line()
        .curve(d3.curveCatmullRom)
        .x(function(d) {
            return vis.xv(d.length);
        })
        .y(function(d) { return vis.yv((d.x0 + d.x1)/2); });




    vis.gPlus.area
        .datum(vis.data2)
        .transition()
        .duration(120)
        .attr("class", "area")
        .attr("d", vis.area)
        .style("fill", '#ccc');

    vis.gMinus.area
        .datum(vis.data2)
        .transition()
        .duration(120)
        .attr("class", "area")
        .attr("d", vis.area)
        .style("fill", '#ccc');



    vis.gPlus.attr("transform", "rotate(0,0,0)  translate(" + 100 + ",0)");
    vis.gMinus.attr("transform", "rotate(180,0,0) scale(1,-1) translate( -" + 100 + ",0)");





}

ScatterPlot.prototype.updateVis = function(_newData) {
    var vis = this;

    vis.data = _newData;

    // console.log(vis.data);

    vis.simulation = d3.forceSimulation(vis.data)
        .force("y", d3.forceY(function(d) { return vis.yv(d.value); }).strength(1))
        .force("x", d3.forceX(100))
        .force("collide", d3.forceCollide(4))
        .stop();


    for (var i = 0; i < 200; ++i) vis.simulation.tick();


    var plot = vis.g.selectAll("circle")
        .data(
            d3.voronoi()
                .extent([[vis.margin.left, vis.margin.top], [vis.width + vis.margin.right, vis.height + vis.margin.top]]
                )
                .x(function(d) { return d.x; })
                .y(function(d) { return d.y; })
                .polygons(vis.data)
        );


    plot
        .exit()
        .transition()
        .duration(100)
        .style('opacity', 1e-6)
        .remove();


    plot.enter()
        .append("g")
        .attr("class","dots")
        .append("circle")
        .attr("r", 3)
        .attr("cx", function(d) { return d.data.x; })
        .attr("cy", function(d) { return d.data.y; })
        .attr("fill", function (d,i) {
            // console.log(vis.data[i])
            return vis.colorScale(vis.data[i].value)
        });


    plot
        .attr("r", 3)
        .attr("cx", function(d) { return d.data.x; })
        .attr("cy", function(d) { return d.data.y; })
        .attr("fill", function (d,i) {
            return vis.colorScale(vis.data[i].value)
        });

}

