/**
 * Created by sophiasi on 5/18/17.
 */
Compare = function(_parentElement, _data, _date_extend){

    this.parentElement = _parentElement;
    this.data = _data;
    this.date_extend = _date_extend;
    this.initVis();
    console.log(_data)

}
/*
 * Initialize Compare
 */
Compare.prototype.initVis = function() {
    var vis = this; // read about the this

    vis.margin = {top: 10, right: 300, bottom: 30, left: 30},
        vis.width = $("#" + vis.parentElement).width()  - vis.margin.left - vis.margin.right,
        vis.height = 400 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

    vis.g = vis.svg.append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    // console.log(vis.date_extend);
    vis.x = d3.scaleTime()
        .domain([vis.date_extend[0], vis.date_extend[1]])
        .range([0, vis.width]);

    vis.y = d3.scaleLinear()
        .domain([0,5])
        .range([vis.height, 0]);

    vis.xAxis = d3.axisBottom(vis.x);
        // .ticks(10);
        // .tickFormat(d3.timeFormat("%Y"));

    // console.log(vis.x(vis.data[0].date_week[0]));



    vis.yAxis = d3.axisLeft(vis.y)
        .ticks(5);

    vis.colors = d3.schemeCategory10;


    vis.gX = vis.g.append('g')
        .attr("class", "x-axis axis")
        .attr("transform","translate(0," + vis.height + ")")
        .call(vis.xAxis);

    vis.g.append("g")
        .attr("class", "y-axis axis")
        .call(vis.yAxis);

    vis.line = d3.line()
        .x(function(d) { return vis.x(d.date_week); })
        .y(function(d) { return vis.y(d.stars); });


    vis.g.selectAll('.line') // em_stars
        .data(vis.data)
        .enter()
        .append('path')
        .attr('class', 'lines')
        .attr("fill", "none")
        // .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .style('stroke', function(d,i) {
            // console.log(vis.colors[2]);
            return vis.colors[i];
        })
        // .attr("fill","none")
        // .attr('clip-path', 'url(#clip)')
        .attr('d', function(d) {
            return vis.line(d.values);
        })


    //zoom
    vis.zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [vis.width, vis.height]])
        .extent([[0, 0], [vis.width, vis.height]])
        .on("zoom", zoomedCompare);


    vis.g.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", vis.width)
        .attr("height", vis.height);

    vis.g.append("rect")
        .attr("class", "zoom")
        .attr("width", vis.width)
        .attr("height", vis.height)
        // .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")")
        .call(vis.zoom);

    //append text
    vis.g
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("EM Stars");

    //append legend
    vis.legend = vis.g.append("g")
        .attr("transform", "translate(" + 870 + "," + 100 + ")");

    vis.legend
        .selectAll("circle")
       .data(vis.data)
        .enter()
        .append("circle")
        .attr("cx", 0)
        .attr("cy", function (d,i) {
            return 30 * i
        })
        .attr("r", 10)
        .attr("fill", function (d, i) {
            return vis.colors[i]
        });


    vis.legend
        .selectAll("text")
        .data(vis.data)
        .enter()
        .append("text")
        .text(function (d) {
            return d.name + "  " + d.last_star.toFixed(2)
        })
        .attr("x",40)
        .attr("y", function (d,i) {
            return 30 * i
        });

}

