# routes/byVendor.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database.db import get_db
from app.controllers.byVendorController import (
    get_vendors_with_contacts,
    get_vendor_options,
    create_vendor_contact,
    update_vendor_contact,
    delete_vendor_contact,
    get_vendor_contact
)
from app.schemas import (
    ContactCreate,
    ContactUpdate,
    ContactResponse,
    VendorOption
)

router = APIRouter(prefix="/api/admin", tags=["Vendor Contacts"])

@router.get("/byvendor", summary="Get vendor contacts with pagination")
async def read_vendor_contacts(
    page: int = Query(1, alias="page"),
    page_size: int = Query(100, alias="pageSize"),
    type: str = Query("vendor", alias="type"),
    search: Optional[str] = Query(None, alias="search"),
    db: Session = Depends(get_db)
):
    return get_vendors_with_contacts(db, page, page_size, type, search)

@router.get("/vendors/options", response_model=List[VendorOption], summary="Get vendor dropdown options")
async def get_vendors_for_dropdown(db: Session = Depends(get_db)):
    return get_vendor_options(db)

@router.post("/vendors/contacts/add", response_model=ContactResponse, summary="Add new vendor contact")
async def add_vendor_contact(
    contact: ContactCreate,
    db: Session = Depends(get_db)
):
    return create_vendor_contact(db, contact)

@router.put("/vendors/contacts/update/{contact_id}", response_model=ContactResponse, summary="Update vendor contact")
async def edit_vendor_contact(
    contact_id: int,
    contact: ContactUpdate,
    db: Session = Depends(get_db)
):
    return update_vendor_contact(db, contact_id, contact)

@router.delete("/vendors/contacts/remove/{contact_id}", summary="Delete vendor contact")
async def remove_vendor_contact(
    contact_id: int,
    db: Session = Depends(get_db)
):
    return delete_vendor_contact(db, contact_id)

@router.get("/vendors/contacts/{contact_id}", response_model=ContactResponse, summary="Get vendor contact details")
async def view_vendor_contact(
    contact_id: int,
    db: Session = Depends(get_db)
):
    return get_vendor_contact(db, contact_id)