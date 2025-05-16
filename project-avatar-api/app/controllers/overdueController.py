# # avatar/projects-avatar-api/app/controllers/overdueController.py
# from sqlalchemy.orm import Session
# from sqlalchemy.sql import text
# from app.models import Overdue
# from app.schemas import OverdueUpdateSchema
# from typing import Optional

# def get_overdue_count(db: Session):
#     query = text("""
#         SELECT COUNT(*) as total
#         FROM invoice i
#         JOIN po p ON i.poid = p.id
#         WHERE i.status NOT IN ('Void', 'Closed') AND
#         DATE_ADD(i.invoicedate, INTERVAL p.invoicenet DAY) <= CURDATE()
#     """)
    
#     result = db.execute(query).first()
#     return result[0] if result else 0

# def get_overdue_list(db: Session, skip: int = 0, limit: int = 100, search_term: Optional[str] = None):
#     base_query = """
#         SELECT
#             i.id AS pkid,
#             (SELECT concat(c.name, ' - ', v.companyname, ' - ', cl.companyname)
#              FROM candidate c
#              JOIN placement p ON c.candidateid = p.candidateid
#              JOIN po o ON o.placementid = p.id
#              JOIN vendor v ON p.vendorid = v.id
#              JOIN client cl ON p.clientid = cl.id
#              WHERE o.id = i.poid) AS poid,
#             i.invoicenumber,
#             i.invoicedate,
#             i.quantity,
#             p.rate,
#             DATE_ADD(i.invoicedate, INTERVAL p.invoicenet DAY) AS expecteddate,
#             ((i.quantity * p.rate) + (i.otquantity * p.overtimerate)) AS amountexpected,
#             i.startdate,
#             i.enddate,
#             i.status,
#             i.remindertype,
#             i.amountreceived,
#             i.receiveddate,
#             i.releaseddate,
#             i.checknumber,
#             i.invoiceurl,
#             i.checkurl,
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
#         FROM
#             invoice i
#         JOIN
#             po p ON i.poid = p.id
#         JOIN
#             placement pl ON p.placementid = pl.id
#         JOIN
#             candidate c ON pl.candidateid = c.candidateid
#         JOIN
#             vendor v ON pl.vendorid = v.id
#         JOIN
#             recruiter r ON pl.recruiterid = r.id
#         WHERE
#             i.status NOT IN ('Void', 'Closed') AND
#             DATE_ADD(i.invoicedate, INTERVAL p.invoicenet DAY) <= CURDATE()
#     """
    
#     if search_term:
#         search_condition = """
#             AND (
#                 c.name LIKE :search_term OR
#                 v.companyname LIKE :search_term OR
#                 i.invoicenumber LIKE :search_term
#             )
#         """
#         base_query += search_condition
#         params = {"limit": limit, "skip": skip, "search_term": f"%{search_term}%"}
#     else:
#         params = {"limit": limit, "skip": skip}
    
#     # Add ordering and pagination
#     base_query += """
#         ORDER BY
#             expecteddate DESC
#         LIMIT :limit OFFSET :skip
#     """
    
#     query = text(base_query)
#     result = db.execute(query, params).mappings().all()
    
#     # Get total count for pagination
#     total_rows = get_overdue_count(db)
    
#     return {"data": result, "totalRows": total_rows}

# def get_overdue_by_id(db: Session, overdue_id: int):
#     query = text("""
#         SELECT
#             i.id AS pkid,
#             (SELECT concat(c.name, ' - ', v.companyname, ' - ', cl.companyname)
#              FROM candidate c
#              JOIN placement p ON c.candidateid = p.candidateid
#              JOIN po o ON o.placementid = p.id
#              JOIN vendor v ON p.vendorid = v.id
#              JOIN client cl ON p.clientid = cl.id
#              WHERE o.id = i.poid) AS poid,
#             i.invoicenumber,
#             i.invoicedate,
#             i.quantity,
#             p.rate,
#             DATE_ADD(i.invoicedate, INTERVAL p.invoicenet DAY) AS expecteddate,
#             ((i.quantity * p.rate) + (i.otquantity * p.overtimerate)) AS amountexpected,
#             i.startdate,
#             i.enddate,
#             i.status,
#             i.remindertype,
#             i.amountreceived,
#             i.receiveddate,
#             i.releaseddate,
#             i.checknumber,
#             i.invoiceurl,
#             i.checkurl,
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
#         FROM
#             invoice i
#         JOIN
#             po p ON i.poid = p.id
#         JOIN
#             placement pl ON p.placementid = pl.id
#         JOIN
#             candidate c ON pl.candidateid = c.candidateid
#         JOIN
#             vendor v ON pl.vendorid = v.id
#         JOIN
#             recruiter r ON pl.recruiterid = r.id
#         WHERE
#             i.id = :overdue_id
#     """)

