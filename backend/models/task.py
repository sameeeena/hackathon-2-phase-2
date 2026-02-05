from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum
import uuid
from sqlalchemy import Column, String, DateTime, Boolean


class TaskStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"


class TaskPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: str = Field(sa_column=Column("user_id", String, index=True))  # Matches the user_id from JWT token
    title: str = Field(sa_column=Column("title", String, nullable=False))
    description: Optional[str] = Field(default=None, sa_column=Column("description", String))
    status: TaskStatus = Field(sa_column=Column("status", String, default="pending"))
    priority: TaskPriority = Field(sa_column=Column("priority", String, default="medium"))
    due_date: Optional[datetime] = Field(default=None, sa_column=Column("due_date", DateTime))
    completed_at: Optional[datetime] = Field(default=None, sa_column=Column("completed_at", DateTime))
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("created_at", DateTime, nullable=False))
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column("updated_at", DateTime, nullable=False))

    # Indexes for performance
    __table_args__ = (
        # Add indexes for common query patterns
        {'sqlite_autoincrement': True},
    )