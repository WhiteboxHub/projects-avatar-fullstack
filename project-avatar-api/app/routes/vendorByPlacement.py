# # from fastapi import APIRouter, Depends, HTTPException, Query
# # from fastapi.responses import Response
# # from sqlalchemy.orm import Session
# # from typing import List
# # from app.controllers.vendorByPlacementController import (
# #     get_placement_recruiters,
# #     add_placement_recruiter,
# #     update_placement_recruiter,
# #     delete_placement_recruiter
# # )
# # from app.schemas import PlacementRecruiterInDB, PlacementRecruiterCreate, PlacementRecruiterUpdate,RecruiterByPlacementInDB
# # from app.database.db import get_db

# # router = APIRouter()

# # @router.get("/byplacementv", response_model=List[RecruiterByPlacementInDB])
# # async def get_all_recruiters_by_placement_route(
# #     page: int = Query(1, description="Page number"),
# #     page_size: int = Query(100, description="Items per page"),
# #     db: Session = Depends(get_db)
# # ):
# #     """
# #     Get recruiters with clientid = 0 and vendorid in placement table.
# #     """
# #     offset = (page - 1) * page_size
# #     recruiters = get_placement_recruiters(db, offset=offset, limit=page_size)
# #     return [
# #         RecruiterByPlacementInDB(
# #             id=recruiter.id,
# #             name=recruiter.name,
# #             email=recruiter.email,
# #             phone=recruiter.phone,
# #             designation=recruiter.designation,
# #             vendorid=recruiter.vendorid,
# #             status=recruiter.status,
# #             dob=recruiter.dob,
# #             personalemail=recruiter.personalemail,
# #             skypeid=recruiter.skypeid,
# #             linkedin=recruiter.linkedin,
# #             twitter=recruiter.twitter,
# #             facebook=recruiter.facebook,
# #             review=recruiter.review,
# #             notes=recruiter.notes,
# #             comp=recruiter.vendor.companyname if recruiter.vendor else " ",
# #         )
# #         for recruiter in recruiters
# #     ]

# # @router.post("/byplacementv/add", response_model=PlacementRecruiterInDB)
# # async def create_placement_recruiter(
# #     recruiter: PlacementRecruiterCreate, 
# #     db: Session = Depends(get_db)
# # ):
# #     """
# #     Add a placement recruiter.
# #     """
# #     return add_placement_recruiter(db, recruiter)

# # @router.put("/byplacementv/update/{id}", response_model=PlacementRecruiterInDB)
# # async def update_placement_recruiter_route(
# #     id: int,
# #     recruiter: PlacementRecruiterUpdate,
# #     db: Session = Depends(get_db)
# # ):
# #     """
# #     Update a placement recruiter.
# #     """
# #     updated_recruiter = update_placement_recruiter(db, id, recruiter)
# #     if not updated_recruiter:
# #         raise HTTPException(status_code=404, detail="Recruiter not found")
# #     return PlacementRecruiterInDB(
# #         **updated_recruiter.__dict__,
# #         comp=updated_recruiter.vendor.companyname if updated_recruiter.vendor else " "
# #     )

# # @router.delete("/byplacementv/delete/{id}")
# # async def delete_placement_recruiter_route(id: int, db: Session = Depends(get_db)):
# #     """
# #     Delete a placement recruiter.
# #     """
# #     if not delete_placement_recruiter(db, id):
# #         raise HTTPException(status_code=404, detail="Recruiter not found")
# #     return Response(status_code=204)









from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session
from typing import List, Optional
from app.controllers.vendorByPlacementController import (
    get_placement_recruiters,
    add_placement_recruiter,
    update_placement_recruiter,
    delete_placement_recruiter,
    search_placement_recruiters
)
from app.schemas import PlacementRecruiterInDB, PlacementRecruiterCreate, PlacementRecruiterUpdate, RecruiterByPlacementInDB
from app.database.db import get_db

router = APIRouter()

@router.get("/byplacementv", response_model=List[RecruiterByPlacementInDB])
async def get_all_recruiters_by_placement_route(
    page: int = Query(1, description="Page number"),
    page_size: int = Query(100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search term"),
    db: Session = Depends(get_db)
):
    """
    Get recruiters with clientid = 0 and vendorid in placement table (type=placement)
    Supports search functionality matching the PHP implementation
    """
    offset = (page - 1) * page_size
    
    if search:
        recruiters = search_placement_recruiters(db, search_term=search, offset=offset, limit=page_size)
    else:
        recruiters = get_placement_recruiters(db, offset=offset, limit=page_size)
    
    return [
        RecruiterByPlacementInDB(
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
            comp=recruiter.vendor.companyname if recruiter.vendor else " "
        )
        for recruiter in recruiters
    ]

@router.post("/byplacementv/add", response_model=PlacementRecruiterInDB)
async def create_placement_recruiter(
    recruiter: PlacementRecruiterCreate, 
    db: Session = Depends(get_db)
):
    """Add a placement recruiter (enforces clientid=0)"""
    if recruiter.clientid != 0:
        raise HTTPException(
            status_code=400,
            detail="Client ID must be 0 for vendor placement recruiters"
        )
    return add_placement_recruiter(db, recruiter)

@router.put("/byplacementv/update/{id}", response_model=PlacementRecruiterInDB)
async def update_placement_recruiter_route(
    id: int,
    recruiter: PlacementRecruiterUpdate,
    db: Session = Depends(get_db)
):
    """Update a placement recruiter (prevents changing clientid from 0)"""
    existing_recruiter = db.query(Recruiter).filter(Recruiter.id == id).first()
    if not existing_recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    if existing_recruiter.clientid != 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot update recruiter - must have clientid=0"
        )
    
    if recruiter.clientid is not None and recruiter.clientid != 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot change clientid from 0 for vendor placement recruiters"
        )
    
    updated_recruiter = update_placement_recruiter(db, id, recruiter)
    return PlacementRecruiterInDB(
        **updated_recruiter.__dict__,
        comp=updated_recruiter.vendor.companyname if updated_recruiter.vendor else " "
    )

@router.delete("/byplacementv/delete/{id}")
async def delete_placement_recruiter_route(id: int, db: Session = Depends(get_db)):
    """Delete a placement recruiter (only if clientid=0)"""
    existing_recruiter = db.query(Recruiter).filter(Recruiter.id == id).first()
    if not existing_recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    if existing_recruiter.clientid != 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete recruiter - must have clientid=0"
        )
    
    if not delete_placement_recruiter(db, id):
        raise HTTPException(status_code=404, detail="Recruiter not found")
    return Response(status_code=204)