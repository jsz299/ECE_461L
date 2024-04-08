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


@app.route('/api/projects/<username>', methods=['GET'])
def getProjects(username):
    projects = database.getUserProjects(username)
    return jsonify({"projects": projects})


@app.route('/create_project', methods=['POST'])
def createProject():
    newProjectInfo = request.get_json()
    projectName = newProjectInfo['name']
    description = newProjectInfo['description']
    projectID = newProjectInfo['projectID']
    username = newProjectInfo['username']

    if database.createProjectDB(projectName, description, projectID, username):
        return jsonify({"message": "Project created successfully"}), 201
    else:
        return jsonify({"message": "A project with the given ID already exists"}), 400


@app.route('/join_project', methods=['POST'])
def joinProject():
    joinInfo = request.get_json()
    projectID = joinInfo['projectId']
    username = joinInfo['username']
    if database.joinProjectDB(projectID, username):
        return jsonify({"message": "Successfully joined the project"}), 200
    else:
        return jsonify(
            {"message": "Failed to join the project. Project ID may not exist or user already a member."}), 400


@app.route('/leave_project', methods=['POST'])
def leaveProject():
    # Logic to verify if user is part of the project would go here
    # For now, we are just returning the projectId
    return jsonify({"message": f"Left project"}), 200


@app.route('/get_resources', methods=['GET'])
def getResources():
    try:
        # Calls getHardwareResources and returns its value as JSON
        resources = database.getHardwareResources()
        return jsonify(resources), 200
    except Exception as e:
        print(f"Error retrieving resources: {e}")
        return jsonify({"error": "An error occurred while retrieving resources."}), 500


@app.route('/api/hardware/checkout/<hw_set>/<quantity>', methods=['POST'])
def checkout_hardware(hw_set, quantity):
    # Convert quantity to integer since URL parameters are passed as strings
    quantity = int(quantity)
    if database.checkOut(hw_set, quantity):
        return jsonify({"message": "Checkout successful"}), 200
    else:
        return jsonify({"message": "Insufficient stock for checkout"}), 400


@app.route('/api/hardware/checkin/<hw_set>/<quantity>', methods=['POST'])
def checkin_hardware(hw_set, quantity):
    # Convert quantity to integer
    quantity = int(quantity)
    database.checkIn(hw_set, quantity)
    return jsonify({"message": "Check-in successful"}), 200


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=False, port=os.environ.get("PORT", 80))
