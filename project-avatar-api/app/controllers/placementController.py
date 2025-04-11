# # from sqlalchemy.orm import Session
# # from app.models import MktSubmission, Candidate
# # from typing import List
# # from app.database.db import get_db
# # from app.schemas import MktSubmissionResponse

# # def get_mkt_submission_details(db: Session, page: int = 1, pageSize: int = 200):
# #     """
# #     Retrieve marketing submissions for candidates with status in Marketing, Placed, or OnProject-Mkt
# #     with pagination support
    
# #     Args:
# #         db (Session): Database session
# #         page (int): The page number to retrieve
# #         pageSize (int): Number of items per page
        
# #     Returns:
# #         List of marketing submissions with candidate details
# #     """
# #     query = db.query(
# #         MktSubmission.id,
# #         MktSubmission.submissiondate,
# #         MktSubmission.candidateid,
# #         MktSubmission.employeeid,
# #         MktSubmission.submitter,
# #         Candidate.course,
# #         MktSubmission.email,
# #         MktSubmission.phone,
# #         MktSubmission.url,
# #         MktSubmission.name,
# #         MktSubmission.location,
# #         MktSubmission.notes,
# #         MktSubmission.feedback
# #     ).outerjoin(Candidate, MktSubmission.candidateid == Candidate.candidateid) \
# #      .filter(Candidate.status.in_(["Marketing", "Placed", "OnProject-Mkt"]))

# #     # Apply pagination
# #     offset = (page - 1) * pageSize
# #     query = query.offset(offset).limit(pageSize)

# #     return query.all()
# from app.models import MktSubmission, Candidate

# from sqlalchemy import desc, asc
# from sqlalchemy.orm import Session, joinedload
# from app.models import MktSubmission, Candidate, Employee
# from app.schemas import MktSubmissionWithCandidateResponse, GridResponse
# from app.database.db import get_db
# from typing import Dict, Any
# from datetime import datetime

# def get_submission_details(
#     db: Session,
#     page: int = 1,
#     rows: int = 100,
#     sidx: str = "submissiondate",
#     sord: str = "desc",
#     filters: Dict[str, Any] = None
# ) -> Dict[str, Any]:
#     """
#     Get marketing submissions with grid functionality
#     """
#     # Base query - using select_from to explicitly define the starting point
#     query = db.query(
#         MktSubmission,
#         Candidate.course,
#         Candidate.name.label('candidate_name'),
#         Employee.name.label('employee_name')
#     ).select_from(MktSubmission).outerjoin(
#         Candidate,
#         MktSubmission.candidateid == Candidate.candidateid
#     ).outerjoin(
#         Employee,
#         MktSubmission.employeeid == Employee.id
#     ).filter(
#         Candidate.status.in_(["Marketing", "Placed", "OnProject-Mkt"])
#     )

#     # Apply filters if any
#     if filters:
#         for field, value in filters.items():
#             if value:
#                 if field == 'candidateid' and isinstance(value, int):
#                     query = query.filter(MktSubmission.candidateid == value)
#                 elif field == 'employeeid' and isinstance(value, int):
#                     query = query.filter(MktSubmission.employeeid == value)
#                 elif field == 'submissiondate':
#                     try:
#                         date_value = datetime.strptime(value, '%Y-%m-%d').date()
#                         query = query.filter(MktSubmission.submissiondate == date_value)
#                     except ValueError:
#                         pass
#                 elif hasattr(MktSubmission, field):
#                     query = query.filter(getattr(MktSubmission, field).ilike(f"%{value}%"))
#                 elif field == 'course':
#                     query = query.filter(Candidate.course.ilike(f"%{value}%"))

#     # Get total count
#     total_records = query.count()
#     total_pages = (total_records + rows - 1) // rows

#     # Apply sorting
#     if sidx:
#         if hasattr(MktSubmission, sidx):
#             sort_col = getattr(MktSubmission, sidx)
#             query = query.order_by(desc(sort_col) if sord == 'desc' else asc(sort_col))
#         elif sidx == 'course':
#             query = query.order_by(desc(Candidate.course) if sord == 'desc' else asc(Candidate.course))
#         elif sidx == 'candidate_name':
#             query = query.order_by(desc(Candidate.name) if sord == 'desc' else asc(Candidate.name))
#         elif sidx == 'employee_name':
#             query = query.order_by(desc(Employee.name) if sord == 'desc' else asc(Employee.name))

#     # Apply pagination
#     query = query.offset((page - 1) * rows).limit(rows)

#     # Execute query
#     results = query.all()

#     # Format results
#     records = []
#     for result in results:
#         submission = result[0]  # MktSubmission object
#         record = {
#             "id": submission.id,
#             "submissiondate": submission.submissiondate,
#             "candidateid": submission.candidateid,
#             "employeeid": submission.employeeid,
#             "submitter": submission.submitter,
#             "course": result.course,
#             "email": submission.email,
#             "phone": submission.phone,
#             "url": submission.url,
#             "name": submission.name,
#             "location": submission.location,
#             "notes": submission.notes,
#             "feedback": submission.feedback,
#             "candidate_name": result.candidate_name,
#             "employee_name": result.employee_name
#         }
#         records.append(record)

#     return {
#         "page": page,
#         "total": total_pages,
#         "records": records,
#         "total_records": total_records
#     }
    
# async def add_placement(db: Session, mktSubmission: dict):
#     placement = MktSubmission(
#         submissiondate=mktSubmission.get("submissiondate"),
#         candidateid=mktSubmission.get("candidateid"),
#         employeeid=mktSubmission.get("employeeid"),
#         submitter=mktSubmission.get("submitter"),
#         email=mktSubmission.get("email"),
#         phone=mktSubmission.get("phone"),
#         url=mktSubmission.get("url"),
#         name=mktSubmission.get("name"),
#         location=mktSubmission.get("location"),
#         notes=mktSubmission.get("notes"),
#         feedback=mktSubmission.get("feedback")
#     )
#     db.add(placement)
#     db.commit()
#     db.refresh(placement)
#     return placement


