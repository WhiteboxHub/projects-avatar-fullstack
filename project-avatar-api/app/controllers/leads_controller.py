from sqlalchemy.orm import Session
from app import models, schemas
from fastapi import HTTPException
from datetime import datetime
from app.schemas import LeadCreate, LeadUpdate, LeadResponse
from typing import List, Optional

def get_leads(db: Session, page_size: int, offset: int):
    query = db.query(models.Lead).order_by(models.Lead.leadid.desc())
    total_rows = query.count()
    leads = query.offset(offset).limit(page_size).all()
    return {"data": leads, "totalRows": total_rows}

def get_lead_by_id(db: Session, leadid: int):
    return db.query(models.Lead).filter(models.Lead.leadid == leadid).first()

def search_leads_by_name(db: Session, name: str) -> List[models.Lead]:
    return db.query(models.Lead)\
             .filter(models.Lead.name.ilike(f"%{name}%"))\
             .all()

def insert_lead(db: Session, new_lead: schemas.LeadCreate):
    lead_data = new_lead.dict()
    
    # Handle empty callsmade field
    if 'callsmade' in lead_data and (lead_data['callsmade'] == '' or lead_data['callsmade'] is None):
        lead_data['callsmade'] = 0
    
    db_lead = models.Lead(**lead_data)
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead

def update_lead(db: Session, leadid: int, updated_lead: schemas.LeadUpdate):
    lead = db.query(models.Lead).filter(models.Lead.leadid == leadid).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    update_data = updated_lead.dict(exclude_unset=True)
    
    # Handle empty callsmade field
    if 'callsmade' in update_data and (update_data['callsmade'] == '' or update_data['callsmade'] is None):
        update_data['callsmade'] = 0
    
    # Handle date fields
    if 'startdate' in update_data and isinstance(update_data['startdate'], str):
        try:
            update_data['startdate'] = datetime.fromisoformat(update_data['startdate'])
        except ValueError:
            try:
                update_data['startdate'] = datetime.strptime(update_data['startdate'], '%Y-%m-%d %H:%M:%S')
            except ValueError:
                raise HTTPException(status_code=422, detail="Invalid startdate format")
    
    if 'closedate' in update_data and isinstance(update_data['closedate'], str):
        try:
            update_data['closedate'] = datetime.strptime(update_data['closedate'], '%Y-%m-%d').date()
        except ValueError:
            raise HTTPException(status_code=422, detail="Invalid closedate format")
    
    for key, value in update_data.items():
        setattr(lead, key, value)

    db.commit()
    db.refresh(lead)
    return lead

def delete_lead(db: Session, leadid: int):
    lead = db.query(models.Lead).filter(models.Lead.leadid == leadid).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    db.delete(lead)
    db.commit()
    return {"message": "Lead deleted successfully"}

def create_candidate_from_lead(db: Session, lead: models.Lead):
    # Mandatory field validation
    if not lead.workstatus:
        raise HTTPException(status_code=400, detail="Lead workstatus must be set before conversion")
    if not lead.course:
        raise HTTPException(status_code=400, detail="Valid course must be selected before conversion")

    candidate_data = {
        "workstatus": lead.workstatus,  # Direct mapping
        "course": lead.course,
        "name": lead.name,
        "email": lead.email,
        "phone": lead.phone,
        "address": lead.address,
        "city": lead.city,
        "state": lead.state,
        "country": lead.country,
        "zip": lead.zip,
        "status": "A",
        "batchname": "Converted Leads",
        "processflag": "Y",
        "statuschangedate": datetime.now().date()
    }

    db_candidate = models.Candidate(**candidate_data)
    db.add(db_candidate)
    db.commit()
    return db_candidate