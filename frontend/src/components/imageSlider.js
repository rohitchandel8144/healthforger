import React from 'react';
import Slider from 'react-slick';

const images = [
  '/images/slider1.jpg',
  '/images/slider2.jpg',
  '/images/slider3.avif',
  '/images/slider4.jpg',
  '/images/slider5.jpg',
  '/images/slider6.jpg'
];

const ImageSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    pauseOnHover: true,
  };

  return (
    <Slider {...settings}>
      {images.map((url, index) => (
        <div key={index} className="relative">
          <img
            src={url}
            alt={`Slide ${index}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </Slider>
  );
};

export default ImageSlider;
