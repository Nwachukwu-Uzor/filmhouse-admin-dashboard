import React, { useState, useEffect, MouseEvent, ChangeEvent } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiFillFileImage, AiOutlineClose } from "react-icons/ai";
import { useLoaderData, useNavigation } from "react-router-dom";
import {
  EventCard,
  FullScreenLoader,
  Header,
  Modal,
  TextInput,
  Button,
} from "../components";

import { EventsApiResponse } from "../queries/fetchEvents";
import { generateRandomId } from "../utils";

const initialFieldValues = {
  name: "",
  description: "",
};

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Event name is required")
    .min(5, "Event name should be at least 5 characters"),
  description: Yup.string()
    .required("Event description is required")
    .min(10, "Event description should be at least 10 characters"),
});

const Events = () => {
  const { events } = useLoaderData() as EventsApiResponse;
  const navigation = useNavigation();
  const [openModal, setOpenModal] = useState(false);

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

    setGalleryImages(
      Array.from(files)?.map((file) => ({ id: generateRandomId(10), file }))
    );
  };

  const { values, handleSubmit, handleChange, touched, errors, isSubmitting } =
    useFormik({
      initialValues: initialFieldValues,
      validationSchema: validationSchema,
      onSubmit: async (value, { resetForm }) => {},
    });

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
  };

  const deleteBanner = () => {
    setBanner(null);
  };

  const deleteGalleryImage = (id: string) => {
    setGalleryImages((images) => images.filter((img) => img?.id !== id));
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
      <Modal open={openModal} handleClose={() => setOpenModal(false)}>
        <div className="w-full bg-white shadow-sm py-4 px-3 rounded-md max-h-[80vh] overflow-y-auto">
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
            <TextInput
              value={values?.description}
              handleChange={handleChange}
              touched={Boolean(touched?.description)}
              isError={Boolean(errors?.description) ?? false}
              name="description"
              label="Description"
              error={errors?.description ?? ""}
              id="email"
              type="text"
            />

            <div className="flex flex-col gap-2 lg:gap-4">
              <div className="my-2 flex gap-2 justify-between">
                <label
                  htmlFor="avatar"
                  className="flex flex-col gap-2 items-center w-fit lg:flex-row cursor-pointer"
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
                  className="flex flex-col gap-2 items-center w-fit lg:flex-row cursor-pointer"
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
            {isSubmitting ? (
              <p className="">
                <svg
                  className="animate-spin h-5 w-5 mr-3 ..."
                  viewBox="0 0 24 24"
                ></svg>
                Submitting
              </p>
            ) : (
              <Button text="Submit" color="green" type="submit" />
            )}
          </form>
        </div>
      </Modal>
    </>
  );
};

export default Events;
