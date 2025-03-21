# app/routes/currentMarketingRoute.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.controllers.currentMarketingController import (
    get_current_marketing_list, get_current_marketing_by_candidate_name, update_current_marketing
)
from app.schemas import CurrentMarketingSchema, CurrentMarketingCreateSchema, CurrentMarketingUpdateSchema
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

@router.put("/api/admin/currentmarketing/{current_marketing_id}")
def update_current_marketing_entry(current_marketing_id: int, current_marketing_data: CurrentMarketingUpdateSchema, db: Session = Depends(get_db)):
    return update_current_marketing(db, current_marketing_id, current_marketing_data)

