import axios from "axios";
import { Event } from "../components/eventCard";
const baseUrl = import.meta.env.VITE_SERVER_BASE_URL as string;

export interface EventsApiResponse {
  events: [Event];
  totalCount: number;
  page: number;
  totalPages: number;
}

export const fetchEvents = async () => {
  const token = localStorage.getItem("filmhouse-token");
  const response = await axios.get<EventsApiResponse>(
    `${baseUrl}/event/events`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(response?.data);
  return { ...response?.data };
};
