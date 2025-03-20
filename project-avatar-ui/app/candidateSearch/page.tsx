// // avatar/wbl_admin/app/candidateSearch/page.tsx

// "use client";
// import React, { useState, useCallback } from "react";
// import axios from "axios";
// import withAuth from "@/modals/withAuth";
// import { FaSpinner, FaChevronDown, FaChevronRight } from "react-icons/fa";
// import { debounce } from "lodash";
// import { Candidate } from "../../types/index";

// interface DropdownProps {
//   title: string;
//   children: React.ReactNode;
//   isOpen: boolean;
//   onClick: () => void;
// }

// const Dropdown: React.FC<DropdownProps> = ({ title, children, isOpen, onClick }) => (
//   <div className="mt-1">
//     <button
//       className="flex items-center justify-between text-lg font-semibold focus:outline-none border-b-1 pb-1 w-full text-left bg-blue-200 p-2 rounded "
//       onClick={onClick}
//     >
//       <span className="text-gray-800">{title}</span>
//       {/* {isOpen ? <FaChevronUp /> : <FaChevronDown />} */}
//       {isOpen ? <FaChevronDown /> : <FaChevronRight />}
//     </button>
//     {isOpen && <div className="mt-1 border p-1 bg-gray-200 w-full">{children}</div>}
//   </div>
// );

// const CandidateSearch: React.FC = () => {
//   const [searchInput, setSearchInput] = useState("");
//   const [alertMessage, setAlertMessage] = useState<string | null>(null);
//   const [candidates, setCandidates] = useState<Candidate[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);

//   const API_URL = process.env.NEXT_PUBLIC_API_URL;

//   const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchInput(e.target.value);
//     debouncedSearch(e.target.value);
//   };

//   const fetchCandidates = async (name: string) => {
//     setLoading(true);
//     const token = localStorage.getItem("token");

//     if (!token) {
//       console.error("Token not found");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.get(`${API_URL}/searchByName`, {
//         params: { name },
//         headers: { AuthToken: token },
//       });


//       if (response.data.length === 0) {
//         setAlertMessage("No Candidate found");
//       } else {
//         setAlertMessage(null);
//       }

//       setCandidates(response.data);
//     } catch (error) {
//       console.error("Error fetching candidates:", error);
//       setAlertMessage("An error occurred while fetching candidates");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const debouncedSearch = useCallback(
//     debounce((name) => {
//       if (name && name.length > 2) {
//         fetchCandidates(name);
//       }
//     }, 300),
//     []
//   );

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     fetchCandidates(searchInput);
//   };

//   const toggleDropdown = (title: string) => {
//     setOpenDropdown(openDropdown === title ? null : title);
//   };


//   const handleCandidateSelect = (candidate: Candidate) => {
//     setSelectedCandidate(candidate);
//     setCandidates([]); // Clear the candidate list
//   };


//   return (
//     <div className="p-10 mt-40 mb-10 ml-60 mr-60 bg-gray-100 rounded-lg shadow-md relative">
//       {/* {alertMessage && (
//         <div className="fixed top-4 right-4 p-4 text-red rounded-md shadow-md z-50">
//           {alertMessage}
//         </div>
//       )} */}
//       <h1 className="text-2xl font-bold mb-4">Candidate Search</h1>

//       <form onSubmit={handleSubmit} className="flex items-center mb-5 mt-8">
//         <input
//           type="text"
//           placeholder="Search Candidates..."
//           value={searchInput}
//           onChange={handleSearchInput}
//           className="p-2 w-64 border border-gray-300 rounded-md mr-2"
//         />
//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700"
//         >
//           Search
//         </button>
//       </form>

//       {alertMessage && (
//       <div className="mb-4 p-1  text-red-500  ">
//         {alertMessage}
//       </div>
//     )}

