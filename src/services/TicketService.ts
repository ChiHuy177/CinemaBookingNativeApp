import { ApiResponse } from "../types/apiResponse";
import { MyTicketProps, CreateTicketProps, TicketCheckingProps, TicketProps } from "../types/ticket";
import { TICKET } from "../utils/endpoint";
import axiosInstance from "./BaseService";


export const getAllTickets = async (): Promise<
  ApiResponse<MyTicketProps[]>
> => {
  const response = await axiosInstance.get(TICKET.GET_MY_TICKETS);
  return response.data;
};

export const addTicket = async (
  ticket: CreateTicketProps,
): Promise<ApiResponse<TicketCheckingProps>> => {
  const response = await axiosInstance.post(TICKET.ADD_TICKET, ticket);

  return response.data;
};

export const getTicket = async (
  ticketId: number,
): Promise<ApiResponse<TicketProps>> => {
  const response = await axiosInstance.get(TICKET.GET_TICKET(ticketId));

  return response.data;
};
