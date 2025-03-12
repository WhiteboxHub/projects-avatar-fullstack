# avatar-app/projects-api/app/models.py
from sqlalchemy.sql import func
from sqlalchemy import Column, Integer, Enum as SAEnum, String, DateTime, DECIMAL , Float, MetaData, Date, Boolean, Text, ForeignKey, TIMESTAMP, CHAR
from app.database.db import Base
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import Column, String, Integer, DateTime, Enum, Boolean
from typing import ClassVar, Optional
from pydantic_settings import BaseSettings
from datetime import datetime, date
from sqlalchemy.orm import DeclarativeBase
from app.models import Base
from enum import Enum as PyEnum

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    uname = Column(String, unique=True, index=True)
    password = Column(String)



class User(BaseModel):
    __tablename__ = "authuser" 
    id: ClassVar[Column] = Column(Integer, primary_key=True, index=True)
    uname: str = Column(String, unique=True, index=True)
    passwd: str = Column(String)  
    team: str = Column(String)
    email: str = Column(String, unique=True, index=True)


    id: Optional[int]
    uname: str
    passwd: str
    team: str
    email: str



      
class Batch(Base):
    __tablename__ = "batch"
    
    batchid = Column(Integer, primary_key=True, autoincrement=True)
    batchname = Column(String(100), nullable=False)
    current = Column(CHAR(1), nullable=False)  
    orientationdate = Column(Date)
    subject = Column(String(45))
    startdate = Column(Date)
    enddate = Column(Date)
    exams = Column(Integer)
    instructor1 = Column(Integer)
    instructor2 = Column(Integer)
    instructor3 = Column(Integer)
    topicscovered = Column(Text)
    topicsnotcovered = Column(Text)
    lastmoddatetime = Column(TIMESTAMP)
    courseid = Column(Integer)

# class Placement(Base):
#     __tablename__ = 'placement'


#     id = Column(Integer, primary_key=True, index=True)
#     candidateid = Column(Integer)
#     placementDate = Column(DateTime)
  


class Lead(Base):
    __tablename__ = "leads"

    leadid = Column(Integer, primary_key=True, index=True)  
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    sourcename = Column(String)
    course = Column(String)
    status = Column(String) 
    secondaryemail = Column(String)
    secondaryphone = Column(String)
    address = Column(String)
    spousename = Column(String)
    spouseemail = Column(String)
    spousephone = Column(String) 
    spouseoccupationinfo = Column(String) 
    city = Column(String)
    state = Column(String)
    country = Column(String)

  
class Candidate(Base):
    __tablename__ = 'candidate'

    candidateid = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100))
    enrolleddate = Column(Date)
    email = Column(String(100), unique=True)
    course = Column(String(50), nullable=False, default='QA')
    phone = Column(String(100))
    status = Column(String(100))
    workstatus = Column(String(100))
    education = Column(String(100))
    workexperience = Column(String(100))
    ssn = Column(String(45))
    agreement = Column(CHAR(1), default='N')
    promissory = Column(CHAR(1), default='N')
    driverslicense = Column(CHAR(1), default='N')
    workpermit = Column(CHAR(1), default='N')
    wpexpirationdate = Column(Date)
    offerletter = Column(CHAR(1), default='N')
    secondaryemail = Column(String(100))
    secondaryphone = Column(String(45))
    address = Column(String(100))
    city = Column(String(100))
    state = Column(String(100))
    country = Column(String(100))
    zip = Column(String(100))
    linkedin = Column(CHAR(1))
    dob = Column(Date)
    emergcontactname = Column(String(100))
    emergcontactemail = Column(String(100))
    emergcontactphone = Column(String(100))
    emergcontactaddrs = Column(String(100))
    guidelines = Column(CHAR(1), default='N')
    ssnvalidated = Column(CHAR(1), default='N')
    bgv = Column(CHAR(1), default='N')
    term = Column(String(45))
    feepaid = Column(DECIMAL(10,2))
    feedue = Column(DECIMAL(10,2))
    salary0 = Column(String(100))
    salary6 = Column(String(100))
    salary12 = Column(String(100))
    guarantorname = Column(String(300))
    guarantordesignation = Column(String(300))
    guarantorcompany = Column(String(300))
    contracturl = Column(String(250))
    empagreementurl = Column(String(250))
    offerletterurl = Column(String(250))
    dlurl = Column(String(250))
    workpermiturl = Column(String(250))
    ssnurl = Column(String(250))
    referralid = Column(Integer)
    portalid = Column(Integer)
    avatarid = Column(Integer)
    notes = Column(Text)
    batchname = Column(String(100), nullable=False)
    coverletter = Column(Text)
    background = Column(Text)
    recruiterassesment = Column(Text)
    instructorassesment = Column(Text)
    processflag = Column(CHAR(1), nullable=False, default='N')
    defaultprocessflag = Column(CHAR(1), nullable=False, default='N')
    originalresume = Column(String(300))
    lastmoddatetime = Column(TIMESTAMP, nullable=False, default='0000-00-00 00:00:00')
    statuschangedate = Column(Date)
    diceflag = Column(CHAR(1), default='N', comment="This flag is set to 'Y' if it's a dice candidate, otherwise 'N'")
    batchid = Column(Integer, nullable=False)
    emaillist = Column(CHAR(1), default='Y')