//       <div className="candidate-results">
//         {loading ? (
//           <div className="flex items-center space-x-2">
//             <FaSpinner className="animate-spin text-blue-600" />
//             <span>Loading...</span>
//           </div>
//         ) : (
//           <div>
//             {candidates.length > 0 ? (
//               <div className="candidate-list bg-white p-4 rounded-lg shadow">
//                 <h2 className="text-2xl font-semibold mb-2">Results:</h2>
//                 <ul>
//                   {candidates.map((candidate) => (
//                     <li
//                     key={candidate.id}
//                     onClick={() => handleCandidateSelect(candidate)}
//                     className="p-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
//                   >
//                     {candidate.name} - {candidate.email}
//                   </li>
//                   ))}
//                 </ul>
//               </div>
//             ) : (
//               <p></p>
//             )}
//           </div>
//         )}

//         {selectedCandidate && (
//           <div className="selected-candidate mt-4 bg-gray-50 p-4 rounded-lg shadow">
//             <h3 className="text-xl font-bold">Candidate List :</h3>


//             <br></br>
//             <Dropdown title={selectedCandidate.name} isOpen={openDropdown === ""} onClick={() => toggleDropdown("")}>
//             <p>
//               <strong>Name:</strong> {selectedCandidate.name}
//             </p>  
//             <p>
//               <strong>Email:</strong> {selectedCandidate.email}
//             </p>
//             <p>
//               <strong>Enrolled Date:</strong> {selectedCandidate.enrolleddate}
//             </p>
//             <p>
//               <strong>DOB:</strong> {selectedCandidate.dob}
//             </p>
//             <p>
//               <strong>Status:</strong> {selectedCandidate.status}
//             </p>
//             <p>
//               <strong>Batch:</strong> {selectedCandidate.batchname}
//             </p>
//             <p>
//               <strong>Address:</strong> {selectedCandidate.address}
//             </p>
//             <p>
//               <strong>Work Status:</strong> {selectedCandidate.workexperience}
//             </p>
//             <p>
//               <strong>Education:</strong> {selectedCandidate.education}
//             </p>
//             <p>
//               <strong>Work Experience:</strong> {selectedCandidate.workexperience}
//             </p>
//             </Dropdown>

//             <Dropdown title="More Information" isOpen={openDropdown === "More Information"} onClick={() => toggleDropdown("More Information")}>
//               <p>
//                 <strong>Sec Name:</strong> {selectedCandidate.name}
//               </p>
//               <p>
//                 <strong>Sec Email:</strong> {selectedCandidate.email}
//               </p>
//               <p>
//                  <strong>Gurantor Name:</strong> {selectedCandidate.enrolleddate}
//                </p>
//                <p>
//                  <strong>Gurantor Designation:</strong> {selectedCandidate.dob}
//                </p>
//                <p>
//                </p>
//                <p>
//                  <strong>Emer Name:</strong> {selectedCandidate.name}
//                </p>
//                <p>
//                 <strong>Emer Email:</strong> {selectedCandidate.email}
//                </p>
//                <p>
//                  <strong>Emer Phone:</strong> {selectedCandidate.phone}
//                </p>
//               <p>
//                 <strong>Emer Address:</strong> {selectedCandidate.address}
//               </p>
//               {/* Add other details here */}
//             </Dropdown>

//             <Dropdown title="Agreement" isOpen={openDropdown === "Agreement"} onClick={() => toggleDropdown("Agreement")}>
//               <p>
//                 <strong>Contract:</strong> {selectedCandidate.contracturl}
//               </p>
//               <p>
//                 <strong>Emp Agreement:</strong> {selectedCandidate.agreement}
//                </p>
//                <p>
//                  <strong> Offer Letter:</strong> {selectedCandidate.offerletter}
//                </p>
//                <p>
//                  <strong>DL:</strong> {selectedCandidate.driverslicense}
//                </p>
//                <p>
//                  <strong>Work Permit:</strong> {selectedCandidate.workpermit}
//               </p>
//               <p>
//                  <strong>SSN URL:</strong> {selectedCandidate.ssnvalidated}
//                </p>
//                <p>
//                  <strong>SSN:</strong> {selectedCandidate.ssn}
//                </p>
//                <p>
//                  <strong>Work Status:</strong> {selectedCandidate.workexperience}
//                </p>
//                <p>
//                 <strong>Education:</strong> {selectedCandidate.education}
//              </p>
//               {/* Add other details here */}
//             </Dropdown>

