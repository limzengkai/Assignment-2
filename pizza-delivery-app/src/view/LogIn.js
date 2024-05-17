import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from 'js-cookie';

export default function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get("http://localhost:3001/").then((response) => {
      if (response.data.valid) {
        navigate("/orders");
      }else{
        navigate("/login");
      }
    }
    ).catch((err) => {
      console.log(err);
    }
    );
  }, []);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = { username, password, recaptchaToken };

    axios
      .post("http://localhost:3001/auth/login", data)
      .then((response) => {
        Swal.fire({
          title: "Success!",
          text: "You have logged in successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        if (response.data.error){
          Swal.fire({
            title: "Error!",
            text: response.data.error,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
        navigate("/orders");
      })
      .catch((error) => {
        let errorMessage = "An unexpected error occurred.";
        if (error.response && error.response.data.error) {
          errorMessage = error.response.data.error;
        }
        Swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter your username"
                    onChange={(event) => setUsername(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    onChange={(event) => setPassword(event.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    id="show-password"
                    type="checkbox"
                    className="mr-2 w-4 h-4"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  <label
                    htmlFor="show-password"
                    className="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Show Password
                  </label>
                </div>
                <ReCAPTCHA
                  sitekey="6LcJwsQpAAAAAPE38vNj4R7jTZx4HmYZ16p-EGoW"
                  onChange={handleRecaptchaChange}
                />
                <div className="flex items-center justify-between">
                  <Link
                    to={"/forgot-password"}
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-gray-300"
                  >
                    Forgot password?
                  </Link>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign in
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
