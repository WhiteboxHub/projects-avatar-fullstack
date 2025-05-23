// types.ts
export interface Lead {
    workstatus: string;
    leadid?: string; 
    name: string;
    startdate: string;
    course: string;
    workexperience: string;
    email: string;
    phone: string;
    secondaryemail: string;
    secondaryphone: string;
    status: string;
    priority: string;
    usstatus: string;
    spousename: string;
    spouseemail: string;
    spousephone: string;
    spouseoccupationinfo: string;
    attendedclass: string;
    siteaccess: string;
    faq: string;
    closedate: string;
    assignedto: string;
    intent: string;
    callsmade: string;
    source: string;
    sourcename: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    notes: string;
  }

  // Define the ByPO interface
export interface ByPO {
  id?: string;
  pname?: string;
  // Add other fields that match your data structure
  [key: string]: any; // Allows additional properties that may not be explicitly defined
}
  
  export interface Batch {
    batchid: string; // Assuming batchid is a string, adjust as necessary
    title: string; // Example property, change to match your actual data
    description?: string; // Optional property, add more fields as necessary
    createdAt: string; // Assuming this is a timestamp or date string
    updatedAt: string; // Assuming this is a timestamp or date string
    [key: string]: any; // Allows additional properties that may not be explicitly defined
  }
  
  export interface ByMonth {
    batchid: string; // Assuming batchid is a string, adjust as necessary
    title: string; // Example property, change to match your actual data
    description?: string; // Optional property, add more fields as necessary
    createdAt: string; // Assuming this is a timestamp or date string
    updatedAt: string; // Assuming this is a timestamp or date string
    [key: string]: any; // Allows additional properties that may not be explicitly defined
  }
  
  export interface invoice {
    batchid: string; // Assuming batchid is a string, adjust as necessary
    title: string; // Example property, change to match your actual data
    description?: string; // Optional property, add more fields as necessary
    createdAt: string; // Assuming this is a timestamp or date string
    updatedAt: string; // Assuming this is a timestamp or date string
    [key: string]: any; // Allows additional properties that may not be explicitly defined
  }
  
// // types/index.ts
// export interface Candidate  {
//   id: number; // or number depending on your API
//   name: string;
//   email: string;
//   assessment: string; // or whatever type it should be
//   // batchname: string;
//   // name: string;
//   batchname:string;
//   enrolleddate: string;
//   // email: string;
//   course: string;
//   phone: string;
//   status: string; // Allows additional properties that may not be explicitly defined
//   // Add any additional properties you need here
//   candidateid: string; // Optional if it can be undefined
//   workstatus: string;
//   education: string;
//   workexperience: string;
//   ssn: string;
//   agreement: string;
//   promissory: boolean;
//   driverslicense: string;
//   workpermit: string;
//   wpexpirationdate: string; // Adjust type if necessary
//   offerletter: string;
//   secondaryemail: string;
//   secondaryphone: string;
//   address: string;
//   city: string;
//   state: string;
//   country: string;
//   zip: string;
//   linkedin: string;
//   dob: string; // Adjust type if necessary
//   emergcontactphone: string;
//   ssnvalidated: boolean;
//   bgv: boolean;
//   term: string;
//   feepaid: boolean;
//   feedue: number;
//    salary0: number;
    //  salary6: number;
    //  salary12: number;
