import React, { FC } from "react";
import { useQuery } from "react-query";
import { MoonLoader } from "react-spinners";

import { fetchTicketsForEvent } from "../queries";
import { TicketsApiResponse } from "../queries/fetchTicketsForEvent";

import { Header } from ".";

interface EventTicketProps {
  eventId: string | undefined;
}

export const EventTickets: FC<EventTicketProps> = ({ eventId }) => {
  const { isLoading, data, isError, error } = useQuery<
    TicketsApiResponse,
    Error
  >(["fetchTicketsForEvent", eventId], () => fetchTicketsForEvent(eventId));

  return (
    <div className="bg-blue-200 p-2 rounded-md">
      <Header text="Ticket" />
      {isLoading ? (
        <MoonLoader />
      ) : isError ? (
        <p>{error?.message ?? "Unable to Fetch Tickets"}</p>
      ) : data?.tickets?.length === 0 ? (
        <p>No Ticket for this Event yet</p>
      ) : (
        <article className="flex flex-col gap-2">
          {data?.tickets?.map((ticket) => (
            <div className="flex flex-col gap-1" key={ticket._id}>
              <p>{ticket?.type?.typeName}</p>
              <p>
                <strong>Price</strong>: {ticket?.price}
              </p>
            </div>
          ))}
        </article>
      )}
    </div>
  );
};
