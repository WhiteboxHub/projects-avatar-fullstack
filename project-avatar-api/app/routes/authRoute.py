from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database.db import get_db
from jose import JWTError, jwt
import os
from datetime import datetime, timedelta
from app.schemas import LoginRequest
from sqlalchemy.sql import text



SECRET_KEY = os.getenv("SECRET_KEY", "your_default_secret_key")

router = APIRouter()

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
  
    user = db.execute(text("SELECT * FROM wblX.authuser WHERE uname = :username"), {"username": request.username}).fetchone()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    
    print("User details:", user._mapping)

    token_data = {"id": user.id, "username": user.uname, "exp": datetime.utcnow() + timedelta(hours=1)}
    token = jwt.encode(token_data, SECRET_KEY, algorithm="HS256")
    print(token)

    
    if user.team == 'admin':
        return {"token": token, "token_type": "bearer", "message": f"Welcome admin, {user.uname}"}
    else:
        return {"token": token, "token_type": "bearer", "user_details": dict(user), "message": f"Welcome user, {user.uname}"}

def hash_password(password: str) -> str:
    import hashlib
    return hashlib.md5(password.encode('utf-8')).hexdigest()
