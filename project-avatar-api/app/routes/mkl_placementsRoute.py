from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.database.db import get_db
from app.schemas import GridResponse, MktSubmissionWithCandidateResponse
from app.controllers.placementController import get_submission_details, add_placement
from app.models import Candidate, Employee, MktSubmission
from sqlalchemy import desc, asc, or_, and_

router = APIRouter()

@router.get("/mkt-submissions", response_model=GridResponse)
async def get_marketing_submissions(
    page: int = Query(1, description="Page number"),
    rows: int = Query(100, description="Rows per page"),
    sidx: Optional[str] = Query("submissiondate", description="Sort field"),
    sord: Optional[str] = Query("desc", description="Sort order"),
    name: Optional[str] = Query(None, description="Filter by client name"),
    email: Optional[str] = Query(None, description="Filter by vendor email"),
    location: Optional[str] = Query(None, description="Filter by location"),
    submissiondate: Optional[str] = Query(None, description="Filter by submission date"),
    candidateid: Optional[int] = Query(None, description="Filter by candidate ID"),
    employeeid: Optional[int] = Query(None, description="Filter by employee ID"),
    course: Optional[str] = Query(None, description="Filter by course/skill"),
    phone: Optional[str] = Query(None, description="Filter by vendor phone"),
    feedback: Optional[str] = Query(None, description="Filter by feedback"),
    url: Optional[str] = Query(None, description="Filter by implementation partner URL"),
    notes: Optional[str] = Query(None, description="Filter by rate/notes"),
    submitter: Optional[str] = Query(None, description="Filter by submitter"),
    _search: Optional[bool] = Query(False, description="Search flag"),
    filters: Optional[str] = Query(None, description="Complex filters in JSON format"),
    db: Session = Depends(get_db)
):
    """
    Get marketing submissions with grid functionality similar to PHP jqGrid implementation
    
    Parameters:
    - page: Page number for pagination
    - rows: Number of rows per page
    - sidx: Field to sort by (e.g., "submissiondate", "name", "email")
    - sord: Sort order ("asc" or "desc")
    - name: Filter by client name
    - email: Filter by vendor email
    - location: Filter by location
    - submissiondate: Filter by submission date (format: YYYY-MM-DD)
    - candidateid: Filter by candidate ID
    - employeeid: Filter by employee ID
    - course: Filter by course/skill
    - phone: Filter by vendor phone
    - feedback: Filter by feedback status
    - url: Filter by implementation partner URL
    - notes: Filter by rate/notes
    - submitter: Filter by submitter
    - _search: Search flag
    - filters: Complex filters in JSON format
    
    Returns:
    - GridResponse containing:
        - page: Current page number
        - total: Total number of pages
        - records: List of submission records
        - total_records: Total number of records
    """
    try:
        # Build filters dictionary from query parameters
        filter_params: Dict[str, Any] = {}
        
        # Handle individual field filters
        if name:
            filter_params['name'] = name
        if email:
            filter_params['email'] = email
        if location:
            filter_params['location'] = location
        if submissiondate:
            try:
                # Validate date format
                datetime.strptime(submissiondate, '%Y-%m-%d')
                filter_params['submissiondate'] = submissiondate
            except ValueError:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid date format. Use YYYY-MM-DD"
                )
        if candidateid:
            filter_params['candidateid'] = candidateid
        if employeeid:
            filter_params['employeeid'] = employeeid
        if course:
            filter_params['course'] = course
        if phone:
            filter_params['phone'] = phone
        if feedback:
            filter_params['feedback'] = feedback
        if url:
            filter_params['url'] = url
        if notes:
            filter_params['notes'] = notes
        if submitter:
            filter_params['submitter'] = submitter

        # Validate sort field
        allowed_sort_fields = [
            "id", "submissiondate", "name", "email", "location", 
            "candidateid", "employeeid", "course", "phone", "feedback",
            "url", "notes", "submitter"
        ]
        
        if sidx not in allowed_sort_fields:
            sidx = "submissiondate"  # Default sort field
        
        # Validate sort order
        if sord not in ["asc", "desc"]:
            sord = "desc"  # Default sort order

        # Get the results using the controller function
        result = get_submission_details(
            db=db,
            page=page,
            rows=rows,
            sidx=sidx,
            sord=sord,
            filters=filter_params
        )
        
        return GridResponse(
            page=result["page"],
            total=result["total"],
            records=result["records"],
            total_records=result["total_records"]
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve marketing submissions: {str(e)}"
        )

