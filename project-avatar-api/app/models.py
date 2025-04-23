# # avatar-app/projects-api/app/models.py
# from sqlalchemy.sql import func, text
# from sqlalchemy import Column, Integer, Enum as SAEnum, String, DateTime, DECIMAL, Float, MetaData, Date, Boolean, Text, ForeignKey, TIMESTAMP, CHAR, Numeric
# from app.database.db import Base
# from pydantic import BaseModel, EmailStr ,validator, ValidationError
# from sqlalchemy.orm import declarative_base, relationship
# from typing import ClassVar, Optional
# from pydantic_settings import BaseSettings
# from datetime import datetime, date
# from sqlalchemy.orm import DeclarativeBase
# from enum import Enum as PyEnum

# Base = declarative_base()

# class User(Base):
#     __tablename__ = "users"
#     id = Column(Integer, primary_key=True, index=True)
#     uname = Column(String, unique=True, index=True)
#     password = Column(String)


# class Employee(Base):
#     __tablename__ = 'employee'

#     id = Column(Integer, primary_key=True, autoincrement=True)
#     name = Column(String(150))
#     email = Column(String(150), unique=True)
#     phone = Column(String(150))
#     personalemail = Column(String(150))
#     personalphone = Column(String(150))
#     status = Column(String(45))
#     startdate = Column(Date)
#     address = Column(String(250))
#     city = Column(String(150))
#     state = Column(String(150))
#     country = Column(String(150))
#     zip = Column(String(45))
#     skypeid = Column(String(150))
#     dob = Column(Date)
#     salary = Column(Numeric(19, 4))
#     type = Column(String(45))
#     mgrid = Column(Integer)
#     commission = Column(String(1))
#     commissionrate = Column(Numeric(19, 4))
#     enddate = Column(Date)
#     loginid = Column(Integer)
#     responsibilities = Column(Text)
#     notes = Column(Text)
#     designationid = Column(Integer)
#     dlurl = Column(String(250))
#     empagreementurl = Column(String(250))
#     offerletterurl = Column(String(250))
#     workpermiturl = Column(String(250))
#     contracturl = Column(String(250))

# # class PlacementModel(Base):
# #     __tablename__ = "placement"
# #     __table_args__ = {'extend_existing': True} 

# #     id = Column(Integer, primary_key=True, index=True)
# #     candidateid = Column(Integer, ForeignKey("candidate.candidateid"))
# #     mmid = Column(Integer, nullable=True)
# #     recruiterid = Column(Integer, nullable=True)
# #     vendorid = Column(Integer, ForeignKey("vendor.id"), nullable=True)
# #     masteragreementid = Column(String, nullable=True)
# #     otheragreementsids = Column(String, nullable=True)
# #     vendor2id = Column(Integer, ForeignKey("vendor.id"), nullable=True)
# #     vendor3id = Column(Integer, ForeignKey("vendor.id"), nullable=True)
# #     clientid = Column(Integer, ForeignKey("client.id"), nullable=True)
# #     startdate = Column(Date, nullable=True)
# #     enddate = Column(Date, nullable=True)
# #     status = Column(String, nullable=True)
# #     paperwork = Column(String, nullable=True)
# #     insurance = Column(String, nullable=True)
# #     wrklocation = Column(String, nullable=True)
# #     wrkdesignation = Column(String, nullable=True)
# #     wrkemail = Column(String, nullable=True)
# #     wrkphone = Column(String, nullable=True)
# #     mgrname = Column(String, nullable=True)
# #     mgremail = Column(String, nullable=True)
# #     mgrphone = Column(String, nullable=True)
# #     hiringmgrname = Column(String, nullable=True)
# #     hiringmgremail = Column(String, nullable=True)
# #     hiringmgrphone = Column(String, nullable=True)
# #     reference = Column(String, nullable=True)
# #     ipemailclear = Column(String, nullable=True)
# #     feedbackid = Column(Integer, nullable=True)
# #     projectdocs = Column(String, nullable=True)
# #     notes = Column(Text, nullable=True)
    
# #     # Relationships
# # #     candidate = relationship("Candidate", back_populates="placements1")
# # #     client_info = relationship(
# # #         "Client",
# # #         foreign_keys=[clientid],
# # #         uselist=False,
# # #         overlaps="placements",
# # #         viewonly=True
# # # )
    
# #     po_entries = relationship("PO", back_populates="placement1")
# #     # Updated relationships
# #     vendor = relationship("Vendor", foreign_keys=[vendorid], back_populates="placements1")
# #     vendor2 = relationship("Vendor", foreign_keys=[vendor2id], back_populates="placements1_vendor2")
# #     vendor3 = relationship("Vendor", foreign_keys=[vendor3id], back_populates="placements1_vendor3")
   

# class Course(Base):
#     __tablename__ = 'course'

#     id = Column(Integer, primary_key=True, autoincrement=True)
#     name = Column(String(200), nullable=False, default='Quality Engineering')
#     alias = Column(String(200), nullable=True)
#     description = Column(Text, nullable=False)
#     syllabus = Column(Text, nullable=False)
#     lastmoddatetime = Column(TIMESTAMP, nullable=False, server_default=text('0000-00-00 00:00:00'))
#     displayquestion = Column(String(200), nullable=False)
#     displayanswer = Column(String(500), nullable=False)
#     courseaddition = Column(String(500), nullable=False)
#     certificatetitle = Column(String(500), nullable=True)

#     # Establish a one-to-many relationship with Batch
#     batches = relationship('Batch', back_populates='course')
    
# class User(BaseModel):
#     __tablename__ = "authuser" 
#     id: ClassVar[Column] = Column(Integer, primary_key=True, index=True)
#     uname: str = Column(String, unique=True, index=True)
#     passwd: str = Column(String)  
#     team: str = Column(String)
#     email: str = Column(String, unique=True, index=True)

