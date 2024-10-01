import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  // const [name, setname] = useState("");
  // const [loggedIn, setloggedIn] = useState(false);
  const [openAddStory, setOpenAddStory] = useState(false);

  const [loggedIn, setloggedIn] = useState(() => {
    // Retrieve the logged-in status from localStorage
    return localStorage.getItem("loggedIn") === "true";
  });

  const [name, setname] = useState(() => {
    // Retrieve the user's name from localStorage
    return localStorage.getItem("name") || "";
  });
  const [MainCategory, setMainCategory] = useState("all");
  const [userId, setUserId] = useState("");
  const [editingStory, setEditingStory] = useState(null);

  useEffect(() => {
    localStorage.setItem("loggedIn", loggedIn);
  }, [loggedIn]);

  useEffect(() => {
    // Store user's name in localStorage
    if (name) {
      localStorage.setItem("name", name);
    }
  }, [name]);

  return (
    <UserContext.Provider
      value={{
        name,
        setname,
        loggedIn,
        setloggedIn,
        MainCategory,
        setMainCategory,
        userId,
        setUserId,
        openAddStory,
        setOpenAddStory,
        editingStory,
        setEditingStory,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
