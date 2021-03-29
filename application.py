import os
from flask import Flask, session, render_template, url_for
from flask.globals import request
from flask_session import Session
import requests

app = Flask(__name__)

# Configure session to use filesystem
app.config['DEBUG'] = True
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


# Home Page
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        name = request.form.get("username")
        password = request.form.get("password"),
        # If account exists
        if name in df['name'].tolist():
            if password == df.loc[df['name'] == name]['password'].values:
                return redirect(url_for('main'))
            # But wrong password
            else:
                return "Wrong Password, GO back adn try again"
        # No account, Try signing up
        else:
            return "No account, try signing up"
    else:
        return render_template("index.html")

# Map Page


@ app.route("/createaccount", methods=["GET", "POST"])
def create():
    global df
    if request.method == "POST":
        name = request.form.get("Username")
        password = request.form.get("Password")
        temp = pd.DataFrame({"name": [name],
                             "password": [password]})
        df = df.append([temp])
        return render_template("index.html")

    else:
        return render_template('createaccount.html')


@ app.route("/main", methods=["GET", "POST"])
def main():
    # When Form is submitted, data is saved
    # Syntax is PythonVar = request.form.get("Input class NAME (from HTML)")
    if request.method == "POST":
        ISBN = request.form.get("ISBN")
        # This is used to move to the next page after you press submit (otherwise it's just gonna return the same thing)
        return redirect(url_for('search', ISBN=ISBN))
    else:
        # For GET request (i.e. when page loads)
        return render_template("page1.html", data1="asd")