//             <Dropdown title="Portal Login" isOpen={openDropdown === "Portal Login"} onClick={() => toggleDropdown("Portal Login")}>
//               <p>
//                 <strong>Address:</strong> {selectedCandidate.address}
//               </p>
//               <p>
//                  <strong>User Name:</strong> {selectedCandidate.name}
//               </p>
//               <p>
//                 <strong>Phone:</strong> {selectedCandidate.email}
//               </p>
//                <p>
//                 {/* <strong>Last Login:</strong> {selectedCandidate.lastlogin} */}
//                </p>
//               <p>
//                  <strong>Reg Data:</strong> {selectedCandidate.dob}
//                </p>
//               <p>
//                {/* <strong>Login Count :</strong> {selectedCandidate.logincount } */}
//               </p>
//               {/* Add other details here */}
//             </Dropdown>

//             <Dropdown title="Notes" isOpen={openDropdown === "Notes 1"} onClick={() => toggleDropdown("Notes 1")}>
//               <p>
//                 <strong>Notes:</strong> {selectedCandidate.notes}
//               </p>
//             </Dropdown>

//             <Dropdown title="Login History" isOpen={openDropdown === "Login History"} onClick={() => toggleDropdown("Login History")}>
//               <p>
//                 {/* <strong>Login Count:</strong> {selectedCandidate.logincount} */}
//               </p>
//             </Dropdown>

//             <Dropdown title="Original Resume" isOpen={openDropdown === "Original Resume"} onClick={() => toggleDropdown("Original Resume")}>
//               <p>
//                 {/* <strong>Resume:</strong> {selectedCandidate.resumeid} */}
//               </p>
//             </Dropdown>

//             <Dropdown title="Fee and Salary" isOpen={openDropdown === "Fee and Salary"} onClick={() => toggleDropdown("Fee and Salary")}>
//               <p>
//                 <strong>Fee Paid:</strong> {selectedCandidate.feepaid}
//               </p>
//               <p>
//                 <strong>Fee Due :</strong> {selectedCandidate.feedue}
//                </p>
//                <p>
//                  <strong>Term:</strong> {selectedCandidate.term}
//               </p>
//               <p>
//                 <strong>Salary 1:</strong> {selectedCandidate.salary0}              </p>
//              <p>
//                 <strong>Salary 2:</strong> {selectedCandidate.salary12}
//               </p>
//               {/* Add other details here */}
//             </Dropdown>

//             <Dropdown title="Recruiter Assessment" isOpen={openDropdown === "Recruiter Assessment"} onClick={() => toggleDropdown("Recruiter Assessment")}>
//               <p>
//                 {/* <strong>Instructor:</strong> {selectedCandidate.instructor} */}
//               </p>
//             </Dropdown>

//             <Dropdown title="Instructor Assessment" isOpen={openDropdown === "Instructor Assessment"} onClick={() => toggleDropdown("Instructor Assessment")}>
//               <p>
//                 {/* <strong>Instructor:</strong> {selectedCandidate.instructor} */}
//               </p>
//             </Dropdown>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default withAuth(CandidateSearch);


// avatar/wbl_admin/app/candidateSearch/page.tsx

"use client";
import React, { useState, useCallback } from "react";
import axios from "axios";
import withAuth from "@/modals/withAuth";
import { FaSpinner, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { debounce } from "lodash";
import { Candidate } from "../../types/index";

interface DropdownProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ title, children, isOpen, onClick }) => (
  <div className="mt-1">
    <button
      className="flex items-center justify-between text-lg font-semibold focus:outline-none border-b-1 pb-1 w-full text-left bg-blue-200 p-2 rounded "
      onClick={onClick}
    >
      <span className="text-gray-800">{title}</span>
      {isOpen ? <FaChevronDown /> : <FaChevronRight />}
    </button>
    {isOpen && <div className="mt-1 border p-1 bg-gray-200 w-full">{children}</div>}
  </div>
);

