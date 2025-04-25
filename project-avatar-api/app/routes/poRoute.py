# /Users/innovapathinc/Desktop/projects-avatar-fullstack/new-projects-avatar-fullstack/project-avatar-api/app/routes/poRoute.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from app.database.db import get_db
from app.controllers.poController import (
    get_po_list, get_po_by_name, create_po, update_po, delete_po, get_po_data
)
from app.schemas import POSchema, POCreateSchema, POUpdateSchema

router = APIRouter()

@router.get("/api/admin/po/data")
def read_po_data(db: Session = Depends(get_db)):
    po_data = get_po_data(db)
    return po_data

@router.get("/api/admin/po")
def read_po(page: int = 1, page_size: int = 100, db: Session = Depends(get_db)):
    skip = (page - 1) * page_size  
    po_list = get_po_list(db, skip, page_size)
    total_rows = db.execute(text("SELECT COUNT(*) FROM po")).scalar()

    return {"data": po_list, "totalRows": total_rows}

@router.get("/api/admin/po/name")
def read_po_by_name(name_fragment: str, db: Session = Depends(get_db)):
    po_list = get_po_by_name(db, name_fragment)
    if not po_list:
        raise HTTPException(status_code=404, detail="PO not found")
    return po_list

# @router.get("/api/admin/po/{po_id}")
# def read_po_by_id(po_id: int, db: Session = Depends(get_db)):
#     po = get_po_by_id(db, po_id)
#     if not po:
#         raise HTTPException(status_code=404, detail="PO not found")
#     return po

@router.post("/api/admin/po")
def create_po_entry(po: POCreateSchema, db: Session = Depends(get_db)):
    return create_po(db, po)

@router.put("/api/admin/po/{po_id}")
def update_po_entry(po_id: int, po_data: POUpdateSchema, db: Session = Depends(get_db)):
    return update_po(db, po_id, po_data)

@router.delete("/api/admin/po/{po_id}")
def delete_po_entry(po_id: int, db: Session = Depends(get_db)):
    return delete_po(db, po_id)
