import React, { useState, MouseEvent } from "react";
import { useLoaderData, useNavigation } from "react-router-dom";
import { EventCard, FullScreenLoader, Header, Modal } from "../components";

import { EventsApiResponse } from "../queries/fetchEvents";

const Events = () => {
  const { events } = useLoaderData() as EventsApiResponse;
  const navigation = useNavigation();
  const [openModal, setOpenModal] = useState(false);

  const handleToggleModal = (event: MouseEvent) => {
    event.stopPropagation();
    setOpenModal((currentValue) => !currentValue);
  };

  return (
    <>
      <div className="flex justify-between">
        <Header text="Events" level={2} />
        <button onClick={() => setOpenModal(true)}>Add Event</button>
      </div>
      {navigation.state === "loading" ? (
        <FullScreenLoader />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          {events?.map((event) => (
            <EventCard key={event._id} {...event} />
          ))}
        </div>
      )}
      <Modal open={openModal} handleClose={handleToggleModal}>
        <div className="w-[90%] max-w-[500px] bg-white shadow-sm py-4 px-2 rounded-md">
          <p>Dummy Test</p>
        </div>
      </Modal>
    </>
  );
};

export default Events;
