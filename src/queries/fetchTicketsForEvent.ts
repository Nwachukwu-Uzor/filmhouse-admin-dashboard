import axios from "axios";
import { Ticket, Event, QueryKey } from "../types";
import { QueryFunctionContext } from "react-query";

export interface TicketsApiResponse {
  tickets: Ticket[];
  event: Partial<Event>;
}

interface Params {
  queryKey: string[];
}

export const fetchTicketsForEvent = async (eventId: string | undefined) => {
  if (!eventId) {
    throw new Error("Please provide a valid event id");
  }
  const baseUrl = import.meta.env.VITE_SERVER_BASE_URL as string;

  const token = localStorage.getItem("filmhouse-token");

  const response = await axios.get<TicketsApiResponse>(
    `${baseUrl}/ticket/${eventId}/tickets`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response?.data;
};
