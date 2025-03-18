// // types/byPlacement.ts

// export interface Recruiter {
//     employeeid: string;
//     id: number;
//     name: string;
//     email: string;
//     phone: string;
//     status: string;
//     designation?: string;
//     dob?: string; // Use string for date to handle JSON serialization
//     personalemail?: string;
//     skypeid?: string;
//     linkedin?: string;
//     twitter?: string;
//     facebook?: string;
//     review?: string;
//     clientid: number;
//     comp?: string; // Company name
//     company?: string; // Add this line
//     notes?: string;
//     lastmoddatetime?: string; // Use string for timestamp
//   }

export interface Recruiter {
    company?: string; // Keep this as is
    id: number;
    name: string; // Keep name as required
    email: string;
    phone?: string; // Make phone optional
    status?: string; // Make status optional
    designation?: string; // Make designation optional
    dob?: string; // Use string for date to handle JSON serialization
    personalemail?: string;
    employeeid?: number; // Change to number for consistency
    skypeid?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    review?: string;
    vendorid?: number; // Keep this as is
    clientid?: number; // Keep this as is
    notes?: string;
    lastmoddatetime?: string; // Use string for timestamp
}