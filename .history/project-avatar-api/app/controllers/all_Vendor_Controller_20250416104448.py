from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models import Recruiter
from typing import List
from app.schemas import RecruiterCreate, RecruiterUpdate, RecruiterInDB

def get_all_recruiters(db: Session, offset: int = 0, limit: int = 100) -> List[RecruiterInDB]:
    """
    Fetch all recruiters with clientid = 0 (type = "list"), sorted by email.
    """
    if offset < 0 or limit < 0:
        raise HTTPException(
            status_code=400,
            detail="Offset and limit must be non-negative."
        )

    # Fetch recruiters sorted by email
    recruiters = db.query(Recruiter).filter(Recruiter.clientid == 0).order_by(Recruiter.email).offset(offset).limit(limit).all()

    # Add SL No and convert to Pydantic model
    result = []
    for index, recruiter in enumerate(recruiters, start=1):
        recruiter_data = {
            "sl_no": index,  # Add SL No
            "id": recruiter.id,  # Ensure id comes after sl_no
            "name": recruiter.name,
            "email": recruiter.email,
            "phone": recruiter.phone,
            "designation": recruiter.designation,
            "vendorid": recruiter.vendorid,
            "status": recruiter.status,
            "dob": recruiter.dob,
            "personalemail": recruiter.personalemail,
            "skypeid": recruiter.skypeid,
            "linkedin": recruiter.linkedin,
            "twitter": recruiter.twitter,
            "facebook": recruiter.facebook,
            "review": recruiter.review,
            "notes": recruiter.notes,
            "clientid": recruiter.clientid,
        }
        result.append(RecruiterInDB.model_validate(recruiter_data))

    return result

def add_recruiter(db: Session, recruiter: RecruiterCreate):
    """
    Add a new recruiter.
    """
    db_recruiter = Recruiter(**recruiter.dict())
    db.add(db_recruiter)
    db.commit()
    db.refresh(db_recruiter)
    return db_recruiter

def update_recruiter(db: Session, id: int, recruiter: RecruiterUpdate):
    """
    Update a recruiter by ID.
    """
    db_recruiter = db.query(Recruiter).filter(Recruiter.id == id).first()
    if not db_recruiter:
        return None
    for key, value in recruiter.dict().items():
        setattr(db_recruiter, key, value)
    db.commit()
    db.refresh(db_recruiter)
    return db_recruiter

def view_recruiter_by_id(db: Session, id: int):
    """
    Fetch a single recruiter by ID.
    """
    return db.query(Recruiter).filter(Recruiter.id == id).first()

def delete_recruiter(db: Session, id: int):
    """
    Delete a recruiter by ID.
    """
    db_recruiter = db.query(Recruiter).filter(Recruiter.id == id).first()
    if not db_recruiter:
        return False
    db.delete(db_recruiter)
    db.commit()
    return True