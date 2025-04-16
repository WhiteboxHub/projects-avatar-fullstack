// types/vendor.ts

export interface Vendor {
    vendorid: number;
    companyname: string;
    recruiters: RecruiterData[];
    isGroup: boolean;
    isCollapsed: boolean;
  }
  
  export interface RecruiterData {
    id: number;
    name: string;
    email: string;
    phone: string;
    designation: string;
    status: string;
    dob: string | null;
    personalemail: string;
    skypeid: string;
    linkedin: string;
    twitter: string;
    facebook: string;
    review: string;
    notes: string;
    vendorid: number;
    companyname: string;
    employeeid?: number;
    lastmoddatetime?: string;
    clientid: string;
  }
  