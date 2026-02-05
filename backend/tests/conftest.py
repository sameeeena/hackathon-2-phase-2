import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlalchemy.pool import StaticPool
from backend.main import app
from backend.core.database import get_session
from typing import Generator

# Use in-memory SQLite for tests
sqlite_url = "sqlite:///:memory:"

engine = create_engine(sqlite_url, connect_args={"check_same_thread": False}, poolclass=StaticPool)

@pytest.fixture(name="session")
def session_fixture():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine)

@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()
