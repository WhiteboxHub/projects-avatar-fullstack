from sqlalchemy.orm import Session
from app.models import Invoice
from app.schemas import InvoiceCreateSchema, InvoiceUpdateSchema
from sqlalchemy import text

def get_invoice_months(db: Session):
    query = text("""
        SELECT DISTINCT DATE_FORMAT(i.invoicedate, "%Y-%c-%M") AS invmonth
        FROM invoice i
        WHERE i.status <> "Delete"
        ORDER BY invmonth DESC;
    """)
    result = db.execute(query)
    return [dict(row._mapping) for row in result]

def get_invoices_by_month(db: Session, month: str, search: str = None, skip: int = 0, limit: int = 100):
    query = text("""
        SELECT
            i.id,
            i.poid,
            i.invoicenumber,
            i.startdate,
            i.enddate,
            i.invoicedate,
            DATE_FORMAT(i.invoicedate, "%Y-%c-%M") AS invmonth,
            i.quantity,
            i.otquantity,
            p.rate,
            p.overtimerate,
            i.status,
            i.emppaiddate,
            i.candpaymentstatus,
            i.reminders,
            ((i.quantity * p.rate) + (i.otquantity * p.overtimerate)) AS amountexpected,
            DATE_ADD(i.invoicedate, INTERVAL p.invoicenet DAY) AS expecteddate,
            i.amountreceived,
            i.receiveddate,
            i.releaseddate,
            i.checknumber,
            i.invoiceurl,
            i.checkurl,
            p.freqtype,
            p.invoicenet,
            v.companyname,
            v.fax AS vendorfax,
            v.phone AS vendorphone,
            v.email AS vendoremail,
            v.timsheetemail,
            v.hrname,
            v.hremail,
            v.hrphone,
            v.managername,
            v.manageremail,
            v.managerphone,
            v.secondaryname,
            v.secondaryemail,
            v.secondaryphone,
            c.name AS candidatename,
            c.phone AS candidatephone,
            c.email AS candidateemail,
            pl.wrkemail,
            pl.wrkphone,
            r.name AS recruitername,
            r.phone AS recruiterphone,
            r.email AS recruiteremail,
            i.notes
        FROM invoice i
        JOIN po p ON i.poid = p.id
        JOIN placement pl ON p.placementid = pl.id
        JOIN candidate c ON pl.candidateid = c.candidateid
        JOIN vendor v ON pl.vendorid = v.id
        JOIN recruiter r ON pl.recruiterid = r.id
        WHERE i.status <> 'Delete'
        AND (:month IS NULL OR DATE_FORMAT(i.invoicedate, "%Y-%c-%M") = :month)
        AND (:search IS NULL OR i.invoicenumber LIKE :search OR c.name LIKE :search)
        LIMIT :limit OFFSET :skip;
    """)
    search_param = f"%{search}%" if search else None
    result = db.execute(query, {'month': month, 'search': search_param, 'skip': skip, 'limit': limit})
    return [dict(row._mapping) for row in result]

def create_invoice(db: Session, invoice_data: InvoiceCreateSchema):
    new_invoice = Invoice(**invoice_data.dict())
    db.add(new_invoice)
    db.commit()
    db.refresh(new_invoice)
    return new_invoice

# def update_invoice(db: Session, invoice_id: int, invoice_data: InvoiceUpdateSchema):
#     existing_invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
#     if not existing_invoice:
#         return {"error": "Invoice not found"}

#     update_data = invoice_data.dict(exclude_unset=True)
#     for key, value in update_data.items():
#         setattr(existing_invoice, key, value)

#     db.commit()
#     db.refresh(existing_invoice)
#     return existing_invoice
def update_invoice(db: Session, invoice_id: int, invoice_data: InvoiceUpdateSchema):
    existing_invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not existing_invoice:
        return {"error": "Invoice not found"}

    if invoice_data.invoicenumber:
        duplicate = db.query(Invoice).filter(
            Invoice.invoicenumber == invoice_data.invoicenumber,
            Invoice.id != invoice_id
        ).first()
        if duplicate:
            return {"error": f"Invoicenumber '{invoice_data.invoicenumber}' already exists."}

    update_data = invoice_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(existing_invoice, key, value)

    db.commit()
    db.refresh(existing_invoice)
    return existing_invoice

def get_pname_list(db: Session):
    query = text("""
        SELECT null as id, '' as pname FROM dual
        UNION
        SELECT
          o.id,
          CONCAT(c.name, '-', v.companyname, '-', cl.companyname, '-', o.id) as pname
        FROM
          candidate c, placement p, po o, vendor v, client cl
        WHERE
          c.candidateid = p.candidateid
          AND o.placementid = p.id
          AND p.vendorid = v.id
          AND p.clientid = cl.id
        ORDER BY pname;
    """)
    result = db.execute(query)
    return [dict(row._mapping) for row in result]