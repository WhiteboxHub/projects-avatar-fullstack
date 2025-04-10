from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, distinct, and_, or_, func
from app.models import Recruiter, Placement
from app.schemas import PlacementRecruiterCreate, PlacementRecruiterUpdate

def get_placement_recruiters(db: Session, offset: int = 0, limit: int = 100):
    """
    Get recruiters with clientid = 0 and vendorid in placement table
    """
    vendor_ids = db.execute(
        select(distinct(Placement.vendorid))
        .where(Placement.vendorid != 0)
    ).scalars().all()

    if not vendor_ids:
        return []

    return (
        db.query(Recruiter)
        .options(joinedload(Recruiter.vendor))
        .filter(
            and_(
                Recruiter.clientid == 0,
                Recruiter.vendorid.in_(vendor_ids)
            )
        )
        .order_by(Recruiter.vendorid, Recruiter.status)
        .offset(offset)
        .limit(limit)
        .all()
    )

def search_placement_recruiters(db: Session, search_term: str, offset: int = 0, limit: int = 100):
    """
    Search recruiters with clientid = 0 and vendorid in placement table
    """
    vendor_ids = db.execute(
        select(distinct(Placement.vendorid))
        .where(Placement.vendorid != 0)
    ).scalars().all()

    if not vendor_ids:
        return []

    search = f"%{search_term}%"
    
    return (
        db.query(Recruiter)
        .options(joinedload(Recruiter.vendor))
        .filter(
            and_(
                Recruiter.clientid == 0,
                Recruiter.vendorid.in_(vendor_ids),
                or_(
                    func.lower(Recruiter.name).like(func.lower(search)),
                    func.lower(Recruiter.email).like(func.lower(search)),
                    func.lower(Recruiter.phone).like(func.lower(search)),
                    func.lower(Recruiter.designation).like(func.lower(search)),
                    func.lower(Recruiter.personalemail).like(func.lower(search)),
                    func.lower(Recruiter.skypeid).like(func.lower(search)),
                    func.lower(Recruiter.notes).like(func.lower(search))
                )
            )
        )
        .order_by(Recruiter.vendorid, Recruiter.status)
        .offset(offset)
        .limit(limit)
        .all()
    )

def add_placement_recruiter(db: Session, recruiter: PlacementRecruiterCreate):
    """Add a placement recruiter (enforces clientid=0)"""
    db_recruiter = Recruiter(
        **recruiter.dict(exclude_unset=True),
        clientid=0
    )
    db.add(db_recruiter)
    db.commit()
    db.refresh(db_recruiter)
    return db_recruiter

def update_placement_recruiter(db: Session, id: int, recruiter: PlacementRecruiterUpdate):
    """Update a placement recruiter"""
    db_recruiter = db.query(Recruiter).filter(Recruiter.id == id).first()
    if not db_recruiter:
        return None
    
    update_data = recruiter.dict(exclude_unset=True)
    
    if 'clientid' in update_data and update_data['clientid'] != 0:
        raise ValueError("Cannot change clientid from 0 for vendor placement recruiters")
    
    for key, value in update_data.items():
        setattr(db_recruiter, key, value)
    
    db.commit()
    db.refresh(db_recruiter)
    return db_recruiter

def delete_placement_recruiter(db: Session, id: int):
    """Delete a placement recruiter"""
    db_recruiter = db.query(Recruiter).filter(Recruiter.id == id).first()
    if not db_recruiter:
        return False
    
    if db_recruiter.clientid != 0:
        raise ValueError("Cannot delete recruiter - must have clientid=0")
    
    db.delete(db_recruiter)
    db.commit()
    return True