// Function to draw your map
var map;

var drawMap = function() {

    // Create map and set viewd

    L.mapbox.accessToken = 'pk.eyJ1IjoibW9ycGhvdmFyaWFudCIsImEiOiIzNTZhYTIxZjE3YzJiYjQ5Y2Y0Mzc1ZjJlZTliMmY0NyJ9.gg22GoEx5mShVKjZR37RbA';
    var map = L.map('container').setView([47.6624,-122.3189],14);

    // Create an tile layer variable using the appropriate url

    var layer = L.tileLayer('http://{s}.tiles.mapbox.com/v4/morphovariant.mkh9fi7o/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibW9ycGhvdmFyaWFudCIsImEiOiIzNTZhYTIxZjE3YzJiYjQ5Y2Y0Mzc1ZjJlZTliMmY0NyJ9.gg22GoEx5mShVKjZR37RbA');
    //var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');

    // Add the layer to your map

    layer.addTo(map);

    // Execute your function to get data

    getData()
 
};

// Function for getting data

var data;

var getData = function() {

    // Execute an AJAX request to get the data in data/response.js

    $.ajax({
        url         : "data/response.json",
        type        : "get",
        success     : function(dat) {
            data = dat;
            customBuild();
        },
        dataType    : "json"
    });

    // When your request is successful, call your customBuild function

};

// Do something creative with the data here!
var customBuild = function () {
    data.map(function (d) {
        var pin = new L.circleMarker([d.latitude, d.longitude], 200, {
            color: 'blue',
            opacity: '0.5'
        }).addTo(map)
    });

};


