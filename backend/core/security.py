from typing import Optional, Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt # PyJWT
from jwt.algorithms import get_default_algorithms
from jwt import PyJWKClient
from pydantic import BaseModel
import os
import httpx
from dotenv import load_dotenv

# Robustly load .env from backend directory
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
env_path = os.path.join(backend_dir, ".env")
load_dotenv(env_path)

# Configuration
BETTER_AUTH_URL = os.getenv("BETTER_AUTH_URL", "http://localhost:3000")
JWKS_URL = f"{BETTER_AUTH_URL}/api/auth/jwks"

print(f"Security: JWKS URL configured as {JWKS_URL}")

# OAuth2PasswordBearer allows extracting the token from the Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

# Initialize PyJWKClient
jwks_client = PyJWKClient(JWKS_URL)

def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    """
    Validates the JWT token using JWKS (EdDSA support via PyJWT).
    Returns the user_id (sub claim) if valid.
    """
    if not token:
        print("Authentication Error: Missing Token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated (Missing Token)",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        # 1. Get the signing key from JWKS
        # PyJWKClient handles fetching and caching automatically
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        
        # 2. Decode and verify
        # PyJWT automatically verifies signature using the key
        # We allow EdDSA and HMAC (in case it changes back)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["EdDSA", "HS256", "RS256"],
            options={"verify_aud": False} # Better Auth might not set audience
        )
        
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token missing 'sub' claim",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        return user_id

    except jwt.PyJWTError as e:
        print(f"JWT Verification Error: {str(e)}")
        # Try to decode header for debugging
        try:
            header = jwt.get_unverified_header(token)
            print(f"Token Header: {header}")
        except:
            pass
            
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        print(f"Unexpected Auth Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )
