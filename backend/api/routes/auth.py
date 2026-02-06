from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

# Try absolute import first, then relative
try:
    from backend.core.database import get_session
    from backend.core.security import create_access_token, get_password_hash, verify_password, ACCESS_TOKEN_EXPIRE_MINUTES
    from backend.models.user import User, UserCreate, UserRead
except ImportError:
    try:
        from ...core.database import get_session
        from ...core.security import create_access_token, get_password_hash, verify_password, ACCESS_TOKEN_EXPIRE_MINUTES
        from ...models.user import User, UserCreate, UserRead
    except ImportError:
        from core.database import get_session
        from core.security import create_access_token, get_password_hash, verify_password, ACCESS_TOKEN_EXPIRE_MINUTES
        from models.user import User, UserCreate, UserRead

router = APIRouter()

@router.post("/token")
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    # 1. Find user by username
    statement = select(User).where(User.username == form_data.username)
    user = session.exec(statement).first()
    
    # 2. Verify user and password
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 3. Create token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    # We use user.username as the 'sub' (subject) to match get_current_user expectation
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/users/", response_model=UserRead)
def create_user(user_create: UserCreate, session: Session = Depends(get_session)):
    """
    Register a new user.
    """
    # 1. Check if username exists
    statement = select(User).where(User.username == user_create.username)
    existing_user = session.exec(statement).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
        
    # 2. Check if email exists (optional)
    if user_create.email:
        statement = select(User).where(User.email == user_create.email)
        existing_email = session.exec(statement).first()
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    # 3. Create user
    hashed_pwd = get_password_hash(user_create.password)
    db_user = User.model_validate(
        user_create, 
        update={"hashed_password": hashed_pwd}
    )
    
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    
    return db_user
