import os
from sqlalchemy.orm import Session
from app.models import User
from jose import JWTError, jwt
from datetime import datetime, timedelta
import hashlib


SECRET_KEY = os.getenv('SECRET_KEY')  
ALGORITHM = "HS256"

def get_user_by_uname(db: Session, username: str):
    """Fetch the user by username."""
    return db.query(User).filter(User.uname == username).first()

def md5_hash(password: str) -> str:
    """Hash the password using MD5."""
    return hashlib.md5(password.encode('utf-8')).hexdigest()

def verify_md5_hash(plain_password: str, hashed_password: str) -> bool:
    """Verify the password using MD5 hash."""
    return md5_hash(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=1)):
    """Create a JWT token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_user(db: Session, username: str, password: str):
    """Create a new user with MD5 hashed password."""
    hashed_password = md5_hash(password)  
    new_user = User(uname=username, passwd=hashed_password)  
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
