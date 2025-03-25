from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import Recruiter
from app.database.db import get_db
from app.schemas import RecruiterCreate, RecruiterUpdate, RecruiterResponse
from app.controllers.byAllListController import get_recruiters_with_clients, add_recruiter, update_recruiter, delete_recruiter

router = APIRouter()

@router.get("/recruiters/byAllList", response_model=dict)
def read_recruiters(page: int = 1, page_size: int = 100, db: Session = Depends(get_db)):
    return get_recruiters_with_clients(db, page, page_size)

@router.post("/recruiters/byAllList/add", response_model=RecruiterResponse)
def create_recruiter(recruiter: RecruiterCreate, db: Session = Depends(get_db)):
    return add_recruiter(db, recruiter)

@router.put("/recruiters/byAllList/update/{recruiter_id}", response_model=RecruiterResponse)
def edit_recruiter(recruiter_id: int, recruiter: RecruiterUpdate, db: Session = Depends(get_db)):
    return update_recruiter(db, recruiter_id, recruiter)

@router.delete("/recruiters/byAllList/remove/{recruiter_id}")
def remove_recruiter(recruiter_id: int, db: Session = Depends(get_db)):
    return delete_recruiter(db, recruiter_id)