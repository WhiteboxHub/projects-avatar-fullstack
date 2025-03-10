from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from typing import Optional
from pydantic import BaseModel
from app.models import User


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


SECRET_KEY = "your_secret_key"  
ALGORITHM = "HS256"  



def verify_token(token: str = Depends(oauth2_scheme)) -> User:
    try:

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user = User(username=payload.get("username"), email=payload.get("email"))
        if user.username is None or user.email is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid token: Missing user info",
            )
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid token"
        )
