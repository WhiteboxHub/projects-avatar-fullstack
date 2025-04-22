# app/controllers/byVendorController.py
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import Contact, Vendor
from app.schemas import ContactCreate, ContactUpdate, ContactResponse
from sqlalchemy import text, func
from typing import Optional, Dict, Any
from datetime import datetime

def get_vendors_with_contacts(
    db: Session, 
    page: int = 1, 
    page_size: int = 100,
    type: str = "vendor",
    search: Optional[str] = None
) -> Dict[str, Any]:
    """
    Get paginated list of vendors with their contacts
    Returns data in the format expected by the frontend AG-Grid
    """
    try:
        # Base query for vendors
        vendors_query = db.query(
            Vendor.id,
            Vendor.companyname,
            func.count(Contact.id).label("contact_count")
        ).outerjoin(
            Contact, 
            (Contact.vendorid == Vendor.id) & (Contact.clientid == 0)
        ).group_by(Vendor.id, Vendor.companyname)

        # Apply search filter if provided
        if search:
            vendors_query = vendors_query.filter(
                Vendor.companyname.ilike(f"%{search}%")
            )

        # Get total count for pagination
        total = vendors_query.count()

        # Apply pagination
        vendors = vendors_query.offset((page - 1) * page_size).limit(page_size).all()

        # Prepare the response data structure
        data = []
        for vendor in vendors:
            # Get contacts for each vendor
            contacts = db.query(Contact).filter(
                Contact.vendorid == vendor.id,
                Contact.clientid == 0
            ).order_by(
                Contact.status, 
                Contact.name
            ).all()

            # Format vendor with contacts
            vendor_data = {
                "vendorid": vendor.id,
                "companyname": vendor.companyname,
                "contacts": [{
                    "id": c.id,
                    "name": c.name,
                    "email": c.email,
                    "phone": c.phone,
                    "designation": c.designation,
                    "status": c.status,
                    "dob": c.dob.isoformat() if c.dob else None,
                    "personalemail": c.personalemail,
                    "skypeid": c.skypeid,
                    "linkedin": c.linkedin,
                    "twitter": c.twitter,
                    "facebook": c.facebook,
                    "review": c.review,
                    "notes": c.notes,
                    "vendorid": c.vendorid,
                    "companyname": vendor.companyname
                } for c in contacts],
                "isGroup": True,
                "isCollapsed": True,
                "contact_count": vendor.contact_count
            }
            data.append(vendor_data)

        return {
            "data": data,
            "total": total,
            "page": page,
            "page_size": page_size,
            "pages": (total + page_size - 1) // page_size,
            "grouping": {
                "enabled": True,
                "groupField": "vendorid",
                "groupOrder": "desc",
                "groupCollapse": True
            }
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error fetching vendor contacts: {str(e)}"
        )

def get_vendor_options(db: Session) -> list:
    """
    Get vendor options for dropdown select
    """
    try:
        vendors = db.query(
            Vendor.id,
            Vendor.companyname.label("name")
        ).filter(
            Vendor.id.in_(
                db.query(Contact.vendorid.distinct()).filter(Contact.clientid == 0)
        ).order_by(
            Vendor.companyname
        ).all()

        options = [{"id": 0, "name": "Select vendor..."}]
        options.extend([{"id": v.id, "name": v.name} for v in vendors])
        
        return options

    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error fetching vendor options: {str(e)}"
        )

def create_vendor_contact(db: Session, contact: ContactCreate) -> ContactResponse:
    """
    Create a new vendor contact
    """
    try:
        # Validate vendor exists
        vendor = db.query(Vendor).filter(Vendor.id == contact.vendorid).first()
        if not vendor:
            raise HTTPException(
                status_code=404,
                detail=f"Vendor with ID {contact.vendorid} not found"
            )

        # Create new contact
        db_contact = Contact(
            **contact.dict(exclude_unset=True),
            clientid=0  # Ensure this is set for vendor contacts
        )
        db.add(db_contact)
        db.commit()
        db.refresh(db_contact)
        
        # Return the created contact with companyname
        return ContactResponse(
            **db_contact.__dict__,
            companyname=vendor.companyname
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, 
            detail=f"Error creating vendor contact: {str(e)}"
        )

def update_vendor_contact(
    db: Session, 
    contact_id: int, 
    contact: ContactUpdate
) -> ContactResponse:
    """
    Update an existing vendor contact
    """
    try:
        # Get existing contact
        db_contact = db.query(Contact).filter(
            Contact.id == contact_id,
            Contact.clientid == 0  # Ensure we only update vendor contacts
        ).first()

        if not db_contact:
            raise HTTPException(
                status_code=404,
                detail="Vendor contact not found"
            )

        # Update fields
        update_data = contact.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_contact, field, value)

        db.commit()
        db.refresh(db_contact)

        # Get vendor name for response
        vendor = db.query(Vendor).filter(Vendor.id == db_contact.vendorid).first()
        
        return ContactResponse(
            **db_contact.__dict__,
            companyname=vendor.companyname if vendor else ""
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, 
            detail=f"Error updating vendor contact: {str(e)}"
        )

def delete_vendor_contact(db: Session, contact_id: int) -> Dict[str, str]:
    """
    Delete a vendor contact
    """
    try:
        contact = db.query(Contact).filter(
            Contact.id == contact_id,
            Contact.clientid == 0  # Ensure we only delete vendor contacts
        ).first()

        if not contact:
            raise HTTPException(
                status_code=404,
                detail="Vendor contact not found"
            )

        db.delete(contact)
        db.commit()
        
        return {"message": "Vendor contact deleted successfully"}

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, 
            detail=f"Error deleting vendor contact: {str(e)}"
        )

def get_vendor_contact(db: Session, contact_id: int) -> ContactResponse:
    """
    Get details of a specific vendor contact
    """
    try:
        contact = db.query(Contact).filter(
            Contact.id == contact_id,
            Contact.clientid == 0  # Ensure we only get vendor contacts
        ).first()

        if not contact:
            raise HTTPException(
                status_code=404,
                detail="Vendor contact not found"
            )

        # Get vendor name
        vendor = db.query(Vendor).filter(Vendor.id == contact.vendorid).first()
        
        return ContactResponse(
            **contact.__dict__,
            companyname=vendor.companyname if vendor else ""
        )

    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error fetching vendor contact: {str(e)}"
        )