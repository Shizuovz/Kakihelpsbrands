export interface Hoarding {
  id: string;
  title: string;
  location: string;
  region: string;
  price: number;
  dimensions: string;
  type: "Digital" | "Static" | "Transit" | "Wallscape" | "Unipole";
  imageUrl: string;
  images?: string[];
  status: "Available" | "Limited" | "Booked";
  impressions: string;
  visibility?: string;
  totalSqft?: number;
  printingCharges?: number;
  mountingCharges?: number;
  totalCharges?: number;
  // Availability fields
  availableStartDate?: string;
  availableEndDate?: string;
  // Multi-tenant fields
  ownerId?: string;
  ownerName?: string;
  ownerCompany?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  createdAt?: string;
  updatedAt?: string;
}

import { API_BASE_URL } from '@/config';

const DATA_API_URL = `${API_BASE_URL}/api`;


export const fetchHoardings = async (userId?: string): Promise<Hoarding[]> => {
  try {
    const url = userId ? `${DATA_API_URL}/hoardings?userId=${userId}` : `${DATA_API_URL}/hoardings`;
    const response = await fetch(url);
    if (response.ok) {
      const result = await response.json();
      return result.data;
    } else {
      throw new Error('Failed to fetch hoardings');
    }
  } catch (error) {
    console.error('Error fetching hoardings:', error);
    // Return empty array instead of mock data
    return [];
  }
};

export const fetchUserHoardings = async (userId: string): Promise<Hoarding[]> => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${DATA_API_URL}/user/hoardings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const result = await response.json();
      return result.data;
    } else {
      throw new Error('Failed to fetch user hoardings');
    }
  } catch (error) {
    console.error('Error fetching user hoardings:', error);
    return [];
  }
};

export const fetchRegions = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${DATA_API_URL}/regions`);
    if (response.ok) {
      const result = await response.json();
      return result.data;
    } else {
      throw new Error('Failed to fetch regions');
    }
  } catch (error) {
    console.error('Error fetching regions:', error);
    return [];
  }
};

export const fetchTypes = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${DATA_API_URL}/types`);
    if (response.ok) {
      const result = await response.json();
      return result.data;
    } else {
      throw new Error('Failed to fetch types');
    }
  } catch (error) {
    console.error('Error fetching types:', error);
    return [];
  }
};
