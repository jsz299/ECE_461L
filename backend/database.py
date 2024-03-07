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
        "datecreated": datetime.now(),
    }    
    collection.insert_one(userDocument)


# Function to determine if username exists or not in the database 
def getUser(username):
    db = client.get_database("UserLoginCredentials")
    ListOfCollections = db.list_collection_names 
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
        
    