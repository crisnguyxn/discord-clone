import React, { useState } from "react";
import "./Register.css";
import axios from "axios";
import { useNavigate} from "react-router-dom";
import { keys } from "../config/config";
function Register() {
  const [inputValues, setInputValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isError, setisError] = useState(false);
  const [msgError, setmsgError] = useState("");
  const [isRegistered, setisRegistered] = useState(false);
  const handleChange = (e) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegistered) {
      try {
        const data = await axios.post(
          `${keys.BASE_URL}/auth/login`,
          {
            email: inputValues.email,
            password: inputValues.password,
          }
        );
        return navigate("/")
      } catch (error) {
        await handleError(error);
      }
    } else {
      try {
        const data = await axios.post(
          `${keys.BASE_URL}/auth/register`,
          inputValues
        );
        if (data.status === 201) {
          await setisRegistered(true);
        }
      } catch (error) {
        await handleError(error);
      }
    }
  };

  const handleError = async (error) => {
    const { msg } = await error.response.data;
    setisError(true);
    setmsgError(msg);
  };

  const handleRegister = () => {
    setisRegistered(false);
  };
  const handleLogin = () => {
    setisRegistered(true);
  };

  const closedNoti = () => {
    setmsgError("");
    setisError(false);
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-left">
          <img
            src="https://cdn1.epicgames.com/salesEvent/salesEvent/egs-discord-discord-s2-1200x1600-7f26149140c8_1200x1600-14fff66a6835df9c5915cd015cd7fefb"
            alt=""
          />
        </div>
        <div className="form-right">
          <form onSubmit={handleSubmit}>
            <h1>CONNECT WITH US</h1>
            <h3>Welcome</h3>
            {isRegistered ? (
              ""
            ) : (
              <input
                onChange={handleChange}
                value={inputValues.name}
                type="name"
                name="name"
                id="name"
                placeholder="username"
              />
            )}
            <input
              onChange={handleChange}
              value={inputValues.email}
              type="email"
              name="email"
              id="email"
              placeholder="email"
            />
            <input
              value={inputValues.password}
              type="password"
              name="password"
              onChange={handleChange}
              id="password"
              placeholder="password"
            />
            <button type="submit">{isRegistered ? "Login" : "Register"}</button>
          </form>
          {isError ? (
            <div className="error">
              <p>{msgError}</p>
              <button onClick={() => closedNoti()}>
                <p>X</p>
              </button>
            </div>
          ) : (
            ""
          )}
          <span>Or</span>
          <div className="login-with-social">
            <button className="google">Google</button>
            <button className="github">Github</button>
          </div>
          <div className="attribute">
            <span>
              {isRegistered
                ? "Have not account yet?"
                : "Already have an account"}
            </span>
            <button
              onClick={
                isRegistered ? () => handleRegister() : () => handleLogin()
              }
            >
              {isRegistered ? "Register " : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
