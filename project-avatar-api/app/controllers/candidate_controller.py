from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Candidate, CandidateMarketing, Placement
from schemas import CandidateCreate, CandidateUpdate, CandidateResponse
from typing import List
from datetime import datetime

router = APIRouter()

@router.get("/candidates", response_model=List[CandidateResponse])
def get_candidates(db: Session = Depends(get_db)):
    candidates = db.query(Candidate).order_by(Candidate.candidateid.desc()).all()
    return candidates

@router.post("/candidates", response_model=CandidateResponse)
def insert_candidate(candidate: CandidateCreate, db: Session = Depends(get_db)):
    new_candidate = Candidate(**candidate.dict())
    db.add(new_candidate)
    db.commit()
    db.refresh(new_candidate)
    return new_candidate

@router.put("/candidates/{id}", response_model=CandidateResponse)
def update_candidate(id: int, candidate_data: CandidateUpdate, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.candidateid == id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    for key, value in candidate_data.dict(exclude_unset=True).items():
        setattr(candidate, key, value)
    
    db.commit()
    db.refresh(candidate)
    
    if candidate.status and candidate.status.lower() == "placed":
        placement = Placement(candidateid=id, placementDate=datetime.utcnow())
        db.add(placement)
        db.commit()
        db.refresh(placement)
    
    return candidate

@router.delete("/candidates/{id}")
def delete_candidate(id: int, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.candidateid == id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    db.query(CandidateMarketing).filter(CandidateMarketing.candidateid == id).delete()
    db.delete(candidate)
    db.commit()    
