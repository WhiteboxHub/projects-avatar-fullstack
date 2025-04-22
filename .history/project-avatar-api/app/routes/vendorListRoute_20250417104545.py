from fastapi import APIRouter, Depends
from typing import Optional
from ..controllers.v import VendorController
from ..schemas import VendorResponse, VendorInDB, VendorCreate, VendorUpdate, VendorDeleteResponse, VendorSearchBase

router = APIRouter()

@router.get("/vendor/get", response_model=VendorResponse)
async def get_vendors(
    page: int = 1,
    page_size: int = 100,
    search: Optional[str] = None,
    controller: VendorController = Depends()
):
    return await controller.get_vendors(page, page_size, search)

@router.get("/vendor/{vendor_id}", response_model=VendorInDB)
async def get_vendor(vendor_id: int, controller: VendorController = Depends()):
    return await controller.get_vendor(vendor_id)

@router.post("/vendor/add", response_model=VendorInDB)
async def add_vendor(vendor_data: VendorCreate, controller: VendorController = Depends()):
    return await controller.add_vendor(vendor_data)

@router.put("/vendor/edit/{vendor_id}", response_model=VendorInDB)
async def edit_vendor(vendor_id: int, vendor_data: VendorUpdate, controller: VendorController = Depends()):
    return await controller.edit_vendor(vendor_id, vendor_data)

@router.delete("/vendor/delete/{vendor_id}", response_model=VendorDeleteResponse)
async def delete_vendor(vendor_id: int, controller: VendorController = Depends()):
    return await controller.delete_vendor(vendor_id)

@router.get("/vendor/search", response_model=VendorResponse)
async def search_vendor(search: Optional[str] = None, page: int = 1, page_size: int = 100, controller: VendorController = Depends()):
    search_base = VendorSearchBase(companyname=search)
    return await controller.search_vendor(search_base)
