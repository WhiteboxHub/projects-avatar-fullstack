# from sqlalchemy.orm import Session
# from fastapi import HTTPException
# from app.models import Recruiter, Client, Placement
# from app.schemas import RecruiterCreate, RecruiterUpdate, RecruiterResponse
# from sqlalchemy import func

# def get_recruiters_by_placements(db: Session, page: int, page_size: int):
#     subquery = db.query(Placement.clientid).filter(Placement.clientid != 0).distinct().subquery()
    
#     query = db.query(
#         Recruiter.id,
#         Recruiter.name,
#         Recruiter.email,
#         Recruiter.phone,
#         Recruiter.designation,
#         Recruiter.clientid,
#         func.coalesce(Client.companyname, " ").label("comp"),
#         Recruiter.status,
#         Recruiter.dob,
#         Recruiter.personalemail,
#         Recruiter.skypeid,
#         Recruiter.linkedin,
#         Recruiter.twitter,
#         Recruiter.facebook,
#         Recruiter.review,
#         Recruiter.notes
#     ).join(Client, Client.id == Recruiter.clientid, isouter=True
#     ).filter(
#         Recruiter.vendorid == 0,
#         Recruiter.clientid.in_(subquery)
#     )
#     total = query.count()
#     recruiters = query.offset((page - 1) * page_size).limit(page_size).all()
    
#     recruiter_data = [RecruiterResponse.from_orm(recruiter) for recruiter in recruiters]
    
#     return {
#         "data": recruiter_data,
#         "total": total,
#         "page": page,
#         "page_size": page_size,
#         "pages": (total + page_size - 1) // page_size,
#     }

# def add_recruiter(db: Session, recruiter: RecruiterCreate):
#     new_recruiter = Recruiter(**recruiter.dict())
#     db.add(new_recruiter)
#     db.commit()
#     db.refresh(new_recruiter)
#     return RecruiterResponse.from_orm(new_recruiter)

# def delete_recruiter(db: Session, recruiter_id: int):
#     recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
#     if not recruiter:
#         raise HTTPException(status_code=404, detail="Recruiter not found")
#     db.delete(recruiter)
#     db.commit()
#     return {"detail": "Recruiter deleted successfully"}


# def update_recruiter(db: Session, recruiter_id: int, recruiter_update: RecruiterUpdate):
#     recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
#     if not recruiter:
#         raise HTTPException(status_code=404, detail="Recruiter not found")
    
#     update_data = recruiter_update.dict(exclude_unset=True)
#     for key, value in update_data.items():
#         setattr(recruiter, key, value)
    
#     db.commit()
#     db.refresh(recruiter)
#     return RecruiterResponse.from_orm(recruiter)


from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import Recruiter, Client, Placement
from app.schemas import RecruiterCreate, RecruiterUpdate, RecruiterResponse
from sqlalchemy import func, distinct
from typing import Optional

def get_recruiters_by_client_placement(
    db: Session, 
    page: int, 
    page_size: int,
    search: Optional[str] = None
):
    # First get distinct clientids from placement table
    placement_subquery = (
        db.query(distinct(Placement.clientid))
        .filter(Placement.clientid != 0)
        .subquery()
    )
    
    # Main query
    query = (
        db.query(
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
            Recruiter.notes,
            # Recruiter.employeeid,
            # Recruiter.lastmoddatetime
        )
        .join(Client, Client.id == Recruiter.clientid, isouter=True)
        .filter(
            Recruiter.vendorid == 0,
            Recruiter.clientid.in_(placement_subquery)
        )
    )

    # Apply search if provided
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Recruiter.name.ilike(search_term)) |
            (Recruiter.email.ilike(search_term)) |
            (Client.companyname.ilike(search_term))
        )

    # Get total count before pagination
    total = query.count()

    # Add sorting
    query = query.order_by(Client.companyname.asc(), Recruiter.status.asc())

    # Apply pagination
    recruiters = query.offset((page - 1) * page_size).limit(page_size).all()

    # Group data by client
    grouped_data = {}
    for recruiter in recruiters:
        client_id = recruiter.clientid
        if client_id not in grouped_data:
            grouped_data[client_id] = {
                "clientid": client_id,
                "companyname": recruiter.comp,
                "recruiters": []
            }
        grouped_data[client_id]["recruiters"].append(RecruiterResponse.from_orm(recruiter))

    return {
        "data": list(grouped_data.values()),
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": (total + page_size - 1) // page_size
    }

def add_recruiter(db: Session, recruiter: RecruiterCreate):
    new_recruiter = Recruiter(**recruiter.dict())
    new_recruiter.vendorid = 0  # Ensure vendorid is 0 for client recruiters
    db.add(new_recruiter)
    db.commit()
    db.refresh(new_recruiter)
    return RecruiterResponse.from_orm(new_recruiter)

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

def delete_recruiter(db: Session, recruiter_id: int):
    recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    db.delete(recruiter)
    db.commit()
    return {"detail": "Recruiter deleted successfully"}