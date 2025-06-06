# # # new-projects-avatar-fullstack/project-avatar-api/app/controllers/bypoController.py

# # from sqlalchemy.orm import Session
# # from app.models import Invoice
# # from app.schemas import InvoiceCreateSchema, InvoiceUpdateSchema
# # from sqlalchemy import text

# # def get_invoice_list(db: Session, skip: int, limit: int):
# #     query = text("""
# #         SELECT null AS id, '' AS pname FROM dual
# #         UNION
# #         SELECT
# #             o.id,
# #             CONCAT(c.name, '-', v.companyname, '-', cl.companyname, '-', o.id) AS pname
# #         FROM candidate c
# #         JOIN placement p ON c.candidateid = p.candidateid
# #         JOIN po o ON o.placementid = p.id
# #         JOIN vendor v ON p.vendorid = v.id
# #         JOIN client cl ON p.clientid = cl.id
# #         ORDER BY pname
# #         LIMIT :limit OFFSET :skip
# #     """)
# #     result = db.execute(query, {'skip': skip, 'limit': limit})
# #     return [dict(row._mapping) for row in result]

# # def get_invoice_by_id(db: Session, po_id: int):
# #     query = text("""
# #         SELECT
# #             i.id,
# #             i.invoicenumber,
# #             i.startdate,
# #             i.enddate,
# #             i.invoicedate,
# #             i.quantity,
# #             i.otquantity,
# #             p.rate,
# #             p.overtimerate,
# #             i.status,
# #             i.emppaiddate,
# #             i.candpaymentstatus,
# #             i.reminders,
# #             ((i.quantity * p.rate) + (i.otquantity * p.overtimerate)) AS amountexpected,
# #             DATE_ADD(i.invoicedate, INTERVAL p.invoicenet DAY) AS expecteddate,
# #             i.amountreceived,
# #             i.receiveddate,
# #             i.releaseddate,
# #             i.checknumber,
# #             i.invoiceurl,
# #             i.checkurl,
# #             p.freqtype,
# #             p.invoicenet,
# #             v.companyname,
# #             v.fax AS vendorfax,
# #             v.phone AS vendorphone,
# #             v.email AS vendoremail,
# #             v.timsheetemail,
# #             v.hrname,
# #             v.hremail,
# #             v.hrphone,
# #             v.managername,
# #             v.manageremail,
# #             v.managerphone,
# #             v.secondaryname,
# #             v.secondaryemail,
# #             v.secondaryphone,
# #             c.name AS candidatename,
# #             c.phone AS candidatephone,
# #             c.email AS candidateemail,
# #             pl.wrkemail,
# #             pl.wrkphone,
# #             r.name AS recruitername,
# #             r.phone AS recruiterphone,
# #             r.email AS recruiteremail,
# #             i.poid,
# #             i.notes
# #         FROM invoice i
# #         JOIN po p ON i.poid = p.id
# #         JOIN placement pl ON p.placementid = pl.id
# #         JOIN candidate c ON pl.candidateid = c.candidateid
# #         JOIN vendor v ON pl.vendorid = v.id
# #         JOIN recruiter r ON pl.recruiterid = r.id
# #         WHERE p.id = :po_id AND i.status <> 'Delete'
# #     """)
# #     result = db.execute(query, {'po_id': po_id})    
# #     rows = result.fetchall()
# #     return [dict(row._mapping) for row in rows] if rows else None

# # def create_invoice(db: Session, invoice_data: InvoiceCreateSchema):
# #     new_invoice = Invoice(**invoice_data.dict())
# #     db.add(new_invoice)
# #     db.commit()
# #     db.refresh(new_invoice)
# #     return new_invoice

# # def update_invoice(db: Session, invoice_id: int, invoice_data: InvoiceUpdateSchema):
# #     existing_invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
# #     if not existing_invoice:
# #         return {"error": "Invoice not found"}

# #     update_data = invoice_data.dict(exclude_unset=True)
# #     for key, value in update_data.items():
# #         setattr(existing_invoice, key, value)

# #     db.commit()
# #     db.refresh(existing_invoice)
# #     return existing_invoice





# # new implementation 




# from sqlalchemy.orm import Session
# from app.models import Invoice
# from app.schemas import InvoiceCreateSchema, InvoiceUpdateSchema
# from sqlalchemy import text
# from typing import Optional, Dict, Any, List

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
#     # Handle empty date fields to prevent validation errors
#     data_dict = invoice_data.dict()
    
#     # Convert empty strings to None for date fields
#     if 'releaseddate' in data_dict and data_dict['releaseddate'] == '':
#         data_dict['releaseddate'] = None
#     if 'receiveddate' in data_dict and data_dict['receiveddate'] == '':
#         data_dict['receiveddate'] = None
#     if 'emppaiddate' in data_dict and data_dict['emppaiddate'] == '':
#         data_dict['emppaiddate'] = None
    
#     new_invoice = Invoice(**data_dict)
#     db.add(new_invoice)
#     db.commit()
#     db.refresh(new_invoice)
#     return new_invoice

