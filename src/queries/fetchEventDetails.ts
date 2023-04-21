import axios from "axios";
import { Event } from "../components/eventCard";

export interface EventsApiResponse {
  event: Event;
}

export const fetchEventDetails = async (id: string) => {
  const baseUrl = import.meta.env.VITE_SERVER_BASE_URL as string;

  const token = localStorage.getItem("filmhouse-token");
  const response = await axios.get<EventsApiResponse>(
    `${baseUrl}/event/details/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return { ...response?.data?.event };
};
