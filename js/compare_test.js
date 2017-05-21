/**
 * Created by sophiasi on 5/18/17.
 */



var ComparePlot;

var CompareInfo = [];
var CompareData = [];


// loadData("american");

function compare_test(_info, _data) {



    console.log(_info, _data);


    var selection = _info.map(function (d,i) {
        return {
            name:d.name,
            last_star: d.em_star,
            values: _data[i].stars[0].values
        }
    })

    //sort in descending order
    selection = selection.sort(function (a,b) {
        return b.last_star - a.last_star
    });

    // console.log(test);

    var date_min = _data[0].date_week[0];
    var date_max = _data[0].date_week[_data[0].date_week.length - 1];

    // console.log(date_min,date_max);
    _data.forEach(function (d) {
        if (d.date_week[0] < date_min) {
            date_min = d.date_week[0];
        }

        if (d.date_week[d.date_week.length - 1] > date_max) {
            date_max = d.date_week[d.date_week.length - 1];
        }
    })

    // console.log(_data);


    var extend = [date_min, date_max];
    console.log(extend);
    console.log(selection);


    ComparePlot = new Compare("compare", selection, extend);
}


function zoomedCompare() {

    console.log("zoom");
    // if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    // var t = d3.event.transform;
    // ComparePlot.x.domain(t.rescaleX(ComparePlot.x).domain());
    ComparePlot.gX.call(ComparePlot.xAxis.scale(d3.event.transform.rescaleX(ComparePlot.x)));

    var new_x = d3.event.transform.rescaleX(ComparePlot.x);

    ComparePlot.line.x(function(d) { return new_x(d.date_week); });
    ComparePlot.g.selectAll("path.lines").attr("d",function(d) { return ComparePlot.line(d.values); });


    // ComparePlot.focus.selectAll(".fill").attr("d",ComparePlot.fill_area);
    // ComparePlot.g.select(".x-axis").call(ComparePlot.xAxis);
    // BSSM_LineChart.updateViz();
    // BSSM_LineChart_Bottom.updateViz(t,BSSM_LineChart.x);


    // ComparePlot.g.attr("transform", d3.event.transform);
    // ComparePlot.gX.call(ComparePlot.xAxis.scale(d3.event.transform.rescaleX(ComparePlot.x)));
    //

}