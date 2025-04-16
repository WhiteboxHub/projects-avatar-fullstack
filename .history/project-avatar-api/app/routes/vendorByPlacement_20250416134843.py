from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.schemas import RecruiterCreate, RecruiterUpdate, RecruiterResponse
from app.controllers.v import (
    get_recruiters_by_vendor_placement,
    add_recruiter,
    update_recruiter,
    delete_recruiter
)
from typing import Optional

router = APIRouter()

@router.get("/recruiters/by-vendor-placement", response_model=dict)
def read_recruiters_by_vendor_placement(
    page: int = Query(1, alias="page"),
    page_size: int = Query(100, alias="pageSize"),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    return get_recruiters_by_vendor_placement(db, page, page_size, search)

@router.post("/recruiters/by-vendor-placement/add", response_model=RecruiterResponse)
def create_recruiter(
    recruiter: RecruiterCreate,
    db: Session = Depends(get_db)
):
    return add_recruiter(db, recruiter)

@router.put("/recruiters/by-vendor-placement/update/{recruiter_id}", response_model=RecruiterResponse)
def modify_recruiter(
    recruiter_id: int,
    recruiter_update: RecruiterUpdate,
    db: Session = Depends(get_db)
):
    return update_recruiter(db, recruiter_id, recruiter_update)

@router.delete("/recruiters/by-vendor-placement/remove/{recruiter_id}")
def remove_recruiter(
    recruiter_id: int,
    db: Session = Depends(get_db)
):
    return delete_recruiter(db, recruiter_id)
