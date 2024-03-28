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


@app.route('/checkin_hardware/<projectId>/<int:qty>', methods=['POST'])
def checkIn_hardware(projectId, qty):
    # Logic to interact with the database would go here
    # For now, we are just returning the projectId and quantity
    return jsonify({"message": f"{qty} hardware checked in for project {projectId}"}), 200


@app.route('/checkout_hardware/<projectId>/<int:qty>', methods=['POST'])
def checkOut_hardware(projectId, qty):
    # Logic to interact with the database would go here
    # For now, we are just returning the projectId and quantity
    return jsonify({"message": f"{qty} hardware checked out for project {projectId}"}), 200


@app.route('/api/projects/<username>', methods=['GET'])
def getProjects(username):
    projects = database.getUserProjects(username)
    return jsonify({"projects": projects})


@app.route('/create_project', methods=['POST'])
def createProject():
    newProjectInfo = request.get_json()  # parse incoming json request data and return it

    projectName = newProjectInfo['name']  # get the name of the project
    description = newProjectInfo['description']  # get the info about the project
    projectID = newProjectInfo['projectID']  # get the project id
    username = newProjectInfo['username']  # get the project id

    database.createProjectDB(projectName, description, projectID, username)  #call db function
    return jsonify({"message": f"created"}), 200


@app.route('/join_project', methods=['POST'])
def joinProject():
    # Logic to verify user authorization would go here
    # For now, we are just returning the projectId
    return jsonify({"message": f"Joined project "}), 200


@app.route('/leave_project', methods=['POST'])
def leaveProject():
    # Logic to verify if user is part of the project would go here
    # For now, we are just returning the projectId
    return jsonify({"message": f"Left project"}), 200


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=False, port=os.environ.get("PORT", 80))
