# new-projects-avatar-fullstack/project-avatar-api/app/controllers/poController.py
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from app.models import PO
from app.schemas import POSchema, POCreateSchema, POUpdateSchema
from datetime import date
from typing import Optional

def get_po_list(db: Session, skip: int, limit: int):
    query = text("""
        SELECT
            po.id AS id,
            po.placementid,
            CONCAT(c.name, '---', v.companyname, '---', cl.companyname) AS placement_details,
            po.begindate, 
            po.enddate, 
            po.rate, 
            po.overtimerate, 
            po.freqtype, 
            po.frequency, 
            po.invoicestartdate, 
            po.invoicenet, 
            po.polink, 
            po.notes
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

def get_po_by_name(db: Session, name_fragment: str):
    query = text("""
        SELECT
            po.id,
            po.placementid,
            CONCAT(c.name, '---', v.companyname, '---', cl.companyname) AS placement_details,
            po.begindate, 
            po.enddate, 
            po.rate, 
            po.overtimerate,
            po.freqtype, 
            po.frequency, 
            po.invoicestartdate,
            po.invoicenet, 
            po.polink, 
            po.notes
        FROM po
        LEFT JOIN placement pl ON po.placementid = pl.id
        LEFT JOIN candidate c ON pl.candidateid = c.candidateid
        LEFT JOIN vendor v ON pl.vendorid = v.id
        LEFT JOIN client cl ON pl.clientid = cl.id
        WHERE c.name LIKE :name_fragment
        ORDER BY po.id DESC
    """)

    result = db.execute(query, {"name_fragment": f"%{name_fragment}%"}).mappings().all()
    return result

def get_po_by_id(db: Session, po_id: int):
    query = text("""
        SELECT
            po.id,
            po.placementid,
            CONCAT(c.name, '---', v.companyname, '---', cl.companyname) AS placement_details,
            po.begindate, 
            po.enddate, 
            po.rate, 
            po.overtimerate,
            po.freqtype, 
            po.frequency, 
            po.invoicestartdate,
            po.invoicenet, 
            po.polink, 
            po.notes
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
    po_data = po.dict()
    
    # Handle date fields properly
    if po_data.get('begindate') is None or po_data.get('begindate') == date(1000, 1, 1):
        po_data['begindate'] = None
    
    if po_data.get('enddate') is None or po_data.get('enddate') == '':
        po_data['enddate'] = None
    
    if po_data.get('invoicestartdate') is None or po_data.get('invoicestartdate') == date(1000, 1, 1):
        po_data['invoicestartdate'] = None
    
    # Create new PO record
    new_po = PO(**po_data)
    db.add(new_po)
    db.commit()
    db.refresh(new_po)
    return new_po

def update_po(db: Session, po_id: int, po_data: POUpdateSchema):
    existing_po = db.query(PO).filter(PO.id == po_id).first()
    if not existing_po:
        return {"error": "PO not found"}
    
    update_data = po_data.dict(exclude_unset=True)
    
    # Handle date fields properly
    if 'begindate' in update_data and (update_data['begindate'] is None or update_data['begindate'] == ''):
        update_data['begindate'] = None
    
    if 'enddate' in update_data and (update_data['enddate'] is None or update_data['enddate'] == ''):
        update_data['enddate'] = None
    
    if 'invoicestartdate' in update_data and (update_data['invoicestartdate'] is None or update_data['invoicestartdate'] == ''):
        update_data['invoicestartdate'] = None
    
    # Update PO record
    for key, value in update_data.items():
        setattr(existing_po, key, value)

    db.commit()
    db.refresh(existing_po)
    # Return the object directly, not checking for "error" in result
    return existing_po

def delete_po(db: Session, po_id: int):
    po = db.query(PO).filter(PO.id == po_id).first()
    if not po:
        return {"error": "PO not found"}
    
    db.delete(po)
    db.commit()
    return {"message": "PO deleted successfully"}

def get_po_data(db: Session):
    query = text("""
        SELECT '' as id, '' as name FROM dual
        UNION
        SELECT pl.id, CONCAT(c.name, '---', v.companyname, '---', cl.companyname) AS name
        FROM placement pl
        JOIN candidate c ON pl.candidateid = c.candidateid
        JOIN vendor v ON pl.vendorid = v.id
        JOIN client cl ON pl.clientid = cl.id
        ORDER BY name
    """)

    result = db.execute(query).mappings().all()
    return result