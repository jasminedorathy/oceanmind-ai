from datetime import datetime
from typing import Optional, List, Literal

from pydantic import BaseModel, EmailStr, Field


RoleType = Literal["admin", "scientist", "viewer"]


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class UserPublic(BaseModel):
    id: str = Field(alias="_id")
    email: EmailStr
    full_name: str
    role: RoleType
    workspace_ids: List[str] = []


class UserInDB(BaseModel):
    email: EmailStr
    password_hash: str
    full_name: str
    role: RoleType = "scientist"
    workspace_ids: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)


class WorkspaceCreate(BaseModel):
    name: str
    description: Optional[str] = None


class WorkspaceInDB(BaseModel):
    name: str
    description: Optional[str] = None
    owner_id: str
    member_ids: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)


class DatasetRegistryEntry(BaseModel):
    filename: str
    workspace_id: Optional[str] = None
    schema: List[str]
    rows: int
    upload_date: datetime = Field(default_factory=datetime.utcnow)
    stats: dict
    missing_values: dict
    tags: List[str] = []

