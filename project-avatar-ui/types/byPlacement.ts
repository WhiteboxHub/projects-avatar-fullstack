// types/byPlacement.ts

export interface Recruiter {
    employeeid: string;
    id: number;
    name?: string;
    email: string;
    phone: string;
    status: string;
    designation?: string;
    dob?: string; // Use string for date to handle JSON serialization
    personalemail?: string;
    skypeid?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    review?: string;
    clientid: number;
    comp?: string; // Company name
    company?: string; // Add this line
    notes?: string;
    lastmoddatetime?: string; // Use string for timestamp
  }