//   guarantorname: string;
//   guarantordesignation: string;
//   guarantorcompany: string;
//   contracturl: string;
//   empagreementurl: string;
//   offerletterurl: string;
//   workpermiturl: string;
//   referralid: string;
//   portalid: string;
//   avatarid: string;
//   notes: string;
// }
// export interface Candidate{
//   isGroupRow: any;
//   id: number;
//   name: string;
//   assessment: string;
//   candidateid: number; // Ensure candidateid is always a string
//   // name: string;
//   enrolleddate: string;
//   email: string;
//   course: string;
//   phone: string;
//   status: string;
//   workstatus: string;
//   education: string;
//   workexperience: string;
//   ssn: string;
//   agreement: string;
//   promissory: boolean;
//   driverslicense: string;
//   workpermit: string;
//   wpexpirationdate: string;
//   offerletter: string;
//   secondaryemail: string;
//   secondaryphone: string;
//   address: string;
//   city: string;
//   state: string;
//   country: string;
//   zip: string;
//   linkedin: string;
//   dob: string;
//   emergcontactphone: string;
//   ssnvalidated: boolean;
//   bgv: boolean;
//   term: string;
//   feepaid: boolean;
//   feedue: number;
//   salary0: number;
//   salary6: number;
//   salary12: number;
//   guarantorname: string;
//   guarantordesignation: string;
//   guarantorcompany: string;
//   contracturl: string;
//   empagreementurl: string;
//   offerletterurl: string;
//   workpermiturl: string;
//   referralid: string;
//   portalid: string;
//   avatarid: string;
//   notes: string;
//   batchname: string;
//   recruiterassesment:string;
//   instructorassesment:string;
//   originalresume:string;
//   lastmoddatetime:number;
//   statuschangedate:number;
//   diceflag:string;
//   batchid:number;
//   emaillist:string;
// }

export interface Candidate{
  isGroupRow: any;
  id: number;
  name: string;
  assessment: string;
  candidateid: number; // Ensure candidateid is always a string
  // name: string;
  enrolleddate: string;
  email: string;
  course: string;
  phone: string;
  status: string;
  workstatus: string;
  education: string;
  workexperience: string;
  ssn: string;
  agreement: string;
  promissory: boolean;
  driverslicense: string;
  workpermit: string;
  wpexpirationdate: string;
  offerletter: string;
  secondaryemail: string;
  secondaryphone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  linkedin: string;
  dob: string;
  emergcontactphone: string;
  ssnvalidated: boolean;
  bgv: boolean;
  term: string;
  feepaid: boolean;
  feedue: number;
  salary0: number;
  salary6: number;
  salary12: number;
  guarantorname: string;
  guarantordesignation: string;
  guarantorcompany: string;
  contracturl: string;
  empagreementurl: string;
  offerletterurl: string;
  workpermiturl: string;
  referralid: string;
  portalid: string;
  avatarid: string;
  notes: string;
  batchname: string;
}

export interface Candidate {
  id: number;
  loginid: number;
  ipaddress: number;
  logoutdatetime: number;
  useragent:string;
  logindatetime:number;
  lastmoddatetime:number; 
}

  export  interface User  {
    id: number;
    uname: string;
    passwd: string;
    dailypwd: string;
    team: string;
    level: string;
    instructor: string;
    override: string;
    status: string;
    lastlogin: string;
    logincount: number;
    fullname: string;
    address: string;
    phone: string;
    state: string;
    zip: string;
    city: string;
    country: string;
    message: string;
    registereddate: string;
    level3date: string;
    lastmoddatetime: string;
    demo: string;
    enddate: string;
    googleId: string;
    reset_token: string;
    token_expiry: string;
  };
  // GroupedData interface to represent the structure of grouped candidates
export interface GroupedData {
  [batch: string]: Candidate[]; // Keyed by batch name, value is an array of Candidates
}

// TransformedCandidate interface to include additional properties
export interface TransformedCandidate extends Candidate {
  batchname: string;
  id: number;
  name: string;
  assessment: string;
  candidateid: number;
  enrolleddate: string;
  email: string;
  course: string;
  phone: string;
  status: string;
  workstatus: string;
  notes: string;
  //isBatch?: boolean; // Indicates if the row is a batch row
}

// ErrorResponse interface for handling API error responses
export interface ErrorResponse {
  message: string; // Error message from the API
  // Add other properties if needed
}

  // types.ts
  // export interface Po {
  //   id?: number;
  //   placementid?: number;
  //   begindate?: string | Date;
  //   enddate?: string | Date | null;
  //   rate?: number;
  //   overtimerate?: number | null;
  //   freqtype?: string; // "M" for MONTHLY, "W" for WEEKLY, "D" for DAYS
  //   frequency?: number;
  //   invoicestartdate?: string | Date;
  //   invoicenet?: number;
  //   polink?: string | null;
  //   notes?: string | null;
  //   placement_details?: string; // Concatenated string of candidate name, vendor, and client
    
  //   // For backward compatibility with existing code
  //   POID?: number;
  //   PlacementDetails?: string;
  //   StartDate?: string | Date;
  //   EndDate?: string | Date | null;
  //   Rate?: number;
  //   OvertimeRate?: number | null;
  //   FreqType?: string;
  //   InvoiceFrequency?: number;
  //   InvoiceStartDate?: string | Date;
  //   InvoiceNet?: number;
  //   POUrl?: string | null;
  //   Notes?: string | null;
  // }

