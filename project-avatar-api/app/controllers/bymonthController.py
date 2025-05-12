# # new-projects-avatar-fullstack/project-avatar-api/app/controllers/bymonthController.py

# from sqlalchemy.orm import Session
# from app.models import Invoice
# from app.schemas import InvoiceCreateSchema, InvoiceUpdateSchema
# from sqlalchemy import text
# from typing import Optional, Dict, Any, List

# def get_invoice_months(db: Session):
#     query = text("""
#         SELECT DISTINCT DATE_FORMAT(i.invoicedate, "%Y-%c-%M") AS invmonth
#         FROM invoice i
#         WHERE i.status <> "Delete"
#         ORDER BY invmonth DESC;
#     """)
#     result = db.execute(query)
#     return [dict(row._mapping) for row in result]

# def get_invoices_grouped_by_month(
#     db: Session,
#     month: Optional[str] = None,
#     page: int = 1,
#     page_size: int = 100,
#     search_params: Optional[Dict[str, Any]] = None,
#     sort_field: str = "invoicedate",
#     sort_order: str = "desc"
# ) -> Dict[str, Any]:
#     offset = (page - 1) * page_size

#     base_query = """
#         SELECT
#             i.id,
#             i.poid,
#             i.invoicenumber,
#             i.startdate,
#             i.enddate,
#             i.invoicedate,
#             DATE_FORMAT(i.invoicedate, "%Y-%c-%M") AS invmonth,
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
#             i.notes
#         FROM invoice i
#         JOIN po p ON i.poid = p.id
#         JOIN placement pl ON p.placementid = pl.id
#         JOIN candidate c ON pl.candidateid = c.candidateid
#         JOIN vendor v ON pl.vendorid = v.id
#         JOIN recruiter r ON pl.recruiterid = r.id
#         WHERE i.status <> 'Delete'
#     """

#     params = {
#         "limit": page_size,
#         "offset": offset
#     }

#     # Apply search filters if provided
#     if search_params:
#         for field, value in search_params.items():
#             if value and field in ["poid", "invoicenumber", "status", "reminders", "candpaymentstatus"]:
#                 base_query += f" AND i.{field} = :{field}"
#                 params[field] = value
#             elif value and field in ["startdate", "enddate", "invoicedate", "receiveddate", "releaseddate", "emppaiddate"]:
#                 base_query += f" AND i.{field} = :{field}"
#                 params[field] = value
#             elif value and field == "companyname":
#                 base_query += " AND v.companyname LIKE :companyname"
#                 params[field] = f"%{value}%"
#             elif value and field == "candidatename":
#                 base_query += " AND c.name LIKE :candidatename"
#                 params[field] = f"%{value}%"

#     if month:
#         base_query += " AND DATE_FORMAT(i.invoicedate, '%Y-%c-%M') = :month"
#         params["month"] = month

#     # Apply sorting
#     base_query += f" ORDER BY {sort_field} {sort_order} LIMIT :limit OFFSET :offset"
#     rows = db.execute(text(base_query), params).fetchall()

#     grouped_data = {}
#     for row in rows:
#         key = row.invmonth
#         if key not in grouped_data:
#             grouped_data[key] = {
#                 "invmonth": key,
#                 "invoices": [],
#                 "summary": {
#                     "quantity": 0,
#                     "otquantity": 0,
#                     "amountexpected": 0,
#                     "amountreceived": 0
#                 }
#             }

#         invoice_data = {k: v for k, v in row._mapping.items()}
#         grouped_data[key]["invoices"].append(invoice_data)
        
#         # Update summary data
#         grouped_data[key]["summary"]["quantity"] += float(row.quantity or 0)
#         grouped_data[key]["summary"]["otquantity"] += float(row.otquantity or 0)
#         grouped_data[key]["summary"]["amountexpected"] += float(row.amountexpected or 0)
#         grouped_data[key]["summary"]["amountreceived"] += float(row.amountreceived or 0)

#     # Total count
#     count_query = """
#         SELECT COUNT(*)
#         FROM invoice i
#         JOIN po p ON i.poid = p.id
#         JOIN placement pl ON p.placementid = pl.id
#         JOIN candidate c ON pl.candidateid = c.candidateid
#         JOIN vendor v ON pl.vendorid = v.id
#         WHERE i.status <> 'Delete'
#     """
#     count_params = {}
    
