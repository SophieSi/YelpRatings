/**
 * Created by sophiasi on 4/16/17.
 */


TimeLine = function(_parentElement, _date_week, _stars,_fill){
    this.parentElement = _parentElement;
    this.date_week = _date_week;
    // No data wrangling, no update sequence
    this.stars = _stars;
    this.fill = _fill;
    // console.log(this.displayData);
    this.initVis();

}

/*
 * Initialize line chart
 */

TimeLine.prototype.initVis = function(){
    var vis = this; // read about the this


    vis.margin = {top: 10, right: 10, bottom: 150, left: 40},
        vis.margin2 = {top: 10, right: 10, bottom: 20, left: 40},
        vis.width = $("#" + vis.parentElement).width()  - vis.margin.left - vis.margin.right,
        vis.height = 150 - vis.margin.top - vis.margin.bottom,
        vis.height2 = 100 - vis.margin2.top - vis.margin2.bottom;


    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);


    vis.context = vis.svg.append("g")
        .attr("transform", "translate(" + vis.margin2.left + "," + vis.margin2.top + ")");


    vis.z = d3.scaleOrdinal([d3.rgb(0, 0, 255),'#e80d2e',d3.rgb(0,204,102)]);
    vis.z.domain(vis.stars.map(function(s) { return s.id; }));

    vis.x2 = d3.scaleTime()
        .domain(d3.extent(vis.date_week))
        .range([0, vis.width]);

    vis.y2 = d3.scaleLinear()
        .domain([0,5])
        .range([vis.height2, 0]);

    vis.xAxis2 = d3.axisBottom(vis.x2);
    vis.yAxis2 = d3.axisLeft(vis.y2)
        .ticks(5);

    //brush
    vis.brush = d3.brushX()
        .extent([[0, 0], [vis.width, vis.height2]])
        // .x(vis.x2);
        .on("brush end", brushed);

    //zoom
    // vis.zoom = d3.zoom()
    //     .scaleExtent([1, Infinity])
    //     .translateExtent([[0, 0], [vis.width, vis.height]])
    //     .extent([[0, 0], [vis.width, vis.height]])
    //     .on("zoom", zoomed);



    vis.line2 = d3.line()
        .x(function(d) { return vis.x2(d.date_week); })
        .y(function(d) { return vis.y2(d.stars); });


    vis.context.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height2 + ")")
        .call(vis.xAxis2);

    vis.fill_area  = d3.area()
        .x(function(d) { return vis.x2(d.date_week); })
        .y0(function(d) { return vis.y2(d.stars_low); })
        .y1(function(d) { return vis.y2(d.stars_up); });

    vis.context
        .append("g")
        .datum(vis.fill.values)
        .append("path")
        .attr("class","fill")
        .attr("d", vis.fill_area);

    vis.lines = vis.context.selectAll(".stars")
        .data(vis.stars)
        .enter().append("g")
        .attr("class", "stars");

    vis.lines
        .append("path")
        .attr("class", "lines")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", function(d) { return vis.line2(d.values); })
        .style("stroke", function(d) { return vis.z(d.id); });


    vis.context.append("g")
        .attr("class", "y-axis axis")
        .call(vis.yAxis2);
    //
    // vis.context
    //     .append("path")
    //     .datum(vis.stars[0].values)
    //     .attr("class","lines")
    //     .attr("fill", "none")
    //     .attr("stroke", "steelblue")
    //     .attr("stroke-linejoin", "round")
    //     .attr("stroke-linecap", "round")
    //     .attr("stroke-width", 1.5)
    //     .attr("d", vis.line2);

    // console.log("done creating object");

    // vis.createBrush();
    // console.log(vis.x.domain());

    vis.context.append("g")
        .attr("class", "brush")
        .call(vis.brush);
        // .call(brush.move, vis.x2.range());

}

TimeLine.prototype.onSelectionChange = function (rangeStart, rangeEnd) {
    var vis = this;
    // console.log(vis.x2);
    // console.log(rangeStart, rangeEnd);

    vis.context.select(".brush").call(vis.brush);


}


TimeLine.prototype.updateViz = function (t,x) {
    var vis = this;

    // vis.x2.domain(x.range().map(t.invertX, t));
    vis.context.select(".x-axis").call(vis.xAxis2);
    vis.context.select("path.lines").attr("d", function(d) { return vis.line2(d.values); });
    vis.context.selectAll(".fill").attr("d",vis.fill_area);
    vis.context.select(".brush").call(vis.brush.move, x.range().map(t.invertX, t));

}

// function brushed(){
//     // var selection = d3.event.selection;
//
//     if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;
//     var s = d3.event.selection || BSSM_LineChart.x2.range();
//     BSSM_LineChart.x.domain(s.map(BSSM_LineChart.x2.invert, BSSM_LineChart.x2));
//     BSSM_LineChart.focus.select(".lines").attr("d",BSSM_LineChart.line);
//     BSSM_LineChart.focus.select(".x-axis").call(BSSM_LineChart.xAxis);
//
//     BSSM_LineChart.svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
//         .scale(BSSM_LineChart.width / (s[1] - s[0]))
//         .translate(-s[0], 0));
//
//
// }




