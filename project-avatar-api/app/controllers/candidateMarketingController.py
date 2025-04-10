# # avatar/projects-avatar-api/app/controllers/candidateMarketingController.py

from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models import Candidate, CandidateMarketing ,Employee
from app.schemas import CandidateMarketingUpdateSchema

def get_candidate_marketing_list(db: Session, skip: int, limit: int):
    """
    Retrieve a paginated list of candidate marketing records using a raw SQL query.
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
        JOIN candidate c ON cm.candidateid = c.candidateid
        LEFT JOIN employee mm ON cm.mmid = mm.id AND mm.status = '0Active'
        LEFT JOIN employee ins ON cm.instructorid = ins.id AND ins.status = '0Active'
        LEFT JOIN employee sub ON cm.submitterid = sub.id AND sub.status = '0Active'
        LEFT JOIN ipemail ip ON cm.ipemailid = ip.id -- Join with ipemail to show the email
        ORDER BY cm.startdate DESC, cm.status ASC, cm.priority ASC, cm.candidateid
        LIMIT :limit OFFSET :skip
    """)

    result = db.execute(query, {"skip": skip, "limit": limit})
    return result.fetchall()

def get_candidate_marketing_by_name(db: Session, candidate_name: str):
    """
    Retrieve candidate marketing records by candidate name using a raw SQL query.
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
        WHERE c.name LIKE :candidate_name
    """)

    result = db.execute(query, {"candidate_name": f"%{candidate_name}%"})
    return result.fetchall()




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

# featch's the employes/managers/Instructors details
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


    if update_data.ipemail is not None:
        if update_data.ipemail == "":  
            candidate_marketing.ipemailid = 0
        else:

            ipemail = db.execute(
                text("SELECT id FROM ipemail WHERE email = :email"),
                {"email": update_data.ipemail}
            ).fetchone()
            
            if ipemail:
                candidate_marketing.ipemailid = ipemail[0]
            else:
                return {"error": f"IP email {update_data.ipemail} not found"}

    # Update other fields
    update_fields = {
        'status': update_data.status,
        'locationpreference': update_data.locationpreference,
        'priority': update_data.priority,
        'technology': update_data.technology,
        'resumeid': update_data.resumeid,
        'minrate': update_data.minrate,
        'currentlocation': update_data.currentlocation,
        'relocation': update_data.relocation,
        'closedate': update_data.closedate,
        'suspensionreason': update_data.suspensionreason,
        'intro': update_data.intro,
        'notes': update_data.notes,
        'skypeid': update_data.skypeid if hasattr(update_data, 'skypeid') else None
    }

    for field, value in update_fields.items():
        if value is not None:
            setattr(candidate_marketing, field, value)

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


def get_ipemails_dropdown(db: Session):
    """
    Retrieve IP emails for dropdown selection (email only)
    """
    query = text("""
        SELECT '' AS email 
        FROM dual 
        UNION 
        SELECT email 
        FROM ipemail 
        WHERE email IS NOT NULL 
        ORDER BY email
    """)
    result = db.execute(query)
  
    return [{"email": str(row[0])} for row in result]