#     id: Optional[int]
#     uname: str
#     passwd: str
#     team: str
#     email: str

# class Batch(Base):
#     __tablename__ = "batch"
    
#     batchid = Column(Integer, primary_key=True, autoincrement=True)
#     batchname = Column(String(100), nullable=False)
#     current = Column(CHAR(1), nullable=False)  
#     orientationdate = Column(Date)
#     subject = Column(String(45))
#     startdate = Column(Date)
#     enddate = Column(Date)
#     instructor1 = Column(Integer)
#     instructor2 = Column(Integer)
#     instructor3 = Column(Integer)
#     topicscovered = Column(Text)
#     topicsnotcovered = Column(Text)
#     lastmoddatetime = Column(TIMESTAMP)
#     courseid = Column(Integer, ForeignKey('course.id'))  # Define the foreign key constraint
#     course = relationship('Course', back_populates='batches')

# # class Placement(Base):
# #     __tablename__ = 'placement'
# #     id = Column(Integer, primary_key=True, index=True)
# #     candidateid = Column(Integer)
# #     placementDate = Column(DateTime)

# class Lead(Base):
#     __tablename__ = "leads"

#     leadid = Column(Integer, primary_key=True, index=True)
#     name = Column(String(100), index=True)
#     startdate = Column(DateTime)
#     phone = Column(String(45))
#     email = Column(String(45), nullable=False, index=True)
#     priority = Column(String(2))
#     workstatus = Column(String(10))
#     source = Column(String(10))
#     workexperience = Column(String(150))
#     sourcename = Column(String(100))
#     course = Column(String(10), default="QA")
#     intent = Column(String(45))
#     attendedclass = Column(String(1))
#     siteaccess = Column(String(1))
#     assignedto = Column(String(45))
#     status = Column(String(45), default="Open")
#     secondaryemail = Column(String(100))
#     secondaryphone = Column(String(45))
#     address = Column(String(100))
#     spousename = Column(String(100))
#     spouseemail = Column(String(45))
#     spousephone = Column(String(45))
#     spouseoccupationinfo = Column(String(250))
#     city = Column(String(100))
#     state = Column(String(100))
#     country = Column(String(100))
#     zip = Column(String(100))
#     faq = Column(String(1))
#     callsmade = Column(Integer, default=0)
#     closedate = Column(Date)
#     notes = Column(Text)
#     lastmoddatetime = Column(DateTime, server_default='CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    

# class Candidate(Base):
#     __tablename__ = 'candidate'

#     candidateid = Column(Integer, primary_key=True, autoincrement=True)
#     name = Column(String(100))
#     enrolleddate = Column(Date)
#     email = Column(String(100), unique=True)
#     course = Column(String(50), nullable=False, default='QA')
#     phone = Column(String(100))
#     status = Column(String(100))
#     workstatus = Column(String(100))
#     education = Column(String(100))
#     workexperience = Column(String(100))
#     ssn = Column(String(45))
#     agreement = Column(CHAR(1), default='N')
#     promissory = Column(CHAR(1), default='N')
#     driverslicense = Column(CHAR(1), default='N')
#     workpermit = Column(CHAR(1), default='N')
#     wpexpirationdate = Column(Date)
#     offerletter = Column(CHAR(1), default='N')
#     secondaryemail = Column(String(100))
#     secondaryphone = Column(String(45))
#     address = Column(String(100))
#     city = Column(String(100))
#     state = Column(String(100))
#     country = Column(String(100))
#     zip = Column(String(100))
#     linkedin = Column(CHAR(1))
#     dob = Column(Date)
#     emergcontactname = Column(String(100))
#     emergcontactemail = Column(String(100))
#     emergcontactphone = Column(String(100))
#     emergcontactaddrs = Column(String(100))
#     guidelines = Column(CHAR(1), default='N')
#     ssnvalidated = Column(CHAR(1), default='N')
#     bgv = Column(CHAR(1), default='N')
#     term = Column(String(45))
#     feepaid = Column(DECIMAL(10,2))
#     feedue = Column(DECIMAL(10,2))
#     salary0 = Column(String(100))
#     salary6 = Column(String(100))
#     salary12 = Column(String(100))
#     guarantorname = Column(String(300))
#     guarantordesignation = Column(String(300))
#     guarantorcompany = Column(String(300))
#     contracturl = Column(String(250))
#     empagreementurl = Column(String(250))
#     offerletterurl = Column(String(250))
#     dlurl = Column(String(250))
#     workpermiturl = Column(String(250))
#     ssnurl = Column(String(250))
#     referralid = Column(Integer)
#     portalid = Column(Integer)
#     avatarid = Column(Integer)
#     notes = Column(Text)
#     batchname = Column(String(100), nullable=False)
#     coverletter = Column(Text)
#     background = Column(Text)
#     recruiterassesment = Column(Text)
#     instructorassesment = Column(Text)
#     processflag = Column(CHAR(1), nullable=False, default='N')
#     defaultprocessflag = Column(CHAR(1), nullable=False, default='N')
#     originalresume = Column(String(300))
#     lastmoddatetime = Column(TIMESTAMP, nullable=False, default='0000-00-00 00:00:00')
#     statuschangedate = Column(Date)
#     diceflag = Column(CHAR(1), default='N', comment="This flag is set to 'Y' if it's a dice candidate, otherwise 'N'")
#     batchid = Column(Integer, nullable=False)
#     emaillist = Column(CHAR(1), default='Y')
#     # mkt_submissions = relationship("MktSubmission", back_populates="candidate")
#     # placements = relationship("Placement", back_populates="candidate")
#     # 
#     # Change these lines in Candidate model
#     mkt_submissions = relationship("MktSubmission", back_populates="candidate", viewonly=True)
#     placements = relationship("Placement", back_populates="candidate", viewonly=True)
#     placements1 = relationship("PlacementModel", back_populates="candidate")

