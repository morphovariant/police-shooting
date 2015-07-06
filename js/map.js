
//global variables accessible to all functions
var map;
var baseLayer;
var outcomeKill;
var outcomeHit;
var outcomeUnk;
var shotsFired;
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

    // layers the user can toggle on/off
    outcomeKill = L.layerGroup();
    outcomeHit = L.layerGroup();
    outcomeUnk = L.layerGroup();
    shotsFired = L.layerGroup();

    map = L.map('container', {
        center  : [38, -96],
        zoom    : 4,
        layers  : [baseLayer, outcomeHit, outcomeKill, outcomeUnk]
    });

    var baseMaps = {
        "Base" : baseLayer
    };

    var overlayMaps = {
        'Outcome: <span class="blue">Hit</span>'        : outcomeHit,
        'Outcome: <span class="red">Killed</span>'      : outcomeKill,
        'Outcome: <span class="purple">Unknown</span>'  : outcomeUnk,
        'Shots Fired: > 25'                             : shotsFired
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
// creates a marker and popup for each data point
customBuild = function () {

    //color code circleMarkers on 'Hit or Killed'
    data.map(function (d) {

        //collect variables for content
        var outcome = d["Hit or Killed?"];
        var name = d["Victim Name"];
        var gender = d["Victim's Gender"];
        var age = d["Victim's Age"];
        var shots = d['Shots Fired'];
        var link = d['Source Link'];
        var summary = d['Summary'];

        //ensure there is a name, else incorporate gender if available

        if (name === undefined || name.length < 3) {
            if (gender == 'Male') {
                name = "Unknown Male";
            } else if (gender == 'Female') {
                name = "Unknown Female";
            } else {
                name = "Unknown Person";
            }
        }

        //pre-format age for content when present
        if (age > 0) {
            age = ', ' + age;
        } else {
            age = '';
        }

        //pre-format link for content
        link = '<a href="' + link + '" target="_blank">Source</a>';

        //pre-build content for popup
        var content = "<h2>" + name + age + "</h2>"
            + '<p><span class="key">Outcome:</span> ' + outcome + '</p>'
            + '<p><span class="key">Shots Fired:</span> ' + shots + "</p>"
            + '<p><span class="key">Summary:</span> ' + summary + '</p>'
            + '<p>-<i>' + link + '</i></p>';

        //color-code markers by outcome
        if (outcome == 'Hit') {

            var hitPopup = new L.popup({
                maxHeight : '200'
            }).setLatLng([d.lat, d.lng]).setContent(content);

            var hit = new L.circleMarker([d.lat, d.lng], {
                stroke      : false,
                color       : '#2c4ca4',
                opacity     : '0.5'
            }).setRadius(5).bindPopup(hitPopup);

            outcomeHit.addLayer(hit);

        } else if (outcome == 'Killed') {

            var killPopup = new L.popup({
                maxHeight : '200'
            }).setLatLng([d.lat, d.lng]).setContent(content);

            var kill = new L.circleMarker([d.lat, d.lng], {
                stroke      : false,
                color       : '#c04234',
                opacity     : '0.5'
            }).setRadius(5).bindPopup(killPopup);

            outcomeKill.addLayer(kill);

        } else {

            var unkPopup = new L.popup({
                maxHeight : '200'
            }).setLatLng([d.lat, d.lng]).setContent(content);

            var unk = new L.circleMarker([d.lat, d.lng], {
                stroke      : false,
                color       : '#952ca4',
                opacity     : '0.5'
            }).setRadius(5).bindPopup(unkPopup);

            outcomeUnk.addLayer(unk);

        }

        //additional optional layer indicating high number of shots fired
        //marker is an empty circle, radius is based on number of shots fired / 5
        if (shots >= 25) {

            var shot = new L.circleMarker([d.lat, d.lng], {
                stroke      : true,
                weight      : '1',
                fill        : false,
                color       : '#6c4838',
                opacity     : '1'
            }).setRadius(shots/5);

            shotsFired.addLayer(shot);
        }
    });

};


