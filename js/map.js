
//global variables accessible to all functions

var map;
var baseLayer;
var outcome;
//var shots;
var data;
var getData;
var customBuild;

// function
// draws a map using Mapbox Light tiles
// centers the map on the continental US
// calls the function to get the data

var drawMap = function() {

    // mapbox Light base tile layer
    baseLayer = L.tileLayer('http://{s}.tiles.mapbox.com/v4/morphovariant.mkh9fi7o/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibW9ycGhvdmFyaWFudCIsImEiOiIzNTZhYTIxZjE3YzJiYjQ5Y2Y0Mzc1ZjJlZTliMmY0NyJ9.gg22GoEx5mShVKjZR37RbA');

    L.mapbox.accessToken = 'pk.eyJ1IjoibW9ycGhvdmFyaWFudCIsImEiOiIzNTZhYTIxZjE3YzJiYjQ5Y2Y0Mzc1ZjJlZTliMmY0NyJ9.gg22GoEx5mShVKjZR37RbA';
    map = L.map('container', {
        center: [38, -96],
        zoom: 4
    });

    var overlays = {
        "Outcome"   : outcome
        //"Shots"     : shots
    };

    L.control.layers(baseLayer, overlays).addTo(map);

    getData();
 
    };

// Function
// gets Deadspin crowd-sourced police shooting data
// source: http://regressing.deadspin.com/deadspin-police-shooting-database-update-were-still-go-1627414202
// if successful, calls function to present data on the map

getData = function () {

    $.ajax({
        url: "data/response.json",
        type: "get",
        dataType: "json"
    }).then(function (dat) {
        data = dat;
        customBuild();
    }, function (err) {
        console.log(err);
    });

};

// Function
// creates a circle marker for each data point

customBuild = function () {

    //color code circleMarkers on 'Hit or Killed'
    data.map(function (d) {
        if (d["Hit or Killed?"] == 'Hit') {
            var hit = new L.circleMarker([d.lat, d.lng], {
                size: '3px',
                color: '#6c4838',
                opacity: '0'
            }).addTo(map)
        } else if (d['Hit or Killed?'] == 'Killed') {
            var kill = new L.circleMarker([d.lat, d.lng], {
                size: '3px',
                color: '#c04234',
                opacity: '0'
            }).addTo(map)
        } else {
            var unk = new L.circleMarker([d.lat, d.lng], {
                size: '3px',
                color: '#e3e79b',
                opacity: '0'
            }).addTo(map)
        }
        outcome = L.layerGroup([hit, kill, unk]);
    });

};