# class CandidateSearch(Base):    
#     __tablename__ = "candidate"
#     __table_args__ = {'extend_existing': True} 
    
#     candidateid = Column(Integer, primary_key=True, autoincrement=True)
#     name = Column(String(100), nullable=True)
#     enrolleddate = Column(Date)
#     email = Column(String(100), nullable=True)
#     course = Column(String(50), default='QA', nullable=False)
#     phone = Column(String(100), nullable=True)
#     status = Column(String(100), nullable=True)
#     workstatus = Column(String(100), nullable=True)
#     education = Column(String(100), nullable=True)
#     workexperience = Column(String(100), nullable=True)
#     ssn = Column(String(45), nullable=True)
#     agreement = Column(CHAR(1), default='N')
#     promissory = Column(CHAR(1), default='N')
#     driverslicense = Column(CHAR(1), default='N')
#     workpermit = Column(CHAR(1), default='N')
#     wpexpirationdate = Column(Date, nullable=True)
#     offerletter = Column(CHAR(1), default='N')
#     secondaryemail = Column(String(100), nullable=True)
#     secondaryphone = Column(String(45), nullable=True)
#     address = Column(String(100), nullable=True)
#     city = Column(String(100), nullable=True)
#     state = Column(String(100), nullable=True)
#     country = Column(String(100), nullable=True)
#     zip = Column(String(100), nullable=True)
#     linkedin = Column(CHAR(1), nullable=True)
#     dob = Column(Date, nullable=True)
#     emergcontactname = Column(String(100), nullable=True)
#     emergcontactemail = Column(String(100), nullable=True)
#     emergcontactphone = Column(String(100), nullable=True)
#     emergcontactaddrs = Column(String(100), nullable=True)
#     guidelines = Column(CHAR(1), default='N')
#     ssnvalidated = Column(CHAR(1), default='N')
#     bgv = Column(CHAR(1), default='N')
#     term = Column(String(45), nullable=True)
#     feepaid = Column(DECIMAL(10, 2), nullable=True)
#     feedue = Column(DECIMAL(10, 2), nullable=True)
#     salary0 = Column(String(100), nullable=True)
#     salary6 = Column(String(100), nullable=True)
#     salary12 = Column(String(100), nullable=True)
#     guarantorname = Column(String(300), nullable=True)
#     guarantordesignation = Column(String(300), nullable=True)
#     guarantorcompany = Column(String(300), nullable=True)
#     contracturl = Column(String(250), nullable=True)
#     empagreementurl = Column(String(250), nullable=True)
#     offerletterurl = Column(String(250), nullable=True)
#     dlurl = Column(String(250), nullable=True)
#     workpermiturl = Column(String(250), nullable=True)
#     ssnurl = Column(String(250), nullable=True)
#     referralid = Column(Integer, nullable=True)
#     portalid = Column(Integer, nullable=True)
#     avatarid = Column(Integer, nullable=True)
#     notes = Column(Text, nullable=True)
#     batchname = Column(String(100), nullable=False)
#     coverletter = Column(Text, nullable=True)
#     background = Column(Text, nullable=True)
#     recruiterassesment = Column(Text, nullable=True)
#     instructorassesment = Column(Text, nullable=True)
#     processflag = Column(CHAR(1), default='N', nullable=False)
#     defaultprocessflag = Column(CHAR(1), default='N', nullable=False)
#     originalresume = Column(String(300), nullable=True)
#     lastmoddatetime = Column(TIMESTAMP, nullable=False)
#     statuschangedate = Column(Date, nullable=True)
#     diceflag = Column(CHAR(1), default='N', nullable=True)
#     batchid = Column(Integer, nullable=False)
#     emaillist = Column(CHAR(1), default='Y', nullable=True)

# class Placement(Base):
#     __tablename__ = "placement"
#     __table_args__ = {'extend_existing': True} 
#     id = Column(Integer, primary_key=True, index=True)
#     candidateid = Column(Integer, ForeignKey("candidate.candidateid"))
#     vendorid = Column(Integer, ForeignKey("vendor.id"))
#     clientid = Column(Integer, ForeignKey("client.id"))
#     candidate = relationship("Candidate", back_populates="placements", viewonly=True)
#     vendor = relationship("Vendor", back_populates="placements")
#     client = relationship("Client", back_populates="placements")
#     po_entries = relationship("PO", back_populates="placement")

# class Vendor(Base):
#     __tablename__ = "vendor"

#     id = Column(Integer, primary_key=True, index=True)
#     companyname = Column(String, nullable=False)

#     placements = relationship("Placement", back_populates="vendor")
#     recruiters = relationship("Recruiter", back_populates="vendor")
#     # placements1 = relationship("PlacementModel", foreign_keys=[PlacementModel.vendorid], back_populates="vendor")
#     # placements1_vendor2 = relationship("PlacementModel", foreign_keys=[PlacementModel.vendor2id], back_populates="vendor2")
#     # placements1_vendor3 = relationship("PlacementModel", foreign_keys=[PlacementModel.vendor3id], back_populates="vendor3")
# class Client(Base):
#     __tablename__ = "client"

