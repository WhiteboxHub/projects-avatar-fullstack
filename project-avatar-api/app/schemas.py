from pydantic import BaseModel,constr, conint, EmailStr, Field, validator, HttpUrl, field_validator
from datetime import datetime, date
from typing import Optional, List
from pydantic_settings import BaseSettings


class UserCreate(BaseModel):
    username: str  
    password: str  

class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str  
    token_type: str  
    
class Batch(BaseModel):
    batchname: str
    courseid: str
    created_at: Optional[datetime]  
    updated_at: Optional[datetime]  

    class Config:
        from_attributes = True  

class UserCreate(BaseModel):
    uname: str
    email: str
    password: str  

    class Config:
        orm_mode = True  

class UserResponse(BaseModel):
    id: int
    uname: str
    email: str

    class Config:
        orm_mode = True 


class LeadBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None

class LeadCreate(LeadBase):
    pass

class LeadUpdate(LeadBase):
    pass

class LeadResponse(LeadBase):
    leadid: int

    class Config:
        orm_mode = True


class LeadBase(BaseModel):
    name: str
    phone: str
    email: str
    sourcename: Optional[str] = None
    course: Optional[str] = None
    status: Optional[str] = None
    secondaryemail: Optional[str] = None
    secondaryphone: Optional[str] = None
    address: Optional[str] = None
    spousename: Optional[str] = None
    spouseemail: Optional[str] = None
    spousephone: Optional[str] = None
    spouseoccupationinfo: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None


class LeadInDB(BaseModel):
    leadid: int 
    name: str
    email: str
    phone: str
    sourcename: str
    course: str
    status: str
    secondaryemail: str
    secondaryphone: str
    address: str
    spousename: str
    spouseemail: str
    spousephone: str
    spouseoccupationinfo: str
    city: str
    state: str
    country: str
    class Config:
        from_attributes = True

class LeadCreate(BaseModel):
    name: str
    email: str
    secondaryemail: Optional[str] = None
    secondaryphone: Optional[str] = None
    address: Optional[str] = None
    spousename: Optional[str] = None
    spouseemail: Optional[str] = None
    spousephone: Optional[str] = None
    spouseoccupationinfo: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None

class LeadResponse(BaseModel):
    id: int
    name: str
    email: str
    secondaryemail: Optional[str] = None
    secondaryphone: Optional[str] = None
    address: Optional[str] = None
    spousename: Optional[str] = None
    spouseemail: Optional[str] = None
    spousephone: Optional[str] = None
    spouseoccupationinfo: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None

    class Config:
        from_attributes = True

class LeadSearchResponse(BaseModel): 
    data: List[LeadBase]  
    class Config:
        orm_mode = True



class UserCreate(BaseModel):
    username: str  
    password: str  

class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str  
    token_type: str  

class Batch(BaseModel):
    batchname: str
    courseid: str
    created_at: Optional[datetime]  
    updated_at: Optional[datetime]  
    class Config:
        from_attributes = True  

class UserCreate(BaseModel):
    uname: str
    email: str
    password: str  

    class Config:
        orm_mode = True  

class UserResponse(BaseModel):
    id: int
    uname: str
    email: str

    class Config:
        orm_mode = True 




class CandidateBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    course: str
    batchname: str
    enrolleddate: date
    status: str
    diceflag: Optional[bool] = None
    education: Optional[str] = None
    workstatus: Optional[str] = None
    dob: Optional[date] = None
    portalid: Optional[str] = None
    agreement: Optional[bool] = None
    driverslicense: Optional[bool] = None
    workpermit: Optional[bool] = None
    wpexpirationdate: Optional[date] = None
    offerletterurl: Optional[str] = None
    ssnvalidated: Optional[bool] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    zip: Optional[str] = None
    emergcontactname: Optional[str] = None
    emergcontactemail: Optional[EmailStr] = None
    emergcontactphone: Optional[str] = None
    emergcontactaddrs: Optional[str] = None
    guidelines: Optional[str] = None
    term: Optional[str] = None
    referralid: Optional[int] = None
    salary0: Optional[float] = None
    salary6: Optional[float] = None
    salary12: Optional[float] = None
    originalresume: Optional[str] = None
    notes: Optional[str] = None

class CandidateCreate(CandidateBase):
    pass

class CandidateUpdate(CandidateBase):
    pass

class CandidateResponse(CandidateBase):
    candidateid: int
    pass
    class Config:
        orm_mode = True

