from sqlalchemy.orm import Session
from app.models import Vendor  # Ensure this model is correctly defined
from app.schemas import VendorSearchBase

def search_vendors_by_companyname(db: Session, search_params: VendorSearchBase):
    """
    Search vendors by company name.
    """
    # Perform a query to search for vendors by company name
    vendors = db.query(Vendor).filter(Vendor.companyname.ilike(f"%{search_params.companyname}%")).all()
    return vendors
