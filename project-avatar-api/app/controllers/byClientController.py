# # # from sqlalchemy.orm import Session
# # # from fastapi import HTTPException
# # # from app.models import Recruiter, Client
# # # from app.schemas import RecruiterCreate, RecruiterUpdate, RecruiterResponse, ClientResponseFetch
# # # from sqlalchemy import func

# # # def get_recruiters_by_client(db: Session, page: int, page_size: int):
# # #     query = db.query(Recruiter).filter(Recruiter.vendorid == 0)
# # #     total = db.query(func.count(Recruiter.id)).scalar()
# # #     recruiters = query.offset((page - 1) * page_size).limit(page_size).all()
    
# # #     recruiter_data = [RecruiterResponse.from_orm(recruiter) for recruiter in recruiters]
    
# # #     return {
# # #         "data": recruiter_data,
# # #         "total": total,
# # #         "page": page,
# # #         "page_size": page_size,
# # #         "pages": (total + page_size - 1) // page_size,
# # #     }

# # from sqlalchemy.orm import Session
# # from fastapi import HTTPException
# # from app.models import Recruiter, Client
# # from app.schemas import RecruiterCreate, RecruiterUpdate, RecruiterResponse, ClientResponseFetch
# # from sqlalchemy import func, text

# # def get_recruiters_by_client(db: Session, page: int, page_size: int, type: str = "client"):
# #     if type == "client":
# #         # Matches the PHP query for client type
# #         query = """
# #         SELECT 
# #             r.id,
# #             r.name,
# #             r.email,
# #             r.phone,
# #             r.designation,
# #             r.clientid,
# #             COALESCE(c.companyname, ' ') as comp,
# #             r.status,
# #             r.dob,
# #             r.personalemail,
# #             r.skypeid,
# #             r.linkedin,
# #             r.twitter,
# #             r.facebook,
# #             r.review,
# #             r.notes 
# #         FROM recruiter r
# #         LEFT JOIN client c ON c.id = r.clientid
# #         WHERE r.vendorid = 0
# #         ORDER BY c.companyname ASC, r.status
# #         """
        
# #         # Get total count
# #         count_query = """
# #         SELECT COUNT(*) 
# #         FROM recruiter r
# #         WHERE r.vendorid = 0
# #         """
        
# #         total = db.execute(text(count_query)).scalar()
        
# #         # Add pagination
# #         query += f" LIMIT {page_size} OFFSET {(page - 1) * page_size}"
        
# #         result = db.execute(text(query))
# #         recruiters = []
        
# #         # Group by company
# #         companies = {}
# #         for row in result:
# #             if row.clientid not in companies:
# #                 companies[row.clientid] = {
# #                     "clientid": row.clientid,
# #                     "companyname": row.comp,
# #                     "recruiters": []
# #                 }
            
# #             recruiter_data = {
# #                 "id": row.id,
# #                 "name": row.name,
# #                 "email": row.email,
# #                 "phone": row.phone,
# #                 "designation": row.designation,
# #                 "status": row.status,
# #                 "dob": row.dob if row.dob else None,
# #                 "personalemail": row.personalemail,
# #                 "skypeid": row.skypeid,
# #                 "linkedin": row.linkedin,
# #                 "twitter": row.twitter,
# #                 "facebook": row.facebook,
# #                 "review": row.review,
# #                 "notes": row.notes,
# #                 "clientid": row.clientid
# #             }
# #             companies[row.clientid]["recruiters"].append(recruiter_data)

# #         return {
# #             "data": list(companies.values()),
# #             "total": total,
# #             "page": page,
# #             "page_size": page_size,
# #             "pages": (total + page_size - 1) // page_size,
# #         }

# #     # .........................

# # def create_recruiter(db: Session, recruiter: RecruiterCreate):
# #     db_recruiter = Recruiter(**recruiter.dict())
# #     db.add(db_recruiter)
# #     db.commit()
# #     db.refresh(db_recruiter)
# #     return db_recruiter

