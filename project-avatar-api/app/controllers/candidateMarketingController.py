# from sqlalchemy.orm import Session
# from sqlalchemy import text
# from app.models import Candidate, CandidateMarketing, Employee
# from app.schemas import CandidateMarketingUpdateSchema
# from fastapi import HTTPException

# def get_candidate_marketing_list(db: Session, skip: int, limit: int):
#     """
#     Retrieve a paginated list of candidate marketing records using a raw SQL query.
#     Default pagination is set to 100 records per page.
#     """
#     query = text("""
#         SELECT 
#             cm.id,
#             c.candidateid,
#             cm.startdate,
#             c.name AS candidate_name,
#             c.email,
#             c.phone,
#             mm.name AS manager,
#             ins.name AS instructor,
#             sub.name AS submitter,
#             c.secondaryemail,
#             c.secondaryphone,
#             c.workstatus,
#             cm.status,
#             cm.locationpreference,
#             cm.priority,
#             cm.technology,
#             cm.resumeid,
#             cm.minrate,
#             ip.email AS ipemail,          -- Displaying the email instead of ipemailid
#             cm.currentlocation,
#             cm.relocation,
#             cm.skypeid,
#             (SELECT link FROM resume WHERE id = cm.resumeid) AS resumelink,
#             ip.phone AS ipphone,
#             cm.closedate,
#             cm.suspensionreason,
#             cm.intro,
#             cm.notes,
#             cm.yearsofexperience,
#             cm.mmid,
#             cm.instructorid,
#             cm.submitterid,
#             cm.ipemailid
#         FROM candidatemarketing cm
#         JOIN candidate c ON cm.candidateid = c.candidateid
#         LEFT JOIN employee mm ON cm.mmid = mm.id AND mm.status = '0Active'
#         LEFT JOIN employee ins ON cm.instructorid = ins.id AND ins.status = '0Active'
#         LEFT JOIN employee sub ON cm.submitterid = sub.id AND sub.status = '0Active'
#         LEFT JOIN ipemail ip ON cm.ipemailid = ip.id -- Join with ipemail to show the email
#         ORDER BY cm.startdate DESC, cm.status ASC, cm.priority ASC, cm.candidateid
#         LIMIT :limit OFFSET :skip
#     """)

#     # Get total count for pagination
#     count_query = text("""
#         SELECT COUNT(*) as total
#         FROM candidatemarketing cm
#         JOIN candidate c ON cm.candidateid = c.candidateid
#     """)

#     try:
#         result = db.execute(query, {"skip": skip, "limit": limit})
#         rows = result.fetchall()
        
#         # Get column names
#         columns = result.keys()
        
#         # Convert to list of dictionaries
#         data = [dict(zip(columns, row)) for row in rows]
        
#         # Get total count
#         count_result = db.execute(count_query)
#         total_count = count_result.scalar()
        
#         return {
#             "data": data,
#             "total": total_count,
#             "page": skip // limit + 1,
#             "page_size": limit,
#             "total_pages": (total_count + limit - 1) // limit
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# def get_candidate_marketing_by_name(db: Session, candidate_name: str):
#     """
#     Retrieve candidate marketing records by candidate name using a raw SQL query.
#     """
#     query = text("""
#         SELECT 
#             cm.id,
#             c.candidateid,
#             cm.startdate,
#             c.name AS candidate_name,
#             c.email,
#             c.phone,
#             mm.name AS manager,
#             ins.name AS instructor,
#             sub.name AS submitter,
#             c.secondaryemail,
#             c.secondaryphone,
#             c.workstatus,
#             cm.status,
#             cm.locationpreference,
#             cm.priority,
#             cm.technology,
#             cm.resumeid,
#             cm.minrate,
#             ip.email AS ipemail,
#             cm.currentlocation,
#             cm.relocation,
#             cm.skypeid,
#             (SELECT link FROM resume WHERE id = cm.resumeid) AS resumelink,
#             ip.phone AS ipphone,
#             cm.closedate,
#             cm.suspensionreason,
#             cm.intro,
#             cm.notes,
#             cm.yearsofexperience,
#             cm.mmid,
#             cm.instructorid,
#             cm.submitterid,
#             cm.ipemailid
#         FROM candidatemarketing cm
#         JOIN candidate c ON cm.candidateid = c.candidateid
#         LEFT JOIN employee mm ON cm.mmid = mm.id AND mm.status = '0Active'
#         LEFT JOIN employee ins ON cm.instructorid = ins.id AND ins.status = '0Active'
#         LEFT JOIN employee sub ON cm.submitterid = sub.id AND sub.status = '0Active'
#         LEFT JOIN ipemail ip ON cm.ipemailid = ip.id
#         WHERE c.name LIKE :candidate_name
#     """)

