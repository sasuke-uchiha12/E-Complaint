import React, { useState, useEffect } from 'react';
import '../css/HomeCarousel.css';

const slides = [
  {
    img: require("../img/home/images1.jpeg"),
    text: "College of Engineering"
  },
  {
    img: require("../img/home/images2.jpeg"),
    text: "E-Complaint Management"
  },
  {
    img: require("../img/home/images3.jpeg"),
    text: ""
  }
];

function HomeCarousel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(currentIndex => (currentIndex + 1) % slides.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  const goToNext = () => {
    setCurrentImageIndex(currentIndex => (currentIndex + 1) % slides.length);
  };

  const goToPrev = () => {
    setCurrentImageIndex(currentIndex => (currentIndex - 1 + slides.length) % slides.length);
  };

  return (
    <div className="carousel-container">
      {slides.map((slide, index) => (
        <div key={index} className={`slide ${index === currentImageIndex ? "active" : ""}`}>
          <img src={slide.img} alt={`Slide ${index + 1}`} />
          <div className="slide-text">{slide.text}</div>
        </div>
      ))}
      <button className="prev" onClick={goToPrev}>&#10094;</button>
      <button className="next" onClick={goToNext}>&#10095;</button>
    </div>
  );
}

export default HomeCarousel;
