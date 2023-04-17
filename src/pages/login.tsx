import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaKey } from "react-icons/fa";

import { TextInput } from "../components";

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

const Login = () => {
  const { values, handleSubmit, handleChange, touched, errors, isSubmitting } =
    useFormik({
      initialValues: initialFieldValues,
      validationSchema: validationSchema,
      onSubmit: async (values, { resetForm }) => {},
    });
  return (
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
  );
};

export default Login;
