import apiClient from '../../../lib/api-client';

export interface PersonResponse {
  _id: string;
  name: string;
  slug: string;
  avatar?: string;
  images: string[];
  nationality?: string;
  biography?: string;
  birthDate?: string;
  height?: number;
  viewCount: number;
  roles: string[];
}

export const getPersons = (params?: Record<string, any>) =>
  apiClient.get('/persons', { params });

export const getPersonBySlug = (slug: string) =>
  apiClient.get(`/persons/slug/${slug}`);

export const getNationalities = (role?: string) =>
  apiClient.get('/persons/nationalities', { params: { role } });
