// Options and Initilizations can be found in setting.js
document.addEventListener("DOMContentLoaded", () => {
    // 2.Get Data & Display it (Note getting it from backend)
    buildMarkerLayer("/api/cameradata", CameraMarkers, TrafficLightsIcon);
    buildMarkerLayer("/api/incidentdata", IncidentMarkers, IncidentIcon);
    buildLineLayer("/api/speeddata", mymap);
    buildlegendlayer();

    //3. Adding Control Layer tool to map
    L.control.layers(basemaps, layers, { collapsed: false }).addTo(mymap); // Layer Selecetion Panel
    mymap.addControl(drawControl); // Adding Drawing Panel to map

    // 4. Events & Triggers
    //-- Leaflet-Draw
    mymap.on(L.Draw.Event.CREATED, addDrawFeaturetoNav);
    mymap.on(L.Draw.Event.DELETED, deleteNavFeature);
    //-- Turf.JS
    ClosestLight.addTo(mymap);
    IncidentMarkers.on("click", findClosest); // Adding A listener.

    //5.Legend
    legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "info legend");
        (labels = ["<strong>Speed Limits Legend</strong>"]),
            (categories = [20, 30, 40, 45, 50, 60, 70, 80, 90, 100, 110]);
        for (var i = 0; i < categories.length; i++) {
            div.innerHTML += labels.push(
                '<i class="circle" style="background:' +
                    getColor(categories[i]) +
                    '"></i> ' +
                    (categories[i] ? categories[i] : "+")
            );
        }
        div.innerHTML = labels.join("<br>");
        return div;
    };
});
