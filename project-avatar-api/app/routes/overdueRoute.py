# avatar/projects-avatar-api/app/routes/overdueRoute.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from app.database.db import get_db
from app.controllers.overdueController import (
    get_overdue_list, get_overdue_by_id, update_overdue
)
from app.schemas import  OverdueUpdateSchema

router = APIRouter()

@router.get("/api/admin/overdue")
def read_overdue(page: int = 1, page_size: int = 10, db: Session = Depends(get_db)):
    skip = (page - 1) * page_size
    overdue_list = get_overdue_list(db, skip, page_size)
    total_rows = db.execute(text("SELECT COUNT(*) FROM invoice")).scalar()

    return {"data": overdue_list, "totalRows": total_rows}

@router.get("/api/admin/overdue/{overdue_id}")
def read_overdue_by_id(overdue_id: int, db: Session = Depends(get_db)):
    overdue = get_overdue_by_id(db, overdue_id)
    if not overdue:
        raise HTTPException(status_code=404, detail="Overdue not found")
    return overdue

@router.put("/api/admin/overdue/{overdue_id}")
def update_overdue_entry(overdue_id: int, overdue_data: OverdueUpdateSchema, db: Session = Depends(get_db)):
    return update_overdue(db, overdue_id, overdue_data)
