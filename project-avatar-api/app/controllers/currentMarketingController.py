# # app/controllers/currentMarketingController.py

# from sqlalchemy.orm import Session
# from sqlalchemy import text
# from app.models import CandidateMarketing, Candidate
# from app.schemas import CurrentMarketingUpdateSchema

# def get_current_marketing_list(db: Session, skip: int, limit: int):
#     """
#     Retrieve a paginated list of current marketing records with custom SQL query.
#     """
#     query = text("""
#         SELECT
#             cm.id,
#             cm.startdate,
#             c.candidateid,
#             c.name,
#             c.email,
#             c.phone,
#             cm.mmid,
#             cm.instructorid,
#             cm.submitterid,
#             c.secondaryemail,
#             c.secondaryphone,
#             c.workstatus,
#             cm.status,
#             cm.priority,
#             cm.yearsofexperience,
#             cm.technology,
#             cm.resumeid,
#             cm.minrate,
#             cm.ipemailid,
#             cm.currentlocation,
#             cm.locationpreference,
#             cm.relocation,
#             cm.skypeid,
#             (SELECT link FROM resume WHERE id = cm.resumeid) AS resumelink,
#             (SELECT phone FROM ipemail WHERE id = cm.ipemailid) AS ipphone,
#             cm.closedate,
#             cm.suspensionreason,
#             cm.intro,
#             cm.notes
#         FROM
#             candidatemarketing cm,
#             candidate c
#         WHERE
#             cm.candidateid = c.candidateid
#             AND c.status IN ('Marketing', 'Placed', 'OnProject-Mkt')
#             AND cm.status NOT IN ('6-Suspended', '5-Closed')
#         ORDER BY cm.id DESC
#         LIMIT :limit OFFSET :skip
#     """)

#     result = db.execute(query, {"skip": skip, "limit": limit})
#     rows = result.fetchall()

#     columns = result.keys()
#     return [dict(zip(columns, row)) for row in rows]

# def get_current_marketing_by_candidate_name(db: Session, name: str):
#     """
#     Retrieve a single current marketing record by candidate name with custom SQL query.
#     """
#     query = text("""
#         SELECT
#             cm.id,
#             c.candidateid,
#             cm.startdate,
#             c.name,
#             c.email,
#             c.phone,
#             cm.mmid,
#             cm.instructorid,
#             cm.submitterid,
#             c.secondaryemail,
#             c.secondaryphone,
#             c.workstatus,
#             cm.status,
#             cm.priority,
#             cm.yearsofexperience,
#             cm.technology,
#             cm.resumeid,
#             cm.minrate,
#             cm.ipemailid,
#             cm.currentlocation,
#             cm.locationpreference,
#             cm.relocation,
#             cm.skypeid,
#             (SELECT link FROM resume WHERE id = cm.resumeid) AS resumelink,
#             (SELECT phone FROM ipemail WHERE id = cm.ipemailid) AS ipphone,
#             cm.closedate,
#             cm.suspensionreason,
#             cm.intro,
#             cm.notes
#         FROM
#             candidatemarketing cm
#         JOIN
#             candidate c ON cm.candidateid = c.candidateid
#         WHERE
#             c.name LIKE :name
#             AND c.status IN ('Marketing', 'Placed', 'OnProject-Mkt')
#             AND cm.status NOT IN ('6-Suspended', '5-Closed')
#     """)
#     result = db.execute(query, {"name": f"%{name}%"})
#     row = result.fetchone()

    

#     if row:
#         columns = result.keys()
#         return dict(zip(columns, row))
#     return None

# # def update_current_marketing(db: Session, current_marketing_id: int, current_marketing_data: CurrentMarketingUpdateSchema):
# #     """
# #     Update an existing current marketing record.
# #     """
  
# #     existing_current_marketing = db.query(CandidateMarketing).filter(CandidateMarketing.id == current_marketing_id).first()
# #     if not existing_current_marketing:
 
# #         return {"message": "Candidate marketing data updated successfully"}

# #     update_data = current_marketing_data.model_dump(exclude_unset=True)


# #     for key, value in update_data.items():
# #         if key == 'relocation' and value is not None:
# #             value = value[:200]  
# #         if key == 'yearsofexperience' and value is not None:
# #             value = value[:3]  
# #         setattr(existing_current_marketing, key, value)

# #     db.commit()
# #     db.refresh(existing_current_marketing)
# #     return {"message": "Current Marketing updated successfully", "current_marketing": existing_current_marketing}


# def update_current_marketing(db: Session, current_marketing_id: int, current_marketing_data: CurrentMarketingUpdateSchema):
#     # Validate the length of relocation field
#     if current_marketing_data.relocation not in ["Yes", "No"]:
#         raise HTTPException(status_code=400, detail="Relocation field must be 'Yes' or 'No'")

#     # Check if candidateid exists in the candidate table
#     candidate = db.query(Candidate).filter(Candidate.candidateid == current_marketing_data.candidateid).first()
#     if not candidate:
#         raise HTTPException(status_code=400, detail="Invalid candidateid")

#     # Update the candidatemarketing record
#     existing_current_marketing = db.query(CandidateMarketing).filter(CandidateMarketing.id == current_marketing_id).first()
#     if not existing_current_marketing:
#         raise HTTPException(status_code=404, detail="Candidate marketing data not found")

#     update_data = current_marketing_data.model_dump(exclude_unset=True)
#     for key, value in update_data.items():
#         setattr(existing_current_marketing, key, value)