#     try:
#         result = db.execute(query, {"candidate_name": f"%{candidate_name}%"})
#         rows = result.fetchall()
        
#         # Get column names
#         columns = result.keys()
        
#         # Convert to list of dictionaries
#         data = [dict(zip(columns, row)) for row in rows]
        
#         return data
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# def get_candidate_marketing_count(db: Session):
#     """
#     Get the total count of candidate marketing records for pagination.
#     """
#     query = text("""
#         SELECT COUNT(*) as total
#         FROM candidatemarketing cm
#         JOIN candidate c ON cm.candidateid = c.candidateid
#     """)
    
#     try:
#         result = db.execute(query)
#         return result.scalar()
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# def get_employees(db: Session):
#     """
#     Retrieve a list of employees whose status is '0Active'.
#     """
#     query = text("""
#         SELECT DISTINCT id, name
#         FROM employee
#         WHERE status = '0Active'
#         ORDER BY name
#     """)
#     try:
#         result = db.execute(query)
#         rows = result.fetchall()
        
#         # Convert to list of dictionaries to make it JSON serializable
#         return [{"id": row[0], "name": row[1]} for row in rows]
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# # def update_candidate_marketing(db: Session, candidate_marketing_id: int, update_data: CandidateMarketingUpdateSchema):
# #     """
# #     Update a candidate marketing record by ID with the provided data.
# #     """
# #     candidate_marketing = db.query(CandidateMarketing).filter(CandidateMarketing.id == candidate_marketing_id).first()
# #     if not candidate_marketing:
# #         return {"error": "Candidate Marketing not found"}

# #     # Get candidate's course if technology is not provided
# #     candidate = db.query(Candidate).filter(Candidate.candidateid == candidate_marketing.candidateid).first()
# #     if candidate:
# #         # Always sync technology with course if not explicitly provided
# #         update_data.technology = update_data.technology or candidate.course

# #     # Status mapping
# #     status_mapping = {
# #         "To Do": "1-To Do",
# #         "Inprogress": "2-Inprogress", 
# #         "Suspended": "6-Suspended",
# #         "Closed": "5-Closed"
# #     }
    
# #     if update_data.status:
# #         update_data.status = status_mapping.get(update_data.status, update_data.status)

# #     # featch's the employes/managers/Instructors details
# #     if update_data.manager_name:
# #         manager = db.query(Employee).filter(Employee.name == update_data.manager_name, Employee.status == '0Active').first()
# #         if manager:
# #             candidate_marketing.mmid = manager.id
# #         else:
# #             return {"error": f"Manager with name {update_data.manager_name} not found"}

# #     if update_data.instructor_name:
# #         instructor = db.query(Employee).filter(Employee.name == update_data.instructor_name, Employee.status == '0Active').first()
# #         if instructor:
# #             candidate_marketing.instructorid = instructor.id
# #         else:
# #             return {"error": f"Instructor with name {update_data.instructor_name} not found"}

# #     if update_data.submitter_name:
# #         submitter = db.query(Employee).filter(Employee.name == update_data.submitter_name, Employee.status == '0Active').first()
# #         if submitter:
# #             candidate_marketing.submitterid = submitter.id
# #         else:
# #             return {"error": f"Submitter with name {update_data.submitter_name} not found"}


# #     if update_data.ipemail is not None:
# #         if update_data.ipemail == "":  
# #             candidate_marketing.ipemailid = 0
# #         else:

# #             ipemail = db.execute(
# #                 text("SELECT id FROM ipemail WHERE email = :email"),
# #                 {"email": update_data.ipemail}
# #             ).fetchone()
            
# #             if ipemail:
# #                 candidate_marketing.ipemailid = ipemail[0]
# #             else:
# #                 return {"error": f"IP email {update_data.ipemail} not found"}

# #     # Update other fields
# #     update_fields = {
# #         'status': update_data.status,
# #         'locationpreference': update_data.locationpreference,
# #         'priority': update_data.priority,
# #         'technology': update_data.technology,
# #         'resumeid': update_data.resumeid,
# #         'minrate': update_data.minrate,
# #         'currentlocation': update_data.currentlocation,
# #         'relocation': update_data.relocation,
# #         'closedate': update_data.closedate,
# #         'suspensionreason': update_data.suspensionreason,
# #         'intro': update_data.intro,
# #         'notes': update_data.notes,
# #         'skypeid': update_data.skypeid if hasattr(update_data, 'skypeid') else None
# #     }

