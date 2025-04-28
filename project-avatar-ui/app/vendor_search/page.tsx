// "use client";
// import React, { useCallback, useState } from "react";
// import axios from "axios";
// import withAuth from "@/modals/withAuth";
// import { debounce } from "lodash";
// import { FaChevronDown, FaChevronRight, FaSpinner } from "react-icons/fa";
// import { Vendor } from "@/types/Vendor";

// interface DropdownProps {
//   title: string;
//   children: React.ReactNode;
//   isOpen: boolean;
//   onClick: () => void;
// }

// const Dropdown: React.FC<DropdownProps> = ({
//   title,
//   children,
//   isOpen,
//   onClick,
// }) => (
//   <div className="mt-1">
//     <button
//       className={`flex items-center justify-between text-lg font-semibold focus:outline-none border-b-1 pb-1 w-full text-left p-2 rounded ${isOpen ? "bg-blue-300" : "bg-blue-200"}`}
//       onClick={onClick}
//     >
//       <span className="text-gray-800">{title}</span>
//       {isOpen ? <FaChevronDown /> : <FaChevronRight />}
//     </button>
//     <div
//       className={`overflow-hidden transition-max-height duration-300 ease-in-out ${isOpen ? "max-h-96" : "max-h-0"}`}
//     >
//       <div className="mt-1 border p-3 bg-gray-200 w-full">{children}</div>
//     </div>
//   </div>
// );

// const VendorSearch: React.FC = () => {
//   const [searchInput, setSearchInput] = useState("");
//   const [alertMessage, setAlertMessage] = useState<string | null>(null);
//   const [vendors, setVendors] = useState<Vendor[]>([]);
//   const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [openAccordion, setOpenAccordion] = useState<{ [key: string]: string | null }>({});

//   const API_URL = process.env.NEXT_PUBLIC_API_URL;

//   const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchInput(e.target.value);
//     debouncedSearch(e.target.value);
//   };

//   const fetchVendors = async (companyname: string) => {
//     setLoading(true);
//     const token = localStorage.getItem("token");

//     if (!token) {
//       console.error("Token not found");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.get(`${API_URL}/vendorSearch`, {
//         params: { companyname },
//         headers: { AuthToken: token },
//       });

//       if (response.data.length === 0) {
//         setAlertMessage("No Vendor found");
//       } else {
//         setAlertMessage(null);
//       }

//       setVendors(response.data);
//     } catch (error) {
//       console.error("Error fetching vendors:", error);
//       setAlertMessage("An error occurred while fetching vendors");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const debouncedSearch = useCallback(
//     debounce((companyname) => {
//       if (companyname && companyname.length > 2) {
//         fetchVendors(companyname);
//       }
//     }, 300),
//     []
//   );

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     fetchVendors(searchInput);
//   };

//   const handleVendorSelect = (vendor: Vendor) => {
//     setSelectedVendor(vendor);
//     setSearchInput(vendor.companyname);
//     setVendors([]); // Clear the vendor list after selection
//   };

//   const toggleAccordion = (vendorId: string, type: string) => {
//     setOpenAccordion((prev) => ({
//       ...prev,
//       [vendorId]: prev[vendorId] === type ? null : type,
//     }));
//   };

//   return (
//     <div className="p-10 mt-40 mb-10 ml-60 mr-60 bg-gray-100 rounded-lg shadow-md relative">
//       <h1 className="text-2xl font-bold mb-4">Vendor Search</h1>

//       <form onSubmit={handleSubmit} className="flex items-center mb-5 mt-8">
//         <input
//           type="text"
//           placeholder="Search Vendors..."
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
//         <div className="mb-4 p-1 text-red-500">{alertMessage}</div>
//       )}

