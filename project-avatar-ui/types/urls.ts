// Create a shared interface (you can put this in a types.ts file)
export interface Url {
    sl_no: number;  // Make this required since your backend seems to require it
    url: string;
    id?: string;    // Keep optional if it might be undefined
  }