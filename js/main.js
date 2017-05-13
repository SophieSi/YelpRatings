/**
 * Created by sophiasi on 4/16/17.
 */


// var date_week;

var BSSM_LineChart,BSSM_LineChart_Bottom ;

function createVis(_id,_info ,_data) {

    // console.log(_info);

    //create div
    // var div = document.createElement("div");
    // div.setAttribute("id","div" + _id);

    //button
    var myButton = document.createElement("input");
    myButton.type = "button";
    myButton.value = "Close";
    myButton.setAttribute("class", "btn btn-default btn_margin");
    myButton.setAttribute("id", "btn" + _id);
    var placeHolder = document.getElementById("cls_btn");
    placeHolder.appendChild(myButton);

    // var div = document.createElement('div');
    // div.setAttribute("id",_id);
    // placeHolder.appendChild(div);

    //text

    document.getElementById('res_name').innerHTML = _info.name;
    document.getElementById('res_cum_star').innerHTML = "Cumulative Rating: " + _info.cum_star.toFixed(2);
    document.getElementById('res_em_star').innerHTML = "Rating This Week: " + _info.em_star.toFixed(2);


    //visualization
    BSSM_LineChart =  new BSSM("BSSM",_data.date_week, _data.stars,_data.fill);
    BSSM_LineChart_Bottom = new TimeLine("BSSM",_data.date_week,_data.stars,_data.fill);

    //remove previous
    // d3.selectAll(".eachplane").remove();
    //draw new
    // airlines_cmp.list = selected_airlines;
    // airlines_cmp.updateVis();

    myButton.onclick=function() {
        console.log(this.id);
        // var airline = this.value;
        //console.log(airline);
        // var index = selected_airlines.indexOf(airline);
        // selected_airlines.splice(index, 1);
        //console.log(selected_airlines);
        $( "#BSSM" ).empty();
        $( "#res_name" ).empty();
        $( "#res_cum_star" ).empty();
        $( "#res_em_star" ).empty();
        $(this).remove();

        // d3.selectAll(".eachplane").remove();
        //draw new
        // airlines_cmp.list = selected_airlines;
        // airlines_cmp.updateVis();
    };




    // console.log(BSSM_LineChart_Bottom);
    // BSSM_LineChart.callBrushZoom();

}

var MyEventHandler = {};
$(MyEventHandler).bind("selectionChanged", function(event,rangeStart, rangeEnd){
    //console.log(rangeStart, rangeEnd);
    // agevis.onSelectionChange(rangeStart, rangeEnd);
    BSSM_LineChart_Bottom.onSelectionChange(rangeStart, rangeEnd);
});


function brushed(){
    // var selection = d3.event.selection;

    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;
    var s = d3.event.selection || BSSM_LineChart_Bottom.x2.range();
    BSSM_LineChart.x.domain(s.map(BSSM_LineChart_Bottom.x2.invert, BSSM_LineChart_Bottom.x2));
    BSSM_LineChart.focus.selectAll("path.lines").attr("d",function(d) { return BSSM_LineChart.line(d.values); });
    BSSM_LineChart.focus.selectAll(".fill").attr("d",BSSM_LineChart.fill_area);
    BSSM_LineChart.focus.select(".x-axis").call(BSSM_LineChart.xAxis);
    BSSM_LineChart.updateZoom(s);
    // BSSM_LineChart.updateViz();


    // console.log(BSSM_LineChart.x);


}

function zoomed() {


    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    var t = d3.event.transform;
    BSSM_LineChart.x.domain(t.rescaleX(BSSM_LineChart_Bottom.x2).domain());
    BSSM_LineChart.focus.selectAll("path.lines").attr("d",function(d) { return BSSM_LineChart.line(d.values); });
    BSSM_LineChart.focus.selectAll(".fill").attr("d",BSSM_LineChart.fill_area);
    BSSM_LineChart.focus.select(".x-axis").call(BSSM_LineChart.xAxis);
    // BSSM_LineChart.updateViz();
    BSSM_LineChart_Bottom.updateViz(t,BSSM_LineChart.x);


}

