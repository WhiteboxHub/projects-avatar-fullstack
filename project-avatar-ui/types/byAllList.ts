// export interface Recruiter {
//     lastmoddatetime?: string;
//     employeeid?: string;
//     id: number;
//     name?: string;
//     email: string;
//     phone: string;
//     status: string;
//     designation?: string;
//     dob?: string;
//     personalemail?: string;
//     skypeid?: string;
//     linkedin?: string;
//     twitter?: string;
//     facebook?: string;
//     review?: string;
//     clientid: number;
//     comp?: string; // Company name
//     // vendorid?: number;
//     notes?: string;
//   }

export interface Recruiter {
  id: number;
  name: string;
  email: string;
  phone: string;
  designation: string;
  clientid: number;
  comp: string;
  status: string;
  dob: string;
  personalemail: string;
  skypeid: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  review: string;
  notes: string;
}