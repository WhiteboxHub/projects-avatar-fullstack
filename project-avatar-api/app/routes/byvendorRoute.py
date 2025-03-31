from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session
from typing import List
from app.controllers.byVendorController import (
    get_all_recruiters_by_vendor,
    add_recruiter_by_vendor,
    update_recruiter_by_vendor,
    delete_recruiter_by_vendor
)
from app.schemas import RecruiterByVendorInDB, RecruiterByVendorCreate, RecruiterByVendorUpdate
from app.database.db import get_db

router = APIRouter()

@router.get("/byvendor", response_model=List[RecruiterByVendorInDB])
async def get_all_recruiters_by_vendor_route(
    page: int = Query(1, description="Page number"),
    page_size: int = Query(100, description="Items per page"),
    db: Session = Depends(get_db)
):
    """
    Get all recruiters with clientid = 0 and handle NULL values.
    """
    offset = (page - 1) * page_size
    recruiters = get_all_recruiters_by_vendor(db, offset=offset, limit=page_size)
    return [
        RecruiterByVendorInDB(
            id=recruiter.id,
            name=recruiter.name,
            email=recruiter.email,
            phone=recruiter.phone,
            designation=recruiter.designation,
            vendorid=recruiter.vendorid,
            status=recruiter.status,
            dob=recruiter.dob,
            personalemail=recruiter.personalemail,
            skypeid=recruiter.skypeid,
            linkedin=recruiter.linkedin,
            twitter=recruiter.twitter,
            facebook=recruiter.facebook,
            review=recruiter.review,
            notes=recruiter.notes,
            comp=recruiter.vendor.companyname if recruiter.vendor else " ",
        )
        for recruiter in recruiters
    ]
@router.post("/byvendor/add", response_model=RecruiterByVendorInDB)
async def create_recruiter_by_vendor(
    recruiter: RecruiterByVendorCreate, 
    db: Session = Depends(get_db)
):
    """
    Create a recruiter (clientid = 0).
    """
    return add_recruiter_by_vendor(db, recruiter)

@router.put("/byvendor/update/{id}", response_model=RecruiterByVendorInDB)
async def update_recruiter_by_vendor_route(
    id: int,
    recruiter: RecruiterByVendorUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a recruiter (clientid = 0).
    """
    updated_recruiter = update_recruiter_by_vendor(db, id, recruiter)
    if not updated_recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    return RecruiterByVendorInDB(
        **updated_recruiter.__dict__,
        comp=updated_recruiter.vendor.companyname if updated_recruiter.vendor else " "
    )

@router.delete("/byvendor/delete/{id}")
async def delete_recruiter_by_vendor_route(id: int, db: Session = Depends(get_db)):
    """
    Delete a recruiter (clientid = 0).
    """
    if not delete_recruiter_by_vendor(db, id):
        raise HTTPException(status_code=404, detail="Recruiter not found")
    return Response(status_code=204)