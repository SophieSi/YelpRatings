/**
 * Created by sophiasi on 5/6/17.
 */

var parseTime = d3.timeParse("%Y-%m-%d");
var formateTime = d3.timeFormat("%Y-%m-%d");

var type = ['all_res','am_res','mx_res','ch_res','jp_res'];
var type_top = ['all_res_top','am_res_top','mx_res_top','ch_res_top','jp_res_top'];
var count = [0,0,0,0];
var play_index = 0;
var len= [0,0,0,0,0];
var newData = [0,0,0,0,0];
var newDataViolin = [0,0,0,0,0]; //array of data
var slider;
var full_data, top10_data;
var scatterPlots = [0,0,0,0,0];
var top10Plots = [0,0,0,0,0];
var date_week = [0,0,0,0,0]; //array of data
var date_extend = [0,0,0,0,0];
var date_week_full = []; //the concated version of all date_weeks
var intervalid;
var titles = ['All Types','American','Mexican','Chinese','Japanese'];



queue()
    .defer(d3.json,"data/aggregate/em_star_agg_200.json")
    .defer(d3.json,"data/aggregate/em_star_agg_200_am.json")
    .defer(d3.json,"data/aggregate/em_star_agg_200_mx.json")
    .defer(d3.json,"data/aggregate/em_star_agg_200_ch.json")
    .defer(d3.json,"data/aggregate/em_star_agg_200_jp.json")
    .defer(d3.json,"data/top10/em_star_top10_200_res.json")
    .defer(d3.json,"data/top10/em_star_top10_200_am.json")
    .defer(d3.json,"data/top10/em_star_top10_200_mx.json")
    .defer(d3.json,"data/top10/em_star_top10_200_ch.json")
    .defer(d3.json,"data/top10/em_star_top10_200_jp.json")
    .await(createTrend);

function createTrend(error, _data1, _data2, _data3,_data4,_data5,_data6, _data7, _data8,_data9,_data10) {//customize
    full_data = [_data1, _data2,_data3, _data4, _data5]; //customize
    top10_data = [_data6, _data7, _data8,_data9,_data10]; //top 10 data
    // console.log(top10_data[0]);

    //initialize min date and max date for slider extent
    var date_min = full_data.map(function (d) {
        return null
    });
    var date_max = full_data.map(function (d) {
        return null
    });

    //initialize scatterplots
    full_data.forEach(function (d,i) {
        len[i] = d.length;

        date_week[i] = d.map(function (item) {
            return parseTime(item.date_week)
        });

        date_min[i] = date_week[i][0];
        date_max[i] = date_week[i][len[i] - 1];

        top10Plots[i] = new top10(type_top[i]);
        scatterPlots[i] = new ScatterPlot(type[i],titles[i]);

    })

    date_week_full = date_week[0] //now just use the all restaurants, may need further work
    // console.log(date_week_full);
    slider = new Slider("slider", [d3.min(date_min),d3.max(date_max)]);

    // if (slider != undefined) {
    //     play();
    // }
}

//should find a way to union the date_week range
function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}


//click play button and start playing
function play() {
    intervalid = setInterval(function() {


        if (play_index >= d3.max(len) - 1){
            play_index = 0;
        }

        var time = date_week_full[play_index];

        var selectedData = [0,0,0,0,0];
        // var selectedDataTop = [0,0,0,0,0];
        full_data.forEach(function (d,i) {

            selectedData[i] = d.filter(function (item) {

                if (item.date_week == formateTime(time)) {
                    return item
                }

            })[0]
        })

        // top10_data.forEach(function (d,i) {
        //
        //     selectedDataTop [i] = d.filter(function (item) {
        //
        //         if (item.date_week == formateTime(time)) {
        //             return item
        //         }
        //
        //     })[0]
        // })


        slider.handle.attr("cx", slider.x(time));
        slider.text
            .text(formateTime(time));

        // console.log(selectedData);
        if (selectedData.length != 0){
            // console.log(selectedData);
            selectedData.forEach(function (d,i) {

                // console.log(d);
                if (d == undefined) {

                    newData[i] = [];
                    newDataViolin[i] = []
                    scatterPlots[i].updateVis(newData[i]);
                    scatterPlots[i].updateVisViolin(newDataViolin[i]);

                    // top10Plots[i].updateVis({
                    //     em_star:[],
                    //     names:[]
                    // });

                }

                else {
                    newData[i] = d['em_star'].map(function (star) {
                        return {
                            id: 'em_star',
                            value: star
                        }
                    });


                    newDataViolin[i] = d.em_star.map(function (star) {
                        return star
                    });

                    scatterPlots[i].updateVis(newData[i]);
                    scatterPlots[i].updateVisViolin(newDataViolin[i]);

                    // top10Plots[i].updateVis(selectedDataTop[i]);
                }

            })

        }

        // //prepare date
        // newData = full_data[count].em_star.map(function (star) {
        //     return {
        //         id: 'em_star',
        //         value: star
        //     }
        // });
        //
        // newDataViolin = full_data[count].em_star.map(function (star) {
        //     return star
        // });
        //
        // // update vis
        // allRes.updateVisViolin(newDataViolin);
        // allRes.updateVis(newData);




        // //update slider
        //
        // var time = parseTime(full_data[count].date_week)
        //
        // slider.handle.attr("cx", slider.x(time));
        // slider.text
        //     .text(formateTime(time));
        //
        // count = count + 1;

        play_index = play_index + 1;
        //off set count

        // if (play_index >= 50){
        //     clearInterval(intervalid);
        // }
        if (play_index >= d3.max(len) - 1){
            clearInterval(intervalid);
        }

    }, 50);

}

