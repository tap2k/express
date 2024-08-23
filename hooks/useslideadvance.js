import { useEffect, useContext } from 'react';
import { CarouselContext } from 'pure-react-carousel';

export default function useSlideAdvance(index, autoPlay, interval) {
    if (!interval)
        interval = 5000;

    const carouselContext = useContext(CarouselContext);
    if (!carouselContext)
        return;

    const advanceSlide = () => {
            const nextSlideIndex = (carouselContext.state.currentSlide + 1) % carouselContext.state.totalSlides;
            carouselContext.setStoreState({ currentSlide: nextSlideIndex });
        };

    useEffect(() => {
        if (!autoPlay || !interval) return;

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
