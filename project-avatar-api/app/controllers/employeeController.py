# # app/controllers/employee_controller.py
# from sqlalchemy.orm import Session
# from sqlalchemy import and_, or_, func
# from datetime import date
# from fastapi import HTTPException
# from app.models import Employee
# from app.schemas import EmployeeCreate, EmployeeUpdate, EmployeeInDB
# from typing import List, Dict, Optional

# def get_employees(
#     db: Session,
#     page: int = 1,
#     page_size: int = 100,
#     search: Optional[str] = None,
#     sort_field: str = "name",
#     sort_order: str = "asc",
#     filters: Optional[Dict] = None
# ) -> Dict:
#     query = db.query(Employee)
    
#     # Apply search
#     if search:
#         search = f"%{search}%"
#         query = query.filter(
#             or_(
#                 Employee.name.ilike(search),
#                 Employee.email.ilike(search),
#                 Employee.phone.ilike(search),
#                 Employee.personalemail.ilike(search),
#                 Employee.skypeid.ilike(search)
#             )
#         )
    
#     # Apply filters
#     if filters:
#         filter_conditions = []
#         for field, value in filters.items():
#             if value and hasattr(Employee, field):
#                 if field in ["startdate", "enddate", "dob"]:
#                     filter_conditions.append(getattr(Employee, field) == value)
#                 else:
#                     filter_conditions.append(getattr(Employee, field).ilike(f"%{value}%"))
#         if filter_conditions:
#             query = query.filter(and_(*filter_conditions))
    
#     # Apply sorting
#     if hasattr(Employee, sort_field):
#         if sort_order.lower() == "desc":
#             query = query.order_by(getattr(Employee, sort_field).desc())
#         else:
#             query = query.order_by(getattr(Employee, sort_field).asc())
    
#     # Pagination
#     total = query.count()
#     employees = query.offset((page - 1) * page_size).limit(page_size).all()
    
#     return {
#         "data": employees,
#         "total": total,
#         "page": page,
#         "page_size": page_size,
#         "total_pages": (total + page_size - 1) // page_size
#     }

# def get_employee(db: Session, employee_id: int) -> Employee:
#     employee = db.query(Employee).filter(Employee.id == employee_id).first()
#     if not employee:
#         raise HTTPException(status_code=404, detail="Employee not found")
#     return employee

# def create_employee(db: Session, employee: EmployeeCreate) -> Employee:
#     db_employee = Employee(**employee.dict())
#     db.add(db_employee)
#     db.commit()
#     db.refresh(db_employee)
#     return db_employee

# def update_employee(db: Session, employee_id: int, employee: EmployeeUpdate) -> Employee:
#     db_employee = get_employee(db, employee_id)
#     for key, value in employee.dict(exclude_unset=True).items():
#         setattr(db_employee, key, value)
#     db.commit()
#     db.refresh(db_employee)
#     return db_employee

# def delete_employee(db: Session, employee_id: int) -> bool:
#     db_employee = get_employee(db, employee_id)
#     db.delete(db_employee)
#     db.commit()
#     return True

# def get_employee_status_options(db: Session) -> List[str]:
#     return db.query(Employee.status).distinct().all()

# def get_employee_type_options(db: Session) -> List[str]:
#     return db.query(Employee.type).distinct().all()\








from typing import List, Dict, Optional
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, asc, desc, func, text
from app.models import Employee, Designation, UCUser, UCUserPermissionMatch
from app.schemas import EmployeeInDB, EmployeeResponse, EmployeeUpdate, EmployeeCreate

def sanitize_employee_data(employee_data: dict) -> dict:
    """Clean up employee data before validation"""
    if 'personalemail' in employee_data and employee_data['personalemail'] == '':
        employee_data['personalemail'] = None
    
    for date_field in ['dob', 'enddate', 'startdate']:
        if date_field in employee_data and employee_data[date_field] in ('', '0000-00-00', 'NULL'):
            employee_data[date_field] = None
    
    return employee_data

def get_employee(db: Session, employee_id: int) -> Optional[EmployeeInDB]:
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        return None
    
    employee_dict = {c.name: getattr(employee, c.name) for c in employee.__table__.columns}
    sanitized_data = sanitize_employee_data(employee_dict)
    return EmployeeInDB.model_validate(sanitized_data)

