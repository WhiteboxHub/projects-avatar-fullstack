from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.models import Recruiter,Client
from app.database.db import get_db
from app.schemas import RecruiterCreate, RecruiterUpdate, RecruiterResponse
from app.controllers.byAllListController import get_recruiters_with_clients, add_recruiter, update_recruiter, delete_recruiter

router = APIRouter()

# @router.get("/recruiters/byAllList", response_model=dict)
# def read_recruiters(page: int = 1, page_size: int = 100, search: str = None, db: Session = Depends(get_db)):
#     return get_recruiters_with_clients(db, page, page_size, search)

@router.get("/recruiters/byAllList", response_model=dict)
def read_recruiters(
    page: int = 1, 
    page_size: int = 100, 
    search: str = None, 
    db: Session = Depends(get_db)
):
    return get_recruiters_with_clients(db, page, page_size, search)

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
        "pages": (total + page_size - 1) // page_size
    }

@router.post("/recruiters/byAllList/add", response_model=RecruiterResponse)
def create_recruiter(recruiter: RecruiterCreate, db: Session = Depends(get_db)):
    return add_recruiter(db, recruiter)

@router.put("/recruiters/byAllList/update/{recruiter_id}", response_model=RecruiterResponse)
def edit_recruiter(recruiter_id: int, recruiter: RecruiterUpdate, db: Session = Depends(get_db)):
    return update_recruiter(db, recruiter_id, recruiter)

@router.delete("/recruiters/byAllList/remove/{recruiter_id}")
def remove_recruiter(recruiter_id: int, db: Session = Depends(get_db)):
    return delete_recruiter(db, recruiter_id)