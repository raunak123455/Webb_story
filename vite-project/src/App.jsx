import { useState } from "react";

import "./App.css";
import Home from "./components/Home";
import LoginModal from "./components/LoginModal";
import { UserProvider } from "./components/UserContext";
import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Bookmark from "./components/BookMark";
import StoryViewerPage from "./components/StoryviewerPage";

function App() {
  const [count, setCount] = useState(0);

  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // const handleLoginSuccess = (name) => {
  //   setUsername(name); // Set the username in the parent state
  //   setLoggedIn(true); // Mark the user as logged in
  //   console.log("Login success", name);
  // };

  return (
    <div>
      <UserProvider>
        <Router>
          <Routes>
            {/* <Header /> */}
            {/* <Route path="/" element={<Home name={name} />} /> */}
            <Route path="/" element={<Home />} />

            <Route path="/bookmarks" element={<Bookmark />} />
            <Route path="/story/:id" element={<StoryViewerPage />} />
          </Routes>
        </Router>
      </UserProvider>
    </div>
  );
}

export default App;