#     # Apply the same search filters to count query
#     if search_params:
#         for field, value in search_params.items():
#             if value and field in ["poid", "invoicenumber", "status", "reminders", "candpaymentstatus"]:
#                 count_query += f" AND i.{field} = :{field}"
#                 count_params[field] = value
#             elif value and field in ["startdate", "enddate", "invoicedate", "receiveddate", "releaseddate", "emppaiddate"]:
#                 count_query += f" AND i.{field} = :{field}"
#                 count_params[field] = value
#             elif value and field == "companyname":
#                 count_query += " AND v.companyname LIKE :companyname"
#                 count_params[field] = f"%{value}%"
#             elif value and field == "candidatename":
#                 count_query += " AND c.name LIKE :candidatename"
#                 count_params[field] = f"%{value}%"
    
#     if month:
#         count_query += " AND DATE_FORMAT(i.invoicedate, '%Y-%c-%M') = :month"
#         count_params["month"] = month

#     total = db.execute(text(count_query), count_params).scalar()

#     # Calculate totals across all groups
#     overall_summary = {
#         "quantity": 0,
#         "otquantity": 0,
#         "amountexpected": 0,
#         "amountreceived": 0
#     }
    
#     for group in grouped_data.values():
#         overall_summary["quantity"] += group["summary"]["quantity"]
#         overall_summary["otquantity"] += group["summary"]["otquantity"]
#         overall_summary["amountexpected"] += group["summary"]["amountexpected"]
#         overall_summary["amountreceived"] += group["summary"]["amountreceived"]

#     return {
#         "data": list(grouped_data.values()),
#         "total": total,
#         "page": page,
#         "page_size": page_size,
#         "pages": (total + page_size - 1) // page_size,
#         "sort_field": sort_field,
#         "sort_order": sort_order,
#         "overall_summary": overall_summary
#     }

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

#     if invoice_data.invoicenumber:
#         duplicate = db.query(Invoice).filter(
#             Invoice.invoicenumber == invoice_data.invoicenumber,
#             Invoice.id != invoice_id
#         ).first()
#         if duplicate:
#             return {"error": f"Invoicenumber '{invoice_data.invoicenumber}' already exists."}

#     update_data = invoice_data.dict(exclude_unset=True)
#     for key, value in update_data.items():
#         setattr(existing_invoice, key, value)

#     db.commit()
#     db.refresh(existing_invoice)
#     return existing_invoice

# def get_pname_list(db: Session):
#     query = text("""
#         SELECT null as id, '' as pname FROM dual
#         UNION
#         SELECT
#           o.id,
#           CONCAT(c.name, '-', v.companyname, '-', cl.companyname, '-', o.id) as pname
#         FROM
#           candidate c, placement p, po o, vendor v, client cl
#         WHERE
#           c.candidateid = p.candidateid
#           AND o.placementid = p.id
#           AND p.vendorid = v.id
#           AND p.clientid = cl.id
#         ORDER BY pname;
#     """)
#     result = db.execute(query)
#     return [dict(row._mapping) for row in result]

# def delete_invoice(db: Session, invoice_id: int):
#     invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
#     if not invoice:
#         return {"error": "Invoice not found"}
    
#     # Soft delete by updating status to "Delete"
#     invoice.status = "Delete"
#     db.commit()
#     return {"message": "Invoice deleted successfully"}






from sqlalchemy.orm import Session
from app.models import Invoice
from app.schemas import InvoiceCreateSchema, InvoiceUpdateSchema
from sqlalchemy import text
from typing import Optional, Dict, Any, List

def get_invoice_months(db: Session):
    query = text("""
        SELECT DISTINCT DATE_FORMAT(i.invoicedate, "%Y-%M") AS invmonth
        FROM invoice i
        WHERE i.status <> "Delete"
        ORDER BY invmonth DESC;
    """)
    result = db.execute(query)
    return [dict(row._mapping) for row in result]

