from typing import List, Dict, Optional, Tuple
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, asc, desc, func, text, select, join
from app.models import Employee, Designation, UCUser, UCUserPermissionMatch
from app.schemas import EmployeeInDB, EmployeeResponse, EmployeeUpdate, EmployeeCreate

def sanitize_employee_data(employee_data: dict) -> dict:
    """Clean up employee data before validation"""
    if 'personalemail' in employee_data and employee_data['personalemail'] == '':
        employee_data['personalemail'] = None

    for date_field in ['dob', 'enddate', 'startdate']:
        if date_field in employee_data and employee_data[date_field] in ('', '0000-00-00', 'NULL'):
            employee_data[date_field] = None
            
    # Handle status prefixing
    if 'status' in employee_data:
        if employee_data['status'] == 'Active':
            employee_data['status'] = '0Active'
        elif employee_data['status'] == 'Fired':
            employee_data['status'] = '1Fired'
        elif employee_data['status'] == 'Discontinued':
            employee_data['status'] = '2Discontinued'
        elif employee_data['status'] == 'Break':
            employee_data['status'] = '4Break'

    return employee_data

def transform_employee_data(employee_data: dict) -> dict:
    """Transform field names as requested"""
    transformed = employee_data.copy()
    
    # Rename fields
    if 'manager_name' in transformed:
        transformed['manager'] = transformed.pop('manager_name')
    if 'designation_name' in transformed:
        transformed['designation'] = transformed.pop('designation_name')
    if 'login_email' in transformed:
        transformed['loginid'] = transformed.pop('login_email')
    
    # Remove original ID fields if they exist
    transformed.pop('mgrid', None)
    transformed.pop('designationid', None)
    
    return transformed

def get_employee(db: Session, employee_id: int) -> Optional[Dict]:
    """Get employee with joined data for manager, designation, and loginid"""
    sql = text("""
        SELECT e.*, 
               m.name as manager_name,
               d.name as designation_name,
               u.email as login_email
        FROM employee e
        LEFT JOIN employee m ON e.mgrid = m.id
        LEFT JOIN designation d ON e.designationid = d.id
        LEFT JOIN uc_users u ON e.loginid = u.id
        WHERE e.id = :employee_id
    """)
    result = db.execute(sql, {'employee_id': employee_id}).first()
    
    if not result:
        return None

    employee_dict = dict(result._mapping)
    sanitized_data = sanitize_employee_data(employee_dict)
    transformed_data = transform_employee_data(sanitized_data)
    return transformed_data

def search_employees(db: Session, query: str, page: int = 1, page_size: int = 100) -> Dict:
    """Search employees with joined data"""
    sql = text("""
        SELECT e.id, e.name, e.email, e.phone, e.status, e.startdate, 
               e.mgrid, m.name as manager_name,
               e.designationid, d.name as designation_name,
               e.personalemail, e.personalphone, e.dob, e.address, 
               e.city, e.state, e.country, e.zip, e.skypeid, e.salary, 
               e.commission, e.commissionrate, e.type, e.empagreementurl,
               e.offerletterurl, e.dlurl, e.workpermiturl, e.contracturl, 
               e.enddate, e.loginid, u.email as login_email,
               e.responsibilities, e.notes
        FROM employee e
        LEFT JOIN employee m ON e.mgrid = m.id
        LEFT JOIN designation d ON e.designationid = d.id
        LEFT JOIN uc_users u ON e.loginid = u.id
        WHERE e.name LIKE :query OR e.email LIKE :query OR e.phone LIKE :query
              OR e.skypeid LIKE :query OR e.id = :id_param
        ORDER BY e.name
        LIMIT :limit OFFSET :offset
    """)

    result = db.execute(sql, {
        'query': f"%{query}%",
        'id_param': query if query.isdigit() else -1,
        'limit': page_size,
        'offset': (page - 1) * page_size
    })

    count_sql = text("""
        SELECT COUNT(*) as total
        FROM employee
        WHERE name LIKE :query OR email LIKE :query OR phone LIKE :query
              OR skypeid LIKE :query OR id = :id_param
    """)
    total = db.execute(count_sql, {
        'query': f"%{query}%",
        'id_param': query if query.isdigit() else -1
    }).scalar()

    items = result.fetchall()

    results = []
    for index, row in enumerate(items, start=1):
        item_dict = dict(row._mapping)
        sanitized_data = sanitize_employee_data(item_dict)
        transformed_data = transform_employee_data(sanitized_data)
        result_item = {"si_no": (page - 1) * page_size + index}
        result_item.update(transformed_data)
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
    """Get employees with joined data"""
    base_query = """
        SELECT e.id, e.name, e.email, e.phone, e.status, e.startdate, 
               e.mgrid, m.name as manager_name,
               e.designationid, d.name as designation_name,
               e.personalemail, e.personalphone, e.dob, e.address, 
               e.city, e.state, e.country, e.zip, e.skypeid, e.salary, 
               e.commission, e.commissionrate, e.type, e.empagreementurl,
               e.offerletterurl, e.dlurl, e.workpermiturl, e.contracturl, 
               e.enddate, e.loginid, u.email as login_email,
               e.responsibilities, e.notes
        FROM employee e
        LEFT JOIN employee m ON e.mgrid = m.id
        LEFT JOIN designation d ON e.designationid = d.id
        LEFT JOIN uc_users u ON e.loginid = u.id
    """

    where_clauses = []
    params = {}

    if search:
        where_clauses.append("""
            (e.name LIKE :search OR e.email LIKE :search OR e.phone LIKE :search
             OR e.skypeid LIKE :search OR e.id = :id_param)
        """)
        params['search'] = f"%{search}%"
        params['id_param'] = search if search.isdigit() else -1

    if filters:
        if "status" in filters and filters["status"]:
            where_clauses.append("e.status = :status")
            params['status'] = filters["status"]
        if "type" in filters and filters["type"]:
            where_clauses.append("e.type = :type")
            params['type'] = filters["type"]
        if "startdate" in filters:
            if "gte" in filters["startdate"] and filters["startdate"]["gte"]:
                where_clauses.append("e.startdate >= :start_date_gte")
                params['start_date_gte'] = filters["startdate"]["gte"]
            if "lte" in filters["startdate"] and filters["startdate"]["lte"]:
                where_clauses.append("e.startdate <= :start_date_lte")
                params['start_date_lte'] = filters["startdate"]["lte"]

    where_clause = " AND ".join(where_clauses) if where_clauses else "1=1"
    
    # Handle sorting
    sort_column = "e." + sort_field if sort_field in ["name", "email", "phone", "status", "startdate", "type"] else sort_field
    if sort_order.lower() == "desc":
        order_clause = f"{sort_column} DESC"
    else:
        order_clause = f"{sort_column} ASC"

    # Count query
    count_query = text(f"""
        SELECT COUNT(*) as total
        FROM employee e
        WHERE {where_clause}
    """)
    total = db.execute(count_query, params).scalar()

    # Data query
    data_query = text(f"""
        {base_query}
        WHERE {where_clause}
        ORDER BY {order_clause}
        LIMIT :limit OFFSET :offset
    """)
    params['limit'] = page_size
    params['offset'] = (page - 1) * page_size

    items = db.execute(data_query, params).fetchall()

    results = []
    for index, item in enumerate(items, start=1):
        item_dict = dict(item._mapping)
        sanitized_data = sanitize_employee_data(item_dict)
        transformed_data = transform_employee_data(sanitized_data)
        result_item = {
            "si_no": (page - 1) * page_size + index,
            **transformed_data
        }
        results.append(result_item)

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "items": results
    }

