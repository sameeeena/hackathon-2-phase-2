"""
MCP Tools for Task Operations
Following the specifications for standardized database operations
"""
from typing import List, Optional
from sqlmodel import Session, select, func
from datetime import datetime
import uuid
from backend.models.task import Task, TaskStatus, TaskPriority


def add_task(session: Session, user_id: str, title: str, description: Optional[str] = None,
             priority: TaskPriority = TaskPriority.medium, due_date: Optional[datetime] = None) -> Task:
    """
    Add a new task to the database
    """
    task = Task(
        user_id=user_id,
        title=title,
        description=description,
        priority=priority,
        due_date=due_date
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


def list_tasks(session: Session, user_id: str, status: Optional[TaskStatus] = None) -> List[Task]:
    """
    List tasks for a specific user, optionally filtered by status
    """
    query = select(Task).where(Task.user_id == user_id)

    if status:
        query = query.where(Task.status == status)

    query = query.order_by(Task.created_at.desc())

    return session.exec(query).all()


def update_task(session: Session, user_id: str, task_id: str, title: Optional[str] = None,
                description: Optional[str] = None, status: Optional[TaskStatus] = None,
                priority: Optional[TaskPriority] = None, due_date: Optional[datetime] = None) -> Optional[Task]:
    """
    Update a specific task if it belongs to the user
    """
    import uuid

    # Convert string ID to UUID for proper comparison with the UUID field
    try:
        uuid_task_id = uuid.UUID(task_id) if isinstance(task_id, str) else task_id
    except ValueError:
        return None  # Invalid UUID format

    task = session.exec(
        select(Task).where(Task.id == uuid_task_id).where(Task.user_id == user_id)
    ).first()

    if not task:
        return None

    # Update fields if provided
    if title is not None:
        task.title = title
    if description is not None:
        task.description = description
    if status is not None:
        task.status = status
    if priority is not None:
        task.priority = priority
    if due_date is not None:
        task.due_date = due_date

    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)

    return task


def complete_task(session: Session, user_id: str, task_id: str) -> Optional[Task]:
    """
    Mark a task as completed
    """
    import uuid

    # Convert string ID to UUID for proper comparison with the UUID field
    try:
        uuid_task_id = uuid.UUID(task_id) if isinstance(task_id, str) else task_id
    except ValueError:
        return None  # Invalid UUID format

    task = session.exec(
        select(Task).where(Task.id == uuid_task_id).where(Task.user_id == user_id)
    ).first()

    if not task:
        return None

    task.status = TaskStatus.completed
    task.completed_at = datetime.utcnow()
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    return task


def delete_task(session: Session, user_id: str, task_id: str) -> bool:
    """
    Delete a task if it belongs to the user
    """
    import uuid

    # Convert string ID to UUID for proper comparison with the UUID field
    try:
        uuid_task_id = uuid.UUID(task_id) if isinstance(task_id, str) else task_id
    except ValueError:
        return False  # Invalid UUID format

    task = session.exec(
        select(Task).where(Task.id == uuid_task_id).where(Task.user_id == user_id)
    ).first()

    if not task:
        return False

    session.delete(task)
    session.commit()
    return True