from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid
from enum import Enum
from sqlalchemy import Column, Text


class SenderType(str, Enum):
    user = "user"
    assistant = "assistant"


class Message(SQLModel, table=True):
    __tablename__ = "messages"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    conversation_id: uuid.UUID = Field(foreign_key="conversations.id", index=True)
    sender_type: str = Field(default="user", max_length=20)
    content: str = Field(sa_column=Column("content", Text, nullable=False))
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata_json: Optional[str] = Field(default=None, sa_column=Column("metadata", Text))  # Store as JSON string