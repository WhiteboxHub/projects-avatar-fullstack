# # # new-projects-avatar-fullstack/project-avatar-api/app/routes/bypoRoute.py


from fastapi import APIRouter, Depends, HTTPException , Query
from typing import Optional
from sqlalchemy.orm import Session 
from app.database.db import get_db
from sqlalchemy.sql import text
from typing import Optional, Dict, Any

from app.controllers.bypoController import (
get_invoice_list, get_invoice_by_id, create_invoice, update_invoice, get_po_data_grouped_by_poid, delete_invoice  )

from app.schemas import InvoiceSchema, InvoiceCreateSchema, InvoiceUpdateSchema

router = APIRouter()

@router.get("/api/admin/invoices")
def read_invoices(page: int = 1, page_size: int = 1000, db: Session = Depends(get_db)):
    skip = (page - 1) * page_size
    return get_invoice_list(db, skip, page_size)


@router.get("/api/admin/invoices-po")
def get_grouped_po_data( poid: Optional[int] = Query(None), page: int = Query(1), page_size: int = Query(1000), db: Session = Depends(get_db)):
    return get_po_data_grouped_by_poid(db, poid=poid, page=page, page_size=page_size)
    
@router.get("/api/admin/invoices/data/{invoice_id}")
def read_invoice_by_id(invoice_id: int, db: Session = Depends(get_db)):
    invoice = get_invoice_by_id(db, invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice


@router.post("/api/admin/invoices/post/")
def create_invoice_entry(invoice_data: InvoiceCreateSchema, db: Session = Depends(get_db)):
    print(invoice_data)  
    try:
        return create_invoice(db, invoice_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/api/admin/invoices/put/{invoice_id}")
def update_invoice_entry(invoice_id: int, invoice_data: InvoiceUpdateSchema, db: Session = Depends(get_db)):
    return update_invoice(db, invoice_id, invoice_data)

@router.delete("/api/admin/invoices/bypo/delete/{invoice_id}")
def delete_invoice_entry(invoice_id: int, db: Session = Depends(get_db)):
    result = delete_invoice(db, invoice_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result
