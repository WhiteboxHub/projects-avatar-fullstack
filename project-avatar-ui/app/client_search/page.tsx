"use client";
import React, { useState, useCallback } from "react";
import axios from "axios";
import withAuth from "@/modals/withAuth";
import { FaSpinner, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { debounce } from "lodash";
import { Client } from "@/types/client";

interface DropdownProps {
  title: string;
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
      className={`flex items-center justify-between text-lg font-semibold focus:outline-none border-b-1 pb-1 w-full text-left p-2 rounded ${
        isOpen ? "bg-blue-300" : "bg-blue-200"
      }`}
      onClick={onClick}
    >
      <span className="text-gray-800">{title}</span>
      {isOpen ? <FaChevronDown /> : <FaChevronRight />}
    </button>
    <div
      className={`overflow-hidden transition-max-height duration-300 ease-in-out ${
        isOpen ? "max-h-96" : "max-h-0"
      }`}
    >
      <div className="mt-1 border p-3 bg-gray-200 w-full">{children}</div>
    </div>
  </div>
);

const ClientSearch: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<{
    [key: string]: string | null;
  }>({});

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  const fetchClients = async (companyname: string) => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token not found");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/clientSearch`, {
        params: { companyname },
        headers: { AuthToken: token },
      });

      if (response.data.length === 0) {
        setAlertMessage("No Client found");
      } else {
        setAlertMessage(null);
      }

      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setAlertMessage("An error occurred while fetching clients");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((companyname) => {
      if (companyname && companyname.length > 2) {
        fetchClients(companyname);
      }
    }, 300),
    []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchClients(searchInput);
  };

  const toggleAccordion = (clientId: string, type: string) => {
    setOpenAccordion((prev) => ({
      ...prev,
      [clientId]: prev[clientId] === type ? null : type,
    }));
  };

  return (
    <div className="p-10 mt-40 mb-10 ml-60 mr-60 bg-gray-100 rounded-lg shadow-md relative">
      <h1 className="text-2xl font-bold mb-4">Client Search</h1>

      <form onSubmit={handleSubmit} className="flex items-center mb-5 mt-8">
        <input
          type="text"
          placeholder="Search Clients..."
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

      <div className="client-results">
        {loading ? (
          <div className="flex items-center space-x-2">
            <FaSpinner className="animate-spin text-blue-600" />
            <span>Loading...</span>
          </div>
        ) : (
          <div>
            {clients.length > 0 ? (
              <div className="client-list bg-white p-4 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-2">Results:</h2>
                <ul>
                  {clients.map((client) => (
                    <li key={client.id} className="mb-4">
                      <Dropdown
                        title={client.companyname}
                        isOpen={openAccordion[client.id] === "company"}
                        onClick={() => toggleAccordion(client.id, "company")}
                      >
                        <p className="font-medium">
                          <strong>Status:</strong> {client.status}
                        </p>
                        <p className="font-medium">
                          <strong>Tier:</strong> {client.tier}
                        </p>
                      </Dropdown>

                      <Dropdown
                        title="Contact"
                        isOpen={openAccordion[client.id] === "contact"}
                        onClick={() => toggleAccordion(client.id, "contact")}
                      >
                        <p className="font-medium">
                          <strong>Email:</strong> {client.email}
                        </p>
                        <p className="font-medium">
                          <strong>Phone:</strong> {client.phone}
                        </p>
                        <p className="font-medium">
                          <strong>Fax:</strong> {client.fax}
                        </p>
                        <p className="font-medium">
                          <strong>URL:</strong>{" "}
                          <a
                            href={client.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            {client.url}
                          </a>
                        </p>
                        <p className="font-medium">
                          <strong>Address:</strong> {client.address}
                        </p>
                      </Dropdown>

                      <Dropdown
                        title="Notes"
                        isOpen={openAccordion[client.id] === "notes"}
                        onClick={() => toggleAccordion(client.id, "notes")}
                      >
                        <p className="font-medium">{client.notes}</p>
                      </Dropdown>
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
    </div>
  );
};

export default withAuth(ClientSearch);
