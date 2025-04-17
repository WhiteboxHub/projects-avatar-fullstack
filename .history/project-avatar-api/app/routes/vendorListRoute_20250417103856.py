from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.controllers.vendorListController import (
    get_recruiters_by_vendor_detailed,
    add_recruiter,
    update_recruiter,
    delete_recruiter
)
from app.database.db import get_db
from app.schemas import RecruiterResponse, RecruiterCreate, RecruiterUpdate
from typing import Optional

router = APIRouter()

@router.get("/recruiters/by-vendor-detailed", response_model=dict)
def read_recruiters_by_vendor_detailed(
    page: int = Query(1, alias="page"),
    page_size: int = Query(10, alias="pageSize"),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    return get_recruiters_by_vendor_detailed(db, page, page_size, search)

@router.post("/recruiters/by-vendor-detailed/add", response_model=RecruiterResponse)
def create_recruiter(
    recruiter: RecruiterCreate,
    db: Session = Depends(get_db)
):
    return add_recruiter(db, recruiter)

@router.put("/recruiters/by-vendor-detailed/update/{recruiter_id}", response_model=RecruiterResponse)
def modify_recruiter(
    recruiter_id: int,
    recruiter_update: RecruiterUpdate,
    db: Session = Depends(get_db)
):
    return update_recruiter(db, recruiter_id, recruiter_update)

@router.delete("/recruiters/by-vendor-detailed/remove/{recruiter_id}")
def remove_recruiter(
    recruiter_id: int,
    db: Session = Depends(get_db)
):
    return delete_recruiter(db, recruiter_id)
