# avatar/projects-avatar-api/app/routes/candidateMarketingRoute.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.controllers.candidateMarketingController import (
    get_candidate_marketing_list, get_candidate_marketing_by_id, update_candidate_marketing, delete_candidate_marketing
)
from app.schemas import CandidateMarketingSchema, CandidateMarketingCreateSchema, CandidateMarketingUpdateSchema

router = APIRouter()

@router.get("/api/admin/candidatemarketing")
def read_candidate_marketing(page: int = 1, page_size: int = 10, db: Session = Depends(get_db)):
    skip = (page - 1) * page_size
    return get_candidate_marketing_list(db, skip, page_size)

@router.get("/api/admin/candidatemarketing/{candidate_marketing_id}")
def read_candidate_marketing_by_id(candidate_marketing_id: int, db: Session = Depends(get_db)):
    candidate_marketing = get_candidate_marketing_by_id(db, candidate_marketing_id)
    if not candidate_marketing:
        raise HTTPException(status_code=404, detail="Candidate Marketing not found")
    return candidate_marketing

@router.put("/api/admin/candidatemarketing/{candidate_marketing_id}")
def update_candidate_marketing_entry(candidate_marketing_id: int, candidate_marketing_data: CandidateMarketingUpdateSchema, db: Session = Depends(get_db)):
    return update_candidate_marketing(db, candidate_marketing_id, candidate_marketing_data)

@router.delete("/api/admin/candidatemarketing/{candidate_marketing_id}")
def delete_candidate_marketing_entry(candidate_marketing_id: int, db: Session = Depends(get_db)):
    return delete_candidate_marketing(db, candidate_marketing_id)