#     id = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     companyname = Column(String(250), unique=True, nullable=False)
#     tier = Column(String(45), nullable=False, default="STANDARD")
#     status = Column(String(45), nullable=False, default="ACTIVE")
#     email = Column(String(150), nullable=False)
#     phone = Column(String(150), nullable=False, default="000-000-0000")
#     fax = Column(String(150), nullable=True)
#     address = Column(String(250), nullable=True)
#     city = Column(String(150), nullable=True)
#     state = Column(String(150), nullable=True)
#     country = Column(String(150), nullable=True)
#     zip = Column(String(150), nullable=True)
#     url = Column(String(150), nullable=True)
#     twitter = Column(String(100), nullable=True)
#     facebook = Column(String(100), nullable=True)
#     linkedin = Column(String(100), nullable=True)
#     manager1name = Column(String(150), nullable=True)
#     manager1email = Column(String(150), nullable=True)
#     manager1phone = Column(String(150), nullable=True)
#     hmname = Column(String(150), nullable=True)
#     hmemail = Column(String(150), nullable=True)
#     hmphone = Column(String(150), nullable=True)
#     hrname = Column(String(150), nullable=True)
#     hremail = Column(String(150), nullable=True)
#     hrphone = Column(String(150), nullable=True)
#     notes = Column(Text, nullable=True)
#     lastmoddatetime = Column(TIMESTAMP, nullable=False, server_default=func.now())

#     placements = relationship("Placement", back_populates="client")
#     recruiters = relationship("Recruiter", back_populates="client")
#     # placements1 = relationship(
#     #     "PlacementModel", 
#     #     foreign_keys=[PlacementModel.clientid],
#     #     back_populates="client",
#     #     viewonly=True
#     # )
# class ClientSearch(Base):
#     __tablename__ = "client"
#     __table_args__ = {'extend_existing': True}

#     id = Column(Integer, primary_key=True, autoincrement=True)
#     companyname = Column(String(250), nullable=True)
#     email = Column(String(150), nullable=True)
#     phone = Column(String(150), nullable=True)
#     city = Column(String(150), nullable=True)
#     state = Column(String(150), nullable=True)
#     country = Column(String(150), nullable=True)
#     zip = Column(String(150), nullable=True)
#     status = Column(String(45), nullable=True)
#     tier = Column(String(45), nullable=True)
#     manager1name = Column(String(150), nullable=True)
#     hmname = Column(String(150), nullable=True)
#     hrname = Column(String(150), nullable=True)
#     lastmoddatetime = Column(TIMESTAMP, nullable=True)

# class PO(Base):
#     __tablename__ = "po"

#     id = Column(Integer, primary_key=True, index=True)
#     placementid = Column(Integer, ForeignKey("placement.id"))
#     begindate = Column(Date, nullable=True)
#     enddate = Column(Date, nullable=True)
#     rate = Column(Float, nullable=True)
#     overtimerate = Column(Float, nullable=True)
#     freqtype = Column(String, nullable=True)
#     frequency = Column(Integer, nullable=True)
#     invoicestartdate = Column(Date, nullable=True)
#     invoicenet = Column(Float, nullable=True)
#     polink = Column(String, nullable=True)
#     notes = Column(String, nullable=True)

#     placement = relationship("Placement", back_populates="po_entries")
#     invoices = relationship("Invoice", back_populates="po")
#     overdues = relationship("Overdue", back_populates="po")
#     placement1 = relationship("PlacementModel", back_populates="po_entries")

# class CandidateMarketing(Base):
#     __tablename__ = "candidatemarketing"
#     __table_args__ = {'extend_existing': True} 

#     id = Column(Integer, primary_key=True, index=True)
#     candidateid = Column(Integer, ForeignKey("candidate.candidateid"), nullable=False)
#     startdate = Column(DateTime, nullable=False)
#     mmid = Column(Integer)
#     instructorid = Column(Integer, default=1)
#     status = Column(String(45))
#     submitterid = Column(Integer)
#     priority = Column(String(45), default='P5')
#     technology = Column(String(45), default='QA')
#     minrate = Column(Integer, default=55)
#     currentlocation = Column(String(200))
#     relocation = Column(CHAR(3))
#     locationpreference = Column(String(200))
#     skypeid = Column(String(200))
#     ipemailid = Column(Integer, nullable=False, default=0)
#     resumeid = Column(Integer, nullable=False, default=0)
#     coverletter = Column(Text)
#     intro = Column(Text)
#     closedate = Column(DateTime)
#     closedemail = Column(CHAR(1), default='N')
#     notes = Column(Text)
#     suspensionreason = Column(CHAR(1), default='A')
#     yearsofexperience = Column(CHAR(3)) 
    
#     candidate = relationship("Candidate", foreign_keys=[candidateid])
    
# class AuthUser(Base):
#     __tablename__ = "authuser"

#     id = Column(Integer, primary_key=True, index=True)
#     uname = Column(String(50), nullable=False, default='')
#     passwd = Column(String(32), nullable=False)
#     dailypwd = Column(String(255), nullable=True)
#     team = Column(String(255), nullable=True)
#     level = Column(String(255), nullable=True)
#     instructor = Column(CHAR(1), nullable=True)
#     override = Column(CHAR(1), nullable=True)
#     status = Column(String(255), nullable=True)
#     lastlogin = Column(DateTime, nullable=True)
#     logincount = Column(Integer, nullable=True)
#     fullname = Column(String(50), nullable=True)
#     address = Column(String(50), nullable=True)
#     phone = Column(String(20), nullable=True)
#     state = Column(String(45), nullable=True)
#     zip = Column(String(45), nullable=True)
#     city = Column(String(45), nullable=True)
#     country = Column(String(45), nullable=True)
#     message = Column(Text, nullable=True)
#     registereddate = Column(DateTime, nullable=True)
#     level3date = Column(DateTime, nullable=True)
#     lastmoddatetime = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)
#     demo = Column(CHAR(1), nullable=False, default='N')
#     enddate = Column(Date, nullable=False, default='1990-01-01')
#     googleId = Column(String(255), nullable=True)
#     reset_token = Column(String(255), nullable=True)
#     token_expiry = Column(DateTime, nullable=True)
#     role = Column(String(100), nullable=True)    



    
# class CurrentMarketing(Base):
#     __tablename__ = "currentmarketing" 
#     id = Column(Integer, primary_key=True, index=True)
#     candidateid = Column(Integer, ForeignKey("candidate.candidateid"), nullable=False)
#     startdate = Column(DateTime, nullable=False)
#     mmid = Column(Integer)
#     instructorid = Column(Integer, default=1)
#     status = Column(String(45))
#     submitterid = Column(Integer)
#     priority = Column(String(45), default='P5')
#     technology = Column(String(45), default='QA')
#     minrate = Column(Integer, default=55)
#     currentlocation = Column(String(200))
#     relocation = Column(CHAR(3))
#     locationpreference = Column(String(200))
#     skypeid = Column(String(200))
#     ipemailid = Column(Integer, nullable=False, default=0)
#     resumeid = Column(Integer, nullable=False, default=0)
#     coverletter = Column(Text)
#     intro = Column(Text)
#     closedate = Column(DateTime)
#     closedemail = Column(CHAR(1), default='N')
#     notes = Column(Text)
#     suspensionreason = Column(CHAR(1), default='A')
#     yearsofexperience = Column(CHAR(3))    
    
