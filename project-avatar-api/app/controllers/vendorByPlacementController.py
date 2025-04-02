from sqlalchemy.orm import Session,joinedload
from sqlalchemy import select, distinct
from app.models import PlacementRecruiter, Vendor, Placement,Recruiter
from app.schemas import PlacementRecruiterCreate, PlacementRecruiterUpdate

def get_placement_recruiters(db: Session, offset: int = 0, limit: int = 100):
    """
    Get recruiters with clientid = 0 and vendorid in placement table.
    """
    # Subquery to get distinct vendorid from placement where vendorid != 0
    subquery = (
        select(distinct(Placement.vendorid))
        .where(Placement.vendorid != 0)
        .subquery()
    )

    # Main query
    return (
        db.query(Recruiter)
        .options(joinedload(Recruiter.vendor))  # Join with Vendor table
        .filter(Recruiter.clientid == 0)  # Ensure clientid = 0
        .filter(Recruiter.vendorid.in_(subquery))  # Filter by vendorid in subquery
        .offset(offset)
        .limit(limit)
        .all()
    )

def add_placement_recruiter(db: Session, recruiter: PlacementRecruiterCreate):
    """
    Add a placement recruiter (clientid = 0 enforced).
    """
    db_recruiter = PlacementRecruiter(**recruiter.dict())
    db.add(db_recruiter)
    db.commit()
    db.refresh(db_recruiter)
    return db_recruiter

def update_placement_recruiter(db: Session, id: int, recruiter: PlacementRecruiterUpdate):
    """
    Update a placement recruiter.
    """
    db_recruiter = db.query(PlacementRecruiter).filter(PlacementRecruiter.id == id).first()
    if not db_recruiter:
        return None
    for key, value in recruiter.dict().items():
        setattr(db_recruiter, key, value)
    db.commit()
    db.refresh(db_recruiter)
    return db_recruiter

def delete_placement_recruiter(db: Session, id: int):
    """
    Delete a placement recruiter.
    """
    db_recruiter = db.query(PlacementRecruiter).filter(PlacementRecruiter.id == id).first()
    if not db_recruiter:
        return False
    db.delete(db_recruiter)
    db.commit()
    return True