const CandidateSearch: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  const fetchCandidates = async (name: string) => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token not found");
      setLoading(false);
      return;
    }

    try {
      // Update the endpoint to match the backend API
      const response = await axios.post(`${API_URL}/candidates/search`, {
        name: name
      }, {
        headers: { AuthToken: token },
      });

      if (response.data.length === 0) {
        setAlertMessage("No Candidate found");
      } else {
        setAlertMessage(null);
      }

      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setAlertMessage("An error occurred while fetching candidates");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((name) => {
      if (name && name.length > 2) {
        fetchCandidates(name);
      }
    }, 300),
    []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchCandidates(searchInput);
  };

  const toggleDropdown = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };

  const handleCandidateSelect = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setCandidates([]); // Clear the candidate list
  };

  return (
    <div className="p-10 mt-40 mb-10 ml-60 mr-60 bg-gray-100 rounded-lg shadow-md relative">
      <h1 className="text-2xl font-bold mb-4">Candidate Search</h1>

      <form onSubmit={handleSubmit} className="flex items-center mb-5 mt-8">
        <input
          type="text"
          placeholder="Search Candidates..."
          value={searchInput}
          onChange={handleSearchInput}
          className="p-2 w-64 border border-gray-300 rounded-md mr-2"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {alertMessage && (
        <div className="mb-4 p-1 text-red-500">
          {alertMessage}
        </div>
      )}

      <div className="candidate-results">
        {loading ? (
          <div className="flex items-center space-x-2">
            <FaSpinner className="animate-spin text-blue-600" />
            <span>Loading...</span>
          </div>
        ) : (
          <div>
            {candidates.length > 0 ? (
              <div className="candidate-list bg-white p-4 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-2">Results:</h2>
                <ul>
                  {candidates.map((candidate) => (
                    <li
                      key={candidate.id}
                      onClick={() => handleCandidateSelect(candidate)}
                      className="p-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                    >
                      {candidate.name} - {candidate.email}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p></p>
            )}
          </div>
        )}

        {selectedCandidate && (
          <div className="selected-candidate mt-4 bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold">Candidate List :</h3>

            <br></br>
            <Dropdown title={selectedCandidate.name} isOpen={openDropdown === ""} onClick={() => toggleDropdown("")}>
              <p>
                <strong>Name:</strong> {selectedCandidate.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedCandidate.email}
              </p>
              <p>
                <strong>Enrolled Date:</strong> {selectedCandidate.enrolleddate}
              </p>
              <p>
                <strong>DOB:</strong> {selectedCandidate.dob}
              </p>
              <p>
                <strong>Status:</strong> {selectedCandidate.status}
              </p>
              <p>
                <strong>Batch:</strong> {selectedCandidate.batchname}
              </p>
              <p>
                <strong>Address:</strong> {selectedCandidate.address}
              </p>
              <p>
                <strong>Work Status:</strong> {selectedCandidate.workexperience}
              </p>
              <p>
                <strong>Education:</strong> {selectedCandidate.education}
              </p>
              <p>
                <strong>Work Experience:</strong> {selectedCandidate.workexperience}
              </p>
            </Dropdown>

            <Dropdown title="More Information" isOpen={openDropdown === "More Information"} onClick={() => toggleDropdown("More Information")}>
              <p>
                <strong>Sec Name:</strong> {selectedCandidate.name}
              </p>
              <p>
                <strong>Sec Email:</strong> {selectedCandidate.email}
              </p>
              <p>
                <strong>Gurantor Name:</strong> {selectedCandidate.enrolleddate}
              </p>
              <p>
                <strong>Gurantor Designation:</strong> {selectedCandidate.dob}
              </p>
              <p>
                <strong>Emer Name:</strong> {selectedCandidate.name}
              </p>
              <p>
                <strong>Emer Email:</strong> {selectedCandidate.email}
              </p>
              <p>
                <strong>Emer Phone:</strong> {selectedCandidate.phone}
              </p>
              <p>
                <strong>Emer Address:</strong> {selectedCandidate.address}
              </p>
            </Dropdown>

            <Dropdown title="Agreement" isOpen={openDropdown === "Agreement"} onClick={() => toggleDropdown("Agreement")}>
              <p>
                <strong>Contract:</strong> {selectedCandidate.contracturl}
              </p>
              <p>
                <strong>Emp Agreement:</strong> {selectedCandidate.agreement}
              </p>
              <p>
                <strong>Offer Letter:</strong> {selectedCandidate.offerletter}
              </p>
              <p>
                <strong>DL:</strong> {selectedCandidate.driverslicense}
              </p>
              <p>
                <strong>Work Permit:</strong> {selectedCandidate.workpermit}
              </p>
              <p>
                <strong>SSN URL:</strong> {selectedCandidate.ssnvalidated}
              </p>
              <p>
                <strong>SSN:</strong> {selectedCandidate.ssn}
              </p>
              <p>
                <strong>Work Status:</strong> {selectedCandidate.workexperience}
              </p>
              <p>
                <strong>Education:</strong> {selectedCandidate.education}
              </p>
            </Dropdown>

            <Dropdown title="Portal Login" isOpen={openDropdown === "Portal Login"} onClick={() => toggleDropdown("Portal Login")}>
              <p>
                <strong>Address:</strong> {selectedCandidate.address}
              </p>
              <p>
                <strong>User Name:</strong> {selectedCandidate.name}
              </p>
              <p>
                <strong>Phone:</strong> {selectedCandidate.email}
              </p>
              <p>
                <strong>Reg Data:</strong> {selectedCandidate.dob}
              </p>
            </Dropdown>

            <Dropdown title="Notes" isOpen={openDropdown === "Notes 1"} onClick={() => toggleDropdown("Notes 1")}>
              <p>
                <strong>Notes:</strong> {selectedCandidate.notes}
              </p>
            </Dropdown>

            <Dropdown title="Login History" isOpen={openDropdown === "Login History"} onClick={() => toggleDropdown("Login History")}>
              <p>
                {/* <strong>Login Count:</strong> {selectedCandidate.logincount} */}
              </p>
            </Dropdown>

            <Dropdown title="Original Resume" isOpen={openDropdown === "Original Resume"} onClick={() => toggleDropdown("Original Resume")}>
              <p>
                {/* <strong>Resume:</strong> {selectedCandidate.resumeid} */}
              </p>
            </Dropdown>

            <Dropdown title="Fee and Salary" isOpen={openDropdown === "Fee and Salary"} onClick={() => toggleDropdown("Fee and Salary")}>
              <p>
                <strong>Fee Paid:</strong> {selectedCandidate.feepaid}
              </p>
              <p>
                <strong>Fee Due:</strong> {selectedCandidate.feedue}
              </p>
              <p>
                <strong>Term:</strong> {selectedCandidate.term}
              </p>
              <p>
                <strong>Salary 1:</strong> {selectedCandidate.salary0}
              </p>
              <p>
                <strong>Salary 2:</strong> {selectedCandidate.salary12}
              </p>
            </Dropdown>

            <Dropdown title="Recruiter Assessment" isOpen={openDropdown === "Recruiter Assessment"} onClick={() => toggleDropdown("Recruiter Assessment")}>
              <p>
                {/* <strong>Instructor:</strong> {selectedCandidate.instructor} */}
              </p>
            </Dropdown>

            <Dropdown title="Instructor Assessment" isOpen={openDropdown === "Instructor Assessment"} onClick={() => toggleDropdown("Instructor Assessment")}>
              <p>
                {/* <strong>Instructor:</strong> {selectedCandidate.instructor} */}
              </p>
            </Dropdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(CandidateSearch);