class CandidateMarketing(Base):
    __tablename__ = "candidatemarketing"
    id = Column(Integer, primary_key=True, index=True)
    candidateid = Column(Integer, ForeignKey("candidate.candidateid"), nullable=False)



class CandidateSearch(Base):    
    __tablename__ = "candidate"
    __table_args__ = {'extend_existing': True} 
    
    candidateid = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=True)
    enrolleddate = Column(Date)
    email = Column(String(100), nullable=True)
    course = Column(String(50), default='QA', nullable=False)
    phone = Column(String(100), nullable=True)
    status = Column(String(100), nullable=True)
    workstatus = Column(String(100), nullable=True)
    education = Column(String(100), nullable=True)
    workexperience = Column(String(100), nullable=True)
    ssn = Column(String(45), nullable=True)
    agreement = Column(CHAR(1), default='N')
    promissory = Column(CHAR(1), default='N')
    driverslicense = Column(CHAR(1), default='N')
    workpermit = Column(CHAR(1), default='N')
    wpexpirationdate = Column(Date, nullable=True)
    offerletter = Column(CHAR(1), default='N')
    secondaryemail = Column(String(100), nullable=True)
    secondaryphone = Column(String(45), nullable=True)
    address = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    zip = Column(String(100), nullable=True)
    linkedin = Column(CHAR(1), nullable=True)
    dob = Column(Date, nullable=True)
    emergcontactname = Column(String(100), nullable=True)
    emergcontactemail = Column(String(100), nullable=True)
    emergcontactphone = Column(String(100), nullable=True)
    emergcontactaddrs = Column(String(100), nullable=True)
    guidelines = Column(CHAR(1), default='N')
    ssnvalidated = Column(CHAR(1), default='N')
    bgv = Column(CHAR(1), default='N')
    term = Column(String(45), nullable=True)
    feepaid = Column(DECIMAL(10, 2), nullable=True)
    feedue = Column(DECIMAL(10, 2), nullable=True)
    salary0 = Column(String(100), nullable=True)
    salary6 = Column(String(100), nullable=True)
    salary12 = Column(String(100), nullable=True)
    guarantorname = Column(String(300), nullable=True)
    guarantordesignation = Column(String(300), nullable=True)
    guarantorcompany = Column(String(300), nullable=True)
    contracturl = Column(String(250), nullable=True)
    empagreementurl = Column(String(250), nullable=True)
    offerletterurl = Column(String(250), nullable=True)
    dlurl = Column(String(250), nullable=True)
    workpermiturl = Column(String(250), nullable=True)
    ssnurl = Column(String(250), nullable=True)
    referralid = Column(Integer, nullable=True)
    portalid = Column(Integer, nullable=True)
    avatarid = Column(Integer, nullable=True)
    notes = Column(Text, nullable=True)
    batchname = Column(String(100), nullable=False)
    coverletter = Column(Text, nullable=True)
    background = Column(Text, nullable=True)
    recruiterassesment = Column(Text, nullable=True)
    instructorassesment = Column(Text, nullable=True)
    processflag = Column(CHAR(1), default='N', nullable=False)
    defaultprocessflag = Column(CHAR(1), default='N', nullable=False)
    originalresume = Column(String(300), nullable=True)
    lastmoddatetime = Column(TIMESTAMP, nullable=False)
    statuschangedate = Column(Date, nullable=True)
    diceflag = Column(CHAR(1), default='N', nullable=True)
    batchid = Column(Integer, nullable=False)
    emaillist = Column(CHAR(1), default='Y', nullable=True)
    
    
