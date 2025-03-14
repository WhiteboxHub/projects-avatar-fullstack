from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.controllers.clientSearch_controller import search_clients_by_companyname
from app.schemas import ClientSearchBase
from app.database.db import get_db

router = APIRouter()

@router.get("/api/admin/clientSearch")
def search_clients(companyname: str = Query(..., description="The company name to search for"), db: Session = Depends(get_db)):
    """
    Endpoint to search clients by company name.
    """
    search_params = ClientSearchBase(companyname=companyname)
    return search_clients_by_companyname(db, search_params)