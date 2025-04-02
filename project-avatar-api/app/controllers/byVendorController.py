from sqlalchemy.orm import Session,joinedload
from app.models import Recruiter, Vendor
from app.schemas import RecruiterByVendorCreate, RecruiterByVendorUpdate

def get_all_recruiters_by_vendor(db: Session, offset: int = 0, limit: int = 100):
    """
    Get recruiters with clientid = 0 and vendor info.
    """
    return (
        db.query(Recruiter)
        .options(joinedload(Recruiter.vendor))
        .filter(Recruiter.clientid == 0)
        .offset(offset)
        .limit(limit)
        .all()
    )

def add_recruiter_by_vendor(db: Session, recruiter: RecruiterByVendorCreate):
    """
    Add a recruiter with clientid = 0.
    """
    db_recruiter = Recruiter(**recruiter.dict())
    db.add(db_recruiter)
    db.commit()
    db.refresh(db_recruiter)
    return db_recruiter

def update_recruiter_by_vendor(db: Session, id: int, recruiter: RecruiterByVendorUpdate):
    """
    Update a recruiter (clientid remains 0).
    """
    db_recruiter = (
        db.query(Recruiter)
        .filter(Recruiter.id == id, Recruiter.clientid == 0)
        .first()
    )
    if not db_recruiter:
        return None
    for key, value in recruiter.dict().items():
        setattr(db_recruiter, key, value)
    db.commit()
    db.refresh(db_recruiter)
    return db_recruiter

def delete_recruiter_by_vendor(db: Session, id: int):
    """
    Delete a recruiter (clientid = 0).
    """
    db_recruiter = (
        db.query(Recruiter)
        .filter(Recruiter.id == id, Recruiter.clientid == 0)
        .first()
    )
    if not db_recruiter:
        return False
    db.delete(db_recruiter)
    db.commit()
    return True