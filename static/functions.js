// Options and Initilizations can be found in setting.js

// ------------------------- Loading Data-------------------------
function buildMarkerLayer(link, FeatureLayer, icona) {
    // Grabbing Data
    fetch(link)
        .then((returnObj) => returnObj.json())
        .then((data) => {
            // Once Data is jsonify, log it then add it to control layer
            // console.log(data);

            //Saving IN GeoJson and Saving as Marker
            L.geoJSON(
                data,
                // Styling Arrow Function
                {
                    pointToLayer: function (feature, latlng) {
                        const marker = L.marker(latlng, { icon: icona });

                        // Popup takes a function and option as arguments
                        marker.bindPopup(
                            function (
                                layer // Adding Popup
                            ) {
                                // If Data is Incident feature
                                if (
                                    layer.feature.properties.hasOwnProperty(
                                        "description"
                                    )
                                ) {
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
                                width="200" height="200">`;

                                    // <a href='${layer.feature.properties.camera_url.url}' target="_blank"> <p style =text-align:center> link to Image </p> </a> <img src="${layer.feature.properties.camera_url.url}" alt="#Couldn't Load Image width="200" height="200"">`;
                                }
                            },
                            { minWidth: 300 }
                        );
                        return marker;
                    },
                }
            ).addTo(FeatureLayer);
        });
}

function buildLineLayer(link, mymap) {
    fetch(link)
        .then((returnObj) => returnObj.json())
        .then((data) => {
            // Once Data is jsonify, log it then add it to control layer
            console.log(data);

            temp = L.geoJSON(data, {
                style: function (feature) {
                    return {
                        color: getColor(feature.properties.speed),
                    }; //color: feature.properties.color };
                },
            })
                .bindPopup(function (feature) {
                    return feature.feature.properties.description;
                })
                .addTo(SpeedLayer);
        });
}

function buildlegendlayer(mymap) {
    fetch("/api/speedcolor")
        .then((returnObj) => returnObj.json())
        .then((data) => {
            tempcolor = data;
        })
        .then(() => {
            legend.addTo(mymap);
        });
}

// -----------Dom Interaction for adding Menu, Draw control and other interactions------------
function addDrawFeaturetoNav(e) {
    const type = e.layerType;
    const leafletDrawObject = e.layer;

    if (type === "marker") {
        leafletDrawObject.bindPopup("A popup!");
    }
    //https://stackoverflow.com/questions/35760126/leaflet-draw-not-taking-properties-when-converting-featuregroup-to-geojson
    // So Draw Layer is actually a leaflet Object/layer while
    drawLayer.addLayer(leafletDrawObject);

    distance = calcEuclidianLength(leafletDrawObject.toGeoJSON());

    if (DownloadButton == false) {
        activateNavFeature(distance);
        DownloadButton = true;
    }
}

function activateNavFeature(distance) {
    const li = document.createElement("li");
    li.setAttribute("class", "nav-item mx-4 my-auto disabled");
    buttoninput = `<button type="button" id="download" class="btn btn-danger">Download Your Route</button>`;
    li.innerHTML = buttoninput;

    const li2 = document.createElement("li");
    li2.setAttribute("class", "nav-item mx-4 my-auto disabled");
    input = `<p class="text-light my-auto"> Your Route Distance is ${distance.toFixed(
        3
    )}</p>`;
    li2.innerHTML = input;

    document.querySelector(".navbar-nav").append(li);
    document.querySelector(".navbar-nav").append(li2);
    // -- This is for Downloading User Drawn Layer
    const btn = document.querySelector("#download");
    btn.addEventListener("click", function (e) {
        settings = drawLayer.toGeoJSON();
        json_str = JSON.stringify(settings);
        saveFile(
            "yourfilename.json",
            "data:application/json",
            new Blob([json_str], { type: "" })
        );
    });
}

function deleteNavFeature() {
    list = document.querySelector(".navbar-nav");
    list.removeChild(list.lastElementChild.previousElementSibling);
    list.removeChild(list.lastElementChild);
    DownloadButton = false;
}

// ------------------------- Geospatial Processing Using Turf.js-------------------------
// Utility Functions from Turf For Geospatial Processing
function calcEuclidianLength(GeojsonObj) {
    return turf.length(GeojsonObj);
}
// Function Handler that finds closest traffic light when an incident cluster is clicked
function findClosest(pointClicked) {
    console.log(pointClicked);

    // Using Turf CLosest Point Algorithm
    let nearest = turf.nearest(
        pointClicked.layer.toGeoJSON(),
        CameraMarkers.toGeoJSON()
    );

    // Refreshing the Layer (in case not the first time it's clicked)
    ClosestLight.clearLayers();

    // Adding the Nearest Community to Map
    L.geoJSON(nearest)
        .bindPopup(function (
            layer // Adding Popup
        ) {
            // return `Community:${layer.feature.properties.NAME};`
        })
        .addTo(ClosestLight);
}

// -------------------------   Utility Functions  -------------------------
// Utility Function for Color Code
function getColor(d) {
    return tempcolor[d];
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
    setTimeout(function () {
        // fixes firefox html removal bug
        window.URL.revokeObjectURL(url);
        a.remove();
    }, 500);
}
