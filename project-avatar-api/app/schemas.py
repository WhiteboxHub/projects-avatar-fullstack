from pydantic import BaseModel,constr, conint, EmailStr, Field, validator, HttpUrl, field_validator
from datetime import datetime, date
from typing import Optional, List, Union 
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
    
# class Batch(BaseModel):
#     batchname: str
#     courseid: str
#     created_at: Optional[datetime]  
#     updated_at: Optional[datetime]  

#     class Config:
#         from_attributes = True  

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
    name: Optional[str] = None
    startdate: Optional[datetime] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    priority: Optional[str] = None
    workstatus: Optional[str] = None
    source: Optional[str] = None
    workexperience: Optional[str] = None
    sourcename: Optional[str] = None
    # course: Optional[str] = 'QA'
    course: Optional[str] = None
    intent: Optional[str] = None
    attendedclass: Optional[str] = None
    siteaccess: Optional[str] = None
    assignedto: Optional[str] = None
    status: Optional[str] = 'Open'
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
    zip: Optional[str] = None
    faq: Optional[str] = None
    callsmade: Optional[int] = 0
    closedate: Optional[date] = None
    notes: Optional[str] = None
    lastmoddatetime: Optional[datetime] = None

    @validator('startdate', 'lastmoddatetime', pre=True)
    def parse_datetime(cls, value):
        if value in ('0000-00-00 00:00:00', None):
            return None
        return value

    @validator('closedate', pre=True)
    def parse_date(cls, value):
        if value in ('0000-00-00', None):
            return None
        return value

class LeadCreate(LeadBase):
    name: str
    email: str

    @validator('startdate', 'closedate', pre=True)
    def parse_dates(cls, value):
        if not value:
            return None
        if isinstance(value, datetime):
            return value  # Already a datetime object, no need to convert
        try:
            return datetime.fromisoformat(value.replace("Z", ""))  # Remove 'Z' before parsing
        except ValueError:
            raise ValueError(f"Invalid datetime format: {value}. Expected format: YYYY-MM-DD HH:MM:SS")

class LeadUpdate(LeadBase):
    status: Optional[str] = None
    startdate: Optional[str] = None
    closedate: Optional[str] = None
    
    @validator('startdate', 'closedate', pre=True)
    def parse_dates(cls, value):
        if value is None:
            return None
        if isinstance(value, datetime):
            return value.isoformat()
        return value

class LeadResponse(LeadBase):
    leadid: int

    class Config:
        from_attributes = True  # Replaces orm_mode in Pydantic V2
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None,
            date: lambda v: v.isoformat() if v else None
        }

class LeadSearchResponse(BaseModel):
    data: list[LeadResponse]
    totalRows: int


class UserCreate(BaseModel):
    username: str  
    password: str  

class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str  
    token_type: str  

# class Batch(BaseModel):
#     batchname: str
#     courseid: str
#     created_at: Optional[datetime]  
#     updated_at: Optional[datetime]  
#     class Config:
#         from_attributes = True  

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




# class CandidateBase(BaseModel):
#     name: str
#     email: EmailStr
#     phone: str
#     course: str
#     batchname: str
#     enrolleddate: date
#     status: str
#     diceflag: Optional[bool] = None
#     education: Optional[str] = None
#     workstatus: Optional[str] = None
#     dob: Optional[date] = None
#     portalid: Optional[str] = None
#     agreement: Optional[bool] = None
#     driverslicense: Optional[bool] = None
#     workpermit: Optional[bool] = None
#     wpexpirationdate: Optional[date] = None
#     offerletterurl: Optional[str] = None
#     ssnvalidated: Optional[bool] = None
#     address: Optional[str] = None
#     city: Optional[str] = None
#     state: Optional[str] = None
#     country: Optional[str] = None
#     zip: Optional[str] = None
#     emergcontactname: Optional[str] = None
#     emergcontactemail: Optional[EmailStr] = None
#     emergcontactphone: Optional[str] = None
#     emergcontactaddrs: Optional[str] = None
#     guidelines: Optional[str] = None
#     term: Optional[str] = None
#     referralid: Optional[int] = None
#     salary0: Optional[float] = None
#     salary6: Optional[float] = None
#     salary12: Optional[float] = None
#     originalresume: Optional[str] = None
#     notes: Optional[str] = None

#     @validator('dob', 'wpexpirationdate', pre=True)
#     def validate_dates(cls, value):
#         if value == "" or value is None:
#             return None
#         return value
    
