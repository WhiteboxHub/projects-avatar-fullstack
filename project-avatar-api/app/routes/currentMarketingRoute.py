# # # app/routes/currentMarketingRoute.py

# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from app.database.db import get_db
# from app.controllers.currentMarketingController import (
#     get_current_marketing_list, get_current_marketing_by_candidate_name, 
#     get_ipemails_dropdown, get_employees, get_resumes_dropdown, update_current_marketing
# )
# from app.schemas import CurrentMarketingSchema, CurrentMarketingCreateSchema, CurrentMarketingUpdateSchema
# from typing import List, Dict, Any

# router = APIRouter()

# @router.get("/api/admin/currentmarketing")
# def read_current_marketing(page: int = 1, page_size: int = 100, db: Session = Depends(get_db)):
#     skip = (page - 1) * page_size
#     return get_current_marketing_list(db, skip, page_size)

# @router.get("/api/admin/currentmarketing/search/name")
# def search_current_marketing_by_candidate_name(name: str, db: Session = Depends(get_db)):
#     current_marketing = get_current_marketing_by_candidate_name(db, name)
#     if not current_marketing:
#         raise HTTPException(status_code=404, detail="Current Marketing not found")
#     return current_marketing

# @router.get("/api/admin/currentmarketing/employees")
# def get_employees_list(db: Session = Depends(get_db)):
#     employees = get_employees(db)
#     return employees

# @router.get("/api/admin/currentmarketing/ipemails")
# def get_ip_emails_for_dropdown(db: Session = Depends(get_db)):
#     ipemails = get_ipemails_dropdown(db)
#     return ipemails

# @router.get("/api/admin/currentmarketing/resumes", response_model=List[Dict[str, Any]])
# def get_resumes_for_dropdown(db: Session = Depends(get_db)):
#     resumes = get_resumes_dropdown(db)
#     return resumes

# @router.put("/api/admin/currentMarketing/put/{current_marketing_id}")
# def update_current_marketing_entry(current_marketing_id: int, update_data: CurrentMarketingUpdateSchema, db: Session = Depends(get_db)):
#     # Handle empty callsmade field before passing to controller
#     if hasattr(update_data, 'callsmade') and (update_data.callsmade == '' or update_data.callsmade is None):
#         update_data.callsmade = 0
        
#     result =  update_current_marketing(db, current_marketing_id, update_data)
#     if isinstance(result, dict) and "error" in result:
#         raise HTTPException(status_code=400, detail=result["error"])
#     return result

# # @router.put("/api/admin/candidatemarketing/update/{candidate_marketing_id}")
# # def update_candidate_marketing_entry(candidate_marketing_id: int, update_data: CandidateMarketingUpdateSchema, db: Session = Depends(get_db)):
# #     result = update_candidate_marketing(db, candidate_marketing_id, update_data)
# #     if isinstance(result, dict) and "error" in result:
# #         raise HTTPException(status_code=400, detail=result["error"])
# #     return result
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.controllers.currentMarketingController import (
    get_current_marketing_list, get_current_marketing_by_candidate_name, 
    get_ipemails_dropdown, get_employees, get_resumes_dropdown, update_current_marketing
)
from app.schemas import CurrentMarketingSchema, CurrentMarketingCreateSchema, CurrentMarketingUpdateSchema
from typing import List, Dict, Any

router = APIRouter()

@router.get("/api/admin/currentmarketing")
def read_current_marketing(page: int = 1, page_size: int = 100, db: Session = Depends(get_db)):
    skip = (page - 1) * page_size
    return get_current_marketing_list(db, skip, page_size)

@router.get("/api/admin/currentmarketing/search/name")
def search_current_marketing_by_candidate_name(name: str, db: Session = Depends(get_db)):
    current_marketing = get_current_marketing_by_candidate_name(db, name)
    if not current_marketing:
        raise HTTPException(status_code=404, detail="Current Marketing not found")
    return current_marketing

@router.get("/api/admin/currentmarketing/employees")
def get_employees_list(db: Session = Depends(get_db)):
    employees = get_employees(db)
    return employees

@router.get("/api/admin/currentmarketing/ipemails")
def get_ip_emails_for_dropdown(db: Session = Depends(get_db)):
    ipemails = get_ipemails_dropdown(db)
    return ipemails

@router.get("/api/admin/currentmarketing/resumes", response_model=List[Dict[str, Any]])
def get_resumes_for_dropdown(db: Session = Depends(get_db)):
    resumes = get_resumes_dropdown(db)
    return resumes

@router.put("/api/admin/currentMarketing/put/{current_marketing_id}")
def update_current_marketing_entry(current_marketing_id: int, update_data: CurrentMarketingUpdateSchema, db: Session = Depends(get_db)):
    # Handle empty callsmade field before passing to controller
    if hasattr(update_data, 'callsmade') and (update_data.callsmade == '' or update_data.callsmade is None):
        update_data.callsmade = 0
        
    result =  update_current_marketing(db, current_marketing_id, update_data)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

# @router.put("/api/admin/candidatemarketing/update/{candidate_marketing_id}")
# def update_candidate_marketing_entry(candidate_marketing_id: int, update_data: CandidateMarketingUpdateSchema, db: Session = Depends(get_db)):
#     result = update_candidate_marketing(db, candidate_marketing_id, update_data)
#     if isinstance(result, dict) and "error" in result:
#         raise HTTPException(status_code=400, detail=result["error"])
#     return result
