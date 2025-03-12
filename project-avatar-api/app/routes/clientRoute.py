from fastapi import APIRouter, Depends
from typing import Optional
from ..controllers.client_controller import ClientController
from ..schemas import ClientResponse, ClientInDB, ClientCreate, ClientUpdate, ClientDeleteResponse

router = APIRouter()

@router.get("/", response_model=ClientResponse)
async def get_clients(
    page: int = 1,
    page_size: int = 10,
    search: Optional[str] = None,
    controller: ClientController = Depends()
):
    return await controller.get_clients(page, page_size, search) 

@router.get("/{client_id}", response_model=ClientInDB)
async def get_client(client_id: int, controller: ClientController = Depends()):
    return await controller.get_client(client_id) 

# add client
@router.post("/", response_model=ClientInDB)
async def add_client(client_data: ClientCreate, controller: ClientController = Depends()):
    return await controller.add_client(client_data)

# edit client
@router.put("/{client_id}", response_model=ClientInDB)
async def edit_client(client_id: int, client_data: ClientUpdate, controller: ClientController = Depends()):
    return await controller.edit_client(client_id, client_data)

# delete client
@router.delete("/delete/{client_id}", response_model=ClientDeleteResponse)
async def delete_client(client_id: int, controller: ClientController = Depends()):
    return await controller.delete_client(client_id)

# search client
@router.get("/search", response_model=ClientResponse)
async def search_client(search: str, controller: ClientController = Depends()):
    return await controller.search_client(search)