#     @validator('course')
#     def validate_course(cls, v):
#         if v not in ["QA", "UI", "ML"]:
#             raise ValueError("Course must be one of: QA, UI, ML")
#         return v
    
#     @validator('ssnvalidated', 'agreement', 'driverslicense', 'workpermit', 'diceflag', pre=True)
#     def validate_booleans(cls, value):
#         if value == "" or value is None:
#             return None
#         return value
    
#     @validator('referralid', pre=True)
#     def validate_integers(cls, value):
#         if value == "" or value is None:
#             return None
#         return value
    
#     @validator('salary0', 'salary6', 'salary12', pre=True)
#     def validate_floats(cls, value):
#         if value == "" or value is None:
#             return None
#         return value
        
#     @validator('emergcontactemail', pre=True)
#     def validate_email(cls, value):
#         if value == "" or value is None:
#             return None
#         return value
    
#     @validator('portalid', pre=True)
#     def validate_portalid(cls, value):
#         if value is None:
#             return None
#         return str(value)  # Convert integer to string
    
#     @validator('status')
#     def validate_status(cls, v):
#         valid_statuses = [
#             "Active",
#             "Discontinued", 
#             "Break",
#             "Marketing",
#             "Placed",
#             "OnProject-Mkt",
#             "Completed",
#             "Defaulted"
#         ]
#         if v not in valid_statuses:
#             raise ValueError(f"Status must be one of: {', '.join(valid_statuses)}")
#         return v

#     # @validator('portalid', pre=True)
#     # def validate_portalid(cls, value):
#     #     if value is None:
#     #       return None
#     #   return str(value)  # Convert to string if it's an integer

# class CandidateCreate(CandidateBase):
#     pass

# class CandidateUpdate(CandidateBase):
#     pass

# class CandidateResponse(CandidateBase):
#     candidateid: int
#     pass
#     class Config:
#         orm_mode = True

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

    @validator('dob', 'wpexpirationdate', pre=True)
    def validate_dates(cls, value):
        if value == "" or value is None:
            return None
        return value
    
    @validator('course')
    def validate_course(cls, v):
        if v not in ["QA", "UI", "ML"]:
            raise ValueError("Course must be one of: QA, UI, ML")
        return v
    
    @validator('ssnvalidated', 'agreement', 'driverslicense', 'workpermit', 'diceflag', pre=True)
    def validate_booleans(cls, value):
        if value == "" or value is None:
            return None
        return value
    
    @validator('referralid', pre=True)
    def validate_integers(cls, value):
        if value == "" or value is None:
            return None
        return value
    
    @validator('salary0', 'salary6', 'salary12', pre=True)
    def validate_floats(cls, value):
        if value == "" or value is None:
            return None
        return value
        
    @validator('emergcontactemail', pre=True)
    def validate_email(cls, value):
        if value == "" or value is None:
            return None
        return value
    
    @validator('portalid', pre=True)
    def validate_portalid(cls, value):
        if value is None:
            return None
        return str(value)  # Convert integer to string
    
    @validator('status')
    def validate_status(cls, v):
        valid_statuses = [
            "Active",
            "Discontinued", 
            "Break",
            "Marketing",
            "Placed",
            "OnProject-Mkt",
            "Completed",
            "Defaulted"
        ]
        if v not in valid_statuses:
            raise ValueError(f"Status must be one of: {', '.join(valid_statuses)}")
        return v

    # @validator('portalid', pre=True)
    # def validate_portalid(cls, value):
    #     if value is None:
    #       return None
    #   return str(value)  # Convert to string if it's an integer

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
    courseid: Optional[int] = None  

class BatchUpdate(BaseModel):
    batchname: Optional[constr(max_length=100)] = None
    current: Optional[constr(min_length=1, max_length=1)] = None
    orientationdate: Optional[date] = None
    subject: Optional[constr(max_length=45)] = None
    startdate: Optional[date] = None
    enddate: Optional[date] = None
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

# class POCreateSchema(BaseModel):
#     placementid: int
#     begindate: Optional[date]
#     enddate: Optional[date]
#     rate: Optional[float]
#     overtimerate: Optional[float]
#     freqtype: Optional[str]
#     frequency: Optional[int]
#     invoicestartdate: Optional[date]
#     invoicenet: Optional[float]
#     polink: Optional[str]
#     notes: Optional[str]

