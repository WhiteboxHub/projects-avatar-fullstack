// types.ts
export interface Lead {
    leadid?: string; // make leadid optional if it's not always present
    name: string;
    email: string;
    // Add other fields as necessary
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
export interface Candidate{
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
  export interface Po {
    // Existing properties
    POID?: string;
    PlacementDetails?: string;
    StartDate?: string;
    EndDate?: string;
    Rate?: string;
    OvertimeRate?: string;
    FreqType?: string;
    InvoiceFrequency?: string;
    InvoiceStartDate?: string;
    InvoiceNet?: string;
    POUrl?: string;
    Notes?: string;

    // Additional properties with alternative names
    id?: string;
    PlacementID?: string;
    placementDetails?: string; // Including both PlacementDetails variants if needed
    startDate?: string;
    endDate?: string;
    rate?: string;
    overtimeRate?: string;
    freqType?: string;
    invoiceFrequency?: string;
    invoiceStartDate?: string;
    invoiceNet?: string;
    poUrl?: string;
    notes?: string;
}


  
  export interface Placement {
    // Existing properties
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

  export  type Client= {
    id: string;
    companyName: string;
    tier: string;
    status: string;
    email: string;
    phone: string;
    fax?: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    url: string;
    manager1Name: string;
    twitter?: string;
    facebook?: string;
    linkedIn?: string;
    manager1Email: string;
    manager1Phone: string;
    hmName: string; // Hiring manager name
    hmEmail: string;
    hmPhone: string;
    hrName: string;
    hrEmail: string;
    hrPhone: string;
    notes?: string;
    lastModDateTime: string;
    client?: string; // Assuming 'clicent' is a typo for 'client'
  }
  

  export type Employee ={
      id: string;
      name: string;
      email: string;
      phone: string;
      status: string;
      startdate: string;
      mgrid: string;
      designationid: string;
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
      loginid: string;
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
      ipemailid: number;
      resumeid: number;
      coverletter: string;
      intro: string;
      closedate: string;
      closedemail: string;
      notes: string;
      suspensionreason: string;
      yearsofexperience: string;
    }





    //+++++++++++++++++++++++++++++++


  export interface Overdue {
    id?: string;
    poid?: string;
    invoicenumber?: string;
    invoicedate?: string;
    quantity?: string;
    rate?: string;
    expecteddate?: string;
    amountexpected?: string;
    startdate?: string;
    enddate?: string;
    status?: string;
    remindertype?: string;
    amountreceived?: string;
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
  }


  export interface CandidateMarketing {
  
    candidateid: number;
    startdate: number |string;
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
    ipemailid: number;
    resumeid: number;
    coverletter: string;
    intro: string;
    closedate: string;
    closedemail: string;
    notes: string;
    suspensionreason: string;
    yearsofexperience: string;
  }
  

// In your types file (e.g., types/index.ts)

export interface DetailedClient {
  id: number;
  name: string;
  email: string;
  // Add other fields here
}

