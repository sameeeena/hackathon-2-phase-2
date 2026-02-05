from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from typing import List, Optional

# Try absolute import first, then relative
try:
    from backend.core.database import get_session
    from backend.core.security import get_current_user
    from backend.models.todo import Todo, TodoCreate, TodoUpdate
except ImportError:
    try:
        # For when running from backend directory
        from ...core.database import get_session
        from ...core.security import get_current_user
        from ...models.todo import Todo, TodoCreate, TodoUpdate
    except ImportError:
        # Final fallback - direct relative imports
        from core.database import get_session
        from core.security import get_current_user
        from models.todo import Todo, TodoCreate, TodoUpdate

router = APIRouter()

@router.post("/", response_model=Todo)
def create_todo(
    todo_create: TodoCreate,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
):
    """
    Create a new todo.
    User ID is automatically assigned from the token.
    """
    todo = Todo.model_validate(todo_create, update={"user_id": current_user_id})
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo

@router.get("/", response_model=List[Todo])
def read_todos(
    offset: int = 0,
    limit: int = Query(default=100, le=100),
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
):
    """
    List all todos for the authenticated user.
    """
    statement = select(Todo).where(Todo.user_id == current_user_id).offset(offset).limit(limit)
    todos = session.exec(statement).all()
    return todos

@router.get("/{todo_id}", response_model=Todo)
def read_todo(
    todo_id: int,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
):
    """
    Get a specific todo.
    Enforces ownership: Users can only see their own todos.
    """
    todo = session.get(Todo, todo_id)
    if not todo or todo.user_id != current_user_id:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo

@router.patch("/{todo_id}", response_model=Todo)
def update_todo(
    todo_id: int,
    todo_update: TodoUpdate,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
):
    """
    Update a todo.
    Partial updates are supported (only sent fields are updated).
    """
    db_todo = session.get(Todo, todo_id)
    if not db_todo or db_todo.user_id != current_user_id:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    todo_data = todo_update.model_dump(exclude_unset=True)
    
    for key, value in todo_data.items():
        setattr(db_todo, key, value)
    
    session.add(db_todo)
    session.commit()
    session.refresh(db_todo)
    return db_todo

@router.delete("/{todo_id}")
def delete_todo(
    todo_id: int,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
):
    """
    Delete a todo.
    """
    todo = session.get(Todo, todo_id)
    if not todo or todo.user_id != current_user_id:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    session.delete(todo)
    session.commit()
    return {"ok": True}