MIN_DATE = date(1000, 1, 1)

class POCreateSchema(BaseModel):
    placementid: int
    begindate: date = MIN_DATE  # Required field with default minimum date
    enddate: Optional[date] = None  # Can be NULL as per your schema
    rate: float
    overtimerate: Optional[float] = None
    freqtype: str
    frequency: int = 0
    invoicestartdate: date = MIN_DATE  # Required field with default minimum date
    invoicenet: int = 0
    polink: Optional[str] = None
    notes: Optional[str] = None

    @validator('begindate', 'invoicestartdate', pre=True)
    def convert_empty_dates(cls, v):
        if v in ("", "0000-00-00", None):
            return MIN_DATE
        return v
    
    @validator('enddate', pre=True)
    def convert_empty_enddate(cls, v):
        if v in ("", "0000-00-00"):
            return None
        return v

# MIN_DATE = date(1000, 1, 1)

# class POCreateSchema(BaseModel):
#     placementid: int
#     begindate: date = MIN_DATE  # Required field with default minimum date
#     enddate: Optional[date] = None  # Can be NULL as per your schema
#     rate: float
#     overtimerate: Optional[float] = None
#     freqtype: str
#     frequency: int = 0
#     invoicestartdate: date = MIN_DATE  # Required field with default minimum date
#     invoicenet: int = 0
#     polink: Optional[str] = None
#     notes: Optional[str] = None

#     @validator('begindate', 'invoicestartdate', pre=True)
#     def convert_empty_dates(cls, v):
#         if v in ("", "0000-00-00", None):
#             return MIN_DATE
#         return v
    
#     @validator('enddate', pre=True)
#     def convert_empty_enddate(cls, v):
#         if v in ("", "0000-00-00"):
#             return None
#         return v

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
    pass

class CandidateMarketingCreateSchema(CandidateMarketingBase):
    pass
class CandidateMarketingUpdateSchema(CandidateMarketingBase):
    
    id: Optional[int] = None
    manager_name: Optional[str] = None  
    instructor_name: Optional[str] = None
    submitter_name: Optional[str] = None
    status: Optional[str] = None
    locationpreference: Optional[str] = None
    priority: Optional[str] = None
    technology: Optional[str] = None
    resumeid: Optional[int] = None
    minrate: Optional[int] = None 
    ipemail: Optional[str] = None 
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
    level: Optional[str] = ''
    instructor: Optional[str] = 'Y'
    override: Optional[str] = 'N'
    status: Optional[str] = 'inactive'
    level3date: Optional[datetime] = None
    # uname: str=''
    # team: Optional[str] = ''
    # level: Optional[str] = ''
    # instructor: Optional[str] = 'Y'
    # override: Optional[str] = 'N'
    # status: Optional[str] = 'inactive'
    # lastlogin: Optional[datetime] = None
    # logincount: Optional[int] = None
    # fullname: Optional[str] = ''
    # address: Optional[str] = ''
    # phone: Optional[str] = None
    # state: Optional[str] = ''
    # zip: Optional[str] = ''
    # city: Optional[str] = ''
    # country: Optional[str] = ''
    # message: Optional[str] = ''
    # registereddate: Optional[datetime] = None
    # level3date: Optional[datetime] = None
    # demo: Optional[str] = 'N'
    # enddate: Optional[date] = None
    # googleId: Optional[str] = ''
    # reset_token: Optional[str] = None
    # token_expiry: Optional[datetime] = None
    # role: Optional[str] = ''

class AuthUserCreateSchema(AuthUserBase):
    passwd: str
class AuthUserUpdateSchema(AuthUserBase):
    level: Optional[str] = ''
    instructor: Optional[str] = 'Y'
    override: Optional[str] = 'N'
    status: Optional[str] = 'inactive'
    level3date: Optional[datetime] = None

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

# class CurrentMarketingUpdateSchema(CurrentMarketingBase):
    
