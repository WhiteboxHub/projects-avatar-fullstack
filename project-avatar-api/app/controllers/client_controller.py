from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional, List
from ..models import Client
from ..schemas import ClientCreate, ClientUpdate, ClientInDB, ClientResponse, ClientDeleteResponse, ClientSearchBase
from ..database.db import get_db


class ClientController:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    async def get_clients(self, page: int, page_size: int, search: Optional[str] = None):
        """
        Get paginated list of clients with optional search functionality.
        Similar to the PHP grid's SelectCommand functionality.
        """
        query = self.db.query(Client.id, Client.companyname, Client.email, Client.phone, Client.status,
                               Client.url, Client.fax, Client.address, Client.city, Client.state,
                               Client.country, Client.twitter, Client.linkedin, Client.facebook,
                               Client.zip, Client.manager1name, Client.manager1email,
                               Client.manager1phone, Client.hmname, Client.hmemail,
                               Client.hmphone, Client.hrname, Client.hremail, Client.hrphone,
                               Client.notes)

        if search:
            search_base = ClientSearchBase(companyname=search)
            query = query.filter(
                or_(
                    Client.companyname.ilike(f"%{search_base.companyname}%"),
                    Client.email.ilike(f"%{search}%"),
                    Client.phone.ilike(f"%{search}%"),
                    Client.city.ilike(f"%{search}%"),
                    Client.state.ilike(f"%{search}%"),
                    Client.country.ilike(f"%{search}%"),
                    Client.zip.ilike(f"%{search}%"),
                    Client.manager1name.ilike(f"%{search}%"),
                    Client.manager1email.ilike(f"%{search}%"),
                    Client.manager1phone.ilike(f"%{search}%"),
                    Client.hmname.ilike(f"%{search}%"),
                    Client.hmemail.ilike(f"%{search}%"),
                    Client.hmphone.ilike(f"%{search}%"),
                    Client.hrname.ilike(f"%{search}%"),
                    Client.hremail.ilike(f"%{search}%"),
                    Client.hrphone.ilike(f"%{search}%"),
                    Client.notes.ilike(f"%{search}%")
                )
            )

        # Get total count for pagination
        total = query.count()

        # Apply pagination
        query = query.order_by(Client.companyname.asc())
        query = query.offset((page - 1) * page_size).limit(page_size)

        # Convert ORM objects to Pydantic models
        clients = [ClientInDB.from_orm(client) for client in query.all()]

        # Return response with pagination info
        return ClientResponse(
            data=clients,
            total=total,
            page=page,
            page_size=page_size,
            pages=(total + page_size - 1) // page_size,
        )

    async def get_client(self, client_id: int) -> ClientInDB:
        """
        Get a single client by ID.
        Similar to the PHP grid's view functionality.
        """
        client = self.db.query(Client).filter(Client.id == client_id).first()
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
        return ClientInDB.from_orm(client)

    async def add_client(self, client_data: ClientCreate) -> ClientInDB:
        """
        Add a new client.
        Similar to the PHP grid's add functionality.
        """
        client_dict = client_data.dict()
        if "companyname" in client_dict:
            client_dict["companyname"] = client_dict["companyname"].upper()
        if "email" in client_dict:
            client_dict["email"] = client_dict["email"].lower()
        if "url" in client_dict and client_dict["url"]:
            client_dict["url"] = client_dict["url"].lower()

        new_client = Client(**client_dict)
        self.db.add(new_client)
        self.db.commit()
        self.db.refresh(new_client)
        return ClientInDB.from_orm(new_client)

    async def edit_client(self, client_id: int, client_data: ClientUpdate) -> ClientInDB:
        """
        Update an existing client.
        Similar to the PHP grid's edit functionality.
        """
        client = self.db.query(Client).filter(Client.id == client_id).first()
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")

        update_data = client_data.dict(exclude_unset=True)
        
        if "companyname" in update_data:
            update_data["companyname"] = update_data["companyname"].upper()
        if "email" in update_data:
            update_data["email"] = update_data["email"].lower()
        if "url" in update_data and update_data["url"]:
            update_data["url"] = update_data["url"].lower()

        for key, value in update_data.items():
            setattr(client, key, value)

        self.db.commit()
        self.db.refresh(client)
        return ClientInDB.from_orm(client)
    
    async def delete_client(self, client_id: int) -> ClientDeleteResponse:
        """
        Delete a client by ID.
        Similar to the PHP grid's delete functionality.
        """
        client = self.db.query(Client).filter(Client.id == client_id).first()
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")

        self.db.delete(client)
        self.db.commit()
        return ClientDeleteResponse(message="Client deleted successfully", client_id=client_id)
    
    async def search_client(self, search: str) -> ClientResponse:
        """
        Search for clients by various fields.
        Similar to the PHP grid's search functionality.
        """
        query = self.db.query(Client).filter(
            or_(
                Client.companyname.ilike(f"%{search}%"),
                Client.email.ilike(f"%{search}%"),
                Client.phone.ilike(f"%{search}%"),
                Client.city.ilike(f"%{search}%"),
                Client.state.ilike(f"%{search}%"),
                Client.country.ilike(f"%{search}%"),
                Client.zip.ilike(f"%{search}%"),
                Client.manager1name.ilike(f"%{search}%"),
                Client.manager1email.ilike(f"%{search}%"),
                Client.manager1phone.ilike(f"%{search}%"),
                Client.hmname.ilike(f"%{search}%"),
                Client.hmemail.ilike(f"%{search}%"),
                Client.hmphone.ilike(f"%{search}%"),
                Client.hrname.ilike(f"%{search}%"),
                Client.hremail.ilike(f"%{search}%"),
                Client.hrphone.ilike(f"%{search}%"),
                Client.notes.ilike(f"%{search}%")
            )
        )
        
        total = query.count()
        clients = [ClientInDB.from_orm(client) for client in query.all()]
        
        return ClientResponse(
            data=clients,
            total=total,
            page=1,
            page_size=total,
            pages=1
        )
