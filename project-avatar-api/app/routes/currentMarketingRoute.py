# # app/routes/currentMarketingRoute.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.controllers.currentMarketingController import (
    get_current_marketing_list, get_current_marketing_by_candidate_name, 
    get_ipemails_dropdown, get_employees, update_candidate_marketing
)
from app.schemas import CurrentMarketingSchema, CurrentMarketingCreateSchema, CurrentMarketingUpdateSchema, CandidateMarketingUpdateSchema

router = APIRouter()

@router.get("/api/admin/currentmarketing")
def read_current_marketing(page: int = 1, page_size: int = 100, db: Session = Depends(get_db)):
    skip = (page - 1) * page_size
    return get_current_marketing_list(db, skip, page_size)

@router.get("/api/admin/currentmarketing/search/name")
def search_current_marketing_by_candidate_name(name: str, db: Session = Depends(get_db)):
    current_marketing = get_current_marketing_by_candidate_name(db, name)
    if not current_marketing:
        raise HTTPException(status_code=404, detail="Current Marketing not found")
    return current_marketing

@router.get("/api/admin/currentmarketing/employees")
def get_employees_list(db: Session = Depends(get_db)):
    employees = get_employees(db)
    return employees

@router.get("/api/admin/currentmarketing/ipemails")
def get_ip_emails_for_dropdown(db: Session = Depends(get_db)):
    ipemails = get_ipemails_dropdown(db)
    return ipemails

@router.put("/api/admin/candidatemarketing/put/{candidate_marketing_id}")
def update_candidate_marketing_entry(candidate_marketing_id: int, update_data: CandidateMarketingUpdateSchema, db: Session = Depends(get_db)):
    result = update_candidate_marketing(db, candidate_marketing_id, update_data)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result
