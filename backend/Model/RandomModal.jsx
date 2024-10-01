import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddStoryModal.css";
import { useUser } from "./UserContext";

const StoryModal = ({ onClose }) => {
  const { openAddStory, editingStory, setEditingStory, name } = useUser();
  const [slides, setSlides] = useState([
    { heading: "", description: "", imageUrl: "", category: "", likeCount: 0 },
    { heading: "", description: "", imageUrl: "", category: "", likeCount: 0 },
    { heading: "", description: "", imageUrl: "", category: "", likeCount: 0 },
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(3);
  const [mainCategory, setMainCategory] = useState("");

  // Load the story data if editing an existing story
  useEffect(() => {
    if (editingStory) {
      setSlides(editingStory.slides);
      setTotalSlides(editingStory.slides.length);
      setMainCategory(editingStory.MainCategory);
    }
  }, [editingStory]);

  if (!openAddStory) return null;

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  const handleAddSlide = () => {
    setSlides([
      ...slides,
      {
        heading: "",
        description: "",
        imageUrl: "",
        category: "",
        likeCount: 0,
      },
    ]);
    setTotalSlides(totalSlides + 1);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Validate that at least 3 slides are present and each slide has the required information
    if (
      slides.length < 3 ||
      slides.some(
        (slide) =>
          !slide.heading ||
          !slide.description ||
          !slide.imageUrl ||
          !slide.category
      )
    ) {
      // Display an error message to the user
      return;
    }

    try {
      if (editingStory) {
        // If editing, make a PUT request to update the story
        const response = await axios.put(
          `http://localhost:8080/api/user/posts/${editingStory.postedBy}/${editingStory._id}`,
          {
            slides,
            MainCategory: mainCategory,
          }
        );
        console.log("Story updated:", response.data);
      } else {
        // If adding new, make a POST request to create a new story
        const response = await axios.post(
          "http://localhost:8080/api/user/post",
          {
            slides,
            postedBy: name,
            MainCategory: mainCategory,
          }
        );
        console.log("New story created:", response.data);
      }
      onClose(); // Close the modal after successful submission
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="slide-navigation">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`slide-button ${
                  currentSlide === index ? "active" : ""
                }`}
                onClick={() => handleSlideChange(index)}
              >
                Slide {index + 1}
              </button>
            ))}
            {totalSlides < 6 && (
              <button className="add-slide-button" onClick={handleAddSlide}>
                Add +
              </button>
            )}
          </div>
          <button onClick={onClose} className="close-button">
            X
          </button>
        </div>

        <div className="modal-body">
          <SlideEditor
            slide={slides[currentSlide]}
            onSlideUpdate={(updatedSlide) => {
              setSlides(
                slides.map((s, i) => (i === currentSlide ? updatedSlide : s))
              );
              // If this is the first slide, update the mainCategory
              if (currentSlide === 0) {
                setMainCategory(updatedSlide.category);
                console.log("MainCategory updated to:", updatedSlide.category);
              }
            }}
            isFirstSlide={currentSlide === 0}
            mainCategory={mainCategory}
          />
        </div>

        <div className="modal-footer">
          <div>
            {currentSlide > 0 && (
              <button
                className="button button-previous"
                onClick={() => handleSlideChange(currentSlide - 1)}
              >
                Previous
              </button>
            )}
            {currentSlide < slides.length - 1 && (
              <button
                className="button button-next"
                onClick={() => handleSlideChange(currentSlide + 1)}
              >
                Next
              </button>
            )}
          </div>
          <button className="button button-post" onClick={handleFormSubmit}>
            {editingStory ? "Update" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

const SlideEditor = ({ slide, onSlideUpdate, isFirstSlide, mainCategory }) => {
  return (
    <>
      <div className="form-group">
        <label>Heading:</label>
        <input
          type="text"
          value={slide.heading}
          onChange={(e) => onSlideUpdate({ ...slide, heading: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Description:</label>
        <input
          type="text"
          value={slide.description}
          onChange={(e) =>
            onSlideUpdate({ ...slide, description: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Image:</label>
        <input
          type="text"
          value={slide.imageUrl}
          onChange={(e) =>
            onSlideUpdate({ ...slide, imageUrl: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Category:</label>
        <select
          id="options"
          value={isFirstSlide ? mainCategory : slide.category}
          onChange={(e) =>
            onSlideUpdate({ ...slide, category: e.target.value })
          }
        >
          <option value="">--Select an option--</option>
          <option value="food">food</option>
          <option value="health and fitness">health and fitness</option>
          <option value="travel">travel</option>
          <option value="movies">movies</option>
          <option value="education">education</option>
        </select>
      </div>
    </>
  );
};

export default StoryModal;

const express = require("express");
const router = express.Router();
const PostModel = require("../models/PostModel");

// PUT route to edit a story
router.put("/user/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { slides, mainCategory } = req.body;

    // Find the post by ID and update it with the new details
    const updatedPost = await PostModel.findByIdAndUpdate(
      id,
      {
        slides,
        MainCategory: mainCategory,
      },
      { new: true } // This option returns the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Story not found" });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating story:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
