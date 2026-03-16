from pymongo import MongoClient
import os

mongo_uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(mongo_uri)
db = client.oceanmind
db.hotspots.drop()
print("Hotspots collection cleared for real geolocation migration.")
