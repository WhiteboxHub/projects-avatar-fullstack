from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from app.database.db import get_db
from app.controllers.poController import (
    get_po_list, get_po_by_name, get_po_by_id, create_po, update_po, delete_po, get_po_data, get_po_select_list
)
from app.schemas import POSchema, POCreateSchema, POUpdateSchema
from typing import Optional

router = APIRouter()

@router.get("/api/admin/po/data")
def read_po_data(db: Session = Depends(get_db)):
    po_data = get_po_data(db)
    return po_data

@router.get("/api/admin/po")
def read_po(
    page: int = Query(1, ge=1),
    page_size: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    skip = (page - 1) * page_size
    po_list = get_po_list(db, skip, page_size)
    return po_list

@router.get("/api/admin/po/selection")
def read_po_select_list(db: Session = Depends(get_db)):
    result = get_po_select_list(db)
    return result

@router.get("/api/admin/po/name")
def read_po_by_name(name_fragment: str, db: Session = Depends(get_db)):
    po_list = get_po_by_name(db, name_fragment)
    return po_list

@router.get("/api/admin/po/{po_id}")
def read_po_by_id(po_id: int, db: Session = Depends(get_db)):
    po = get_po_by_id(db, po_id)
    if not po:
        raise HTTPException(status_code=404, detail="PO not found")
    return po

@router.post("/api/admin/po", response_model=POSchema)
def create_po_entry(po: POCreateSchema, db: Session = Depends(get_db)):
    result = create_po(db, po)
    return result

@router.put("/api/admin/po/update/{po_id}", response_model=POSchema)
def update_po_entry(po_id: int, po_data: POUpdateSchema, db: Session = Depends(get_db)):
    result = update_po(db, po_id, po_data)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

@router.delete("/api/admin/po/delete/{po_id}")
def delete_po_entry(po_id: int, db: Session = Depends(get_db)):
    result = delete_po(db, po_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result