# def update_invoice(db: Session, invoice_id: int, invoice_data: InvoiceUpdateSchema):
#     existing_invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
#     if not existing_invoice:
#         return {"error": "Invoice not found"}

#     update_data = invoice_data.dict(exclude_unset=True)
    
#     # Convert empty strings to None for date fields
#     if 'releaseddate' in update_data and update_data['releaseddate'] == '':
#         update_data['releaseddate'] = None
#     if 'receiveddate' in update_data and update_data['receiveddate'] == '':
#         update_data['receiveddate'] = None
#     if 'emppaiddate' in update_data and update_data['emppaiddate'] == '':
#         update_data['emppaiddate'] = None
    
#     for key, value in update_data.items():
#         setattr(existing_invoice, key, value)

#     db.commit()
#     db.refresh(existing_invoice)
#     return existing_invoice

# def get_po_data_grouped_by_poid(
#     db: Session,
#     poid: Optional[int] = None,
#     page: int = 1,
#     page_size: int = 100,
#     search: Optional[str] = None,
#     sort_field: str = "invoicedate",
#     sort_order: str = "desc"
# ) -> Dict[str, Any]:
#     offset = (page - 1) * page_size

#     base_query = """
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
#         WHERE i.status <> 'Delete'
#     """

#     params: Dict[str, Any] = {
#         "limit": page_size,
#         "offset": offset
#     }

#     # Add search condition if provided
#     if search:
#         base_query += """ AND (
#             i.invoicenumber LIKE :search OR
#             c.name LIKE :search OR
#             v.companyname LIKE :search OR
#             i.status LIKE :search OR
#             i.checknumber LIKE :search OR
#             CAST(i.poid AS CHAR) LIKE :search
#         )"""
#         params["search"] = f"%{search}%"

#     # Add PO ID filter if provided
#     if poid:
#         base_query += " AND p.id = :poid"
#         params["poid"] = poid

#     # Add sorting
#     valid_sort_fields = [
#         "id", "invoicenumber", "startdate", "enddate", "invoicedate", 
#         "quantity", "status", "amountexpected", "expecteddate", 
#         "amountreceived", "receiveddate", "checknumber", "poid",
#         "candidatename", "companyname"
#     ]
    
#     # Default to invoicedate if sort_field is not valid
#     if sort_field not in valid_sort_fields:
#         sort_field = "invoicedate"
    
#     # Ensure sort_order is either "asc" or "desc"
#     if sort_order.lower() not in ["asc", "desc"]:
#         sort_order = "desc"
    
#     # Add ORDER BY clause
#     base_query += f" ORDER BY {sort_field} {sort_order}"
    
#     # Add pagination
#     base_query += " LIMIT :limit OFFSET :offset"
    
#     # Execute the query
#     rows = db.execute(text(base_query), params).fetchall()

#     # Group the results by PO ID
#     grouped_data = {}
#     for row in rows:
#         key = row.poid
#         name = f"{row.candidatename}---{row.companyname}---{key}"

#         if key not in grouped_data:
#             grouped_data[key] = {
#                 "name": name,
#                 "poid": key,
#                 "pos": []
#             }

#         grouped_data[key]["pos"].append({k: v for k, v in row._mapping.items()})

#     # Calculate summary data for each group
#     for key in grouped_data:
#         group = grouped_data[key]
#         total_expected = sum(float(item.get('amountexpected', 0) or 0) for item in group["pos"])
#         total_received = sum(float(item.get('amountreceived', 0) or 0) for item in group["pos"])
#         total_quantity = sum(int(item.get('quantity', 0) or 0) for item in group["pos"])
        
#         group["summary"] = {
#             "amountexpected": total_expected,
#             "amountreceived": total_received,
#             "quantity": total_quantity
#         }

#     # Count total records for pagination
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
    
#     # Add search condition to count query if provided
#     if search:
#         count_query += """ AND (
#             i.invoicenumber LIKE :search OR
#             c.name LIKE :search OR
#             v.companyname LIKE :search OR
#             i.status LIKE :search OR
#             i.checknumber LIKE :search OR
#             CAST(i.poid AS CHAR) LIKE :search
#         )"""
#         count_params["search"] = f"%{search}%"
    
#     # Add PO ID filter to count query if provided
#     if poid:
#         count_query += " AND p.id = :poid"
#         count_params["poid"] = poid

#     total = db.execute(text(count_query), count_params).scalar()

#     # Calculate total pages
#     total_pages = (total + page_size - 1) // page_size if total > 0 else 1

#     # Return the response with pagination info
#     return {
#         "data": list(grouped_data.values()),
#         "total": total,
#         "page": page,
#         "page_size": page_size,
#         "pages": total_pages,
#         "sort_field": sort_field,
#         "sort_order": sort_order
#     }

# def delete_invoice(db: Session, invoice_id: int):
#     # Soft delete by updating status to 'Delete' instead of actually deleting the record
#     existing_invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
#     if not existing_invoice:
#         return {"error": "Invoice not found"}

