from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import Recruiter, Vendor, Placement
from app.schemas import RecruiterCreate, RecruiterUpdate, RecruiterResponse
from sqlalchemy import func, distinct
from typing import Optional

def get_recruiters_by_vendor_detailed(
    db: Session,
    page: int,
    page_size: int,
    search: Optional[str] = None
):
    # First get distinct vendorids from placement table
    placement_subquery = (
        db.query(distinct(Placement.vendorid))
        .filter(Placement.vendorid != 0)
        .subquery()
    )

    # Main query
    query = (
        db.query(
            Recruiter.id,
            Recruiter.name,
            Recruiter.email,
            Recruiter.phone,
            Recruiter.designation,
            Recruiter.vendorid,
            func.coalesce(Vendor.companyname, " ").label("comp"),
            Recruiter.status,
            Recruiter.dob,
            Recruiter.personalemail,
            Recruiter.skypeid,
            Recruiter.linkedin,
            Recruiter.twitter,
            Recruiter.facebook,
            Recruiter.review,
            Recruiter.notes,
            # Recruiter.employeeid,
            # Recruiter.lastmoddatetime
        )
        .join(Vendor, Vendor.id == Recruiter.vendorid, isouter=True)
        .filter(
            Recruiter.clientid == 0,
            Recruiter.vendorid.in_(placement_subquery)
        )
    )

    # Apply search if provided
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Recruiter.name.ilike(search_term)) |
            (Recruiter.email.ilike(search_term)) |
            (Vendor.companyname.ilike(search_term))
        )

    # Get total count before pagination
    total = query.count()

    # Add sorting
    query = query.order_by(Vendor.companyname.asc(), Recruiter.status.asc())

    # Apply pagination
    recruiters = query.offset((page - 1) * page_size).limit(page_size).all()

    # Group data by vendor
    grouped_data = {}
    for recruiter in recruiters:
        vendor_id = recruiter.vendorid
        if vendor_id not in grouped_data:
            grouped_data[vendor_id] = {
                "vendorid": vendor_id,
                "companyname": recruiter.comp,
                "recruiters": []
            }
        grouped_data[vendor_id]["recruiters"].append(RecruiterResponse.from_orm(recruiter))

    return {
        "data": list(grouped_data.values()),
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": (total + page_size - 1) // page_size
    }

def add_recruiter(db: Session, recruiter: RecruiterCreate):
    new_recruiter = Recruiter(**recruiter.dict())
    new_recruiter.clientid = 0  # Ensure clientid is 0 for vendor recruiters
    db.add(new_recruiter)
    db.commit()
    db.refresh(new_recruiter)
    return RecruiterResponse.from_orm(new_recruiter)

def update_recruiter(db: Session, recruiter_id: int, recruiter_update: RecruiterUpdate):
    recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")

    update_data = recruiter_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(recruiter, key, value)

    db.commit()
    db.refresh(recruiter)
    return RecruiterResponse.from_orm(recruiter)

def delete_recruiter(db: Session, recruiter_id: int):
    recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    db.delete(recruiter)
    db.commit()
    return {"detail": "Recruiter deleted successfully"}
