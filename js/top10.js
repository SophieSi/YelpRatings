/**
 * Created by sophiasi on 5/8/17.
 */


top10 = function(_parentElement){

    this.parentElement = _parentElement;
    // this.data = _data;

    // console.log(this.data);
    this.initVis();

}
/*
 * Initialize ScatterPlot
 */

top10.prototype.initVis = function() {
    var vis = this; // read about the this


    vis.margin = {top: 20, right: 0, bottom: 10, left: 40},
        // vis.margin2 = {top: 300, right: 10, bottom: 20, left: 40},

        vis.width = 220  - vis.margin.left - vis.margin.right,
        vis.height = 460 - vis.margin.top - vis.margin.bottom


        // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom);


    vis.g = vis.svg.append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

}
top10.prototype.updateVis = function(_data) {
    var vis = this;

    // console.log(_data);
    vis.data = _data;
    vis.em_star = vis.data.em_star;
    vis.name = vis.data.names;
    // console.log(vis.name);


    var ranking = vis.g
        .selectAll("text")
        .data(vis.name);

    // if (vis.data = []){
    //     vis.g.selectAll('text').remove();
    // }
    // else{

        ranking
            .exit()
            // .transition()
            // .style('fill', 'red')
            // .transition()
            // .duration(100)
            // .style('opacity', 1e-6)
            .remove();
    // }


    ranking.enter()
        .append("g")
        .attr("class","ranking")
        .append("text")
        .attr("fill", "#000")
        .attr("dy", function (d,i) {
            return i * 2 + "em"
        } )
        .attr("text-anchor", "left")
        .text(function (d,i) {
            return  i + 1 + '. ' + vis.name[i];
        });
    // .style('opacity', 1e-6)
    // .transition()
    // .duration(100)
    // .style('opacity', 1);

    ranking
        .text(function (d,i) {
            // console.log(vis.name[i])
            return i + 1 + '. ' + vis.name[i];
        });
        // .attr("fill", "#000")
        // .attr("class","ranking")
        // .attr("dy", function (d,i) {
        //     return i * 2.5 + "em"
        // } )
        // .attr("text-anchor", "left");


    // .style('opacity', 1e-6)
    // .transition()
    // .duration(100)
    // .style('opacity', 1);
}