#     candidateid: int
#     # startdate: int
#     mmid: int
#     instructorid: int
#     status: str
#     submitterid: int
#     priority: str
#     technology: str
#     minrate: int
#     currentlocation: str
#     relocation: str
#     locationpreference: str
#     skypeid: str
#     ipemailid: int
#     resumeid: int
#     coverletter: str
#     intro: str
#     closedate: str
#     closedemail: str
#     notes: str
#     suspensionreason: str
#     yearsofexperience: str
class CurrentMarketingUpdateSchema(BaseModel):
    candidateid: Optional[int] = None
    mmid: Optional[int] = None
    instructorid: Optional[int] = None
    status: Optional[str] = None
    submitterid: Optional[int] = None
    priority: Optional[str] = None
    technology: Optional[str] = None
    minrate: Optional[int] = None
    currentlocation: Optional[str] = None
    relocation: Optional[str] = None
    locationpreference: Optional[str] = None
    skypeid: Optional[str] = None
    ipemailid: Optional[int] = None
    resumeid: Optional[int] = None
    coverletter: Optional[str] = None
    intro: Optional[str] = None
    closedate: Optional[str] = None
    closedemail: Optional[str] = None
    notes: Optional[str] = None
    suspensionreason: Optional[str] = None
    yearsofexperience: Optional[str] = None

    class Config:
        extra = "ignore" 
       
class Config:
        orm_mode = True
        from_attributes = True
class CurrentMarketingSchema(CurrentMarketingBase):
    id: int
       
        
    
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
    enddate: Optional[date] = None
    invoicedate: Optional[date] = None
    quantity: Optional[float] = None
    otquantity: Optional[float] = None
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
    poid: Optional[int] = None
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
    # tier: Optional[str] = None
    status: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    fax: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    zip: Optional[str] = None
    url: Optional[str] = None
    manager1name: Optional[str] = None
    twitter: Optional[str] = None
    facebook: Optional[str] = None
    linkedin: Optional[str] = None
    manager1email: Optional[EmailStr] = None
    manager1phone: Optional[str] = None
    hmname: Optional[str] = None
    hmemail: Optional[EmailStr] = None  
    hmphone: Optional[str] = None
    hrname: Optional[str] = None
    hremail: Optional[EmailStr] = None
    hrphone: Optional[str] = None
    notes: Optional[str] = None

    @field_validator("url", mode="before")
    @classmethod
    def validate_url(cls, v):
        if v is None or v.strip() == "":
            return None
        try:
            sanitized_url = sanitize_input(v)
            if not sanitized_url.startswith(('http://', 'https://')):
                sanitized_url = 'https://' + sanitized_url
            return sanitized_url
        except Exception:
            return None

    @field_validator("email", "manager1email", "hmemail", "hremail", mode="before")
    @classmethod
    def validate_email(cls, v):
        if v is None or v.strip() == "":
            return None
        try:
            sanitized_email = sanitize_input(v)
            if '@' not in sanitized_email:
                return None
            return sanitized_email
        except Exception:
            return None

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

class ClientResponseFetch(BaseModel):
        id: int
        name: str
        class Config:
            orm_mode = True
            
class ClientOption(BaseModel):
    id: int
    name: str

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
    type: Optional[str]=None  # Made type optional with a default of None
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
        
class Mkt_submissionBase(BaseModel):
    candidateid: int
    employeeid: int
    submitter: Optional[int]=None
    submissiondate: Optional[str]=None
    # type: str
    name: Optional[str]=None
    email: Optional[str]=None
    phone: Optional[str]=None
    url: Optional[str]=None
    location: Optional[str]=None
    notes: Optional[str]= None
    feedback: Optional[str]=None
    
    @validator('submissiondate', pre=True)
    def validate_submission_date(cls, v):
        if isinstance(v, date):
            return v.isoformat()
        if v in ('0000-00-00', None, ''):
            return None
        return v
    
class Mkt_SubmissionCreate(Mkt_submissionBase):
    pass

class Mkt_SubmissionUpdate(Mkt_submissionBase):
    pass

class Mkt_SubmissionResponse(Mkt_submissionBase):
    id : int
    
class MktSubmissionInDB(Mkt_submissionBase):
    id: int
    
    class Config:
        orm_mode = True
        
# new schemas

# from pydantic import BaseModel, EmailStr, HttpUrl, validator
# from datetime import date, datetime
# from typing import Optional

# URL Schemas
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

