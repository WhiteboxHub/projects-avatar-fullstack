from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from app.database.db import get_db
from app.controllers.candid_placement_controller import CandidPlacementController
from app.schemas import (
    PlacementCreate,
    PlacementUpdate,
    PlacementInDB,
    PlacementResponse,
    PlacementFilter,
    PlacementSelectOptions
)

router = APIRouter()

# Get all placements with filtering, sorting, and pagination
@router.get("/candid/placements/getAll", response_model=PlacementResponse)
async def get_placements(
    filter_params: PlacementFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Get a paginated list of placements with optional filtering and sorting
    """
    return await CandidPlacementController.get_placements(filter_params, db)

# Get a specific placement by ID
@router.get("/candid/placements/{placement_id}", response_model=PlacementInDB)
async def get_placement(
    placement_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific placement by ID
    """
    return await CandidPlacementController.get_placement(placement_id, db)

# Create a new placement
@router.post("/candid/placements/create", response_model=PlacementInDB, status_code=201)
async def create_placement(
    placement: PlacementCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new placement
    """
    return await CandidPlacementController.create_placement(placement, db)

# Update an existing placement
@router.put("/candid/placements/update/{placement_id}", response_model=PlacementInDB)
async def update_placement(
    placement_id: int,
    placement: PlacementUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing placement
    """
    return await CandidPlacementController.update_placement(placement_id, placement, db)

# Delete a placement
@router.delete("/candid/placements/delete/{placement_id}")
async def delete_placement(
    placement_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a placement
    """
    return await CandidPlacementController.delete_placement(placement_id, db)

# Get all select options for placement form dropdowns
@router.get("/candid/placements/options/all", response_model=PlacementSelectOptions)
async def get_select_options(
    db: Session = Depends(get_db)
):
    """
    Get all select options for placement form dropdowns
    """
    return await CandidPlacementController.get_select_options(db)

# Get all placements without pagination
@router.get("/candid/placements/without/list/all", response_model=List[PlacementInDB])
async def get_all_placements(
    db: Session = Depends(get_db)
):
    """
    Get all placements without pagination
    """
    return await CandidPlacementController.get_all_placements(db)