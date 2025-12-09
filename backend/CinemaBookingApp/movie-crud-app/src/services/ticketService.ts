import type { ApiResponse, TicketDTO, MyTicketDTO, CreateTicketDTO, TicketCheckingDTO } from '../types/ticket.types';
import { API_CONFIG } from '../config/api.config';

const API_BASE_URL = `${API_CONFIG.BASE_URL}/api/ticket`;

const getAuthToken = (): string => {
  return localStorage.getItem('authToken') || '';
};

const getHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

export const ticketService = {
  // GET - Lấy tất cả tickets của user
  getAllMyTickets: async (): Promise<MyTicketDTO[]> => {
    try {
      const response = await fetch(API_BASE_URL, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch tickets');
      const data: ApiResponse<MyTicketDTO[]> = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  },

  // GET - Lấy ticket theo ID
  getTicketById: async (id: number): Promise<TicketDTO> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch ticket');
      const data: ApiResponse<TicketDTO> = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching ticket:', error);
      throw error;
    }
  },

  // POST - Tạo ticket mới (đặt vé)
  createTicket: async (ticketData: CreateTicketDTO): Promise<TicketCheckingDTO> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(ticketData)
      });
      if (!response.ok) throw new Error('Failed to create ticket');
      const data: ApiResponse<TicketCheckingDTO> = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  // GET - Verify ticket (chỉ dành cho ADMIN/STAFF)
  verifyTicket: async (ticketCode: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/verify/${ticketCode}`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to verify ticket');
      const data: ApiResponse<boolean> = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error verifying ticket:', error);
      throw error;
    }
  }
};
