
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.controllers.byDetailedController import get_recruiter_details, add_recruiter, update_recruiter, delete_recruiter
from app.database.db import get_db
from app.schemas import RecruiterResponse, RecruiterCreate, RecruiterUpdate

router = APIRouter()

@router.get("/recruiters/byDetailed", response_model=dict)
def read_recruiter_details(
    page: int = Query(1, alias="page"),
    page_size: int = Query(100, alias="pageSize"),
    db: Session = Depends(get_db)
):
    return get_recruiter_details(db, page, page_size)

@router.post("/recruiters/byDetailed/add", response_model=RecruiterResponse)
def create_recruiter(recruiter: RecruiterCreate, db: Session = Depends(get_db)):
    return add_recruiter(db, recruiter)

@router.put("/recruiters/byDetailed/update/{recruiter_id}", response_model=RecruiterResponse)
def modify_recruiter(recruiter_id: int, recruiter: RecruiterUpdate, db: Session = Depends(get_db)):
    return update_recruiter(db, recruiter_id, recruiter)

@router.delete("/recruiters/byDetailed/remove/{recruiter_id}", response_model=dict)
def remove_recruiter(recruiter_id: int, db: Session = Depends(get_db)):
    return delete_recruiter(db, recruiter_id)

