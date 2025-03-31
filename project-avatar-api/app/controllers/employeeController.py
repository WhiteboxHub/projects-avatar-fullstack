# app/controllers/employee_controller.py
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from datetime import date
from fastapi import HTTPException
from app.models import Employee
from app.schemas import EmployeeCreate, EmployeeUpdate, EmployeeInDB
from typing import List, Dict, Optional

def get_employees(
    db: Session,
    page: int = 1,
    page_size: int = 100,
    search: Optional[str] = None,
    sort_field: str = "name",
    sort_order: str = "asc",
    filters: Optional[Dict] = None
) -> Dict:
    query = db.query(Employee)
    
    # Apply search
    if search:
        search = f"%{search}%"
        query = query.filter(
            or_(
                Employee.name.ilike(search),
                Employee.email.ilike(search),
                Employee.phone.ilike(search),
                Employee.personalemail.ilike(search),
                Employee.skypeid.ilike(search)
            )
        )
    
    # Apply filters
    if filters:
        filter_conditions = []
        for field, value in filters.items():
            if value and hasattr(Employee, field):
                if field in ["startdate", "enddate", "dob"]:
                    filter_conditions.append(getattr(Employee, field) == value)
                else:
                    filter_conditions.append(getattr(Employee, field).ilike(f"%{value}%"))
        if filter_conditions:
            query = query.filter(and_(*filter_conditions))
    
    # Apply sorting
    if hasattr(Employee, sort_field):
        if sort_order.lower() == "desc":
            query = query.order_by(getattr(Employee, sort_field).desc())
        else:
            query = query.order_by(getattr(Employee, sort_field).asc())
    
    # Pagination
    total = query.count()
    employees = query.offset((page - 1) * page_size).limit(page_size).all()
    
    return {
        "data": employees,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }

def get_employee(db: Session, employee_id: int) -> Employee:
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

def create_employee(db: Session, employee: EmployeeCreate) -> Employee:
    db_employee = Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def update_employee(db: Session, employee_id: int, employee: EmployeeUpdate) -> Employee:
    db_employee = get_employee(db, employee_id)
    for key, value in employee.dict(exclude_unset=True).items():
        setattr(db_employee, key, value)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def delete_employee(db: Session, employee_id: int) -> bool:
    db_employee = get_employee(db, employee_id)
    db.delete(db_employee)
    db.commit()
    return True

def get_employee_status_options(db: Session) -> List[str]:
    return db.query(Employee.status).distinct().all()

def get_employee_type_options(db: Session) -> List[str]:
    return db.query(Employee.type).distinct().all()