import React, { useContext, useState } from "react";
import { Form, Button, Container, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import "./login.css";

import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ThemeContext } from "../../context/themeContext";

import { FaEye, FaEyeSlash, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const { theme } = useContext(ThemeContext);

  const [loginFormData, setLoginFormData] = useState({});
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const toggleLoginForm = () => {
    setShowLoginForm((prevState) => !prevState);
  };

  //! TOAST FOR SUCCESSFUL LOGIN
  const notify = () =>
    toast.success("Login successful! Check your email inbox!", {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: `colored`,
    });

  //! TOAST FOR INVALID USERNAME or PASSWORD
  const notifyInvalidLogin = () =>
    toast.error("OOOPS! seems like you type an invalid email or invalid password...", {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: `colored`,
    });

  //! TOAST FOR SUCCESSFUL REGISTRATION
  const notifyRegister = () =>
    toast.info(
      "Congratulations! Your registration has been successfully completed 🎉 Check your email inbox!",
      {
        position: "bottom-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: `colored`,
      }
    );

  const navigate = useNavigate();

  const [newAuthorData, setNewAuthorData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthDate: "",
  });

  //! FUNCTION TO CREATE A NEW AUTHOR
  const handleAddNewAuthor = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVERBASE_URL}/authors/create`,
        newAuthorData
      );

      notifyRegister();

      setTimeout(() => {
        toggleLoginForm();
      }, 4000);

      return response.data;
    } catch (error) {
      console.log("Error occurs creating a new author: ", error);
    }
  };

  //! FUNCTION TO LOGIN WITH AN EXISTING AUTHOR
  const loginSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_SERVERBASE_URL}/login`,
        loginFormData
      );

      if (response.data.token) {
        notify();
        localStorage.setItem("userLoggedIn", JSON.stringify(response.data.token));
        setTimeout(() => {
          navigate("/homepage");
        }, 4000);
      }
    } catch (error) {
      notifyInvalidLogin();
      setIsLoading(false);
      console.log("errore durante il login", error);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  //! OAUTH WITH GITHUT ACCOUNT
  const handleLoginWithGithub = () => {
    window.location.href = `${process.env.REACT_APP_SERVERBASE_URL}/auth/github`;
  };

  //! OAUTH WITH GOOGLE ACCOUNT
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_SERVERBASE_URL}/auth/google`;
  };

  return (
    <>
      <Container
        style={{ paddingTop: "10rem", minHeight: "90vh" }}
        className={`d-flex justify-content-center ${theme === "light" ? "" : "text-light"}`}
      >
        <div className="login_register_wrapper ">
          <Form
            className={theme === "light" ? "loginForm" : "loginFormDarkTheme"}
            style={{
              transform: showLoginForm ? "translateX(0)" : "translateX(-150%)",
              transition: "all 0.5s",
            }}
            onSubmit={loginSubmit}
          >
            <h2 className="mb-5">Login here!</h2>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                type="email"
                placeholder="Enter email"
                required
                onChange={(e) =>
                  setLoginFormData({
                    ...loginFormData,
                    email: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <div className="passwordInput">
                <Form.Control
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  required
                  placeholder="Password"
                  onChange={(e) =>
                    setLoginFormData({
                      ...loginFormData,
                      password: e.target.value,
                    })
                  }
                />
                <span className="passwordToggleIcon" onClick={togglePasswordVisibility}>
                  {passwordVisible ? (
                    <FaEyeSlash style={{ color: "black" }} />
                  ) : (
                    <FaEye style={{ color: "black" }} />
                  )}
                </span>
              </div>
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" role="status" /> Logging in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>

            <div className="text-center my-2">or</div>
            <div className="d-flex justify-content-center">
              <Button
                variant={theme === "light" ? "dark" : "outline-light"}
                onClick={handleLoginWithGithub}
                className="d-flex align-items-center gap-2 "
              >
                LOGIN with GitHub <FaGithub style={{ fontSize: "1.5rem" }} />
              </Button>
            </div>
            <div className=" mt-1 d-flex justify-content-center">
              <Button
                variant={theme === "light" ? "outline-dark" : "outline-light"}
                onClick={handleGoogleLogin}
                className="d-flex align-items-center gap-2 "
              >
                LOGIN with Google <FcGoogle style={{ fontSize: "1.5rem" }} />
              </Button>
            </div>

            <div className="mt-4 text-center">
              Not a member? <br /> Join <strong style={{ color: "#078649" }}>StriveBlog</strong>
              &nbsp;Community <br />
              <a href="#!" onClick={toggleLoginForm}>
                Register Here
              </a>
            </div>
          </Form>

          {/*------------------------- REGISTRATION FORM -------------------------*/}
          <Form
            className={theme === "light" ? "registerForm" : "registerFormDarkTheme"}
            style={{
              transform: showLoginForm ? "translateX(50%)" : "translateX(-105.5%)",
              transition: "all 0.5s",
            }}
            onSubmit={handleAddNewAuthor}
          >
            <h2 className="mb-3">Register here!</h2>

            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                required
                name="firstName"
                onChange={(e) => setNewAuthorData({ ...newAuthorData, firstName: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                required
                name="lastName"
                onChange={(e) => setNewAuthorData({ ...newAuthorData, lastName: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                required
                name="email"
                onChange={(e) => setNewAuthorData({ ...newAuthorData, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <div className="passwordInput">
                <Form.Control
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Choose a Password"
                  required
                  name="password"
                  onChange={(e) => setNewAuthorData({ ...newAuthorData, password: e.target.value })}
                />
                <span className="passwordToggleIcon" onClick={togglePasswordVisibility}>
                  {passwordVisible ? (
                    <FaEyeSlash style={{ color: "black" }} />
                  ) : (
                    <FaEye style={{ color: "black" }} />
                  )}
                </span>
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicBirthDate">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                required
                name="birthDate"
                onChange={(e) => setNewAuthorData({ ...newAuthorData, birthDate: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Register Now
            </Button>
            <div className="mt-4 text-center">
              Already a member? <br /> Please&nbsp;
              <a href="#!" onClick={toggleLoginForm}>
                Sign In here
              </a>
            </div>
          </Form>
        </div>
      </Container>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {/* Same as */}
      <ToastContainer />
    </>
  );
};

export default Login;
