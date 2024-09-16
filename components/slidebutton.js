import { useContext } from 'react';
import { CarouselContext } from 'pure-react-carousel';

export default function SlideButton({ increment, children, ...props }) {
  const carouselContext = useContext(CarouselContext);
  
  if (!carouselContext) {
    return null;
  }

  const handleClick = () => {
    const { currentSlide, totalSlides } = carouselContext.state;
    const nextSlide = (currentSlide + increment) % totalSlides;
    carouselContext.setStoreState({ currentSlide: nextSlide });
  };

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

