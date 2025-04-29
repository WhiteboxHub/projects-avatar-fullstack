
"use client";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";

interface Vendor {
  id?: number;
  name: string;
  vendorid: number;
  companyname?: string;
  status?: string;
  tier: number;
  accountnumber?: string;
  email?: string;
  phone?: string;
  fax?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  url?: string;
  solicited?: string;
  hireBeforeTerm?: string;
  hireAfterTerm?: string;
  minrate?: number;
  latePayments?: string;
  totalNetTerm?: string;
  defaultedPayment?: string;
  culture?: string;
  hrName?: string;
  hrEmail?: string;
  hrPhone?: string;
  managername: string;
  manageremail?: string;
  managerphone?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  secName?: string;
  secEmail?: string;
  secPhone?: string;
  timesheetEmail?: string;
  agreementstatus?: string;
  agreementname: string;
  agreementlink: string;
  subContractorLink?: string;
  nsaLink?: string;
  nonhirelink?: string;
  clients?: string;
  notes?: string;
  recruiters?: any[];
  recruiter_count?: number;
  isGroup?: boolean;
  isCollapsed?: boolean;
  lastmoddatetime?: string;
  clientid?: string;
}

interface EditRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorData: Vendor | null;
  onSave: () => Promise<void>;
}

const EditRowVendor: React.FC<EditRowModalProps> = ({
  isOpen,
  onClose,
  vendorData,
  onSave,
}) => {
  const [formData, setFormData] = useState<Vendor | null>(null);

  // Options for dropdowns
  const statusOptions = ["Current", "blacklist", "rejectedus", "duplicate"];
  const yesNoOptions = ["Y", "N"];
  const cultureOptions = ["D", "A", "B", "C"];
  const agreementStatusOptions = ["Not Available", "Not Complete", "Complete"];

  useEffect(() => {
    if (vendorData) {
      setFormData(vendorData);
    } else {
      setFormData({
        name: '',
        vendorid: 0,
        companyname: '',
        status: 'Current',
        accountnumber: '',
        tier: 2,
        email: '',
        phone: '',
        fax: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zip: '',
        url: '',
        solicited: 'N',
        hireBeforeTerm: 'N',
        hireAfterTerm: 'N',
        minrate: 62,
        latePayments: 'N',
        totalNetTerm: '45',
        defaultedPayment: 'N',
        culture: 'D',
        hrName: '',
        hrEmail: '',
        hrPhone: '',
        managername: '',
        twitter: '',
        facebook: '',
        linkedin: '',
        manageremail: '',
        managerphone: '',
        secName: '',
        secEmail: '',
        secPhone: '',
        timesheetEmail: '',
        agreementstatus: 'Not Available',
        agreementname: '',
        agreementlink: '',
        subContractorLink: '',
        nsaLink: '',
        nonhirelink: '',
        clients: '',
        notes: '',
      });
    }
  }, [vendorData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev!,
      [name]: ['tier', 'minrate', 'totalnetterm'].includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      const endpoint = formData.id 
        ? `${process.env.NEXT_PUBLIC_API_URL}/vendor/edit/${formData.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/vendor/add`;

      const method = formData.id ? 'put' : 'post';

      await axios[method](endpoint, formData, {
        headers: { 
          'Content-Type': 'application/json',
          AuthToken: localStorage.getItem('token') || ''
        },
      });

      await onSave();
      onClose();
    } catch (error) {
      console.error("Error saving vendor:", error);
    }
  };

  if (!formData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          maxWidth: '800px',
          width: '90%',
          maxHeight: '90vh',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          overflowY: 'auto',
          fontFamily: 'Arial, sans-serif',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        },
      }}
      contentLabel={formData.id ? "Edit Vendor" : "Add Vendor"}
      ariaHideApp={false}
    >
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-2xl font-semibold text-red-500 hover:text-red-700 transition duration-200"
        >
          <AiOutlineClose />
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {formData.id ? 'Edit Vendor' : 'Add Vendor'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                name="companyname"
                value={formData.companyname || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Account Number</label>
              <input
                type="text"
                name="accountnumber"
                value={formData.accountnumber || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tier</label>
              <select
                name="tier"
                value={formData.tier || 2}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              >
                {[1, 2, 3, 4].map(tier => (
                  <option key={tier} value={tier}>Tier {tier}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Fax</label>
              <input
                type="text"
                name="fax"
                value={formData.fax || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Zip</label>
              <input
                type="text"
                name="zip"
                value={formData.zip || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Website URL</label>
              <input
                type="url"
                name="url"
                value={formData.url || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Solicited</label>
              <select
                name="solicited"
                value={formData.solicited || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              >
                {yesNoOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Hire Before Term</label>
              <select
                name="hirebeforeterm"
                value={formData.hireBeforeTerm || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              >
                {yesNoOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Hire After Term</label>
              <select
                name="hireafterterm"
                value={formData.hireAfterTerm || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              >
                {yesNoOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Min Rate</label>
              <input
                type="number"
                name="minrate"
                value={formData.minrate || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Late Payments</label>
              <select
                name="latepayments"
                value={formData.latePayments || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              >
                {yesNoOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Total Net Term</label>
              <input
                type="number"
                name="totalnetterm"
                value={formData.totalNetTerm || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Additional sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Column 1 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">HR Information</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">HR Name</label>
              <input
                type="text"
                name="hrname"
                value={formData.hrName || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">HR Email</label>
              <input
                type="email"
                name="hremail"
                value={formData.hrEmail || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">HR Phone</label>
              <input
                type="text"
                name="hrphone"
                value={formData.hrPhone || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Manager Information</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Manager Name</label>
              <input
                type="text"
                name="managername"
                value={formData.managername || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Manager Email</label>
              <input
                type="email"
                name="manageremail"
                value={formData.manageremail || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Manager Phone</label>
              <input
                type="text"
                name="managerphone"
                value={formData.managerphone || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Twitter</label>
            <input
              type="text"
              name="twitter"
              value={formData.twitter || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Facebook</label>
            <input
              type="text"
              name="facebook"
              value={formData.facebook || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn</label>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Agreement Information */}
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Agreement Information</h3>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Agreement Status</label>
            <select
              name="agreementstatus"
              value={formData.agreementstatus || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            >
              {agreementStatusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Agreement Name</label>
            <input
              type="text"
              name="agreementname"
              value={formData.agreementname || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Agreement Link</label>
            <input
              type="url"
              name="agreementlink"
              value={formData.agreementlink || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            rows={4}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Vendor
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditRowVendor;