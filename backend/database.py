from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime

uri = "mongodb+srv://jackzhao72jz:qtaRbo4GNE2SH20L@ece461l.ucy01d3.mongodb.net/?retryWrites=true&w=majority&appName=ECE461L"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))


# Function to create a user (collection) with user info (document) into the userlogincredential (database)
def createUser(username, encryptedUserID, encrypyedPassword):
    db = client.get_database("UserLoginCredentials")
    # if username exists pull that collection. If not create that username as a collection in the database
    collection = db[username]  # need to create logic so people can't have the same username
    # create a document to upload to the collection
    userDocument = {
        "userID": encryptedUserID,
        "password": encrypyedPassword,
        "dateCreated": datetime.now(),
    }    
    collection.insert_one(userDocument)


# Function to determine if username exists or not in the database 
def getUser(username):
    db = client.get_database("UserLoginCredentials")
    ListOfCollections = db.list_collection_names()
    if username in ListOfCollections:
        return True
    else:
        return False


def authenticateLogin(username, encryptedUserID, encryptedPassword):
    db = client.get_database("UserLoginCredentials")

    # Check if the user is in the database
    if getUser(username) is True:
        user = db.get_collection(username)
        myquery = {"userID": encryptedUserID, "password": encryptedPassword}
        if user.find_one(myquery) is None: 
            return False
        return True

    return False


def createProjectDB(projectName, description, projectID, username):
    db = client.get_database("Projects")
    # Iterate through all collections to check if projectID already exists
    for collection_name in db.list_collection_names():
        collection = db.get_collection(collection_name)
        if collection.find_one({"projectID": projectID}):
            return False  # Project ID already exists in some collection

    # If project ID does not exist, create new collection and project document
    newCollection = db[projectName]
    projectDocument = {
        "projectID": projectID,
        "description": description,
        "dateCreated": datetime.now(),
        "members": [username]
    }
    newCollection.insert_one(projectDocument)
    return True  # Project created successfully


def joinProjectDB(projectID, username):
    db = client.get_database("Projects")
    projectJoined = False
    for collection_name in db.list_collection_names():
        collection = db.get_collection(collection_name)
        project = collection.find_one({"projectID": projectID})
        if project:
            # Check if username not already in members list to avoid duplication
            if username not in project.get("members", []):
                collection.update_one({"projectID": projectID}, {"$push": {"members": username}})
                projectJoined = True
                break
    return projectJoined


def getUserProjects(username):
    db = client.get_database("Projects")
    user_projects = []
    for collection_name in db.list_collection_names():
        collection = db.get_collection(collection_name)
        project = collection.find_one({"members": username})
        if project:
            user_projects.append({
                "projectName": collection_name,
                "projectID": project.get("projectID", ""),
                "description": project.get("description", ""),
                "members": project.get("members", "")
            })
    return user_projects


def getHardwareResources():
    db = client.get_database("Hardware")
    hw_set1 = db["Hardware Set 1"].find_one({}, {'_id': 0, 'Available': 1, 'Capacity': 1})
    hw_set2 = db["Hardware Set 2"].find_one({}, {'_id': 0, 'Available': 1, 'Capacity': 1})

    hw_resources = {
        "hwSet1": {
            "available": hw_set1['Available'],
            "capacity": hw_set1['Capacity']
        },
        "hwSet2": {
            "available": hw_set2['Available'],
            "capacity": hw_set2['Capacity']
        }
    }

    return hw_resources


def checkOut(hw_set, quantity):
    print(hw_set)
    print(quantity)
    db = client.get_database("Hardware")
    hw_collection = db[hw_set]
    current_hw = hw_collection.find_one({}, {'Available': 1})
    if int(current_hw['Available']) >= quantity:
        hw_collection.update_one({}, {"$inc": {"Available": -quantity}})
        return True
    else:
        return False


def checkIn(hw_set, quantity):
    db = client.get_database("Hardware")
    hw_collection = db[hw_set]
    hw_collection.update_one({}, {"$inc": {"Available": int(quantity)}})
