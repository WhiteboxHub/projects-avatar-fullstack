# avatar/projects-avatar-api/app/routes/candidate_searchRoute.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.schemas import CandidateSearchBase
from app.controllers.candidate_search_controller import search_candidates_by_name, get_login_history_by_portalid

router = APIRouter()

@router.post("/api/admin/search")
def search_candidates_route(search_params: CandidateSearchBase, db: Session = Depends(get_db)):
    results = search_candidates_by_name(db=db, search_params=search_params)
    return results

@router.get("/api/admin/loginhistory/{portalid}")
def login_history(portalid: str, db: Session = Depends(get_db)):
    return get_login_history_by_portalid(db, portalid)