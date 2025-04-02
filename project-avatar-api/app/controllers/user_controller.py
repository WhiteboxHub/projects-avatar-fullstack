# # avatar/projects-avatar-api/app/controllers/user_controller.py

# import os
# from datetime import datetime, timedelta
# from fastapi import HTTPException, Depends
# from sqlalchemy.orm import Session
# from jose import JWTError, jwt
# from pydantic import BaseModel
# from app.models import User
# from app.database.db import get_db  
# import hashlib  


# SECRET_KEY = os.getenv('SECRET_KEY')
# ALGORITHM = "HS256"

# class LoginRequest(BaseModel):
#     uname: str
#     passwd: str

# def verify_password(stored_password: str, provided_password: str) -> bool:
#     """
#     Verifies if the provided password matches the stored hashed password.
#     Assumes passwords are stored as MD5 hashes.
#     """
#     return stored_password == hashlib.md5(provided_password.encode()).hexdigest()

# def get_user_by_uname(db: Session, username: str):
#     """
#     Retrieves a user from the database by their username.
#     """
#     return db.query(User).filter(User.uname == username).first()

# async def login(request: LoginRequest, db: Session = Depends(get_db)):
#     """
#     Endpoint for user login. Verifies the provided username and password.
#     Returns a JWT token if credentials are valid, or raises HTTP exceptions otherwise.
#     """
#     uname = request.uname
#     passwd = request.passwd

#     user = get_user_by_uname(db, uname)
#     if not user:
#         raise HTTPException(status_code=401, detail="Invalid username or password")

#     if not verify_password(user.passwd, passwd):
#         raise HTTPException(status_code=401, detail="Invalid username or password")

    
#     if user.team != "admin":
#         raise HTTPException(status_code=403, detail="Unauthorized team")

#     token_payload = {
#         "id": user.id,
#         "username": user.uname,
#         "exp": datetime.utcnow() + timedelta(hours=1)  
#     }
#     token = jwt.encode(token_payload, SECRET_KEY, algorithm=ALGORITHM)

#     return {"token": token, "message": f"Welcome back, {user.uname}!"}
