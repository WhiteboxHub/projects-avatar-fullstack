from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.controllers.byClientController import (
    get_recruiters_by_client,
    create_recruiter,
    update_recruiter,
    delete_recruiter,
    get_recruiter_by_id
)
from app.models import Recruiter
from app.database.db import get_db
from app.schemas import RecruiterCreate, RecruiterUpdate, Recruiter

router = APIRouter()

@router.get("/recruiters/by-client", response_model=list[Recruiter])
def read_recruiters_by_client(db: Session = Depends(get_db)):
    return get_recruiters_by_client(db)

@router.post("/recruiters", response_model=Recruiter)
def add_recruiter(recruiter: RecruiterCreate, db: Session = Depends(get_db)):
    return create_recruiter(db, recruiter)

@router.put("/recruiters/{recruiter_id}", response_model=Recruiter)
def edit_recruiter(recruiter_id: int, recruiter: RecruiterUpdate, db: Session = Depends(get_db)):
    return update_recruiter(db, recruiter_id, recruiter)

@router.delete("/recruiters/{recruiter_id}")
def remove_recruiter(recruiter_id: int, db: Session = Depends(get_db)):
    return delete_recruiter(db, recruiter_id)

@router.get("/recruiters/{recruiter_id}", response_model=Recruiter)
def read_recruiter(recruiter_id: int, db: Session = Depends(get_db)):
    return get_recruiter_by_id(db, recruiter_id)