from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from database import get_db
from controllers.searchController import search_candidates_by_name
from middleware.AdminValidationMiddleware import admin_validation_middleware

router = APIRouter()
@router.get("/searchByName")
def search_by_name(name: str, db: Session = Depends(get_db), auth: bool = Depends(admin_validation_middleware)):
    if not auth:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    return search_candidates_by_name(name, db)