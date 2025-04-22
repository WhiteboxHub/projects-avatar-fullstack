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

        vendors = []
        for vendor in query.all():
            vendor_dict = {
                "id": vendor.id,
                "companyname": vendor.companyname,
                "status": vendor.status,
                "tier": str(vendor.tier),  # Convert tier to string
                "culture": vendor.culture,
                "solicited": vendor.solicited,
                "minrate": vendor.minrate,
                "hirebeforeterm": vendor.hirebeforeterm,
                "hireafterterm": vendor.hireafterterm,
                "latepayments": vendor.latepayments,
                "totalnetterm": vendor.totalnetterm,
                "defaultedpayment": vendor.defaultedpayment,
                "agreementstatus": vendor.agreementstatus,
                "url": vendor.url,
                "accountnumber": vendor.accountnumber,
                "email": vendor.email,
                "phone": vendor.phone,
                "fax": vendor.fax,
                "address": vendor.address,
                "city": vendor.city,
                "state": vendor.state,
                "country": vendor.country,
                "zip": vendor.zip,
                "twitter": vendor.twitter,
                "facebook": vendor.facebook,
                "linkedin": vendor.linkedin,
                "hrname": vendor.hrname,
                "hremail": vendor.hremail,
                "hrphone": vendor.hrphone,
                "managername": vendor.managername,
                "manageremail": vendor.manageremail,
                "managerphone": vendor.managerphone,
                "secondaryname": vendor.secondaryname,
                "secondaryemail": vendor.secondaryemail,
                "secondaryphone": vendor.secondaryphone,
                "agreementname": vendor.agreementname,
                "agreementlink": vendor.agreementlink,
                "subcontractorlink": vendor.subcontractorlink,
                "nonsolicitationlink": vendor.nonsolicitationlink,
                "nonhirelink": vendor.nonhirelink,
                "clients": vendor.clients,
                "notes": vendor.notes,
                "crawldate": vendor.crawldate,
                "lastmoddatetime": vendor.lastmoddatetime
            }
            vendors.append(VendorInDB(**vendor_dict))

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
        vendor_dict = {
            "id": vendor.id,
            "companyname": vendor.companyname,
            "status": vendor.status,
            "tier": str(vendor.tier),  # Convert tier to string
            "culture": vendor.culture,
            "solicited": vendor.solicited,
            "minrate": vendor.minrate,
            "hirebeforeterm": vendor.hirebeforeterm,
            "hireafterterm": vendor.hireafterterm,
            "latepayments": vendor.latepayments,
            "totalnetterm": vendor.totalnetterm,
            "defaultedpayment": vendor.defaultedpayment,
            "agreementstatus": vendor.agreementstatus,
            "url": vendor.url,
            "accountnumber": vendor.accountnumber,
            "email": vendor.email,
            "phone": vendor.phone,
            "fax": vendor.fax,
            "address": vendor.address,
            "city": vendor.city,
            "state": vendor.state,
            "country": vendor.country,
            "zip": vendor.zip,
            "twitter": vendor.twitter,
            "facebook": vendor.facebook,
            "linkedin": vendor.linkedin,
            "hrname": vendor.hrname,
            "hremail": vendor.hremail,
            "hrphone": vendor.hrphone,
            "managername": vendor.managername,
            "manageremail": vendor.manageremail,
            "managerphone": vendor.managerphone,
            "secondaryname": vendor.secondaryname,
            "secondaryemail": vendor.secondaryemail,
            "secondaryphone": vendor.secondaryphone,
            "agreementname": vendor.agreementname,
            "agreementlink": vendor.agreementlink,
            "subcontractorlink": vendor.subcontractorlink,
            "nonsolicitationlink": vendor.nonsolicitationlink,
            "nonhirelink": vendor.nonhirelink,
            "clients": vendor.clients,
            "notes": vendor.notes,
            "crawldate": vendor.crawldate,
            "lastmoddatetime": vendor.lastmoddatetime
        }
        return VendorInDB(**vendor_dict)

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
        vendor_dict = {
            "id": new_vendor.id,
            "companyname": new_vendor.companyname,
            "status": new_vendor.status,
            "tier": str(new_vendor.tier),  # Convert tier to string
            "culture": new_vendor.culture,
            "solicited": new_vendor.solicited,
            "minrate": new_vendor.minrate,
            "hirebeforeterm": new_vendor.hirebeforeterm,
            "hireafterterm": new_vendor.hireafterterm,
            "latepayments": new_vendor.latepayments,
            "totalnetterm": new_vendor.totalnetterm,
            "defaultedpayment": new_vendor.defaultedpayment,
            "agreementstatus": new_vendor.agreementstatus,
            "url": new_vendor.url,
            "accountnumber": new_vendor.accountnumber,
            "email": new_vendor.email,
            "phone": new_vendor.phone,
            "fax": new_vendor.fax,
            "address": new_vendor.address,
            "city": new_vendor.city,
            "state": new_vendor.state,
            "country": new_vendor.country,
            "zip": new_vendor.zip,
            "twitter": new_vendor.twitter,
            "facebook": new_vendor.facebook,
            "linkedin": new_vendor.linkedin,
            "hrname": new_vendor.hrname,
            "hremail": new_vendor.hremail,
            "hrphone": new_vendor.hrphone,
            "managername": new_vendor.managername,
            "manageremail": new_vendor.manageremail,
            "managerphone": new_vendor.managerphone,
            "secondaryname": new_vendor.secondaryname,
            "secondaryemail": new_vendor.secondaryemail,
            "secondaryphone": new_vendor.secondaryphone,
            "agreementname": new_vendor.agreementname,
            "agreementlink": new_vendor.agreementlink,
            "subcontractorlink": new_vendor.subcontractorlink,
            "nonsolicitationlink": new_vendor.nonsolicitationlink,
            "nonhirelink": new_vendor.nonhirelink,
            "clients": new_vendor.clients,
            "notes": new_vendor.notes,
            "crawldate": new_vendor.crawldate,
            "lastmoddatetime": new_vendor.lastmoddatetime
        }
        return VendorInDB(**vendor_dict)

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
        vendor_dict = {
            "id": vendor.id,
            "companyname": vendor.companyname,
            "status": vendor.status,
            "tier": str(vendor.tier),  # Convert tier to string
            "culture": vendor.culture,
            "solicited": vendor.solicited,
            "minrate": vendor.minrate,
            "hirebeforeterm": vendor.hirebeforeterm,
            "hireafterterm": vendor.hireafterterm,
            "latepayments": vendor.latepayments,
            "totalnetterm": vendor.totalnetterm,
            "defaultedpayment": vendor.defaultedpayment,
            "agreementstatus": vendor.agreementstatus,
            "url": vendor.url,
            "accountnumber": vendor.accountnumber,
            "email": vendor.email,
            "phone": vendor.phone,
            "fax": vendor.fax,
            "address": vendor.address,
            "city": vendor.city,
            "state": vendor.state,
            "country": vendor.country,
            "zip": vendor.zip,
            "twitter": vendor.twitter,
            "facebook": vendor.facebook,
            "linkedin": vendor.linkedin,
            "hrname": vendor.hrname,
            "hremail": vendor.hremail,
            "hrphone": vendor.hrphone,
            "managername": vendor.managername,
            "manageremail": vendor.manageremail,
            "managerphone": vendor.managerphone,
            "secondaryname": vendor.secondaryname,
            "secondaryemail": vendor.secondaryemail,
            "secondaryphone": vendor.secondaryphone,
            "agreementname": vendor.agreementname,
            "agreementlink": vendor.agreementlink,
            "subcontractorlink": vendor.subcontractorlink,
            "nonsolicitationlink": vendor.nonsolicitationlink,
            "nonhirelink": vendor.nonhirelink,
            "clients": vendor.clients,
            "notes": vendor.notes,
            "crawldate": vendor.crawldate,
            "lastmoddatetime": vendor.lastmoddatetime
        }
        return VendorInDB(**vendor_dict)

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
        vendors = []
        for vendor in query.all():
            vendor_dict = {
                "id": vendor.id,
                "companyname": vendor.companyname,
                "status": vendor.status,
                "tier": str(vendor.tier),  # Convert tier to string
                "culture": vendor.culture,
                "solicited": vendor.solicited,
                "minrate": vendor.minrate,
                "hirebeforeterm": vendor.hirebeforeterm,
                "hireafterterm": vendor.hireafterterm,
                "latepayments": vendor.latepayments,
                "totalnetterm": vendor.totalnetterm,
                "defaultedpayment": vendor.defaultedpayment,
                "agreementstatus": vendor.agreementstatus,
                "url": vendor.url,
                "accountnumber": vendor.accountnumber,
                "email": vendor.email,
                "phone": vendor.phone,
                "fax": vendor.fax,
                "address": vendor.address,
                "city": vendor.city,
                "state": vendor.state,
                "country": vendor.country,
                "zip": vendor.zip,
                "twitter": vendor.twitter,
                "facebook": vendor.facebook,
                "linkedin": vendor.linkedin,
                "hrname": vendor.hrname,
                "hremail": vendor.hremail,
                "hrphone": vendor.hrphone,
                "managername": vendor.managername,
                "manageremail": vendor.manageremail,
                "managerphone": vendor.managerphone,
                "secondaryname": vendor.secondaryname,
                "secondaryemail": vendor.secondaryemail,
                "secondaryphone": vendor.secondaryphone,
                "agreementname": vendor.agreementname,
                "agreementlink": vendor.agreementlink,
                "subcontractorlink": vendor.subcontractorlink,
                "nonsolicitationlink": vendor.nonsolicitationlink,
                "nonhirelink": vendor.nonhirelink,
                "clients": vendor.clients,
                "notes": vendor.notes,
                "crawldate": vendor.crawldate,
                "lastmoddatetime": vendor.lastmoddatetime
            }
            vendors.append(VendorInDB(**vendor_dict))

        return VendorResponse(
            data=vendors,
            total=total,
            page=1,
            page_size=total,
            pages=1
        )
