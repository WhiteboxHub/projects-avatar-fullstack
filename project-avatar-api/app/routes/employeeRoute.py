# app/routes/employee.py
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, Dict, List
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.schemas import EmployeeInDB, EmployeeCreate, EmployeeUpdate
from app.controllers.employeeController import get_employee, get_employees 
from datetime import date

router = APIRouter()

@router.get("/employees", response_model=Dict)
def get_employees(
    page: int = Query(1, ge=1),
    page_size: int = Query(100, ge=1, le=200),
    search: Optional[str] = Query(None),
    sort_field: str = Query("name", description="Field to sort by"),
    sort_order: str = Query("asc", description="Sort order (asc/desc)"),
    status: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    start_date_from: Optional[date] = Query(None),
    start_date_to: Optional[date] = Query(None),
    db: Session = Depends(get_db)
):
    filters = {}
    if status:
        filters["status"] = status
    if type:
        filters["type"] = type
    if start_date_from or start_date_to:
        filters["startdate"] = {"gte": start_date_from, "lte": start_date_to}
    
    return employee_controller.get_employees(
        db,
        page=page,
        page_size=page_size,
        search=search,
        sort_field=sort_field,
        sort_order=sort_order,
        filters=filters
    )

@router.get("/employees/{employee_id}", response_model=EmployeeInDB)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    return employee_controller.get_employee(db, employee_id)

@router.post("/", response_model=EmployeeInDB)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    return employee_controller.create_employee(db, employee)

@router.put("/employees/{employee_id}", response_model=EmployeeInDB)
def update_employee(
    employee_id: int, 
    employee: EmployeeUpdate, 
    db: Session = Depends(get_db)
):
    return employee_controller.update_employee(db, employee_id, employee)

@router.delete("/employees/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    if employee_controller.delete_employee(db, employee_id):
        return {"message": "Employee deleted successfully"}
    raise HTTPException(status_code=400, detail="Failed to delete employee")

@router.get("/employees/options/status", response_model=List[str])
def get_status_options(db: Session = Depends(get_db)):
    return employee_controller.get_employee_status_options(db)

@router.get("/employees/options/type", response_model=List[str])
def get_type_options(db: Session = Depends(get_db)):
    return employee_controller.get_employee_type_options(db)