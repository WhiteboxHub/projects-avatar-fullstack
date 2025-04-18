# new-projects-avatar-fullstack/project-avatar-api/app/routes/bymonthRoute.py

# from fastapi import APIRouter, Depends, HTTPException
from fastapi import APIRouter, Depends, HTTPException, Query

from sqlalchemy.orm import Session
from app.database.db import get_db
from app.controllers.bymonthController import get_invoice_months, get_invoices_grouped_by_month,create_invoice, update_invoice ,get_pname_list ,delete_invoice
from app.schemas import InvoiceCreateSchema, InvoiceUpdateSchema
from typing import Optional


router = APIRouter()

@router.get("/api/admin/invoices/month-list")
def read_invoice_months(db: Session = Depends(get_db)):
    return get_invoice_months(db)

@router.get("/api/admin/invoices/dataByMonth")
def read_invoices_by_month(
    month: Optional[str] = Query(None),
    page: int = Query(1),
    page_size: int = Query(5000),
    db: Session = Depends(get_db)
):
    return get_invoices_grouped_by_month(db, month=month, page=page, page_size=page_size)

@router.get("/api/admin/pname-list/")
def read_pname_list(db: Session = Depends(get_db)):
    return get_pname_list(db)

@router.post("/api/admin/bymonth/post/")
def create_invoice_entry(invoice_data: InvoiceCreateSchema, db: Session = Depends(get_db)):
    try:
        return create_invoice(db, invoice_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/api/admin/bymonth/put/{invoice_id}")
def update_invoice_entry(invoice_id: int, invoice_data: InvoiceUpdateSchema, db: Session = Depends(get_db)):
    result = update_invoice(db, invoice_id, invoice_data)
    
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])

    return result

@router.delete("/api/admin/bymonth/delete/{invoice_id}")
def delete_invoice_entry(invoice_id: int, db: Session = Depends(get_db)):
    result = delete_invoice(db, invoice_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


