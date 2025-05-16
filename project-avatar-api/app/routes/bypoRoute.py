from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from sqlalchemy.orm import Session 
from app.database.db import get_db
from sqlalchemy.sql import text
from typing import Optional, Dict, Any, List

from app.controllers.bypoController import (
    get_invoice_list, get_invoice_by_id, create_invoice, update_invoice, 
    get_po_data_grouped_by_poid, delete_invoice
)

from app.schemas import InvoiceCreateSchema, InvoiceUpdateSchema, InvoiceSchema

router = APIRouter()

@router.get("/invoices/selection")
def get_invoice_selection(db: Session = Depends(get_db)):
    result = get_invoice_list(db, 0, 1000)
    return result

@router.get("/invoices-po")
def get_po_invoices(
    page: int = Query(1, ge=1),
    page_size: int = Query(100, ge=1, le=1000),
    poid: Optional[int] = None,
    search: Optional[str] = None,
    sort_field: str = Query("invoicedate"),
    sort_order: str = Query("desc"),
    db: Session = Depends(get_db)
):
    result = get_po_data_grouped_by_poid(
        db, 
        poid=poid, 
        page=page, 
        page_size=page_size,
        search=search,
        sort_field=sort_field,
        sort_order=sort_order
    )
    return result
    
@router.get("/invoices/po/{po_id}")
def get_invoices_by_po_id(po_id: int, db: Session = Depends(get_db)):
    result = get_invoice_by_id(db, po_id)
    if not result:
        raise HTTPException(status_code=404, detail="Invoices not found for this PO")
    return result

@router.post("/invoices/bypo/post/", response_model=InvoiceSchema)
def create_invoice_entry(invoice: InvoiceCreateSchema, db: Session = Depends(get_db)):
    try:
        return create_invoice(db, invoice)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/invoices/put/{invoice_id}", response_model=InvoiceSchema)
def update_invoice_entry(invoice_id: int, invoice: InvoiceUpdateSchema, db: Session = Depends(get_db)):
    result = update_invoice(db, invoice_id, invoice)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

@router.delete("/invoices/bypo/delete/{invoice_id}")
def delete_invoice_entry(invoice_id: int, db: Session = Depends(get_db)):
    result = delete_invoice(db, invoice_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

# ******************new implementation******************

# from fastapi import APIRouter, Depends, HTTPException, Query
# from sqlalchemy.orm import Session
# from typing import List, Optional, Dict, Any
# from app.database.db import get_db
# from app.controllers import bypoController, bymonthController, overdueController
# from app.schemas import InvoiceCreateSchema, InvoiceUpdateSchema, InvoiceSchema, OverdueUpdateSchema

# router = APIRouter()

# @router.get("/invoices-po")
# def get_po_invoices(
#     page: int = Query(1, ge=1),
#     page_size: int = Query(100, ge=1, le=1000),
#     po_id: Optional[int] = None,
#     search: Optional[str] = None,
#     sort_field: str = "invoicedate",
#     sort_order: str = "desc",
#     db: Session = Depends(get_db)
# ):
#     result = bypoController.get_po_data_grouped_by_poid(
#         db, po_id, page, page_size, search, sort_field, sort_order
#     )
#     return result

# @router.get("/invoices/po/{po_id}")
# def get_invoices_by_po_id(po_id: int, db: Session = Depends(get_db)):
#     result = bypoController.get_invoice_by_id(db, po_id)
#     if not result:
#         raise HTTPException(status_code=404, detail="Invoices not found for this PO")
#     return result

# @router.get("/invoices/selection")
# def get_invoice_selection(db: Session = Depends(get_db)):
#     result = bypoController.get_invoice_list(db, 0, 1000)
#     return result

# @router.post("/invoices", response_model=InvoiceSchema)
# def create_invoice(invoice: InvoiceCreateSchema, db: Session = Depends(get_db)):
#     return bypoController.create_invoice(db, invoice)

# @router.put("/invoices/{invoice_id}", response_model=InvoiceSchema)
# def update_invoice(invoice_id: int, invoice: InvoiceUpdateSchema, db: Session = Depends(get_db)):
#     result = bypoController.update_invoice(db, invoice_id, invoice)
#     if isinstance(result, dict) and "error" in result:
#         raise HTTPException(status_code=404, detail=result["error"])
#     return result

# @router.delete("/invoices/{invoice_id}")
# def delete_invoice(invoice_id: int, db: Session = Depends(get_db)):
#     result = bypoController.delete_invoice(db, invoice_id)
#     if "error" in result:
#         raise HTTPException(status_code=404, detail=result["error"])
#     return result

# @router.get("/invoices/dataByMonth")
# def get_invoices_by_month(
#     page: int = Query(1, ge=1),
#     page_size: int = Query(100, ge=1, le=1000),
#     month: Optional[str] = None,
#     search_companyname: Optional[str] = None,
#     sort_field: str = "invoicedate",
#     sort_order: str = "desc",
#     db: Session = Depends(get_db)
# ):
#     search_params = {}
#     if search_companyname:
#         search_params["companyname"] = search_companyname
    
#     result = bymonthController.get_invoices_grouped_by_month(
#         db, month, page, page_size, search_params, sort_field, sort_order
#     )
#     return result

# @router.get("/invoices/months")
# def get_invoice_months(db: Session = Depends(get_db)):
#     result = bymonthController.get_invoice_months(db)
#     return result

