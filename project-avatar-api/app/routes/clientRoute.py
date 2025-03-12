# # app/routes/client_routes.py
# from fastapi import APIRouter, Depends
# from typing import Optional
# from ..controllers.client_controller import ClientController
# from ..schemas import ClientCreate, ClientUpdate, ClientInDB, ClientResponse
# from ..models import ClientStatus, ClientTier

# router = APIRouter(
#     prefix="/api/clients",
#     tags=["clients"]
# )

# @router.get("/", response_model=ClientResponse)
# async def get_clients(
#     page: int = 1,
#     page_size: int = 10,
#     search: Optional[str] = None,
#     status: Optional[ClientStatus] = None,
#     tier: Optional[ClientTier] = None,
#     sort_field: Optional[str] = "company_name",
#     sort_order: Optional[str] = "asc",
#     controller: ClientController = Depends()
# ):
#     return await controller.get_clients(
#         page=page,
#         page_size=page_size,
#         search=search,
#         status=status,
#         tier=tier,
#         sort_field=sort_field,
#         sort_order=sort_order
#     )

# @router.post("/", response_model=ClientInDB)
# async def create_client(
#     client: ClientCreate,
#     controller: ClientController = Depends()
# ):
#     return await controller.create_client(client)

# @router.get("/{client_id}", response_model=ClientInDB)
# async def get_client(
#     client_id: int,
#     controller: ClientController = Depends()
# ):
#     return await controller.get_client(client_id)

# @router.put("/{client_id}", response_model=ClientInDB)
# async def update_client(
#     client_id: int,
#     client: ClientUpdate,
#     controller: ClientController = Depends()
# ):
#     return await controller.update_client(client_id, client)

# @router.delete("/{client_id}")
# async def delete_client(
#     client_id: int,
#     controller: ClientController = Depends()
# ):
#     return await controller.delete_client(client_id)

# @router.get("/autocomplete/{field}")
# async def autocomplete(
#     field: str,
#     query: str,
#     controller: ClientController = Depends()
# ):
#     return await controller.autocomplete(field, query)


# app/routes/client_routes.py
from fastapi import APIRouter, Depends
from typing import Optional
from ..controllers.client_controller import ClientController
from ..schemas import ClientResponse, ClientInDB

router = APIRouter(prefix="/api/clients", tags=["clients"])

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
