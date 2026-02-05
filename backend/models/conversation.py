from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid
from sqlalchemy import Column, String, Boolean, DateTime


class Conversation(SQLModel, table=True):
    __tablename__ = "conversations"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: str = Field(sa_column=Column("user_id", String, index=True))  # Matches the user_id from JWT token
    title: Optional[str] = Field(default=None, sa_column=Column("title", String))
    is_active: bool = Field(sa_column=Column("is_active", Boolean, default=True))
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("created_at", DateTime, nullable=False))
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("updated_at", DateTime, nullable=False))