#     candidate = relationship("Candidate", foreign_keys=[candidateid])
    

   
# class Overdue(Base):
#     __tablename__ = "overdue"

#     id = Column(Integer, primary_key=True, index=True)
#     poid = Column(Integer, ForeignKey("po.id"))
#     invoicenumber = Column(String, nullable=True)
#     invoicedate = Column(Date, nullable=True)
#     quantity = Column(Integer, nullable=True)
#     rate = Column(Float, nullable=True)
#     expecteddate = Column(Date, nullable=True)
#     amountexpected = Column(Float, nullable=True)
#     startdate = Column(Date, nullable=True)
#     enddate = Column(Date, nullable=True)
#     status = Column(String, nullable=True)
#     remindertype = Column(String, nullable=True)
#     amountreceived = Column(Float, nullable=True)
#     receiveddate = Column(Date, nullable=True)
#     releaseddate = Column(Date, nullable=True)
#     checknumber = Column(String, nullable=True)
#     invoiceurl = Column(String, nullable=True)
#     checkurl = Column(String, nullable=True)
#     companyname = Column(String, nullable=True)
#     vendorfax = Column(String, nullable=True)
#     vendorphone = Column(String, nullable=True)
#     vendoremail = Column(String, nullable=True)
#     timsheetemail = Column(String, nullable=True)
#     hrname = Column(String, nullable=True)
#     hremail = Column(String, nullable=True)
#     hrphone = Column(String, nullable=True)
#     managername = Column(String, nullable=True)
#     manageremail = Column(String, nullable=True)
#     managerphone = Column(String, nullable=True)
#     secondaryname = Column(String, nullable=True)
#     secondaryemail = Column(String, nullable=True)
#     secondaryphone = Column(String, nullable=True)
#     candidatename = Column(String, nullable=True)
#     candidatephone = Column(String, nullable=True)
#     candidateemail = Column(String, nullable=True)
#     wrkemail = Column(String, nullable=True)
#     wrkphone = Column(String, nullable=True)
#     recruitername = Column(String, nullable=True)
#     recruiterphone = Column(String, nullable=True)
#     recruiteremail = Column(String, nullable=True)
#     notes = Column(String, nullable=True)    

#     po = relationship("PO", back_populates="overdues")

# class Invoice(Base):
#     __tablename__ = "invoice"

#     id = Column(Integer, primary_key=True, index=True)
#     invoicenumber = Column(String(45), unique=True, nullable=False)
#     startdate = Column(Date, nullable=False)
#     enddate = Column(Date, nullable=False)
#     invoicedate = Column(Date, nullable=False)
#     quantity = Column(Numeric(precision=19, scale=1), nullable=False)
#     otquantity = Column(Numeric(precision=19, scale=1), nullable=False, default=0.0)
#     status = Column(String(45), nullable=True)
#     amountreceived = Column(Numeric(precision=19, scale=4), nullable=True)
#     releaseddate = Column(Date, nullable=True)
#     receiveddate = Column(Date, nullable=True)
#     checknumber = Column(String(150), nullable=True)
#     invoiceurl = Column(String(300), nullable=True)
#     checkurl = Column(String(300), nullable=True)
#     reminders = Column(String(1), nullable=False, default='Y')
#     remindertype = Column(String(150), nullable=False, default='Open')
#     emppaiddate = Column(Date, nullable=True)
#     candpaymentstatus = Column(String(45), nullable=False, default='Open')
#     poid = Column(Integer, ForeignKey("po.id"), nullable=False)
#     notes = Column(Text, nullable=True)
#     lastmoddatetime = Column(DateTime, nullable=True, default=datetime.utcnow)

#     po = relationship("PO", back_populates="invoices")


# # Adding recruiter model



# # Adding mkl_submission 

# class MktSubmission(Base):
#     __tablename__ = "mkt_submission"
    
#     id = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     candidateid = Column(Integer, ForeignKey("candidate.candidateid"), nullable=False)
#     employeeid = Column(Integer, ForeignKey("employee.id"), nullable=False)
#     submitter = Column(Integer, ForeignKey("employee.id"), nullable=True)
#     submissiondate = Column(Date, nullable=False)
#     # type = Column(String(45), nullable=False)
#     name = Column(String(150), nullable=True)
#     email = Column(String(150), nullable=True)
#     phone = Column(String(150), nullable=True)
#     url = Column(String(300), nullable=True)
#     location = Column(String(300), nullable=True)
#     notes = Column(Text, nullable=True)
#     feedback = Column(Text, nullable=True)
#     lastmoddatetime = Column(TIMESTAMP, nullable=True, server_default=func.now())
    
