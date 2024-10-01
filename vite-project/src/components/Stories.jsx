import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "./UserContext";
import StoryCard from "./StoryCard";
import StoryViewer from "./StoryViewer";
import "./Stories.css";

const UserStories = () => {
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [displayedRows, setDisplayedRows] = useState(1); // Number of rows to display

  const { name, loggedIn } = useUser();

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!loggedIn) return;
      try {
        const response = await axios.get(
          `http://localhost:8080/api/user/posts/${name}`
        );
        setStories(response.data.posts); // Assuming 'posts' is the key for posts array in response
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user posts:", error);
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [loggedIn, name]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleStoryClick = (story) => {
    setSelectedStory(story);
  };

  const handleShowMore = () => {
    setDisplayedRows(displayedRows + 1);
  };

  const storiesToShow = stories.slice(0, displayedRows * 4); // Show 4 stories per row

  return (
    <div className="home">
      <div className="story-list-container">
        <div className="story-list">
          {storiesToShow.map((story, index) => (
            <StoryCard
              story={story}
              key={index}
              slides={story.slides}
              onClick={() => handleStoryClick(story)}
            />
          ))}
        </div>
      </div>

      {stories.length > storiesToShow.length && (
        <button className="show-more-btn" onClick={handleShowMore}>
          Show More
        </button>
      )}

      {selectedStory && (
        <StoryViewer
          post={selectedStory}
          story={selectedStory.slides}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </div>
  );
};

export default UserStories;
