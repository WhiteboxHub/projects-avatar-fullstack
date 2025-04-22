from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.models import Recruiter, Vendor
from app.schemas import RecruiterResponse
from fastapi import HTTPException

def get_recruiters_with_vendors(db: Session, page: int, page_size: int, search: str = None):
    query = db.query(
        Recruiter.id,
        Recruiter.name,
        Recruiter.email,
        Recruiter.phone,
        Recruiter.designation,
        Recruiter.vendorid,
        func.coalesce(Vendor.companyname, " ").label('comp'),
        Recruiter.status,
        Recruiter.dob,
        Recruiter.personalemail,
        Recruiter.skypeid,
        Recruiter.linkedin,
        Recruiter.twitter,
        Recruiter.facebook,
        Recruiter.review,
        Recruiter.notes
    ).outerjoin(Vendor, Recruiter.vendorid == Vendor.id).filter(
        Recruiter.clientid == 0
    )
    
    if search:
        search = f"%{search}%"
        query = query.filter(
            or_(
                Recruiter.name.ilike(search),
                Recruiter.email.ilike(search),
                Recruiter.phone.ilike(search),
                Recruiter.designation.ilike(search),
                Vendor.companyname.ilike(search),
                Recruiter.status.ilike(search),
                Recruiter.personalemail.ilike(search),
                Recruiter.skypeid.ilike(search),
                Recruiter.notes.ilike(search)
            )
        )

    total = query.count()
    recruiters = query.offset((page - 1) * page_size).limit(page_size).all()

    recruiter_data = [RecruiterResponse.from_orm(recruiter) for recruiter in recruiters]

    return {
        "data": recruiter_data,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": (total + page_size - 1) // page_size
    }

def add_recruiter(db: Session, recruiter_data: Recruiter) -> RecruiterResponse:
    recruiter_dict = recruiter_data.dict()
    if recruiter_dict.get('clientid') is None:
        recruiter_dict['clientid'] = 0
        
    if not recruiter_dict.get('status'):
        recruiter_dict['status'] = 'A'
        
    new_recruiter = Recruiter(**recruiter_dict)
    db.add(new_recruiter)
    db.commit()
    db.refresh(new_recruiter)
    return RecruiterResponse.from_orm(new_recruiter)

def update_recruiter(db: Session, recruiter_id: int, recruiter_data: Recruiter) -> RecruiterResponse:
    recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    
    update_data = recruiter_data.dict()
    if update_data.get('clientid') is None:
        update_data['clientid'] = 0
        
    if not update_data.get('status'):
        update_data['status'] = 'A'
        
    for key, value in update_data.items():
        setattr(recruiter, key, value)
    db.commit()
    return RecruiterResponse.from_orm(recruiter)

def delete_recruiter(db: Session, recruiter_id: int) -> dict:
    recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    db.delete(recruiter)
    db.commit()
    return {"message": "Recruiter deleted successfully"}