from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.controllers.all_Vendor_Controller import get_vendor_recruiters, add_recruiter, update_recruiter, delete_recruiter
from app.database.db import get_db
from app.schemas import RecruiterResponse, RecruiterCreate, RecruiterUpdate
from typing import Optional

router = APIRouter()

@router.get("/recruiters/byVendorList", response_model=dict)
def read_vendor_recruiters(
    page: int = Query(1, alias="page"),
    page_size: int = Query(1000, alias="pageSize"),
    sort_field: Optional[str] = Query("status", alias="sortField"),
    sort_order: Optional[str] = Query("asc", alias="sortOrder"),
    search_term: Optional[str] = Query(None, alias="searchTerm"),
    db: Session = Depends(get_db)
):
    return get_vendor_recruiters(db, page, page_size, sort_field, sort_order, search_term)

@router.post("/recruiters/byVendorList/add", response_model=RecruiterResponse)
def create_recruiter(recruiter: RecruiterCreate, db: Session = Depends(get_db)):
    recruiter_dict = recruiter.dict()
    return add_recruiter(db, recruiter_dict)

@router.put("/recruiters/byVendorList/update/{recruiter_id}", response_model=RecruiterResponse)
def modify_recruiter(recruiter_id: int, recruiter: RecruiterUpdate, db: Session = Depends(get_db)):
    recruiter_dict = recruiter.dict(exclude_unset=True)
    return update_recruiter(db, recruiter_id, recruiter_dict)

@router.delete("/recruiters/byVendorList/remove/{recruiter_id}", response_model=dict)
def remove_recruiter(recruiter_id: int, db: Session = Depends(get_db)):
    return delete_recruiter(db, recruiter_id)
