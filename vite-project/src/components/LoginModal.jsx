// LoginModal.js
import React, { useState } from "react";
import "./LoginModel.css"; // Optional: Add styles for the modal
import Vector from "../assets/Vector.jpg";
import axios from "axios";
import { useUser } from "./UserContext";

const LoginModal = ({ isOpen, onClose, onLoginSuccess, loggedIn }) => {
  if (isOpen === false || loggedIn === true) return null; // Don't render if modal is not open

  const [password, setPassword] = useState("");
  const { name, setname, setUserId } = useUser();

  // Updated handleSubmit function to take 'event' as a parameter
  const handleSubmit = async (name, password) => {
    event.preventDefault(); // Prevent the default form submission behavior
    console.log(name);
    console.log(password);
    console.log(loggedIn);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/login",
        {
          name,
          password,
        }
      );
      console.log(response.data); // You can handle the response as needed

      if ((response.data.message = "success")) {
        // Call the function to update the logged-in state in Header
        onLoginSuccess();
      }
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <img
          onClick={onClose}
          className="vector"
          src={Vector}
          alt="Description of the image"
        />
        <h2>Login</h2>
        <form>
          {" "}
          {/* Updated form to use onSubmit */}
          <div className="email-container">
            <label className="email">Username:</label>
            <input
              value={name}
              required
              placeholder="Enter the username"
              onChange={(e) => setname(e.target.value)} // Fixed function name (SetUserName -> setUserName)
            />
          </div>
          <div className="email-container">
            <label className="password">Password:</label>
            <input
              type="password"
              required
              placeholder="Enter the password"
              onChange={(e) => setPassword(e.target.value)} // Fixed function name (SetPassword -> setPassword)
            />
          </div>
          <button
            className="register"
            type="submit"
            onClick={() => handleSubmit(name, password)}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