# # def update_recruiter(db: Session, recruiter_id: int, recruiter: RecruiterUpdate):
# #     db_recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
# #     if not db_recruiter:
# #         raise HTTPException(status_code=404, detail="Recruiter not found")
# #     for key, value in recruiter.dict(exclude_unset=True).items():
# #         setattr(db_recruiter, key, value)
# #     db.commit()
# #     db.refresh(db_recruiter)
# #     return db_recruiter

# # def delete_recruiter(db: Session, recruiter_id: int):
# #     db_recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
# #     if not db_recruiter:
# #         raise HTTPException(status_code=404, detail="Recruiter not found")
# #     db.delete(db_recruiter)
# #     db.commit()
# #     return {"message": "Recruiter deleted successfully"}

# # def get_recruiter_by_id(db: Session, recruiter_id: int):
# #     db_recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
# #     if not db_recruiter:
# #         raise HTTPException(status_code=404, detail="Recruiter not found")
# #     return db_recruiter

# # def get_clients(db: Session):
# #     return db.query(Client).all()


# from sqlalchemy.orm import Session
# from fastapi import HTTPException
# from app.models import Recruiter, Client
# from app.schemas import RecruiterCreate, RecruiterUpdate, RecruiterResponse
# from sqlalchemy import text
# from typing import Optional, Dict, Any

# def get_recruiters_by_client(
#     db: Session, 
#     page: int, 
#     page_size: int, 
#     type: str,
#     search: Optional[str] = None
# ) -> Dict[str, Any]:
#     """
#     Matches PHP's grid->SelectCommand functionality for client type
#     """
#     if type == "client":
#         base_query = """
#             SELECT 
#                 r.id,
#                 r.name,
#                 r.email,
#                 r.phone,
#                 r.designation,
#                 r.clientid,
#                 COALESCE((SELECT c.companyname FROM client c WHERE c.id = r.clientid), ' ') as comp,
#                 r.status,
#                 r.dob,
#                 r.personalemail,
#                 r.skypeid,
#                 r.linkedin,
#                 r.twitter,
#                 r.facebook,
#                 r.review,
#                 r.notes
#             FROM recruiter r
#             WHERE r.vendorid = 0
#         """

#         # Add search if provided (matching PHP's search functionality)
#         if search:
#             base_query += """
#                 AND (
#                     LOWER(r.name) LIKE LOWER(:search)
#                     OR LOWER(r.email) LIKE LOWER(:search)
#                     OR LOWER((SELECT c.companyname FROM client c WHERE c.id = r.clientid)) LIKE LOWER(:search)
#                 )
#             """

#         # Match PHP's sorting
#         base_query += " ORDER BY comp ASC, r.status ASC"

#         # Get total count (matching PHP's count query)
#         count_query = "SELECT COUNT(*) FROM recruiter WHERE vendorid = 0"
#         if search:
#             count_query = f"SELECT COUNT(*) FROM ({base_query}) as count_query"

#         # Execute count query
#         params = {"search": f"%{search}%" if search else None}
#         total = db.execute(text(count_query), params).scalar()

#         # Add pagination (matching PHP's rowNum)
#         base_query += " LIMIT :limit OFFSET :offset"
#         params.update({
#             "limit": page_size,
#             "offset": (page - 1) * page_size
#         })

#         # Execute main query
#         results = db.execute(text(base_query), params).fetchall()

#         # Group results by company (matching PHP's grouping)
#         grouped_data = {}
#         for row in results:
#             if row.clientid not in grouped_data:
#                 grouped_data[row.clientid] = {
#                     "clientid": row.clientid,
#                     "companyname": row.comp,
#                     "recruiters": [],
#                     "isGroup": True,
#                     "isCollapsed": True  # Matches PHP's groupCollapse
#                 }

