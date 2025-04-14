from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database.db import get_db
from jose import JWTError, jwt
import os
from datetime import datetime, timedelta
from app.schemas import LoginRequest
from sqlalchemy.sql import text
import hashlib
import secrets
from typing import List


# Use a strong secret key, preferably from environment variables
SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_hex(32))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Define allowed origins
ALLOWED_ORIGINS = [
    "https://www.whitebox-learning.com",
    "https://whitebox-learning.com",
    "https://www.whitebox-learning.com/admin",
    "http://localhost:3000/admin",
    "http://localhost:8000"
]

router = APIRouter()

@router.post("/login")
async def login(request: LoginRequest, req: Request, db: Session = Depends(get_db)):
    # Validate origin
    origin = req.headers.get("origin", "")
    if origin and origin not in ALLOWED_ORIGINS:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access from this origin is not allowed"
        )
    
    # Check for empty credentials
    if not request.username or not request.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username and password are required"
        )
    
    # Get user from database
    user = db.execute(text("SELECT * FROM whiteboxqa.authuser WHERE uname = :username"), 
                     {"username": request.username}).fetchone()
    
    if not user:
        # Use generic error message to prevent username enumeration
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid credentials"
        )
    
    # Verify password (assuming password is stored as MD5 hash)
    hashed_password = hash_password(request.password)
    stored_password = user.passwd if hasattr(user, 'passwd') else None
    
    if not stored_password or hashed_password != stored_password:
        # Use generic error message
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid credentials"
        )
    
    # Create token with more claims and shorter expiry
    token_data = {
        "sub": str(user.id),
        "username": user.uname,
        "team": user.team,
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        "jti": secrets.token_hex(16)  # Unique token ID
    }
    
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    
    # Return appropriate response based on user role
    if user.team == 'admin':
        return {
            "token": token, 
            "token_type": "bearer",
            "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "message": f"Welcome {user.uname}"
        }
    else:
        # Convert SQLAlchemy row to dict safely
        user_dict = {column: getattr(user, column) for column in user._mapping.keys()}
        # Remove sensitive information
        if 'passwd' in user_dict:
            del user_dict['passwd']
            
        return {
            "token": token, 
            "token_type": "bearer",
            "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "user_details": user_dict,
            "message": f"Welcome {user.uname}"
        }

def hash_password(password: str) -> str:
    """Hash password using MD5 (Note: MD5 is not recommended for production)"""
    return hashlib.md5(password.encode('utf-8')).hexdigest()
