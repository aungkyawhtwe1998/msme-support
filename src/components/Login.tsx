import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { auth } from "../firebase";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleLogin = async (
    values: LoginFormValues,
    { setSubmitting }: any
  ) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      navigate("/dashboard");

      toast({
        description: "Login successful.",
        className:
          "bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center space-x-2",
      });
    } catch (error: any) {
      setError(error.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}>
        {({ isSubmitting }) => (
          <Form className="bg-white p-6 rounded shadow-md w-full h-full lg:h-auto max-w-sm">
            <h1 className="text-3xl text-center text-gray-700 border-b border-gray-100 pb-5 font-extrabold mb-5">
              Welcome to <br />
              <span className="text-blue-600">MSME Support</span>
            </h1>{" "}
            <h2 className="text-2xl text-center mb-4">Login</h2>
            <div className="mb-4">
              <label className="block mb-1">Email</label>
              <Field
                name="email"
                type="email"
                as={Input}
                className="w-full p-2 border rounded"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Password</label>
              <Field
                name="password"
                type="password"
                as={Input}
                className="w-full p-2 border rounded"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500"
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 text-white p-2 rounded">
              Login
            </Button>
            <div className="text-center mt-5">
              <p>
                New joiner?{" "}
                <Link
                  className="text-blue-500"
                  to={"/register"}>
                  Register Here
                </Link>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
