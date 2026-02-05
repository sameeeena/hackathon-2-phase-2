from fastapi.testclient import TestClient
from sqlmodel import Session
from backend.models import Todo
from backend.core.security import get_current_user
from backend.main import app

def test_create_todo(client: TestClient):
    # Override auth to simulate a logged-in user
    app.dependency_overrides[get_current_user] = lambda: "user123"
    
    response = client.post(
        "/todos/",
        json={"title": "Test Todo", "description": "Test Description"}
    )
    data = response.json()
    
    assert response.status_code == 200
    assert data["title"] == "Test Todo"
    assert data["user_id"] == "user123"
    assert data["id"] is not None

def test_read_todos(client: TestClient, session: Session):
    app.dependency_overrides[get_current_user] = lambda: "user123"
    
    todo1 = Todo(title="Todo 1", user_id="user123")
    todo2 = Todo(title="Todo 2", user_id="other_user")
    session.add(todo1)
    session.add(todo2)
    session.commit()
    
    response = client.get("/todos/")
    data = response.json()
    
    assert response.status_code == 200
    assert len(data) == 1
    assert data[0]["title"] == "Todo 1"

def test_update_todo(client: TestClient, session: Session):
    app.dependency_overrides[get_current_user] = lambda: "user123"
    
    todo = Todo(title="Old Title", user_id="user123")
    session.add(todo)
    session.commit()
    session.refresh(todo)
    
    response = client.patch(
        f"/todos/{todo.id}",
        json={"title": "New Title", "completed": True}
    )
    data = response.json()
    
    assert response.status_code == 200
    assert data["title"] == "New Title"
    assert data["completed"] is True

def test_delete_todo(client: TestClient, session: Session):
    app.dependency_overrides[get_current_user] = lambda: "user123"
    
    todo = Todo(title="Delete Me", user_id="user123")
    session.add(todo)
    session.commit()
    session.refresh(todo)
    
    response = client.delete(f"/todos/{todo.id}")
    assert response.status_code == 200
    
    # Verify it's gone
    db_todo = session.get(Todo, todo.id)
    assert db_todo is None

def test_access_other_user_todo(client: TestClient, session: Session):
    app.dependency_overrides[get_current_user] = lambda: "user123"
    
    # Todo belongs to user456
    todo = Todo(title="Secret", user_id="user456")
    session.add(todo)
    session.commit()
    session.refresh(todo)
    
    # Try to get it as user123
    response = client.get(f"/todos/{todo.id}")
    assert response.status_code == 404 # Should be 404 not found for security
