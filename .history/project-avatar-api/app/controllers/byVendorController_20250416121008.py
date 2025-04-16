from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import Recruiter, Vendor
from app.schemas import RecruiterCreate, RecruiterUpdate, RecruiterResponse
from sqlalchemy import text
from typing import Optional, Dict, Any

def get_recruiters_by_vendor(
    db: Session,
    page: int,
    page_size: int,
    type: str,
    search: Optional[str] = None
) -> Dict[str, Any]:
    if type == "vendor":
        # First, get paginated vendors
        vendors_query = """
            SELECT DISTINCT
                v.id,
                v.companyname,
                COUNT(r.id) as recruiter_count
            FROM vendor v
            LEFT JOIN recruiter r ON r.vendorid = v.id AND r.clientid = 0
            WHERE v.id IN (
                SELECT DISTINCT vendorid
                FROM recruiter
                WHERE clientid = 0
            )
        """

        if search:
            vendors_query += """
                AND (
                    LOWER(v.companyname) LIKE LOWER(:search)
                )
            """

        vendors_query += " GROUP BY v.id, v.companyname ORDER BY v.companyname"

        # Get total count of vendors
        count_query = f"""
            SELECT COUNT(*) FROM (
                SELECT DISTINCT v.id
                FROM vendor v
                WHERE v.id IN (
                    SELECT DISTINCT vendorid
                    FROM recruiter
                    WHERE clientid = 0
                )
                {f"AND LOWER(v.companyname) LIKE LOWER(:search)" if search else ""}
            ) as count_query
        """

        params = {"search": f"%{search}%" if search else None}
        total = db.execute(text(count_query), params).scalar()

        # Add pagination to vendors query
        vendors_query += " LIMIT :limit OFFSET :offset"
        params.update({
            "limit": page_size,
            "offset": (page - 1) * page_size
        })

        vendors = db.execute(text(vendors_query), params).fetchall()

        # Initialize grouped data
        grouped_data = {}

        # For each vendor in the current page, get its recruiters
        for vendor in vendors:
            recruiters_query = """
                SELECT
                    r.id,
                    r.name,
                    r.email,
                    r.phone,
                    r.designation,
                    r.vendorid,
                    r.status,
                    r.dob,
                    r.personalemail,
                    r.skypeid,
                    r.linkedin,
                    r.twitter,
                    r.facebook,
                    r.review,
                    r.notes
                FROM recruiter r
                WHERE r.clientid = 0
                AND r.vendorid = :vendor_id
                ORDER BY r.status ASC, r.name ASC
            """

            recruiters = db.execute(text(recruiters_query), {"vendor_id": vendor.id}).fetchall()

            grouped_data[vendor.id] = {
                "vendorid": vendor.id,
                "companyname": vendor.companyname,
                "recruiters": [{
                    "id": r.id,
                    "name": r.name,
                    "email": r.email,
                    "phone": r.phone,
                    "designation": r.designation,
                    "status": r.status,
                    "dob": str(r.dob) if r.dob else None,
                    "personalemail": r.personalemail,
                    "skypeid": r.skypeid,
                    "linkedin": r.linkedin,
                    "twitter": r.twitter,
                    "facebook": r.facebook,
                    "review": r.review,
                    "notes": r.notes,
                    "vendorid": r.vendorid,
                    "companyname": vendor.companyname
                } for r in recruiters],
                "isGroup": True,
                "isCollapsed": True,
                "recruiter_count": vendor.recruiter_count
            }

        return {
            "data": list(grouped_data.values()),
            "total": total,
            "page": page,
            "page_size": page_size,
            "pages": (total + page_size - 1) // page_size,
            "grouping": {
                "enabled": True,
                "groupField": "vendorid",
                "groupOrder": "desc",
                "groupCollapse": True
            }
        }

def get_vendor_options(db: Session) -> list:
    query = """
        SELECT id, companyname as name
        FROM vendor
        WHERE id IN (
            SELECT DISTINCT vendorid
            FROM recruiter
            WHERE clientid = 0
        )
        ORDER BY companyname
    """
    results = db.execute(text(query)).fetchall()
    options = [{"id": 0, "name": "Vendor not selected..."}]
    options.extend([{"id": row.id, "name": row.name} for row in results])
    return options

# Keep existing CRUD functions unchanged
def create_recruiter(db: Session, recruiter: RecruiterCreate):
    db_recruiter = Recruiter(**recruiter.dict())
    db_recruiter.clientid = 0
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

def get_recruiter(db: Session, recruiter_id: int):
    recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    return recruiter