#     result = db.execute(query, {"overdue_id": overdue_id}).mappings().first()
#     return result

# def get_overdue_by_name(db: Session, candidate_name: str):
#     query = text("""
#         SELECT
#             i.id AS pkid,
#             (SELECT CONCAT(c2.name, ' - ', v2.companyname, ' - ', cl2.companyname)
#              FROM candidate c2
#              JOIN placement p2 ON c2.candidateid = p2.candidateid
#              JOIN po o2 ON o2.placementid = p2.id
#              JOIN vendor v2 ON p2.vendorid = v2.id
#              JOIN client cl2 ON p2.clientid = cl2.id
#              WHERE o2.id = i.poid) AS poid,
#             i.invoicenumber,
#             i.invoicedate,
#             i.quantity,
#             p.rate,
#             DATE_ADD(i.invoicedate, INTERVAL p.invoicenet DAY) AS expecteddate,
#             ((i.quantity * p.rate) + (i.otquantity * p.overtimerate)) AS amountexpected,
#             i.startdate,
#             i.enddate,
#             i.status,
#             i.remindertype,
#             i.amountreceived,
#             i.receiveddate,
#             i.releaseddate,
#             i.checknumber,
#             i.invoiceurl,
#             i.checkurl,
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
#         FROM
#             invoice i
#         JOIN
#             po p ON i.poid = p.id
#         JOIN
#             placement pl ON p.placementid = pl.id
#         JOIN
#             candidate c ON pl.candidateid = c.candidateid
#         JOIN
#             vendor v ON pl.vendorid = v.id
#         JOIN
#             recruiter r ON pl.recruiterid = r.id
#         WHERE
#             c.name LIKE :candidate_name
#     """)

#     result = db.execute(query, {"candidate_name": f"%{candidate_name}%"}).mappings().all()
#     return {"data": result, "totalRows": len(result)}

# def update_overdue(db: Session, overdue_id: int, overdue_data: OverdueUpdateSchema):
#     query = text("""
#         UPDATE invoice
#         SET
#             status = :status,
#             remindertype = :remindertype,
#             amountreceived = :amountreceived,
#             receiveddate = :receiveddate,
#             checknumber = :checknumber,
#             notes = :notes
#         WHERE id = :overdue_id
#     """)

#     params = {
#         "status": overdue_data.status,
#         "remindertype": overdue_data.remindertype,
#         "amountreceived": overdue_data.amountreceived,
#         "receiveddate": overdue_data.receiveddate,
#         "checknumber": overdue_data.checknumber,
#         "notes": overdue_data.notes,
#         "overdue_id": overdue_id
#     }

#     result = db.execute(query, params)
#     db.commit()

#     if result.rowcount == 0:
#         return {"error": "Overdue not found"}

#     return {"message": "Overdue updated successfully"}



# In app/controllers/overdueController.py

from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from app.models import Overdue, Invoice
from app.schemas import OverdueUpdateSchema
from typing import Optional, Dict, Any

def get_overdue_count(db: Session):
    query = text("""
        SELECT COUNT(*) as total
        FROM invoice i
        JOIN po p ON i.poid = p.id
        WHERE i.status NOT IN ('Void', 'Closed') AND
        DATE_ADD(i.invoicedate, INTERVAL p.invoicenet DAY) <= CURDATE()
    """)
    
    result = db.execute(query).scalar()
    return result if result else 0

def get_overdue_list(db: Session, skip: int = 0, limit: int = 100, search_term: Optional[str] = None):
    base_query = """
        SELECT
            i.id AS pkid,
            (SELECT concat(c.name, ' - ', v.companyname, ' - ', cl.companyname)
             FROM candidate c
             JOIN placement p ON c.candidateid = p.candidateid
             JOIN po o ON o.placementid = p.id
             JOIN vendor v ON p.vendorid = v.id
             JOIN client cl ON p.clientid = cl.id
             WHERE o.id = i.poid) AS poid,
            i.invoicenumber,
            i.invoicedate,
            i.quantity,
            p.rate,
            DATE_ADD(i.invoicedate, INTERVAL p.invoicenet DAY) AS expecteddate,
            ((i.quantity * p.rate) + (i.otquantity * p.overtimerate)) AS amountexpected,
            i.startdate,
            i.enddate,
            i.status,
            i.remindertype,
            i.amountreceived,
            i.receiveddate,
            i.releaseddate,
            i.checknumber,
            i.invoiceurl,
            i.checkurl,
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
        FROM
            invoice i
        JOIN
            po p ON i.poid = p.id
        JOIN
            placement pl ON p.placementid = pl.id
        JOIN
            candidate c ON pl.candidateid = c.candidateid
        JOIN
            vendor v ON pl.vendorid = v.id
        JOIN
            recruiter r ON pl.recruiterid = r.id
        WHERE
            i.status NOT IN ('Void', 'Closed') AND
            DATE_ADD(i.invoicedate, INTERVAL p.invoicenet DAY) <= CURDATE()
    """
    
    if search_term:
        search_condition = """
            AND (
                c.name LIKE :search_term OR
                v.companyname LIKE :search_term OR
                i.invoicenumber LIKE :search_term
            )
        """
        base_query += search_condition
        params = {"limit": limit, "skip": skip, "search_term": f"%{search_term}%"}
    else:
        params = {"limit": limit, "skip": skip}
    
    # Add ordering and pagination
    base_query += """
        ORDER BY
            expecteddate DESC
        LIMIT :limit OFFSET :skip
    """
    
    query = text(base_query)
    result = db.execute(query, params).mappings().all()
    
    # Get total count for pagination
    total_rows = get_overdue_count(db)
    
    return {"data": result, "totalRows": total_rows}