# Endpoints for dropdown data
@router.get("/mkt-submissions/candidates", response_model=List[dict])
async def get_candidate_options(db: Session = Depends(get_db)):
    """Get candidate options for dropdown"""
    try:
        candidates = db.query(
            Candidate.candidateid,
            Candidate.name,
            Candidate.course
        ).filter(
            Candidate.status.in_(["Marketing", "Placed", "OnProject-Mkt"])
        ).order_by(
            Candidate.name
        ).all()
        
        return [
            {
                "id": c.candidateid,
                "name": c.name,
                "skill": c.course
            } for c in candidates
        ]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve candidate options: {str(e)}"
        )

@router.get("/mkt-submissions/employees", response_model=List[dict])
async def get_employee_options(db: Session = Depends(get_db)):
    """Get employee options for dropdown"""
    try:
        employees = db.query(
            Employee.id,
            Employee.name
        ).filter(
            Employee.status.in_(['0Active', '2Discontinued', '3Break'])
        ).order_by(
            Employee.name
        ).all()
        
        return [
            {
                "id": e.id,
                "name": e.name
            } for e in employees
        ]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve employee options: {str(e)}"
        )

@router.post("/mkt-submissions/placement/add", response_model=dict)
async def add_placement_route(
    placement: dict,
    db: Session = Depends(get_db)
):
    """Add a new marketing submission placement"""
    try:
        result = await add_placement(db, placement)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to add placement: {str(e)}"
        )

@router.put("/mkt-submissions/placement/edit/{id}", response_model=dict)
async def update_placement_route(
    id: int,
    placement: dict,
    db: Session = Depends(get_db)
):
    """Update an existing marketing submission placement"""
    try:
        # Check if placement exists
        existing_placement = db.query(MktSubmission).filter(MktSubmission.id == id).first()
        if not existing_placement:
            raise HTTPException(
                status_code=404,
                detail=f"Placement with ID {id} not found"
            )
            
        # Update placement fields
        for key, value in placement.items():
            if hasattr(existing_placement, key):
                setattr(existing_placement, key, value)
                
        db.commit()
        db.refresh(existing_placement)
        
        return {"success": True, "message": "Placement updated successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update placement: {str(e)}"
        )

@router.get("/mkt-submissions/placement/{id}", response_model=dict)
async def get_placement_by_id(
    id: int,
    db: Session = Depends(get_db)
):
    """Get a specific marketing submission placement by ID"""
    try:
        placement = db.query(
            MktSubmission,
            Candidate.course,
            Candidate.name.label('candidate_name'),
            Employee.name.label('employee_name')
        ).select_from(MktSubmission).outerjoin(
            Candidate,
            MktSubmission.candidateid == Candidate.candidateid
        ).outerjoin(
            Employee,
            MktSubmission.employeeid == Employee.id
        ).filter(
            MktSubmission.id == id
        ).first()
        
        if not placement:
            raise HTTPException(
                status_code=404,
                detail=f"Placement with ID {id} not found"
            )
            
        # Convert to dict for response
        placement_dict = {
            "id": placement.MktSubmission.id,
            "submissiondate": placement.MktSubmission.submissiondate,
            "candidateid": placement.MktSubmission.candidateid,
            "candidate_name": placement.candidate_name,
            "employeeid": placement.MktSubmission.employeeid,
            "employee_name": placement.employee_name,
            "submitter": placement.MktSubmission.submitter,
            "course": placement.course,
            "email": placement.MktSubmission.email,
            "phone": placement.MktSubmission.phone,
            "url": placement.MktSubmission.url,
            "name": placement.MktSubmission.name,
            "location": placement.MktSubmission.location,
            "notes": placement.MktSubmission.notes,
            "feedback": placement.MktSubmission.feedback
        }
        
        return placement_dict
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve placement: {str(e)}"
        )