class Placement(Base):
    __tablename__ = "placement"
    __table_args__ = {'extend_existing': True} 
    id = Column(Integer, primary_key=True, index=True)
    candidateid = Column(Integer, ForeignKey("candidate.candidateid"))
    vendorid = Column(Integer, ForeignKey("vendor.id"))
    # clientid = Column(Integer, ForeignKey("client.id"s))
    clientid = Column(Integer, ForeignKey("clients.id"))


    candidate = relationship("Candidate", back_populates="placements")
    vendor = relationship("Vendor", back_populates="placements")
    client = relationship("Client", back_populates="placements")
    po_entries = relationship("PO", back_populates="placement")

class Candidate(Base):
    __tablename__ = "candidate"
    __table_args__ = {'extend_existing': True} 
    candidateid = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    placements = relationship("Placement", back_populates="candidate")

class Vendor(Base):
    __tablename__ = "vendor"

    id = Column(Integer, primary_key=True, index=True)
    companyname = Column(String, nullable=False)

    placements = relationship("Placement", back_populates="vendor")

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    companyname = Column(String(250), unique=True, nullable=False)
    tier = Column(Integer, nullable=False, default=2)
    status = Column(String(45), nullable=False, default="Current")
    email = Column(String(150), unique=True, nullable=False)
    phone = Column(String(150), nullable=False, default="000-000-0000")
    fax = Column(String(150), nullable=False, default="000-000-0000")
    address = Column(String(250), nullable=True)
    city = Column(String(150), nullable=True)
    state = Column(String(150), nullable=True)
    country = Column(String(150), nullable=True)
    zip = Column(String(150), nullable=True)
    url = Column(String(150), nullable=False, default="http://nothing.com")
    manager1name = Column(String(150), nullable=True)
    twitter = Column(String(100), nullable=True)
    facebook = Column(String(100), nullable=True)
    linkedin = Column(String(100), nullable=True)
    manager1email = Column(String(150), nullable=True)
    manager1phone = Column(String(150), nullable=True)
    hmname = Column(String(150), nullable=True)
    hmemail = Column(String(150), nullable=True)
    hmphone = Column(String(150), nullable=True)
    hrname = Column(String(150), nullable=True)
    hremail = Column(String(150), nullable=True)
    hrphone = Column(String(150), nullable=True)
    notes = Column(Text, nullable=True)
    lastmoddatetime = Column(TIMESTAMP, nullable=False)
    # placements = relationship("Placement", back_populates="client")
    placements = relationship("Placement", back_populates="client")

    
class PO(Base):
    __tablename__ = "po"

    id = Column(Integer, primary_key=True, index=True)
    placementid = Column(Integer, ForeignKey("placement.id"))
    begindate = Column(Date, nullable=True)
    enddate = Column(Date, nullable=True)
    rate = Column(Float, nullable=True)
    overtimerate = Column(Float, nullable=True)
    freqtype = Column(String, nullable=True)
    frequency = Column(Integer, nullable=True)
    invoicestartdate = Column(Date, nullable=True)
    invoicenet = Column(Float, nullable=True)
    polink = Column(String, nullable=True)
    notes = Column(String, nullable=True)

    placement = relationship("Placement", back_populates="po_entries")



class CandidateMarketing(Base):
    __tablename__ = "candidatemarketing"
    __table_args__ = {'extend_existing': True} 

    id = Column(Integer, primary_key=True, index=True)
    candidateid = Column(Integer, ForeignKey("candidate.candidateid"), nullable=False)
    startdate = Column(DateTime, nullable=False)
    mmid = Column(Integer)
    instructorid = Column(Integer, default=1)
    status = Column(String(45))
    submitterid = Column(Integer)
    priority = Column(String(45), default='P5')
    technology = Column(String(45), default='QA')
    minrate = Column(Integer, default=55)
    currentlocation = Column(String(200))
    relocation = Column(CHAR(3))
    locationpreference = Column(String(200))
    skypeid = Column(String(200))
    ipemailid = Column(Integer, nullable=False, default=0)
    resumeid = Column(Integer, nullable=False, default=0)
    coverletter = Column(Text)
    intro = Column(Text)
    closedate = Column(DateTime)
    closedemail = Column(CHAR(1), default='N')
    notes = Column(Text)
    suspensionreason = Column(CHAR(1), default='A')
    yearsofexperience = Column(CHAR(3))
    
    
