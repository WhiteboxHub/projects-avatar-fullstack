from fastapi import APIRouter, Depends
from typing import Optional
from ..controllers.client_controller import ClientController
from ..schemas import ClientResponse, ClientInDB, ClientCreate, ClientUpdate, ClientDeleteResponse, ClientSearchBase

router = APIRouter()

@router.get("/client/get", response_model=ClientResponse)
async def get_clients(
    page: int = 1,
    page_size: int = 100,
    search: Optional[str] = None,
    controller: ClientController = Depends()
):
    return await controller.get_clients(page, page_size, search) 

@router.get("/client/{client_id}", response_model=ClientInDB)
async def get_client(client_id: int, controller: ClientController = Depends()):
    return await controller.get_client(client_id) 

# add client
@router.post("/client/add", response_model=ClientInDB)
async def add_client(client_data: ClientCreate, controller: ClientController = Depends()):
    return await controller.add_client(client_data)

# edit client
@router.put("/client/edit/{client_id}", response_model=ClientInDB)
async def edit_client(client_id: int, client_data: ClientUpdate, controller: ClientController = Depends()):
    return await controller.edit_client(client_id, client_data)

# delete client
@router.delete("/client/delete/{client_id}", response_model=ClientDeleteResponse)
async def delete_client(client_id: int, controller: ClientController = Depends()):
    return await controller.delete_client(client_id)

# search client
@router.get("/client/search", response_model=ClientResponse)
async def search_client(search: Optional[str] = None, page: int = 1, page_size: int = 100, controller: ClientController = Depends()):
    search_base = ClientSearchBase(companyname=search)
    return await controller.search_client(search_base)  # Updated to call the correct method for searching
