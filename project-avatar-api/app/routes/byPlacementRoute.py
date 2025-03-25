from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.models import Recruiter
from app.database.db import get_db
from app.schemas import RecruiterCreate, RecruiterUpdate, RecruiterResponse
from app.controllers.byPlacementController import get_recruiters_by_placements, add_recruiter, update_recruiter, delete_recruiter

router = APIRouter()

@router.get("/recruiters/by-placement", response_model=dict)
def read_recruiters_by_placement(
    page: int = Query(1, alias="page"),
    page_size: int = Query(100, alias="pageSize"),
    db: Session = Depends(get_db)
):
    return get_recruiters_by_placements(db, page, page_size)

@router.post("/recruiters/byPlacement/add", response_model=RecruiterResponse)
def create_recruiter(recruiter: RecruiterCreate, db: Session = Depends(get_db)):
    return add_recruiter(db, recruiter)

@router.put("/recruiters/byPlacement/update/{recruiter_id}", response_model=RecruiterResponse)
def modify_recruiter(recruiter_id: int, recruiter_update: RecruiterUpdate, db: Session = Depends(get_db)):
    return update_recruiter(db, recruiter_id, recruiter_update)

@router.delete("/recruiters/byPlacement/remove/{recruiter_id}")
def remove_recruiter(recruiter_id: int, db: Session = Depends(get_db)):
    return delete_recruiter(db, recruiter_id)