# from fastapi import APIRouter, Depends, HTTPException, status, Request
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from sqlalchemy.orm import Session
# from app.database.db import get_db
# from jose import JWTError, jwt
# import os
# from datetime import datetime, timedelta
# from app.schemas import LoginRequest
# from sqlalchemy.sql import text
# import hashlib
# import secrets
# from typing import List
# from app.controllers.auth_middleware import verify_token
# from app.controllers.auth_controller import get_user_by_uname, verify_md5_hash, create_access_token
# from app.config import settings


# # Use a strong secret key from environment variables
# SECRET_KEY = settings.SECRET_KEY
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 30

# # Define allowed origins - match with main.py
# ALLOWED_ORIGINS = [
#     "https://www.whitebox-learning.com",
#     "https://whitebox-learning.com",
#     "https://www.whitebox-learning.com/admin"
#     "http://localhost:3000",
#     "http://127.0.0.1:3000",
#     "http://localhost:8000",
#     "http://127.0.0.1:8000"
# ]

# router = APIRouter()

# @router.post("/login")
# async def login(request: LoginRequest, req: Request, db: Session = Depends(get_db)):
#     try:
#         # Validate origin
#         origin = req.headers.get("origin", "")
#         if origin and origin not in ALLOWED_ORIGINS:
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail="Access from this origin is not allowed"
#             )
        
#         # Check for empty credentials
#         if not request.username or not request.password:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Username and password are required"
#             )
        
#         # Get user from database
#         user = db.execute(text("SELECT * FROM whiteboxqa.authuser WHERE uname = :username"), 
#                          {"username": request.username}).fetchone()
        
#         if not user:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED, 
#                 detail="Invalid credentials"
#             )
        
#         # Verify password
#         hashed_password = hash_password(request.password)
#         stored_password = user.passwd if hasattr(user, 'passwd') else None
        
#         if not stored_password or hashed_password != stored_password:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED, 
#                 detail="Invalid credentials"
#             )
        
#         # Create token with appropriate expiration
#         token_data = {
#             "sub": str(user.id),
#             "username": user.uname,
#             "team": user.team,
#             "iat": datetime.utcnow(),
#             "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
#             "jti": secrets.token_hex(16)  # Unique token ID to prevent replay attacks
#         }
        
#         token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
        
#         # Return response
#         response_data = {
#             "token": token,
#             "token_type": "bearer",
#             "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
#             "message": f"Welcome {user.uname}"
#         }
        
#         if user.team != 'admin':
#             user_dict = {column: getattr(user, column) for column in user._mapping.keys()}
#             if 'passwd' in user_dict:
#                 del user_dict['passwd']  # Never return password in response
#             response_data["user_details"] = user_dict
            
#         return response_data
        
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         print(f"Login error: {str(e)}")  # For debugging
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="An error occurred during login"
#         )

# def hash_password(password: str) -> str:
#     """Hash password using MD5 (Note: MD5 is not recommended for production)"""
#     return hashlib.md5(password.encode('utf-8')).hexdigest()

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


# Use a strong secret key from environment variables
SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_hex(32))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # Increased to 24 hours (1440 minutes)

# Define allowed origins - match with main.py
ALLOWED_ORIGINS = [
    "https://www.whitebox-learning.com",
    "https://whitebox-learning.com",
    "https://www.whitebox-learning.com/admin",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000"
]

router = APIRouter()

@router.post("/login")
async def login(request: LoginRequest, req: Request, db: Session = Depends(get_db)):
    try:
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
        user = db.execute(text("SELECT * FROM wblX.authuser WHERE uname = :username"), 
                         {"username": request.username}).fetchone()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid credentials"
            )
        
        # Verify password
        hashed_password = hash_password(request.password)
        stored_password = user.passwd if hasattr(user, 'passwd') else None
        
        if not stored_password or hashed_password != stored_password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid credentials"
            )
        
        # Create token with longer expiration
        token_data = {
            "sub": str(user.id),
            "username": user.uname,
            "team": user.team,
            "iat": datetime.utcnow(),
            "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
            "jti": secrets.token_hex(16)  # Unique token ID to prevent replay attacks
        }
        
        token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
        
        # Return response
        response_data = {
            "token": token,
            "token_type": "bearer",
            "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "message": f"Welcome {user.uname}"
        }
        
        # Include user details for all users
        user_dict = {column: getattr(user, column) for column in user._mapping.keys()}
        if 'passwd' in user_dict:
            del user_dict['passwd']  # Never return password in response
        response_data["user_details"] = user_dict
            
        return response_data
        
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Login error: {str(e)}")  # For debugging
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during login"
        )

def hash_password(password: str) -> str:
    """Hash password using MD5 (Note: MD5 is not recommended for production)"""
    return hashlib.md5(password.encode('utf-8')).hexdigest()