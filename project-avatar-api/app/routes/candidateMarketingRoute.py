from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.controllers.candidateMarketingController import (
    get_candidate_marketing_list, get_candidate_marketing_by_name, update_candidate_marketing, 
    delete_candidate_marketing, get_employees, get_ipemails_dropdown
)
from app.schemas import CandidateMarketingSchema, CandidateMarketingCreateSchema, CandidateMarketingUpdateSchema
from typing import List, Dict, Any

router = APIRouter()

@router.get("/api/admin/candidatemarketing")
def read_candidate_marketing(page: int = 1, page_size: int = 100, db: Session = Depends(get_db)):
    skip = (page - 1) * page_size
    return get_candidate_marketing_list(db, skip, page_size)

@router.get("/api/admin/candidatemarketing/search/name")
def search_candidate_marketing_by_name(name: str, db: Session = Depends(get_db)):
    candidate_marketing = get_candidate_marketing_by_name(db, name)
    if not candidate_marketing:
        raise HTTPException(status_code=404, detail="Candidate Marketing not found")
    return candidate_marketing

@router.put("/api/admin/candidatemarketing/update/{candidate_marketing_id}")
def update_candidate_marketing_entry(candidate_marketing_id: int, update_data: CandidateMarketingUpdateSchema, db: Session = Depends(get_db)):
    result = update_candidate_marketing(db, candidate_marketing_id, update_data)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.delete("/api/admin/candidatemarketing/{candidate_marketing_id}")
def delete_candidate_marketing_entry(candidate_marketing_id: int, db: Session = Depends(get_db)):
    return delete_candidate_marketing(db, candidate_marketing_id)

@router.get("/api/admin/candidatemarketing/employees", response_model=List[Dict[str, Any]])
def get_employees_list(db: Session = Depends(get_db)):
    employees = get_employees(db)
    return employees

@router.get("/api/admin/candidatemarketing/ipemails", response_model=List[Dict[str, str]])
def get_ip_emails_for_dropdown(db: Session = Depends(get_db)):
    ipemails = get_ipemails_dropdown(db)
    return ipemails