class BatchCreate(BaseModel):
    batchname: constr(max_length=100)
    current: constr(min_length=1, max_length=1)  
    orientationdate: Optional[date] = None
    subject: constr(max_length=45)
    startdate: date
    enddate: Optional[date] = None
    exams: Optional[conint(ge=0)] = None
    instructor1: Optional[int] = None
    instructor2: Optional[int] = None
    instructor3: Optional[int] = None
    topicscovered: Optional[str] = None
    topicsnotcovered: Optional[str] = None
    courseid: Optional[int] = None


    class Config:
        from_attributes = True
        orm_mode = True

class CandidateSchema(BaseModel):
    candidateid: int
    name: str
    enrolleddate: Optional[date]
    email: Optional[str]
    course: str
    phone: Optional[str]
    status: Optional[str]
    workstatus: Optional[str]
    education: Optional[str]
    workexperience: Optional[str]
    
    class Config:
        orm_mode = True 
class CandidateSearchBase(BaseModel):
    name: Optional[str] 

    class Config:
        orm_mode = True




class POSchema(BaseModel):
    id: int
    begindate: Optional[date]
    enddate: Optional[date]
    rate: Optional[float]
    overtimerate: Optional[float]
    freqtype: Optional[str]
    frequency: Optional[int]
    invoicestartdate: Optional[date]
    invoicenet: Optional[float]
    polink: Optional[str]
    notes: Optional[str]

    class Config:
        orm_mode = True

class POCreateSchema(BaseModel):
    placementid: int
    begindate: Optional[date]
    enddate: Optional[date]
    rate: Optional[float]
    overtimerate: Optional[float]
    freqtype: Optional[str]
    frequency: Optional[int]
    invoicestartdate: Optional[date]
    invoicenet: Optional[float]
    polink: Optional[str]
    notes: Optional[str]

class POUpdateSchema(BaseModel):
    begindate: Optional[date]
    enddate: Optional[date]
    rate: Optional[float]
    overtimerate: Optional[float]
    freqtype: Optional[str]
    frequency: Optional[int]
    invoicestartdate: Optional[date]
    invoicenet: Optional[float]
    polink: Optional[str]
    notes: Optional[str]
    
    
    
    
class CandidateMarketingBase(BaseModel):
    
#     status: Optional[str] = None
#     priority: Optional[str] = None
#     technology: Optional[str] = None
#     minrate: Optional[int] = None
#     currentlocation: Optional[str] = None
#     relocation: Optional[str] = None
#     locationpreference: Optional[str] = None
#     ipemailid: Optional[int] = None
#     resumeid: Optional[int] = None
#     coverletter: Optional[str] = None
#     intro: Optional[str] = None
#     closedate: Optional[datetime] = None
#     notes: Optional[str] = None
 pass

class CandidateMarketingCreateSchema(CandidateMarketingBase):
    pass
class CandidateMarketingUpdateSchema(CandidateMarketingBase):
    manager_name: Optional[str] = None  
    instructor_name: Optional[str] = None
    submitter_name: Optional[str] = None
    status: Optional[str] = None
    locationpreference: Optional[str] = None
    priority: Optional[str] = None
    technology: Optional[str] = None
    resumeid: Optional[int] = None
    minrate: Optional[int] = None 
    ipemailid: Optional[int] = None
    currentlocation: Optional[str] = None
    relocation: Optional[str] = None
    closedate: Optional[datetime] = None
    suspensionreason: Optional[str] = None  
    intro: Optional[str] = None
    notes: Optional[str] = None
    
class CandidateMarketingSchema(CandidateMarketingBase):
    id: int

class Config:
        from_attributes = True     
              
class AuthUserBase(BaseModel):
    uname: str=''
    team: Optional[str] = ''
    level: Optional[str] = ''
    instructor: Optional[str] = 'Y'
    override: Optional[str] = 'N'
    status: Optional[str] = 'inactive'
    lastlogin: Optional[datetime] = None
    logincount: Optional[int] = None
    fullname: Optional[str] = ''
    address: Optional[str] = ''
    phone: Optional[str] = None
    state: Optional[str] = ''
    zip: Optional[str] = ''
    city: Optional[str] = ''
    country: Optional[str] = ''
    message: Optional[str] = ''
    registereddate: Optional[datetime] = None
    level3date: Optional[datetime] = None
    demo: Optional[str] = 'N'
    enddate: Optional[date] = None
    googleId: Optional[str] = ''
    reset_token: Optional[str] = None
    token_expiry: Optional[datetime] = None
    role: Optional[str] = ''

class AuthUserCreateSchema(AuthUserBase):
    passwd: str
class AuthUserUpdateSchema(AuthUserBase):
    pass

class AuthUserSchema(AuthUserBase):
    id: int

    class Config:
        from_attributes = True        
        
        
        
        


