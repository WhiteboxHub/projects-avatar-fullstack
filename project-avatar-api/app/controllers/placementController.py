from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.db import get_db
from app.models import  Candidate, MktSubmission
from app.schemas import Mkt_SubmissionResponse

router = APIRouter()

def get_submission_details(db: Session = Depends(get_db)):
    query = db.query(
       MktSubmission.id,
        MktSubmission.submissiondate,
        MktSubmission.candidateid,
        MktSubmission.employeeid,
        MktSubmission.submitter,
        # MktSubmission.course,
        MktSubmission.email,
        MktSubmission.phone,
        MktSubmission.url,
        MktSubmission.name,
        MktSubmission.location,
        MktSubmission.notes,
        MktSubmission.feedback
    ).outerjoin(Candidate, MktSubmission.candidateid == Candidate.candidateid) \
     .filter(Candidate.status.in_(["Marketing", "Placed", "OnProject-Mkt"]))

    return query.all()