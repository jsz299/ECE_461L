from flask import Flask, send_from_directory, request, json, render_template, jsonify
from flask_cors import CORS
import os
import json
import cipher
import database

# Static folder holds the built React app directory
app = Flask(__name__, static_folder="../ReactFlaskServerSide/build", static_url_path="")
CORS(app)


@app.route("/", methods=["GET"])
def home():
    return send_from_directory(app.static_folder, "index.html")


# API endpoint for creating a user
@app.route("/createaccount", methods=["POST"])
def createAccount():
    newUserInfo = request.get_json()  # parse incoming json request data and return it
    
    userID = newUserInfo['userID']  # get the information from the key userID:
    password = newUserInfo['password']  # get the information from the key password:
    username = newUserInfo['username']  # get the information from the key username:
    
    userID = cipher.encrypt(userID, 3, 2)  # encrypt the userID
    password = cipher.encrypt(password, 4, 2)  # encrypt the password

    database.createUser(username, userID, password)  # create the user in mongoDB

    return 'Done', 201  # postman to check route integrity


@app.route("/login", methods=["POST"])
def login():
    userInfo = request.get_json()

    userID = userInfo['loginUserID']  # get the information from the key userID:
    password = userInfo['loginPassword']  # get the information from the key password:
    username = userInfo['loginUsername']  # get the information from the key username:

    userID = cipher.encrypt(userID, 3, 2)  # encrypt the userID
    password = cipher.encrypt(password, 4, 2)  # encrypt the password

    authentication = database.authenticateLogin(username, userID, password)
    # print(authentication)
    # Must return a valid type: string, dict, list, tuple with headers or status, Response instance, or WSGI callable
    return jsonify({"authentication": authentication})



@app.route("/projectview", methods=["GET"])
def projectView():
    # Fetch project data from your database or another source
    # For example purposes, just returning a static response
    return jsonify({"message": "Project data here"}), 200


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=False, port=os.environ.get("PORT", 80))
