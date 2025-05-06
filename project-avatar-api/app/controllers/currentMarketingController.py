# # # app/controllers/currentMarketingController.py

from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models import CandidateMarketing, Candidate, Employee
from app.schemas import CurrentMarketingUpdateSchema, CandidateMarketingUpdateSchema
from fastapi import HTTPException

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
            COALESCE(cm.technology, c.course) AS technology,
            COALESCE(cm.yearsofexperience, c.workexperience) AS yearsofexperience,
            cm.resumeid,
            cm.minrate,
            ip.email AS ipemail,
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
        LEFT JOIN ipemail ip ON cm.ipemailid = ip.id
        WHERE
            c.status IN ('Marketing', 'Placed', 'OnProject-Mkt')
            AND cm.status NOT IN ('6-Suspended', '5-Closed')
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
            mm.name AS manager,
            ins.name AS instructor,
            sub.name AS submitter,
            c.secondaryemail,
            c.secondaryphone,
            c.workstatus,
            cm.status,
            cm.priority,
            COALESCE(cm.yearsofexperience, c.workexperience) AS yearsofexperience,
            COALESCE(cm.technology, c.course) AS technology,
            cm.resumeid,
            cm.minrate,
            ip.email AS ipemail,
            cm.currentlocation,
            cm.locationpreference,
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
        LEFT JOIN ipemail ip ON cm.ipemailid = ip.id
        WHERE
            c.name LIKE :name
            AND c.status IN ('Marketing', 'Placed', 'OnProject-Mkt')
            AND cm.status NOT IN ('6-Suspended', '5-Closed')
        ORDER BY cm.id DESC;
    """)
    result = db.execute(query, {"name": f"%{name}%"})
    row = result.fetchone()

    if row:
        columns = result.keys()
        return dict(zip(columns, row))
    return None

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

def get_employees(db: Session):
    """
    Retrieve a list of employees whose status is '0Active'.
    """
    query = text("""
        SELECT DISTINCT name
        FROM employee
        WHERE status = '0Active'
        ORDER BY name
    """)
    result = db.execute(query)
    # Convert Row objects to dictionaries
    return [{"name": row[0]} for row in result.fetchall()]

def get_resumes_dropdown(db: Session):
    """
    Retrieve resumes for dropdown selection
    """
    query = text("""
        SELECT '' AS id, '' AS name 
        FROM dual 
        UNION 
        SELECT DISTINCT cr.id, CONCAT(c.name, ' ', r.resumekey) AS name 
        FROM resume r, candidateresume cr, candidate c 
        WHERE r.id = cr.resumeid 
        AND c.candidateid = cr.candidateid 
        ORDER BY name
    """)
    result = db.execute(query)
    return [{"id": row[0], "name": row[1]} for row in result]

def update_candidate_marketing(db: Session, candidate_marketing_id: int, update_data: CandidateMarketingUpdateSchema):
    """
    Update a candidate marketing record by ID with the provided data.
    """
    candidate_marketing = db.query(CandidateMarketing).filter(CandidateMarketing.id == candidate_marketing_id).first()
    if not candidate_marketing:
        return {"error": "Candidate Marketing not found"}

    # Get the current status before updating
    previous_status = candidate_marketing.status
    
    # Handle employee assignments
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

    # Handle ip email
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

    # Map UI status to database status if needed
    # This conversion maps the frontend status values to database status values
    if update_data.status:
        status_mapping = {
            "To Do": "1-To Do",
            "Inprogress": "2-Inprogress",
            "Suspended": "6-Suspended",
            "Closed": "5-Closed"
        }
        
        # Use the mapping if it exists, otherwise use the original value
        update_data.status = status_mapping.get(update_data.status, update_data.status)
    
    # Validate data for suspended status
    if update_data.status == "6-Suspended" and not update_data.suspensionreason:
        return {"error": "Suspension reason is required when status is Suspended"}
        
    # Validate data for closed status
    if update_data.status == "5-Closed" and not update_data.closedate:
        return {"error": "Close date is required when status is Closed"}
    
    # Validate relocation field
    if update_data.relocation and update_data.relocation not in ["Yes", "No"]:
        return {"error": "Relocation field must be 'Yes' or 'No'"}

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

    # Update the candidate's record in the database
    db.commit()
    db.refresh(candidate_marketing)
    
    # Prepare response with status transition information
    response = {
        "data": candidate_marketing,
        "message": "Candidate marketing updated successfully"
    }
    
    # Add status transition information
    if previous_status != candidate_marketing.status:
        if candidate_marketing.status in ["1-To Do", "2-Inprogress"]:
            if previous_status in ["5-Closed", "6-Suspended"]:
                response["statusChange"] = "added_to_current"
                response["message"] = "Candidate has been moved to Current Marketing"
        elif candidate_marketing.status in ["5-Closed", "6-Suspended"]:
            if previous_status in ["1-To Do", "2-Inprogress"]:
                response["statusChange"] = "removed_from_current"
                response["message"] = "Candidate has been removed from Current Marketing"
    
    return response
