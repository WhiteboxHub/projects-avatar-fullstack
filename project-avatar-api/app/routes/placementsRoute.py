from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime
from app.models import Employee, MktSubmission, Candidate
from app.database.db import get_db
from app.schemas import Mkt_submissionBase, Mkt_SubmissionCreate, Mkt_SubmissionUpdate, Mkt_SubmissionResponse, MktSubmissionInDB, GridResponse
from app.controllers.placementController import (
    get_submission_details, 
    add_placement, 
    update_placement, 
    delete_placement, 
    get_candidate_options, 
    get_employee_options
)

router = APIRouter()

@router.get("/mkt-submissions", response_model=GridResponse)
async def get_all_placement_details(
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
    """Get all placement details with filtering and pagination"""
    filters = {}
    if name:
        filters['name'] = name
    if email:
        filters['email'] = email
    if location:
        filters['location'] = location
    if submissiondate:
        filters['submissiondate'] = submissiondate
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
        
    return get_submission_details(db, page, rows, sidx, sord, filters)

@router.post("/mkt-submissions", response_model=MktSubmissionInDB)
async def create_placement(
    placement_data: Mkt_SubmissionCreate,
    db: Session = Depends(get_db)
):
    """Create a new placement submission"""
    try:
        return await add_placement(db, placement_data.dict())
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create placement: {str(e)}"
        )

@router.put("/mkt-submissions/{submission_id}", response_model=MktSubmissionInDB)
async def update_placement_submission(
    submission_id: int,
    placement_data: Mkt_SubmissionUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing placement submission"""
    try:
        updated_placement = await update_placement(db, submission_id, placement_data.dict(exclude_unset=True))
        if not updated_placement:
            raise HTTPException(status_code=404, detail="Placement not found")
        return updated_placement
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update placement: {str(e)}"
        )

@router.delete("/mkt-submissions/{submission_id}", response_model=dict)
async def delete_placement_submission(
    submission_id: int,
    db: Session = Depends(get_db)
):
    """Delete a placement submission"""
    try:
        success = await delete_placement(db, submission_id)
        if not success:
            raise HTTPException(status_code=404, detail="Placement not found")
        return {"message": "Placement deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete placement: {str(e)}"
        )

# # Endpoints for dropdown data
# @router.get("/mkt-submissions/candidates", response_model=List[dict])
# async def get_candidates_for_dropdown(db: Session = Depends(get_db)):
#     """Get candidate options for dropdown"""
#     try:
#         candidates = await get_candidate_options(db)
#         return candidates
#     except Exception as e:
#         raise HTTPException(
#             status_code=500,
#             detail=f"Failed to retrieve candidate options: {str(e)}"
#         )



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
        
        # Explicitly convert tuple results to dictionaries
        return [
            {
                "id": c[0],  # Access by index instead of attribute
                "name": c[1], 
                "skill": c[2]
            } for c in candidates
        ]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve candidate options: {str(e)}"
        )
    

# @router.get("/mkt-submissions/employees", response_model=List[dict])
# async def get_employees_for_dropdown(db: Session = Depends(get_db)):
#     """Get employee options for dropdown"""
#     try:
#         employees = await get_employee_options(db)
#         return employees
#     except Exception as e:
#         raise HTTPException(
#             status_code=500,
#             detail=f"Failed to retrieve employee options: {str(e)}"
#         )


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
        
        # Explicitly convert tuple results to dictionaries
        return [
            {
                "id": e[0],  # Access by index instead of attribute
                "name": e[1]
            } for e in employees
        ]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve employee options: {str(e)}"
        )