// types/byclient.ts

export interface Recruiter {
    id: number;
    name: string;
    email: string;
    phone?: string;
    status?: string;
    designation?: string;
    dob?: string; 
    personalemail?: string;
    employeeid?: number;
    skypeid?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    review?: string;
    vendorid?: number;
    clientid?: number;
    notes?: string;
    lastmoddatetime?: string;
  }