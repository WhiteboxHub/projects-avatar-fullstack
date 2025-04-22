# routes/byVendor.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database.db import get_db
from app.controllers.byVendorController import (
    get_recruiters_by_vendor,
    get_vendor_options,
    create_vendor_recruiter,
    update_vendor_recruiter,
    delete_vendor_recruiter,
    get_vendor_recruiter
)
from app.schemas import (
    RecruiterCreate,
    RecruiterUpdate,
    RecruiterResponse,
    VendorOption
)

router = APIRouter()

@router.get("/recruiters/by-vendor")
async def read_recruiters_by_vendor(
    page: int = Query(1, alias="page"),
    page_size: int = Query(1000, alias="pageSize"),
    type: str = Query("vendor", alias="type"),
    search: Optional[str] = Query(None, alias="search"),
    db: Session = Depends(get_db)
):
    return get_recruiters_by_vendor(db, page, page_size, type, search)

@router.get("/recruiters/byVendor/vendors", response_model=List[VendorOption])
async def get_vendors_for_dropdown(db: Session = Depends(get_db)):
    return get_vendor_options(db)

@router.post("/recruiters/byVendor/add", response_model=RecruiterResponse)
async def add_vendor_recruiter(
    recruiter: RecruiterCreate,
    db: Session = Depends(get_db)
):
    return create_vendor_recruiter(db, recruiter)

@router.put("/recruiters/byVendor/update/{recruiter_id}", response_model=RecruiterResponse)
async def edit_vendor_recruiter(
    recruiter_id: int,
    recruiter: RecruiterUpdate,
    db: Session = Depends(get_db)
):
    return update_vendor_recruiter(db, recruiter_id, recruiter)

@router.delete("/recruiters/byVendor/remove/{recruiter_id}")
async def remove_vendor_recruiter(
    recruiter_id: int,
    db: Session = Depends(get_db)
):
    return delete_vendor_recruiter(db, recruiter_id)

@router.get("/recruiters/byVendor/{recruiter_id}", response_model=RecruiterResponse)
async def view_vendor_recruiter(
    recruiter_id: int,
    db: Session = Depends(get_db)
):
    return get_vendor_recruiter(db, recruiter_id)