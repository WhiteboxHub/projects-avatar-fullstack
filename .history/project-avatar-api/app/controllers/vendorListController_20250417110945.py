from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional, List
from ..models import Vendor
from ..schemas import VendorCreate, VendorUpdate, VendorInDB, VendorResponse, VendorDeleteResponse, VendorSearchBase
from ..database.db import get_db

class VendorController:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    async def get_vendors(self, page: int, page_size: int, search: Optional[str] = None):
        query = self.db.query(
            Vendor.id, Vendor.companyname, Vendor.status, Vendor.tier, Vendor.culture,
            Vendor.solicited, Vendor.minrate, Vendor.hirebeforeterm, Vendor.hireafterterm,
            Vendor.latepayments, Vendor.totalnetterm, Vendor.defaultedpayment, Vendor.agreementstatus,
            Vendor.url, Vendor.accountnumber, Vendor.email, Vendor.phone, Vendor.fax,
            Vendor.address, Vendor.city, Vendor.state, Vendor.country, Vendor.zip,
            Vendor.twitter, Vendor.facebook, Vendor.linkedin, Vendor.hrname, Vendor.hremail,
            Vendor.hrphone, Vendor.managername, Vendor.manageremail, Vendor.managerphone,
            Vendor.secondaryname, Vendor.secondaryemail, Vendor.secondaryphone,
            Vendor.agreementname, Vendor.agreementlink, Vendor.subcontractorlink, Vendor.nonsolicitationlink,
            Vendor.nonhirelink, Vendor.clients, Vendor.notes, Vendor.crawldate, Vendor.lastmoddatetime
        )

        if search:
            search_base = VendorSearchBase(companyname=search)
            query = query.filter(
                or_(
                    Vendor.companyname.ilike(f"%{search_base.companyname}%"),
                    Vendor.email.ilike(f"%{search}%"),
                    Vendor.phone.ilike(f"%{search}%"),
                    Vendor.city.ilike(f"%{search}%"),
                    Vendor.state.ilike(f"%{search}%"),
                    Vendor.country.ilike(f"%{search}%"),
                    Vendor.zip.ilike(f"%{search}%"),
                    Vendor.hrname.ilike(f"%{search}%"),
                    Vendor.hremail.ilike(f"%{search}%"),
                    Vendor.hrphone.ilike(f"%{search}%"),
                    Vendor.managername.ilike(f"%{search}%"),
                    Vendor.manageremail.ilike(f"%{search}%"),
                    Vendor.managerphone.ilike(f"%{search}%"),
                    Vendor.secondaryname.ilike(f"%{search}%"),
                    Vendor.secondaryemail.ilike(f"%{search}%"),
                    Vendor.secondaryphone.ilike(f"%{search}%"),
                    Vendor.notes.ilike(f"%{search}%")
                )
            )

        total = query.count()
        query = query.order_by(Vendor.companyname.asc())
        query = query.offset((page - 1) * page_size).limit(page_size)

        vendors = [VendorInDB.from_orm(vendor) for vendor in query.all()]

        return VendorResponse(
            data=vendors,
            total=total,
            page=page,
            page_size=page_size,
            pages=(total + page_size - 1) // page_size,
        )

    async def get_vendor(self, vendor_id: int) -> VendorInDB:
        vendor = self.db.query(Vendor).filter(Vendor.id == vendor_id).first()
        if not vendor:
            raise HTTPException(status_code=404, detail="Vendor not found")
        return VendorInDB.from_orm(vendor)

    async def add_vendor(self, vendor_data: VendorCreate) -> VendorInDB:
        vendor_dict = vendor_data.dict()
        if "companyname" in vendor_dict:
            vendor_dict["companyname"] = vendor_dict["companyname"].upper()
        if "email" in vendor_dict:
            vendor_dict["email"] = vendor_dict["email"].lower()
        if "url" in vendor_dict and vendor_dict["url"]:
            vendor_dict["url"] = vendor_dict["url"].lower()

        new_vendor = Vendor(**vendor_dict)
        self.db.add(new_vendor)
        self.db.commit()
        self.db.refresh(new_vendor)
        return VendorInDB.from_orm(new_vendor)

    async def edit_vendor(self, vendor_id: int, vendor_data: VendorUpdate) -> VendorInDB:
        vendor = self.db.query(Vendor).filter(Vendor.id == vendor_id).first()
        if not vendor:
            raise HTTPException(status_code=404, detail="Vendor not found")

        update_data = vendor_data.dict(exclude_unset=True)

        if "companyname" in update_data:
            update_data["companyname"] = update_data["companyname"].upper()
        if "email" in update_data:
            update_data["email"] = update_data["email"].lower()
        if "url" in update_data and update_data["url"]:
            update_data["url"] = update_data["url"].lower()

        for key, value in update_data.items():
            setattr(vendor, key, value)

        self.db.commit()
        self.db.refresh(vendor)
        return VendorInDB.from_orm(vendor)

    async def delete_vendor(self, vendor_id: int) -> VendorDeleteResponse:
        vendor = self.db.query(Vendor).filter(Vendor.id == vendor_id).first()
        if not vendor:
            raise HTTPException(status_code=404, detail="Vendor not found")

        self.db.delete(vendor)
        self.db.commit()
        return VendorDeleteResponse(message="Vendor deleted successfully", vendor_id=vendor_id)

    async def search_vendor(self, search: str) -> VendorResponse:
        query = self.db.query(Vendor).filter(
            or_(
                Vendor.companyname.ilike(f"%{search}%"),
                Vendor.email.ilike(f"%{search}%"),
                Vendor.phone.ilike(f"%{search}%"),
                Vendor.city.ilike(f"%{search}%"),
                Vendor.state.ilike(f"%{search}%"),
                Vendor.country.ilike(f"%{search}%"),
                Vendor.zip.ilike(f"%{search}%"),
                Vendor.hrname.ilike(f"%{search}%"),
                Vendor.hremail.ilike(f"%{search}%"),
                Vendor.hrphone.ilike(f"%{search}%"),
                Vendor.managername.ilike(f"%{search}%"),
                Vendor.manageremail.ilike(f"%{search}%"),
                Vendor.managerphone.ilike(f"%{search}%"),
                Vendor.secondaryname.ilike(f"%{search}%"),
                Vendor.secondaryemail.ilike(f"%{search}%"),
                Vendor.secondaryphone.ilike(f"%{search}%"),
                Vendor.notes.ilike(f"%{search}%")
            )
        )

        total = query.count()
        vendors = [VendorInDB.from_orm(vendor) for vendor in query.all()]

        return VendorResponse(
            data=vendors,
            total=total,
            page=1,
            page_size=total,
            pages=1
        )