# #     for field, value in update_fields.items():
# #         if value is not None:
# #             setattr(candidate_marketing, field, value)

# #     db.commit()
# #     db.refresh(candidate_marketing)
# #     return candidate_marketing

# # def update_candidate_marketing(db: Session, candidate_marketing_id: int, update_data: CandidateMarketingUpdateSchema):
# #     """
# #     Update a candidate marketing record by ID with the provided data.
# #     """
# #     candidate_marketing = db.query(CandidateMarketing).filter(CandidateMarketing.id == candidate_marketing_id).first()
# #     if not candidate_marketing:
# #         return {"error": "Candidate Marketing not found"}

# #     # Store old status for comparison
# #     old_status = candidate_marketing.status
    
# #     # Get candidate's course if technology is not provided
# #     candidate = db.query(Candidate).filter(Candidate.candidateid == candidate_marketing.candidateid).first()
# #     if candidate:
# #         # Always sync technology with course if not explicitly provided
# #         update_data.technology = update_data.technology or candidate.course

# #     # Status mapping
# #     status_mapping = {
# #         "To Do": "1-To Do",
# #         "Inprogress": "2-Inprogress", 
# #         "Suspended": "6-Suspended",
# #         "Closed": "5-Closed"
# #     }
    
# #     if update_data.status:
# #         update_data.status = status_mapping.get(update_data.status, update_data.status)

# #     # featch's the employes/managers/Instructors details
# #     if update_data.manager_name:
# #         manager = db.query(Employee).filter(Employee.name == update_data.manager_name, Employee.status == '0Active').first()
# #         if manager:
# #             candidate_marketing.mmid = manager.id
# #         else:
# #             return {"error": f"Manager with name {update_data.manager_name} not found"}

# #     if update_data.instructor_name:
# #         instructor = db.query(Employee).filter(Employee.name == update_data.instructor_name, Employee.status == '0Active').first()
# #         if instructor:
# #             candidate_marketing.instructorid = instructor.id
# #         else:
# #             return {"error": f"Instructor with name {update_data.instructor_name} not found"}

# #     if update_data.submitter_name:
# #         submitter = db.query(Employee).filter(Employee.name == update_data.submitter_name, Employee.status == '0Active').first()
# #         if submitter:
# #             candidate_marketing.submitterid = submitter.id
# #         else:
# #             return {"error": f"Submitter with name {update_data.submitter_name} not found"}

# #     if update_data.ipemail is not None:
# #         if update_data.ipemail == "":  
# #             candidate_marketing.ipemailid = 0
# #         else:
# #             ipemail = db.execute(
# #                 text("SELECT id FROM ipemail WHERE email = :email"),
# #                 {"email": update_data.ipemail}
# #             ).fetchone()
            
# #             if ipemail:
# #                 candidate_marketing.ipemailid = ipemail[0]
# #             else:
# #                 return {"error": f"IP email {update_data.ipemail} not found"}

# #     # Update other fields
# #     update_fields = {
# #         'status': update_data.status,
# #         'locationpreference': update_data.locationpreference,
# #         'priority': update_data.priority,
# #         'technology': update_data.technology,
# #         'resumeid': update_data.resumeid,
# #         'minrate': update_data.minrate,
# #         'currentlocation': update_data.currentlocation,
# #         'relocation': update_data.relocation,
# #         'closedate': update_data.closedate,
# #         'suspensionreason': update_data.suspensionreason,
# #         'intro': update_data.intro,
# #         'notes': update_data.notes,
# #         'skypeid': update_data.skypeid if hasattr(update_data, 'skypeid') else None
# #     }

# #     for field, value in update_fields.items():
# #         if value is not None:
# #             setattr(candidate_marketing, field, value)

# #     db.commit()
# #     db.refresh(candidate_marketing)
    
# #     return candidate_marketing

# # In candidateMarketingController.py
# # Update the update_candidate_marketing function:

# def update_candidate_marketing(db: Session, candidate_marketing_id: int, update_data: CandidateMarketingUpdateSchema):
#     """
#     Update a candidate marketing record by ID with the provided data.
#     """
#     candidate_marketing = db.query(CandidateMarketing).filter(CandidateMarketing.id == candidate_marketing_id).first()
#     if not candidate_marketing:
#         return {"error": "Candidate Marketing not found"}

