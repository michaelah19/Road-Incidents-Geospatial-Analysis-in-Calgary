// Settings for intializaton and options of map.
// Basically things are constructed here.

// Initializing Maps and Data
const CommunityMarkers = L.featureGroup();
const ClosestLight = L.layerGroup();
const SpeedLayer = L.layerGroup();
const IncidentMarkers = L.markerClusterGroup({ singleMarkerMode: true });
const CameraMarkers = L.featureGroup();
// This layer is used by user to draw and edit.
const drawLayer = new L.FeatureGroup();

// Icons for features on map
const BaseIcon = L.Icon.extend({});
//(Note those are deriver classed from base icon)
const IncidentIcon = new BaseIcon({
    iconSize: [25, 25],
    iconUrl: "accidents.png",
});
const TrafficLightsIcon = new BaseIcon({
    iconSize: [20, 20],
    iconUrl: "/static/lights.png",
});

// Map Initialization
darkgreyBase = L.tileLayer(
    "https://api.mapbox.com/styles/v1/micdean19/ckm8ajpa120mr17qqdq7rnnvs/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWljZGVhbjE5IiwiYSI6ImNrbGhpeThrNzVmZTMycnBsdnFmYzF3NWMifQ.YBVdn03YJzG5mRWiSKqOkQ"
);
// Layer Controls By creating objects (i.e. dictionary) and Display
const basemaps = {
    "Map of Calgary": darkgreyBase,
};

const layers = {
    // "speedlimit": SpeedLayer,
    "Traffic Accidents": IncidentMarkers,
    "Traffic Cameras": CameraMarkers,
};

//Initializing Drawing layer and Drawing Options
const options = {
    position: "topright",
    draw: {
        polyline: {
            shapeOptions: {
                color: "#f357a1",
                weight: 10,
            },
        },
        polygon: false,
        circle: false,
        marker: false,
        rectangle: false,
        polygon: {
            allowIntersection: false, // Restricts shapes to simple polygons
            drawError: {
                color: "#e1e100", // Color the shape will turn when intersects
                message: "<strong>Oh snap!<strong> you can't draw that!", // Message that will show when intersect
            },
            shapeOptions: {
                color: "#bada55",
            },
        },
        circle: false, // Turns off this drawing tool
        circlemarker: false,
    },
    edit: {
        featureGroup: drawLayer,
        remove: true,
    },
};

// Creating Drawing toolbox (on the right side using Options above)
var drawControl = new L.Control.Draw(options);

let DownloadButton = false;