def create_employee(db: Session, employee: EmployeeCreate) -> Dict:
    """Create new employee with validation"""
    employee_data = employee.model_dump()
    sanitized_data = sanitize_employee_data(employee_data)

    # Validate foreign keys exist
    if sanitized_data.get('designationid'):
        designation = db.query(Designation).filter(Designation.id == sanitized_data['designationid']).first()
        if not designation:
            raise ValueError("Invalid designation ID")

    if sanitized_data.get('mgrid'):
        manager = db.query(Employee).filter(Employee.id == sanitized_data['mgrid']).first()
        if not manager:
            raise ValueError("Invalid manager ID")

    if sanitized_data.get('loginid'):
        user = db.query(UCUser).filter(UCUser.id == sanitized_data['loginid']).first()
        if not user:
            raise ValueError("Invalid login ID")

    db_employee = Employee(**sanitized_data)
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)

    # Return the created employee with joined data
    return get_employee(db, db_employee.id)

def update_employee(db: Session, employee_id: int, employee: EmployeeUpdate) -> Optional[Dict]:
    """Update employee with validation"""
    db_employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not db_employee:
        return None

    update_data = employee.model_dump(exclude_unset=True)
    sanitized_data = sanitize_employee_data(update_data)

    # Validate foreign keys exist
    if 'designationid' in sanitized_data and sanitized_data['designationid']:
        designation = db.query(Designation).filter(Designation.id == sanitized_data['designationid']).first()
        if not designation:
            raise ValueError("Invalid designation ID")

    if 'mgrid' in sanitized_data and sanitized_data['mgrid']:
        manager = db.query(Employee).filter(Employee.id == sanitized_data['mgrid']).first()
        if not manager:
            raise ValueError("Invalid manager ID")

    if 'loginid' in sanitized_data and sanitized_data['loginid']:
        user = db.query(UCUser).filter(UCUser.id == sanitized_data['loginid']).first()
        if not user:
            raise ValueError("Invalid login ID")

    for field, value in sanitized_data.items():
        setattr(db_employee, field, value)

    db.commit()
    db.refresh(db_employee)
    
    # Return the updated employee with joined data
    return get_employee(db, db_employee.id)

def delete_employee(db: Session, employee_id: int) -> bool:
    db_employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not db_employee:
        return False

    db.delete(db_employee)
    db.commit()
    return True

def get_employee_status_options(db: Session) -> List[str]:
    statuses = db.query(Employee.status).distinct().all()
    return [status[0] for status in statuses if status[0]]

def get_employee_type_options(db: Session) -> List[str]:
    types = db.query(Employee.type).distinct().all()
    return [type[0] for type in types if type[0]]

def get_manager_options(db: Session) -> List[Dict[str, str]]:
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