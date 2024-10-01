import React, { useEffect, useState } from "react";
import "./StoryViewer.css"; // Assuming you have a CSS file for styling

const StoryViewer = ({ story, onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const totalSlides = story.length;

  const nextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
      setProgress(0);
    } else {
      setCurrentSlideIndex(0);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
      setProgress(0);
    }
  };

  const currentSlide = story[currentSlideIndex];

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     nextSlide();
  //   }, 15000); // 15 seconds

  //   // Clear the timeout if the component is unmounted or when the slide index changes
  //   return () => clearTimeout(timer);
  // }, [currentSlideIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          nextSlide();
          return 0;
        }
        return prevProgress + 100 / 150; // 100% / (15 seconds * 10 intervals per second)
      });
    }, 100); // Update every 100ms for smoother animation

    return () => clearInterval(timer);
  }, [currentSlideIndex]);

  return (
    <div className="story-viewer">
      <div
        className="slide"
        style={{
          backgroundImage: `url(${currentSlide.imageUrl})`, // Set background image here
          backgroundSize: "cover", // Ensure the image covers the slide container
          backgroundPosition: "center", // Center the image
        }}
      >
        {/* Progress Indicator */}
        <div className="progress-indicator">
          {story.map((slide, index) => (
            <span
              key={index}
              className={`progress-dot ${
                index <= currentSlideIndex ? "active" : ""
              }`}
            ></span>
          ))}
        </div>

        {/* Close Button */}
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        {/* Slide Details */}
        <div className="slide-details">
          <h2>{currentSlide.heading}</h2>
          <p>{currentSlide.description}</p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        className="prev-button"
        onClick={prevSlide}
        disabled={currentSlideIndex === 0}
      >
        &#10094;
      </button>
      <button
        className="next-button"
        onClick={nextSlide}
        disabled={currentSlideIndex === totalSlides - 1}
      >
        &#10095;
      </button>
    </div>
  );
};

export default StoryViewer;