//       <div className="vendor-results">
//         {loading ? (
//           <div className="flex items-center space-x-2">
//             <FaSpinner className="animate-spin text-blue-600" />
//             <span>Loading...</span>
//           </div>
//         ) : (
//           <div>
//             {vendors.length > 0 ? (
//               <div className="vendor-list bg-white p-4 rounded-lg shadow">
//                 <h2 className="text-2xl font-semibold mb-2">Results:</h2>
//                 <ul>
//                   {vendors.map((vendor) => (
//                     <li key={vendor.id} className="mb-4">
//                       <button
//                         onClick={() => handleVendorSelect(vendor)}
//                         className="text-left p-2 rounded hover:bg-gray-200 w-full"
//                       >
//                         {vendor.companyname}
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ) : (
//               <p></p>
//             )}
//           </div>
//         )}
//       </div>

//       {selectedVendor && (
//         <div className="vendor-details mt-4 bg-white p-4 rounded-lg shadow">
//           <h2 className="text-2xl font-semibold mb-2">Vendor Details:</h2>
//           <Dropdown
//             title={selectedVendor.companyname}
//             isOpen={openAccordion[String(selectedVendor.id)] === "company"}
//             onClick={() => toggleAccordion(String(selectedVendor.id), "company")}
//           >
//             <p className="font-medium">
//               <strong>Status:</strong> {selectedVendor.status}
//             </p>
//             <p className="font-medium">
//               <strong>Tier:</strong> {selectedVendor.tier}
//             </p>
//             <p className="font-medium">
//               <strong>Culture:</strong> {selectedVendor.culture}
//             </p>
//             <p className="font-medium">
//               <strong>Solicited:</strong> {selectedVendor.solicited}
//             </p>
//             <p className="font-medium">
//               <strong>Hire Before Term:</strong> {selectedVendor.hireBeforeTerm}
//             </p>
//             <p className="font-medium">
//               <strong>Hire After Term:</strong> {selectedVendor.hireAfterTerm}
//             </p>
//             <p className="font-medium">
//               <strong>Min Rate:</strong> {selectedVendor.minRate}
//             </p>
//             <p className="font-medium">
//               <strong>Account Number:</strong> {selectedVendor.accountNumber}
//             </p>
//           </Dropdown>

//           <Dropdown
//             title="Clients"
//             isOpen={openAccordion[String(selectedVendor.id)] === "clients"}
//             onClick={() => toggleAccordion(String(selectedVendor.id), "clients")}
//           >
//             <textarea
//               className="w-full p-2 border border-gray-300 rounded-md"
//               value={selectedVendor.clients}
//               readOnly
//             />
//           </Dropdown>

//           <Dropdown
//             title="HR"
//             isOpen={openAccordion[String(selectedVendor.id)] === "hr"}
//             onClick={() => toggleAccordion(String(selectedVendor.id), "hr")}
//           >
//             <p className="font-medium">
//               <strong>Late Payments:</strong> {selectedVendor.latePayments}
//             </p>
//             <p className="font-medium">
//               <strong>Total Net Term:</strong> {selectedVendor.totalNetTerm}
//             </p>
//             <p className="font-medium">
//               <strong>Defaulted Payment:</strong> {selectedVendor.defaultedPayment}
//             </p>
//             <p className="font-medium">
//               <strong>HR Name:</strong> {selectedVendor.hrName}
//             </p>
//             <p className="font-medium">
//               <strong>HR Email:</strong> {selectedVendor.hrEmail}
//             </p>
//             <p className="font-medium">
//               <strong>HR Phone:</strong> {selectedVendor.hrPhone}
//             </p>
//             <p className="font-medium">
//               <strong>Timesheet Email:</strong> {selectedVendor.timesheetEmail}
//             </p>
//           </Dropdown>

//           <Dropdown
//             title="Contact"
//             isOpen={openAccordion[String(selectedVendor.id)] === "contact"}
//             onClick={() => toggleAccordion(String(selectedVendor.id), "contact")}
//           >
//             <p className="font-medium">
//               <strong>URL:</strong>{" "}
//               <a
//                 href={selectedVendor.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-500 underline"
//               >
//                 {selectedVendor.url}
//               </a>
//             </p>
//             <p className="font-medium">
//               <strong>Email:</strong> {selectedVendor.email}
//             </p>
//             <p className="font-medium">
//               <strong>Phone:</strong> {selectedVendor.phone}
//             </p>
//             <p className="font-medium">
//               <strong>Fax:</strong> {selectedVendor.fax}
//             </p>
//             <p className="font-medium">
//               <strong>Address:</strong> {selectedVendor.address}
//             </p>
//           </Dropdown>

//           <Dropdown
//             title="Manager/Other Contacts"
//             isOpen={openAccordion[String(selectedVendor.id)] === "manager"}
//             onClick={() => toggleAccordion(String(selectedVendor.id), "manager")}
//           >
//             <p className="font-medium">
//               <strong>Mgr Name:</strong> {selectedVendor.mgrName}
//             </p>
//             <p className="font-medium">
//               <strong>Mgr Email:</strong> {selectedVendor.mgrEmail}
//             </p>
//             <p className="font-medium">
//               <strong>Mgr Phone:</strong> {selectedVendor.mgrPhone}
//             </p>
//             <p className="font-medium">
//               <strong>Sec Name:</strong> {selectedVendor.secName}
//             </p>
//             <p className="font-medium">
//               <strong>Sec Email:</strong> {selectedVendor.secEmail}
//             </p>
//             <p className="font-medium">
//               <strong>Sec Phone:</strong> {selectedVendor.secPhone}
//             </p>
//           </Dropdown>

//           <Dropdown
//             title="Agreements"
//             isOpen={openAccordion[String(selectedVendor.id)] === "agreements"}
//             onClick={() => toggleAccordion(String(selectedVendor.id), "agreements")}
//           >
//             <p className="font-medium">
//               <strong>Sub Contractor Link:</strong> {selectedVendor.subContractorLink}
//             </p>
//             <p className="font-medium">
//               <strong>NSA Link:</strong> {selectedVendor.nsaLink}
//             </p>
//             <p className="font-medium">
//               <strong>Non Hire Link:</strong> {selectedVendor.nonHireLink}
//             </p>
//           </Dropdown>

//           <Dropdown
//             title="Requirements"
//             isOpen={openAccordion[String(selectedVendor.id)] === "requirements"}
//             onClick={() => toggleAccordion(String(selectedVendor.id), "requirements")}
//           >
//             <p className="font-medium">{selectedVendor.requirements}</p>
//           </Dropdown>

//           <Dropdown
//             title="Notes"
//             isOpen={openAccordion[String(selectedVendor.id)] === "notes"}
//             onClick={() => toggleAccordion(String(selectedVendor.id), "notes")}
//           >
//             <p className="font-medium">{selectedVendor.notes}</p>
//           </Dropdown>
//         </div>
//       )}
//     </div>
//   );
// };

// export default withAuth(VendorSearch);

"use client";
import React, { useCallback, useState } from "react";
import axios from "axios";
import withAuth from "@/modals/withAuth";
import { debounce } from "lodash";
import { FaChevronDown, FaChevronRight, FaSpinner } from "react-icons/fa";
import { Vendor } from "@/types/Vendor";

interface DropdownProps {
  title?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  title,
  children,
  isOpen,
  onClick,
}) => (
  <div className="mt-1">
    <button
      className={`flex items-center justify-between text-lg font-semibold focus:outline-none border-b-1 pb-1 w-full text-left p-2 rounded ${isOpen ? "bg-blue-300" : "bg-blue-200"}`}
      onClick={onClick}
    >
      <span className="text-gray-800">{title}</span>
      {isOpen ? <FaChevronDown /> : <FaChevronRight />}
    </button>
    <div
      className={`overflow-hidden transition-max-height duration-300 ease-in-out ${isOpen ? "max-h-96" : "max-h-0"}`}
    >
      <div className="mt-1 border p-3 bg-gray-200 w-full">{children}</div>
    </div>
  </div>
);

