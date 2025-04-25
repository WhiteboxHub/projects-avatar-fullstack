# avatar/projects-avatar-api/app/routes/accessRoute.py

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.controllers.accessController import (
    get_authuser_list, search_authusers, get_authuser_by_uname, create_authuser, update_authuser, delete_authuser, get_authuser_stats
)
from app.schemas import AuthUserCreateSchema, AuthUserUpdateSchema
from typing import Optional, Dict, Any, List

router = APIRouter()

@router.get("/authuser")
def read_authuser(
    request: Request,
    page: int = Query(1, gt=0, description="Page number starting from 1"), 
    page_size: int = Query(100, gt=0, le=1000, description="Number of items per page (max 1000)"),
    sort_field: str = Query("lastlogin", description="Field to sort by"),
    sort_order: str = Query("desc", description="Sort order (asc or desc)"),
    db: Session = Depends(get_db)
):
    # Calculate skip value for pagination
    skip = (page - 1) * page_size
    
    # Extract filter parameters from query params
    filters = {}
    for param, value in request.query_params.items():
        if param not in ['page', 'page_size', 'sort_field', 'sort_order'] and value:
            filters[param] = value
            
    # Get paginated results with total count for proper pagination
    return get_authuser_list(db, skip=skip, limit=page_size, sort_field=sort_field, sort_order=sort_order, filters=filters)

@router.get("/authuser/search")
def search_authuser(
    search_term: str = Query(..., description="Term to search for"),
    fields: List[str] = Query(None, description="Fields to search in (defaults to uname and fullname)"),
    db: Session = Depends(get_db)
):
    results = search_authusers(db, search_term, fields)
    return {"data": results, "totalRows": len(results)}

@router.get("/authuser/search/{authuser_uname}")
def read_authuser_by_uname(authuser_uname: str, db: Session = Depends(get_db)):
    authuser = get_authuser_by_uname(db, authuser_uname)
    if not authuser:
        raise HTTPException(status_code=404, detail="AuthUser not found")
    return {"data": authuser, "totalRows": len(authuser)}

@router.get("/authuser/stats")
def get_stats(db: Session = Depends(get_db)):
    return get_authuser_stats(db)

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
    result = delete_authuser(db, authuser_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result