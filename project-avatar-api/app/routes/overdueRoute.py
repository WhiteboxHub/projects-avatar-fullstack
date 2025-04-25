# avatar/projects-avatar-api/app/routes/overdueRoute.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.controllers.overdueController import (
    get_overdue_list, get_overdue_by_id, get_overdue_by_name, update_overdue
)
from app.schemas import OverdueUpdateSchema

router = APIRouter()


@router.get("/api/admin/overdue/get")
def read_overdue(page: int = 1, page_size: int = 10, search_term: str = None, db: Session = Depends(get_db)):
    skip = (page - 1) * page_size
    overdue_list = get_overdue_list(db, skip, page_size, search_term)
    return overdue_list

@router.get("/api/admin/overdue/{overdue_id}")
def read_overdue_by_id(overdue_id: int, db: Session = Depends(get_db)):
    overdue = get_overdue_by_id(db, overdue_id)
    if not overdue:
        raise HTTPException(status_code=404, detail="Overdue not found")
    return overdue

@router.get("/api/admin/overdue/name/{candidate_name}")
def read_overdue_by_name(candidate_name: str, db: Session = Depends(get_db)):
    overdue = get_overdue_by_name(db, candidate_name)
    if not overdue:
        raise HTTPException(status_code=404, detail="Overdue not found")
    return overdue

@router.put("/api/admin/overdue/put/{overdue_id}")
def update_overdue_entry(overdue_id: int, overdue_data: OverdueUpdateSchema, db: Session = Depends(get_db)):
    return update_overdue(db, overdue_id, overdue_data)
