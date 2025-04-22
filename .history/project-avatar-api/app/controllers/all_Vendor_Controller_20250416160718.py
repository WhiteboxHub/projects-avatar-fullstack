from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.database.db import get_db
from app.models import Recruiter, Vendor
from app.schemas import RecruiterResponse
from typing import Optional

router = APIRouter()

def get_vendor_recruiters(
    db: Session,
    page: int = 1,
    page_size: int = 1000,
    sort_field: Optional[str] = "status",
    sort_order: Optional[str] = "asc",
    search_term: Optional[str] = None
):
    # Base query
    query = db.query(
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
        Recruiter.notes
    ).outerjoin(Vendor, Recruiter.vendorid == Vendor.id)

    # Apply filters for "vendor" type
    query = query.filter(
        Recruiter.clientid == 0,
        Recruiter.vendorid != 0,
        Recruiter.name.isnot(None),
        func.length(Recruiter.name) > 1,
        Recruiter.phone.isnot(None),
        func.length(Recruiter.phone) > 1,
        Recruiter.designation.isnot(None),
        func.length(Recruiter.designation) > 1
    )

    # Apply search if provided
    if search_term and search_term.strip():
        search_term = f"%{search_term.strip()}%"
        query = query.filter(
            or_(
                Recruiter.name.ilike(search_term),
                Recruiter.email.ilike(search_term),
                Recruiter.phone.ilike(search_term),
                Recruiter.designation.ilike(search_term),
                Vendor.companyname.ilike(search_term),
                Recruiter.status.ilike(search_term),
                Recruiter.personalemail.ilike(search_term),
                Recruiter.skypeid.ilike(search_term),
                Recruiter.linkedin.ilike(search_term),
                Recruiter.twitter.ilike(search_term),
                Recruiter.facebook.ilike(search_term),
                Recruiter.notes.ilike(search_term)
            )
        )

    # Apply sorting
    if sort_field and sort_order:
        sort_column = getattr(Recruiter, sort_field, Recruiter.status)
        if sort_order.lower() == 'desc':
            sort_column = sort_column.desc()
        query = query.order_by(sort_column)

    # Get total count before pagination
    total = query.count()

    # Apply pagination
    recruiters = query.offset((page - 1) * page_size).limit(page_size).all()

    # Convert to response format
    recruiter_data = []
    for recruiter in recruiters:
        # Convert SQLAlchemy row to dictionary
        recruiter_dict = {column: getattr(recruiter, column) for column in recruiter._fields}
        recruiter_data.append(recruiter_dict)

    return {
        "data": recruiter_data,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": (total + page_size - 1) // page_size,
        "records": len(recruiter_data)
    }

def add_recruiter(db: Session, recruiter_data: dict) -> RecruiterResponse:
    # Set default clientid to 0 if not provided to avoid IntegrityError
    if 'clientid' not in recruiter_data or recruiter_data['clientid'] is None:
        recruiter_data['clientid'] = 0

    new_recruiter = Recruiter(**recruiter_data)
    db.add(new_recruiter)
    db.commit()
    db.refresh(new_recruiter)
    return RecruiterResponse.from_orm(new_recruiter)

def update_recruiter(db: Session, recruiter_id: int, recruiter_data: dict) -> RecruiterResponse:
    recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")

    # Ensure clientid is not set to None
    if 'clientid' in recruiter_data and recruiter_data['clientid'] is None:
        recruiter_data['clientid'] = 0

    for key, value in recruiter_data.items():
        if hasattr(recruiter, key):
            setattr(recruiter, key, value)

    db.commit()
    db.refresh(recruiter)
    return RecruiterResponse.from_orm(recruiter)

def delete_recruiter(db: Session, recruiter_id: int) -> dict:
    recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")

    recruiter.status = 'D'  # Soft delete by setting status to 'D'
    db.commit()
    return {"message": "Recruiter deleted successfully"}
