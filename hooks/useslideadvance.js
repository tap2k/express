import { useEffect, useContext, useCallback } from 'react';
import { CarouselContext } from 'pure-react-carousel';

export default function useSlideAdvance(index, autoPlay, interval) {
    const carouselContext = useContext(CarouselContext);
    const advanceSlide = () => {
            if (carouselContext) {
            const nextSlideIndex = (carouselContext.state.currentSlide + 1) % carouselContext.state.totalSlides;
            carouselContext.setStoreState({ currentSlide: nextSlideIndex });
            }
        };

    useEffect(() => {
        if (!carouselContext || !autoPlay || !interval) return;

        let timer = null;
        const onChange = () => {
            clearInterval(timer);
            if (carouselContext.state.currentSlide === index) {
                timer = setInterval(advanceSlide, interval);
            }
        };

        carouselContext.subscribe(onChange);
        onChange(); 

        return () => {
        clearInterval(timer);
        carouselContext.unsubscribe(onChange);
        };
    }, [carouselContext, autoPlay, interval]);
}
