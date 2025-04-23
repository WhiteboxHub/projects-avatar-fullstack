from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, asc, text
from datetime import date

from app.database.db import get_db
from app.models import Placement as PlacementModel, Candidate, Vendor, Client, Employee, Recruiter
from app.schemas import (
    PlacementCreate, 
    PlacementUpdate, 
    PlacementInDB, 
    PlacementResponse, 
    PlacementFilter,
    PlacementSelectOptions,
    SelectOption
)

class CandidPlacementController:
    @staticmethod
    async def create_placement(
        placement: PlacementCreate,
        db: Session = Depends(get_db)
    ) -> PlacementInDB:
        """Create a new placement record"""
        db_placement = PlacementModel(**placement.dict(exclude_unset=True))
        db.add(db_placement)
        db.commit()
        db.refresh(db_placement)
        return db_placement

    @staticmethod
    async def get_placement(
        placement_id: int,
        db: Session = Depends(get_db)
    ) -> PlacementInDB:
        """Get a specific placement by ID"""
        db_placement = db.query(PlacementModel).filter(PlacementModel.id == placement_id).first()
        if not db_placement:
            raise HTTPException(status_code=404, detail=f"Placement with ID {placement_id} not found")
        return db_placement

    @staticmethod
    async def update_placement(
        placement_id: int,
        placement: PlacementUpdate,
        db: Session = Depends(get_db)
    ) -> PlacementInDB:
        """Update an existing placement record"""
        db_placement = db.query(PlacementModel).filter(PlacementModel.id == placement_id).first()
        if not db_placement:
            raise HTTPException(status_code=404, detail=f"Placement with ID {placement_id} not found")
        
        update_data = placement.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_placement, key, value)
        
        db.commit()
        db.refresh(db_placement)
        return db_placement

    @staticmethod
    async def delete_placement(
        placement_id: int,
        db: Session = Depends(get_db)
    ) -> Dict[str, Any]:
        """Delete a placement record"""
        db_placement = db.query(PlacementModel).filter(PlacementModel.id == placement_id).first()
        if not db_placement:
            raise HTTPException(status_code=404, detail=f"Placement with ID {placement_id} not found")
        
        db.delete(db_placement)
        db.commit()
        return {"message": f"Placement with ID {placement_id} deleted successfully"}

    @staticmethod
    async def get_placements(
        filter_params: PlacementFilter = Depends(),
        db: Session = Depends(get_db)
    ) -> PlacementResponse:
        """Get a list of placements with pagination and filtering"""
        query = db.query(PlacementModel).select_from(PlacementModel)
        
        # Apply filters if provided
        if filter_params.filters:
            for field, value in filter_params.filters.items():
                if value is not None and hasattr(PlacementModel, field):
                    if isinstance(value, str) and value.strip():
                        query = query.filter(getattr(PlacementModel, field).ilike(f"%{value}%"))
                    elif value:
                        query = query.filter(getattr(PlacementModel, field) == value)
        
        # Get total count for pagination
        total_count = query.count()
        
        # Apply sorting
        if filter_params.sidx and hasattr(PlacementModel, filter_params.sidx):
            sort_column = getattr(PlacementModel, filter_params.sidx)
            if filter_params.sord.lower() == "desc":
                query = query.order_by(desc(sort_column))
            else:
                query = query.order_by(asc(sort_column))
        else:
            # Default sorting by startdate desc
            query = query.order_by(desc(PlacementModel.startdate))
        
        # Apply pagination
        page = max(1, filter_params.page)  # Ensure page is at least 1
        page_size = max(1, filter_params.rows)  # Ensure page_size is at least 1
        
        # Calculate total pages
        total_pages = (total_count + page_size - 1) // page_size if total_count > 0 else 0
        
        # Adjust page if it exceeds total pages
        if total_pages > 0 and page > total_pages:
            page = total_pages
            
        # Calculate offset
        offset = (page - 1) * page_size
        
        # Apply pagination to query
        query = query.offset(offset).limit(page_size)
        
        # Execute query
        placements = query.all()
        
        return PlacementResponse(
            data=placements,
            total=total_count,
            page=page,
            page_size=page_size,
            pages=total_pages
        )

    @staticmethod
    async def get_all_placements(
        db: Session = Depends(get_db)
    ) -> List[PlacementModel]:
        """Get all placement records without pagination"""
        query = db.query(PlacementModel).order_by(desc(PlacementModel.startdate))
        return query.all()

    @staticmethod
    async def get_select_options(
        db: Session = Depends(get_db)
    ) -> PlacementSelectOptions:
        """Get all select options for placement form dropdowns"""
        
        # Get candidates
        candidates = db.query(Candidate.candidateid, Candidate.name).order_by(Candidate.name).all()
        candidate_options = [SelectOption(id=str(c.candidateid), name=c.name or "") for c in candidates]
        
        # Get managers (employees)
        managers = db.query(Employee.id, Employee.name).order_by(Employee.name).all()
        manager_options = [SelectOption(id=str(m.id), name=m.name or "") for m in managers]
        
        # Get recruiters with vendor names
        recruiters_query = """
        SELECT r.id, CONCAT(r.name, '-', v.companyname) as name 
        FROM recruiter r 
        JOIN vendor v ON r.vendorid = v.id 
        ORDER BY name
        """
        recruiters = db.execute(text(recruiters_query)).fetchall()
        recruiter_options = [SelectOption(id=str(r.id), name=r.name or "") for r in recruiters]
        
        # Get vendors
        vendors = db.query(Vendor.id, Vendor.companyname).order_by(Vendor.companyname).all()
        vendor_options = [SelectOption(id=str(v.id), name=v.companyname or "") for v in vendors]
        
        # Get clients
        clients = db.query(Client.id, Client.companyname).order_by(Client.companyname).all()
        client_options = [SelectOption(id=str(c.id), name=c.companyname or "") for c in clients]
        
        # Status options - matching the PHP placementstatus array
        status_options = [
            SelectOption(id="Active", name="Active"),
            SelectOption(id="Inactive", name="Inactive"),
            SelectOption(id="Pending", name="Pending"),
            SelectOption(id="Completed", name="Completed")
        ]
        
        # Yes/No options - matching the PHP yesno array
        yesno_options = [
            SelectOption(id="Yes", name="Yes"),
            SelectOption(id="No", name="No")
        ]
        
        # Feedback options (assuming there's a feedback table)
        feedback_options = []
        try:
            feedback_query = "SELECT id, name FROM feedback ORDER BY name"
            feedbacks = db.execute(text(feedback_query)).fetchall()
            feedback_options = [SelectOption(id=str(f.id), name=f.name or "") for f in feedbacks]
        except:
            # If feedback table doesn't exist or has different structure
            pass
        
        return PlacementSelectOptions(
            candidates=candidate_options,
            managers=manager_options,
            recruiters=recruiter_options,
            vendors=vendor_options,
            clients=client_options,
            statuses=status_options,
            yesno=yesno_options,
            feedbacks=feedback_options
        )