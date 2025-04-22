from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Dict
from sqlalchemy import or_
from sqlalchemy import and_, func
from app.models import Recruiter as RecruiterModel
from app.controllers.vendor_details_controller import (
    get_recruiters_for_work,
    create_recruiter,
    update_recruiter,
    delete_recruiter,
)
from app.schemas import RecruiterCreate, RecruiterUpdate, RecruiterInDB
from app.database.db import get_db

router = APIRouter()

@router.get("/vendordetails", response_model=Dict)
def get_recruiters_work_route(
    page: int = Query(1, description="Page number", ge=1),
    db: Session = Depends(get_db),
):
    """
    Fetch recruiters for type = "work" with pagination (200 rows per page).
    Matches the PHP type="work" functionality.
    """
    page_size = 200
    offset = (page - 1) * page_size

    # Fetch paginated data
    recruiters_page = get_recruiters_for_work(db, offset=offset, limit=page_size)

    # Calculate total count with same filters
    total_recruiters = db.query(RecruiterModel).filter(
        and_(
            RecruiterModel.clientid == 0,
            RecruiterModel.vendorid != 0,
            RecruiterModel.name.isnot(None),
            func.length(RecruiterModel.name) > 1,
            RecruiterModel.phone.isnot(None),
            func.length(RecruiterModel.phone) > 1,
            RecruiterModel.designation.isnot(None),
            func.length(RecruiterModel.designation) > 1,
        )
    ).count()

    total_pages = (total_recruiters + page_size - 1) // page_size

    return {
        "page": page,
        "page_size": page_size,
        "total_recruiters": total_recruiters,
        "total_pages": total_pages,
        "data": recruiters_page,
    }

@router.post("/vendordetails/insert", response_model=RecruiterInDB)
async def create_recruiter_route(
    recruiter: RecruiterCreate,
    db: Session = Depends(get_db),
):
    """Create a new recruiter (matches PHP add functionality)"""
    return create_recruiter(db, recruiter)

@router.put("/vendordetails/update/{id}", response_model=RecruiterInDB)
async def update_recruiter_route(
    id: int,
    recruiter: RecruiterUpdate,
    db: Session = Depends(get_db),
):
    """Update recruiter (matches PHP edit functionality)"""
    updated_recruiter = update_recruiter(db, id, recruiter)
    if not updated_recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    return updated_recruiter

@router.delete("/vendordetails/{id}")
async def delete_recruiter_route(
    id: int,
    db: Session = Depends(get_db),
):
    """Delete recruiter (matches PHP delete functionality)"""
    if not delete_recruiter(db, id):
        raise HTTPException(status_code=404, detail="Recruiter not found")
    return {"message": "Recruiter deleted successfully"}


@router.get("/vendordetails/search", response_model=Dict)
def search_recruiters_route(
    query: str = Query(..., description="Search term for name, ID, email, or phone"),
    page: int = Query(1, description="Page number", ge=1),
    db: Session = Depends(get_db),
):
    page_size = 200
    offset = (page - 1) * page_size

    search_filter = and_(
        RecruiterModel.clientid == 0,
        RecruiterModel.vendorid != 0,
        or_(
            RecruiterModel.name.ilike(f"%{query}%"),
            RecruiterModel.id == query if query.isdigit() else False,
            RecruiterModel.email.ilike(f"%{query}%"),
            RecruiterModel.phone.ilike(f"%{query}%")
        )
    )

    # Query the database
    recruiters_query = db.query(RecruiterModel).filter(search_filter)
    
    # Get paginated results
    recruiters_page = recruiters_query.offset(offset).limit(page_size).all()
    
    # Convert SQLAlchemy models to Pydantic models
    recruiters_data = [RecruiterInDB.from_orm(recruiter) for recruiter in recruiters_page]
    
    total_recruiters = recruiters_query.count()
    total_pages = (total_recruiters + page_size - 1) // page_size

    return {
        "page": page,
        "page_size": page_size,
        "total_recruiters": total_recruiters,
        "total_pages": total_pages,
        "data": recruiters_data,
    }