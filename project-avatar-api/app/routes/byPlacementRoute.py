from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import Recruiter
from app.database.db import get_db
from app.schemas import RecruiterCreate, RecruiterUpdate, Recruiter
from app.controllers.byPlacementController import  get_recruiters_by_placements

router = APIRouter()

@router.get("/recruiters/by-placement", response_model=list[Recruiter])
def read_recruiters_by_placement(db: Session = Depends(get_db)):
    return get_recruiters_by_placements(db)
