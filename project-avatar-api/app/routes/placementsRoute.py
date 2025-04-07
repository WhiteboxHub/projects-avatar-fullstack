from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.models import Employee, MktSubmission, Candidate
from app.database.db import get_db
from app.schemas import Mkt_submissionBase, Mkt_SubmissionCreate, Mkt_SubmissionUpdate, Mkt_SubmissionResponse, MktSubmissionInDB
from app.controllers.placementController import get_submission_details
from typing import List

router = APIRouter()

@router.get("/placements", response_model=List[MktSubmissionInDB])
def get_all_placement_details(db: Session = Depends(get_db)):
    submissions = db.query(MktSubmission).join(Candidate).filter(
        Candidate.status.in_(["Marketing", "Placed", "OnProject-Mkt"])
    ).all()
    return submissions


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
         