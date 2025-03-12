# avatar/projects-avatar-api/app/controllers/search_controller.py

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db  # Importing the DB session dependency
from app.models import Candidate  # Importing the ORM model

app = FastAPI()

@app.get("/searchCandidatesByName")
def search_candidates_by_name(name: str, db: Session = Depends(get_db)):
    """
    Search for candidates by name using SQLAlchemy ORM.
    """
    try:
        candidates = db.query(Candidate).filter(Candidate.name.ilike(f"%{name}%")).all()
        return candidates
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")