def get_invoices_grouped_by_month(
    db: Session,
    month: Optional[str] = None,
    page: int = 1,
    page_size: int = 100,
    search_params: Optional[Dict[str, Any]] = None,
    sort_field: str = "invoicedate",
    sort_order: str = "desc"
) -> Dict[str, Any]:
    offset = (page - 1) * page_size

    base_query = """
        SELECT
            i.id,
            i.poid,
            i.invoicenumber,
            i.startdate,
            i.enddate,
            i.invoicedate,
            DATE_FORMAT(i.invoicedate, "%Y-%M") AS invmonth,
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
    """

    params = {
        "limit": page_size,
        "offset": offset
    }

    if search_params:
        for field, value in search_params.items():
            if value and field in ["poid", "invoicenumber", "status", "reminders", "candpaymentstatus"]:
                base_query += f" AND i.{field} = :{field}"
                params[field] = value
            elif value and field in ["startdate", "enddate", "invoicedate", "receiveddate", "releaseddate", "emppaiddate"]:
                base_query += f" AND i.{field} = :{field}"
                params[field] = value
            elif value and field == "companyname":
                base_query += " AND v.companyname LIKE :companyname"
                params[field] = f"%{value}%"
            elif value and field == "candidatename":
                base_query += " AND c.name LIKE :candidatename"
                params[field] = f"%{value}%"

    if month:
        base_query += " AND DATE_FORMAT(i.invoicedate, '%Y-%M') = :month"
        params["month"] = month

    valid_sort_fields = [
        "invoicedate", "startdate", "enddate", "invoicenumber", 
        "companyname", "candidatename", "amountexpected", "amountreceived"
    ]
    
    if sort_field not in valid_sort_fields:
        sort_field = "invoicedate"
    
    if sort_order.lower() not in ["asc", "desc"]:
        sort_order = "desc"
    
    base_query += f" ORDER BY {sort_field} {sort_order} LIMIT :limit OFFSET :offset"
    rows = db.execute(text(base_query), params).fetchall()

    grouped_data = {}
    for row in rows:
        key = row.invmonth
        group_name = f"{row.invmonth} - {row.candidatename} - {row.companyname}"
        
        if key not in grouped_data:
            grouped_data[key] = {
                "invmonth": key,
                "name": group_name,
                "invoices": [],
                "summary": {
                    "quantity": 0,
                    "otquantity": 0,
                    "amountexpected": 0,
                    "amountreceived": 0
                }
            }

        invoice_data = {k: v for k, v in row._mapping.items()}
        grouped_data[key]["invoices"].append(invoice_data)
        
        grouped_data[key]["summary"]["quantity"] += float(row.quantity or 0)
        grouped_data[key]["summary"]["otquantity"] += float(row.otquantity or 0)
        grouped_data[key]["summary"]["amountexpected"] += float(row.amountexpected or 0)
        grouped_data[key]["summary"]["amountreceived"] += float(row.amountreceived or 0)

    count_query = """
        SELECT COUNT(*)
        FROM invoice i
        JOIN po p ON i.poid = p.id
        JOIN placement pl ON p.placementid = pl.id
        JOIN candidate c ON pl.candidateid = c.candidateid
        JOIN vendor v ON pl.vendorid = v.id
        WHERE i.status <> 'Delete'
    """
    count_params = {}
    
    if search_params:
        for field, value in search_params.items():
            if value and field in ["poid", "invoicenumber", "status", "reminders", "candpaymentstatus"]:
                count_query += f" AND i.{field} = :{field}"
                count_params[field] = value
            elif value and field in ["startdate", "enddate", "invoicedate", "receiveddate", "releaseddate", "emppaiddate"]:
                count_query += f" AND i.{field} = :{field}"
                count_params[field] = value
            elif value and field == "companyname":
                count_query += " AND v.companyname LIKE :companyname"
                count_params[field] = f"%{value}%"
            elif value and field == "candidatename":
                count_query += " AND c.name LIKE :candidatename"
                count_params[field] = f"%{value}%"
    
    if month:
        count_query += " AND DATE_FORMAT(i.invoicedate, '%Y-%M') = :month"
        count_params["month"] = month

    total = db.execute(text(count_query), count_params).scalar()

    overall_summary = {
        "quantity": 0,
        "otquantity": 0,
        "amountexpected": 0,
        "amountreceived": 0
    }
    
    for group in grouped_data.values():
        overall_summary["quantity"] += group["summary"]["quantity"]
        overall_summary["otquantity"] += group["summary"]["otquantity"]
        overall_summary["amountexpected"] += group["summary"]["amountexpected"]
        overall_summary["amountreceived"] += group["summary"]["amountreceived"]

    return {
        "data": list(grouped_data.values()),
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": (total + page_size - 1) // page_size,
        "sort_field": sort_field,
        "sort_order": sort_order,
        "overall_summary": overall_summary
    }

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

def delete_invoice(db: Session, invoice_id: int):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        return {"error": "Invoice not found"}
    
    invoice.status = "Delete"
    db.commit()
    return {"message": "Invoice deleted successfully"}