from app.models import MktSubmission, Candidate, Employee
from sqlalchemy import desc, asc
from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from typing import Dict, Any, List

def get_submission_details(
    db: Session,
    page: int = 1,
    rows: int = 100,
    sidx: str = "submissiondate",
    sord: str = "desc",
    filters: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Get marketing submissions with grid functionality
    """
    query = db.query(
        MktSubmission,
        Candidate.course,
        Candidate.name.label('candidate_name'),
        Employee.name.label('employee_name')
    ).select_from(MktSubmission).outerjoin(
        Candidate,
        MktSubmission.candidateid == Candidate.candidateid
    ).outerjoin(
        Employee,
        MktSubmission.employeeid == Employee.id
    ).filter(
        Candidate.status.in_(["Marketing", "Placed", "OnProject-Mkt"])
    )

    # Apply filters if any
    if filters:
        for field, value in filters.items():
            if value:
                if field == 'candidateid' and isinstance(value, int):
                    query = query.filter(MktSubmission.candidateid == value)
                elif field == 'employeeid' and isinstance(value, int):
                    query = query.filter(MktSubmission.employeeid == value)
                elif field == 'submissiondate':
                    try:
                        date_value = datetime.strptime(value, '%Y-%m-%d').date()
                        query = query.filter(MktSubmission.submissiondate == date_value)
                    except ValueError:
                        pass
                elif hasattr(MktSubmission, field):
                    query = query.filter(getattr(MktSubmission, field).ilike(f"%{value}%"))
                elif field == 'course':
                    query = query.filter(Candidate.course.ilike(f"%{value}%"))

    # Get total count
    total_records = query.count()
    total_pages = (total_records + rows - 1) // rows

    # Apply sorting
    if sidx:
        if hasattr(MktSubmission, sidx):
            sort_col = getattr(MktSubmission, sidx)
            query = query.order_by(desc(sort_col) if sord == 'desc' else asc(sort_col))
        elif sidx == 'course':
            query = query.order_by(desc(Candidate.course) if sord == 'desc' else asc(Candidate.course))
        elif sidx == 'candidate_name':
            query = query.order_by(desc(Candidate.name) if sord == 'desc' else asc(Candidate.name))
        elif sidx == 'employee_name':
            query = query.order_by(desc(Employee.name) if sord == 'desc' else asc(Employee.name))

    # Apply pagination
    query = query.offset((page - 1) * rows).limit(rows)

    # Execute query
    results = query.all()

    # Format results
    records = []
    for result in results:
        submission = result[0]  # MktSubmission object
        record = {
            "id": submission.id,
            "submissiondate": submission.submissiondate,
            "candidateid": submission.candidateid,
            "employeeid": submission.employeeid,
            "submitter": submission.submitter,
            "course": result.course,
            "email": submission.email,
            "phone": submission.phone,
            "url": submission.url,
            "name": submission.name,
            "location": submission.location,
            "notes": submission.notes,
            "feedback": submission.feedback,
            "candidate_name": result.candidate_name,
            "employee_name": result.employee_name
        }
        records.append(record)

    return {
        "page": page,
        "total": total_pages,
        "records": records,
        "total_records": total_records
    }

async def add_placement(db: Session, mkt_submission: dict):
    """Add new placement submission"""
    try:
        placement = MktSubmission(
            submissiondate=mkt_submission.get("submissiondate"),
            candidateid=mkt_submission.get("candidateid"),
            employeeid=mkt_submission.get("employeeid"),
            submitter=mkt_submission.get("submitter"),
            email=mkt_submission.get("email"),
            phone=mkt_submission.get("phone"),
            url=mkt_submission.get("url"),
            name=mkt_submission.get("name"),
            location=mkt_submission.get("location"),
            notes=mkt_submission.get("notes"),
            feedback=mkt_submission.get("feedback")
        )
        db.add(placement)
        db.commit()
        db.refresh(placement)
        return placement
    except Exception as e:
        db.rollback()
        raise e

async def update_placement(db: Session, submission_id: int, update_data: dict):
    """Update existing placement submission"""
    try:
        placement = db.query(MktSubmission).filter(MktSubmission.id == submission_id).first()
        if not placement:
            return None
            
        for key, value in update_data.items():
            if hasattr(placement, key):
                setattr(placement, key, value)
                
        db.commit()
        db.refresh(placement)
        return placement
    except Exception as e:
        db.rollback()
        raise e

async def delete_placement(db: Session, submission_id: int):
    """Delete placement submission"""
    try:
        placement = db.query(MktSubmission).filter(MktSubmission.id == submission_id).first()
        if not placement:
            return False
            
        db.delete(placement)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        raise e

async def get_candidate_options(db: Session):
    """Get candidate options for dropdown matching PHP query"""
    return db.query(
        Candidate.candidateid.label('id'),
        Candidate.name,
        Candidate.course.label('skill')
    ).filter(
        Candidate.status.in_(["Marketing", "Placed", "OnProject-Mkt"])
    ).order_by(
        Candidate.name
    ).all()

async def get_employee_options(db: Session):
    """Get employee options for dropdown matching PHP query"""
    return db.query(
        Employee.id.label('employeeid'),
        Employee.name
    ).filter(
        Employee.status.in_(['0Active', '2Discontinued', '3Break'])
    ).order_by(
        Employee.name
    ).all()