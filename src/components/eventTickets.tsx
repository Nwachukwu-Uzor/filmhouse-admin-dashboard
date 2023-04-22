import React, {
  FC,
  useState,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from "react";
import { useQuery } from "react-query";

import { FaTicketAlt } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { MoonLoader } from "react-spinners";

import { fetchTicketsForEvent } from "../queries";
import { TicketsApiResponse } from "../queries/fetchTicketsForEvent";

import { Header, Button, AddTicketModal, TextInput, Modal } from ".";
import axios from "axios";
import { toast } from "react-toastify";

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

  const [ticketNameForDeletion, setTicketNameForDeletion] = useState("");
  const [ticketIdForDeletion, setTicketIdForDeletion] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedTicketName, setSelectedTicketName] = useState("");

  const handleToggleDeleteModal = () => {
    setOpenDeleteModal((currentState) => !currentState);
    setTicketNameForDeletion("");
    setSelectedTicketName("");
    setTicketIdForDeletion("");
  };

  const handleChangeTicketNameForDeletion = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setTicketNameForDeletion(event.target.value);
  };

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

  const handleRefetch = async () => {
    await refetch();
  };

  const handleDeleteTicket = async () => {
    if (ticketIdForDeletion.trim().length === 0) {
      handleToggleDeleteModal();
      return;
    }

    if (selectedTicketName.trim().length === 0) {
      handleToggleDeleteModal();
      return;
    }

    const baseUrl = import.meta.env.VITE_SERVER_BASE_URL as string;
    const url = `${baseUrl}/ticket/${ticketIdForDeletion}`;
    setIsLoading(true);
    try {
      const response = await axios.delete(url);

      if (response.status === 204) {
        toast.success("Ticket Deleted Successfully");
        handleRefetch();
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Unable to Delete Ticket"
      );
    } finally {
      setIsLoading(false);
      handleToggleDeleteModal();
    }
  };

  const handleDeleteTicketButtonClick = (id: string, name: string) => {
    setSelectedTicketName(name);
    setTicketIdForDeletion(id);
    setOpenDeleteModal(true);
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
              <div
                className="flex flex-col gap-1 border-2 border-white rounded-md p-2"
                key={ticket._id}
              >
                <p>{ticket?.type?.typeName}</p>
                <p>
                  <strong>Price</strong>: {ticket?.price}
                </p>
                <div>
                  <Button
                    text="Delete Ticket"
                    icon={<AiFillDelete />}
                    handleClick={() =>
                      handleDeleteTicketButtonClick(
                        ticket._id,
                        ticket?.type?.typeName
                      )
                    }
                  />
                </div>
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
        refetchTickets={handleRefetch}
      />
      <Modal open={openDeleteModal} handleClose={handleToggleDeleteModal}>
        <div className="w-full p-2 bg-white shadow-md border-[0.5px] rounded-md flex flex-col gap-2">
          <Header
            color="red"
            text="Please confirm you want to delete this event."
          />
          <p className="mb-3">
            Type the event <strong>{selectedTicketName}</strong> into the
            checkbox below
          </p>
          <TextInput
            type="text"
            label="Event Name"
            id="ticketNameForDeletion"
            name="ticketNameForDeletion"
            value={ticketNameForDeletion}
            handleChange={handleChangeTicketNameForDeletion}
          />
          {selectedTicketName === ticketNameForDeletion ? (
            <>
              <p className="font-bold mb-2 italic">
                Please note this action is irreversible.
              </p>
              <Button
                text="Delete"
                color="red"
                handleClick={handleDeleteTicket}
              />
            </>
          ) : null}
        </div>
      </Modal>
    </>
  );
};
