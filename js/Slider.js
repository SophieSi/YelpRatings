/**
 * Created by sophiasi on 5/7/17.
 */
Slider = function(_parentElement,_data){

    this.parentElement = _parentElement;
    this.data = _data;

    // console.log(this.data);
    this.initVis();

}
/*
 * Initialize ScatterPlot
 */

Slider.prototype.initVis = function() {
    var vis = this; // read about the this




    vis.margin = {right: 20, left: 50, top:10, bottom: 20},
        vis.width = 1000 - vis.margin.left - vis.margin.right,
        vis.height = 100 - vis.margin.top - vis.margin.bottom,
        vis.textWidth = vis.width - 65;


    vis.svg = vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);



    // console.log();
    vis.x = d3.scaleTime()
        .domain(vis.data)
        .range([0, vis.width])
        .clamp(true);
        // .round(d3.timeDay, 7);
        // .nice(d3.timeDay.ev  ery(7).range(d3.extent(vis.data)[0], d3.extent(vis.data)[1]));

    // vis.xAxis = d3.axis.scale(vis.x);

    vis.slider = vis.svg.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.height / 2 + ")");

    vis.text = vis.slider
        .append("text")
        .attr("class","timeLabel")
        .attr("transform", "translate(" + vis.textWidth + ", -" + 20 + ")")
        .attr("fill","grey");

    vis.slider.append("line")
        .attr("class", "track")
        .attr("x1", vis.x.range()[0])
        .attr("x2", vis.x.range()[1])
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(d3.drag()
            .on("start.interrupt", function() { vis.slider.interrupt(); })
            .on("start drag", function() { update(vis.x.invert(d3.event.x)); }));


    // console.log(d3.timeYear.every(1).range(d3.extent(vis.data)[0], d3.extent(vis.data)[1]));
    vis.slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
        .selectAll("text")
        .data(d3.timeYear.every(1).range(vis.data[0], vis.data[1]))
        .enter().append("text")
        .attr("x", vis.x)
        .attr("text-anchor", "middle")
        .text(function(d) { return d3.timeFormat("%Y")(d) });
        // .text(function(d) { return d3.timeFormat("%Y")(d3.timeMonday.round((d))) });

    vis.handle = vis.slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);

    vis.slider.transition() // Gratuitous intro!
        .duration(50)
        .tween("hue", function() {

        });

}

// Slider.prototype.updateVis = function(h) {
//     var vis = this;
//     handle.attr("cx", vis.x(h));
//     // svg.style("background-color", d3.hsl(h, 0.8, 0.8));
// }