// PO Interface
export interface Po {
  id?: number;
  placementid?: number;
  begindate?: string | Date;
  enddate?: string | Date | null;
  rate?: number;
  overtimerate?: number | null;
  freqtype?: string; // "M" for MONTHLY, "W" for WEEKLY, "D" for DAYS
  frequency?: number;
  invoicestartdate?: string | Date;
  invoicenet?: number;
  polink?: string | null;
  notes?: string | null;
  placement_details?: string; // Concatenated string of candidate name, vendor, and client
}


// new invoicedata

export interface InvoiceData {
  id: number;
  invoicenumber: string;
  startdate: string;
  enddate: string;
  invoicedate: string;
  quantity: number;
  otquantity: number;
  rate: number;
  overtimerate: number;
  status: string;
  emppaiddate: string;
  candpaymentstatus: string;
  reminders: string;
  amountexpected: number;
  expecteddate: string;
  amountreceived: number;
  receiveddate: string;
  releaseddate: string;
  checknumber: string;
  invoiceurl: string;
  checkurl: string;
  freqtype: string;
  invoicenet: number;
  companyname: string;
  vendorfax: string;
  vendorphone: string;
  vendoremail: string;
  timsheetemail: string;
  hrname: string;
  hremail: string;
  hrphone: string;
  managername: string;
  manageremail: string;
  managerphone: string;
  secondaryname: string;
  secondaryemail: string;
  secondaryphone: string;
  candidatename: string;
  candidatephone: string;
  candidateemail: string;
  wrkemail: string;
  wrkphone: string;
  recruitername: string;
  recruiterphone: string;
  recruiteremail: string;
  poid: number;
  notes: string;
}

// PoGroup Interface for grouping invoices by PO
export interface PoGroup {
  poid: number;
  name: string;
  pos: InvoiceData[];
  isGroup: boolean;
  isCollapsed: boolean;
}

export interface MonthGroup {
  invmonth: string;
  name?: string;
  invoices: InvoiceData[];
  isGroup?: boolean;
  isCollapsed?: boolean;
  invoice_count: number;
  summary: {
    quantity: number;
    otquantity: number;
    amountexpected: number;
    amountreceived: number;
  };
}

// RowData interface for display in grid
export interface RowData extends InvoiceData {
  name?: string;
  isGroupRow?: boolean;
  isSummaryRow?: boolean;
  level?: number;
  expanded?: boolean;
}



  
 export interface Placement {
    id?: string;
    Candidate_Name?: string;
    Manager?: string;
    Recruiter?: string;
    Vendor1?: string;
    MSA_ID?: string;
    Other_AgrID?: string;
    Vendor2?: string;
    Vendor3?: string;
    Client?: string;
    Start_Date?: string;
    End_Date?: string;
    Status?: string;
    Paperwork?: string;
    Insurance?: string;
    Wrk_Location?: string;
    Wrk_Designation?: string;
    Wrk_Email?: string;
    Wrk_Phone?: string;
    Mgr_Name?: string;
    Mgr_Email?: string;
    Mgr_Phone?: string;
    Hiring_Mgr_Name?: string;
    Hiring_Mgr_Email?: string;
    Hiring_Mgr_Phone?: string;
    Reference?: string;
    IPEmail_Clear?: string;
    Feedback_ID?: string;
    Project_Docs?: string;
    Notes?: string;

    // Additional properties with alternative names
    candidateid?: string;
    mmid?: string;
    recruiterid?: string;
    vendorid?: string;
    masteragreementid?: string;
    otheragreementsids?: string;
    vendor2id?: string;
    vendor3id?: string;
    clientid?: string;
    startdate?: string;
    enddate?: string;
    status?: string;
    paperwork?: string;
    insurance?: string;
    wrklocation?: string;
    wrkdesignation?: string;
    wrkemail?: string;
    wrkphone?: string;
    mgrname?: string;
    mgremail?: string;
    mgrphone?: string;
    hiringmgrname?: string;
    hiringmgremail?: string;
    hiringmgrphone?: string;
    reference?: string;
    ipemailclear?: string;
    feedbackid?: string;
    projectdocs?: string;
    notes?: string;
}

