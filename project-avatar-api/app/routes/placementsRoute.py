from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.models import MktSubmission, Candidate
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