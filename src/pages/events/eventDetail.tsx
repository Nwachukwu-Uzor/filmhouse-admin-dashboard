import React, { useState, ChangeEvent } from "react";
import Swal from "sweetalert2";
import { useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import { MdOutlineDateRange } from "react-icons/md";

import { Event } from "../../components/eventCard";
import {
  FullScreenLoader,
  Header,
  Button,
  Modal,
  TextInput,
} from "../../components";
import axios from "axios";
import { toast } from "react-toastify";

const EventDetail = () => {
  const baseUrl = import.meta.env.VITE_SERVER_BASE_URL as string;

  const navigation = useNavigation();
  const navigate = useNavigate();

  const {
    _id,
    code,
    galleryImages,
    banner,
    name,
    startDate,
    endDate,
    description,
  } = useLoaderData() as Event;
  const [eventNameForDeletion, setEventNameForDeletion] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEventNameForDeletionChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setEventNameForDeletion(event?.target?.value);
  };

  const handleToggleDeleteModal = () => {
    setOpenDeleteModal((currentState) => !currentState);
    setEventNameForDeletion("");
  };

  const handleDelete = async () => {
    if (eventNameForDeletion !== name) {
      return;
    }
    const url = `${baseUrl}/event/${_id}`;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("filmhouse-token");
      const response = await axios.delete(url, {
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
      <section>
        {navigation.state === "loading" ? (
          <FullScreenLoader />
        ) : (
          <>
            <Header level={2} text={name} />
            <div className="flex items-center gap-1 lg:gap-2">
              <Header level={2} text="Code" />
              <p className="font-medium">{code}</p>
            </div>
            <div className="flex items-center flex-col lg:flex-row justify-between gap-1 lg:gap-2 my-2">
              <div className="flex flex-col lg:flex-row gap-2 items-center">
                <Header level={1} text="Starts" />
                <div className="flex items-center gap-1 lg:gap-2">
                  <MdOutlineDateRange />
                  <p>{new Date(startDate)?.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row justify-between gap-2 items-center">
                <Header level={1} text="Ends" />
                <div className="flex items-center gap-1 lg:gap-2">
                  <MdOutlineDateRange />
                  <p>{new Date(endDate)?.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <img
              src={banner?.url}
              alt={description}
              className="w-full h-[50vh] object-cover my-3"
            />
            <p>{description}</p>
            <div className="my-4">
              <Header level={2} text="Gallery Images" />
              <div className="grid md:grid-cols-3 items-stretch gap-3 my-3">
                {galleryImages?.map((img) => (
                  <div key={img?._id}>
                    <img
                      src={img?.url}
                      alt={description}
                      className="w-full h-[30vh] object-cover border rounded-sm shadow-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-blue-200 p-2 rounded-m">
              <Header text="Ticket" />
            </div>
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
                    <Button
                      text="Delete"
                      color="red"
                      handleClick={handleDelete}
                    />
                  </>
                ) : null}
              </div>
            </Modal>
          </>
        )}
      </section>
      {isLoading ? <FullScreenLoader /> : null}
    </>
  );
};

export default EventDetail;