# Employee Schemas
class EmployeeBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    status: Optional[str] = None
    startdate: Optional[date] = None
    mgrid: Optional[int] = None
    designationid: Optional[int] = None
    personalemail: Optional[str] = None
    personalphone: Optional[str] = None
    dob: Optional[date] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    zip: Optional[str] = None
    skypeid: Optional[str] = None
    salary: Optional[float] = None
    commission: Optional[bool] = None
    commissionrate: Optional[float] = None
    type: Optional[str] = None
    empagreementurl: Optional[str] = None
    offerletterurl: Optional[str] = None
    dlurl: Optional[str] = None
    workpermiturl: Optional[str] = None
    contracturl: Optional[str] = None
    enddate: Optional[date] = None
    loginid: Optional[int] = None
    responsibilities: Optional[str] = None
    notes: Optional[str] = None

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(EmployeeBase):
    pass

class EmployeeInDB(EmployeeBase):
    id: int

    class Config:
        orm_mode = True

# Vendor Schemas
# class VendorBase(BaseModel):
#     companyname: str
#     status: Optional[str] = None
#     tier: Optional[Union[str, int]] = None 
#     culture: Optional[str] = None
#     solicited: Optional[str] = None
#     minrate: Optional[float] = None
#     hirebeforeterm: Optional[str] = None
#     hireafterterm: Optional[str] = None
#     latepayments: Optional[str] = None
#     totalnetterm: Optional[int] = None
#     defaultedpayment: Optional[str] = None
#     agreementstatus: Optional[str] = None
#     url: Optional[str] = None
#     accountnumber: Optional[str] = None
#     email: Optional[str] = None
#     phone: Optional[str] = None
#     fax: Optional[str] = None
#     address: Optional[str] = None
#     city: Optional[str] = None
#     state: Optional[str] = None
#     country: Optional[str] = None
#     zip: Optional[str] = None
#     twitter: Optional[str] = None
#     facebook: Optional[str] = None
#     linkedin: Optional[str] = None
#     hrname: Optional[str] = None
#     hremail: Optional[str] = None
#     hrphone: Optional[str] = None
#     managername: Optional[str] = None
#     manageremail: Optional[str] = None
#     managerphone: Optional[str] = None
#     secondaryname: Optional[str] = None
#     secondaryemail: Optional[str] = None
#     secondaryphone: Optional[str] = None
#     agreementname: Optional[str] = None
#     agreementlink: Optional[str] = None
#     subcontractorlink: Optional[str] = None
#     nonsolicitationlink: Optional[str] = None
#     nonhirelink: Optional[str] = None
#     clients: Optional[str] = None
#     notes: Optional[str] = None

# class VendorCreate(VendorBase):
#     pass

# class VendorUpdate(VendorBase):
#     pass

# class VendorInDB(VendorBase):
#     id: int
#     crawldate: Optional[datetime] = None
#     lastmoddatetime: Optional[datetime] = None

#     class Config:
#         orm_mode = True

# class VendorResponse(BaseModel):
#     data: List[VendorInDB]
#     total: int
#     page: int
#     page_size: int
#     pages: int

# class VendorDeleteResponse(BaseModel):
#     message: str
#     vendor_id: int

# class VendorCreate(VendorBase):
#     pass

# class VendorUpdate(VendorBase):
#     pass

# *******************
class VendorBase(BaseModel):
    companyname: str
    status: Optional[str] = 'Current'
    accountnumber: Optional[str] = None
    tier: Optional[int] = 2
    email: str
    phone: Optional[str] = '000-000-0000'
    fax: Optional[str] = '000-000-0000'
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    zip: Optional[str] = None
    url: Optional[str] = None
    solicited: Optional[str] = 'N'
    hirebeforeterm: Optional[str] = 'N'
    hireafterterm: Optional[str] = 'N'
    minrate: Optional[int] = 62
    latepayments: Optional[str] = 'N'
    totalnetterm: Optional[int] = 45
    defaultedpayment: Optional[str] = 'N'
    culture: Optional[str] = 'D'
    hrname: Optional[str] = None
    hremail: Optional[str] = None
    hrphone: Optional[str] = None
    managername: Optional[str] = None
    twitter: Optional[str] = None
    facebook: Optional[str] = None
    linkedin: Optional[str] = None
    manageremail: Optional[str] = None
    managerphone: Optional[str] = None
    secondaryname: Optional[str] = None
    secondaryemail: Optional[str] = None
    secondaryphone: Optional[str] = None
    timsheetemail: Optional[str] = None
    agreementstatus: Optional[str] = 'Not Available'
    agreementname: Optional[str] = None
    agreementlink: Optional[str] = None
    subcontractorlink: Optional[str] = None
    nonsolicitationlink: Optional[str] = None
    nonhirelink: Optional[str] = None
    clients: Optional[str] = None
    notes: Optional[str] = None
    crawldate: Optional[date] = date(2014, 1, 1)
    lastmoddatetime: Optional[datetime] = datetime(2014, 1, 1)