def get_overdue_by_id(db: Session, overdue_id: int):
    query = text("""
        SELECT
            i.id AS pkid,
            (SELECT concat(c.name, ' - ', v.companyname, ' - ', cl.companyname)
             FROM candidate c
             JOIN placement p ON c.candidateid = p.candidateid
             JOIN po o ON o.placementid = p.id
             JOIN vendor v ON p.vendorid = v.id
             JOIN client cl ON p.clientid = cl.id
             WHERE o.id = i.poid) AS poid,
            i.invoicenumber,
            i.invoicedate,
            i.quantity,
            p.rate,
            DATE_ADD(i.invoicedate, INTERVAL p.invoicenet DAY) AS expecteddate,
            ((i.quantity * p.rate) + (i.otquantity * p.overtimerate)) AS amountexpected,
            i.startdate,
            i.enddate,
            i.status,
            i.remindertype,
            i.amountreceived,
            i.receiveddate,
            i.releaseddate,
            i.checknumber,
            i.invoiceurl,
            i.checkurl,
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
        FROM
            invoice i
        JOIN
            po p ON i.poid = p.id
        JOIN
            placement pl ON p.placementid = pl.id
        JOIN
            candidate c ON pl.candidateid = c.candidateid
        JOIN
            vendor v ON pl.vendorid = v.id
        JOIN
            recruiter r ON pl.recruiterid = r.id
        WHERE
            i.id = :overdue_id
    """)

    result = db.execute(query, {"overdue_id": overdue_id}).mappings().first()
    return result

def get_overdue_by_name(db: Session, candidate_name: str):
    query = text("""
        SELECT
            i.id AS pkid,
            (SELECT CONCAT(c2.name, ' - ', v2.companyname, ' - ', cl2.companyname)
             FROM candidate c2
             JOIN placement p2 ON c2.candidateid = p2.candidateid
             JOIN po o2 ON o2.placementid = p2.id
             JOIN vendor v2 ON p2.vendorid = v2.id
             JOIN client cl2 ON p2.clientid = cl2.id
             WHERE o2.id = i.poid) AS poid,
            i.invoicenumber,
            i.invoicedate,
            i.quantity,
            p.rate,
            DATE_ADD(i.invoicedate, INTERVAL p.invoicenet DAY) AS expecteddate,
            ((i.quantity * p.rate) + (i.otquantity * p.overtimerate)) AS amountexpected,
            i.startdate,
            i.enddate,
            i.status,
            i.remindertype,
            i.amountreceived,
            i.receiveddate,
            i.releaseddate,
            i.checknumber,
            i.invoiceurl,
            i.checkurl,
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
        FROM
            invoice i
        JOIN
            po p ON i.poid = p.id
        JOIN
            placement pl ON p.placementid = pl.id
        JOIN
            candidate c ON pl.candidateid = c.candidateid
        JOIN
            vendor v ON pl.vendorid = v.id
        JOIN
            recruiter r ON pl.recruiterid = r.id
        WHERE
            i.status NOT IN ('Void', 'Closed') AND
            DATE_ADD(i.invoicedate, INTERVAL p.invoicenet DAY) <= CURDATE() AND
            c.name LIKE :candidate_name
        ORDER BY
            expecteddate DESC
    """)

    result = db.execute(query, {"candidate_name": f"%{candidate_name}%"}).mappings().all()
    return {"data": result, "totalRows": len(result)}

def update_overdue(db: Session, overdue_id: int, overdue_data: OverdueUpdateSchema):
    invoice = db.query(Invoice).filter(Invoice.id == overdue_id).first()
    if not invoice:
        return {"error": "Invoice not found"}
    
    update_data = overdue_data.dict(exclude_unset=True)
    
    # Update the invoice record
    for key, value in update_data.items():
        setattr(invoice, key, value)
    
    db.commit()
    db.refresh(invoice)
    return invoice