# new-projects-avatar-fullstack/project-avatar-api/app/controllers/leads_controller.py

from sqlalchemy.orm import Session
from app import models, schemas
from fastapi import HTTPException
from datetime import datetime
from app.schemas import LeadCreate, LeadUpdate, LeadResponse

def get_leads(db: Session, page_size: int, offset: int):
    query = db.query(models.Lead).order_by(models.Lead.leadid.desc())
    total_rows = query.count()
    leads = query.offset(offset).limit(page_size).all()
    return {"data": leads, "totalRows": total_rows}

def get_lead_by_id(db: Session, leadid: int):
    return db.query(models.Lead).filter(models.Lead.leadid == leadid).first()

# def insert_lead(db: Session, new_lead: schemas.LeadCreate):
#     print("Incoming lead data:", new_lead.dict()) 
#     db_lead = models.Lead(**new_lead.dict())
#     db.add(db_lead)
#     db.commit()
#     db.refresh(db_lead)
#     return db_lead


def insert_lead(db: Session, new_lead: schemas.LeadCreate):
    db_lead = models.Lead(**new_lead.dict())
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead


# def update_lead(db: Session, leadid: int, updated_lead: schemas.LeadUpdate):
#     lead = db.query(models.Lead).filter(models.Lead.leadid == leadid).first()
#     if not lead:
#         raise HTTPException(status_code=404, detail="Lead not found")
    
#     update_data = updated_lead.dict(exclude_unset=True)
    
#     # Convert string dates to datetime objects if present
#     if 'startdate' in update_data and update_data['startdate']:
#         update_data['startdate'] = datetime.strptime(update_data['startdate'], '%Y-%m-%d %H:%M:%S')
#     if 'closedate' in update_data and update_data['closedate']:
#         update_data['closedate'] = datetime.strptime(update_data['closedate'], '%Y-%m-%d').date()
    
#     for key, value in update_data.items():
#         setattr(lead, key, value)

#     db.commit()
#     db.refresh(lead)
#     return lead


def update_lead(db: Session, leadid: int, updated_lead: schemas.LeadUpdate):
    lead = db.query(models.Lead).filter(models.Lead.leadid == leadid).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    update_data = updated_lead.dict(exclude_unset=True)
    
    # Handle date fields - no conversion needed if already datetime
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