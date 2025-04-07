from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime
from app.database.db import get_db
from app.schemas import GridResponse, MktSubmissionWithCandidateResponse
from app.controllers.placementController import get_submission_details, add_placement
from app.models import Candidate, Employee

router = APIRouter()

@router.get("/mkt-submissions", response_model=GridResponse)
async def get_marketing_submissions(
    page: int = Query(1, description="Page number"),
    rows: int = Query(100, description="Rows per page"),
    sidx: Optional[str] = Query("submissiondate", description="Sort field"),
    sord: Optional[str] = Query("desc", description="Sort order"),
    name: Optional[str] = Query(None, description="Filter by name"),
    email: Optional[str] = Query(None, description="Filter by email"),
    location: Optional[str] = Query(None, description="Filter by location"),
    submissiondate: Optional[str] = Query(None, description="Filter by submission date"),
    candidateid: Optional[int] = Query(None, description="Filter by candidate ID"),
    employeeid: Optional[int] = Query(None, description="Filter by employee ID"),
    course: Optional[str] = Query(None, description="Filter by course"),
    phone: Optional[str] = Query(None, description="Filter by phone"),
    feedback: Optional[str] = Query(None, description="Filter by feedback"),
    db: Session = Depends(get_db)
):
    """
    Get marketing submissions with grid functionality
    
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
    
    Returns:
    - GridResponse containing:
        - page: Current page number
        - total: Total number of pages
        - records: List of submission records
        - total_records: Total number of records
    """
    try:
        # Build filters dictionary from query parameters
        filters = {}
        if name:
            filters['name'] = name
        if email:
            filters['email'] = email
        if location:
            filters['location'] = location
        if submissiondate:
            try:
                # Validate date format
                datetime.strptime(submissiondate, '%Y-%m-%d')
                filters['submissiondate'] = submissiondate
            except ValueError:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid date format. Use YYYY-MM-DD"
                )
        if candidateid:
            filters['candidateid'] = candidateid
        if employeeid:
            filters['employeeid'] = employeeid
        if course:
            filters['course'] = course
        if phone:
            filters['phone'] = phone
        if feedback:
            filters['feedback'] = feedback

        # Validate sort field
        allowed_sort_fields = [
            "submissiondate", "name", "email", "location", 
            "candidateid", "employeeid", "course", "phone", "feedback"
        ]
        if sidx not in allowed_sort_fields:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid sort field. Allowed fields: {', '.join(allowed_sort_fields)}"
            )

        # Validate sort order
        if sord not in ["asc", "desc"]:
            raise HTTPException(
                status_code=400,
                detail="Sort order must be 'asc' or 'desc'"
            )

        result = get_mkt_submission_details(
            db=db,
            page=page,
            rows=rows,
            sidx=sidx,
            sord=sord,
            filters=filters
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

# Optional: Add endpoints for dropdown data
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
        result = await placementController.add_placement(db, placement)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to add placement: {str(e)}"
        )
