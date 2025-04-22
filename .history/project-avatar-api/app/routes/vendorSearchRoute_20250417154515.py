from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.controllers. import search_vendors_by_companyname
from app.schemas import VendorSearchBase
from app.database.db import get_db

router = APIRouter()

@router.get("/vendorSearch")
def search_vendors(companyname: str = Query(..., description="The company name to search for"), db: Session = Depends(get_db)):
    """
    Endpoint to search vendors by company name.
    """
    search_params = VendorSearchBase(companyname=companyname)
    return search_vendors_by_companyname(db, search_params)
