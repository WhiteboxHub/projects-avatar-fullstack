from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session
from typing import List
from app.controllers.all_Vendor_Controller import (
    get_all_recruiters,
    add_recruiter,
    update_recruiter,
    view_recruiter_by_id,
    delete_recruiter
)
from app.schemas import RecruiterCreate, RecruiterUpdate, RecruiterInDB,RecruiterBase
from app.database.db import get_db
from app.models import Recruiter

router = APIRouter()

@router.get("/allvendors", response_model=dict)
async def get_all_recruiters_route(
    page: int = Query(1, description="Page number"),
    page_size: int = Query(200, description="Items per page"),
    db: Session = Depends(get_db)
):
    offset = (page - 1) * page_size
    recruiters = get_all_recruiters(db, offset=offset, limit=page_size)
    total_rows = db.query(Recruiter).filter(Recruiter.clientid == 0).count()

    return {
        "data": recruiters,
        "totalRows": total_rows
    }
    
    
@router.post("/allvendors/add", response_model=RecruiterInDB)
async def create_recruiter(recruiter: RecruiterCreate, db: Session = Depends(get_db)):
    """
    Create a new recruiter.
    """
    return add_recruiter(db, recruiter)

@router.put("/allvendors/update/{id}", response_model=RecruiterInDB)
async def update_recruiter_route(
    id: int,
    recruiter: RecruiterUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a recruiter by ID.
    """
    updated_recruiter = update_recruiter(db, id, recruiter)
    if not updated_recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    return updated_recruiter

@router.get("/allvendors/{id}", response_model=RecruiterInDB)
async def get_recruiter_by_id_route(id: int, db: Session = Depends(get_db)):
    """
    Get a single recruiter by ID.
    """
    recruiter = view_recruiter_by_id(db, id)
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    return recruiter

@router.delete("/allvendors/delete/{id}")
async def delete_recruiter_route(id: int, db: Session = Depends(get_db)):
    """
    Delete a recruiter by ID.
    """
    if not delete_recruiter(db, id):
        raise HTTPException(status_code=404, detail="Recruiter not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)