# new-projects-avatar-fullstack/project-avatar-api/app/routes/bymonthRoute.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.controllers.bymonthController import get_invoice_months, get_invoices_grouped_by_month, create_invoice, update_invoice, get_pname_list, delete_invoice
from app.schemas import InvoiceCreateSchema, InvoiceUpdateSchema
from typing import Optional, Dict, Any


router = APIRouter()

@router.get("/api/admin/invoices/month-list")
def read_invoice_months(db: Session = Depends(get_db)):
    return get_invoice_months(db)

@router.get("/api/admin/invoices/dataByMonth")
def read_invoices_by_month(
    month: Optional[str] = Query(None),
    page: int = Query(1),
    page_size: int = Query(5000),
    sort_field: str = Query("invoicedate"),
    sort_order: str = Query("desc"),
    search_poid: Optional[str] = None,
    search_invoicenumber: Optional[str] = None,
    search_status: Optional[str] = None,
    search_reminders: Optional[str] = None,
    search_candpaymentstatus: Optional[str] = None,
    search_startdate: Optional[str] = None,
    search_enddate: Optional[str] = None,
    search_invoicedate: Optional[str] = None,
    search_receiveddate: Optional[str] = None,
    search_releaseddate: Optional[str] = None,
    search_emppaiddate: Optional[str] = None,
    search_companyname: Optional[str] = None,
    search_candidatename: Optional[str] = None,
    db: Session = Depends(get_db)
):
    search_params: Dict[str, Any] = {}
    
    if search_poid:
        search_params["poid"] = search_poid
    if search_invoicenumber:
        search_params["invoicenumber"] = search_invoicenumber
    if search_status:
        search_params["status"] = search_status
    if search_reminders:
        search_params["reminders"] = search_reminders
    if search_candpaymentstatus:
        search_params["candpaymentstatus"] = search_candpaymentstatus
    if search_startdate:
        search_params["startdate"] = search_startdate
    if search_enddate:
        search_params["enddate"] = search_enddate
    if search_invoicedate:
        search_params["invoicedate"] = search_invoicedate
    if search_receiveddate:
        search_params["receiveddate"] = search_receiveddate
    if search_releaseddate:
        search_params["releaseddate"] = search_releaseddate
    if search_emppaiddate:
        search_params["emppaiddate"] = search_emppaiddate
    if search_companyname:
        search_params["companyname"] = search_companyname
    if search_candidatename:
        search_params["candidatename"] = search_candidatename
    
    return get_invoices_grouped_by_month(
        db, 
        month=month, 
        page=page, 
        page_size=page_size,
        search_params=search_params,
        sort_field=sort_field,
        sort_order=sort_order
    )

@router.get("/api/admin/pname-list/")
def read_pname_list(db: Session = Depends(get_db)):
    return get_pname_list(db)

@router.post("/api/admin/invoices/post/")
def create_invoice_entry(invoice_data: InvoiceCreateSchema, db: Session = Depends(get_db)):
    try:
        return create_invoice(db, invoice_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/api/admin/invoices/put/{invoice_id}")
def update_invoice_entry(invoice_id: int, invoice_data: InvoiceUpdateSchema, db: Session = Depends(get_db)):
    result = update_invoice(db, invoice_id, invoice_data)
    
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])

    return result

@router.delete("/api/admin/invoices/delete/{invoice_id}")
def delete_invoice_entry(invoice_id: int, db: Session = Depends(get_db)):
    result = delete_invoice(db, invoice_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result
