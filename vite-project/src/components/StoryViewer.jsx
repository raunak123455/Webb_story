import React, { useEffect, useState } from "react";
import "./StoryViewer.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import bookmark from "../assets/Wbookmark.png";
import share from "../assets/Share.png";
import download from "../assets/download_2.png";
import axios from "axios";
import { useUser } from "./UserContext";

const StoryViewer = ({ post, story, onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const postId = post._id;
  const { userId } = useUser();

  const totalSlides = story.length;

  const nextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
      setProgress(0);
    } else {
      onClose(); // Close the viewer when all slides are viewed
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
      setProgress(0);
    }
  };

  const currentSlide = story[currentSlideIndex];

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

  const localStorageKey = `post_${postId}_slide_${currentSlide._id}_isLiked`;

  useEffect(() => {
    // Initialize the like state from localStorage
    const savedIsLiked = localStorage.getItem(localStorageKey) === "true";
    setIsLiked(savedIsLiked);

    // You might want to fetch the actual like count from the server if needed
    setLikeCount(currentSlide.likeCount); // Initial like count from the slide data
  }, [currentSlide, localStorageKey]);

  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/user/post/${postId}/slide/${currentSlide._id}/like`
        );
        setLikeCount(response.data.likeCount); // Set initial like count
      } catch (error) {
        console.error("Error fetching like count:", error);
      }
    };

    fetchLikeCount();
  }, [currentSlide, postId]);

  const handleLikeClick = async () => {
    if (isLiked) return; // Prevent multiple likes on a single click
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);

    // Store the new isLiked state in localStorage
    localStorage.setItem(localStorageKey, newIsLiked);

    try {
      // Optimistically update the like count on the frontend
      setLikeCount(likeCount + 1);

      // Send the request to the backend to increment the like count
      const response = await axios.put(
        `http://localhost:8080/api/user/post/${postId}/slide/${currentSlide._id}/like`
      );

      // Update like count with response from server (in case the backend is the source of truth)
      setLikeCount(response.data.likeCount);
    } catch (error) {
      console.error("Error updating like count:", error);
      setLikeCount(likeCount - 1); // Revert in case of error
    }
  };

  const handleBookmarkClick = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/user/posts/${postId}/bookmark`,
        { userId }
      );

      if (response.status === 200) {
        setIsBookmarked(true);
        console.log("Post bookmarked successfully");
      }
    } catch (error) {
      console.error("Error bookmarking the post", error);
    }
  };

  const handleDownloadClick = () => {
    // Create a temporary link element
    const link = document.createElement("a");
    link.href = currentSlide.imageUrl;
    link.download = `slide_${currentSlide._id}.jpg`; // You can adjust the filename and extension as needed

    // Append the link to the body (required for Firefox)
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
  };

  const handleShareClick = () => {
    // Create a link for the current story (you can adjust the URL format as per your routing)
    const shareLink = `${window.location.origin}/story/${postId}`;

    // Copy the link to the clipboard
    navigator.clipboard.writeText(shareLink).then(
      () => {
        alert("Link copied to clipboard!"); // Notify the user that the link has been copied
      },
      (error) => {
        console.error("Failed to copy link to clipboard:", error);
      }
    );
  };

  return (
    <div className="story-viewer">
      <div
        className="slide"
        style={{
          backgroundImage: `url(${currentSlide.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="progress-bars">
          {story.map((_, index) => (
            <div key={index} className="progress-bar-container">
              <div
                className="progress-bar"
                style={{
                  width:
                    index === currentSlideIndex
                      ? `${progress}%`
                      : index < currentSlideIndex
                      ? "100%"
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>
        {/* Close Button */}
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        <img
          src={share}
          alt=""
          className="share-b"
          onClick={handleShareClick}
        />

        {/* Slide Details */}
        <div className="slide-details">
          <h2>{currentSlide.heading}</h2>
          <p>{currentSlide.description}</p>
        </div>

        {/* Like and Bookmark buttons */}
        <div className="slide-actions">
          {/* <i className="bookmark-icon"></i> */}
          <img
            src={bookmark}
            alt="Bookmark"
            className={`bookmark-w ${isBookmarked ? "bookmarked" : ""}`}
            onClick={handleBookmarkClick}
          />

          <img
            src={download}
            className="download"
            alt="Download"
            onClick={handleDownloadClick} // Attach download click handler
          />

          <i
            className={`heart-icon ${isLiked ? "liked" : ""}`} // Change icon style if liked
            onClick={handleLikeClick} // Call the like click handler
          >
            {isLiked ? "❤️" : "🤍"} {/* Toggle icon */}
          </i>
          <span className="like-count">{likeCount}</span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        className="nav-button prev-button"
        onClick={prevSlide}
        disabled={currentSlideIndex === 0}
      >
        &#10094;
      </button>
      <button
        className="nav-button next-button"
        onClick={nextSlide}
        disabled={currentSlideIndex === totalSlides - 1}
      >
        &#10095;
      </button>
    </div>
  );
};

export default StoryViewer;
