from sqlalchemy.orm import Session
from app import models, schemas
from fastapi import HTTPException

def get_leads(db: Session, search: str, pageSize: int, offset: int):
    query = db.query(models.Lead)
    if search:
        query = query.filter(models.Lead.name.ilike(f"%{search}%"))
    total_rows = query.count()
    leads = query.offset(offset).limit(pageSize).all()
    
    return {"data": leads, "totalRows": total_rows}

def insert_lead(db: Session, new_lead: schemas.LeadCreate):
    db_lead = models.Lead(**new_lead.dict())
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead

def update_lead(db: Session, id: int, updated_lead: schemas.LeadUpdate):
    lead = db.query(models.Lead).filter(models.Lead.id == id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    for key, value in updated_lead.dict(exclude_unset=True).items():
        setattr(lead, key, value)

    db.commit()
    db.refresh(lead)
    return lead

def delete_lead(db: Session, id: int):
    lead = db.query(models.Lead).filter(models.Lead.id == id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    db.delete(lead)
    db.commit()
    return {"message": "Lead deleted successfully"}


def search_leads(db: Session, search: str, pageSize: int, offset: int):
    query = db.query(models.Lead).filter(models.Lead.name.ilike(f"%{search}%"))
    total_rows = query.count()
    leads = query.offset(offset).limit(pageSize).all()
    
    return {"data": leads, "totalRows": total_rows}