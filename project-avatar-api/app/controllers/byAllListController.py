from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import Recruiter, Client
from app.schemas import RecruiterCreate, RecruiterUpdate


def get_recruiters_with_clients(db: Session):
    return db.query(
        Recruiter.id,
        Recruiter.name,
        Recruiter.email,
        Recruiter.phone,
        Recruiter.designation,
        Recruiter.clientid,
        Client.companyname.label('comp'),
        Recruiter.status,
        Recruiter.dob,
        Recruiter.personalemail,
        Recruiter.skypeid,
        Recruiter.linkedin,
        Recruiter.twitter,
        Recruiter.facebook,
        Recruiter.review,
        Recruiter.notes
    ).join(Client, Recruiter.clientid == Client.id).filter(
        Recruiter.vendorid == 0
    ).all()