#             recruiter = {
#                 "id": row.id,
#                 "name": row.name,
#                 "email": row.email,
#                 "phone": row.phone,
#                 "designation": row.designation,
#                 "status": row.status,
#                 "dob": str(row.dob) if row.dob else None,
#                 "personalemail": row.personalemail,
#                 "skypeid": row.skypeid,
#                 "linkedin": row.linkedin,
#                 "twitter": row.twitter,
#                 "facebook": row.facebook,
#                 "review": row.review,
#                 "notes": row.notes,
#                 "clientid": row.clientid,
#                 "companyname": row.comp
#             }
#             grouped_data[row.clientid]["recruiters"].append(recruiter)

#         return {
#             "data": list(grouped_data.values()),
#             "total": total,
#             "page": page,
#             "page_size": page_size,
#             "pages": (total + page_size - 1) // page_size,
#             "grouping": {
#                 "enabled": True,
#                 "groupField": "clientid",
#                 "groupOrder": "desc",
#                 "groupCollapse": True
#             }
#         }

# def get_client_options(db: Session) -> list:
#     """
#     Matches PHP's setSelect for clientid dropdown
#     """
#     query = """
#         SELECT id, companyname as name 
#         FROM client 
#         WHERE id IN (
#             SELECT DISTINCT clientid 
#             FROM recruiter 
#             WHERE vendorid = 0
#         )
#         ORDER BY companyname
#     """
#     results = db.execute(text(query)).fetchall()
#     options = [{"id": 0, "name": "Client not selected..."}]
#     options.extend([{"id": row.id, "name": row.name} for row in results])
#     return options

# def create_recruiter(db: Session, recruiter: RecruiterCreate):
#     """
#     Matches PHP's add functionality
#     """
#     db_recruiter = Recruiter(**recruiter.dict())
#     db_recruiter.vendorid = 0  # For client type
#     db.add(db_recruiter)
#     db.commit()
#     db.refresh(db_recruiter)
#     return db_recruiter

# def update_recruiter(db: Session, recruiter_id: int, recruiter: RecruiterUpdate):
#     """
#     Matches PHP's edit functionality
#     """
#     db_recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
#     if not db_recruiter:
#         raise HTTPException(status_code=404, detail="Recruiter not found")
    
#     for key, value in recruiter.dict(exclude_unset=True).items():
#         setattr(db_recruiter, key, value)
    
#     db.commit()
#     db.refresh(db_recruiter)
#     return db_recruiter

# def delete_recruiter(db: Session, recruiter_id: int):
#     """
#     Matches PHP's delete functionality
#     """
#     db_recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
#     if not db_recruiter:
#         raise HTTPException(status_code=404, detail="Recruiter not found")
    
#     db.delete(db_recruiter)
#     db.commit()
#     return {"message": "Recruiter deleted successfully"}

# def get_recruiter(db: Session, recruiter_id: int):
#     """
#     Matches PHP's view functionality
#     """
#     recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
#     if not recruiter:
#         raise HTTPException(status_code=404, detail="Recruiter not found")
#     return recruiter



from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import Recruiter, Client
from app.schemas import RecruiterCreate, RecruiterUpdate, RecruiterResponse
from sqlalchemy import text
from typing import Optional, Dict, Any

def get_recruiters_by_client(
    db: Session, 
    page: int, 
    page_size: int, 
    type: str,
    search: Optional[str] = None
) -> Dict[str, Any]:
    """
    Get companies with pagination and their recruiters
    """
    if type == "client":
        # First, get paginated companies
        companies_query = """
            SELECT DISTINCT 
                c.id,
                c.companyname,
                COUNT(r.id) as recruiter_count
            FROM client c
            LEFT JOIN recruiter r ON r.clientid = c.id AND r.vendorid = 0
            WHERE c.id IN (
                SELECT DISTINCT clientid 
                FROM recruiter 
                WHERE vendorid = 0
            )
        """

        if search:
            companies_query += """
                AND (
                    LOWER(c.companyname) LIKE LOWER(:search)
                )
            """

        companies_query += " GROUP BY c.id, c.companyname ORDER BY c.companyname"

        # Get total count of companies
        count_query = f"""
            SELECT COUNT(*) FROM (
                SELECT DISTINCT c.id
                FROM client c
                WHERE c.id IN (
                    SELECT DISTINCT clientid 
                    FROM recruiter 
                    WHERE vendorid = 0
                )
                {f"AND LOWER(c.companyname) LIKE LOWER(:search)" if search else ""}
            ) as count_query
        """

        params = {"search": f"%{search}%" if search else None}
        total = db.execute(text(count_query), params).scalar()

        # Add pagination to companies query
        companies_query += " LIMIT :limit OFFSET :offset"
        params.update({
            "limit": page_size,
            "offset": (page - 1) * page_size
        })

        companies = db.execute(text(companies_query), params).fetchall()

        # Initialize grouped data
        grouped_data = {}
        
        # For each company in the current page, get its recruiters
        for company in companies:
            recruiters_query = """
                SELECT 
                    r.id,
                    r.name,
                    r.email,
                    r.phone,
                    r.designation,
                    r.clientid,
                    r.status,
                    r.dob,
                    r.personalemail,
                    r.skypeid,
                    r.linkedin,
                    r.twitter,
                    r.facebook,
                    r.review,
                    r.notes
                FROM recruiter r
                WHERE r.vendorid = 0 
                AND r.clientid = :company_id
                ORDER BY r.status ASC, r.name ASC
            """
            
            recruiters = db.execute(text(recruiters_query), {"company_id": company.id}).fetchall()
            
            grouped_data[company.id] = {
                "clientid": company.id,
                "companyname": company.companyname,
                "recruiters": [{
                    "id": r.id,
                    "name": r.name,
                    "email": r.email,
                    "phone": r.phone,
                    "designation": r.designation,
                    "status": r.status,
                    "dob": str(r.dob) if r.dob else None,
                    "personalemail": r.personalemail,
                    "skypeid": r.skypeid,
                    "linkedin": r.linkedin,
                    "twitter": r.twitter,
                    "facebook": r.facebook,
                    "review": r.review,
                    "notes": r.notes,
                    "clientid": r.clientid,
                    "companyname": company.companyname
                } for r in recruiters],
                "isGroup": True,
                "isCollapsed": True,
                "recruiter_count": company.recruiter_count
            }

        return {
            "data": list(grouped_data.values()),
            "total": total,
            "page": page,
            "page_size": page_size,
            "pages": (total + page_size - 1) // page_size,
            "grouping": {
                "enabled": True,
                "groupField": "clientid",
                "groupOrder": "desc",
                "groupCollapse": True
            }
        }

def get_client_options(db: Session) -> list:
    """
    Get client options for dropdown (unchanged)
    """
    query = """
        SELECT id, companyname as name 
        FROM client 
        WHERE id IN (
            SELECT DISTINCT clientid 
            FROM recruiter 
            WHERE vendorid = 0
        )
        ORDER BY companyname
    """
    results = db.execute(text(query)).fetchall()
    options = [{"id": 0, "name": "Client not selected..."}]
    options.extend([{"id": row.id, "name": row.name} for row in results])
    return options

# Keep existing CRUD functions unchanged
def create_recruiter(db: Session, recruiter: RecruiterCreate):
    db_recruiter = Recruiter(**recruiter.dict())
    db_recruiter.vendorid = 0
    db.add(db_recruiter)
    db.commit()
    db.refresh(db_recruiter)
    return db_recruiter

def update_recruiter(db: Session, recruiter_id: int, recruiter: RecruiterUpdate):
    db_recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not db_recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    
    for key, value in recruiter.dict(exclude_unset=True).items():
        setattr(db_recruiter, key, value)
    
    db.commit()
    db.refresh(db_recruiter)
    return db_recruiter

def delete_recruiter(db: Session, recruiter_id: int):
    db_recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not db_recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    
    db.delete(db_recruiter)
    db.commit()
    return {"message": "Recruiter deleted successfully"}

def get_recruiter(db: Session, recruiter_id: int):
    recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    return recruiter