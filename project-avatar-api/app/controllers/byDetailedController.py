from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.db import get_db
from app.models import Recruiter, Client
from app.schemas import RecruiterResponse
from typing import Optional

router = APIRouter()

def get_recruiter_details(
    db: Session, 
    page: int = 1,
    page_size: int = 1000,
    sort_field: Optional[str] = "status",
    sort_order: Optional[str] = "asc"
):
    # Base query
    query = db.query(
        Recruiter.id,
        Recruiter.name,
        Recruiter.email,
        Recruiter.phone,
        Recruiter.designation,
        Recruiter.clientid,
        func.coalesce(Client.companyname, " ").label("comp"),
        Recruiter.status,
        Recruiter.dob,
        Recruiter.personalemail,
        Recruiter.skypeid,
        Recruiter.linkedin,
        Recruiter.twitter,
        Recruiter.facebook,
        Recruiter.review,
        Recruiter.notes
    ).outerjoin(Client, Recruiter.clientid == Client.id)

    # Apply filters for "cwork" type - matching the PHP code's cwork condition
    query = query.filter(
        Recruiter.vendorid == 0,
        Recruiter.clientid != 0,
        Recruiter.name.isnot(None),
        func.length(Recruiter.name) > 1,
        Recruiter.phone.isnot(None),
        func.length(Recruiter.phone) > 1,
        Recruiter.designation.isnot(None),
        func.length(Recruiter.designation) > 1
    )

    # Apply sorting - matching PHP's sortname for cwork type
    if sort_field and sort_order:
        if sort_field == "status" and sort_order.lower() == "asc":
            # Default sorting for cwork type in PHP is "status asc, email"
            query = query.order_by(Recruiter.status.asc(), Recruiter.email.asc())
        else:
            sort_column = getattr(Recruiter, sort_field, Recruiter.status)
            if sort_order.lower() == 'desc':
                sort_column = sort_column.desc()
            query = query.order_by(sort_column)

    # Get total count before pagination
    total = query.count()

    # Apply pagination
    recruiters = query.offset((page - 1) * page_size).limit(page_size).all()
    
    # Convert to response format
    recruiter_data = [RecruiterResponse.from_orm(recruiter) for recruiter in recruiters]
    
    return {
        "data": recruiter_data,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": (total + page_size - 1) // page_size,
        "records": len(recruiter_data)
    }

def add_recruiter(db: Session, recruiter_data: dict) -> RecruiterResponse:
    # Set default vendorid to 0 if not provided to avoid IntegrityError
    if 'vendorid' not in recruiter_data or recruiter_data['vendorid'] is None:
        recruiter_data['vendorid'] = 0
        
    new_recruiter = Recruiter(**recruiter_data)
    db.add(new_recruiter)
    db.commit()
    db.refresh(new_recruiter)
    return RecruiterResponse.from_orm(new_recruiter)

def update_recruiter(db: Session, recruiter_id: int, recruiter_data: dict) -> RecruiterResponse:
    recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    
    # Ensure vendorid is not set to None
    if 'vendorid' in recruiter_data and recruiter_data['vendorid'] is None:
        recruiter_data['vendorid'] = 0
    
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