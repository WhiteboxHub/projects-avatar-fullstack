# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
# from sqlalchemy import func
# from app.database import get_db
# from app.models import Submission, Candidate
# from app.schemas import Mkt_SubmissionResponse

# router = APIRouter()

# def get_submission_details(db: Session = Depends(get_db)):
#     query = db.query(
#         Submission.id,
#         Submission.submissiondate,
#         Submission.candidateid,
#         Submission.employeeid,
#         Submission.submitter,
#         Candidate.course,
#         Submission.email,
#         Submission.phone,
#         Submission.url,
#         Submission.name,
#         Submission.location,
#         Submission.notes,
#         Submission.feedback
#     ).outerjoin(Candidate, Submission.candidateid == Candidate.candidateid) \
#      .filter(Candidate.status.in_(["Marketing", "Placed", "OnProject-Mkt"]))

#     return query.all()