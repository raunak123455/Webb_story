import React, { useState } from "react";
import "./Header.css";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModel";
import bookmarkIcon from "../assets/Bookmark.png";
import Pfp from "../assets/PFP.png";
import bars from "../assets/Bars.png";
import AddStoryModal from "./AddStoryModal";
import { useUser } from "./UserContext";
import { Navigate, useNavigate } from "react-router-dom";

const Header = () => {
  const [openRegister, setOpenRegister] = useState(false);
  const { name } = useUser();

  const [openLogin, setOpenLogin] = useState(false);
  // const [loggedIn, setLoggedIn] = useState(false);
  const { loggedIn, setloggedIn, openAddStory, setOpenAddStory } = useUser();
  // const [openAddStory, setOpenAddStory] = useState(false);
  const navigate = useNavigate();
  const [openlogout, setOpenLogout] = useState(false);

  const handleOpenRegisterModal = () => {
    setOpenRegister(true);
    console.log(open);
  };

  const handleCloseRegisterModal = () => {
    setOpenRegister(false);
  };

  const handleOpenLoginModal = () => {
    setOpenLogin(true);
    console.log(open);
    setloggedIn(false);
  };

  const handleCloseLoginModal = () => {
    setOpenLogin(false);
  };

  const handleLoginSuccess = () => {
    setloggedIn(true); // This will be triggered when login is successful
    setOpenLogin(false); // Close login modal after successful login
    console.log(loggedIn);
  };

  const handleCloseAddStory = () => {
    setOpenAddStory(false);
  };

  const handleOpenAddStory = () => {
    setOpenAddStory(true);
  };

  const handleNavigateToBookmarks = () => {
    navigate("/bookmarks"); // Navigate to the bookmarks page
  };

  const handleLogout = () => {
    setloggedIn(false);
  };

  const handleOpenLogoutModal = () => {
    setOpenLogout(!openlogout);
  };

  return (
    <div className="container2">
      {loggedIn ? (
        <>
          <header className="header2">
            <div className="logo-container">
              {/* Placeholder for logo or brand name */}
            </div>

            <div className="nav-container">
              <button
                className="btn btn-bookmark"
                onClick={handleNavigateToBookmarks}
              >
                <img src={bookmarkIcon} alt="" className="bookicon" />
                Bookmarks
              </button>

              <button
                className="btn btn-add-story"
                onClick={handleOpenAddStory}
              >
                Add story
              </button>

              <button className="btn btn-user">
                <img src={Pfp} alt="" className="pfp" />
              </button>

              <button className="btn btn-menu">
                <img
                  src={bars}
                  alt=""
                  className="bars"
                  onClick={() => handleOpenLogoutModal()}
                />
              </button>
              {openlogout && (
                <div className="logoutmodal">
                  <h1>{name}</h1>
                  <button className="logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </header>
        </>
      ) : (
        <div className="header1">
          <button onClick={handleOpenRegisterModal} className="register2">
            Register Now
          </button>
          <button onClick={handleOpenLoginModal} className="signin">
            Sign In
          </button>
          <LoginModal
            isOpen={openLogin}
            onClose={handleCloseLoginModal}
            onLoginSuccess={handleLoginSuccess}
            loggedIn={loggedIn}
          />

          <RegisterModal
            isOpen={openRegister}
            onClose={handleCloseRegisterModal}
          />
        </div>
      )}
      {/* <AddStoryModal isOpen={openAddStory} onClose={handleCloseAddStory} /> */}
      <AddStoryModal isOpen={openAddStory} onClose={handleCloseAddStory} />
    </div>
  );
};

export default Header;