//click stop button and stop playing
function stop(){
    clearInterval(intervalid);
    var time = date_week_full[play_index];
    var selectedDataTop = [0,0,0,0,0];

    top10_data.forEach(function (d,i) {

        selectedDataTop [i] = d.filter(function (item) {

            if (item.date_week == formateTime(time)) {
                return item
            }

        })[0]
    })

    if (selectedDataTop != 0){
        // console.log(selectedData);
        selectedDataTop.forEach(function (d,i) {

            console.log(d);
            if (d == undefined) {

                // newData[i] = [];
                // newDataViolin[i] = []
                // scatterPlots[i].updateVis(newData[i]);
                // scatterPlots[i].updateVisViolin(newDataViolin[i]);

                top10Plots[i].updateVis({
                    em_star:[],
                    names:[]
                });

            }

            else {
                // newData[i] = d['em_star'].map(function (star) {
                //     return {
                //         id: 'em_star',
                //         value: star
                //     }
                // });
                //
                //
                // newDataViolin[i] = d.em_star.map(function (star) {
                //     return star
                // });
                //
                // scatterPlots[i].updateVis(newData[i]);
                // scatterPlots[i].updateVisViolin(newDataViolin[i]);

                top10Plots[i].updateVis(selectedDataTop[i]);
            }

        })

    }

}

//drag the slider and update vis
function update(h) {

    // var index = getRandomInt(0, len - 1);
    // console.log(d3.timeFormat("%Y-%m-%d")(h));
    var time = d3.timeMonday.round(h); //selected on the slider round to every monday

    // var times =

    date_week.forEach(function (d,i) {
        count[i] = d.map(Number).indexOf(+time);
        // console.log(count[i])

    })
    play_index = count[0];
        // console.log(count);


    slider.handle.attr("cx", slider.x(h));
    slider.text
        .text(formateTime(time));



    var selectedData = [0,0,0,0,0];
    var selectedDataTop = [0,0,0,0,0];
    full_data.forEach(function (d,i) {

        selectedData[i] = d.filter(function (item) {

            if (item.date_week == formateTime(time)) {
                return item
            }

        })[0]
    })

    top10_data.forEach(function (d,i) {

        selectedDataTop [i] = d.filter(function (item) {

            if (item.date_week == formateTime(time)) {
                return item
            }

        })[0]
    })
    // console.log(selectedDataTop);


    if (selectedData.length != 0){
        // console.log(selectedData);
        selectedData.forEach(function (d,i) {

            if (count[i] == -1) {

                newData[i] = [];
                newDataViolin[i] = []
                scatterPlots[i].updateVis(newData[i]);
                scatterPlots[i].updateVisViolin(newDataViolin[i]);

                // console.log("empty")
                top10Plots[i].updateVis({
                    em_star:[],
                    names:[]
                });

            }

            else {
                newData[i] = d['em_star'].map(function (star) {
                    return {
                        id: 'em_star',
                        value: star
                    }
                });


                newDataViolin[i] = d.em_star.map(function (star) {
                    return star
                });

                scatterPlots[i].updateVis(newData[i]);
                scatterPlots[i].updateVisViolin(newDataViolin[i]);


                top10Plots[i].updateVis(selectedDataTop[i]);

            }

        })

    }


}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}