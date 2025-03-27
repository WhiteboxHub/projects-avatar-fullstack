export interface MktSubmission {
  id: number;
  submissiondate: string;
  candidateid: number;
  employeeid: number;
  submitter: number;
  course: string;
  email: string;
  phone: string;
  url: string;
  name: string;
  location: string;
  notes: string;
  feedback: string;
  candidate_name?: string;
  employee_name?: string;
}

export interface CandidateOption {
  id: number;
  name: string;
  skill: string;
}

export interface EmployeeOption {
  id: number;
  name: string;
}

