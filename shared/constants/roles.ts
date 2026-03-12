// for data using
export const ROLES = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  CUSTOMER: 'CUSTOMER',
} as const; //readonly

//for validation - obj[key]
export type Role = (typeof ROLES)[keyof typeof ROLES];
