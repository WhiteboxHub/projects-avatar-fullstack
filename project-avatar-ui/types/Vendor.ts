export interface Vendor {
  agreementlink: string;
  agreementname: string;
  agreementstatus: string;
  linkedin: string;
  facebook: string;
  twitter: string;
  managername: string;
  manageremail?: string;
  managerphone?: string;
  name: string;
  id: number;
  vendorid: number;
  companyname?: string;
  recruiters: RecruiterData[];
  recruiter_count: number;
  tier: number;
  accountnumber?:string;
  // Additional fields that might be relevant for a vendor
  email?: string;
  phone?: string;
  country?: string;
  minrate?: number;
  zip?: string;
  state?:string;
  solicited?: string;
  address?: string;
  status?: string;
  culture?: string;
  notes?: string;
  hireBeforeTerm?: string;
  hireAfterTerm?: string;
  // HR related fields
  latePayments?: string;
  totalNetTerm?: string;
  defaultedPayment?: string;
  hrName?: string;
  hrEmail?: string;
  hrPhone?: string;
  timesheetEmail?: string;
  // Contact related fields
  url?: string;
  fax?: string;
  // Manager/Other Contacts
  mgrName?: string;
  mgrEmail?: string;
  mgrPhone?: string;
  secName?: string;
  secEmail?: string;
  secPhone?: string;
  city?:string;
  // Agreements
  subContractorLink?: string;
  nsaLink?: string;
  nonhirelink?: string;
  // Other fields
  requirements?: string;
  clients?: string;
  minRate?: string;
  accountNumber?: string;
  isGroup?: boolean;
  isCollapsed?: boolean;
  // Additional fields from context
  lastmoddatetime?: string;
  clientid?: string;
}

export interface RecruiterData {
  id: number;
  name: string;
  email: string;
  phone: string;
  designation: string;
  vendorid: number;
  status: string;
  dob?: string;
  personalemail: string;
  skypeid: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  review: string;
  notes: string;
  companyname?: string;
  // clientid?: number;
  employeeid?: number;
  lastmoddatetime?: string;
  isGroupRow?: boolean;
  level?: number;
  expanded?: boolean;
}