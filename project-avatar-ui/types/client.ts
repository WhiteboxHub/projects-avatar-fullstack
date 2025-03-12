// Base Client type with all fields
export interface Client {
    id: string;
    companyname: string;
    tier: string;
    status: string;
    email: string;
    phone: string;
    fax?: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    url: string;
    twitter?: string;
    facebook?: string;
    linkedIn?: string;
    manager1Name: string;
    manager1Email: string;
    manager1Phone: string;
    hmName: string;
    hmEmail: string;
    hmPhone: string;
    hrName: string;
    hrEmail: string;
    hrPhone: string;
    notes?: string;
    lastModDateTime: string;
    createdAt?: string;
    updatedAt?: string;
    isActive?: boolean;
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
    search?: string;
    status?: ClientStatus;
    tier?: ClientTier;
    page: number;
    pageSize: number;
    sortField?: keyof Client;
    sortOrder?: 'asc' | 'desc';
  }
  
  // Type for autocomplete response
  export interface AutocompleteResponse {
    id: string | number;
    label: string;
    value: string;
  }
  
  // Validation patterns
  export const ValidationPatterns = {
    email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    phone: /^\+?[1-9]\d{1,14}$/, 
    url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
    zip: /^\d{5}(-\d{4})?$/,
  };
  
  // Error response type
  export interface ErrorResponse {
    message: string;
    code?: string;
    details?: Record<string, string[]>;
  }