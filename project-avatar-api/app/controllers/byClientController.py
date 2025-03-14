from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import Recruiter
from app.schemas import RecruiterCreate, RecruiterUpdate

def get_recruiters_by_client(db: Session):
    return db.query(Recruiter).filter(Recruiter.vendorid == 0).all()

def create_recruiter(db: Session, recruiter: RecruiterCreate):
    db_recruiter = Recruiter(**recruiter.dict())
    db.add(db_recruiter)
    db.commit()
    db.refresh(db_recruiter)
    return db_recruiter

def update_recruiter(db: Session, recruiter_id: int, recruiter: RecruiterUpdate):
    db_recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not db_recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    for key, value in recruiter.dict(exclude_unset=True).items():
        setattr(db_recruiter, key, value)
    db.commit()
    db.refresh(db_recruiter)
    return db_recruiter

def delete_recruiter(db: Session, recruiter_id: int):
    db_recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not db_recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    db.delete(db_recruiter)
    db.commit()
    return {"message": "Recruiter deleted successfully"}

def get_recruiter_by_id(db: Session, recruiter_id: int):
    db_recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not db_recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    return db_recruiter