// CategoryStories.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import StoryCard from "./StoryCard";
import StoryViewer from "./StoryViewer";
import "./FilterStories.css";
import { useUser } from "./UserContext";
import StoryCard2 from "./StoryCard2";

const FilterStories = ({ MainCategory }) => {
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const { loggedIn } = useUser();

  useEffect(() => {
    console.log(MainCategory);

    const fetchStoriesByCategory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/user/stories/${MainCategory}`
        );
        setStories(response.data.posts); // Assuming 'posts' is the key for posts array in response
        setLoading(false);
        console.log(response.data.posts);
      } catch (error) {
        console.error("Error fetching category stories:", error);
        setLoading(false);
      }
    };

    fetchStoriesByCategory();
  }, [MainCategory]);

  const handleClick = () => {
    console.log(MainCategory);
  };

  const handleStoryClick = (story) => {
    setSelectedStory(story);
  };

  if (stories.length === 0) {
    return (
      <>
        <h1>Top Stories for {MainCategory}</h1>
        <h2>No stories available for this category.</h2>{" "}
      </>
    );
  }

  return (
    <div className="category-stories">
      {/* <button onClick={handleClick}>CT</button> */}
      <h1>Top Stories for {MainCategory}</h1>
      <div className="story-list">
        {stories.map((story, index) => (
          <StoryCard2
            key={index}
            slides={story.slides}
            onClick={() => handleStoryClick(story)}
          />
        ))}
      </div>

      {selectedStory && (
        <StoryViewer
          story={selectedStory.slides}
          onClose={() => setSelectedStory(null)} // Close viewer
        />
      )}
    </div>
  );
};

export default FilterStories;
