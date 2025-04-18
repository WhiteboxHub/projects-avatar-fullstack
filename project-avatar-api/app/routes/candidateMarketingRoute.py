    # # avatar/projects-avatar-api/app/routes/candidateMarketingRoute.py

# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from app.database.db import get_db
# from app.controllers.candidateMarketingController import (
#     get_candidate_marketing_list, get_candidate_marketing_by_id, update_candidate_marketing, delete_candidate_marketing
# )
# from app.schemas import CandidateMarketingSchema, CandidateMarketingCreateSchema, CandidateMarketingUpdateSchema

# router = APIRouter()

# @router.get("/api/admin/candidatemarketing")
# def read_candidate_marketing(page: int = 1, page_size: int = 10, db: Session = Depends(get_db)):
#     skip = (page - 1) * page_size
#     return get_candidate_marketing_list(db, skip, page_size)

# @router.get("/api/admin/candidatemarketing/{candidate_marketing_id}")
# def read_candidate_marketing_by_id(candidate_marketing_id: int, db: Session = Depends(get_db)):
#     candidate_marketing = get_candidate_marketing_by_id(db, candidate_marketing_id)
#     if not candidate_marketing:
#         raise HTTPException(status_code=404, detail="Candidate Marketing not found")
#     return candidate_marketing

# @router.put("/api/admin/candidatemarketing/{candidate_marketing_id}")
# def update_candidate_marketing_entry(candidate_marketing_id: int, candidate_marketing_data: CandidateMarketingUpdateSchema, db: Session = Depends(get_db)):
#     return update_candidate_marketing(db, candidate_marketing_id, candidate_marketing_data)

# @router.delete("/api/admin/candidatemarketing/{candidate_marketing_id}")
# def delete_candidate_marketing_entry(candidate_marketing_id: int, db: Session = Depends(get_db)):
#     return delete_candidate_marketing(db, candidate_marketing_id)




# from fastapi import APIRouter, Depends, HTTPException
# from fastapi.responses import JSONResponse
# from sqlalchemy.orm import Session
# from app.database.db import get_db
# from app.controllers.candidateMarketingController import (
#     get_candidate_marketing_list, get_candidate_marketing_by_id, update_candidate_marketing, delete_candidate_marketing
# )
# from app.schemas import CandidateMarketingSchema, CandidateMarketingCreateSchema, CandidateMarketingUpdateSchema

# router = APIRouter()

# @router.get("/api/admin/candidatemarketing")
# def read_candidate_marketing(page: int = 1, page_size: int = 10, db: Session = Depends(get_db)):
#     skip = (page - 1) * page_size
#     candidate_marketing_list = get_candidate_marketing_list(db, skip, page_size)
#     # Convert the result to a list of dictionaries
#     result = [dict(row._mapping) for row in candidate_marketing_list]
#     return JSONResponse(content=result)

# @router.get("/api/admin/candidatemarketing/{candidate_marketing_id}")
# def read_candidate_marketing_by_id(candidate_marketing_id: int, db: Session = Depends(get_db)):
#     candidate_marketing = get_candidate_marketing_by_id(db, candidate_marketing_id)
#     if not candidate_marketing:
#         raise HTTPException(status_code=404, detail="Candidate Marketing not found")
#     # Convert the result to a dictionary
#     return JSONResponse(content=dict(candidate_marketing._mapping))

# @router.put("/api/admin/candidatemarketing/{candidate_marketing_id}")
# def update_candidate_marketing_entry(candidate_marketing_id: int, candidate_marketing_data: CandidateMarketingUpdateSchema, db: Session = Depends(get_db)):
#     return update_candidate_marketing(db, candidate_marketing_id, candidate_marketing_data)

# @router.delete("/api/admin/candidatemarketing/{candidate_marketing_id}")
# def delete_candidate_marketing_entry(candidate_marketing_id: int, db: Session = Depends(get_db)):
#     return delete_candidate_marketing(db, candidate_marketing_id)


from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.controllers.candidateMarketingController import (
    get_candidate_marketing_list, get_candidate_marketing_by_name, update_candidate_marketing, delete_candidate_marketing, get_employees ,get_ipemails_dropdown
)
from app.schemas import CandidateMarketingSchema, CandidateMarketingCreateSchema, CandidateMarketingUpdateSchema
from datetime import datetime, date

router = APIRouter()

def convert_to_dict(row):
    """
    Convert a SQLAlchemy row to a dictionary and handle datetime and date conversion.
    """
    result = dict(row._mapping)
    for key, value in result.items():
        if isinstance(value, (datetime, date)):
            result[key] = value.isoformat()  # Convert datetime and date to string
    return result

@router.get("/api/admin/candidatemarketing")
def read_candidate_marketing(page: int = 1, page_size: int = 10, db: Session = Depends(get_db)):
    skip = (page - 1) * page_size
    candidate_marketing_list = get_candidate_marketing_list(db, skip, page_size)
    # Convert the result to a list of dictionaries with datetime and date conversion
    result = [convert_to_dict(row) for row in candidate_marketing_list]
    return JSONResponse(content=result)

@router.get("/api/admin/candidatemarketing/by-name/{candidate_name}")
def read_candidate_marketing_by_name(candidate_name: str, db: Session = Depends(get_db)):
    candidate_marketing = get_candidate_marketing_by_name(db, candidate_name)
    if not candidate_marketing:
        raise HTTPException(status_code=404, detail="Candidate Marketing not found")
    return JSONResponse(content=[convert_to_dict(row) for row in candidate_marketing])

@router.put("/api/admin/candidatemarketing/update/{candidate_marketing_id}")
def update_candidate_marketing_entry(candidate_marketing_id: int, update_data: CandidateMarketingUpdateSchema, db: Session = Depends(get_db)):
    result = update_candidate_marketing(db, candidate_marketing_id, update_data)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

@router.delete("/api/admin/candidatemarketing/{candidate_marketing_id}")
def delete_candidate_marketing_entry(candidate_marketing_id: int, db: Session = Depends(get_db)):
    return delete_candidate_marketing(db, candidate_marketing_id)

@router.get("/api/admin/employees")
def get_employees_list(db: Session = Depends(get_db)):
    employees = get_employees(db)
    return JSONResponse(content=[convert_to_dict(row) for row in employees])


# @router.get("/api/admin/ipemails")
# def get_ipemails_dropdown(db: Session = Depends(get_db)):
#     ipemails = get_ipemails_dropdown(db)
#     return JSONResponse(content=[dict(row) for row in ipemails])

@router.get("/api/admin/ipemails")
def get_ip_emails_for_dropdown(db: Session = Depends(get_db)):
    ipemails = get_ipemails_dropdown(db)
    return JSONResponse(content=ipemails)