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
                    Client.companyname.ilike(f"%{search}%"),
                    Client.email.ilike(f"%{search}%"),
                    Client.city.ilike(f"%{search}%")
                )
            )

        total_query = query  # Preserve original query for count
        total = total_query.count()

        query = query.offset((page - 1) * page_size).limit(page_size)

        # Convert ORM objects to Pydantic models
        clients = [ClientInDB.from_orm(client) for client in query.all()]

        return {
            "data": clients,
            "total": total,
            "page": page,
            "page_size": page_size,
            "pages": (total + page_size - 1) // page_size,
        }

    async def get_client(self, client_id: int):
        client = self.db.query(Client).filter(Client.id == client_id).first()
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
        return client


# add client 
 
    async def add_client(self, client_data: ClientCreate):
        new_client = Client(**client_data.dict())
        self.db.add(new_client)
        self.db.commit()
        self.db.refresh(new_client)
        return ClientInDB.from_orm(new_client)

# edit client

    async def edit_client(self, client_id: int, client_data: ClientUpdate):
        client = self.db.query(Client).filter(Client.id == client_id).first()
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")

        for key, value in client_data.dict(exclude_unset=True).items():
            setattr(client, key, value)

        self.db.commit()
        self.db.refresh(client)
        return ClientInDB.from_orm(client)
    
    # delete client

    async def delete_client(self, client_id: int):
        client = self.db.query(Client).filter(Client.id == client_id).first()
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")

        self.db.delete(client)
        self.db.commit()
        return {"message": "Client deleted successfully"}

