from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, timezone
from pydantic import ConfigDict

class TodoBase(SQLModel):
    title: str = Field(index=True)
    description: Optional[str] = None
    completed: bool = Field(default=False)

class TodoCreate(TodoBase):
    pass

class TodoUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

class Todo(TodoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    user_id: str = Field(index=True)  # Reference to external auth user (Better Auth sub)

    model_config = ConfigDict(arbitrary_types_allowed=True)