export interface Vendor {
  id?: string;
  name: string;
  vendorid: string; // Required property
  comp: string; // Required property
  dob: string; // Required property
  designation: string; // Required property
  personalemail: string; // Required property
  skypeid: string; // Required property
  review: string; // Required property

  // Fields with specified default values as optional properties
  companyname?: string;
  status?: string;
  tier?: string;
  culture?: string;
  solicited?: string;
  minrate?: number;
  hirebeforeterm?: string;
  hireafterterm?: string;
  latepayments?: string;
  totalnetterm?: number;
  defaultedpayment?: string;
  agreementstatus?: string;
  url?: string;
  email?: string;
  phone?: string;
  fax?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  hrname?: string;
  hremail?: string;
  hrphone?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  accountnumber?: string;
  managername?: string;
  manageremail?: string;
  managerphone?: string;
  secondaryname?: string;
  secondaryemail?: string;
  secondaryphone?: string;
  timsheetemail?: string;
  agreementname?: string;
  agreementlink?: string;
  subcontractorlink?: string;
  nonsolicitationlink?: string;
  nonhirelink?: string;
  clients?: string;
  notes?: string;
}

  // export  type Client= {
  //   id: string;
  //   companyName: string;
  //   tier: string;
  //   status: string;
  //   email: string;
  //   phone: string;
  //   fax?: string;
  //   address: string;
  //   city: string;
  //   state: string;
  //   country: string;
  //   zip: string;
  //   url: string;
  //   manager1Name: string;
  //   twitter?: string;
  //   facebook?: string;
  //   linkedIn?: string;
  //   manager1Email: string;
  //   manager1Phone: string;
  //   hmName: string; // Hiring manager name
  //   hmEmail: string;
  //   hmPhone: string;
  //   hrName: string;
  //   hrEmail: string;
  //   hrPhone: string;
  //   notes?: string;
  //   lastModDateTime: string;
  //   client?: string; // Assuming 'clicent' is a typo for 'client'
  // }
  

  export type Employee = {
      id: string;
      name: string;
      email: string;
      phone: string;
      status: string;
      startdate: string;
      mgrid: string | null;
      designationid: string | null;
      loginid: string | null;
      manager_name?: string;
      designation_name?: string;
      login_email?: string;
      personalemail: string;
      personalphone: string;
      dob: string;
      address: string;
      city: string;
      state: string;
      country: string;
      zip: string;
      skypeid: string;
      salary: string;
      commission: string;
      commissionrate: string;
      type: string;
      empagreementurl: string;
      offerletterurl: string;
      dlurl: string;
      workpermiturl: string;
      contracturl: string;
      enddate: string;
      responsibilities: string;
      notes: string;
    };

   export interface CandidateMarketing {
      id: number;
      candidateid: number;
      startdate: string | number;
      mmid: number;
      instructorid: number;
      status: string;
      submitterid: number;
      priority: string;
      technology: string;
      minrate: number;
      currentlocation: string;
      relocation: string;
      locationpreference: string;
      skypeid: string;
      ipemailid: number | string;
      ipemail: string;
      resumeid: number;
      coverletter: string;
      intro: string;
      closedate: string;
      closedemail: string;
      notes: string;
      suspensionreason: string;
      yearsofexperience: number | string;
      manager_name: string;
      instructor_name: string;
      submitter_name: string;
      candidate_name?: string;
      email?: string;
      phone?: string;
      secondaryemail?: string;
      secondaryphone?: string;
      workstatus?: string;
      resumelink?: string;
      ipphone?: string;
      resume_name?: string;
    }



    //+++++++++++++++++++++++++++++++


  // export interface Overdue {
  //   id?: string;
  //   poid?: string;
  //   invoicenumber?: string;
  //   invoicedate?: string;
  //   quantity?: string;
  //   rate?: string;
  //   expecteddate?: string;
  //   amountexpected?: string;
  //   startdate?: string;
  //   enddate?: string;
  //   status?: string;
  //   remindertype?: string;
  //   amountreceived?: string;
  //   receiveddate?: string;
  //   releaseddate?: string;
  //   checknumber?: string;
  //   invoiceurl?: string;
  //   checkurl?: string;
  //   companyname?: string;
  //   vendorfax?: string;
  //   vendorphone?: string;
  //   vendoremail?: string;
  //   timsheetemail?: string;
  //   hrname?: string;
  //   hremail?: string;
  //   hrphone?: string;
  //   managername?: string;
  //   manageremail?: string;
  //   managerphone?: string;
  //   secondaryname?: string;
  //   secondaryemail?: string;
  //   secondaryphone?: string;
  //   candidatename?: string;
  //   candidatephone?: string;
  //   candidateemail?: string;
  //   wrkemail?: string;
  //   wrkphone?: string;
  //   recruitername?: string;
  //   recruiterphone?: string;
  //   recruiteremail?: string;
  //   notes?: string;
  // }


  export interface Overdue {
    pkid?: number;
    poid?: string;
    invoicenumber?: string;
    invoicedate?: string;
    quantity?: number;
    rate?: number;
    expecteddate?: string;
    amountexpected?: number;
    startdate?: string;
    enddate?: string;
    status?: string;
    remindertype?: string;
    amountreceived?: number;
    receiveddate?: string;
    releaseddate?: string;
    checknumber?: string;
    invoiceurl?: string;
    checkurl?: string;
    companyname?: string;
    vendorfax?: string;
    vendorphone?: string;
    vendoremail?: string;
    timsheetemail?: string;
    hrname?: string;
    hremail?: string;
    hrphone?: string;
    managername?: string;
    manageremail?: string;
    managerphone?: string;
    secondaryname?: string;
    secondaryemail?: string;
    secondaryphone?: string;
    candidatename?: string;
    candidatephone?: string;
    candidateemail?: string;
    wrkemail?: string;
    wrkphone?: string;
    recruitername?: string;
  recruiterphone?: string;
  recruiteremail?: string;
  notes?: string;
  serialNo?: number;
}