const VendorSearch: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<{ [key: string]: string | null }>({});

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  const fetchVendors = async (companyname: string) => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token not found");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/vendorSearch`, {
        params: { companyname },
        headers: { AuthToken: token },
      });

      if (response.data.length === 0) {
        setAlertMessage("No Vendor found");
      } else {
        setAlertMessage(null);
      }

      setVendors(response.data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setAlertMessage("An error occurred while fetching vendors");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((companyname) => {
      if (companyname && companyname.length > 2) {
        fetchVendors(companyname);
      }
    }, 300),
    []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchVendors(searchInput);
  };

  const handleVendorSelect = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setSearchInput(vendor.companyname || '');
    setVendors([]); // Clear the vendor list after selection
  };

  const toggleAccordion = (vendorId: string, type: string) => {
    setOpenAccordion((prev) => ({
      ...prev,
      [vendorId]: prev[vendorId] === type ? null : type,
    }));
  };

  return (
    <div className="p-10 mt-40 mb-10 ml-60 mr-60 bg-gray-100 rounded-lg shadow-md relative">
      <h1 className="text-2xl font-bold mb-4">Vendor Search</h1>

      <form onSubmit={handleSubmit} className="flex items-center mb-5 mt-8">
        <input
          type="text"
          placeholder="Search Vendors..."
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
        <div className="mb-4 p-1 text-red-500">{alertMessage}</div>
      )}

      <div className="vendor-results">
        {loading ? (
          <div className="flex items-center space-x-2">
            <FaSpinner className="animate-spin text-blue-600" />
            <span>Loading...</span>
          </div>
        ) : (
          <div>
            {vendors.length > 0 ? (
              <div className="vendor-list bg-white p-4 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-2">Results:</h2>
                <ul>
                  {vendors.map((vendor) => (
                    <li key={vendor.id} className="mb-4">
                      <button
                        onClick={() => handleVendorSelect(vendor)}
                        className="text-left p-2 rounded hover:bg-gray-200 w-full"
                      >
                        {vendor.companyname}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p></p>
            )}
          </div>
        )}
      </div>

      {selectedVendor && (
        <div className="vendor-details mt-4 bg-white p-4 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-2">Vendor Details:</h2>
          <Dropdown
            title={selectedVendor.companyname}
            isOpen={openAccordion[String(selectedVendor.id)] === "company"}
            onClick={() => toggleAccordion(String(selectedVendor.id), "company")}
          >
            <p className="font-medium">
              <strong>Status:</strong> {selectedVendor.status}
            </p>
            <p className="font-medium">
              <strong>Tier:</strong> {selectedVendor.tier}
            </p>
            <p className="font-medium">
              <strong>Culture:</strong> {selectedVendor.culture}
            </p>
            <p className="font-medium">
              <strong>Solicited:</strong> {selectedVendor.solicited}
            </p>
            <p className="font-medium">
              <strong>Hire Before Term:</strong> {selectedVendor.hireBeforeTerm}
            </p>
            <p className="font-medium">
              <strong>Hire After Term:</strong> {selectedVendor.hireAfterTerm}
            </p>
            <p className="font-medium">
              <strong>Min Rate:</strong> {selectedVendor.minRate}
            </p>
            <p className="font-medium">
              <strong>Account Number:</strong> {selectedVendor.accountNumber}
            </p>
          </Dropdown>

          <Dropdown
            title="Clients"
            isOpen={openAccordion[String(selectedVendor.id)] === "clients"}
            onClick={() => toggleAccordion(String(selectedVendor.id), "clients")}
          >
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedVendor.clients}
              readOnly
            />
          </Dropdown>

          <Dropdown
            title="HR"
            isOpen={openAccordion[String(selectedVendor.id)] === "hr"}
            onClick={() => toggleAccordion(String(selectedVendor.id), "hr")}
          >
            <p className="font-medium">
              <strong>Late Payments:</strong> {selectedVendor.latePayments}
            </p>
            <p className="font-medium">
              <strong>Total Net Term:</strong> {selectedVendor.totalNetTerm}
            </p>
            <p className="font-medium">
              <strong>Defaulted Payment:</strong> {selectedVendor.defaultedPayment}
            </p>
            <p className="font-medium">
              <strong>HR Name:</strong> {selectedVendor.hrName}
            </p>
            <p className="font-medium">
              <strong>HR Email:</strong> {selectedVendor.hrEmail}
            </p>
            <p className="font-medium">
              <strong>HR Phone:</strong> {selectedVendor.hrPhone}
            </p>
            <p className="font-medium">
              <strong>Timesheet Email:</strong> {selectedVendor.timesheetEmail}
            </p>
          </Dropdown>

          <Dropdown
            title="Contact"
            isOpen={openAccordion[String(selectedVendor.id)] === "contact"}
            onClick={() => toggleAccordion(String(selectedVendor.id), "contact")}
          >
            <p className="font-medium">
              <strong>URL:</strong>{" "}
              <a
                href={selectedVendor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {selectedVendor.url}
              </a>
            </p>
            <p className="font-medium">
              <strong>Email:</strong> {selectedVendor.email}
            </p>
            <p className="font-medium">
              <strong>Phone:</strong> {selectedVendor.phone}
            </p>
            <p className="font-medium">
              <strong>Fax:</strong> {selectedVendor.fax}
            </p>
            <p className="font-medium">
              <strong>Address:</strong> {selectedVendor.address}
            </p>
          </Dropdown>

          <Dropdown
            title="Manager/Other Contacts"
            isOpen={openAccordion[String(selectedVendor.id)] === "manager"}
            onClick={() => toggleAccordion(String(selectedVendor.id), "manager")}
          >
            <p className="font-medium">
              <strong>Mgr Name:</strong> {selectedVendor.mgrName}
            </p>
            <p className="font-medium">
              <strong>Mgr Email:</strong> {selectedVendor.mgrEmail}
            </p>
            <p className="font-medium">
              <strong>Mgr Phone:</strong> {selectedVendor.mgrPhone}
            </p>
            <p className="font-medium">
              <strong>Sec Name:</strong> {selectedVendor.secName}
            </p>
            <p className="font-medium">
              <strong>Sec Email:</strong> {selectedVendor.secEmail}
            </p>
            <p className="font-medium">
              <strong>Sec Phone:</strong> {selectedVendor.secPhone}
            </p>
          </Dropdown>

          <Dropdown
            title="Agreements"
            isOpen={openAccordion[String(selectedVendor.id)] === "agreements"}
            onClick={() => toggleAccordion(String(selectedVendor.id), "agreements")}
          >
            <p className="font-medium">
              <strong>Sub Contractor Link:</strong> {selectedVendor.subContractorLink}
            </p>
            <p className="font-medium">
              <strong>NSA Link:</strong> {selectedVendor.nsaLink}
            </p>
            <p className="font-medium">
              <strong>Non Hire Link:</strong> {selectedVendor.nonHireLink}
            </p>
          </Dropdown>

          <Dropdown
            title="Requirements"
            isOpen={openAccordion[String(selectedVendor.id)] === "requirements"}
            onClick={() => toggleAccordion(String(selectedVendor.id), "requirements")}
          >
            <p className="font-medium">{selectedVendor.requirements}</p>
          </Dropdown>

          <Dropdown
            title="Notes"
            isOpen={openAccordion[String(selectedVendor.id)] === "notes"}
            onClick={() => toggleAccordion(String(selectedVendor.id), "notes")}
          >
            <p className="font-medium">{selectedVendor.notes}</p>
          </Dropdown>
        </div>
      )}
    </div>
  );
};

export default withAuth(VendorSearch);