class VendorCreate(VendorBase):
    pass

class VendorUpdate(VendorBase):
    pass

class VendorInDB(VendorBase):
    id: int
    
    class Config:
        from_attributes = True

    # model_config = ConfigDict(from_attributes=True)

class VendorResponse(BaseModel):
    data: List[VendorInDB]
    total: int
    page: int
    page_size: int
    pages: int

class VendorDeleteResponse(BaseModel):
    message: str
    vendor_id: int

class VendorSearchBase(BaseModel):
    companyname: Optional[str] = None
    
    
class VendorOption(BaseModel):
    id: int
    name: str
 
    class Config:
         from_attributes = True 
    
# ************************************




# class VendorBase(BaseModel):
#     companyname: str
#     status: str
#     tier: Optional[int] = None
#     culture: Optional[str] = None
#     solicited: Optional[str] = None
#     minrate: Optional[float] = None
#     hirebeforeterm: Optional[str] = None
#     hireafterterm: Optional[str] = None
#     latepayments: Optional[str] = None
#     totalnetterm: Optional[int] = None
#     defaultedpayment: Optional[str] = None
#     agreementstatus: Optional[str] = None
#     url: Optional[str] = None
#     email: Optional[str] = None
#     phone: Optional[str] = None
#     fax: Optional[str] = None
#     address: Optional[str] = None
#     city: Optional[str] = None
#     state: Optional[str] = None
#     country: Optional[str] = None
#     zip: Optional[str] = None
#     hrname: Optional[str] = None
#     hremail: Optional[str] = None
#     hrphone: Optional[str] = None
#     twitter: Optional[str] = None
#     facebook: Optional[str] = None
#     linkedin: Optional[str] = None
#     managername: Optional[str] = None
#     manageremail: Optional[str] = None
#     managerphone: Optional[str] = None
#     secondaryname: Optional[str] = None
#     secondaryemail: Optional[str] = None
#     secondaryphone: Optional[str] = None
#     # timesheetemail: Optional[str] = None
#     agreementname: Optional[str] = None
#     agreementlink: Optional[str] = None
#     subcontractorlink: Optional[str] = None
#     nonsolicitationlink: Optional[str] = None
#     nonhirelink: Optional[str] = None
#     clients: Optional[str] = None
#     notes: Optional[str] = None

class VendorCreate(VendorBase):
    pass

class VendorUpdate(VendorBase):
    pass

class VendorResponse(VendorBase):
    id: int

   

class VendorSearchBase(BaseModel):
    companyname: Optional[str] = None


    class Config:
        orm_mode = True
        from_attributes = True 


class VendorResponse(BaseModel):
    data: List[VendorInDB]
    total: int
    page: int
    page_size: int
    pages: int

class VendorDeleteResponse(BaseModel):
    message: str
    vendor_id: int

class VendorSearchBase(BaseModel):
    companyname: Optional[str] = None


    class Config:
        orm_mode = True
        from_attributes = True 

# Client Schemas
# class ClientBase(BaseModel):
#     companyname: str

# class ClientCreate(ClientBase):
#     pass

# class ClientUpdate(ClientBase):
#     pass

# class ClientInDB(ClientBase):
#     id: int

#     class Config:
#         orm_mode = True
#         from_attributes = True

