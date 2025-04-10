# from sqlalchemy.orm import Session,joinedload
# from app.models import Recruiter, Vendor
# from app.schemas import RecruiterByVendorCreate, RecruiterByVendorUpdate

# def get_all_recruiters_by_vendor(db: Session, offset: int = 0, limit: int = 100):
#     """
#     Get recruiters with clientid = 0 and vendor info.
#     """
#     return (
#         db.query(Recruiter)
#         .options(joinedload(Recruiter.vendor))
#         .filter(Recruiter.clientid == 0)
#         .offset(offset)
#         .limit(limit)
#         .all()
#     )

# def add_recruiter_by_vendor(db: Session, recruiter: RecruiterByVendorCreate):
#     """
#     Add a recruiter with clientid = 0.
#     """
#     db_recruiter = Recruiter(**recruiter.dict())
#     db.add(db_recruiter)
#     db.commit()
#     db.refresh(db_recruiter)
#     return db_recruiter

# def update_recruiter_by_vendor(db: Session, id: int, recruiter: RecruiterByVendorUpdate):
#     """
#     Update a recruiter (clientid remains 0).
#     """
#     db_recruiter = (
#         db.query(Recruiter)
#         .filter(Recruiter.id == id, Recruiter.clientid == 0)
#         .first()
#     )
#     if not db_recruiter:
#         return None
#     for key, value in recruiter.dict().items():
#         setattr(db_recruiter, key, value)
#     db.commit()
#     db.refresh(db_recruiter)
#     return db_recruiter

# def delete_recruiter_by_vendor(db: Session, id: int):
#     """
#     Delete a recruiter (clientid = 0).
#     """
#     db_recruiter = (
#         db.query(Recruiter)
#         .filter(Recruiter.id == id, Recruiter.clientid == 0)
#         .first()
#     )
#     if not db_recruiter:
#         return False
#     db.delete(db_recruiter)
#     db.commit()
#     return True






from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, func
from app.models import Recruiter
from app.schemas import RecruiterByVendorCreate, RecruiterByVendorUpdate

def get_all_recruiters_by_vendor(db: Session, offset: int = 0, limit: int = 100):
    """
    Get recruiters with clientid = 0 (type=vendor)
    Matches PHP query: SELECT id,name,email,phone,designation,vendorid,
    (select ifnull(companyname, " ") from vendor where id = vendorid) comp, 
    status,dob,personalemail,skypeid,linkedin,twitter,facebook,review,notes 
    FROM recruiter where clientid = 0
    """
    return (
        db.query(Recruiter)
        .options(joinedload(Recruiter.vendor))
        .filter(Recruiter.clientid == 0)
        .order_by(Recruiter.vendorid, Recruiter.status)
        .offset(offset)
        .limit(limit)
        .all()
    )

def search_recruiters_by_vendor(db: Session, search_term: str, offset: int = 0, limit: int = 100):
    """
    Search recruiters with clientid = 0 (type=vendor)
    Matches PHP search functionality
    """
    search = f"%{search_term}%"
    
    return (
        db.query(Recruiter)
        .options(joinedload(Recruiter.vendor))
        .filter(
            and_(
                Recruiter.clientid == 0,
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

def add_recruiter_by_vendor(db: Session, recruiter: RecruiterByVendorCreate):
    """
    Add a recruiter with clientid = 0
    """
    # Create with clientid=0 enforced
    db_recruiter = Recruiter(
        **recruiter.dict(exclude_unset=True),
        clientid=0
    )
    db.add(db_recruiter)
    db.commit()
    db.refresh(db_recruiter)
    return db_recruiter

def update_recruiter_by_vendor(db: Session, id: int, recruiter: RecruiterByVendorUpdate):
    """
    Update a recruiter (clientid remains 0)
    """
    db_recruiter = db.query(Recruiter).filter(
        Recruiter.id == id,
        Recruiter.clientid == 0
    ).first()
    
    if not db_recruiter:
        return None
    
    update_data = recruiter.dict(exclude_unset=True)
    
    # Prevent changing clientid from 0
    if 'clientid' in update_data and update_data['clientid'] != 0:
        raise ValueError("Cannot change clientid from 0 for vendor recruiters")
    
    for key, value in update_data.items():
        setattr(db_recruiter, key, value)
    
    db.commit()
    db.refresh(db_recruiter)
    return db_recruiter

def delete_recruiter_by_vendor(db: Session, id: int):
    """
    Delete a recruiter (only if clientid = 0)
    """
    db_recruiter = db.query(Recruiter).filter(
        Recruiter.id == id,
        Recruiter.clientid == 0
    ).first()
    
    if not db_recruiter:
        return False
    
    db.delete(db_recruiter)
    db.commit()
    return True