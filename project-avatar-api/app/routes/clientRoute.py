from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, Union, List
from sqlalchemy.orm import Session
from ..controllers.client_controller import ClientController
from ..schemas import ClientResponse, ClientInDB, ClientCreate, ClientUpdate, ClientDeleteResponse, ClientSearchBase
from ..database.db import get_db

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
async def get_client(client_id: Union[int, str], controller: ClientController = Depends()):
    # Handle special case for "search" string
    if client_id == "search":
        raise HTTPException(status_code=400, detail="Use the /client/search endpoint for search operations")
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

# search client by general term
@router.get("/client/search", response_model=ClientResponse)
async def search_client(search: str, controller: ClientController = Depends()):
    return await controller.search_client(search)

# search client by specific parameters
@router.get("/client/search/advanced", response_model=List[ClientInDB])
async def search_clients_by_params(
    companyname: Optional[str] = None,
    email: Optional[str] = None,
    phone: Optional[str] = None,
    status: Optional[str] = None,
    url: Optional[str] = None,
    fax: Optional[str] = None,
    address: Optional[str] = None,
    city: Optional[str] = None,
    state: Optional[str] = None,
    country: Optional[str] = None,
    zip: Optional[str] = None,
    twitter: Optional[str] = None,
    facebook: Optional[str] = None,
    linkedin: Optional[str] = None,
    manager1name: Optional[str] = None,
    manager1email: Optional[str] = None,
    manager1phone: Optional[str] = None,
    hmname: Optional[str] = None,
    hmemail: Optional[str] = None,
    hmphone: Optional[str] = None,
    hrname: Optional[str] = None,
    hremail: Optional[str] = None,
    hrphone: Optional[str] = None,
    notes: Optional[str] = None,
    db: Session = Depends(get_db),
    controller: ClientController = Depends()
):
    search_params = ClientSearchBase(
        companyname=companyname,
        email=email,
        phone=phone,
        status=status,
        url=url,
        fax=fax,
        address=address,
        city=city,
        state=state,
        country=country,
        zip=zip,
        twitter=twitter,
        facebook=facebook,
        linkedin=linkedin,
        manager1name=manager1name,
        manager1email=manager1email,
        manager1phone=manager1phone,
        hmname=hmname,
        hmemail=hmemail,
        hmphone=hmphone,
        hrname=hrname,
        hremail=hremail,
        hrphone=hrphone,
        notes=notes
    )
    return await controller.search_clients_by_params(db, search_params)
