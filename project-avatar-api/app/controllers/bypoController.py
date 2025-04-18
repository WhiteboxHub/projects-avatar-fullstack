# # new-projects-avatar-fullstack/project-avatar-api/app/controllers/bypoController.py

# from sqlalchemy.orm import Session
# from app.models import Invoice
# from app.schemas import InvoiceCreateSchema, InvoiceUpdateSchema
# from sqlalchemy import text

# def get_invoice_list(db: Session, skip: int, limit: int):
#     query = text("""
#         SELECT null AS id, '' AS pname FROM dual
#         UNION
#         SELECT
#             o.id,
#             CONCAT(c.name, '-', v.companyname, '-', cl.companyname, '-', o.id) AS pname
#         FROM candidate c
#         JOIN placement p ON c.candidateid = p.candidateid
#         JOIN po o ON o.placementid = p.id
#         JOIN vendor v ON p.vendorid = v.id
#         JOIN client cl ON p.clientid = cl.id
#         ORDER BY pname
#         LIMIT :limit OFFSET :skip
#     """)
#     result = db.execute(query, {'skip': skip, 'limit': limit})
#     return [dict(row._mapping) for row in result]

# def get_invoice_by_id(db: Session, po_id: int):
#     query = text("""
#         SELECT
#             i.id,
#             i.invoicenumber,
#             i.startdate,
#             i.enddate,
#             i.invoicedate,
#             i.quantity,
#             i.otquantity,
#             p.rate,
#             p.overtimerate,
#             i.status,
#             i.emppaiddate,
#             i.candpaymentstatus,
#             i.reminders,
#             ((i.quantity * p.rate) + (i.otquantity * p.overtimerate)) AS amountexpected,
#             DATE_ADD(i.invoicedate, INTERVAL p.invoicenet DAY) AS expecteddate,
#             i.amountreceived,
#             i.receiveddate,
#             i.releaseddate,
#             i.checknumber,
#             i.invoiceurl,
#             i.checkurl,
#             p.freqtype,
#             p.invoicenet,
#             v.companyname,
#             v.fax AS vendorfax,
#             v.phone AS vendorphone,
#             v.email AS vendoremail,
#             v.timsheetemail,
#             v.hrname,
#             v.hremail,
#             v.hrphone,
#             v.managername,
#             v.manageremail,
#             v.managerphone,
#             v.secondaryname,
#             v.secondaryemail,
#             v.secondaryphone,
#             c.name AS candidatename,
#             c.phone AS candidatephone,
#             c.email AS candidateemail,
#             pl.wrkemail,
#             pl.wrkphone,
#             r.name AS recruitername,
#             r.phone AS recruiterphone,
#             r.email AS recruiteremail,
#             i.poid,
#             i.notes
#         FROM invoice i
#         JOIN po p ON i.poid = p.id
#         JOIN placement pl ON p.placementid = pl.id
#         JOIN candidate c ON pl.candidateid = c.candidateid
#         JOIN vendor v ON pl.vendorid = v.id
#         JOIN recruiter r ON pl.recruiterid = r.id
#         WHERE p.id = :po_id AND i.status <> 'Delete'
#     """)
#     result = db.execute(query, {'po_id': po_id})    
#     rows = result.fetchall()
#     return [dict(row._mapping) for row in rows] if rows else None

# def create_invoice(db: Session, invoice_data: InvoiceCreateSchema):
#     new_invoice = Invoice(**invoice_data.dict())
#     db.add(new_invoice)
#     db.commit()
#     db.refresh(new_invoice)
#     return new_invoice

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





# new implementation 




from sqlalchemy.orm import Session
from app.models import Invoice
from app.schemas import InvoiceCreateSchema, InvoiceUpdateSchema
from sqlalchemy import text
from typing import Optional, Dict, Any
# Existing logic remains unchanged...

