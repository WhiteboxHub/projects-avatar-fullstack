# avatar/projects-avatar-api/app/controllers/candidate_search_controller.py

from sqlalchemy.orm import Session
from app.models import CandidateSearch
from app.schemas import CandidateSearchBase

def search_candidates_by_name(db: Session, search_params: CandidateSearchBase):
    if not search_params.name:
        return []
    
    candidates = db.query(CandidateSearch).filter(CandidateSearch.name.ilike(f"%{search_params.name}%")).all()
    
    return candidates