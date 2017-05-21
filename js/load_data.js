/**
 * Created by sophiasi on 4/15/17.
 */




var info = [];
var data = [];
var ids;
var parseTime = d3.timeParse("%Y-%m-%d");
var colorScale = d3.scaleLinear()
    .domain([0, 2.5,5])
    .range(["rgb(0, 0, 0)", "rgb(128, 64, 64)", "rgb(255, 0, 0)"]);

var type_dict = {
    "All Types": "res",
    "American": "american",
    "Japanese": "japanese",
    "Mexican": "mexican",
    "Chinese": "chinese"
};

var markers = [];

function loadData(_type) {

    //initiate add button

    // document.getElementById('comp_btn').onclick = compare_test(CompareInfo, CompareData);

    deleteMarkers();
    info = [];
    data = [];
    if (data.length == 0 && info.length == 0 ) {
        document.getElementById("about").scrollIntoView()
        d3.json('./data/details/'+ _type +'/ID.json', function (error, d) {
            var itemsAmount = d.ids.length;
            var cbExecuted = 0;

            ids = d.ids;

            d.ids.forEach(function (id, i) {

                if (id[0] != "_"){
                    
                    d3.json('./data/details/' + _type + '/json/' + id + '.json', function (error, d) {

                    d3.csv('./data/details/' + _type + '/csv/'+id+'.csv', function (error, csv) {

                        // console.log(id);

                        var date_week = csv.map(function (d) {
                            return parseTime(d.date_week);
                        } );

                        var stars = ['em_star','cum_star'].map(function(id) {
                            return {
                                id: id,
                                values: csv.map(function(d) {
                                    return {date_week: parseTime(d.date_week), stars: +d[id]};
                                })
                            };
                        });

                        var em_fill = {
                            id: "CI",
                            values: csv.map(function (d) {
                                return {date_week: parseTime(d.date_week), stars_up: +d['em_star_up'],stars_low: +d['em_star_low']}
                            } )
                        };

                        info.push({
                            "id": id,
                            "value": d
                        });

                        data.push({
                            "date_week":date_week,
                            "stars":stars,
                            "fill":em_fill
                        })


                        if (++cbExecuted === itemsAmount) {
                            initMap(ids,info,data, colorScale);
                            // compare_test(data);
                        };

                    })
                })
                }
            });
        })

    }




}

// console.log(info[id]);

// stars = ['em_star','cum_star','hier_post_mean'].map(function(id) {
//     return {
//         id: id,
//         values: csv.map(function(d) {
//             return {date_week: parseTime(d.date_week), stars: +d[id]};
//         })
//     };
// });

// hier_fill = {
//     id: "CI",
//     values: csv.map(function (d) {
//         return {date_week: parseTime(d.date_week), hier_post_CI_up: +d['hier_post_CI_up'],hier_post_CI_low: +d['hier_post_CI_low']}
//     } )
// };