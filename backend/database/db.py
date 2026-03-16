import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "oceanmind_ai"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def get_db():
    return db

def test_connection():
    try:
        client.admin.command('ping')
        return True
    except Exception:
        return False
