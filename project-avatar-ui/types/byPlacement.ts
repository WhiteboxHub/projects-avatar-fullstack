// export interface Recruiter {
//     companyname: string; // Added companyname as required
//     company?: string; // Keep this as is
//     id: number; // Keep id as required
//     name: string; // Keep name as required
//     email: string;// Make email optional
//     phone?: string; // Make phone optional
//     status?: string; // Make status optional
//     designation?: string; // Make designation optional
//     dob?: string; // Use string for date to handle JSON serialization
//     personalemail?: string;
//     employeeid?: number; // Change to number for consistency
//     skypeid?: string;
//     linkedin?: string;
//     twitter?: string;
//     facebook?: string;
//     review?: string;
//     vendorid?: number; // Keep this as is
//     clientid?: number; // Keep this as is
//     placementid?: number; // Add placementid as optional
//     notes?: string;
//     lastmoddatetime?: string; // Use string for timestamp
// }


   // In your Recruiter type definition file
   export interface Recruiter {
    id: number;
    name: string;
    email: string;
    phone: string;
    designation: string;
    status: string;
    dob: string; // Ensure this is correct
    personalemail: string;
    skypeid: string;
    linkedin: string;
    twitter: string;
    facebook: string;
    review: string;
    notes: string;
    clientid: number;
    companyname: string;
    employeeid?: number; 
    placementid?: number;// Change this to number Change this to string | undefined
    lastmoddatetime?: string;
    vendorid: string;
  }