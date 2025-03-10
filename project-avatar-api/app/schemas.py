# avatar-app/projects-api/app/schemas.py
from pydantic import BaseModel,constr, conint, EmailStr, Field,validator
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
    # candidateid: int
    candidateid: Optional[int] = None
    # startdate: datetime
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
    closedate: Optional[datetime] = None
    closedemail: Optional[str] = None
    notes: Optional[str] = None
    suspensionreason: Optional[str] = None
    yearsofexperience: Optional[str] = None

class CandidateMarketingCreateSchema(CandidateMarketingBase):
    pass

class CandidateMarketingUpdateSchema(CandidateMarketingBase):
    pass

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
    candidateid: Optional[int] = None
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
    pass
    class Config:
        orm_mode = True

class CurrentMarketingSchema(CurrentMarketingBase):
    id: int

    class Config:
        from_attributes = True
        
    
    

class OverdueUpdateSchema(BaseModel):
    invoicenumber: Optional[str]
    invoicedate: Optional[date]
    quantity: Optional[int]
    amountreceived: Optional[float]
    receiveddate: Optional[date]
    releaseddate: Optional[date]
    checknumber: Optional[str]
    invoiceurl: Optional[str]
    checkurl: Optional[str]
    notes: Optional[str]
    status: Optional[str]
    remindertype: Optional[str]    
    