#     # Store old status for comparison
#     old_status = candidate_marketing.status
    
#     # Get candidate's course if technology is not provided
#     candidate = db.query(Candidate).filter(Candidate.candidateid == candidate_marketing.candidateid).first()
#     if candidate:
#         # Always sync technology with course if not explicitly provided
#         update_data.technology = update_data.technology or candidate.course

#     # Status mapping
#     status_mapping = {
#         "To Do": "1-To Do",
#         "Inprogress": "2-Inprogress", 
#         "Suspended": "6-Suspended",
#         "Closed": "5-Closed"
#     }
    
#     if update_data.status:
#         update_data.status = status_mapping.get(update_data.status, update_data.status)

#     # Process employee relationships
#     if update_data.manager_name:
#         manager = db.query(Employee).filter(Employee.name == update_data.manager_name, Employee.status == '0Active').first()
#         if manager:
#             candidate_marketing.mmid = manager.id
#         else:
#             return {"error": f"Manager with name {update_data.manager_name} not found"}

#     if update_data.instructor_name:
#         instructor = db.query(Employee).filter(Employee.name == update_data.instructor_name, Employee.status == '0Active').first()
#         if instructor:
#             candidate_marketing.instructorid = instructor.id
#         else:
#             return {"error": f"Instructor with name {update_data.instructor_name} not found"}

#     if update_data.submitter_name:
#         submitter = db.query(Employee).filter(Employee.name == update_data.submitter_name, Employee.status == '0Active').first()
#         if submitter:
#             candidate_marketing.submitterid = submitter.id
#         else:
#             return {"error": f"Submitter with name {update_data.submitter_name} not found"}

#     # Handle IP Email
#     if update_data.ipemail is not None:
#         if update_data.ipemail == "":  
#             candidate_marketing.ipemailid = 0
#         else:
#             ipemail = db.execute(
#                 text("SELECT id FROM ipemail WHERE email = :email"),
#                 {"email": update_data.ipemail}
#             ).fetchone()
            
#             if ipemail:
#                 candidate_marketing.ipemailid = ipemail[0]
#             else:
#                 return {"error": f"IP email {update_data.ipemail} not found"}

#     # Update other fields
#     update_fields = {
#         'status': update_data.status,
#         'locationpreference': update_data.locationpreference,
#         'priority': update_data.priority,
#         'technology': update_data.technology,
#         'resumeid': update_data.resumeid,
#         'minrate': update_data.minrate,
#         'currentlocation': update_data.currentlocation,
#         'relocation': update_data.relocation,
#         'closedate': update_data.closedate,
#         'suspensionreason': update_data.suspensionreason,
#         'intro': update_data.intro,
#         'notes': update_data.notes,
#         'skypeid': update_data.skypeid if hasattr(update_data, 'skypeid') else None
#     }

#     for field, value in update_fields.items():
#         if value is not None:
#             setattr(candidate_marketing, field, value)

#     db.commit()
#     db.refresh(candidate_marketing)
    
#     # Prepare the response with additional status change information 
#     response = {
#         "data": candidate_marketing,
#         "message": "Candidate marketing updated successfully"
#     }
    
#     # Add status transition information for frontend use
#     if old_status != candidate_marketing.status:
#         if candidate_marketing.status in ["6-Suspended", "5-Closed"]:
#             response["statusChange"] = "removed_from_current"
#             response["message"] = "Candidate has been removed from Current Marketing"
#         elif candidate_marketing.status in ["1-To Do", "2-Inprogress"]:
#             if old_status in ["6-Suspended", "5-Closed"]:
#                 response["statusChange"] = "added_to_current"
#                 response["message"] = "Candidate has been added to Current Marketing"
    
#     return response


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


# def get_ipemails_dropdown(db: Session):
#     """
#     Retrieve IP emails for dropdown selection (email only)
#     """
#     query = text("""
#         SELECT '' AS email 
#         FROM dual 
#         UNION 
#         SELECT email 
#         FROM ipemail 
#         WHERE email IS NOT NULL 
#         ORDER BY email
#     """)
#     result = db.execute(query)
  
#     return [{"email": str(row[0])} for row in result]

