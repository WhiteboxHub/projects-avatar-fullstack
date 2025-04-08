from fastapi import APIRouter, Depends, HTTPException,  Query
from sqlalchemy.orm import Session
from app.controllers.byClientController import (
    get_recruiters_by_client,
    create_recruiter,
    update_recruiter,
    delete_recruiter,
    get_clients
)
from typing import Any
from app.models import Recruiter, Client
from app.database.db import get_db
from app.schemas import RecruiterCreate, RecruiterUpdate, Recruiter, RecruiterResponse, ClientResponse, ClientResponseFetch, ClientInDB

router = APIRouter()


@router.get("/recruiters/by-client", response_model=dict)
def read_recruiters_by_client(
    page: int = Query(1, alias="page"),
    page_size: int = Query(100, alias="pageSize"),
    db: Session = Depends(get_db)
):
    return get_recruiters_by_client(db, page, page_size)


@router.get("/recruiters/{recruiter_id}", response_model=RecruiterResponse)
def get_recruiter(recruiter_id: int, db: Session = Depends(get_db)):
    recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    
    return RecruiterSchema.model_validate(recruiter)


@router.post("/recruiters/byClient/add", response_model=RecruiterResponse)
def add_recruiter(recruiter: RecruiterCreate, db: Session = Depends(get_db)):
    return create_recruiter(db, recruiter)

@router.put("/recruiters/byClient/update/{recruiter_id}", response_model=RecruiterResponse)
def edit_recruiter(recruiter_id: int, recruiter: RecruiterUpdate, db: Session = Depends(get_db)):
    return update_recruiter(db, recruiter_id, recruiter)

@router.delete("/recruiters/byClient/remove/{recruiter_id}")
def remove_recruiter(recruiter_id: int, db: Session = Depends(get_db)):
    delete_recruiter(db, recruiter_id)
    return {"message": "Recruiter deleted successfully"}

@router.get("/recruiters/byClient/clients", response_model=list[ClientResponseFetch])
def get_clients_for_dropdown(db: Session = Depends(get_db)):
    clients = db.query(Client).all()
    return [ClientResponseFetch(id=client.id, name=client.companyname) for client in clients]
