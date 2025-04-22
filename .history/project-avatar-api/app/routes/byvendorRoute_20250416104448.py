# from fastapi import APIRouter, Depends, HTTPException, Query
# from fastapi.responses import Response
# from sqlalchemy.orm import Session
# from typing import List
# from app.controllers.byVendorController import (
#     get_all_recruiters_by_vendor,
#     add_recruiter_by_vendor,
#     update_recruiter_by_vendor,
#     delete_recruiter_by_vendor
# )
# from app.schemas import RecruiterByVendorInDB, RecruiterByVendorCreate, RecruiterByVendorUpdate
# from app.database.db import get_db

# router = APIRouter()

# @router.get("/byvendor", response_model=List[RecruiterByVendorInDB])
# async def get_all_recruiters_by_vendor_route(
#     page: int = Query(1, description="Page number"),
#     page_size: int = Query(100, description="Items per page"),
#     db: Session = Depends(get_db)
# ):
#     """
#     Get all recruiters with clientid = 0 and handle NULL values.
#     """
#     offset = (page - 1) * page_size
#     recruiters = get_all_recruiters_by_vendor(db, offset=offset, limit=page_size)
#     return [
#         RecruiterByVendorInDB(
#             id=recruiter.id,
#             name=recruiter.name,
#             email=recruiter.email,
#             phone=recruiter.phone,
#             designation=recruiter.designation,
#             vendorid=recruiter.vendorid,
#             status=recruiter.status,
#             dob=recruiter.dob,
#             personalemail=recruiter.personalemail,
#             skypeid=recruiter.skypeid,
#             linkedin=recruiter.linkedin,
#             twitter=recruiter.twitter,
#             facebook=recruiter.facebook,
#             review=recruiter.review,
#             notes=recruiter.notes,
#             comp=recruiter.vendor.companyname if recruiter.vendor else " ",
#         )
#         for recruiter in recruiters
#     ]
# @router.post("/byvendor/add", response_model=RecruiterByVendorInDB)
# async def create_recruiter_by_vendor(
#     recruiter: RecruiterByVendorCreate, 
#     db: Session = Depends(get_db)
# ):
#     """
#     Create a recruiter (clientid = 0).
#     """
#     return add_recruiter_by_vendor(db, recruiter)

# @router.put("/byvendor/update/{id}", response_model=RecruiterByVendorInDB)
# async def update_recruiter_by_vendor_route(
#     id: int,
#     recruiter: RecruiterByVendorUpdate,
#     db: Session = Depends(get_db)
# ):
#     """
#     Update a recruiter (clientid = 0).
#     """
#     updated_recruiter = update_recruiter_by_vendor(db, id, recruiter)
#     if not updated_recruiter:
#         raise HTTPException(status_code=404, detail="Recruiter not found")
#     return RecruiterByVendorInDB(
#         **updated_recruiter.__dict__,
#         comp=updated_recruiter.vendor.companyname if updated_recruiter.vendor else " "
#     )

# @router.delete("/byvendor/delete/{id}")
# async def delete_recruiter_by_vendor_route(id: int, db: Session = Depends(get_db)):
#     """
#     Delete a recruiter (clientid = 0).
#     """
#     if not delete_recruiter_by_vendor(db, id):
#         raise HTTPException(status_code=404, detail="Recruiter not found")
#     return Response(status_code=204)







from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session
from typing import List, Optional
from app.controllers.byVendorController import (
    get_all_recruiters_by_vendor,
    add_recruiter_by_vendor,
    update_recruiter_by_vendor,
    delete_recruiter_by_vendor,
    search_recruiters_by_vendor
)
from app.schemas import RecruiterByVendorInDB, RecruiterByVendorCreate, RecruiterByVendorUpdate
from app.database.db import get_db

router = APIRouter()

@router.get("/byvendor", response_model=List[RecruiterByVendorInDB])
async def get_all_recruiters_by_vendor_route(
    page: int = Query(1, description="Page number"),
    page_size: int = Query(100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search term"),
    db: Session = Depends(get_db)
):
    """
    Get all recruiters with clientid = 0 (type=vendor)
    Supports search functionality matching the PHP implementation
    """
    offset = (page - 1) * page_size
    
    if search:
        recruiters = search_recruiters_by_vendor(db, search_term=search, offset=offset, limit=page_size)
    else:
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
    Create a recruiter (clientid = 0 enforced)
    """
    # Enforce clientid=0 for vendor recruiters
    if recruiter.clientid != 0:
        raise HTTPException(
            status_code=400,
            detail="Client ID must be 0 for vendor recruiters"
        )
    return add_recruiter_by_vendor(db, recruiter)

@router.put("/byvendor/update/{id}", response_model=RecruiterByVendorInDB)
async def update_recruiter_by_vendor_route(
    id: int,
    recruiter: RecruiterByVendorUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a recruiter (clientid remains 0)
    """
    # First verify this is a vendor recruiter
    existing_recruiter = db.query(Recruiter).filter(Recruiter.id == id).first()
    if not existing_recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    if existing_recruiter.clientid != 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot update recruiter - must have clientid=0"
        )
    
    # Prevent changing clientid from 0
    if recruiter.clientid is not None and recruiter.clientid != 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot change clientid from 0 for vendor recruiters"
        )
    
    updated_recruiter = update_recruiter_by_vendor(db, id, recruiter)
    return RecruiterByVendorInDB(
        **updated_recruiter.__dict__,
        comp=updated_recruiter.vendor.companyname if updated_recruiter.vendor else " "
    )

@router.delete("/byvendor/delete/{id}")
async def delete_recruiter_by_vendor_route(id: int, db: Session = Depends(get_db)):
    """
    Delete a recruiter (only if clientid = 0)
    """
    # First verify this is a vendor recruiter
    existing_recruiter = db.query(Recruiter).filter(Recruiter.id == id).first()
    if not existing_recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    if existing_recruiter.clientid != 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete recruiter - must have clientid=0"
        )
    
    if not delete_recruiter_by_vendor(db, id):
        raise HTTPException(status_code=404, detail="Recruiter not found")
    return Response(status_code=204)