# Recruiter Schemas
class RecruiterBase(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
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
        if value and len(value) != 1:
            raise ValueError("Review must be exactly one character long.")
        return value

    @validator("status")
    def validate_status(cls, value):
        if value and len(value) != 1:
            raise ValueError("Status must be exactly one character long.")
        return value

    @validator("dob", pre=True)
    def validate_dob(cls, value):
        if value is None or value == "0000-00-00":
            return None
        if isinstance(value, date):
            return value
        if isinstance(value, str):
            try:
                return datetime.strptime(value, "%Y-%m-%d").date()
            except ValueError:
                raise ValueError("Invalid date format. Expected YYYY-MM-DD.")
        raise ValueError(f"Invalid type for date: {type(value)}")

class RecruiterCreate(RecruiterBase):
    pass

class RecruiterUpdate(RecruiterBase):
    pass

class RecruiterInDB(RecruiterBase):
    id: int

    class Config:
        orm_mode = True

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




class VendorOption(BaseModel):
    id: int
    name: str
 
class Config:
    from_attributes = True 
         

class PlacementBase(BaseModel):
    candidateid: Optional[int] = None
    mmid: Optional[int] = None
    recruiterid: Optional[int] = None
    vendorid: Optional[int] = None
    masteragreementid: Optional[str] = None
    otheragreementsids: Optional[str] = None
    vendor2id: Optional[int] = None
    vendor3id: Optional[int] = None
    clientid: Optional[int] = None
    startdate: Optional[date] = None
    enddate: Optional[date] = None
    status: Optional[str] = None
    paperwork: Optional[str] = None
    insurance: Optional[str] = None
    wrklocation: Optional[str] = None
    wrkdesignation: Optional[str] = None
    wrkemail: Optional[EmailStr] = None
    wrkphone: Optional[str] = None
    mgrname: Optional[str] = None
    mgremail: Optional[EmailStr] = None
    mgrphone: Optional[str] = None
    hiringmgrname: Optional[str] = None
    hiringmgremail: Optional[EmailStr] = None
    hiringmgrphone: Optional[str] = None
    reference: Optional[str] = None
    ipemailclear: Optional[str] = None
    feedbackid: Optional[int] = None
    projectdocs: Optional[str] = None
    notes: Optional[str] = None
    
    @validator('wrkemail', 'mgremail', 'hiringmgremail', pre=True)
    def validate_emails(cls, value):
        if value == "" or value is None or (isinstance(value, str) and value.strip() == ""):
            return None
        return value
    
    @validator('masteragreementid', 'otheragreementsids', pre=True)
    def validate_strings(cls, value):
        if isinstance(value, int) and value == 0:
            return None
        if isinstance(value, int):
            return str(value)
        return value
    
    @validator('startdate', 'enddate', pre=True)
    def validate_dates(cls, value):
        if value == "0000-00-00" or value is None or value == "" or (isinstance(value, str) and value.strip() == ""):
            return None
        return value

class PlacementCreate(PlacementBase):
    pass

class PlacementUpdate(PlacementBase):
    pass

class PlacementInDB(PlacementBase):
    id: int
    
    class Config:
        from_attributes = True

class PlacementResponse(BaseModel):
    data: List[PlacementInDB]
    total: int
    page: int
    page_size: int
    pages: int

# For pagination and filtering
class PlacementFilter(BaseModel):
    page: int = 1
    rows: int = 100
    sidx: str = "startdate"  # Sort field
    sord: str = "desc"  # Sort order
    filters: Optional[dict] = None
    
# Select options models
class SelectOption(BaseModel):
    id: str
    name: str = ""  # Default to empty string to avoid None validation error

class PlacementSelectOptions(BaseModel):
    candidates: List[SelectOption]
    managers: List[SelectOption]
    recruiters: List[SelectOption]
    vendors: List[SelectOption]
    clients: List[SelectOption]
    statuses: List[SelectOption]
    yesno: List[SelectOption]
    feedbacks: List[SelectOption]
    class Config:
         from_attributes = True 







from pydantic import BaseModel, field_validator, ConfigDict
from typing import Optional, Union
from datetime import datetime

class LoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # Replaces orm_mode=True
    
    id: int
    name: str
    username: str
    site: Optional[str] = None
    status: str
    type: str
    recoveryemail: Optional[str] = None
    altemail: Optional[str] = None
    phone: Optional[str] = None
    notes: Optional[str] = None
    permissionid1: Optional[str] = None
    permissionid2: Optional[str] = None
    permissionid3: Optional[str] = None
    permissionid4: Optional[str] = None
    permissionid5: Optional[str] = None
    permissionid6: Optional[str] = None
    permissionid7: Optional[str] = None
    permissionid8: Optional[str] = None

    @field_validator(
        'permissionid1', 'permissionid2', 'permissionid3', 'permissionid4',
        'permissionid5', 'permissionid6', 'permissionid7', 'permissionid8',
        mode='before'
    )
    @classmethod
    def convert_permission_ids(cls, v):
        if v in [None, '0', 0]:
            return None
        return str(v)

class TokenData(BaseModel):
    sub: str
    username: str
    name: str
    status: str
    type: str
    iat: datetime
    exp: datetime
    jti: str
    permissions: dict

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    message: str
    user_details: UserResponse