# def get_resumes_dropdown(db: Session):
#     """
#     Retrieve resumes for dropdown selection
#     """
#     query = text("""
#         SELECT '' AS id, '' AS name 
#         FROM dual 
#         UNION 
#         SELECT DISTINCT cr.id, CONCAT(c.name, ' ', r.resumekey) AS name 
#         FROM resume r, candidateresume cr, candidate c 
#         WHERE r.id = cr.resumeid 
#         AND c.candidateid = cr.candidateid 
#         ORDER BY name
#     """)
#     result = db.execute(query)
    
#     return [{"id": row[0], "name": row[1]} for row in result]


# def create_candidate_marketing(db: Session, candidate_id: int):
#     """
#     Create a new candidate marketing entry when a candidate's status is changed to "Marketing".
    
#     Args:
#         db: Database session
#         candidate_id: The ID of the candidate to create a marketing entry for
        
#     Returns:
#         The newly created CandidateMarketing object
#     """
#     # Check if candidate exists
#     candidate = db.query(Candidate).filter(Candidate.candidateid == candidate_id).first()
#     if not candidate:
#         raise HTTPException(status_code=404, detail=f"Candidate with ID {candidate_id} not found")
    
#     # Check if an entry already exists
#     existing_entry = db.query(CandidateMarketing).filter(CandidateMarketing.candidateid == candidate_id).first()
#     if existing_entry:
#         return existing_entry
    
#     # Create new marketing entry with default values
#     from datetime import datetime
    
#     new_entry = CandidateMarketing(
#         candidateid=candidate_id,
#         startdate=datetime.now(),
#         status="1-To Do",  # Default status
#         technology=candidate.course,  # Use candidate's course
#         priority="P3",  # Default priority
#         minrate=55,  # Default minimum rate
#         currentlocation=f"{candidate.city}, {candidate.state}" if candidate.city and candidate.state else "",
#         # Set other default values
#         relocation="Y",
#         locationpreference="",
#         skypeid="",
#         ipemailid=0,
#         resumeid=0,
#         coverletter="",
#         intro="",
#         notes="",
#         yearsofexperience=""
#     )
    
#     # Add to database
#     db.add(new_entry)
#     db.commit()
#     db.refresh(new_entry)
#     return new_entry


# # def move_to_current_marketing(db: Session, candidate_marketing_id: int):
# #     """
# #     Move a candidate from CandidateMarketing to CurrentMarketing.
# #     Called when the candidate marketing status is changed to "Inprogress".
    
# #     Args:
# #         db: Database session
# #         candidate_marketing_id: ID of the candidate marketing entry
        
# #     Returns:
# #         The newly created CurrentMarketing object
# #     """
# #     from app.models import CurrentMarketing
    
# #     # Get the candidate marketing entry
# #     cm_entry = db.query(CandidateMarketing).filter(CandidateMarketing.id == candidate_marketing_id).first()
# #     if not cm_entry:
# #         raise HTTPException(status_code=404, detail=f"Candidate Marketing entry with ID {candidate_marketing_id} not found")
    
# #     # Check if an entry already exists in current marketing
# #     existing_entry = db.query(CurrentMarketing).filter(CurrentMarketing.candidateid == cm_entry.candidateid).first()
# #     if existing_entry:
# #         # Update existing entry with values from candidate marketing
# #         for col in cm_entry.__table__.columns:
# #             if col.name != 'id' and hasattr(existing_entry, col.name):
# #                 setattr(existing_entry, col.name, getattr(cm_entry, col.name))
        
# #         # Update status to "2-Inprogress"
# #         existing_entry.status = "2-Inprogress"
# #         db.commit()
# #         db.refresh(existing_entry)
# #         return existing_entry
    
# #     # Create new current marketing entry
# #     current_marketing_data = {col.name: getattr(cm_entry, col.name) 
# #                              for col in cm_entry.__table__.columns 
# #                              if col.name != 'id'}
    
# #     # Set status to "2-Inprogress"
# #     current_marketing_data['status'] = "2-Inprogress"
    
# #     new_current_marketing = CurrentMarketing(**current_marketing_data)
# #     db.add(new_current_marketing)
# #     db.commit()
# #     db.refresh(new_current_marketing)
    
# #     return new_current_marketing


from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models import Candidate, CandidateMarketing, Employee
from app.schemas import CandidateMarketingUpdateSchema
from fastapi import HTTPException

