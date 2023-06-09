import React, { useState, ChangeEvent } from "react";
import Swal from "sweetalert2";
import {
  useLoaderData,
  useNavigate,
  useNavigation,
  useParams,
} from "react-router-dom";
import { MdOutlineDateRange } from "react-icons/md";

import { Event } from "../../components/eventCard";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FullScreenLoader,
  Header,
  Button,
  Modal,
  TextInput,
  EventTickets,
  DeleteEventModal,
} from "../../components";

const EventDetail = () => {
  // const baseUrl = import.meta.env.VITE_SERVER_BASE_URL as string;
  const navigation = useNavigation();
  const { eventId } = useParams();

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
  const [isLoading, setIsLoading] = useState(false);

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
            <EventTickets eventId={eventId} setIsLoading={setIsLoading} />
            <DeleteEventModal
              eventId={_id}
              name={name}
              setIsLoading={setIsLoading}
            />
          </>
        )}
      </section>
      {isLoading ? <FullScreenLoader /> : null}
    </>
  );
};

export default EventDetail;
