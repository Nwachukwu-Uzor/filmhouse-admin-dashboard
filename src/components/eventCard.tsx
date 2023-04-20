import React, { useState, useEffect, FC } from "react";
import { Link } from "react-router-dom";
import { MdOutlineDateRange } from "react-icons/md";

const MAXIMUM_DESCRIPTION_CHARACTERS_TO_SHOW = 50;

export interface Event {
  _id: string;
  name: string;
  description: string;
  banner: {
    url: string;
  };
  startDate: string;
  endDate: string;
  createdOn: string;
  approvalStatus: "Approved" | "Declined" | "Pending";
  code: string;
  galleryImages?: { _id: string; url: string }[];
}

export const EventCard: FC<Event> = ({
  name,
  description,
  banner,
  _id,
  startDate,
  endDate,
}) => {
  const [displayStartDate, setDisplayStartDate] = useState("");
  const [displayEndDate, setDisplayEndDate] = useState("");

  useEffect(() => {
    setDisplayStartDate(new Date(startDate).toLocaleString() ?? "");
    setDisplayEndDate(new Date(endDate).toLocaleString() ?? "");
  }, []);

  return (
    <div className="overflow-hidden bg-white shadow-md border border-gray-100 rounded-md hover:scale-105 duration-300 ease-linear cursor-pointer">
      <img
        src={banner?.url}
        alt="description"
        className="w-full h-[100px] lg:h-[200px] object-cover"
      />
      <div className="px-2 py-3">
        <h2 className="text-lg lg:text-xl font-semibold my-2">{name}</h2>
        <p>
          {description.substring(0, MAXIMUM_DESCRIPTION_CHARACTERS_TO_SHOW)}
          {description.length > MAXIMUM_DESCRIPTION_CHARACTERS_TO_SHOW
            ? "..."
            : ""}
        </p>
        <div className="flex gap-1 items-center my-2">
          <strong className="flex-1">Starts</strong>
          <MdOutlineDateRange />
          <span>{displayStartDate}</span>
        </div>
        <div className="flex gap-1 items-center my-2">
          <strong className="flex-1">Ends</strong>
          <MdOutlineDateRange />
          <span>{displayEndDate}</span>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 lg:gap-4">
          <Link
            to={`/events/${encodeURIComponent(_id)}`}
            className="p-2 lg:px-4 border-2 border-amber-900 hover:bg-amber-900 text-amber-900 font-semibold hover:text-white duration-300 rounded-md"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};
