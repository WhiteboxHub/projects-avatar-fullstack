# avatar/projects-avatar-api/app/routes/overdueRoute.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database.db import get_db
from app.controllers.overdueController import (
    get_overdue_list, get_overdue_by_id, get_overdue_by_name, update_overdue
)
from app.schemas import OverdueUpdateSchema

router = APIRouter()


@router.get("/api/admin/overdue/get")
def read_overdue(
    page: int = Query(1, ge=1),
    page_size: int = Query(100, ge=1, le=1000),
    search_term: Optional[str] = None,
    db: Session = Depends(get_db)
):
    skip = (page - 1) * page_size
    overdue_list = get_overdue_list(db, skip, page_size, search_term)
    return overdue_list

@router.get("/api/admin/overdue/{overdue_id}")
def read_overdue_by_id(overdue_id: int, db: Session = Depends(get_db)):
    overdue = get_overdue_by_id(db, overdue_id)
    if not overdue:
        raise HTTPException(status_code=404, detail="Overdue invoice not found")
    return overdue

@router.get("/api/admin/overdue/name/{candidate_name}")
def read_overdue_by_name(candidate_name: str, db: Session = Depends(get_db)):
    overdue = get_overdue_by_name(db, candidate_name)
    return overdue

@router.put("/api/admin/overdue/put/{overdue_id}")
def update_overdue_entry(overdue_id: int, overdue_data: OverdueUpdateSchema, db: Session = Depends(get_db)):
    result = update_overdue(db, overdue_id, overdue_data)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


# @router.get("/overdue/get")
# def get_overdue_invoices(
#     page: int = Query(1, ge=1),
#     page_size: int = Query(100, ge=1, le=1000),
#     search_term: Optional[str] = None,
#     db: Session = Depends(get_db)
# ):
#     skip = (page - 1) * page_size
#     result = overdueController.get_overdue_list(db, skip, page_size, search_term)
#     return result

# @router.get("/overdue/{overdue_id}")
# def get_overdue_by_id(overdue_id: int, db: Session = Depends(get_db)):
#     result = overdueController.get_overdue_by_id(db, overdue_id)
#     if not result:
#         raise HTTPException(status_code=404, detail="Overdue invoice not found")
#     return result

# @router.get("/overdue/name/{candidate_name}")
# def get_overdue_by_name(candidate_name: str, db: Session = Depends(get_db)):
#     result = overdueController.get_overdue_by_name(db, candidate_name)
#     return result

# @router.put("/overdue/{overdue_id}")
# def update_overdue(overdue_id: int, overdue: OverdueUpdateSchema, db: Session = Depends(get_db)):
#     result = overdueController.update_overdue(db, overdue_id, overdue)
#     if isinstance(result, dict) and "error" in result:
#         raise HTTPException(status_code=404, detail=result["error"])
#     return result