// Constants for form options
export const INVOICE_STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "Open", label: "Open" },
  { value: "Pending", label: "Pending" },
  { value: "Paid", label: "Paid" },
  { value: "Void", label: "Void" },
  { value: "Closed", label: "Closed" },
  { value: "Deny", label: "Deny" }
];

export const REMINDER_TYPE_OPTIONS = [
  { value: "Open", label: "Open" },
  { value: "Warning", label: "Warning" },
  { value: "Warn-Candidate", label: "Warn-Candidate" },
  { value: "Warn-Client", label: "Warn-Client" },
  { value: "Warn-CollectionAgency", label: "Warn-CollectionAgency" },
  { value: "Final-Warning", label: "Final-Warning" }
];

export const FREQ_TYPE_OPTIONS = [
  { value: "M", label: "MONTHLY" },
  { value: "W", label: "WEEKLY" },
  { value: "D", label: "DAYS" }
];

export const REMINDER_OPTIONS = [
  { value: "Y", label: "Y" },
  { value: "N", label: "N" }
];

export const PAYMENT_STATUS_OPTIONS = [
  { value: "Open", label: "Open" },
  { value: "Pending", label: "Pending" },
  { value: "Suspended", label: "Suspended" },
  { value: "Closed", label: "Closed" }
];

  // export interface CandidateMarketing {
  
  //   candidateid: number;
  //   startdate: number |string;
  //   mmid: number;
  //   instructorid: number;
  //   status: string;
  //   submitterid: number;
  //   priority: string;
  //   technology: string;
  //   minrate: number;
  //   currentlocation: string;
  //   relocation: string;
  //   locationpreference: string;
  //   skypeid: string;
  //   ipemailid: number;
  //   resumeid: string;
  //   coverletter: string;
  //   intro: string;
  //   closedate: string;
  //   closedemail: string;
  //   notes: string;
  //   suspensionreason: string;
  //   yearsofexperience: number;
  // }
  

// In your types file (e.g., types/index.ts)

export interface DetailedClient {
  id: number;
  name: string;
  email: string;
  // Add other fields here
}