#     # candidate = relationship("Candidate", back_populates="mkt_submissions")
#     employee = relationship("Employee", foreign_keys=[employeeid], primaryjoin="MktSubmission.employeeid == Employee.id")
#     submitter_rel = relationship("Employee", foreign_keys=[submitter], primaryjoin="MktSubmission.submitter == Employee.id")
#     # candidate = relationship("Candidate", 
#     #                     back_populates="mkt_submissions",
#     #                     foreign_keys=[candidateid])
#     candidate = relationship("Candidate", back_populates="mkt_submissions", viewonly=True)


    
#     @validator('submissiondate', pre=True, always=True)
#     def validate_submission_date(cls, v):
#         if isinstance(v, date):
#             return v
#         if v in ('0000-00-00', None):
#             return None
#         try:
#             return datetime.strptime(v, '%Y-%m-%d').date()
#         except (ValueError, TypeError):
#             raise ValueError("Invalid date format for submissiondate")









# class Url(Base):
#     __tablename__ = "sales_url_db"

    
#     url = Column(String(255), nullable=False)
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     lastmoddatetime = Column(DateTime, nullable=False, server_default=func.now())  
# # Recruiter Model
# class Recruiter(Base):
#     __tablename__ = "recruiter"

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, nullable=False)
#     email = Column(String, unique=True, nullable=False)
#     phone = Column(String, nullable=False)
#     designation = Column(String, nullable=False)
#     vendorid = Column(Integer, ForeignKey("vendor.id"), nullable=True)
#     status = Column(String, nullable=False)
#     dob = Column(Date, nullable=True)
#     personalemail = Column(String, nullable=True)
#     skypeid = Column(String, nullable=True)
#     linkedin = Column(String, nullable=True)
#     twitter = Column(String, nullable=True)
#     facebook = Column(String, nullable=True)
#     review = Column(String, nullable=True)
#     notes = Column(String, nullable=True)
#     clientid = Column(Integer, ForeignKey("client.id"), nullable=True)

#     # Relationships
#     vendor = relationship("Vendor", back_populates="recruiters")
#     client = relationship("Client", back_populates="recruiters")






# class PlacementRecruiter(Base):
#     __tablename__ = "placement_recruiter"
#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, nullable=False)
#     email = Column(String, nullable=False)
#     phone = Column(String, nullable=False)
#     designation = Column(String, nullable=False)
#     vendorid = Column(Integer, ForeignKey("vendor.id"), nullable=False)
#     status = Column(String, nullable=False)
#     clientid = Column(Integer, default=0)  # Force clientid = 0
#     # ... other fields (dob, skypeid, etc.) ...

#     vendor = relationship("Vendor")





# class Designation(Base):
#     __tablename__ = 'designation'
    
#     id = Column(Integer, primary_key=True)
#     name = Column(String(255))

# class UCUser(Base):
#     __tablename__ = 'uc_users'
    
#     id = Column(Integer, primary_key=True)
#     display_name = Column(String(255))
#     email = Column(String(255))

# class UCUserPermissionMatch(Base):
#     __tablename__ = 'uc_user_permission_matches'
    
#     id = Column(Integer, primary_key=True)
#     user_id = Column(Integer, ForeignKey('uc_users.id'))
#     permission_id = Column(Integer)
    
#     user = relationship("UCUser")
    
# avatar-app/projects-api/app/models.py
from sqlalchemy.sql import func, text
from sqlalchemy import Column, Integer, Enum as SAEnum, String, DateTime, DECIMAL, Float, MetaData, Date, Boolean, Text, ForeignKey, TIMESTAMP, CHAR, Numeric
from app.database.db import Base
from pydantic import BaseModel, EmailStr ,validator, ValidationError
from sqlalchemy.orm import declarative_base, relationship
from typing import ClassVar, Optional
from pydantic_settings import BaseSettings
from datetime import datetime, date
from sqlalchemy.orm import DeclarativeBase
from enum import Enum as PyEnum

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    uname = Column(String, unique=True, index=True)
    password = Column(String)
class LoginHistory(Base):
    __tablename__ = "loginhistory"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    loginid = Column(Integer, index=True)
    logindatetime = Column(DateTime)
    ipaddress = Column(String(45))
    useragent = Column(String(300))
    logoutdatetime = Column(DateTime)
    lastmoddatetime = Column(TIMESTAMP, server_default=func.current_timestamp())

class Employee(Base):
    __tablename__ = 'employee'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(150))
    email = Column(String(150), unique=True)
    phone = Column(String(150))
    personalemail = Column(String(150))
    personalphone = Column(String(150))
    status = Column(String(45))
    startdate = Column(Date)
    address = Column(String(250))
    city = Column(String(150))
    state = Column(String(150))
    country = Column(String(150))
    zip = Column(String(45))
    skypeid = Column(String(150))
    dob = Column(Date)
    salary = Column(Numeric(19, 4))
    type = Column(String(45))
    mgrid = Column(Integer)
    commission = Column(String(1))
    commissionrate = Column(Numeric(19, 4))
    enddate = Column(Date)
    loginid = Column(Integer)
    responsibilities = Column(Text)
    notes = Column(Text)
    designationid = Column(Integer)
    dlurl = Column(String(250))
    empagreementurl = Column(String(250))
    offerletterurl = Column(String(250))
    workpermiturl = Column(String(250))
    contracturl = Column(String(250))
    

class Course(Base):
    __tablename__ = 'course'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False, default='Quality Engineering')
    alias = Column(String(200), nullable=True)
    description = Column(Text, nullable=False)
    syllabus = Column(Text, nullable=False)
    lastmoddatetime = Column(TIMESTAMP, nullable=False, server_default=text('0000-00-00 00:00:00'))
    displayquestion = Column(String(200), nullable=False)
    displayanswer = Column(String(500), nullable=False)
    courseaddition = Column(String(500), nullable=False)
    certificatetitle = Column(String(500), nullable=True)

    # Establish a one-to-many relationship with Batch
    batches = relationship('Batch', back_populates='course')
    
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
    instructor1 = Column(Integer)
    instructor2 = Column(Integer)
    instructor3 = Column(Integer)
    topicscovered = Column(Text)
    topicsnotcovered = Column(Text)
    lastmoddatetime = Column(TIMESTAMP)
    courseid = Column(Integer, ForeignKey('course.id'))  # Define the foreign key constraint
    course = relationship('Course', back_populates='batches')

