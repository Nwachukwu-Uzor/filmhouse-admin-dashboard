import axios from "axios";
import { TicketType } from "../types";

export interface TicketTypesApiResponse {
  ticketTypes: TicketType[];
}

export const fetchTicketTypes = async () => {
  const baseUrl = import.meta.env.VITE_SERVER_BASE_URL as string;

  const token = localStorage.getItem("filmhouse-token");

  const response = await axios.get<TicketTypesApiResponse>(
    `${baseUrl}/ticket/types`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response?.data?.ticketTypes;
};
