
//global variables accessible to all functions

var map;
var baseLayer;
//var outcomeAll;
var outcomeKill;
var outcomeHit;
var outcomeUnk;
//var shots;
var data;
var getData;
var customBuild;

// function
// draws a map using Mapbox Light tiles
// centers the map on the continental US
// calls the function to get the data

var drawMap = function() {

    L.mapbox.accessToken = 'pk.eyJ1IjoibW9ycGhvdmFyaWFudCIsImEiOiIzNTZhYTIxZjE3YzJiYjQ5Y2Y0Mzc1ZjJlZTliMmY0NyJ9.gg22GoEx5mShVKjZR37RbA';

    // mapbox Light base tile layer
    baseLayer = L.tileLayer('http://{s}.tiles.mapbox.com/v4/morphovariant.mkh9fi7o/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibW9ycGhvdmFyaWFudCIsImEiOiIzNTZhYTIxZjE3YzJiYjQ5Y2Y0Mzc1ZjJlZTliMmY0NyJ9.gg22GoEx5mShVKjZR37RbA');

    //outcomeAll = L.layerGroup();
    outcomeKill = L.layerGroup();
    outcomeHit = L.layerGroup();
    outcomeUnk = L.layerGroup();

    map = L.map('container', {
        center  : [38, -96],
        zoom    : 4,
        layers  : [baseLayer, outcomeHit, outcomeKill, outcomeUnk]
    });

    var baseMaps = {
        "Base" : baseLayer
    };

    var overlayMaps = {
        "Outcome: Hit"      : outcomeHit,
        "Outcome: Killed"   : outcomeKill,
        "Outcome: Unknown"  : outcomeUnk
        //"Shots"     : shots
    };

    L.control.layers(baseMaps, overlayMaps, {
        'collapsed' : false
    }).addTo(map);

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
                stroke      : false,
                color       : '#2c4ca4',
                opacity     : '0.5'
            }).setRadius(3).bindPopup(
                "<b>Outcome:</b> Hit" +
                "<br /><b>Shots Fired:</b> " + d['Shots Fired'] +
                "<br /><b>Victim's Age:</b> " + d["Victim's Age"] +
                "<br /><b>Victim's Gender:</b> " + d["Victim's Gender"] +
                "<br /><b>Summary:</b> " + d['Summary'] +
                '<br />-<i><a href="' + d['Source Link'] + '" target="_blank">Source</a></i>', {
                    'keepInView'    : true,
                    'closeButton'   : true
                }
            );
            outcomeHit.addLayer(hit);
        } else if (d['Hit or Killed?'] == 'Killed') {
            var kill = new L.circleMarker([d.lat, d.lng], {
                stroke      : false,
                color       : '#c04234',
                opacity     : '0.5'
            }).setRadius(3).bindPopup(
                "<b>Outcome:</b> Hit" +
                "<br /><b>Shots Fired:</b> " + d['Shots Fired'] +
                "<br /><b>Victim's Age:</b> " + d["Victim's Age"] +
                "<br /><b>Victim's Gender:</b> " + d["Victim's Gender"] +
                "<br /><b>Summary:</b> " + d['Summary'] +
                '<br />-<i><a href="' + d['Source Link'] + '" target="_blank">Source</a></i>', {
                    'keepInView'    : true,
                    'closeButton'   : true
                }
            );;
            outcomeKill.addLayer(kill);
        } else {
            var unk = new L.circleMarker([d.lat, d.lng], {
                stroke        : false,
                color         : '#952ca4',
                opacity     : '0.5'
            }).setRadius(3).bindPopup(
                "<b>Outcome:</b> Hit" +
                "<br /><b>Shots Fired:</b> " + d['Shots Fired'] +
                "<br /><b>Victim's Age:</b> " + d["Victim's Age"] +
                "<br /><b>Victim's Gender:</b> " + d["Victim's Gender"] +
                "<br /><b>Summary:</b> " + d['Summary'] +
                '<br />-<i><a href="' + d['Source Link'] + '" target="_blank">Source</a></i>', {
                    'keepInView'    : true,
                    'closeButton'   : true
                }
            );;
            outcomeUnk.addLayer(unk);

        }
    });

};