# class Placement(Base):
#     __tablename__ = 'placement'
#     id = Column(Integer, primary_key=True, index=True)
#     candidateid = Column(Integer)
#     placementDate = Column(DateTime)

class Lead(Base):
    __tablename__ = "leads"

    leadid = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    startdate = Column(DateTime)
    phone = Column(String(45))
    email = Column(String(45), nullable=False, index=True)
    priority = Column(String(2))
    workstatus = Column(String(10))
    source = Column(String(10))
    workexperience = Column(String(150))
    sourcename = Column(String(100))
    course = Column(String(10), default="QA")
    intent = Column(String(45))
    attendedclass = Column(String(1))
    siteaccess = Column(String(1))
    assignedto = Column(String(45))
    status = Column(String(45), default="Open")
    secondaryemail = Column(String(100))
    secondaryphone = Column(String(45))
    address = Column(String(100))
    spousename = Column(String(100))
    spouseemail = Column(String(45))
    spousephone = Column(String(45))
    spouseoccupationinfo = Column(String(250))
    city = Column(String(100))
    state = Column(String(100))
    country = Column(String(100))
    zip = Column(String(100))
    faq = Column(String(1))
    callsmade = Column(Integer, default=0)
    closedate = Column(Date)
    notes = Column(Text)
    lastmoddatetime = Column(DateTime, server_default='CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    

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
    # mkt_submissions = relationship("MktSubmission", back_populates="candidate")
    # placements = relationship("Placement", back_populates="candidate")
    # 
    # Change these lines in Candidate model
    mkt_submissions = relationship("MktSubmission", back_populates="candidate", viewonly=True)
    placements = relationship("Placement", back_populates="candidate", viewonly=True)
    

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
    mmid = Column(Integer, ForeignKey("employee.id"))
    recruiterid = Column(Integer, ForeignKey("recruiter.id"))
    vendorid = Column(Integer, ForeignKey("vendor.id"))
    vendor2id = Column(Integer, nullable=True)
    vendor3id = Column(Integer, nullable=True)
    clientid = Column(Integer, ForeignKey("client.id"))
    startdate = Column(Date, nullable=True)
    enddate = Column(Date, nullable=True)
    status = Column(String(45), nullable=True)
    paperwork = Column(String(10), nullable=True)
    insurance = Column(String(10), nullable=True)
    wrklocation = Column(String(200), nullable=True)
    wrkdesignation = Column(String(200), nullable=True)
    wrkemail = Column(String(150), nullable=True)
    wrkphone = Column(String(45), nullable=True)
    mgrname = Column(String(200), nullable=True)
    mgremail = Column(String(150), nullable=True)
    mgrphone = Column(String(45), nullable=True)
    hiringmgrname = Column(String(200), nullable=True)
    hiringmgremail = Column(String(150), nullable=True)
    hiringmgrphone = Column(String(45), nullable=True)
    reference = Column(String(10), nullable=True)
    ipemailclear = Column(String(10), nullable=True)
    feedbackid = Column(Integer, nullable=True)
    projectdocs = Column(String(10), nullable=True)
    notes = Column(Text, nullable=True)
    masteragreementid = Column(String(50), nullable=True)
    otheragreementsids = Column(String(50), nullable=True)
    
    candidate = relationship("Candidate", back_populates="placements", viewonly=True)
    vendor = relationship("Vendor", back_populates="placements")
    client = relationship("Client", back_populates="placements")
    po_entries = relationship("PO", back_populates="placement")
# Client.placements = relationship("Placement", back_populates="client")

# class Candidate(Base):
#     __tablename__ = "candidate"
#     __table_args__ = {'extend_existing': True} 
#     candidateid = Column(Integer, primary_key=True, index=True)
#     name = Column(String, nullable=False)

#     placements = relationship("Placement", back_populates="candidate")

class Vendor(Base):
    __tablename__ = "vendor"

    id = Column(Integer, primary_key=True, index=True)
    companyname = Column(String, nullable=False)

    placements = relationship("Placement", back_populates="vendor")
    recruiters = relationship("Recruiter", back_populates="vendor")

class Client(Base):
    __tablename__ = "client"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    companyname = Column(String(250), unique=True, nullable=False)
    tier = Column(String(45), nullable=False, default="STANDARD")
    status = Column(String(45), nullable=False, default="ACTIVE")
    email = Column(String(150), nullable=False)
    phone = Column(String(150), nullable=False, default="000-000-0000")
    fax = Column(String(150), nullable=True)
    address = Column(String(250), nullable=True)
    city = Column(String(150), nullable=True)
    state = Column(String(150), nullable=True)
    country = Column(String(150), nullable=True)
    zip = Column(String(150), nullable=True)
    url = Column(String(150), nullable=True)
    twitter = Column(String(100), nullable=True)
    facebook = Column(String(100), nullable=True)
    linkedin = Column(String(100), nullable=True)
    manager1name = Column(String(150), nullable=True)
    manager1email = Column(String(150), nullable=True)
    manager1phone = Column(String(150), nullable=True)
    hmname = Column(String(150), nullable=True)
    hmemail = Column(String(150), nullable=True)
    hmphone = Column(String(150), nullable=True)
    hrname = Column(String(150), nullable=True)
    hremail = Column(String(150), nullable=True)
    hrphone = Column(String(150), nullable=True)
    notes = Column(Text, nullable=True)
    lastmoddatetime = Column(TIMESTAMP, nullable=False, server_default=func.now())

    placements = relationship("Placement", back_populates="client")
    recruiters = relationship("Recruiter", back_populates="client")

class ClientSearch(Base):
    __tablename__ = "client"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, autoincrement=True)
    companyname = Column(String(250), nullable=True)
    email = Column(String(150), nullable=True)
    phone = Column(String(150), nullable=True)
    city = Column(String(150), nullable=True)
    state = Column(String(150), nullable=True)
    country = Column(String(150), nullable=True)
    zip = Column(String(150), nullable=True)
    status = Column(String(45), nullable=True)
    tier = Column(String(45), nullable=True)
    manager1name = Column(String(150), nullable=True)
    hmname = Column(String(150), nullable=True)
    hrname = Column(String(150), nullable=True)
    lastmoddatetime = Column(TIMESTAMP, nullable=True)

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

