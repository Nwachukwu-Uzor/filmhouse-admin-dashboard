import React, { FC, ChangeEvent, useState, Dispatch, SetStateAction } from "react";
import { Header, Button, Modal, TextInput } from "../components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

interface DeleteEventModalProps {
  eventId: string;
  name: string;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export const DeleteEventModal: FC<DeleteEventModalProps> = ({
  eventId,
  name,
  setIsLoading,
}) => {
  const navigate = useNavigate();
  const [eventNameForDeletion, setEventNameForDeletion] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleToggleDeleteModal = () => {
    setOpenDeleteModal((currentState) => !currentState);
    setEventNameForDeletion("");
  };

  const handleEventNameForDeletionChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setEventNameForDeletion(event?.target?.value);
  };

  const handleDelete = async () => {
    const baseUrl = import.meta.env.VITE_SERVER_BASE_URL as string;
    if (eventNameForDeletion !== name) {
      return;
    }
    const url = `${baseUrl}/event/${eventId}`;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("filmhouse-token");
      const _response = await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({
        icon: "success",
        title: "Event Deleted Successfully",
        text: "The event was deleted successfully",
        didClose: () => {
          toast.success("Event deleted successfully");
          navigate(-1);
        },
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error Occured",
        text:
          error?.response?.data?.message ??
          error?.message ??
          "Unable process request.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-red-100 p-2 rounded-md my-3 lg:my-5">
        <Header level={2} text="DELETE PROJECT" color="red" />
        <Header
          level={1}
          text=" Note that this action is irreversible as no backup is provided."
          customClasses="font-light"
        />
        <Button
          text="Delete"
          color="red"
          handleClick={handleToggleDeleteModal}
        />
      </div>
      <Modal open={openDeleteModal} handleClose={handleToggleDeleteModal}>
        <div className="w-full p-2 bg-white shadow-md border-[0.5px] rounded-md flex flex-col gap-2">
          <Header
            color="red"
            text="Please confirm you want to delete this event."
          />
          <p className="mb-3">
            Type the event <strong>{name}</strong> into the checkbox below
          </p>
          <TextInput
            type="text"
            label="Event Name"
            id="eventNameForDeletion"
            name="eventNameForDeletion"
            value={eventNameForDeletion}
            handleChange={handleEventNameForDeletionChange}
          />
          {name === eventNameForDeletion ? (
            <>
              <p className="font-bold mb-2 italic">
                Please note this action is irreversible.
              </p>
              <Button text="Delete" color="red" handleClick={handleDelete} />
            </>
          ) : null}
        </div>
      </Modal>
    </>
  );
};
