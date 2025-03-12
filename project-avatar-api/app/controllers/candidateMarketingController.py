# avatar/projects-avatar-api/app/controllers/candidateMarketingController.py


from sqlalchemy.orm import Session
from app.models import Candidate, CandidateMarketing
from app.schemas import CandidateMarketingUpdateSchema

def get_candidate_marketing_list(db: Session, skip: int, limit: int):
    """
    Retrieve a paginated list of candidate marketing records.
    """
    return (
        db.query(CandidateMarketing)
        .order_by(CandidateMarketing.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

def get_candidate_marketing_by_id(db: Session, candidate_marketing_id: int):
    """
    Retrieve a single candidate marketing record by ID.
    """
    return db.query(CandidateMarketing).filter(CandidateMarketing.id == candidate_marketing_id).first()

def update_candidate_marketing(db: Session, candidate_marketing_id: int, candidate_marketing_data: CandidateMarketingUpdateSchema):
    """
    Update an existing candidate marketing record.
    """
    candidate_id = candidate_marketing_data.candidateid
    if candidate_id is not None:
        candidate_exists = db.query(Candidate).filter(Candidate.candidateid == candidate_id).first()
        if not candidate_exists:
            return {"error": f"Candidate with ID {candidate_id} does not exist."}

    existing_candidate_marketing = db.query(CandidateMarketing).filter(CandidateMarketing.id == candidate_marketing_id).first()
    if not existing_candidate_marketing:
        return {"error": "Candidate Marketing not found"}

    # Update only the provided fields
    update_data = candidate_marketing_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        if key == 'relocation' and value is not None:
            value = value[:200]  # Truncate if necessary
        if key == 'yearsofexperience' and value is not None:
            value = value[:3]  # Truncate if necessary
        setattr(existing_candidate_marketing, key, value)

    db.commit()
    db.refresh(existing_candidate_marketing)
    return {"message": "Candidate Marketing updated successfully", "candidate_marketing": existing_candidate_marketing}

def delete_candidate_marketing(db: Session, candidate_marketing_id: int):
    """
    Delete a candidate marketing record by ID.
    """
    candidate_marketing = db.query(CandidateMarketing).filter(CandidateMarketing.id == candidate_marketing_id).first()
    if not candidate_marketing:
        return {"error": "Candidate Marketing not found"}

    db.delete(candidate_marketing)
    db.commit()
    return {"message": "Candidate Marketing deleted successfully"}