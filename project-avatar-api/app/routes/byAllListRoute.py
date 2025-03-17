from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import Recruiter
from app.database.db import get_db
from app.schemas import RecruiterCreate, RecruiterUpdate, Recruiter
from app.controllers.byAllListController import get_recruiters_with_clients

router = APIRouter()

@router.get("/recruiters/byAllList", response_model=list[Recruiter])
def read_recruiters(db: Session = Depends(get_db)):
    return get_recruiters_with_clients(db)