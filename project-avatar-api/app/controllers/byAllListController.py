from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.models import Recruiter, Client
from app.schemas import RecruiterResponse

def get_recruiters_with_clients(db: Session, page: int, page_size: int, search: str = None):
    query = db.query(
        Recruiter.id,
        Recruiter.name,
        Recruiter.email,
        Recruiter.phone,
        Recruiter.designation,
        Recruiter.clientid,
        func.ifnull(Client.companyname, " ").label('comp'),
        Recruiter.status,
        Recruiter.dob,
        Recruiter.personalemail,
        Recruiter.skypeid,
        Recruiter.linkedin,
        Recruiter.twitter,
        Recruiter.facebook,
        Recruiter.review,
        Recruiter.notes,
        # Recruiter.employeeid,
        # Recruiter.lastmoddatetime
    ).outerjoin(Client, Recruiter.clientid == Client.id).filter(
        Recruiter.vendorid == 0
    )

    if search:
        search = f"%{search}%"
        query = query.filter(
            or_(
                Recruiter.name.ilike(search),
                Recruiter.email.ilike(search),
                Recruiter.phone.ilike(search),
                Recruiter.designation.ilike(search),
                Client.companyname.ilike(search),
                Recruiter.status.ilike(search),
                Recruiter.personalemail.ilike(search),
                # Recruiter.employeeid.ilike(search),
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
        "pages": (total + page_size - 1) // page_size  # Ensure correct total pages calculation
    }

def add_recruiter(db: Session, recruiter_data: Recruiter) -> RecruiterResponse:
    new_recruiter = Recruiter(**recruiter_data.dict())
    db.add(new_recruiter)
    db.commit()
    db.refresh(new_recruiter)
    return RecruiterResponse.from_orm(new_recruiter)

def update_recruiter(db: Session, recruiter_id: int, recruiter_data: Recruiter) -> RecruiterResponse:
    recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    for key, value in recruiter_data.dict().items():
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
