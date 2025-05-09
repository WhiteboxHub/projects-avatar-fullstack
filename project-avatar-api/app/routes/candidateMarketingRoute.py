from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.controllers.candidateMarketingController import (
    get_candidate_marketing_list, get_candidate_marketing_by_name, update_candidate_marketing, 
    delete_candidate_marketing, get_employees, get_ipemails_dropdown, get_resumes_dropdown,create_candidate_marketing
)
from app.schemas import CandidateMarketingSchema, CandidateMarketingCreateSchema, CandidateMarketingUpdateSchema
from typing import List, Dict, Any
from app.models import CandidateMarketing, Candidate, Employee
from sqlalchemy import text

router = APIRouter()

@router.get("/api/admin/candidatemarketing")
def read_candidate_marketing(page: int = 1, page_size: int = 100, db: Session = Depends(get_db)):
    skip = (page - 1) * page_size
    return get_candidate_marketing_list(db, skip, page_size)

@router.get("/api/admin/candidatemarketing/search/name")
def search_candidate_marketing_by_name(name: str, db: Session = Depends(get_db)):
    candidate_marketing = get_candidate_marketing_by_name(db, name)
    if not candidate_marketing:
        raise HTTPException(status_code=404, detail="Candidate Marketing not found")
    return candidate_marketing

@router.put("/api/admin/candidatemarketing/update/{candidate_marketing_id}")
def update_candidate_marketing_entry(candidate_marketing_id: int, update_data: CandidateMarketingUpdateSchema, db: Session = Depends(get_db)):
    result = update_candidate_marketing(db, candidate_marketing_id, update_data)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.delete("/api/admin/candidatemarketing/{candidate_marketing_id}")
def delete_candidate_marketing_entry(candidate_marketing_id: int, db: Session = Depends(get_db)):
    return delete_candidate_marketing(db, candidate_marketing_id)

@router.get("/api/admin/candidatemarketing/employees", response_model=List[Dict[str, Any]])
def get_employees_list(db: Session = Depends(get_db)):
    employees = get_employees(db)
    return employees

@router.get("/api/admin/candidatemarketing/ipemails", response_model=List[Dict[str, str]])
def get_ip_emails_for_dropdown(db: Session = Depends(get_db)):
    ipemails = get_ipemails_dropdown(db)
    return ipemails

@router.get("/api/admin/candidatemarketing/resumes", response_model=List[Dict[str, Any]])
def get_resumes_for_dropdown(db: Session = Depends(get_db)):
    resumes = get_resumes_dropdown(db)
    return resumes


@router.put("/api/admin/candidatemarketing/update/{candidate_marketing_id}")
def update_candidate_marketing_entry(candidate_marketing_id: int, update_data: CandidateMarketingUpdateSchema, db: Session = Depends(get_db)):
    result = update_candidate_marketing(db, candidate_marketing_id, update_data)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

def update_candidate_marketing(db: Session, candidate_marketing_id: int, update_data: CandidateMarketingUpdateSchema):
    """
    Update a candidate marketing record by ID with the provided data.
    This function handles status transitions that determine whether a candidate appears
    in the current marketing view or not.
    """
    candidate_marketing = db.query(CandidateMarketing).filter(CandidateMarketing.id == candidate_marketing_id).first()
    if not candidate_marketing:
        return {"error": "Candidate Marketing not found"}

    # Store old status for comparison
    old_status = candidate_marketing.status
    
    # Get candidate's course if technology is not provided
    candidate = db.query(Candidate).filter(Candidate.candidateid == candidate_marketing.candidateid).first()
    if candidate:
        # Always sync technology with course if not explicitly provided
        update_data.technology = update_data.technology or candidate.course

    # Status mapping - frontend display names to database values
    status_mapping = {
        "To Do": "1-To Do",
        "Inprogress": "2-Inprogress", 
        "Suspended": "6-Suspended",
        "Closed": "5-Closed"
    }
    
    if update_data.status:
        # Apply status mapping if needed
        update_data.status = status_mapping.get(update_data.status, update_data.status)

    # Process employee relationships
    if update_data.manager_name:
        manager = db.query(Employee).filter(Employee.name == update_data.manager_name, Employee.status == '0Active').first()
        if manager:
            candidate_marketing.mmid = manager.id
        else:
            return {"error": f"Manager with name {update_data.manager_name} not found"}

    if update_data.instructor_name:
        instructor = db.query(Employee).filter(Employee.name == update_data.instructor_name, Employee.status == '0Active').first()
        if instructor:
            candidate_marketing.instructorid = instructor.id
        else:
            return {"error": f"Instructor with name {update_data.instructor_name} not found"}

    if update_data.submitter_name:
        submitter = db.query(Employee).filter(Employee.name == update_data.submitter_name, Employee.status == '0Active').first()
        if submitter:
            candidate_marketing.submitterid = submitter.id
        else:
            return {"error": f"Submitter with name {update_data.submitter_name} not found"}

    # Handle IP Email
    if update_data.ipemail is not None:
        if update_data.ipemail == "":  
            candidate_marketing.ipemailid = 0
        else:
            ipemail = db.execute(
                text("SELECT id FROM ipemail WHERE email = :email"),
                {"email": update_data.ipemail}
            ).fetchone()
            
            if ipemail:
                candidate_marketing.ipemailid = ipemail[0]
            else:
                return {"error": f"IP email {update_data.ipemail} not found"}

    # Validate status transitions
    if update_data.status == "6-Suspended" and not update_data.suspensionreason:
        return {"error": "Suspension reason is required when status is Suspended"}
        
    if update_data.status == "5-Closed" and not update_data.closedate:
        return {"error": "Close date is required when status is Closed"}

    # Update other fields
    update_fields = {
        'status': update_data.status,
        'locationpreference': update_data.locationpreference,
        'priority': update_data.priority,
        'technology': update_data.technology,
        'resumeid': update_data.resumeid,
        'minrate': update_data.minrate,
        'currentlocation': update_data.currentlocation,
        'relocation': update_data.relocation,
        'closedate': update_data.closedate,
        'suspensionreason': update_data.suspensionreason,
        'intro': update_data.intro,
        'notes': update_data.notes,
        'skypeid': update_data.skypeid if hasattr(update_data, 'skypeid') else None
    }

    for field, value in update_fields.items():
        if value is not None:
            setattr(candidate_marketing, field, value)

    db.commit()
    db.refresh(candidate_marketing)
    
    # Prepare the response with additional status change information 
    response = {
        "data": candidate_marketing,
        "message": "Candidate marketing updated successfully"
    }
    
    # Add status transition information for frontend use
    if old_status != candidate_marketing.status:
        # If changing to Suspended or Closed, remove from current marketing
        if candidate_marketing.status in ["6-Suspended", "5-Closed"]:
            response["statusChange"] = "removed_from_current"
            response["message"] = "Candidate has been removed from Current Marketing"
        
        # If changing from Suspended/Closed to any active status, add to current marketing
        elif old_status in ["6-Suspended", "5-Closed"]:
            response["statusChange"] = "added_to_current"
            response["message"] = "Candidate has been added to Current Marketing"
            
        # If status is Closed, and candidate's main status is still Marketing, update it
        if candidate_marketing.status == "5-Closed" and candidate.status == "Marketing":
            candidate.status = "Completed"
            db.commit()
    
    return response