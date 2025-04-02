from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from app.models import PO
from app.schemas import POSchema, POCreateSchema, POUpdateSchema

def get_po_list(db: Session, skip: int, limit: int):
    query = text("""
        SELECT
            po.id AS POID,
            CONCAT(c.name, '---', v.companyname, '---', cl.companyname) AS placement_details,
            po.begindate, po.enddate, po.rate, po.overtimerate, 
            po.freqtype, po.frequency, po.invoicestartdate, 
            po.invoicenet, po.polink, po.notes
        FROM po
        LEFT JOIN placement pl ON po.placementid = pl.id
        LEFT JOIN candidate c ON pl.candidateid = c.candidateid
        LEFT JOIN vendor v ON pl.vendorid = v.id
        LEFT JOIN client cl ON pl.clientid = cl.id
        ORDER BY po.id DESC
        LIMIT :limit OFFSET :skip
    """)

    result = db.execute(query, {"limit": limit, "skip": skip}).mappings().all()
    return result

def get_po_by_id(db: Session, po_id: int):
    query = text("""
        SELECT
            po.id AS POID,
            CONCAT(c.name, '---', v.companyname, '---', cl.companyname) AS placement_details,
            po.begindate, po.enddate, po.rate, po.overtimerate, 
            po.freqtype, po.frequency, po.invoicestartdate, 
            po.invoicenet, po.polink, po.notes
        FROM po
        LEFT JOIN placement pl ON po.placementid = pl.id
        LEFT JOIN candidate c ON pl.candidateid = c.candidateid
        LEFT JOIN vendor v ON pl.vendorid = v.id
        LEFT JOIN client cl ON pl.clientid = cl.id
        WHERE po.id = :po_id
    """)

    result = db.execute(query, {"po_id": po_id}).mappings().first()
    return result

def create_po(db: Session, po: POCreateSchema):
    new_po = PO(**po.dict())
    db.add(new_po)
    db.commit()
    db.refresh(new_po)
    return new_po

def update_po(db: Session, po_id: int, po_data: POUpdateSchema):
    existing_po = db.query(PO).filter(PO.id == po_id).first()
    if not existing_po:
        return {"error": "PO not found"}
    
    for key, value in po_data.dict(exclude_unset=True).items():
        setattr(existing_po, key, value)

    db.commit()
    return {"message": "PO updated successfully"}

def delete_po(db: Session, po_id: int):
    po = db.query(PO).filter(PO.id == po_id).first()
    if not po:
        return {"error": "PO not found"}
    
    db.delete(po)
    db.commit()
    return {"message": "PO deleted successfully"}
