# # app/routes/employee.py
# from fastapi import APIRouter, Depends, HTTPException, Query
# from typing import Optional, Dict, List
# from sqlalchemy.orm import Session
# from datetime import date
# from app.database.db import get_db
# from app.schemas import (
#     EmployeeInDB, 
#     EmployeeCreate, 
#     EmployeeUpdate, 
#     EmployeeResponse
# )
# from app.controllers.employeeController import (
#     get_employee,
#     get_employees,
#     create_employee,
#     update_employee,
#     delete_employee,
#     get_employee_status_options,
#     get_employee_type_options
# )

# router = APIRouter()

# @router.get("/employee", response_model=EmployeeResponse)
# def read_employees(
#     page: int = Query(1, ge=1),
#     page_size: int = Query(100, ge=1, le=100),
#     search: Optional[str] = Query(None),
#     sort_field: str = Query("name", description="Field to sort by"),
#     sort_order: str = Query("asc", description="Sort order (asc/desc)"),
#     status: Optional[str] = Query(None),
#     type: Optional[str] = Query(None),
#     start_date_from: Optional[date] = Query(None),
#     start_date_to: Optional[date] = Query(None),
#     db: Session = Depends(get_db)
# ):
#     filters = {}
#     if status:
#         filters["status"] = status
#     if type:
#         filters["type"] = type
#     if start_date_from or start_date_to:
#         filters["startdate"] = {"gte": start_date_from, "lte": start_date_to}
    
#     return get_employees(
#         db,
#         page=page,
#         page_size=page_size,
#         search=search,
#         sort_field=sort_field,
#         sort_order=sort_order,
#         filters=filters
#     )

# @router.get("/employee/{employee_id}", response_model=EmployeeInDB)
# def read_employee(employee_id: int, db: Session = Depends(get_db)):
#     employee = get_employee(db, employee_id)
#     if not employee:
#         raise HTTPException(status_code=404, detail="Employee not found")
#     return employee

# @router.post("/employee/create", response_model=EmployeeInDB)
# def create_new_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
#     return create_employee(db, employee)

# @router.put("/employee/update{employee_id}", response_model=EmployeeInDB)
# def update_existing_employee(
#     employee_id: int, 
#     employee: EmployeeUpdate, 
#     db: Session = Depends(get_db)
# ):
#     db_employee = update_employee(db, employee_id, employee)
#     if not db_employee:
#         raise HTTPException(status_code=404, detail="Employee not found")
#     return db_employee

# @router.delete("/employee/remove/{employee_id}")
# def remove_employee(employee_id: int, db: Session = Depends(get_db)):
#     if not delete_employee(db, employee_id):
#         raise HTTPException(status_code=404, detail="Employee not found")
#     return {"message": "Employee deleted successfully"}

# @router.get("/employee/options/status", response_model=List[str])
# def get_status_options(db: Session = Depends(get_db)):
#     return get_employee_status_options(db)

# @router.get("/employee/options/type", response_model=List[str])
# def get_type_options(db: Session = Depends(get_db)):
#     return get_employee_type_options(db)



from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, Dict, List
from sqlalchemy.orm import Session
from datetime import date
from app.database.db import get_db
from app.schemas import EmployeeInDB, EmployeeCreate, EmployeeUpdate
from app.controllers.employeeController import (
    get_employee,
    get_employees,
    create_employee,
    update_employee,
    delete_employee,
    get_employee_status_options,
    get_employee_type_options,
    search_employees,
    get_manager_options,
    get_designation_options,
    get_loginid_options
)

router = APIRouter()

@router.get("/employee", response_model=Dict)
def read_employees(
    page: int = Query(1, ge=1),
    page_size: int = Query(100, ge=1, le=100),
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
    
    return get_employees(
        db,
        page=page,
        page_size=page_size,
        search=search,
        sort_field=sort_field,
        sort_order=sort_order,
        filters=filters
    )

@router.get("/employee/search", response_model=Dict)
def search_employees_route(
    query: str = Query(..., description="Search term for name, ID, email, or phone"),
    page: int = Query(1, ge=1),
    page_size: int = Query(100, ge=1, le=200),
    db: Session = Depends(get_db)
):
    return search_employees(db, query=query, page=page, page_size=page_size)

@router.get("/employee/{employee_id}", response_model=EmployeeInDB)
def read_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = get_employee(db, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.post("/employee/create", response_model=EmployeeInDB)
def create_new_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    return create_employee(db, employee)

@router.put("/employee/update/{employee_id}", response_model=EmployeeInDB)
def update_existing_employee(
    employee_id: int, 
    employee: EmployeeUpdate, 
    db: Session = Depends(get_db)
):
    db_employee = update_employee(db, employee_id, employee)
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return db_employee

@router.delete("/employee/remove/{employee_id}")
def remove_employee(employee_id: int, db: Session = Depends(get_db)):
    if not delete_employee(db, employee_id):
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee deleted successfully"}

@router.get("/employee/options/status", response_model=List[str])
def get_status_options(db: Session = Depends(get_db)):
    return get_employee_status_options(db)

@router.get("/employee/options/type", response_model=List[str])
def get_type_options(db: Session = Depends(get_db)):
    return get_employee_type_options(db)

@router.get("/employee/options/managers", response_model=List[Dict[str, str]])
def get_manager_options(db: Session = Depends(get_db)):
    return get_manager_options(db)

@router.get("/employee/options/designations", response_model=List[Dict[str, str]])
def get_designation_options_route(db: Session = Depends(get_db)):  # Note the renamed function
    return get_designation_options(db)  # Now correctly calls the imported controller function

@router.get("/employee/options/loginids", response_model=List[Dict[str, str]])
def get_loginid_options_route(db: Session = Depends(get_db)):
    return get_loginid_options(db)  # Calls the imported controller function