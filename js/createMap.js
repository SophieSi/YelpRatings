/**
 * Created by sophiasi on 4/24/17.
 */

function initMap(_ids,_info, _data,_colorScale) {
    console.log(data.length);
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: {lat: 36.169941, lng: -115.13983}
    });

    _info.forEach(function (d, i) {
        // console.log(id);
        // console.log(d.value);
        createMarker(d.value, _data[i], map, _colorScale);
    });

}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    console.log(markers.length);
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
    console.log(markers.length);

}

function getPoints(_info) {
    var points = info.map(function (d) {
        return new google.maps.LatLng(d.value.lat,d.value.lng)
    } );

    return points;
}

function rgb2hex(rgb){
    rgb = rgb.match(/^rgb?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ?
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

function createMarker(_info,_data, map, _colorScale) {
    // console.log(place);

    // console.log(rgb2hex(_colorScale(_info.em_star)));
    // var pinColor = "FE7569";
    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_spin&chld="
        + "0.65"
        + "|0|"
        + rgb2hex(_colorScale(_info.em_star))
        + "|13|"
        + "_|"
        + (Math.round(_info.em_star * 10) / 10).toString(),
        new google.maps.Size(28, 44),// This marker is 20 pixels wide by 32 pixels high.
        new google.maps.Point(0,0),// The origin for this image is (0, 0).
        new google.maps.Point(14, 44));// The anchor for this image is the base of the flagpole at (0, 35).


    // console.log(Math.round(_info.em_star * 100) / 100);
    var marker = new google.maps.Marker({
        map: map,
        // icon: place.icon,
        position: _info,
        title: _info.name,
        id:_info.id,
        // label: (Math.round(_info.em_star * 10) / 10).toString(),
        icon: pinImage,
        // shadow: pinShadow

    });

    // marker.setMap(map);

    markers.push(marker);

    var infowindow = new google.maps.InfoWindow({
        content: _info.name + "<br> Click to compare",
        color: "black"
    });

    google.maps.event.addListener(marker, 'mouseover', function() {
        // infowindow.setContent(place.name);
        infowindow.open(map, this);
        // console.log(marker.id);
        // createVis(marker.id,_info,_data);
    });

    google.maps.event.addListener(marker, 'click', function() {
        // infowindow.setContent(place.name);
        infowindow.open(map, this);
        // console.log(marker.id);
        createVis(marker.id,_info,_data);
    });

    google.maps.event.addListener(marker, 'mouseout', function() {
        // infowindow.setContent(place.name);
        infowindow.close();
    });



    // createMarkerEvent(marker);

}


// function createMarkerEvent(marker) {
//     google.maps.event.addListener(marker, 'click', function (marker, i) {
//         // if ($('#info-container').css('display') == 'block') {
//         //     $('#info-container').css('display', 'none');
//         // } else {
//         //     $('#info-container').css('display', 'block');
//         // }
//         // console.log(marker);
//         // $('#info-container').text("clicked");
//
//     });
//
// }

