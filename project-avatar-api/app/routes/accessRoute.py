# avatar/projects-avatar-api/app/routes/accessRoute.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.controllers.accessController import (
    get_authuser_list, get_authuser_by_id, create_authuser, update_authuser, delete_authuser
)
from app.schemas import AuthUserCreateSchema, AuthUserUpdateSchema

router = APIRouter()

@router.get("/authuser")
def read_authuser(page: int = 1, page_size: int = 10, db: Session = Depends(get_db)):
    skip = (page - 1) * page_size
    return get_authuser_list(db, skip, page_size)

@router.get("/authuser/{authuser_id}")
def read_authuser_by_id(authuser_id: int, db: Session = Depends(get_db)):
    authuser = get_authuser_by_id(db, authuser_id)
    if not authuser:
        raise HTTPException(status_code=404, detail="AuthUser not found")
    return authuser

@router.post("/authuser")
def create_authuser_entry(authuser_data: AuthUserCreateSchema, db: Session = Depends(get_db)):
    return create_authuser(db, authuser_data)


@router.put("/authuser/{authuser_id}")
def update_authuser_entry(authuser_id: int, authuser_data: AuthUserUpdateSchema, db: Session = Depends(get_db)):
    result = update_authuser(db, authuser_id, authuser_data)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

@router.delete("/authuser/{authuser_id}")
def delete_authuser_entry(authuser_id: int, db: Session = Depends(get_db)):
    return delete_authuser(db, authuser_id)