class Invoice(Base):
    __tablename__ = "invoice"

    id = Column(Integer, primary_key=True, index=True)
    invoicenumber = Column(String(45), unique=True, nullable=False)
    startdate = Column(Date, nullable=False)
    enddate = Column(Date, nullable=False)
    invoicedate = Column(Date, nullable=False)
    quantity = Column(Numeric(precision=19, scale=1), nullable=False)
    otquantity = Column(Numeric(precision=19, scale=1), nullable=False, default=0.0)
    status = Column(String(45), nullable=True)
    amountreceived = Column(Numeric(precision=19, scale=4), nullable=True)
    releaseddate = Column(Date, nullable=True)
    receiveddate = Column(Date, nullable=True)
    checknumber = Column(String(150), nullable=True)
    invoiceurl = Column(String(300), nullable=True)
    checkurl = Column(String(300), nullable=True)
    reminders = Column(String(1), nullable=False, default='Y')
    remindertype = Column(String(150), nullable=False, default='Open')
    emppaiddate = Column(Date, nullable=True)
    candpaymentstatus = Column(String(45), nullable=False, default='Open')
    poid = Column(Integer, ForeignKey("po.id"), nullable=False)
    notes = Column(Text, nullable=True)
    lastmoddatetime = Column(DateTime, nullable=True, default=datetime.utcnow)


# Adding recruiter model



# Adding mkl_submission 

class MktSubmission(Base):
    __tablename__ = "mkt_submission"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    candidateid = Column(Integer, ForeignKey("candidate.candidateid"), nullable=False)
    employeeid = Column(Integer, ForeignKey("employee.id"), nullable=False)
    submitter = Column(Integer, ForeignKey("employee.id"), nullable=True)
    submissiondate = Column(Date, nullable=False)
    # type = Column(String(45), nullable=False)
    name = Column(String(150), nullable=True)
    email = Column(String(150), nullable=True)
    phone = Column(String(150), nullable=True)
    url = Column(String(300), nullable=True)
    location = Column(String(300), nullable=True)
    notes = Column(Text, nullable=True)
    feedback = Column(Text, nullable=True)
    lastmoddatetime = Column(TIMESTAMP, nullable=True, server_default=func.now())
    
    # candidate = relationship("Candidate", back_populates="mkt_submissions")
    employee = relationship("Employee", foreign_keys=[employeeid], primaryjoin="MktSubmission.employeeid == Employee.id")
    submitter_rel = relationship("Employee", foreign_keys=[submitter], primaryjoin="MktSubmission.submitter == Employee.id")
    # candidate = relationship("Candidate", 
    #                     back_populates="mkt_submissions",
    #                     foreign_keys=[candidateid])
    candidate = relationship("Candidate", back_populates="mkt_submissions", viewonly=True)


    
    @validator('submissiondate', pre=True, always=True)
    def validate_submission_date(cls, v):
        if isinstance(v, date):
            return v
        if v in ('0000-00-00', None):
            return None
        try:
            return datetime.strptime(v, '%Y-%m-%d').date()
        except (ValueError, TypeError):
            raise ValueError("Invalid date format for submissiondate")









class Url(Base):
    __tablename__ = "sales_url_db"

    
    url = Column(String(255), nullable=False)
    id = Column(Integer, primary_key=True, autoincrement=True)
    lastmoddatetime = Column(DateTime, nullable=False, server_default=func.now())  
# Recruiter Model
class Recruiter(Base):
    __tablename__ = "recruiter"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=False)
    designation = Column(String, nullable=False)
    vendorid = Column(Integer, ForeignKey("vendor.id"), nullable=True)
    status = Column(String, nullable=False)
    dob = Column(Date, nullable=True)
    personalemail = Column(String, nullable=True)
    skypeid = Column(String, nullable=True)
    linkedin = Column(String, nullable=True)
    twitter = Column(String, nullable=True)
    facebook = Column(String, nullable=True)
    review = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    clientid = Column(Integer, ForeignKey("client.id"), nullable=True)

    # Relationships
    vendor = relationship("Vendor", back_populates="recruiters")
    client = relationship("Client", back_populates="recruiters")






class PlacementRecruiter(Base):
    __tablename__ = "placement_recruiter"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    designation = Column(String, nullable=False)
    vendorid = Column(Integer, ForeignKey("vendor.id"), nullable=False)
    status = Column(String, nullable=False)
    clientid = Column(Integer, default=0)  # Force clientid = 0
    # ... other fields (dob, skypeid, etc.) ...

    vendor = relationship("Vendor")





class Designation(Base):
    __tablename__ = 'designation'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255))

class UCUser(Base):
    __tablename__ = 'uc_users'
    
    id = Column(Integer, primary_key=True)
    display_name = Column(String(255))
    email = Column(String(255))

class UCUserPermissionMatch(Base):
    __tablename__ = 'uc_user_permission_matches'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('uc_users.id'))
    permission_id = Column(Integer)
    
    user = relationship("UCUser")