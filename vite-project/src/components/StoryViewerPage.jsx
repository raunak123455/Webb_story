import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import StoryViewer from "./StoryViewer";
import { useUser } from "./UserContext";

const StoryViewerPage = () => {
  const { id } = useParams();
  const { name, loggedIn } = useUser();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStory = async () => {
      //   if (!loggedIn) return;
      console.log("Fetching story...", name, id);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/user/post/${id}`
        );
        console.log(response);
        setStory(response.data); // Assuming the response data contains the story details
        setLoading(false);
      } catch (error) {
        console.error("Error fetching the story:", error);
        setLoading(false);
        // navigate("/"); // Redirect to home if there's an error (optional)
      }
    };

    fetchStory();
  }, [id, name, loggedIn, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!story) {
    return <div>Story not found.</div>;
  }

  return (
    <StoryViewer
      post={story}
      story={story.slides}
      onClose={() => navigate("/")} // Go back to the home page when the viewer is closed
    />
  );
};

export default StoryViewerPage;
