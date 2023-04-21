import React, { useState, useEffect, MouseEvent, ChangeEvent } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiFillFileImage, AiOutlineClose } from "react-icons/ai";
import { useLoaderData, useNavigation, useNavigate } from "react-router-dom";
import {
  EventCard,
  FullScreenLoader,
  Header,
  Modal,
  TextInput,
  Button,
  DateTimePicker,
} from "../../components";

import { EventsApiResponse } from "../../queries/fetchEvents";
import { generateRandomId } from "../../utils";

interface CreateEventApiResponse {
  message: string;
}
const initialFieldValues = {
  name: "",
  description: "",
};

const DEFAULT_DATE_VALUE = new Date().toISOString().slice(0, -1);
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Event name is required")
    .min(5, "Event name should be at least 5 characters"),
  description: Yup.string()
    .required("Event description is required")
    .min(10, "Event description should be at least 10 characters"),
});

const Events = () => {
  const baseUrl = import.meta.env.VITE_SERVER_BASE_URL as string;

  const { events } = useLoaderData() as EventsApiResponse;
  const navigation = useNavigation();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [startDate, setStartDate] = useState(DEFAULT_DATE_VALUE);
  const [endDate, setEndDate] = useState(DEFAULT_DATE_VALUE);

  const [banner, setBanner] = useState<File | null | undefined>(null);
  const [previewBanner, setPreviewBanner] = useState<string | null | undefined>(
    null
  );

  const [galleryImages, setGalleryImages] = useState<
    { id: string; file: File }[]
  >([]);

  const [previewGalleryImages, setPreviewGalleryImages] = useState<
    { id: string; url: string }[]
  >([]);

  const handleBannerChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (!file) {
      return;
    }
    setBanner(file);
  };

  const handleGalleryImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event?.target?.files;
    if (!files) {
      return;
    }

    let selectedFiles = Array.from(files)?.map((file) => ({
      id: generateRandomId(10),
      file,
    }));

    if (galleryImages) {
      selectedFiles = [...galleryImages, ...selectedFiles];
    }

    if (selectedFiles.length > 3) {
      selectedFiles = selectedFiles.slice(-3);
    }
    setGalleryImages(selectedFiles);
  };

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!banner) {
      setPreviewBanner(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(banner);
    setPreviewBanner(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [banner]);

  useEffect(() => {
    if (!galleryImages) {
      setPreviewGalleryImages([]);
      return;
    }

    setPreviewGalleryImages(
      galleryImages?.map((img) => ({
        id: img?.id,
        url: URL.createObjectURL(img?.file),
      }))
    );

    // const objectUrl = URL.createObjectURL(banner);
    // setPreviewBanner(objectUrl);

    // free memory when ever this component is unmounted
    // return () => URL.revokeObjectURL(objectUrl);
  }, [galleryImages]);

  const handleToggleModal = (event?: MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setOpenModal((currentValue) => !currentValue);
    clearFields();
  };

  const deleteBanner = () => {
    setBanner(null);
  };

  const deleteGalleryImage = (id: string) => {
    setGalleryImages((images) => images.filter((img) => img?.id !== id));
  };

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (Date.now() > Date.parse(value)) {
      return;
    }
    if (name === "startDate") {
      setStartDate(value);
      return;
    }

    if (name === "endDate") {
      console.log("Here");
      setEndDate(value);
      return;
    }
  };

  const {
    values,
    handleSubmit,
    handleChange,
    touched,
    errors,
    isSubmitting,
    resetForm,
  } = useFormik({
    initialValues: initialFieldValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!banner) {
        Swal.fire({
          title: "Banner is Required",
          text: "Please select a banner image to proceed",
          icon: "error",
        });
        return;
      }
      if (galleryImages?.length < 3) {
        Swal.fire({
          title: "Gallery Images Required",
          text: "Please select at least 3 gallery images to proceed",
          icon: "error",
        });
        return;
      }
      try {
        const formData = new FormData();
        formData.append("name", values?.name);
        formData.append("description", values?.description);
        formData.append("startDate", startDate);
        formData.append("endDate", endDate);
        formData.append("image", banner ? banner : "");
        for (let galleryImage of galleryImages) {
          formData.append("images", galleryImage?.file);
        }

        const token = localStorage.getItem("filmhouse-token");
        const response = await axios.post<CreateEventApiResponse>(
          `${baseUrl}/event/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire({
          icon: "success",
          text: response?.data?.message ?? "Event created successfully",
          title: "Event Created",
          didClose: () => {
            clearFields();
            toast.success(
              response?.data?.message ?? "Event created successfully"
            );
            window.location.reload();
          },
        });
      } catch (error: any) {
        Swal.fire({
          title: "An Error Occurred",
          text:
            error?.response?.data?.message ??
            error?.message ??
            "Unable to Upload Event",
          icon: "error",
        });
      }
    },
  });

  const clearFields = () => {
    setStartDate(DEFAULT_DATE_VALUE);
    setEndDate(DEFAULT_DATE_VALUE);
    setGalleryImages([]);
    setBanner(null);
    resetForm();
  };
  return (
    <>
      <div className="flex justify-between">
        <Header text="Events" level={2} />
        <Button
          color="black"
          text="Add Event"
          handleClick={handleToggleModal}
        />
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
        <div className="w-full bg-white shadow-sm py-4 px-3 rounded-md max-h-[80vh] overflow-y-auto hide-scrollbar">
          <Header level={3} text="Add Event" />
          <form
            className="my-2 flex flex-col gap-2 w-full overflow-auto"
            onSubmit={handleSubmit}
          >
            <p className="text-lg font-semibold">
              Please provide the information for the new event.
            </p>
            <TextInput
              value={values?.name}
              handleChange={handleChange}
              touched={Boolean(touched?.name)}
              isError={Boolean(errors?.name) ?? false}
              name="name"
              label="Name"
              error={errors?.name ?? ""}
              id="name"
              type="text"
            />
            <div className="flex flex-col gap-2 my-3">
              <label className="font-semibold text-sm">Description</label>
              <textarea
                className="w-full outline-0 rounded-md focus:outline-0 focus:outline-none focus:border-2 p-2 focus:border-yellow-300 focus:ring-0"
                placeholder="Enter the event description"
                name="description"
                onChange={handleChange}
              ></textarea>
              {touched?.description && errors?.description ? (
                <p className="text-sm text-red-500">{errors?.description}</p>
              ) : null}
            </div>
            <DateTimePicker
              value={startDate}
              label="Select Start Date"
              name="startDate"
              id="startDate"
              handleChange={handleDateChange}
            />
            <DateTimePicker
              value={endDate}
              label="Select End Date"
              name="endDate"
              id="endDate"
              handleChange={handleDateChange}
            />
            <div className="flex flex-col gap-2 lg:gap-4">
              <div className="my-2 flex gap-2 justify-between">
                <label
                  htmlFor="avatar"
                  className="flex gap-2 items-center w-fit cursor-pointer"
                >
                  <span className="font-bold">Select Banner: </span>
                  <span className="h-[40px] w-[40px] bg-yellow-100 rounded-full flex items-center justify-center">
                    <AiFillFileImage className="text-yellow-500" />
                  </span>
                </label>
                <input
                  type="file"
                  accept=".jpg,.png,.jpeg"
                  hidden
                  name="avatar"
                  id="avatar"
                  onChange={handleBannerChange}
                />
              </div>
              {previewBanner ? (
                <div className="relative">
                  <img
                    src={previewBanner}
                    alt="avatar"
                    className="w-full h-[200px] object-cover rounded-sm"
                  />
                  <span className="absolute top-2 right-2 h-7 w-7 flex items-center justify-center rounded-full cursor-pointer bg-white shadow-md">
                    <AiOutlineClose onClick={deleteBanner} />
                  </span>
                </div>
              ) : null}
            </div>
            <div className="flex flex-col gap-2 lg:gap-4">
              <div className="my-2 flex gap-2 justify-between">
                <label
                  htmlFor="galleryImages"
                  className="flex gap-2 items-center w-fit cursor-pointer"
                >
                  <span className="font-bold">Select Gallery Images: </span>
                  <span className="h-[40px] w-[40px] bg-yellow-100 rounded-full flex items-center justify-center">
                    <AiFillFileImage className="text-yellow-500" />
                  </span>
                </label>
                <input
                  type="file"
                  accept=".jpg,.png,.jpeg"
                  hidden
                  name="galleryImages"
                  id="galleryImages"
                  onChange={handleGalleryImagesChange}
                  multiple={true}
                />
              </div>
              {previewGalleryImages ? (
                <div className="grid grid-cols-3 gap-2">
                  {previewGalleryImages?.map((image) => (
                    <div key={image?.id} className="relative">
                      <img
                        src={image.url}
                        alt="avatar"
                        className="w-full h-[100px] object-cover rounded-md shadow-md"
                      />
                      <span className="absolute top-2 right-2 h-7 w-7 flex items-center justify-center rounded-full cursor-pointer bg-white shadow-md">
                        <AiOutlineClose
                          onClick={() => deleteGalleryImage(image?.id)}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <Button text="Submit" color="green" type="submit" />
          </form>
        </div>
      </Modal>
      {isSubmitting ? <FullScreenLoader /> : null}
    </>
  );
};

export default Events;
