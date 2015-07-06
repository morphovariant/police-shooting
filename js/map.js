
//global variables accessible to all functions

var map;
var baseLayer;
var outcomeKill;
var outcomeHit;
var outcomeUnk;
var shots;
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

    outcomeKill = L.layerGroup();
    outcomeHit = L.layerGroup();
    outcomeUnk = L.layerGroup();
    shots = L.layerGroup();

    map = L.map('container', {
        center  : [38, -96],
        zoom    : 4,
        layers  : [baseLayer, outcomeHit, outcomeKill, outcomeUnk]
    });

    var baseMaps = {
        "Base" : baseLayer
    };

    var overlayMaps = {
        'Outcome: Hit'      : outcomeHit,
        'Outcome: Killed'   : outcomeKill,
        'Outcome: Unknown'  : outcomeUnk,
        'Shots Fired: > 25'  : shots
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
            }).setRadius(5).bindPopup(
                "<p><b>Outcome:</b> Hit</p>" +
                "<p><b>Shots Fired:</b> " + d['Shots Fired'] + "</p>" +
                "<p><b>Victim's Age:</b> " + d["Victim's Age"] + "</p>" +
                "<p><b>Victim's Gender:</b> " + d["Victim's Gender"] + "</p>" +
                "<p><b>Summary:</b> " + d['Summary'] + "</p>" +
                '<p>-<i><a href="' + d['Source Link'] + '" target="_blank">Source</a></i>', {
                    maxheight: '200'
                }
            );
            outcomeHit.addLayer(hit);
        } else if (d['Hit or Killed?'] == 'Killed') {
            var kill = new L.circleMarker([d.lat, d.lng], {
                stroke      : false,
                color       : '#c04234',
                opacity     : '0.5'
            }).setRadius(5).bindPopup(
                "<p><b>Outcome:</b> Killed</p>" +
                "<p><b>Shots Fired:</b> " + d['Shots Fired'] + "</p>" +
                "<p><b>Victim's Age:</b> " + d["Victim's Age"] + "</p>" +
                "<p><b>Victim's Gender:</b> " + d["Victim's Gender"] + "</p>" +
                "<p><b>Summary:</b> " + d['Summary'] + "</p>" +
                '<p>-<i><a href="' + d['Source Link'] + '" target="_blank">Source</a></i>', {
                    maxheight: '200'
                }
            );
            outcomeKill.addLayer(kill);
        } else {
            var unk = new L.circleMarker([d.lat, d.lng], {
                stroke        : false,
                color         : '#952ca4',
                opacity     : '0.5'
            }).setRadius(5).bindPopup(
                "<p><b>Outcome:</b> Unknown</p>" +
                "<p><b>Shots Fired:</b> " + d['Shots Fired'] + "</p>" +
                "<p><b>Victim's Age:</b> " + d["Victim's Age"] + "</p>" +
                "<p><b>Victim's Gender:</b> " + d["Victim's Gender"] + "</p>" +
                "<p><b>Summary:</b> " + d['Summary'] + "</p>" +
                '<p>-<i><a href="' + d['Source Link'] + '" target="_blank">Source</a></i>', {
                    maxheight: '200'
                }
            );
            outcomeUnk.addLayer(unk);
        }
        if (d['Shots Fired'] >= 25) {
            var shot = new L.circleMarker([d.lat, d.lng], {
                stroke      : true,
                weight      : '2',
                fill        : false,
                color       : '#6c4838',
                opacity     : '1'
            }).setRadius(d['Shots Fired']/5).bindPopup(
                "<p><b>Outcome:</b> " + d['Hit or Killed?'] + "</p>" +
                "<p><b>Shots Fired:</b> " + d['Shots Fired'] + "</p>" +
                "<p><b>Victim's Age:</b> " + d["Victim's Age"] + "</p>" +
                "<p><b>Victim's Gender:</b> " + d["Victim's Gender"] + "</p>" +
                "<p><b>Summary:</b> " + d['Summary'] + "</p>" +
                '<p>-<i><a href="' + d['Source Link'] + '" target="_blank">Source</a></i>', {
                    maxheight: '200'
                }
            );
            shots.addLayer(shot);
        }
    });

};


