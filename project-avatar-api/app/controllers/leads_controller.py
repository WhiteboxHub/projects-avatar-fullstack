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
    
    # Add debug logging
    print(f"Updating lead {leadid}")
    print(f"Current course: {lead.course}")
    print(f"New course value: {update_data.get('course')}")
    
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
    
    # Check if status is being changed to "Closed"
    status_changed_to_closed = (
        'status' in update_data and 
        update_data['status'] == 'Closed' and 
        lead.status != 'Closed'
    )
    
    # Update lead fields
    for key, value in update_data.items():
        setattr(lead, key, value)
        if key == 'course':
            print(f"Updated course to: {value}")  # Add debug logging

    try:
        db.commit()
        db.refresh(lead)
        print(f"Lead course after update: {lead.course}")  # Add debug logging
        
        # If status was changed to Closed, create a candidate
        if status_changed_to_closed:
            print(f"Creating candidate from lead with course: {lead.course}")  # Add debug logging
            try:
                candidate = create_candidate_from_lead(db, lead)
                print(f"Created candidate with course: {candidate.course}")  # Add debug logging
                db.commit()
            except HTTPException as e:
                print(f"Failed to create candidate from lead: {str(e)}")
        
        return lead
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update lead: {str(e)}")

def delete_lead(db: Session, leadid: int):
    lead = db.query(models.Lead).filter(models.Lead.leadid == leadid).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    db.delete(lead)
    db.commit()
    return {"message": "Lead deleted successfully"}

def create_candidate_from_lead(db: Session, lead: models.Lead):
    """
    Convert a lead to a candidate with proper field mapping and validation
    """
    # Add debug logging
    print(f"Creating candidate from lead. Lead course: {lead.course}")
    
    # Mandatory field validation
    if not lead.workstatus:
        raise HTTPException(status_code=400, detail="Lead workstatus must be set before conversion")
    if not lead.course:
        raise HTTPException(status_code=400, detail="Valid course must be selected before conversion")
    if lead.course not in ["QA", "UI", "ML"]:
        raise HTTPException(status_code=400, detail="Course must be one of: QA, UI, ML")
    if not lead.city:
        raise HTTPException(status_code=400, detail="City must be set before conversion")

    # Map all relevant fields from lead to candidate
    candidate_data = {
        # Basic Information
        "name": lead.name,
        "email": lead.email,
        "phone": lead.phone,
        "course": lead.course,  # Set course from lead
        "workstatus": lead.workstatus,
        "workexperience": lead.workexperience,
        
        # Contact Information
        "secondaryemail": lead.secondaryemail,
        "secondaryphone": lead.secondaryphone,
        "address": lead.address,
        "city": lead.city,
        "state": lead.state,
        "country": lead.country,
        "zip": lead.zip,
        
        # Status Information
        "status": "A",  # Active status for new candidates
        "batchname": "Converted Leads",
        "processflag": "Y",
        "statuschangedate": datetime.now().date(),
        "enrolleddate": datetime.now().date(),
        
        # Additional Information
        "notes": lead.notes,
        
        # Required fields with proper defaults
        "diceflag": "N",
        "ssnvalidated": "N",
        "bgv": "N",
        "agreement": "N",
        "driverslicense": "N",
        "workpermit": "N",
        "term": None,
        "feepaid": None,
        "feedue": None,
        "salary0": None,
        "salary6": None,
        "salary12": None
    }

    try:
        # Create the candidate with explicit course value
        db_candidate = models.Candidate(**candidate_data)
        print(f"Before adding to DB - Candidate course: {db_candidate.course}")
        
        # Explicitly set the course again to override any default
        db_candidate.course = lead.course
        
        db.add(db_candidate)
        db.commit()
        db.refresh(db_candidate)
        print(f"After commit - Created candidate with course: {db_candidate.course}")
        return db_candidate
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create candidate: {str(e)}")