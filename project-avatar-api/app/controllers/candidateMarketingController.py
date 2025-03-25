# # avatar/projects-avatar-api/app/controllers/candidateMarketingController.py


# from sqlalchemy.orm import Session
# from app.models import Candidate, CandidateMarketing
# from app.schemas import CandidateMarketingUpdateSchema

# def get_candidate_marketing_list(db: Session, skip: int, limit: int):
#     """
#     Retrieve a paginated list of candidate marketing records.
#     """
#     return (
#         db.query(CandidateMarketing)
#         .order_by(CandidateMarketing.id.desc())
#         .offset(skip)
#         .limit(limit)
#         .all()
#     )

# def get_candidate_marketing_by_id(db: Session, candidate_marketing_id: int):
#     """
#     Retrieve a single candidate marketing record by ID.
#     """
#     return db.query(CandidateMarketing).filter(CandidateMarketing.id == candidate_marketing_id).first()

# def update_candidate_marketing(db: Session, candidate_marketing_id: int, candidate_marketing_data: CandidateMarketingUpdateSchema):
#     """
#     Update an existing candidate marketing record.
#     """
#     candidate_id = candidate_marketing_data.candidateid
#     if candidate_id is not None:
#         candidate_exists = db.query(Candidate).filter(Candidate.candidateid == candidate_id).first()
#         if not candidate_exists:
#             return {"error": f"Candidate with ID {candidate_id} does not exist."}

#     existing_candidate_marketing = db.query(CandidateMarketing).filter(CandidateMarketing.id == candidate_marketing_id).first()
#     if not existing_candidate_marketing:
#         return {"error": "Candidate Marketing not found"}

#     # Update only the provided fields
#     update_data = candidate_marketing_data.model_dump(exclude_unset=True)

#     for key, value in update_data.items():
#         if key == 'relocation' and value is not None:
#             value = value[:200]  # Truncate if necessary
#         if key == 'yearsofexperience' and value is not None:
#             value = value[:3]  # Truncate if necessary
#         setattr(existing_candidate_marketing, key, value)

#     db.commit()
#     db.refresh(existing_candidate_marketing)
#     return {"message": "Candidate Marketing updated successfully", "candidate_marketing": existing_candidate_marketing}

# def delete_candidate_marketing(db: Session, candidate_marketing_id: int):
#     """
#     Delete a candidate marketing record by ID.
#     """
#     candidate_marketing = db.query(CandidateMarketing).filter(CandidateMarketing.id == candidate_marketing_id).first()
#     if not candidate_marketing:
#         return {"error": "Candidate Marketing not found"}

#     db.delete(candidate_marketing)
#     db.commit()
#     return {"message": "Candidate Marketing deleted successfully"}



from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models import Candidate, CandidateMarketing ,Employee
from app.schemas import CandidateMarketingUpdateSchema

def get_candidate_marketing_list(db: Session, skip: int, limit: int):
    """
    Retrieve a paginated list of candidate marketing records using a raw SQL query.
    """
    query = text("""
        SELECT cm.id,
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
               cm.ipemailid,
               cm.currentlocation,
               cm.relocation,
               cm.skypeid,
               (SELECT link FROM resume WHERE id = cm.resumeid) AS resumelink,
               (SELECT phone FROM ipemail WHERE id = cm.ipemailid) AS ipphone,
               cm.closedate,
               cm.suspensionreason,
               cm.intro,
               cm.notes
        FROM candidatemarketing cm
        JOIN candidate c ON cm.candidateid = c.candidateid
        LEFT JOIN employee mm ON cm.mmid = mm.id AND mm.status = '0Active'
        LEFT JOIN employee ins ON cm.instructorid = ins.id AND ins.status = '0Active'
        LEFT JOIN employee sub ON cm.submitterid = sub.id AND sub.status = '0Active'
        ORDER BY cm.startdate DESC, cm.status ASC, cm.priority ASC, cm.candidateid
        LIMIT :limit OFFSET :skip
    """)

    result = db.execute(query, {"skip": skip, "limit": limit})
    return result.fetchall()

def get_candidate_marketing_by_id(db: Session, candidate_marketing_id: int):
    """
    Retrieve a single candidate marketing record by ID using a raw SQL query.
    """
    query = text("""
        SELECT cm.id,
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
               cm.ipemailid,
               cm.currentlocation,
               cm.relocation,
               cm.skypeid,
               (SELECT link FROM resume WHERE id = cm.resumeid) AS resumelink,
               (SELECT phone FROM ipemail WHERE id = cm.ipemailid) AS ipphone,
               cm.closedate,
               cm.suspensionreason,
               cm.intro,
               cm.notes
        FROM candidatemarketing cm
        JOIN candidate c ON cm.candidateid = c.candidateid
        LEFT JOIN employee mm ON cm.mmid = mm.id AND mm.status = '0Active'
        LEFT JOIN employee ins ON cm.instructorid = ins.id AND ins.status = '0Active'
        LEFT JOIN employee sub ON cm.submitterid = sub.id AND sub.status = '0Active'
        WHERE cm.id = :candidate_marketing_id
    """)

    result = db.execute(query, {"candidate_marketing_id": candidate_marketing_id})
    return result.fetchone()




def get_employees(db: Session):
    """
    Retrieve a list of employees whose status is '0Active'.
    """
    query = text("""
        SELECT DISTINCT id, name
        FROM employee
        WHERE status = '0Active'
        ORDER BY name
    """)
    result = db.execute(query)
    return result.fetchall()


def update_candidate_marketing(db: Session, candidate_marketing_id: int, update_data: CandidateMarketingUpdateSchema):
    """
    Update a candidate marketing record by ID with the provided data.
    """
    candidate_marketing = db.query(CandidateMarketing).filter(CandidateMarketing.id == candidate_marketing_id).first()
    if not candidate_marketing:
        return {"error": "Candidate Marketing not found"}

    # Fetch employee IDs based on names
    if update_data.manager_name:
        manager = db.query(Employee).filter(Employee.name == update_data.manager_name, Employee.status == '0Active').first()
        if manager:
            candidate_marketing.mmid = manager.id
        else:
            return {"error": f"Manager with name {update_data.manager_name} not found"}

    if update_data.instructor_name:
        instructor = db.query(Employee).filter(Employee.name == update_data.instructor_name, Employee.status == '0Active').first()
        if instructor:
            candidate_marketing.instructorid = instructor.id
        else:
            return {"error": f"Instructor with name {update_data.instructor_name} not found"}

    if update_data.submitter_name:
        submitter = db.query(Employee).filter(Employee.name == update_data.submitter_name, Employee.status == '0Active').first()
        if submitter:
            candidate_marketing.submitterid = submitter.id
        else:
            return {"error": f"Submitter with name {update_data.submitter_name} not found"}

    # Update other fields
    for key, value in update_data.dict(exclude_unset=True).items():
        if key not in ["manager_name", "instructor_name", "submitter_name"]:
            setattr(candidate_marketing, key, value)

    db.commit()
    db.refresh(candidate_marketing)
    return candidate_marketing

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
