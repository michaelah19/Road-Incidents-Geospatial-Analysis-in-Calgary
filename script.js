// Options and Initilizations can be found in setting.js

document.addEventListener('DOMContentLoaded', () => {
    // 1.Creating Map
    const mymap = L.map('mapid',
        {
            zoom: 11,
            layers: [darkgreyBase, drawLayer]
        }).setView([51.0447, -114.07], 11);

    // 2.Get Data & Display it
    buildMarkerLayer('https://data.calgary.ca/resource/k7p9-kppz.geojson', CameraMarkers, TrafficLightsIcon)
    buildMarkerLayer('https://data.calgary.ca/resource/35ra-9556.geojson', IncidentMarkers, IncidentIcon)
    // buildLayer('https://data.calgary.ca/resource/2bwu-t32v.geojson', SpeedLayer)

    //3. Adding Control Layer tool to map
    L.control.layers(basemaps, layers, { collapsed: false }).addTo(mymap);
    // Adding Drawing Tools to map
    mymap.addControl(drawControl);


    // 4. Events & Triggers
    //-- This is for Leaflet-Draw
    mymap.on(L.Draw.Event.CREATED, addDrawFeaturetoMap);
    //-- This is for Turf.JS, it's a layer that is sued to save closest point.
    ClosestLight.addTo(mymap);
    IncidentMarkers.on('click', findClosest);    // Adding A listener.

    // -- This is for uploading User Drawn Layer from backend



});

function buildMarkerLayer(link, FeatureLayer, icona) {
    // Grabbing Data
    fetch(link)
        .then((returnObj) => returnObj.json())
        .then((data) => {
            // Once Data is jsonify, log it then add it to control layer
            console.log(data);

            //Saving IN GeoJson and Saving as Marker
            L.geoJSON(data,
                // Styling Arrow Function
                {
                    pointToLayer: function (feature, latlng) {
                        const marker = L.marker(latlng, { icon: icona })

                        // Popup takes a function and option as arguments
                        marker.bindPopup(function (layer)
                        // Adding Popup
                        {
                            // If Data is Incident feature
                            if (layer.feature.properties.hasOwnProperty('description')) {
                                // return player.feature.properties.description;
                                return `<p style="text-align:center"> ${layer.feature.properties.incident_info} </p>`;
                                // return `<p style="text-align:center"> ${layer.feature.properties.description} </p>`;
                            }
                            // Else if Data is a camera feature
                            else {
                                // return `<a href='${layer.feature.properties.camera_url.url}' target="_blank"> <p style =text-align:center> ${layer.feature.properties.camera_location} </p> </a> <img src="${layer.feature.properties.camera_url.url}" alt="#Couldn't Load Image width="200" height="200"">`;
                                return `<p style =text-align:center> Location: ${layer.feature.properties.camera_location} </p> 
                                <a href="${layer.feature.properties.camera_url.url}" target="_blank">
                                <img alt="Couldn't Load Image" src="${layer.feature.properties.camera_url.url}"
                                width="200" height="200">`

                                // <a href='${layer.feature.properties.camera_url.url}' target="_blank"> <p style =text-align:center> link to Image </p> </a> <img src="${layer.feature.properties.camera_url.url}" alt="#Couldn't Load Image width="200" height="200"">`;
                            }
                        }, { minWidth: 300 });
                        return marker;
                    }
                })
                .addTo(FeatureLayer)
        })
};

// Function Handler that finds closest traffic light when an incident cluster is clicked
function findClosest(pointClicked) {
    console.log(pointClicked);

    // Using Turf CLosest Point Algorithm
    let nearest = turf.nearest(pointClicked.layer.toGeoJSON(), CameraMarkers.toGeoJSON());

    // Refreshing the Layer (in case not the first time it's clicked)
    ClosestLight.clearLayers();

    // Adding the Nearest Community to Map
    L.geoJSON(nearest)
        .bindPopup(function (layer)
        // Adding Popup
        {
            // return `Community:${layer.feature.properties.NAME};`
        })
        .addTo(ClosestLight);

};

// Function handler for saving to layer after function is done drawing
// Note this function also activate the donwload route button on the fist time it's called.
function addDrawFeaturetoMap(e) {
    const type = e.layerType
    const leafletDrawObject = e.layer;

    if (type === 'marker') {
        leafletDrawObject.bindPopup('A popup!');
    }
    //https://stackoverflow.com/questions/35760126/leaflet-draw-not-taking-properties-when-converting-featuregroup-to-geojson
    // So Draw Layer is actually a leaflet Object/layer while
    drawLayer.addLayer(leafletDrawObject);

    if (DownloadButton == false) {
        activateDownloadButton();
        DownloadButton = true;
    }

};

function activateDownloadButton() {
    const li = document.createElement('li')
    li.setAttribute("class", "nav-item mx-4 my-auto disabled")
    buttoninput = `<button type="button" id="download" class="btn btn-danger">Download Route</button>`
    li.innerHTML = buttoninput;

    document.querySelector('.navbar-nav').append(li);
    // -- This is for Downloading User Drawn Layer
    const btn = document.querySelector('#download');
    btn.addEventListener('click', function (e) {
        settings = drawLayer.toGeoJSON();
        json_str = JSON.stringify(settings);
        saveFile('yourfilename.json', "data:application/json", new Blob([json_str], { type: "" }));

    });
}

// Function for Downloading geojson File

function saveFile(name, type, data) {
    // ---------------- Caller -----------------------
    // settings = drawLayer.toGeoJSON();
    // json_str = JSON.stringify(settings);
    // saveFile('yourfilename.json', "data:application/json", new Blob([json_str], { type: "" }));
    if (data != null && navigator.msSaveBlob)
        return navigator.msSaveBlob(new Blob([data], { type: type }), name);

    var a = $("<a style='display: none;'/>");
    var url = window.URL.createObjectURL(new Blob([data], { type: type }));
    a.attr("href", url);
    a.attr("download", name);
    $("body").append(a);
    a[0].click();
    setTimeout(function () {  // fixes firefox html removal bug
        window.URL.revokeObjectURL(url);
        a.remove();
    }, 500);
}



