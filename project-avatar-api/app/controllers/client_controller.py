# # app/controllers/client_controller.py
# from fastapi import Depends, HTTPException
# from sqlalchemy.orm import Session
# from sqlalchemy import or_
# from typing import Optional, List
# from ..schemas import  ClientStatus, ClientTier
# from ..schemas import ClientCreate, ClientUpdate, ClientInDB
# from ..database.db import get_db

# class ClientController:
#     def __init__(self, db: Session = Depends(get_db)):
#         self.db = db

#     async def get_clients(
#         self,
#         page: int,
#         page_size: int,
#         search: Optional[str] = None,
#         status: Optional[ClientStatus] = None,
#         tier: Optional[ClientTier] = None,
#         sort_field: str = "company_name",
#         sort_order: str = "asc"
#     ):
#         query = self.db.query(Client)

#         # Apply search filter
#         if search:
#             search_filter = or_(
#                 Client.company_name.ilike(f"%{search}%"),
#                 Client.email.ilike(f"%{search}%"),
#                 Client.city.ilike(f"%{search}%"),
#                 Client.state.ilike(f"%{search}%"),
#                 Client.country.ilike(f"%{search}%")
#             )
#             query = query.filter(search_filter)

#         # Apply filters
#         if status:
#             query = query.filter(Client.status == status)
#         if tier:
#             query = query.filter(Client.tier == tier)

#         # Get total count
#         total = query.count()

#         # Apply sorting
#         if hasattr(Client, sort_field):
#             order_by = getattr(Client, sort_field)
#             if sort_order == "desc":
#                 order_by = order_by.desc()
#             query = query.order_by(order_by)

#         # Apply pagination
#         query = query.offset((page - 1) * page_size).limit(page_size)

#         return {
#             "data": query.all(),
#             "total": total,
#             "page": page,
#             "page_size": page_size,
#             "pages": (total + page_size - 1) // page_size
#         }

#     async def create_client(self, client: ClientCreate):
#         # Check if email exists
#         if self.db.query(Client).filter(Client.email == client.email).first():
#             raise HTTPException(status_code=400, detail="Email already registered")

#         # Check if company name exists
#         if self.db.query(Client).filter(Client.company_name == client.company_name).first():
#             raise HTTPException(status_code=400, detail="Company name already exists")

#         db_client = Client(**client.dict())
#         self.db.add(db_client)
        
#         try:
#             self.db.commit()
#             self.db.refresh(db_client)
#         except Exception as e:
#             self.db.rollback()
#             raise HTTPException(status_code=400, detail=str(e))
            
#         return db_client

#     async def get_client(self, client_id: int):
#         client = self.db.query(Client).filter(Client.id == client_id).first()
#         if not client:
#             raise HTTPException(status_code=404, detail="Client not found")
#         return client

#     async def update_client(self, client_id: int, client: ClientUpdate):
#         db_client = self.db.query(Client).filter(Client.id == client_id).first()
#         if not db_client:
#             raise HTTPException(status_code=404, detail="Client not found")

#         update_data = client.dict(exclude_unset=True)
        
#         # Check email uniqueness
#         if "email" in update_data and update_data["email"] != db_client.email:
#             if self.db.query(Client).filter(Client.email == update_data["email"]).first():
#                 raise HTTPException(status_code=400, detail="Email already registered")

#         # Check company name uniqueness
#         if "company_name" in update_data and update_data["company_name"] != db_client.company_name:
#             if self.db.query(Client).filter(Client.company_name == update_data["company_name"]).first():
#                 raise HTTPException(status_code=400, detail="Company name already exists")

#         for field, value in update_data.items():
#             setattr(db_client, field, value)

#         try:
#             self.db.commit()
#             self.db.refresh(db_client)
#         except Exception as e:
#             self.db.rollback()
#             raise HTTPException(status_code=400, detail=str(e))
            
#         return db_client

#     async def delete_client(self, client_id: int):
#         client = self.db.query(Client).filter(Client.id == client_id).first()
#         if not client:
#             raise HTTPException(status_code=404, detail="Client not found")

#         try:
#             self.db.delete(client)
#             self.db.commit()
#         except Exception as e:
#             self.db.rollback()
#             raise HTTPException(status_code=400, detail=str(e))

#         return {"message": "Client deleted successfully"}

#     async def autocomplete(self, field: str, query: str):
#         valid_fields = ["city", "state", "country"]
#         if field not in valid_fields:
#             raise HTTPException(status_code=400, detail="Invalid field for autocomplete")

#         column = getattr(Client, field)
#         results = (
#             self.db.query(column)
#             .filter(column.ilike(f"%{query}%"))
#             .distinct()
#             .limit(10)
#             .all()
#         )
        
#         return [{"value": result[0]} for result in results if result[0]]


# app/controllers/client_controller.py
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional
from ..models import Client
from ..schemas import ClientCreate, ClientUpdate, ClientInDB
from ..database.db import get_db

class ClientController:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    async def get_clients(self, page: int, page_size: int, search: Optional[str] = None):
        query = self.db.query(Client)

        if search:
            query = query.filter(
                or_(
                    Client.company_name.ilike(f"%{search}%"),
                    Client.email.ilike(f"%{search}%"),
                    Client.city.ilike(f"%{search}%")
                )
            )

        total = query.count()
        query = query.offset((page - 1) * page_size).limit(page_size)

        return {"data": query.all(), "total": total, "page": page, "page_size": page_size, "pages": (total + page_size - 1) // page_size}

    async def get_client(self, client_id: int):
        client = self.db.query(Client).filter(Client.id == client_id).first()
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
        return client