class AuthUser(Base):
    __tablename__ = "authuser"

    id = Column(Integer, primary_key=True, index=True)
    uname = Column(String(50), nullable=False, default='')
    passwd = Column(String(32), nullable=False)
    dailypwd = Column(String(255), nullable=True)
    team = Column(String(255), nullable=True)
    level = Column(String(255), nullable=True)
    instructor = Column(CHAR(1), nullable=True)
    override = Column(CHAR(1), nullable=True)
    status = Column(String(255), nullable=True)
    lastlogin = Column(DateTime, nullable=True)
    logincount = Column(Integer, nullable=True)
    fullname = Column(String(50), nullable=True)
    address = Column(String(50), nullable=True)
    phone = Column(String(20), nullable=True)
    state = Column(String(45), nullable=True)
    zip = Column(String(45), nullable=True)
    city = Column(String(45), nullable=True)
    country = Column(String(45), nullable=True)
    message = Column(Text, nullable=True)
    registereddate = Column(DateTime, nullable=True)
    level3date = Column(DateTime, nullable=True)
    lastmoddatetime = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)
    demo = Column(CHAR(1), nullable=False, default='N')
    enddate = Column(Date, nullable=False, default='1990-01-01')
    googleId = Column(String(255), nullable=True)
    reset_token = Column(String(255), nullable=True)
    token_expiry = Column(DateTime, nullable=True)
    role = Column(String(100), nullable=True)    
    
class CurrentMarketing(Base):
    __tablename__ = "currentmarketing"
    # __table_args__ = {'extend_existing': True} 
    id = Column(Integer, primary_key=True, index=True)
    candidateid = Column(Integer, ForeignKey("candidate.candidateid"), nullable=False)
    startdate = Column(DateTime, nullable=False)
    mmid = Column(Integer)
    instructorid = Column(Integer, default=1)
    status = Column(String(45))
    submitterid = Column(Integer)
    priority = Column(String(45), default='P5')
    technology = Column(String(45), default='QA')
    minrate = Column(Integer, default=55)
    currentlocation = Column(String(200))
    relocation = Column(CHAR(3))
    locationpreference = Column(String(200))
    skypeid = Column(String(200))
    ipemailid = Column(Integer, nullable=False, default=0)
    resumeid = Column(Integer, nullable=False, default=0)
    coverletter = Column(Text)
    intro = Column(Text)
    closedate = Column(DateTime)
    closedemail = Column(CHAR(1), default='N')
    notes = Column(Text)
    suspensionreason = Column(CHAR(1), default='A')
    yearsofexperience = Column(CHAR(3))    
    
    
class Overdue(Base):
    __tablename__ = "overdue"

    id = Column(Integer, primary_key=True, index=True)
    poid = Column(Integer, ForeignKey("po.id"))
    invoicenumber = Column(String, nullable=True)
    invoicedate = Column(Date, nullable=True)
    quantity = Column(Integer, nullable=True)
    rate = Column(Float, nullable=True)
    expecteddate = Column(Date, nullable=True)
    amountexpected = Column(Float, nullable=True)
    startdate = Column(Date, nullable=True)
    enddate = Column(Date, nullable=True)
    status = Column(String, nullable=True)
    remindertype = Column(String, nullable=True)
    amountreceived = Column(Float, nullable=True)
    receiveddate = Column(Date, nullable=True)
    releaseddate = Column(Date, nullable=True)
    checknumber = Column(String, nullable=True)
    invoiceurl = Column(String, nullable=True)
    checkurl = Column(String, nullable=True)
    companyname = Column(String, nullable=True)
    vendorfax = Column(String, nullable=True)
    vendorphone = Column(String, nullable=True)
    vendoremail = Column(String, nullable=True)
    timsheetemail = Column(String, nullable=True)
    hrname = Column(String, nullable=True)
    hremail = Column(String, nullable=True)
    hrphone = Column(String, nullable=True)
    managername = Column(String, nullable=True)
    manageremail = Column(String, nullable=True)
    managerphone = Column(String, nullable=True)
    secondaryname = Column(String, nullable=True)
    secondaryemail = Column(String, nullable=True)
    secondaryphone = Column(String, nullable=True)
    candidatename = Column(String, nullable=True)
    candidatephone = Column(String, nullable=True)
    candidateemail = Column(String, nullable=True)
    wrkemail = Column(String, nullable=True)
    wrkphone = Column(String, nullable=True)
    recruitername = Column(String, nullable=True)
    recruiterphone = Column(String, nullable=True)
    recruiteremail = Column(String, nullable=True)
    notes = Column(String, nullable=True)    
