# avatar/projects-avatar-api/app/routes/candidateRoute.py
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Dict
from datetime import datetime
from app.models import Candidate, Batch, AuthUser
from app.schemas import CandidateResponse, CandidateCreate, CandidateUpdate 
from app.database.db import get_db
from app.middleware.admin_validation import admin_validation
from fastapi.responses import Response, JSONResponse
from fastapi import status

router = APIRouter()


# Constants for dropdown options
COURSE_OPTIONS = ["ML", "QA", "UI", ".NET"]
YES_NO_OPTIONS = ["Y", "N"]
WORK_STATUS_OPTIONS = [
    "None", "Citizen", "GC", "GC EAD", "OPT", "H1B", 
    "H4", "L1", "L2", "F1", "India", "Non-US"
]
SALARY_OPTIONS = [
    "None", "55k", "60k", "65k", "70k", 
    "60%", "65%", "70%", "75%", "80%", "90%"
]

@router.get("/dropdown-options")
def get_dropdown_options(db: Session = Depends(get_db)):
    """Get all dropdown options including dynamic ones from database"""
    
    # Get batch names from database
    batch_names = db.query(Batch.batchname).distinct().all()
    batch_names = [name[0] for name in batch_names]
    
    # Get portal IDs from authuser table
    portal_ids = db.query(
        AuthUser.id, 
        AuthUser.fullname, 
        AuthUser.uname
    ).all()
    portal_options = [
        {"id": user.id, "name": f"{user.fullname}-{user.uname}"} 
        for user in portal_ids
    ]
    
    # Get referral IDs from candidates
    referral_options = db.query(
        Candidate.candidateid, 
        Candidate.name
    ).distinct().all()
    referral_options = [
        {"id": ref.candidateid, "name": ref.name} 
        for ref in referral_options
    ]

    return {
        "courses": COURSE_OPTIONS,
        "processFlag": YES_NO_OPTIONS,
        "diceCandidate": YES_NO_OPTIONS,
        "workStatus": WORK_STATUS_OPTIONS,
        "ssnValid": YES_NO_OPTIONS,
        "bgvDone": YES_NO_OPTIONS,
        "salary": SALARY_OPTIONS,
        "batches": batch_names,
        "portalIds": portal_options,
        "referralIds": referral_options
    }

@router.get("/search", response_model=dict)
def get_candidates(
    page: int = Query(1, alias="page"),
    pageSize: int = Query(100, alias="pageSize"), 
    search: str = Query(None, alias="search"),
    db: Session = Depends(get_db),
):
    offset = (page - 1) * pageSize
    query = db.query(Candidate)
    
    if search:
        query = query.filter(Candidate.name.ilike(f"%{search}%"))

    totalRows = query.count()
    candidates = query.order_by(Candidate.candidateid.desc()).offset(offset).limit(pageSize).all()

    candidates_list = [
        {
            "candidateid": c.candidateid,
            "name": c.name,
            "email": c.email,
            "phone": c.phone,
            "course": c.course,
            "batchname": c.batchname,
            "enrolleddate": c.enrolleddate,
            "status": c.status,
            "statuschangedate": c.statuschangedate,
            "processflag": c.processflag,
            "diceflag": c.diceflag,
            "workstatus": c.workstatus,
            "education": c.education,
            "workexperience": c.workexperience,
            "ssn": c.ssn,
            "dob": c.dob,
            "portalid": c.portalid,
            "wpexpirationdate": c.wpexpirationdate,
            "ssnvalidated": c.ssnvalidated,
            "bgv": c.bgv,
            "secondaryemail": c.secondaryemail,
            "secondaryphone": c.secondaryphone,
            "address": c.address,
            "city": c.city,
            "state": c.state,
            "country": c.country,
            "zip": c.zip,
            "guarantorname": c.guarantorname,
            "guarantordesignation": c.guarantordesignation,
            "guarantorcompany": c.guarantorcompany,
            "emergcontactname": c.emergcontactname,
            "emergcontactemail": c.emergcontactemail,
            "emergcontactphone": c.emergcontactphone,
            "emergcontactaddrs": c.emergcontactaddrs,
            "term": c.term,
            "feepaid": c.feepaid,
            "feedue": c.feedue,
            "referralid": c.referralid,
            "salary0": c.salary0,
            "salary6": c.salary6,
            "salary12": c.salary12,
            "originalresume": c.originalresume,
            "contracturl": c.contracturl,
            "empagreementurl": c.empagreementurl,
            "offerletterurl": c.offerletterurl,
            "dlurl": c.dlurl,
            "workpermiturl": c.workpermiturl,
            "ssnurl": c.ssnurl,
            "notes": c.notes
        }
        for c in candidates
    ]

    return {"data": candidates_list, "totalRows": totalRows}

# @router.post("/candidates/insert", response_model=CandidateResponse)
# def insert_candidate(
#     candidate_create: CandidateCreate,
#     db: Session = Depends(get_db)
# ):
#     try:
#         # Convert Pydantic model to dict
#         candidate_data = candidate_create.dict()
        
#         # Create new candidate object
#         new_candidate = Candidate(**candidate_data)
        
#         # Add to database, commit and refresh
#         db.add(new_candidate)
#         db.commit()
#         db.refresh(new_candidate)
        
#         return new_candidate
#     except Exception as e:
#         db.rollback()
#         raise HTTPException(status_code=500, detail=f"Failed to insert candidate: {str(e)}")

@router.post("/candidates/insert", response_model=CandidateResponse)
def insert_candidate(
    candidate_create: CandidateCreate,
    db: Session = Depends(get_db),
    # _: bool = Depends(admin_validation)
):
    try:
        # Look up the batch ID for the provided batch name
        batch = db.query(Batch).filter(Batch.batchname == candidate_create.batchname).first()
        
        if not batch:
            raise HTTPException(
                status_code=404, 
                detail=f"Batch with name '{candidate_create.batchname}' not found. Please select a valid batch."
            )
        
        # Convert candidate_create to dict for manipulation
        candidate_dict = candidate_create.dict()
        
        # Add the batchid from the looked-up batch
        candidate_dict["batchid"] = batch.batchid  # Use the batch ID we found
        
        # Set lastmoddatetime here instead of trying to access it from candidate_create
        candidate_dict["lastmoddatetime"] = datetime.utcnow()
        
        # Create new candidate with all fields including batchid
        new_candidate = Candidate(**candidate_dict)
        db.add(new_candidate)
        db.commit()
        db.refresh(new_candidate)
        return new_candidate
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to insert candidate: {str(e)}")
    
@router.put("/candidates/update/{id}", response_model=CandidateResponse)
def update_candidate(
    id: int,
    candidate_update: CandidateUpdate,
    db: Session = Depends(get_db),
    # _: bool = Depends(admin_validation)
):
    candidate = db.query(Candidate).filter(Candidate.candidateid == id).first()
    
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    for key, value in candidate_update.dict(exclude_unset=True).items():
        setattr(candidate, key, value)
    
    db.commit()
    db.refresh(candidate)
    return candidate

@router.delete("/candidates/delete/{id}", response_model=CandidateResponse)
async def delete_candidate(
    id: str,
    db: Session = Depends(get_db),
    # _: bool = Depends(admin_validation)
):
    candidate = db.query(Candidate).filter(Candidate.candidateid == id).first()
    
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    db.delete(candidate)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)