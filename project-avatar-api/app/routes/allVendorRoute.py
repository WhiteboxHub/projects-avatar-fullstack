from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.models import Recruiter, Vendor
from app.database.db import get_db
from app.schemas import RecruiterCreate, RecruiterUpdate, RecruiterResponse
from app.controllers.all_Vendor_Controller import get_recruiters_with_vendors, add_recruiter, update_recruiter, delete_recruiter

router = APIRouter()

@router.get("/recruiters/byAllListVendor", response_model=dict)
def read_recruiters(
    page: int = 1, 
    page_size: int = 100, 
    search: str = None, 
    db: Session = Depends(get_db)
):
    return get_recruiters_with_vendors(db, page, page_size, search)

@router.post("/recruiters/byAllListVendor/add", response_model=RecruiterResponse)
def create_recruiter(recruiter: RecruiterCreate, db: Session = Depends(get_db)):
    return add_recruiter(db, recruiter)

@router.put("/recruiters/byAllListVendor/update/{recruiter_id}", response_model=RecruiterResponse)
def edit_recruiter(recruiter_id: int, recruiter: RecruiterUpdate, db: Session = Depends(get_db)):
    return update_recruiter(db, recruiter_id, recruiter)

@router.delete("/recruiters/byAllListVendor/remove/{recruiter_id}")
def remove_recruiter(recruiter_id: int, db: Session = Depends(get_db)):
    return delete_recruiter(db, recruiter_id)