from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.database.db import get_db
from app.schemas import VendorInDB, VendorCreate, VendorUpdate
from app.controllers.vendorListController import (
    get_vendors,
    get_vendor,
    create_vendor,
    update_vendor,
    delete_vendor
)

router = APIRouter()

@router.get("/vendor", response_model=List[VendorInDB])
def read_vendors(
    page: int = Query(1, ge=1),
    page_size: int = Query(500, ge=1, le=10000),
    db: Session = Depends(get_db)
):
    skip = (page - 1) * page_size
    vendors = get_vendors(db, skip=skip, limit=page_size)
    return vendors

@router.post("/vendor", response_model=VendorInDB)
def create_vendor_route(vendor: VendorCreate, db: Session = Depends(get_db)):
    return create_vendor(db=db, vendor=vendor)

@router.get("/vendor/{vendor_id}", response_model=VendorInDB)
def read_vendor(vendor_id: int, db: Session = Depends(get_db)):
    vendor = get_vendor(db, vendor_id)
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor

@router.put("/vendor/{vendor_id}", response_model=VendorInDB)
def update_vendor_route(
    vendor_id: int,
    vendor: VendorUpdate,
    db: Session = Depends(get_db)
):
    db_vendor = update_vendor(db, vendor_id, vendor)
    if not db_vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return db_vendor

@router.delete("/vendor/{vendor_id}")
def delete_vendor_route(vendor_id: int, db: Session = Depends(get_db)):
    if not delete_vendor(db, vendor_id):
        raise HTTPException(status_code=404, detail="Vendor not found")
    return {"message": "Vendor deleted successfully"}