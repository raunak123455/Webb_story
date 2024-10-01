import React, { useState, useEffect } from "react";
import axios from "axios";
import StoryCard from "./StoryCard";
import StoryViewer from "./StoryViewer";
import Header from "./Header";
import { useUser } from "./UserContext";

const Bookmark = ({}) => {
  const [bookmarkedStories, setBookmarkedStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useUser();

  useEffect(() => {
    const fetchBookmarkedStories = async () => {
      console.log(userId);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/user/bookmarks/${userId}`
        );
        console.log(response.data.posts);
        setBookmarkedStories(response.data.posts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookmarked stories:", error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchBookmarkedStories();
    }
  }, [userId]);

  const handleStoryClick = (story) => {
    setSelectedStory(story);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <div className="bookmarked-stories">
        <h1>Your Bookmarked Stories</h1>
        <div className="story-list">
          {bookmarkedStories.map((story, index) => (
            <StoryCard
              key={index}
              slides={story.slides}
              onClick={() => handleStoryClick(story)}
            />
          ))}
        </div>

        {selectedStory && (
          <StoryViewer
            post={selectedStory}
            story={selectedStory.slides}
            onClose={() => setSelectedStory(null)} // Close viewer
          />
        )}
      </div>
    </div>
  );
};

export default Bookmark;