class CurrentMarketingBase(BaseModel):
    # candidateid: Optional[int] = None
    # mmid: Optional[int] = None
    instructorid: Optional[int] = None
    status: Optional[str] = None
    submitterid: Optional[int] = None
    priority: Optional[str] = None
    technology: Optional[str] = None
    minrate: Optional[int] = None
    currentlocation: Optional[str] = None
    relocation: Optional[str] = ''
    locationpreference: Optional[str] = None
    # skypeid: Optional[str] = None
    ipemailid: Optional[int] = None
    resumeid: Optional[int] = None
    coverletter: Optional[str] = None
    intro: Optional[str] = None
    closedate: Optional[datetime] = None
    closedemail: Optional[str] = 'N'
    notes: Optional[str] = None
    suspensionreason: Optional[str] = 'N'
    yearsofexperience: Optional[str] = None

class CurrentMarketingCreateSchema(CurrentMarketingBase):
    pass

class CurrentMarketingUpdateSchema(CurrentMarketingBase):
    
    # candidateid: int
    # startdate: int
    mmid: int
    instructorid: int
    status: str
    submitterid: int
    priority: str
    technology: str
    minrate: int
    currentlocation: str
    relocation: str
    locationpreference: str
    skypeid: str
    ipemailid: int
    resumeid: int
    coverletter: str
    intro: str
    closedate: str
    closedemail: str
    notes: str
    suspensionreason: str
    yearsofexperience: str
       
class Config:
        orm_mode = True

class CurrentMarketingSchema(CurrentMarketingBase):
    id: int

    class Config:
        from_attributes = True
        
    
class OverdueUpdateSchema(BaseModel):
    # invoicenumber: Optional[str]
    invoicedate: Optional[date]
    quantity: Optional[int]
    amountreceived: Optional[float]
    receiveddate: Optional[date]
    releaseddate: Optional[date]
    checknumber: Optional[str]
    # invoiceurl: Optional[str]
    # checkurl: Optional[str]
    notes: Optional[str]
    status: Optional[str]
    remindertype: Optional[str]    
    
       
class InvoiceBase(BaseModel):
    invoicenumber: str
    startdate: date
    enddate: date
    invoicedate: date
    quantity: float
    otquantity: float = 0.0
    status: Optional[str] = None
    amountreceived: Optional[float] = None
    releaseddate: Optional[date] = None
    receiveddate: Optional[date] = None
    checknumber: Optional[str] = None
    invoiceurl: Optional[str] = None
    checkurl: Optional[str] = None
    reminders: str = 'Y'
    remindertype: str = 'Open'
    emppaiddate: Optional[date] = None
    candpaymentstatus: str = 'Open'
    poid: int
    notes: Optional[str] = None

class InvoiceCreateSchema(InvoiceBase):
    pass

class InvoiceUpdateSchema(InvoiceBase):
    pass

class InvoiceSchema(InvoiceBase):
    id: int

    class Config:
        from_attributes = True    


    remindertype: Optional[str]
    
       
import re
def sanitize_input(value: str) -> str:
    """Sanitize the input by removing unwanted characters."""
    pattern = r'[\u200b\u00a0\u202f\u2028\u2029\u3000\uFEFF\s]+'
    sanitized_value = re.sub(pattern, '', value) 
    return sanitized_value.strip()

class ClientBase(BaseModel):
    companyname: str
    tier: int
    status: str
    email: EmailStr
    phone: str
    fax: str
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    zip: Optional[str] = None
    url: Optional[HttpUrl]  
    manager1name: Optional[str] = None
    twitter: Optional[str] = None
    facebook: Optional[str] = None
    linkedin: Optional[str] = None
    manager1email: Optional[str] = None
    manager1phone: Optional[str] = None
    hmname: Optional[str] = None
    hmemail: Optional[str] = None  
    hmphone: Optional[str] = None
    hrname: Optional[str] = None
    hremail: Optional[str] = None
    hrphone: Optional[str] = None
    notes: Optional[str] = None

    @field_validator("url", mode="before")
    @classmethod
    def validate_url(cls, v):
        if v is None or v.strip() == "":
            return None  
        sanitized_url = sanitize_input(v)
        return sanitized_url

    @field_validator("email", "hmemail", "hremail", mode="before")
    @classmethod
    def validate_email(cls, v):
        if v is None or v.strip() == "":
            return None  
        sanitized_email = sanitize_input(v)
        return sanitized_email

class ClientInDB(ClientBase):
    id: int

    class Config:
        orm_mode = True
        from_attributes = True

