from sqlalchemy.orm import Session
from sqlalchemy import and_, func, select
from app.models import Recruiter, Vendor  # Ensure these models are imported
from app.schemas import RecruiterCreate, RecruiterUpdate, RecruiterInDB

def get_recruiters_for_work(db: Session, offset: int = 0, limit: int = 200):
    """
    Fetch recruiters for type = "work" with pagination.
    """
    # Subquery to get the vendor's company name
    vendor_subquery = (
        select(Vendor.companyname)
        .where(Vendor.id == Recruiter.vendorid)
        .correlate(Recruiter)
        .as_scalar()
    )

    # Main query
    query = (
        db.query(
            Recruiter.id,
            Recruiter.name,
            Recruiter.email,
            Recruiter.phone,
            Recruiter.designation,
            Recruiter.vendorid,
            func.coalesce(vendor_subquery, " ").label("comp"),  # Use func.coalesce for ifnull
            Recruiter.status,
            Recruiter.dob,
            Recruiter.personalemail,
            Recruiter.skypeid,
            Recruiter.linkedin,
            Recruiter.twitter,
            Recruiter.facebook,
            Recruiter.review,
            Recruiter.notes,
        )
        .filter(
            and_(
                Recruiter.clientid == 0,
                Recruiter.vendorid != 0,
                Recruiter.name.isnot(None),
                func.length(Recruiter.name) > 1,
                Recruiter.phone.isnot(None),
                func.length(Recruiter.phone) > 1,
                Recruiter.designation.isnot(None),
                func.length(Recruiter.designation) > 1,
            )
        )
        .order_by(Recruiter.name.asc())  # Sort by name in alphabetical order
        .offset(offset)  # Pagination: Skip rows
        .limit(limit)    # Pagination: Limit rows
    )

    # Fetch the data
    recruiters = query.all()

    # Add a serial number (sl no) to each recruiter
    result = []
    for index, recruiter in enumerate(recruiters, start=offset + 1):
        recruiter_dict = {
            "sl_no": index,  # Serial number
            "id": recruiter.id,  # ID comes after sl_no
            "name": recruiter.name,
            "email": recruiter.email,
            "phone": recruiter.phone,
            "designation": recruiter.designation,
            "vendorid": recruiter.vendorid,
            "comp": recruiter.comp,
            "status": recruiter.status,
            "dob": recruiter.dob,
            "personalemail": recruiter.personalemail,
            "skypeid": recruiter.skypeid,
            "linkedin": recruiter.linkedin,
            "twitter": recruiter.twitter,
            "facebook": recruiter.facebook,
            "review": recruiter.review,
            "notes": recruiter.notes,
        }
        result.append(recruiter_dict)

    return result
# Create a new recruiter
def create_recruiter(db: Session, recruiter: RecruiterCreate):
    """
    Create a new recruiter.
    """
    db_recruiter = Recruiter(**recruiter.dict())
    db.add(db_recruiter)
    db.commit()
    db.refresh(db_recruiter)
    return db_recruiter

# Update an existing recruiter
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

# Delete a recruiter
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