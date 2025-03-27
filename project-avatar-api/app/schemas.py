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
        
class Mkt_submissionBase(BaseModel):
    candidateid: int
    employeeid: int
    submitter: Optional[int]=None
    submissiondate:str
    type: str
    name: Optional[str]=None
    email: Optional[str]=None
    phone: Optional[str]=None
    url: Optional[str]=None
    location: Optional[str]=None
    notes: Optional[str]= None
    feedback: Optional[str]=None
    
class Mkt_SubmissionCreate(Mkt_submissionBase):
    pass

class Mkt_SubmissionUpdate(Mkt_submissionBase):
    pass

class Mkt_SubmissionResponse(Mkt_submissionBase):
    id : int
    
#     class config:
#         orm_mode = True
#         from_attributes = True
        
    
# class MktSubmissionBase(BaseModel):
#     candidateid: int
#     employeeid: int
#     submitter: Optional[int] = None
#     submissiondate: Optional[date] = None
#     type: Optional[str] = None
#     name: Optional[str] = None
#     email: Optional[EmailStr] = None
#     phone: Optional[str] = None
#     url: Optional[str] = None
#     location: Optional[str] = None
#     notes: Optional[str] = None
#     feedback: Optional[str] = None
    
#     @validator('email', pre=True)
#     def validate_empty_email(cls, v):
#         if v == '' or v is None:
#             return None
#         return v
    
#     @validator('submissiondate', pre=True)
#     def validate_submission_date(cls, v):
#         if isinstance(v, date):
#             return v
#         if v in ('0000-00-00', None, ''):
#             return None
#         try:
#             return datetime.strptime(v, '%Y-%m-%d').date()
#         except (ValueError, TypeError):
#             return None
    
# class MktSubmissionCreate(MktSubmissionBase):
#     pass

# class MktSubmissionUpdate(MktSubmissionBase):
#     pass

# class MktSubmissionResponse(MktSubmissionBase):
#     id: int
#     lastmoddatetime: Optional[datetime] = None
#     candidate: Optional["CandidateResponse"] = None
    
#     class Config:
#         orm_mode = True
#         from_attributes = True

# class MktSubmissionWithCandidateResponse(BaseModel):
#     id: int
#     submissiondate: Optional[date] = None
#     candidateid: int
#     employeeid: int
#     submitter: Optional[int] = None
#     course: Optional[str] = None
#     email: Optional[str] = None
#     phone: Optional[str] = None
#     url: Optional[str] = None
#     name: Optional[str] = None
#     location: Optional[str] = None
#     notes: Optional[str] = None
#     feedback: Optional[str] = None
    
#     @validator('submissiondate', pre=True)
#     def validate_submission_date(cls, v):
#         if isinstance(v, date):
#             return v
#         if v in ('0000-00-00', None, ''):
#             return None
#         try:
#             return datetime.strptime(v, '%Y-%m-%d').date()
#         except (ValueError, TypeError):
#             return None
    
#     class Config:
#         orm_mode = True
#         from_attributes = True


# from pydantic import BaseModel, EmailStr, validator
# from typing import Optional, List
# from datetime import date, datetime

class EmployeeResponse(BaseModel):
    id: int
    name: str
    status: str

    class Config:
        orm_mode = True

# ... other imports and classes ...

class MktSubmissionWithCandidateResponse(BaseModel):
    id: int
    submissiondate: Optional[date] = None
    candidateid: int
    employeeid: int
    submitter: Optional[int] = None
    course: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    url: Optional[str] = None
    name: Optional[str] = None
    location: Optional[str] = None
    notes: Optional[str] = None
    feedback: Optional[str] = None
    candidate_name: Optional[str] = None
    employee_name: Optional[str] = None

    @validator('submissiondate', pre=True)
    def validate_submission_date(cls, v):
        if isinstance(v, date):
            return v
        if v in ('0000-00-00', None, ''):
            return None
        try:
            return datetime.strptime(v, '%Y-%m-%d').date()
        except (ValueError, TypeError):
            return None
    
    class Config:
        orm_mode = True

class GridResponse(BaseModel):
    page: int
    total: int
    records: List[MktSubmissionWithCandidateResponse]
    total_records: int
    
    class Config:
        orm_mode = True