def get_candidate_marketing_list(db: Session, skip: int, limit: int):
    """
    Retrieve a paginated list of candidate marketing records using a raw SQL query.
    Default pagination is set to 100 records per page.
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
            cm.notes,
            cm.yearsofexperience,
            cm.mmid,
            cm.instructorid,
            cm.submitterid,
            cm.ipemailid
        FROM candidatemarketing cm
        JOIN candidate c ON cm.candidateid = c.candidateid
        LEFT JOIN employee mm ON cm.mmid = mm.id AND mm.status = '0Active'
        LEFT JOIN employee ins ON cm.instructorid = ins.id AND ins.status = '0Active'
        LEFT JOIN employee sub ON cm.submitterid = sub.id AND sub.status = '0Active'
        LEFT JOIN ipemail ip ON cm.ipemailid = ip.id -- Join with ipemail to show the email
        ORDER BY cm.startdate DESC, cm.status ASC, cm.priority ASC, cm.candidateid
        LIMIT :limit OFFSET :skip
    """)

    # Get total count for pagination
    count_query = text("""
        SELECT COUNT(*) as total
        FROM candidatemarketing cm
        JOIN candidate c ON cm.candidateid = c.candidateid
    """)

    try:
        result = db.execute(query, {"skip": skip, "limit": limit})
        rows = result.fetchall()
        
        # Get column names
        columns = result.keys()
        
        # Convert to list of dictionaries
        data = [dict(zip(columns, row)) for row in rows]
        
        # Get total count
        count_result = db.execute(count_query)
        total_count = count_result.scalar()
        
        return {
            "data": data,
            "total": total_count,
            "page": skip // limit + 1,
            "page_size": limit,
            "total_pages": (total_count + limit - 1) // limit
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

def get_candidate_marketing_by_name(db: Session, candidate_name: str):
    """
    Retrieve candidate marketing records by candidate name using a raw SQL query.
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
            cm.locationpreference,
            cm.priority,
            cm.technology,
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
            cm.notes,
            cm.yearsofexperience,
            cm.mmid,
            cm.instructorid,
            cm.submitterid,
            cm.ipemailid
        FROM candidatemarketing cm
        JOIN candidate c ON cm.candidateid = c.candidateid
        LEFT JOIN employee mm ON cm.mmid = mm.id AND mm.status = '0Active'
        LEFT JOIN employee ins ON cm.instructorid = ins.id AND ins.status = '0Active'
        LEFT JOIN employee sub ON cm.submitterid = sub.id AND sub.status = '0Active'
        LEFT JOIN ipemail ip ON cm.ipemailid = ip.id
        WHERE c.name LIKE :candidate_name
    """)

    try:
        result = db.execute(query, {"candidate_name": f"%{candidate_name}%"})
        rows = result.fetchall()
        
        # Get column names
        columns = result.keys()
        
        # Convert to list of dictionaries
        data = [dict(zip(columns, row)) for row in rows]
        
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

def get_candidate_marketing_count(db: Session):
    """
    Get the total count of candidate marketing records for pagination.
    """
    query = text("""
        SELECT COUNT(*) as total
        FROM candidatemarketing cm
        JOIN candidate c ON cm.candidateid = c.candidateid
    """)
    
    try:
        result = db.execute(query)
        return result.scalar()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

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
    try:
        result = db.execute(query)
        rows = result.fetchall()
        
        # Convert to list of dictionaries to make it JSON serializable
        return [{"id": row[0], "name": row[1]} for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

def update_candidate_marketing(db: Session, candidate_marketing_id: int, update_data: CandidateMarketingUpdateSchema):
    """
    Update a candidate marketing record by ID with the provided data.
    """
    candidate_marketing = db.query(CandidateMarketing).filter(CandidateMarketing.id == candidate_marketing_id).first()
    if not candidate_marketing:
        return {"error": "Candidate Marketing not found"}

    # Get candidate's course if technology is not provided
    candidate = db.query(Candidate).filter(Candidate.candidateid == candidate_marketing.candidateid).first()
    if candidate:
        # Always sync technology with course if not explicitly provided
        update_data.technology = update_data.technology or candidate.course

    # Status mapping
    status_mapping = {
        "To Do": "1-To Do",
        "Inprogress": "2-Inprogress", 
        "Suspended": "6-Suspended",
        "Closed": "5-Closed"
    }
    
    if update_data.status:
        update_data.status = status_mapping.get(update_data.status, update_data.status)

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

    # Handle invalid date format for closedate
    if update_data.closedate and update_data.closedate in ["0000-00-00", "0000-00-00 00:00:00"]:
        update_data.closedate = None

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
        'closedate': update_data.closedate or None,
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