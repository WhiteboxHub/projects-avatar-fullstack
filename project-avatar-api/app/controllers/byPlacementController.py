from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import Recruiter, Client, Placement
from app.schemas import RecruiterCreate, RecruiterUpdate, RecruiterResponse
from sqlalchemy import func

def get_recruiters_by_placements(db: Session, page: int, page_size: int):
    subquery = db.query(Placement.clientid).filter(Placement.clientid != 0).distinct().subquery()
    
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
    ).join(Client, Client.id == Recruiter.clientid, isouter=True
    ).filter(
        Recruiter.vendorid == 0,
        Recruiter.clientid.in_(subquery)
    )
    total = query.count()
    recruiters = query.offset((page - 1) * page_size).limit(page_size).all()
    
    recruiter_data = [RecruiterResponse.from_orm(recruiter) for recruiter in recruiters]
    
    return {
        "data": recruiter_data,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": (total + page_size - 1) // page_size,
    }

def add_recruiter(db: Session, recruiter: RecruiterCreate):
    new_recruiter = Recruiter(**recruiter.dict())
    db.add(new_recruiter)
    db.commit()
    db.refresh(new_recruiter)
    return RecruiterResponse.from_orm(new_recruiter)

def delete_recruiter(db: Session, recruiter_id: int):
    recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    db.delete(recruiter)
    db.commit()
    return {"detail": "Recruiter deleted successfully"}


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