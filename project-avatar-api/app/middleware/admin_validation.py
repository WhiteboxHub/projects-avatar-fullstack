from fastapi import Depends, HTTPException, Request
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.database.db import get_db  
from app.config import settings
from app.models import User,Candidate  

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"  


def admin_validation(request: Request, db: Session = Depends(get_db)):
        auth_header = request.headers.get("Authorization")
        
        if not auth_header:
            raise HTTPException(status_code=401, detail="Token not provided")

        token = auth_header.split(" ")[1] if "Bearer" in auth_header else auth_header.split(" ")[0]

        try:
            decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username = decoded_token.get("username")

            if not username:
                raise HTTPException(status_code=403, detail="Token missing 'username' claim")

        except JWTError as e:
            error_message = str(e).lower()
            if "expired" in error_message:
                raise HTTPException(status_code=401, detail="Token has expired")
            raise HTTPException(status_code=403, detail="Invalid or expired token")

        user = db.query(Candidate).filter(Candidate.name == username).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        request.state.user = user
        return user