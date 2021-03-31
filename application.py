import os
from flask import Flask, session, render_template, url_for
from flask.globals import request
from flask_session import Session
import requests

app = Flask(__name__)
Session(app)

# Home Page
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        return render_template("map.html")
    else:
        # print("Get Method")
        # return render_template("map.html")
        return render_template("index.html")

@app.route("/map", methods=["GET", "POST"])
def map():
    if request.method == "POST":
        return render_template("map.html")
    else:
        # Get Method
        return render_template("map.html")

@app.route("/cameradata", methods=["GET", "POST"])
def cameradata():
    r = requests.get("https://data.calgary.ca/resource/k7p9-kppz.geojson")
    return r.json()

@app.route("/incidentdata", methods=["GET", "POST"])
def incidentdata():
    r = requests.get("https://data.calgary.ca/resource/35ra-9556.geojson")
    return r.json()

if __name__== "__main__":
    app.run(debug=True, threaded= True)
# @ app.route("/createaccount", methods=["GET", "POST"])
# def create():
#     global df
#     if request.method == "POST":
#         name = request.form.get("Username")
#         password = request.form.get("Password")
#         temp = pd.DataFrame({"name": [name],
#                              "password": [password]})
#         df = df.append([temp])
#         return render_template("index.html")

#     else:
#         return render_template('createaccount.html')

# Map Page
# @ app.route("/main", methods=["GET", "POST"])
# def main():
#     # When Form is submitted, data is saved
#     # Syntax is PythonVar = request.form.get("Input class NAME (from HTML)")
#     if request.method == "POST":
#         ISBN = request.form.get("ISBN")
#         # This is used to move to the next page after you press submit (otherwise it's just gonna return the same thing)
#         return redirect(url_for('search', ISBN=ISBN))
#     else:
#         # For GET request (i.e. when page loads)
#         return render_template("page1.html", data1="asd")
