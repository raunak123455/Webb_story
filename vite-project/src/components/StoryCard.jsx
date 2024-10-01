import React from "react";
import "./StoryCard.css"; // Assuming you have a CSS file for styling
import edit from "../assets/Edit.png";
import { useUser } from "./UserContext";

const StoryCard = ({ slides, onClick, story }) => {
  // const { openAddStory, setopenAddStory } = useUser();
  const { setOpenAddStory, setEditingStory } = useUser();

  const handleEditClick = () => {
    setOpenAddStory(true); // Open the modal when the edit icon is clicked
    setEditingStory(story);
    console.log("editing", story);
  };
  return (
    <div className="cards">
      <div>
        <div
          className="story-card"
          onClick={onClick}
          style={{
            backgroundImage: `url(${slides[0].imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {" "}
          <div className="story-card-details">
            <div className="slide-details">
              <h2>{slides[0].heading}</h2>
              <p>{slides[0].description}</p>
            </div>
          </div>
          {/* Display the image of the first slide */}
          {/* <img
          src={slides[0].imageUrl}
          alt={slides[0].heading}
          className="story-card-image"
        /> */}
          {/* Map through all slides to display title and description for each */}
          {/* <div className="story-card-details">
            <div className="slide-details">
              <h2>{slides[0].heading}</h2>
              <p>{slides[0].description}</p>
            </div>
          </div> */}
        </div>
        <img src={edit} alt="" onClick={handleEditClick} />
      </div>
    </div>
  );
};

export default StoryCard;
