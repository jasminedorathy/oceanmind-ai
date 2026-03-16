from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "oceanmind_saas")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def get_db():
    return db

def test_db():
    try:
        client.admin.command('ping')
        return True
    except Exception:
        return False
