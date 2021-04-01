import os
from flask import Flask, session, render_template, url_for
from flask.globals import request
from flask_session import Session
import requests

app = Flask(__name__)

# Home Page
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        return render_template("map.html")
    else:
        return render_template("index.html")

@app.route("/map", methods=["GET"])
def map():
        # Get Method
        return render_template("map.html")

# Next are API endpoints for the front end to obtain data.
# NOte that the only reason this is done through the backend is to satisfy academic requirements.
# Otherwise everything could be done on the front end.

@app.route("/api/cameradata", methods=["GET"])
def cameradata():
    r = requests.get("https://data.calgary.ca/resource/k7p9-kppz.geojson")
    return r.json()

@app.route("/api/incidentdata", methods=["GET"])
def incidentdata():
    r = requests.get("https://data.calgary.ca/resource/35ra-9556.geojson")
    return r.json()

@app.route('/api/speeddata', methods=['get'])
def speeddata():
    r=requests.get("https://data.calgary.ca/resource/2bwu-t32v.geojson")
    rawdata = r.json()

    featuredata = rawdata
    vecSpeedLimits=[]

    for row in featuredata['features']:
        vecSpeedLimits.append(int(row['properties']['speed']))
    vecSpeedLimits = set(vecSpeedLimits)

    # Saving A color in each one of them
    import random
    global colorcode
    colorcode = {element:"#" + "%06x" % random.randint(0, 0xFFFFFF) for element in vecSpeedLimits}    

    #Adding Color to data then sending it front end
    for row in featuredata['features']:
        row['properties']['color'] = colorcode[int(row['properties']['speed'])]
    return featuredata
    
@app.route('/api/speedcolor', methods=['get'])
def speedcolor():
    return colorcode
    
if __name__== "__main__":
    app.run(debug=True, threaded= True)