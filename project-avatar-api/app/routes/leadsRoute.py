
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session
from typing import List
from app.controllers.leads_controller import get_leads, insert_lead, update_lead, delete_lead
from app.models import Lead  
from app.schemas import LeadCreate, LeadInDB, LeadUpdate  
from app.database.db import get_db

router = APIRouter()


@router.get("/search")
async def get_leads(
    page: int = Query(1, description="Page number"),
    page_size: int = Query(200, description="Number of leads per page"),
    search: str = Query(None, description="Search term"), 
    db: Session = Depends(get_db),
):
    """
    Retrieve leads with pagination. If search is provided, filter by name.
    If search is empty, return all leads with pagination.
    """
    offset = (page - 1) * page_size
    query = db.query(Lead)

    if len(search)>2:
        query = query.filter(Lead.name.ilike(f"%{search}%"))

    total_rows = query.count()  
    leads = query.offset(offset).limit(page_size).all()

    return {"data": leads, "totalRows": total_rows}
    

@router.post("/leads/insert", response_model=LeadCreate)
async def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):
   
    db_lead = Lead(**lead.dict())
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead

@router.put("/leads/update/{id}", response_model=LeadUpdate)
async def update_lead(id: int, lead: LeadUpdate, db: Session = Depends(get_db)):
    
    db_lead = db.query(Lead).filter(Lead.leadid  == id).first()
    if not db_lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    for key, value in lead.dict().items():
        setattr(db_lead, key, value)
    db.commit()
    db.refresh(db_lead) 
    return db_lead

@router.delete("/leads/delete/{id}", response_model=LeadInDB)
async def delete_lead(id: int, db: Session = Depends(get_db)):
   
    db_lead = db.query(Lead).filter(Lead.leadid == id).first()
    if not db_lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    db.delete(db_lead)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT) 



   