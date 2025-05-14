export interface Client {
    id: number; // Change this to number if it's currently a string
    name: string; 
    companyname: string; // Editable, frozen, width: 250, uppercase
    email: string; // Editable, width: 200, lowercase, required
    phone: string; // Editable, width: 150
    status: string; // Editable, width: 90, select options
    url?: string; // Editable, width: 200, lowercase
    fax?: string; // Editable, width: 150
    address: string; // Editable, width: 150
    city: string; // Editable, width: 120, autocomplete
    state: string; // Editable, width: 120, autocomplete
    country: string; // Editable, width: 120, autocomplete
    zip: string; // Editable, width: 120, autocomplete
    twitter?: string; // Editable, width: 200
    facebook?: string; // Editable, width: 200
    linkedIn?: string; // Editable, width: 200
    manager1Name: string; // Editable, width: 200
    manager1Email: string; // Editable, width: 150, required
    manager1Phone: string; // Editable, width: 90
    hmName: string; // Editable, width: 200
    hmEmail: string; // Editable, width: 150, required
    hmPhone: string; // Editable, width: 90
    hrName: string; // Editable, width: 200
    hrEmail: string; // Editable, width: 150, required
    hrPhone: string; // Editable, width: 90
    notes?: string; // Editable, width: 400, textarea
    lastModDateTime: string; // Not editable
    createdAt?: string; // Not editable
    updatedAt?: string; // Not editable
    isActive?: boolean; // Optional
}

// Type for creating a new client (omit auto-generated fields)
export type ClientCreate = Omit<Client, 'id' | 'lastModDateTime' | 'createdAt' | 'updatedAt'>;

// Type for updating a client (all fields optional except id)
export type ClientUpdate = Partial<Omit<Client, 'id'>> & { id: string };

// Type for client status options
export enum ClientStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    PENDING = 'PENDING',
    SUSPENDED = 'SUSPENDED'
}

// Type for client tier options
export enum ClientTier {
    PREMIUM = 'PREMIUM',
    STANDARD = 'STANDARD',
    BASIC = 'BASIC'
}

// Type for API response with pagination
export interface PaginatedResponse<T> {
    data: T[];
    totalRows: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
}

// Type for client search parameters
export interface ClientSearchParams {
    search?: string; // Optional search parameter
    status?: ClientStatus; // Optional status filter
    tier?: ClientTier; // Optional tier filter
    page: number; // Current page number
    pageSize: number; // Number of items per page
    sortField?: keyof Client; // Field to sort by
    sortOrder?: 'asc' | 'desc'; // Sort order
}

// Type for autocomplete response
export interface AutocompleteResponse {
    id: string | number; // ID of the item
    label: string; // Display label
    value: string; // Value to be used
}

// Validation patterns
export const ValidationPatterns = {
    email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, // Email validation
    phone: /^\+?[1-9]\d{1,14}$/, // Phone validation
    url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, // URL validation
    zip: /^\d{5}(-\d{4})?$/, // Zip code validation
};

// Error response type
export interface ErrorResponse {
    message: string; // Error message
    code?: string; // Optional error code
    details?: Record<string, string[]>; // Optional details about the error
}