def search_employees(db: Session, query: str, page: int = 1, page_size: int = 100) -> Dict:
    """Exactly matches PHP search functionality"""
    search_filter = or_(
        Employee.name.ilike(f"%{query}%"),
        Employee.email.ilike(f"%{query}%"),
        Employee.phone.ilike(f"%{query}%"),
        Employee.skypeid.ilike(f"%{query}%"),
        Employee.id == query if query.isdigit() else False
    )

    # Using raw SQL to exactly match PHP query
    sql = text("""
        SELECT id, name, email, phone, status, startdate, mgrid, designationid, 
               personalemail, personalphone, dob, address, city, state, country, zip, 
               skypeid, salary, commission, commissionrate, type, empagreementurl, 
               offerletterurl, dlurl, workpermiturl, contracturl, enddate, loginid, 
               responsibilities, notes 
        FROM employee
        WHERE name LIKE :query OR email LIKE :query OR phone LIKE :query 
              OR skypeid LIKE :query OR id = :id_param
        ORDER BY name
        LIMIT :limit OFFSET :offset
    """)
    
    result = db.execute(sql, {
        'query': f"%{query}%",
        'id_param': query if query.isdigit() else -1,
        'limit': page_size,
        'offset': (page - 1) * page_size
    })
    
    total = db.query(Employee).filter(search_filter).count()
    items = result.fetchall()
    
    results = []
    for index, row in enumerate(items, start=1):
        item_dict = dict(row._mapping)
        sanitized_data = sanitize_employee_data(item_dict)
        result_item = {"si_no": (page - 1) * page_size + index}
        result_item.update(sanitized_data)
        results.append(result_item)

    return {
        "page": page,
        "page_size": page_size,
        "total": total,
        "items": results
    }

def get_employees(
    db: Session,
    page: int = 1,
    page_size: int = 100,
    search: Optional[str] = None,
    sort_field: str = "name",
    sort_order: str = "asc",
    filters: Optional[Dict] = None
) -> Dict:
    """Matches the PHP grid SelectCommand exactly"""
    # Base query matches PHP: SELECT id, name, email, phone, ... FROM employee
    query = db.query(
        Employee.id,
        Employee.name,
        Employee.email,
        Employee.phone,
        Employee.status,
        Employee.startdate,
        Employee.mgrid,
        Employee.designationid,
        Employee.personalemail,
        Employee.personalphone,
        Employee.dob,
        Employee.address,
        Employee.city,
        Employee.state,
        Employee.country,
        Employee.zip,
        Employee.skypeid,
        Employee.salary,
        Employee.commission,
        Employee.commissionrate,
        Employee.type,
        Employee.empagreementurl,
        Employee.offerletterurl,
        Employee.dlurl,
        Employee.workpermiturl,
        Employee.contracturl,
        Employee.enddate,
        Employee.loginid,
        Employee.responsibilities,
        Employee.notes
    )

    # Apply search filter (matches PHP search logic)
    if search:
        search_filter = or_(
            Employee.name.ilike(f"%{search}%"),
            Employee.email.ilike(f"%{search}%"),
            Employee.phone.ilike(f"%{search}%"),
            Employee.skypeid.ilike(f"%{search}%"),
            Employee.id == search if search.isdigit() else False
        )
        query = query.filter(search_filter)

    # Apply filters (matches PHP grid filters)
    if filters:
        for field, value in filters.items():
            if field == "status" and value:
                query = query.filter(Employee.status == value)
            elif field == "type" and value:
                query = query.filter(Employee.type == value)
            elif field == "startdate":
                if value.get("gte"):
                    query = query.filter(Employee.startdate >= value["gte"])
                if value.get("lte"):
                    query = query.filter(Employee.startdate <= value["lte"])

    # Apply sorting (matches PHP sortname/sortorder)
    sort_column = getattr(Employee, sort_field, Employee.name)
    if sort_order.lower() == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(asc(sort_column))

    # Pagination (matches PHP rowNum/rowList)
    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    
    # Convert to list of dictionaries with si_no (matches PHP grid serialization)
    results = []
    for index, item in enumerate(items, start=1):
        item_dict = {
            "si_no": (page - 1) * page_size + index,
            "id": item.id,
            "name": item.name,
            "email": item.email,
            "phone": item.phone,
            "status": item.status,
            "startdate": item.startdate,
            "mgrid": item.mgrid,
            "designationid": item.designationid,
            "personalemail": item.personalemail,
            "personalphone": item.personalphone,
            "dob": item.dob,
            "address": item.address,
            "city": item.city,
            "state": item.state,
            "country": item.country,
            "zip": item.zip,
            "skypeid": item.skypeid,
            "salary": item.salary,
            "commission": item.commission,
            "commissionrate": item.commissionrate,
            "type": item.type,
            "empagreementurl": item.empagreementurl,
            "offerletterurl": item.offerletterurl,
            "dlurl": item.dlurl,
            "workpermiturl": item.workpermiturl,
            "contracturl": item.contracturl,
            "enddate": item.enddate,
            "loginid": item.loginid,
            "responsibilities": item.responsibilities,
            "notes": item.notes
        }
        
        sanitized_data = sanitize_employee_data(item_dict)
        results.append(sanitized_data)

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "items": results
    }

