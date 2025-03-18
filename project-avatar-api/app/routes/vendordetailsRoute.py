from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List,Dict
from app.controllers.vendor_details_controller import (
    get_recruiters_for_work,  # Correct function name
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
    Fetch recruiters for type = "work" with pagination.
    Each page contains 200 rows.
    """
    # Pagination logic
    page_size = 200  # Number of rows per page
    offset = (page - 1) * page_size

    # Fetch data for the requested page
    recruiters_page = get_recruiters_for_work(db, offset=offset, limit=page_size)

    # Calculate total number of recruiters
    total_recruiters = db.query(Recruiter).filter(
        and_(
            Recruiter.clientid == 0,
            Recruiter.vendorid != 0,
            Recruiter.name.isnot(None),
            func.length(Recruiter.name) > 1,
            Recruiter.phone.isnot(None),
            func.length(Recruiter.phone) > 1,
            Recruiter.designation.isnot(None),
            func.length(Recruiter.designation) > 1,
        )
    ).count()

    # Calculate total pages
    total_pages = (total_recruiters + page_size - 1) // page_size

    return {
        "page": page,
        "page_size": page_size,
        "total_recruiters": total_recruiters,
        "total_pages": total_pages,
        "data": recruiters_page,
    }


# Create a new recruiter
@router.post("/vendordetails", response_model=RecruiterInDB)
async def create_recruiter_route(
    recruiter: RecruiterCreate,
    db: Session = Depends(get_db),
):
    """
    Create a new recruiter.
    """
    return create_recruiter(db, recruiter)

# Update an existing recruiter
@router.put("/vendordetails/{id}", response_model=RecruiterInDB)
async def update_recruiter_route(
    id: int,
    recruiter: RecruiterUpdate,
    db: Session = Depends(get_db),
):
    """
    Update a recruiter by ID.
    """
    updated_recruiter = update_recruiter(db, id, recruiter)
    if not updated_recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    return updated_recruiter

# Delete a recruiter
@router.delete("/vendordetails/{id}")
async def delete_recruiter_route(
    id: int,
    db: Session = Depends(get_db),
):
    """
    Delete a recruiter by ID.
    """
    if not delete_recruiter(db, id):
        raise HTTPException(status_code=404, detail="Recruiter not found")
    return {"message": "Recruiter deleted successfully"}