import React, {
  FC,
  ChangeEvent,
  useState,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";
import { useQuery } from "react-query";
import { MoonLoader } from "react-spinners";

import { Modal, TextInput, Header, Button } from ".";
import { TicketType, ApiMessage } from "../types";
import { fetchTicketTypes } from "../queries";
import axios from "axios";
import { toast } from "react-toastify";

interface AddTicketModalProps {
  openAddTicketModal: boolean;
  handleToggleAddTicketModal: () => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  eventId: string;
  price: string;
  handlePriceChange: (event: ChangeEvent<HTMLInputElement>) => void;
  refetchTickets: () => Promise<void>;
}

export const AddTicketModal: FC<AddTicketModalProps> = ({
  openAddTicketModal,
  handleToggleAddTicketModal,
  eventId,
  price,
  handlePriceChange,
  setIsLoading,
  refetchTickets,
}) => {
  const { isLoading, isError, data, error } = useQuery<TicketType[], Error>(
    "fetch-ticket-types",
    fetchTicketTypes
  );

  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState("");

  const handleSelectedTypeIdChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedTicketTypeId(event.target.value);
  };

  const isTicketValid = useMemo(() => {
    return selectedTicketTypeId?.trim()?.length > 0 && Number(price) > 10;
  }, [selectedTicketTypeId, price]);

  const handleAddTicket = async () => {
    if (!isTicketValid) {
      return;
    }
    const payload = {
      eventId: eventId,
      ticketTypeId: selectedTicketTypeId,
      price: Number(price),
    };

    setIsLoading(true);

    const baseUrl = import.meta.env.VITE_SERVER_BASE_URL as string;
    try {
      const token = localStorage.getItem("filmhouse-token");
      const response = await axios.post<ApiMessage>(
        `${baseUrl}/ticket/create-ticket-for-event`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response?.data?.message);
      if (response?.status === 201) {
        refetchTickets();
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          error.message ??
          "Unable to Create Ticket"
      );
    } finally {
      setIsLoading(false);
      handleToggleAddTicketModal();
    }
  };

  return (
    <Modal open={openAddTicketModal} handleClose={handleToggleAddTicketModal}>
      <div className="w-full p-2 bg-white shadow-md border-[0.5px] rounded-md flex flex-col gap-2 items-center justify-center">
        {isLoading ? (
          <MoonLoader />
        ) : isError ? (
          <p>{error?.message ?? "Unable to fetch tickets"}</p>
        ) : !data || data?.length === 0 ? (
          <p>No Ticket Types Found</p>
        ) : (
          <div className="w-full flex flex-col gap-4">
            <Header text="Add a Ticket" />
            <select
              className="border border-gray-300 rounded-md focus:outline-none focus:border-none focus:ring-2 focus:ring-yellow-400"
              onChange={handleSelectedTypeIdChange}
            >
              <option value={""}>-- Select a Ticket Type --</option>
              {data?.map((ticket) => (
                <option key={ticket?._id} value={ticket?._id}>
                  {ticket?.typeName}
                </option>
              ))}
            </select>
            <TextInput
              name="price"
              value={price}
              label="Price"
              handleChange={handlePriceChange}
              id="price"
            />
            {isTicketValid ? (
              <Button text="Add Ticket" handleClick={handleAddTicket} />
            ) : null}
          </div>
        )}
      </div>
    </Modal>
  );
};