def create_employee(db: Session, employee: EmployeeCreate) -> EmployeeInDB:
    employee_data = employee.model_dump()
    sanitized_data = sanitize_employee_data(employee_data)
    
    db_employee = Employee(**sanitized_data)
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    
    return EmployeeInDB.model_validate(db_employee.__dict__)

def update_employee(db: Session, employee_id: int, employee: EmployeeUpdate) -> Optional[EmployeeInDB]:
    db_employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not db_employee:
        return None
    
    update_data = employee.model_dump(exclude_unset=True)
    sanitized_data = sanitize_employee_data(update_data)
    
    for field, value in sanitized_data.items():
        setattr(db_employee, field, value)
    
    db.commit()
    db.refresh(db_employee)
    return EmployeeInDB.model_validate(db_employee.__dict__)

def delete_employee(db: Session, employee_id: int) -> bool:
    db_employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not db_employee:
        return False
    
    db.delete(db_employee)
    db.commit()
    return True

def get_employee_status_options(db: Session) -> List[str]:
    """Matches PHP $employeestatus options"""
    statuses = db.query(Employee.status).distinct().all()
    return [status[0] for status in statuses if status[0]]

def get_employee_type_options(db: Session) -> List[str]:
    """Matches PHP type options: array("Full Time"=>"Full Time", "Part Time"=>"Part Time")"""
    types = db.query(Employee.type).distinct().all()
    return [type[0] for type in types if type[0]]

def get_manager_options(db: Session) -> List[Dict[str, str]]:
    """EXACTLY matches PHP: select '' as id, '' as name from dual union SELECT distinct id, name FROM employee where status = '0Active' order by name"""
    # Using raw SQL to exactly match the PHP query
    sql = text("""
        SELECT '' as id, '' as name
        UNION
        SELECT distinct id, name 
        FROM employee 
        WHERE status = '0Active' 
        ORDER BY name
    """)
    result = db.execute(sql)
    return [dict(row._mapping) for row in result]

def get_designation_options(db: Session) -> List[Dict[str, str]]:
    """EXACTLY matches PHP: select '' as id, '' as name from dual union SELECT distinct id, name FROM designation order by name"""
    sql = text("""
        SELECT '' as id, '' as name
        UNION
        SELECT distinct id, name 
        FROM designation 
        ORDER BY name
    """)
    result = db.execute(sql)
    return [dict(row._mapping) for row in result]

def get_loginid_options(db: Session) -> List[Dict[str, str]]:
    """EXACTLY matches PHP: select '' as id, '' as name from dual union select distinct u.id as id, concat(u.display_name, '-', u.email) as name from uc_users u, uc_user_permission_matches up where u.id = up.user_id and up.permission_id not in (13,14) order by name"""
    sql = text("""
        SELECT '' as id, '' as name
        UNION
        SELECT distinct u.id as id, concat(u.display_name, '-', u.email) as name 
        FROM uc_users u, uc_user_permission_matches up 
        WHERE u.id = up.user_id AND up.permission_id NOT IN (13,14) 
        ORDER BY name
    """)
    result = db.execute(sql)
    return [dict(row._mapping) for row in result]