#     db.commit()
#     db.refresh(existing_current_marketing)
#     return {"message": "Current Marketing updated successfully", "current_marketing": existing_current_marketing}


from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models import CandidateMarketing, Candidate
from app.schemas import CurrentMarketingUpdateSchema
from fastapi import HTTPException  # Import HTTPException

def get_current_marketing_list(db: Session, skip: int, limit: int):
    """
    Retrieve a paginated list of current marketing records with custom SQL query.
    """
    query = text("""
        SELECT 
            cm.id,
            c.name AS candidate_name,
            cm.startdate,
            c.email,
            c.phone,
            mm.name AS manager,
            ins.name AS instructor,
            sub.name AS submitter,
            c.secondaryemail,
            c.secondaryphone,
            c.workstatus,
            cm.status,
            cm.locationpreference,
            cm.priority,
            cm.technology,
            cm.resumeid,
            cm.minrate,
            ip.email AS ipemail,          -- Displaying the email instead of ipemailid
            cm.currentlocation,
            cm.relocation,
            cm.skypeid,
            (SELECT link FROM resume WHERE id = cm.resumeid) AS resumelink,
            ip.phone AS ipphone,
            cm.closedate,
            cm.suspensionreason,
            cm.intro,
            cm.notes
        FROM candidatemarketing cm
        JOIN candidate c ON cm.candidateid = c.candidateid  -- Fixed duplicated 'candidate' table reference
        LEFT JOIN employee mm ON cm.mmid = mm.id AND mm.status = '0Active'
        LEFT JOIN employee ins ON cm.instructorid = ins.id AND ins.status = '0Active'
        LEFT JOIN employee sub ON cm.submitterid = sub.id AND sub.status = '0Active'
        LEFT JOIN ipemail ip ON cm.ipemailid = ip.id         -- Join with ipemail to show the email
        WHERE 
            c.status IN ('Marketing', 'Placed', 'OnProject-Mkt')  -- Filter by candidate status
            AND cm.status NOT IN ('6-Suspended', '5-Closed')       -- Exclude suspended/closed candidates
        ORDER BY cm.id DESC
        LIMIT :limit OFFSET :skip;
    """)

    result = db.execute(query, {"skip": skip, "limit": limit})
    rows = result.fetchall()
    columns = result.keys()
    return [dict(zip(columns, row)) for row in rows]

def get_current_marketing_by_candidate_name(db: Session, name: str):
    """
    Retrieve a single current marketing record by candidate name with custom SQL query.
    """
    query = text("""
        SELECT 
            cm.id,
            c.candidateid,
            cm.startdate,
            c.name AS candidate_name,
            c.email,
            c.phone,
            mm.name AS manager,                   -- Manager name
            ins.name AS instructor,               -- Instructor name
            sub.name AS submitter,                -- Submitter name
            c.secondaryemail,
            c.secondaryphone,
            c.workstatus,
            cm.status,
            cm.priority,
            cm.yearsofexperience,
            cm.technology,
            cm.resumeid,
            cm.minrate,
            ip.email AS ipemail,                  -- Displaying the email instead of ipemailid
            cm.currentlocation,
            cm.locationpreference,
            cm.relocation,
            cm.skypeid,
            (SELECT link FROM resume WHERE id = cm.resumeid) AS resumelink,   -- Resume link
            ip.phone AS ipphone,                  -- IP email phone
            cm.closedate,
            cm.suspensionreason,
            cm.intro,
            cm.notes
        FROM candidatemarketing cm
        JOIN candidate c ON cm.candidateid = c.candidateid
        LEFT JOIN employee mm ON cm.mmid = mm.id AND mm.status = '0Active'
        LEFT JOIN employee ins ON cm.instructorid = ins.id AND ins.status = '0Active'
        LEFT JOIN employee sub ON cm.submitterid = sub.id AND sub.status = '0Active'
        LEFT JOIN ipemail ip ON cm.ipemailid = ip.id
        WHERE 
            c.name LIKE :name
            AND c.status IN ('Marketing', 'Placed', 'OnProject-Mkt')   -- Filter by candidate status
            AND cm.status NOT IN ('6-Suspended', '5-Closed')
        ORDER BY cm.id DESC;
    """)
    result = db.execute(query, {"name": f"%{name}%"})
    row = result.fetchone()

    if row:
        columns = result.keys()
        return dict(zip(columns, row))
    return None

def update_current_marketing(db: Session, current_marketing_id: int, current_marketing_data: CurrentMarketingUpdateSchema):
    """
    Update an existing current marketing record.
    """
    # Validate the length of relocation field
    if current_marketing_data.relocation not in ["Yes", "No"]:
        raise HTTPException(status_code=400, detail="Relocation field must be 'Yes' or 'No'")

    # Check if candidateid exists in the candidate table
    candidate = db.query(Candidate).filter(Candidate.candidateid == current_marketing_data.candidateid).first()
    if not candidate:
        raise HTTPException(status_code=400, detail="Invalid candidateid")

    # Check if the record exists
    existing_current_marketing = db.query(CandidateMarketing).filter(CandidateMarketing.id == current_marketing_id).first()
    if not existing_current_marketing:
        raise HTTPException(status_code=404, detail="Candidate marketing data not found")

    # Update the candidatemarketing record
    update_data = current_marketing_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(existing_current_marketing, key, value)

    db.commit()
    db.refresh(existing_current_marketing)
    return {"message": "Current Marketing updated successfully", "current_marketing": existing_current_marketing}
