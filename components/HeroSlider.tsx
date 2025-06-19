/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PageName } from '../HegraApp'; // PageName might be used by onNavigate for other purposes

interface SlideContent {
  id: number;
  imageUrl: string;
  altText: string;
  title: string;
  subtitle: string;
}

const placeholderSlides: SlideContent[] = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1505238680356-667803448bb6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80&h=480',
    altText: 'Promotional banner for exciting new opportunities',
    title: 'Temukan Peluang Baru',
    subtitle: 'Jelajahi berbagai event dan koneksi yang menginspirasi.',
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80&h=480',
    altText: 'Banner showcasing vibrant event experiences',
    title: 'Pengalaman Tak Terlupakan',
    subtitle: 'Hadirilah event-event yang akan memperkaya hidup Anda.',
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80&h=480',
    altText: 'Banner highlighting community and networking',
    title: 'Bangun Jaringan Anda',
    subtitle: 'Terhubung dengan para profesional dan penggiat di bidang Anda.',
  },
];

interface HeroSliderProps {
  onNavigate: (page: PageName, data?: any) => void;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const AUTOPLAY_INTERVAL = 7000;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === placeholderSlides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? placeholderSlides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const renderSlideContent = (slide: SlideContent, isActive: boolean) => {
    return (
      <div className="w-full h-full relative">
        <img
          src={slide.imageUrl}
          alt={slide.altText}
          className="w-full h-full object-cover"
          loading={slide.id === placeholderSlides[0].id ? "eager" : "lazy"}
          onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/slidererror/1280/480?text=Error+Loading+Image')}
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-4 md:p-8">
          <h2 
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4 transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            style={{ transitionDelay: isActive ? '200ms' : '0ms' }}
          >
            {slide.title}
          </h2>
          <p 
            className={`text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            style={{ transitionDelay: isActive ? '400ms' : '0ms' }}
          >
            {slide.subtitle}
          </p>
        </div>
      </div>
    );
  };

  return (
    <section
      className="my-4 md:my-6 lg:my-8" // Vertical margins managed by this outer section
      aria-roledescription="carousel"
      aria-label="Promosi Unggulan Hegra"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8"> {/* Standard container for max-width and padding */}
        <div className="relative text-hegra-white overflow-hidden rounded-3xl border border-hegra-navy/10"> {/* Visual wrapper for the slider */}
          <div className="relative w-full aspect-[16/6] min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[450px] bg-gray-200">
            <div
              className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {placeholderSlides.map((slide, slideIndex) => (
                <div
                  key={slide.id}
                  className={`min-w-full h-full`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Slide ${slideIndex + 1} dari ${placeholderSlides.length}: ${slide.title}`}
                  aria-hidden={currentSlide !== slideIndex}
                >
                  {renderSlideContent(slide, currentSlide === slideIndex)}
                </div>
              ))}
            </div>

            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-3 md:left-5 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 md:p-3 rounded-full transition-colors focus:outline-none z-20"
              aria-label="Slide sebelumnya"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-3 md:right-5 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 md:p-3 rounded-full transition-colors focus:outline-none z-20"
              aria-label="Slide berikutnya"
            >
              <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-5 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {placeholderSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ease-in-out
                              ${currentSlide === index ? 'bg-hegra-turquoise scale-125' : 'bg-hegra-white/50 hover:bg-hegra-white/80'}`}
                  aria-label={`Ke slide ${index + 1}`}
                  aria-current={currentSlide === index ? "true" : "false"}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;