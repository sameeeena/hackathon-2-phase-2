from datetime import datetime, timedelta
from typing import Optional, Union, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlmodel import Session
import os
from dotenv import load_dotenv

# Load env
load_dotenv()

# Config
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token") # Note: /token is the relative URL

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Circular import prevention: We need to get user from DB, but models might import security?
# Usually models import sqlmodel.
# Routes import security.
# Security needs DB session to get user?
# Actually, existing get_current_user returned user_id (str) from token.
# To be compatible with 'todos.py' which expects user_id as string (sub),
# we can just return the sub from token.
# BUT, we should probably verify user exists in DB if we want to be strict.
# For now, to match previous behavior (just validation), we decode token and return sub.

def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub") # We will use username (or user_id) as sub
        if username is None:
            raise credentials_exception
        # In the previous implementation, it returned user_id. 
        # If we use username as ID, that's fine. 
        # Or we can store ID in sub.
        # Let's assume sub holds the unique identifier used in Todo.user_id
        return username
    except JWTError:
        raise credentials_exception