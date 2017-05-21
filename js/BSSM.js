/**
 * Created by sophiasi on 4/16/17.
 */

/*
 * Timeline - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the
 */

BSSM = function(_parentElement, _date_week, _stars, _fill){

    this.parentElement = _parentElement;
    this.date_week = _date_week;
    // No data wrangling, no update sequence
    this.stars = _stars;
    this.fill = _fill;
    // console.log(this.displayData);
    this.initVis();
    // console.log(this.stars);
    // console.log(this.fill);

}

/*
 * Initialize line chart
 */

BSSM.prototype.initVis = function(){
    var vis = this; // read about the this

    vis.margin = {top: 10, right: 10, bottom: 20, left: 40},
        // vis.margin2 = {top: 300, right: 10, bottom: 20, left: 40},

        vis.width = $("#" + vis.parentElement).width()  - vis.margin.left - vis.margin.right,
        // vis.width = 500 - vis.margin.left - vis.margin.right,
        vis.height = 250 - vis.margin.top - vis.margin.bottom,
        // console.log($("#" + vis.parentElement).width());
        // vis.height2 = 400 - vis.margin2.top - vis.margin2.bottom;


    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);


    vis.svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", vis.width)
        .attr("height", vis.height);


    vis.focus = vis.svg
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    // axis and scales
    vis.x = d3.scaleTime()
        .domain(d3.extent(vis.date_week))
        .range([0, vis.width]);


    vis.y = d3.scaleLinear()
        .domain([0,5])
        .range([vis.height, 0]);


    vis.z = d3.scaleOrdinal([d3.rgb(0, 0, 255),'#e80d2e',d3.rgb(0,204,102)]);
    vis.z.domain(vis.stars.map(function(s) { return s.id; }));
    vis.xAxis = d3.axisBottom(vis.x);

    vis.yAxis = d3.axisLeft(vis.y)
        .ticks(5);

    //zoom
    vis.zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [vis.width, vis.height]])
        .extent([[0, 0], [vis.width, vis.height]])
        .on("zoom", zoomed);

    //append axis
    vis.focus.append('g')
        .attr("class", "x-axis axis")
        .attr("transform","translate(0," + vis.height + ")")
        .call(vis.xAxis);

    vis.focus.append("g")
        .attr("class", "y-axis axis")
        .call(vis.yAxis);

    //define path
    vis.line = d3.line()
        .x(function(d) { return vis.x(d.date_week); })
        .y(function(d) { return vis.y(d.stars); });

    vis.fill_area  = d3.area()
        .x(function(d) { return vis.x(d.date_week); })
        .y0(function(d) { return vis.y(d.stars_low); })
        .y1(function(d) { return vis.y(d.stars_up); });


    vis.focus
        .append("g")
        .datum(vis.fill.values)
        .append("path")
        .attr("class","fill")
        .attr("d", vis.fill_area);


    // console.log(vis.stars);
    vis.lines = vis.focus.selectAll(".stars")
        .data(
            vis.stars.filter(function (d) {
                if (d.id == "em_star" || d.id == "cum_star"){
                    return d
                }
            })
        )
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
        .attr("d", function(d) {
            if (d.id == "em_star" || d.id == "cum_star"){
                return vis.line(d.values);
            }
        })
        .style("stroke", function(d) { return vis.z(d.id); });

    //add hier dots
    // vis.dots = vis.focus.append("g")
    //     .attr("class","dot_canvas")
    //     .selectAll(".dot")
    //     .data(
    //         vis.stars.filter(function (d) {
    //             return d.id == "hier_post_mean";
    //         })['0'].values
    //     )
    //     .enter()
    //     .append("circle")
    //     .attr("class","dot");




    vis.focus.append("rect")
        .attr("class", "zoom")
        .attr("width", vis.width)
        .attr("height", vis.height)
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")")
        .call(vis.zoom);

    // console.log("done creating object");

    vis.updateViz();
}
BSSM.prototype.updateViz = function(s){
    var vis = this;
    // vis.dots
    //     .attr("r", 1)
    //     .attr("cx", function(d) {
    //         // console.log(d)
    //         // console.log(vis.x(d.date_week));
    //         return vis.x(d.date_week);
    //     })
    //     .attr("cy", function(d) {
    //         return vis.y(d.stars);
    //     });
}

BSSM.prototype.updateZoom = function(s){
    var vis = this;
    vis.focus.select(".zoom").call(vis.zoom.transform, d3.zoomIdentity
        .scale(vis.width / (s[1] - s[0]))
        .translate(-s[0], 0));


}





