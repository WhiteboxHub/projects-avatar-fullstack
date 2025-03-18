from sqlalchemy.orm import Session
from app.models import Client  # Ensure this model is correctly defined
from app.schemas import ClientSearchBase

def search_clients_by_companyname(db: Session, search_params: ClientSearchBase):
    """
    Search clients by company name.
    """
    # Perform a query to search for clients by company name
    clients = db.query(Client).filter(Client.companyname.ilike(f"%{search_params.companyname}%")).all()
    return clients