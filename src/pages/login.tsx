import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaKey } from "react-icons/fa";

import { TextInput, FullScreenLoader } from "../components";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_SERVER_BASE_URL as string;

const initialFieldValues = {
  password: "",
  email: "",
};

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .min(5, "Email should be at least 5 characters"),
  password: Yup.string()
    .required("Password is required")
    .min(5, "Password should be at least 5 characters"),
});

interface LoginApiResponse {
  token: string;
  message: string;
}

const Login = () => {
  const navigate = useNavigate();

  const { values, handleSubmit, handleChange, touched, errors, isSubmitting } =
    useFormik({
      initialValues: initialFieldValues,
      validationSchema: validationSchema,
      onSubmit: async (values, { resetForm }) => {
        try {
          const payload = {
            email: values?.email,
            password: values?.password,
          };

          const response = await axios.post<LoginApiResponse>(
            `${baseUrl}/auth/login/admin`,
            payload
          );
          localStorage.setItem("filmhouse-token", response?.data?.token);
          toast.success(response?.data?.message ?? "Login successful");
          navigate("/");
        } catch (error: any) {
          Swal.fire({
            title: "Login Failed",
            icon: "error",
            text: error?.response?.data?.message ?? "Invalid Credential",
          });
        }
      },
    });
  return (
    <>
      <section className="flex items-center justify-center min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-md py-3 px-3 w-[90%] max-w-[500px] flex flex-col gap-3"
        >
          <div className="w-[3rem] h-[3rem] mx-auto flex items-center justify-center bg-black text-white rounded-full">
            <FaKey className="text-xl" />
          </div>
          <h1 className="text-lg lg:text-2xl font-semibold my-2 text-center">
            Login
          </h1>
          <TextInput
            value={values?.email}
            handleChange={handleChange}
            touched={Boolean(touched?.email)}
            isError={Boolean(errors?.email) ?? false}
            name="email"
            label="Email"
            error={errors?.email ?? ""}
            id="email"
            type="text"
          />
          <TextInput
            value={values?.password}
            handleChange={handleChange}
            touched={Boolean(touched?.password)}
            isError={Boolean(errors?.password) ?? false}
            name="password"
            label="Password"
            error={errors?.password ?? ""}
            id="password"
            type="password"
          />
          <button className="w-full bg-black text-white font-semibold rounded-md py-2">
            Login
          </button>
        </form>
      </section>
      {isSubmitting ? <FullScreenLoader /> : null}
    </>
  );
};

export default Login;
