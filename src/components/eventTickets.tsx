import React, {
  FC,
  useState,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from "react";
import { useQuery } from "react-query";

import { FaTicketAlt } from "react-icons/fa";
import { MoonLoader } from "react-spinners";

import { fetchTicketsForEvent } from "../queries";
import { TicketsApiResponse } from "../queries/fetchTicketsForEvent";

import { Header, Button, AddTicketModal } from ".";

interface EventTicketProps {
  eventId: string | undefined;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export const EventTickets: FC<EventTicketProps> = ({
  eventId,
  setIsLoading,
}) => {
  const { isLoading, data, isError, error, refetch } = useQuery<
    TicketsApiResponse,
    Error
  >(["fetchTicketsForEvent", eventId], () => fetchTicketsForEvent(eventId));

  const [openAddTicketModal, setOpenAddTicketModal] = useState(false);
  const [price, setPrice] = useState("");
  const handleToggleAddTicketModal = () => {
    setOpenAddTicketModal((open) => !open);
    setPrice("");
  };

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9]*\.?[0-9]*$/;
    const value = event.target.value;

    if (regex.test(value)) {
      setPrice(value);
    }
  };

  return (
    <>
      <div className="bg-blue-200 p-2 rounded-md">
        <div className="flex flex-col gap-2 lg:flex-row justify-between items-center">
          <div className="flex items-center gap-1">
            <FaTicketAlt />
            <Header text="Ticket" />
          </div>
          <Button
            text="Add Ticket"
            color="blue"
            handleClick={handleToggleAddTicketModal}
          />
        </div>
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
      <AddTicketModal
        openAddTicketModal={openAddTicketModal}
        handleToggleAddTicketModal={handleToggleAddTicketModal}
        eventId={eventId ?? ""}
        price={price}
        handlePriceChange={handlePriceChange}
        setIsLoading={setIsLoading}
        refetchTickets={refetch}
      />
    </>
  );
};
