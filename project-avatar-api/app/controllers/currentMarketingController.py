# app/controllers/currentMarketingController.py

from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models import CandidateMarketing, Candidate
from app.schemas import CurrentMarketingUpdateSchema

def get_current_marketing_list(db: Session, skip: int, limit: int):
    """
    Retrieve a paginated list of current marketing records with custom SQL query.
    """
    query = text("""
        SELECT
            cm.id,
            cm.startdate,
            c.candidateid,
            c.name,
            c.email,
            c.phone,
            cm.mmid,
            cm.instructorid,
            cm.submitterid,
            c.secondaryemail,
            c.secondaryphone,
            c.workstatus,
            cm.status,
            cm.priority,
            cm.yearsofexperience,
            cm.technology,
            cm.resumeid,
            cm.minrate,
            cm.ipemailid,
            cm.currentlocation,
            cm.locationpreference,
            cm.relocation,
            cm.skypeid,
            (SELECT link FROM resume WHERE id = cm.resumeid) AS resumelink,
            (SELECT phone FROM ipemail WHERE id = cm.ipemailid) AS ipphone,
            cm.closedate,
            cm.suspensionreason,
            cm.intro,
            cm.notes
        FROM
            candidatemarketing cm,
            candidate c
        WHERE
            cm.candidateid = c.candidateid
            AND c.status IN ('Marketing', 'Placed', 'OnProject-Mkt')
            AND cm.status NOT IN ('6-Suspended', '5-Closed')
        ORDER BY cm.id DESC
        LIMIT :limit OFFSET :skip
    """)

    result = db.execute(query, {"skip": skip, "limit": limit})
    rows = result.fetchall()

    # Convert the result to a list of dictionaries
    columns = result.keys()
    return [dict(zip(columns, row)) for row in rows]

def get_current_marketing_by_id(db: Session, current_marketing_id: int):
    """
    Retrieve a single current marketing record by ID with custom SQL query.
    """
    query = text("""
        SELECT
            cm.id,
            c.candidateid,
            cm.startdate,
            c.name,
            c.email,
            c.phone,
            cm.mmid,
            cm.instructorid,
            cm.submitterid,
            c.secondaryemail,
            c.secondaryphone,
            c.workstatus,
            cm.status,
            cm.priority,
            cm.yearsofexperience,
            cm.technology,
            cm.resumeid,
            cm.minrate,
            cm.ipemailid,
            cm.currentlocation,
            cm.locationpreference,
            cm.relocation,
            cm.skypeid,
            (SELECT link FROM resume WHERE id = cm.resumeid) AS resumelink,
            (SELECT phone FROM ipemail WHERE id = cm.ipemailid) AS ipphone,
            cm.closedate,
            cm.suspensionreason,
            cm.intro,
            cm.notes
        FROM
            candidatemarketing cm,
            candidate c
        WHERE
            cm.candidateid = c.candidateid
            AND cm.id = :current_marketing_id
            AND c.status IN ('Marketing', 'Placed', 'OnProject-Mkt')
            AND cm.status NOT IN ('6-Suspended', '5-Closed')
    """)

    result = db.execute(query, {"current_marketing_id": current_marketing_id})
    row = result.fetchone()

    # Convert the result to a dictionary
    if row:
        columns = result.keys()
        return dict(zip(columns, row))
    return None

def update_current_marketing(db: Session, current_marketing_id: int, current_marketing_data: CurrentMarketingUpdateSchema):
    """
    Update an existing current marketing record.
    """
    # Retrieve the existing current marketing record
    existing_current_marketing = db.query(CandidateMarketing).filter(CandidateMarketing.id == current_marketing_id).first()
    if not existing_current_marketing:
        return {"error": "Current Marketing not found"}

    # Get the update data, excluding unset fields
    update_data = current_marketing_data.model_dump(exclude_unset=True)

    # Update only the provided fields
    for key, value in update_data.items():
        if key == 'relocation' and value is not None:
            value = value[:200]  # Truncate if necessary
        if key == 'yearsofexperience' and value is not None:
            value = value[:3]  # Truncate if necessary
        setattr(existing_current_marketing, key, value)

    # Commit the changes to the database
    db.commit()
    db.refresh(existing_current_marketing)
    return {"message": "Current Marketing updated successfully", "current_marketing": existing_current_marketing}