class ClientResponse(BaseModel):
    data: List[ClientInDB]
    total: int
    page: int
    page_size: int
    pages: int

class ClientDeleteResponse(BaseModel):
    message: str
    client_id: int  

    class Config:
        orm_mode = True

class ClientSearchBase(BaseModel):
    companyname: Optional[str] = None

    class Config:
        orm_mode = True

class ClientCreate(ClientBase):
    pass

class ClientUpdate(ClientBase):
    class Config:
        from_attributes = True    
    
class RecruiterBase(BaseModel):
     name:  Optional[str] = None
     email: str
     phone: Optional[str] = None
     status: Optional[str] = None
     designation: Optional[str] = None
     dob: Optional[date] = None
     personalemail: Optional[str] = None
     employeeid: Optional[int] = None
     skypeid: Optional[str] = None
     linkedin: Optional[str] = None
     twitter: Optional[str] = None
     facebook: Optional[str] = None
     review: Optional[str] = None
     vendorid: Optional[int] = None
     clientid: Optional[int] = None
     notes: Optional[str] = None
     lastmoddatetime: Optional[datetime] = None
     
     @validator('dob', pre=True, always=True)
     def validate_dob(cls, v):
        if isinstance(v, date):
            return v  
        if v in ('0000-00-00', None):
            return None
        try:
            return datetime.strptime(v, '%Y-%m-%d').date()
        except (ValueError, TypeError):
            raise ValueError("Invalid date format for dob")


class RecruiterCreate(RecruiterBase):
    pass

class RecruiterUpdate(RecruiterBase):
    pass

class Recruiter(RecruiterBase):
    id: int
    comp: Optional[str] = None 

    class Config:
        orm_mode = True
        from_attributes=True
        
        
class RecruiterSchema(RecruiterBase):  
    id: int  
    comp: Optional[str] = None

    class Config:
        orm_mode = True

class RecruiterResponse(RecruiterBase):
    id: int
    comp: Optional[str] = None

    class Config:
        orm_mode = True
        from_attributes = True
        
# class Mkt_submissionBase(BaseModel):
#     candidateid: int
#     employeeid: int
#     submitter: Optional[int]=None
#     submissiondate:str
#     type: str
#     name: Optional[str]=None
#     email: Optional[str]=None
#     phone: Optional[str]=None
#     url: Optional[str]=None
#     location: Optional[str]=None
#     notes: Optional[str]= None
#     feedback: Optional[str]=None
    
# class Mkt_SubmissionCreate(Mkt_submissionBase):
#     pass

# class Mkt_SubmissionUpdate(Mkt_submissionBase):
#     pass

# class Mkt_SubmissionResponse(Mkt_submissionBase):
#     id : int
    
#     class config:
#         orm_mode = True
#         from_attributes = True
        
    
    

    

class UrlBase(BaseModel):
    url: str

class UrlCreate(UrlBase):
    pass

class UrlUpdate(UrlBase):
    pass

class UrlInDB(UrlBase):
    id: int

    class Config:
       from_attributes = True 
       
       

# Vendor Schemas
class VendorBase(BaseModel):
    companyname: str

class VendorCreate(VendorBase):
    pass

class VendorUpdate(VendorBase):
    pass

class VendorInDB(VendorBase):
    id: int

    class Config:
        orm_mode = True

# Client Schemas
class ClientBase(BaseModel):
    companyname: str

class ClientCreate(ClientBase):
    pass

class ClientUpdate(ClientBase):
    pass

class ClientInDB(ClientBase):
    id: int

    class Config:
        orm_mode = True

# Recruiter Schemas
class RecruiterBase(BaseModel):
    name: Optional[str] = None
    email:  Optional[str] = None
    phone: Optional[str] = None
    designation: Optional[str] = None
    vendorid: Optional[int] = None
    status: Optional[str] = None
    dob: Optional[date] = None
    personalemail: Optional[str] = None
    skypeid: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None
    facebook: Optional[str] = None
    review: Optional[str] = None
    notes: Optional[str] = None
    clientid: Optional[int] = None
    
    
    @validator("review")
    def validate_review(cls, value):
        # Ensure the review field is exactly one character long
        if value and len(value) != 1:
            raise ValueError("Review must be exactly one character long.")
        return value

    
    @validator("status")
    def validate_status(cls, value):
        # Ensure the status field is exactly one character long
        if value and len(value) != 1:
            raise ValueError("Status must be exactly one character long.")
        return value
    
    @validator("dob", pre=True)
    def validate_dob(cls, value):
        if value is None or value == "0000-00-00":
            return None  # Replace invalid date with None
        
        # If the value is already a date object, return it directly
        if isinstance(value, date):
            return value
        
        # If the value is a string, parse it into a date object
        if isinstance(value, str):
            try:
                return datetime.strptime(value, "%Y-%m-%d").date()
            except ValueError:
                raise ValueError("Invalid date format. Expected YYYY-MM-DD.")
        
        # If the value is of an unexpected type, raise an error
        raise ValueError(f"Invalid type for date: {type(value)}")
   
    @validator("designation", pre=True)
    def validate_designation(cls, value):
        # If the value is None, return an empty string
        if value is None:
            return ""
        # Ensure the value is a string
        return str(value)
    
    # @validator("email", "personalemail", pre=True)
    # def clean_and_validate_email(cls, value):
    #     # If the value is None or an empty string, return None
    #     if not value:
    #         return None
        
    #     # Skip validation if the email is invalid (e.g., missing @)
    #     if "@" not in value:
    #         return None
        
    #     return value
        

