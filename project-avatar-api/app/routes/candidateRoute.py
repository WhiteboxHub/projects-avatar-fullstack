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
from sqlalchemy.sql import text

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
CANDIDATE_STATUS_OPTIONS = [
    "Active",
    "Discontinued",
    "Break",
    "Marketing",
    "Placed",
    "OnProject-Mkt",
    "Completed",
    "Defaulted"
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
        "referralIds": referral_options,
        "candidateStatus": CANDIDATE_STATUS_OPTIONS
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

    # Handle search for multiple fields
    if search:
        query = query.filter(
            Candidate.name.ilike(f"%{search}%") |
            Candidate.email.ilike(f"%{search}%") |
            Candidate.phone.ilike(f"%{search}%") |
            Candidate.city.ilike(f"%{search}%") |
            Candidate.state.ilike(f"%{search}%") |
            Candidate.country.ilike(f"%{search}%")
        )

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

        # Handle empty string values for integer fields
        integer_fields = ['portalid', 'referralid', 'feepaid', 'feedue']
        for field in integer_fields:
            if field in candidate_dict and candidate_dict[field] == '':
                candidate_dict[field] = None

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

@router.put("/candidates/update/{id}")
def update_candidate(
    id: int,
    candidate_update: CandidateUpdate,
    db: Session = Depends(get_db),
):
    candidate = db.query(Candidate).filter(Candidate.candidateid == id).first()

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    update_data = candidate_update.dict(exclude_unset=True)

    # Handle special cases for date fields
    for date_field in ['enrolleddate', 'statuschangedate', 'wpexpirationdate', 'dob']:
        if date_field in update_data:
            if update_data[date_field] == "0000-00-00 00:00:00" or update_data[date_field] == "0000-00-00":
                update_data[date_field] = None
            elif isinstance(update_data[date_field], str) and update_data[date_field].strip():
                try:
                    update_data[date_field] = datetime.strptime(update_data[date_field], "%Y-%m-%d")
                except ValueError:
                    try:
                        update_data[date_field] = datetime.strptime(update_data[date_field], "%Y-%m-%d %H:%M:%S")
                    except ValueError:
                        pass

    # Update lastmoddatetime
    update_data["lastmoddatetime"] = datetime.utcnow()

    # Update the candidate directly
    for key, value in update_data.items():
        setattr(candidate, key, value)
    
    db.commit()
    db.refresh(candidate)

    # Return the updated candidate as a dictionary
    return {
        "candidateid": candidate.candidateid,
        "name": candidate.name,
        "email": candidate.email,
        "phone": candidate.phone,
        "course": candidate.course,
        "batchname": candidate.batchname,
        "enrolleddate": candidate.enrolleddate,
        "status": candidate.status,
        "statuschangedate": candidate.statuschangedate,
        "processflag": candidate.processflag,
        "diceflag": candidate.diceflag,
        "workstatus": candidate.workstatus,
        "education": candidate.education,
        "workexperience": candidate.workexperience,
        "ssn": candidate.ssn,
        "dob": candidate.dob,
        "portalid": candidate.portalid,
        "wpexpirationdate": candidate.wpexpirationdate,
        "ssnvalidated": candidate.ssnvalidated,
        "bgv": candidate.bgv,
        "secondaryemail": candidate.secondaryemail,
        "secondaryphone": candidate.secondaryphone,
        "address": candidate.address,
        "city": candidate.city,
        "state": candidate.state,
        "country": candidate.country,
        "zip": candidate.zip,
        "guarantorname": candidate.guarantorname,
        "guarantordesignation": candidate.guarantordesignation,
        "guarantorcompany": candidate.guarantorcompany,
        "emergcontactname": candidate.emergcontactname,
        "emergcontactemail": candidate.emergcontactemail,
        "emergcontactphone": candidate.emergcontactphone,
        "emergcontactaddrs": candidate.emergcontactaddrs,
        "term": candidate.term,
        "feepaid": candidate.feepaid,
        "feedue": candidate.feedue,
        "referralid": candidate.referralid,
        "salary0": candidate.salary0,
        "salary6": candidate.salary6,
        "salary12": candidate.salary12,
        "originalresume": candidate.originalresume,
        "contracturl": candidate.contracturl,
        "empagreementurl": candidate.empagreementurl,
        "offerletterurl": candidate.offerletterurl,
        "dlurl": candidate.dlurl,
        "workpermiturl": candidate.workpermiturl,
        "ssnurl": candidate.ssnurl,
        "notes": candidate.notes
    }

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
