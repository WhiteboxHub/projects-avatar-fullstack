# avatar/projects-avatar-api/app/routes/candidateRoute.py
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.models import Candidate
from app.schemas import CandidateResponse, CandidateCreate, CandidateUpdate 
from app.database.db import get_db
from app.middleware.admin_validation import admin_validation
from fastapi.responses import Response
from fastapi import status

router = APIRouter()

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

@router.post("/candidates/insert", response_model=CandidateResponse)
def insert_candidate(
    candidate_create: CandidateCreate,
    db: Session = Depends(get_db),
    _: bool = Depends(admin_validation)
):
    if len(candidate_create.lastmoddatetime) < 2:
        candidate_create.lastmoddatetime = str(datetime.utcnow())

    new_candidate = Candidate(**candidate_create.dict())
    db.add(new_candidate)
    db.commit()
    db.refresh(new_candidate)
    return new_candidate

@router.put("/candidates/update/{id}", response_model=CandidateResponse)
def update_candidate(
    id: int,
    candidate_update: CandidateUpdate,
    db: Session = Depends(get_db),
    _: bool = Depends(admin_validation)
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
    _: bool = Depends(admin_validation)
):
    candidate = db.query(Candidate).filter(Candidate.candidateid == id).first()
    
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    db.delete(candidate)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)