// export interface Recruiter {
//   vendorid: string; 
//   company?: string;
//   id: number;
//   name: string;
//   email: string;
//   phone?: string;
//   status?: string;
//   designation?: string;
//   dob?: string; 
//   personalemail?: string;
//   employeeid?: number;
//   skypeid?: string;
//   linkedin?: string;
//   twitter?: string;
//   facebook?: string;
//   review?: string;
//   clientid?: number;
//   notes?: string;
//   lastmoddatetime?: string;
// }

// In your Recruiter type definition file
export interface Recruiter {
  id: number;
  name: string;
  email: string;
  phone: string;
  designation: string;
  status: string;
  dob?: string;
  personalemail: string;
  skypeid: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  review: string;
  notes: string;
  clientid: number;
  companyname: string; // Ensure this property exists
  employeeid?: number;
  lastmoddatetime?: string;
  vendorid: string;
}