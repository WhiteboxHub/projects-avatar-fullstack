from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional, List, Union
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
        # Base query matching the PHP SelectCommand
        query = self.db.query(Client.id, Client.companyname, Client.email, Client.phone, Client.status,
                               Client.url, Client.fax, Client.address, Client.city, Client.state,
                               Client.country, Client.twitter, Client.linkedin, Client.facebook,
                               Client.zip, Client.manager1name, Client.manager1email,
                               Client.manager1phone, Client.hmname, Client.hmemail,
                               Client.hmphone, Client.hrname, Client.hremail, Client.hrphone,
                               Client.notes)

        # Apply search filter if provided
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    Client.companyname.ilike(search_term),
                    Client.email.ilike(search_term),
                    Client.phone.ilike(search_term),
                    Client.status.ilike(search_term),
                    Client.url.ilike(search_term),
                    Client.fax.ilike(search_term),
                    Client.address.ilike(search_term),
                    Client.city.ilike(search_term),
                    Client.state.ilike(search_term),
                    Client.country.ilike(search_term),
                    Client.zip.ilike(search_term),
                    Client.twitter.ilike(search_term),
                    Client.facebook.ilike(search_term),
                    Client.linkedin.ilike(search_term),
                    Client.manager1name.ilike(search_term),
                    Client.manager1email.ilike(search_term),
                    Client.manager1phone.ilike(search_term),
                    Client.hmname.ilike(search_term),
                    Client.hmemail.ilike(search_term),
                    Client.hmphone.ilike(search_term),
                    Client.hrname.ilike(search_term),
                    Client.hremail.ilike(search_term),
                    Client.hrphone.ilike(search_term),
                    Client.notes.ilike(search_term)
                )
            )

        # Get total count for pagination
        total = query.count()

        # Apply sorting and pagination (matching PHP grid's default sort by companyname asc)
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

    async def get_client(self, client_id: Union[int, str]) -> ClientInDB:
        """
        Get a single client by ID.
        Similar to the PHP grid's view functionality.
        
        If client_id is "search", it will be handled by the router to redirect to search endpoint.
        """
        # The error occurs because the route parameter expects an integer but receives "search"
        # This should be handled at the router level, not here
        try:
            client_id_int = int(client_id)
            client = self.db.query(Client).filter(Client.id == client_id_int).first()
            if not client:
                raise HTTPException(status_code=404, detail="Client not found")
            return ClientInDB.from_orm(client)
        except ValueError:
            # This should not happen if the router is configured correctly
            raise HTTPException(status_code=400, detail="Invalid client ID format")

    async def add_client(self, client_data: ClientCreate) -> ClientInDB:
        """
        Add a new client.
        Similar to the PHP grid's add functionality.
        """
        client_dict = client_data.dict(exclude_unset=True)
        
        # Apply transformations matching PHP grid's editoptions style
        if "companyname" in client_dict:
            client_dict["companyname"] = client_dict["companyname"].upper()
        if "email" in client_dict:
            client_dict["email"] = client_dict["email"].lower()
        if "url" in client_dict and client_dict["url"]:
            client_dict["url"] = client_dict["url"].lower()

        # Create new client record
        new_client = Client(**client_dict)
        self.db.add(new_client)
        try:
            self.db.commit()
            self.db.refresh(new_client)
            return ClientInDB.from_orm(new_client)
        except Exception as e:
            self.db.rollback()
            print(f"Error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    async def edit_client(self, client_id: int, client_data: ClientUpdate) -> ClientInDB:
        """
        Update an existing client.
        Similar to the PHP grid's edit functionality.
        """
        client = self.db.query(Client).filter(Client.id == client_id).first()
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")

        update_data = client_data.dict(exclude_unset=True)
        
        # Apply transformations matching PHP grid's editoptions style
        if "companyname" in update_data:
            update_data["companyname"] = update_data["companyname"].upper()
        if "email" in update_data:
            update_data["email"] = update_data["email"].lower()
        if "url" in update_data and update_data["url"]:
            update_data["url"] = update_data["url"].lower()

        # Update client attributes
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
        search_term = f"%{search}%"
        query = self.db.query(Client).filter(
            or_(
                Client.companyname.ilike(search_term),
                Client.email.ilike(search_term),
                Client.phone.ilike(search_term),
                Client.status.ilike(search_term),
                Client.url.ilike(search_term),
                Client.fax.ilike(search_term),
                Client.address.ilike(search_term),
                Client.city.ilike(search_term),
                Client.state.ilike(search_term),
                Client.country.ilike(search_term),
                Client.zip.ilike(search_term),
                Client.twitter.ilike(search_term),
                Client.facebook.ilike(search_term),
                Client.linkedin.ilike(search_term),
                Client.manager1name.ilike(search_term),
                Client.manager1email.ilike(search_term),
                Client.manager1phone.ilike(search_term),
                Client.hmname.ilike(search_term),
                Client.hmemail.ilike(search_term),
                Client.hmphone.ilike(search_term),
                Client.hrname.ilike(search_term),
                Client.hremail.ilike(search_term),
                Client.hrphone.ilike(search_term),
                Client.notes.ilike(search_term)
            )
        )
        
        # Sort by companyname to match PHP grid's default sorting
        query = query.order_by(Client.companyname.asc())
        
        total = query.count()
        clients = [ClientInDB.from_orm(client) for client in query.all()]
        
        return ClientResponse(
            data=clients,
            total=total,
            page=1,
            page_size=total,
            pages=1
        )
        
    async def search_clients_by_params(self, db: Session, search_params: ClientSearchBase) -> List[ClientInDB]:
        """
        Search for clients by specific parameters provided in ClientSearchBase.
        This allows for more targeted searching than the general search function.
        """
        query = db.query(Client)
        
        # Apply filters for each provided parameter
        if search_params.companyname:
            query = query.filter(Client.companyname.ilike(f"%{search_params.companyname}%"))
        if search_params.email:
            query = query.filter(Client.email.ilike(f"%{search_params.email}%"))
        if search_params.phone:
            query = query.filter(Client.phone.ilike(f"%{search_params.phone}%"))
        if search_params.status:
            query = query.filter(Client.status.ilike(f"%{search_params.status}%"))
        if search_params.url:
            query = query.filter(Client.url.ilike(f"%{search_params.url}%"))
        if search_params.fax:
            query = query.filter(Client.fax.ilike(f"%{search_params.fax}%"))
        if search_params.address:
            query = query.filter(Client.address.ilike(f"%{search_params.address}%"))
        if search_params.city:
            query = query.filter(Client.city.ilike(f"%{search_params.city}%"))
        if search_params.state:
            query = query.filter(Client.state.ilike(f"%{search_params.state}%"))
        if search_params.country:
            query = query.filter(Client.country.ilike(f"%{search_params.country}%"))
        if search_params.zip:
            query = query.filter(Client.zip.ilike(f"%{search_params.zip}%"))
        if search_params.twitter:
            query = query.filter(Client.twitter.ilike(f"%{search_params.twitter}%"))
        if search_params.facebook:
            query = query.filter(Client.facebook.ilike(f"%{search_params.facebook}%"))
        if search_params.linkedin:
            query = query.filter(Client.linkedin.ilike(f"%{search_params.linkedin}%"))
        if search_params.manager1name:
            query = query.filter(Client.manager1name.ilike(f"%{search_params.manager1name}%"))
        if search_params.manager1email:
            query = query.filter(Client.manager1email.ilike(f"%{search_params.manager1email}%"))
        if search_params.manager1phone:
            query = query.filter(Client.manager1phone.ilike(f"%{search_params.manager1phone}%"))
        if search_params.hmname:
            query = query.filter(Client.hmname.ilike(f"%{search_params.hmname}%"))
        if search_params.hmemail:
            query = query.filter(Client.hmemail.ilike(f"%{search_params.hmemail}%"))
        if search_params.hmphone:
            query = query.filter(Client.hmphone.ilike(f"%{search_params.hmphone}%"))
        if search_params.hrname:
            query = query.filter(Client.hrname.ilike(f"%{search_params.hrname}%"))
        if search_params.hremail:
            query = query.filter(Client.hremail.ilike(f"%{search_params.hremail}%"))
        if search_params.hrphone:
            query = query.filter(Client.hrphone.ilike(f"%{search_params.hrphone}%"))
        if search_params.notes:
            query = query.filter(Client.notes.ilike(f"%{search_params.notes}%"))
            
        # Sort by companyname to match PHP grid's default sorting
        query = query.order_by(Client.companyname.asc())
        
        # Convert to Pydantic models
        clients = [ClientInDB.from_orm(client) for client in query.all()]
        return clients