def get_invoice_list(db: Session, skip: int, limit: int):
    query = text("""
        SELECT null AS id, '' AS pname FROM dual
        UNION
        SELECT
            o.id,
            CONCAT(c.name, '-', v.companyname, '-', cl.companyname, '-', o.id) AS pname
        FROM candidate c
        JOIN placement p ON c.candidateid = p.candidateid
        JOIN po o ON o.placementid = p.id
        JOIN vendor v ON p.vendorid = v.id
        JOIN client cl ON p.clientid = cl.id
        ORDER BY pname
        LIMIT :limit OFFSET :skip
    """)
    result = db.execute(query, {'skip': skip, 'limit': limit})
    return [dict(row._mapping) for row in result]

def get_invoice_by_id(db: Session, po_id: int):
    query = text("""
        SELECT
            i.id,
            i.invoicenumber,
            i.startdate,
            i.enddate,
            i.invoicedate,
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
            i.poid,
            i.notes
        FROM invoice i
        JOIN po p ON i.poid = p.id
        JOIN placement pl ON p.placementid = pl.id
        JOIN candidate c ON pl.candidateid = c.candidateid
        JOIN vendor v ON pl.vendorid = v.id
        JOIN recruiter r ON pl.recruiterid = r.id
        WHERE p.id = :po_id AND i.status <> 'Delete'
    """)
    result = db.execute(query, {'po_id': po_id})    
    rows = result.fetchall()
    return [dict(row._mapping) for row in rows] if rows else None

def create_invoice(db: Session, invoice_data: InvoiceCreateSchema):
    new_invoice = Invoice(**invoice_data.dict())
    db.add(new_invoice)
    db.commit()
    db.refresh(new_invoice)
    return new_invoice

def update_invoice(db: Session, invoice_id: int, invoice_data: InvoiceUpdateSchema):
    existing_invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not existing_invoice:
        return {"error": "Invoice not found"}

    update_data = invoice_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(existing_invoice, key, value)

    db.commit()
    db.refresh(existing_invoice)
    return existing_invoice


def get_po_data_grouped_by_poid(
    db: Session,
    poid: Optional[int] = None,
    page: int = 1,
    page_size: int = 100
) -> Dict[str, Any]:
    offset = (page - 1) * page_size

    base_query = """
        SELECT
            i.id,
            i.invoicenumber,
            i.startdate,
            i.enddate,
            i.invoicedate,
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
            i.poid,
            i.notes
        FROM invoice i
        JOIN po p ON i.poid = p.id
        JOIN placement pl ON p.placementid = pl.id
        JOIN candidate c ON pl.candidateid = c.candidateid
        JOIN vendor v ON pl.vendorid = v.id
        JOIN recruiter r ON pl.recruiterid = r.id
        WHERE i.status <> 'Delete'
    """

    params = {
        "limit": page_size,
        "offset": offset
    }

    if poid:
        base_query += " AND p.id = :poid"
        params["poid"] = poid

    base_query += " ORDER BY i.invoicedate DESC LIMIT :limit OFFSET :offset"
    rows = db.execute(text(base_query), params).fetchall()

    grouped_data = {}
    for row in rows:
        key = row.poid
        name = f"{row.candidatename}---{row.companyname}---{key}"

        if key not in grouped_data:
            grouped_data[key] = {
                "name": name,
                "poid": key,
                "pos": []
            }

        grouped_data[key]["pos"].append({k: v for k, v in row._mapping.items()})

    # Total count
    count_query = """
        SELECT COUNT(*) 
        FROM invoice i
        JOIN po p ON i.poid = p.id
        WHERE i.status <> 'Delete'
    """
    count_params = {}
    if poid:
        count_query += " AND p.id = :poid"
        count_params["poid"] = poid

    total = db.execute(text(count_query), count_params).scalar()

    return {
        "data": list(grouped_data.values()),
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": (total + page_size - 1) // page_size
    }
    

def delete_invoice(db: Session, invoice_id: int):
    # Soft delete by updating status to 'Delete' instead of actually deleting the record
    existing_invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not existing_invoice:
        return {"error": "Invoice not found"}

    existing_invoice.status = 'Delete'
    db.commit()
    return {"message": "Invoice deleted successfully"}