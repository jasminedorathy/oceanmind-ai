from datetime import datetime, timedelta
import os
from typing import Optional

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

from ..database.db import get_db


SECRET_KEY = os.getenv("OCEANMIND_SECRET_KEY", "change-this-secret-in-prod")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 8

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

router = APIRouter()
db = get_db()


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None


class User(BaseModel):
    id: str
    email: str
    full_name: str
    role: str


def verify_password(plain_password: str, password_hash: str) -> bool:
    return pwd_context.verify(plain_password, password_hash)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_user_by_email(email: str):
    return db.users.find_one({"email": email})


def authenticate_user(email: str, password: str):
    user_doc = get_user_by_email(email)
    if not user_doc:
        return None
    if not verify_password(password, user_doc["password_hash"]):
        return None
    return user_doc


async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user_doc = get_user_by_email(email)
    if user_doc is None:
        raise credentials_exception
    return User(
        id=str(user_doc["_id"]),
        email=user_doc["email"],
        full_name=user_doc.get("full_name", ""),
        role=user_doc.get("role", "scientist"),
    )


@router.post("/register", response_model=User)
async def register(email: str, password: str, full_name: str):
    if get_user_by_email(email):
        raise HTTPException(status_code=400, detail="Email already registered")
    password_hash = get_password_hash(password)
    user_doc = {
        "email": email,
        "password_hash": password_hash,
        "full_name": full_name,
        "role": "scientist",
        "workspace_ids": [],
        "created_at": datetime.utcnow(),
    }
    result = db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    return User(
        id=str(result.inserted_id),
        email=email,
        full_name=full_name,
        role="scientist",
    )


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user_doc = authenticate_user(form_data.username, form_data.password)
    if not user_doc:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token = create_access_token(data={"sub": user_doc["email"]})
    return Token(access_token=access_token)


@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