#     existing_invoice.status = 'Delete'
#     db.commit()
#     return {"message": "Invoice deleted successfully"}                    



# In app/controllers/bypoController.py

from sqlalchemy.orm import Session
from app.models import Invoice
from app.schemas import InvoiceCreateSchema, InvoiceUpdateSchema
from sqlalchemy import text
from typing import Optional, Dict, Any, List

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
    result = db.execute(query, {'skip': skip, 'limit': limit}).mappings().all()
    return result

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
        WHERE i.poid = :po_id AND i.status <> 'Delete'
    """)
    result = db.execute(query, {'po_id': po_id}).mappings().all()
    return result

# def create_invoice(db: Session, invoice_data: InvoiceCreateSchema):
#     # Handle empty date fields to prevent validation errors
#     data_dict = invoice_data.dict()
    
#     # Create new invoice record
#     new_invoice = Invoice(**data_dict)
#     db.add(new_invoice)
#     db.commit()
#     db.refresh(new_invoice)
#     return new_invoice

def create_invoice(db: Session, invoice_data: InvoiceCreateSchema):
    data_dict = invoice_data.dict()
    
    # Convert empty date strings to None
    date_fields = ['releaseddate', 'receiveddate', 'emppaiddate']
    for field in date_fields:
        if field in data_dict and isinstance(data_dict[field], str) and not data_dict[field].strip():
            data_dict[field] = None
    
    new_invoice = Invoice(**data_dict)
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
    page_size: int = 100,
    search: Optional[str] = None,
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
            CONCAT(c.name, '-', v.companyname, '-', cl.companyname, '-', p.id) AS pname,
            i.notes
        FROM invoice i
        JOIN po p ON i.poid = p.id
        JOIN placement pl ON p.placementid = pl.id
        JOIN candidate c ON pl.candidateid = c.candidateid
        JOIN vendor v ON pl.vendorid = v.id
        JOIN client cl ON pl.clientid = cl.id
        JOIN recruiter r ON pl.recruiterid = r.id
        WHERE i.status <> 'Delete'
    """

    params = {
        "limit": page_size,
        "offset": offset
    }

    # Add optional filter by PO ID
    if poid:
        base_query += " AND i.poid = :poid"
        params["poid"] = poid

    # Add search capability
    if search:
        base_query += """
            AND (
                i.invoicenumber LIKE :search OR
                c.name LIKE :search OR
                v.companyname LIKE :search OR
                cl.companyname LIKE :search
            )
        """
        params["search"] = f"%{search}%"

    # Apply sorting
    base_query += f" ORDER BY {sort_field} {sort_order} LIMIT :limit OFFSET :offset"

    # Execute query and fetch results
    result = db.execute(text(base_query), params).mappings().all()

    # Get total count for pagination
    count_query = """
        SELECT COUNT(*)
        FROM invoice i
        JOIN po p ON i.poid = p.id
        JOIN placement pl ON p.placementid = pl.id
        JOIN candidate c ON pl.candidateid = c.candidateid
        JOIN vendor v ON pl.vendorid = v.id
        JOIN client cl ON pl.clientid = cl.id
        WHERE i.status <> 'Delete'
    """

    count_params = {}
    if poid:
        count_query += " AND i.poid = :poid"
        count_params["poid"] = poid

    if search:
        count_query += """
            AND (
                i.invoicenumber LIKE :search OR
                c.name LIKE :search OR
                v.companyname LIKE :search OR
                cl.companyname LIKE :search
            )
        """
        count_params["search"] = f"%{search}%"

    total = db.execute(text(count_query), count_params).scalar()

    # Group data by PO ID
    grouped_data = {}
    for row in result:
        po_id = row["poid"]
        
        if po_id not in grouped_data:
            grouped_data[po_id] = {
                "poid": po_id,
                "name": row["pname"],
                "pos": [],
                "invoice_count": 0,
                "summary": {
                    "quantity": 0,
                    "amountexpected": 0,
                    "amountreceived": 0
                }
            }
        
        invoice_data = {k: v for k, v in row.items() if k != "pname"}
        grouped_data[po_id]["pos"].append(invoice_data)
        grouped_data[po_id]["invoice_count"] += 1
        
        # Update summary data
        grouped_data[po_id]["summary"]["quantity"] += float(row["quantity"] or 0)
        grouped_data[po_id]["summary"]["amountexpected"] += float(row["amountexpected"] or 0)
        grouped_data[po_id]["summary"]["amountreceived"] += float(row["amountreceived"] or 0)

    return {
        "data": list(grouped_data.values()),
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": (total + page_size - 1) // page_size
    }

def delete_invoice(db: Session, invoice_id: int):
    # Soft delete by updating status to 'Delete' instead of actually deleting the record
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        return {"error": "Invoice not found"}
    
    invoice.status = "Delete"
    db.commit()
    return {"message": "Invoice deleted successfully"}