class RecruiterCreate(RecruiterBase):
    pass

class RecruiterUpdate(RecruiterBase):
    pass

class RecruiterInDB(RecruiterBase):
    id: int

class VendorBase(BaseModel):
    companyname: str
    status: str
    tier: Optional[str] = None
    culture: Optional[str] = None
    solicited: Optional[str] = None
    minrate: Optional[float] = None
    hirebeforeterm: Optional[str] = None
    hireafterterm: Optional[str] = None
    latepayments: Optional[str] = None
    totalnetterm: Optional[int] = None
    defaultedpayment: Optional[str] = None
    agreementstatus: Optional[str] = None
    url: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    fax: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    zip: Optional[str] = None
    hrname: Optional[str] = None
    hremail: Optional[str] = None
    hrphone: Optional[str] = None
    twitter: Optional[str] = None
    facebook: Optional[str] = None
    linkedin: Optional[str] = None
    accountnumber: Optional[str] = None
    managername: Optional[str] = None
    manageremail: Optional[str] = None
    managerphone: Optional[str] = None
    secondaryname: Optional[str] = None
    secondaryemail: Optional[str] = None
    secondaryphone: Optional[str] = None
    timsheetemail: Optional[str] = None
    agreementname: Optional[str] = None
    agreementlink: Optional[str] = None
    subcontractorlink: Optional[str] = None
    nonsolicitationlink: Optional[str] = None
    nonhirelink: Optional[str] = None
    clients: Optional[str] = None
    notes: Optional[str] = None


    @validator('tier', 'status', 'culture', pre=True)
    def coerce_numbers_to_str(cls, v):
        if isinstance(v, (int, float)):
            return str(v)
        return v

    class Config:
        anystr_strip_whitespace = True

class VendorCreate(VendorBase):
    pass

class VendorUpdate(VendorBase):
    pass

class VendorInDB(VendorBase):
    id: int


class RecruiterByVendorBase(BaseModel):
    name: str
    email: str
    phone: str
    designation: Optional[str] = None 
    vendorid: Optional[int] = None
    status: str

    @validator("email")
    def validate_email(cls, v):
        # Basic email validation (fallback to placeholder if invalid)
        if "@" not in v or "." not in v.split("@")[-1]:
            return "invalid@example.com"
        return v


class RecruiterByVendorCreate(RecruiterByVendorBase):
    clientid: int = 0  
class RecruiterByVendorUpdate(RecruiterByVendorBase):
    clientid: int = 0  
class RecruiterByVendorInDB(RecruiterByVendorBase):
    id: int
    comp: Optional[str] = None 


class RecruiterByPlacementInDB(RecruiterByVendorInDB):
    pass


class PlacementRecruiterBase(BaseModel):
    name: str
    email: str
    phone: str
    designation: Optional[str] = None   # Allow NULL/None values
    vendorid: Optional[int] = None
    status: str
    comp: Optional[str] = None 

    @validator("email")
    def validate_email(cls, v):
        # Basic email validation (fallback to placeholder if invalid)
        if "@" not in v or "." not in v.split("@")[-1]:
            return "invalid@example.com"
        return v
    # ... other fields (dob, skypeid, etc.) ...

class PlacementRecruiterCreate(PlacementRecruiterBase):
    clientid: int = 0  # Force clientid = 0

class PlacementRecruiterUpdate(PlacementRecruiterBase):
    pass
class RecruiterByPlacementInDB(PlacementRecruiterBase):
    id: int
    comp: Optional[str] = None

class PlacementRecruiterInDB(PlacementRecruiterBase):
    id: int
    comp: Optional[str] = None  # Vendor company name

    class Config:
        from_attributes = True 