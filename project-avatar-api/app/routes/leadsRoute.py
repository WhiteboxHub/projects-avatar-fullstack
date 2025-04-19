# # # new-projects-avatar-fullstack/project-avatar-api/app/routes/leadsRoute.py

# from fastapi import APIRouter, Depends, HTTPException, status, Query
# from fastapi.responses import JSONResponse
# from sqlalchemy.orm import Session
# from typing import List, Optional
# from datetime import datetime
# from app.controllers.leads_controller import (
#     get_leads, 
#     get_lead_by_id,
#     insert_lead, 
#     update_lead, 
#     delete_lead
# )
# from app.schemas import (
#     LeadCreate, 
#     LeadResponse, 
#     LeadUpdate,
#     LeadSearchResponse
# )
# from app.database.db import get_db

# router = APIRouter()

# # @router.get("/", response_model=LeadSearchResponse)
# # async def get_leads_route(
# #     page: int = Query(1, ge=1, description="Page number"),
# #     page_size: int = Query(20, le=200, description="Number of leads per page"),
# #     search: str = Query(None, description="Search term"),
# #     db: Session = Depends(get_db),
# # ):
# #     offset = (page - 1) * page_size
# #     leads_data = get_leads(db, search=search, page_size=page_size, offset=offset)
# #     return leads_data

# @router.get("/api/admin/leads", response_model=LeadSearchResponse)
# async def get_leads_route(
#     page: int = Query(1, ge=1, description="Page number"),
#     page_size: int = Query(20, le=200, description="Number of leads per page"),
#     db: Session = Depends(get_db),
# ):
#     offset = (page - 1) * page_size
#     leads_data = get_leads(db, page_size=page_size, offset=offset)
#     return leads_data

# @router.get("/api/admin/leads/search/{leadid}", response_model=LeadResponse)
# async def get_lead(leadid: int, db: Session = Depends(get_db)):
#     lead = get_lead_by_id(db, leadid=leadid)
#     if not lead:
#         raise HTTPException(status_code=404, detail="Lead not found")
#     return lead

# # @router.post("/api/admin/leads/insert", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
# # async def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):
# #     try:
# #         return insert_lead(db, new_lead=lead)
# #     except Exception as e:
# #         raise HTTPException(
# #             status_code=status.HTTP_400_BAD_REQUEST,
# #             detail=str(e)
# #         )

# @router.post("/api/admin/insert", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
# async def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):
#     try:
#         return insert_lead(db, new_lead=lead)
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail=str(e)
#         )


# @router.put("/api/admin/leads/update/{leadid}", response_model=LeadResponse)
# async def update_lead_route(leadid: int, lead: LeadUpdate, db: Session = Depends(get_db)):
#     db_lead = get_lead_by_id(db, leadid=leadid)
#     if not db_lead:
#         raise HTTPException(status_code=404, detail="Lead not found")
#     return update_lead(db, leadid=leadid, updated_lead=lead)

# @router.delete("/api/admin/leads/delete/{leadid}", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_lead_route(leadid: int, db: Session = Depends(get_db)):
#     lead = get_lead_by_id(db, leadid=leadid)
#     if not lead:
#         raise HTTPException(status_code=404, detail="Lead not found")
#     delete_lead(db, leadid=leadid)
#     return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)






from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.controllers.leads_controller import (
    get_leads, 
    get_lead_by_id,
    insert_lead, 
    update_lead, 
    delete_lead,
    search_leads_by_name
)
from app.schemas import (
    LeadCreate, 
    LeadResponse, 
    LeadUpdate,
    LeadSearchResponse
)
from app.database.db import get_db

router = APIRouter()

@router.get("/api/admin/leads", response_model=LeadSearchResponse)
async def get_leads_route(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, le=200, description="Number of leads per page"),
    db: Session = Depends(get_db),
):
    offset = (page - 1) * page_size
    leads_data = get_leads(db, page_size=page_size, offset=offset)
    return leads_data

@router.get("/api/admin/leads/{leadid}", response_model=LeadResponse)
async def get_lead_by_id_route(leadid: int, db: Session = Depends(get_db)):
    lead = get_lead_by_id(db, leadid=leadid)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead

@router.get("/api/admin/leads/search/", response_model=List[LeadResponse])
async def search_leads_by_name_route(
    name: str = Query(..., description="Name to search for"),
    db: Session = Depends(get_db)
):
    leads = search_leads_by_name(db, name=name)
    if not leads:
        raise HTTPException(
            status_code=404,
            detail=f"No leads found matching name: {name}"
        )
    return leads

@router.post("/api/admin/insert", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
async def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):
    try:
        return insert_lead(db, new_lead=lead)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.put("/api/admin/leads/update/{leadid}", response_model=LeadResponse)
async def update_lead_route(leadid: int, lead: LeadUpdate, db: Session = Depends(get_db)):
    db_lead = get_lead_by_id(db, leadid=leadid)
    if not db_lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return update_lead(db, leadid=leadid, updated_lead=lead)

@router.delete("/api/admin/leads/delete/{leadid}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_lead_route(leadid: int, db: Session = Depends(get_db)):
    lead = get_lead_by_id(db, leadid=leadid)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    delete_lead(db, leadid=leadid)
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)