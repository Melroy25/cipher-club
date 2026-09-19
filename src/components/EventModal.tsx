import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface EventData {
  id: string;
  tag: string;
  dateTag: string;
  title: string;
  subTitle: string;
  description: string;
  fullDescription: string[];
  slug: string;
  cardSub: string;
  slides: string[];
}

interface EventModalProps {
  event: EventData | null;
  onClose: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!event) return null;

  const totalSlides = event.slides.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-5xl rounded-2xl border border-[#00ff66]/40 bg-[#050f07] p-6 sm:p-8 md:p-10 shadow-[0_0_40px_rgba(0,255,102,0.2)] my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 rounded-lg border border-[#00ff66]/30 text-[#00ff66] hover:bg-[#00ff66] hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Breadcrumb */}
        <div className="font-mono text-xs tracking-widest text-[#00ff66] mb-2">
          CIPHER // ACTIVITIES
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-2">
          
          {/* Left Column: Event Narrative */}
          <div className="lg:col-span-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 text-glow">
              {event.title}
            </h2>

            <div className="font-mono text-xs sm:text-sm tracking-wider text-[#00ff66] mb-6">
              {event.subTitle}
            </div>

            <div className="space-y-4 font-mono text-sm sm:text-base text-[#a0c0a8] leading-relaxed">
              {event.fullDescription.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Gallery Slider */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            {/* Card Frame */}
            <div className="w-full max-w-md rounded-xl overflow-hidden border border-[#00ff66] bg-black shadow-[0_0_25px_rgba(0,255,102,0.25)] flex flex-col">
              
              {/* Header inside Card */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#00ff66]/20 font-mono text-xs tracking-widest text-[#00ff66]">
                <span>{event.slug}</span>
                <span>
                  {String(currentSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
                </span>
              </div>

              {/* Slide Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                <img
                  src={event.slides[currentSlide]}
                  alt={`${event.title} slide ${currentSlide + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />

                {/* Bottom Overlay Badge */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <span className="inline-block font-mono text-[10px] tracking-widest text-[#00ff66] bg-[#00ff66]/15 border border-[#00ff66]/30 px-2 py-0.5 rounded mb-1.5">
                    {event.dateTag}
                  </span>
                  <div className="font-bold text-white text-base leading-snug">
                    {event.title}
                  </div>
                  <div className="font-mono text-xs text-[#88aa90]">
                    {event.cardSub}
                  </div>
                </div>
              </div>

            </div>

            {/* Slider Controls */}
            <div className="w-full max-w-md mt-4 flex items-center justify-between font-mono text-xs text-[#00ff66]">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-lg border border-[#00ff66]/30 hover:border-[#00ff66] hover:bg-[#00ff66]/10 flex items-center justify-center transition-colors"
                title="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="text-center">
                <div className="font-bold text-sm tracking-widest">
                  {String(currentSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
                </div>
                <div className="text-[10px] text-[#88aa90] tracking-wider mt-0.5">
                  SWIPE TO EXPLORE &rarr;
                </div>
              </div>

              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-lg border border-[#00ff66]/30 hover:border-[#00ff66] hover:bg-[#00ff66]/10 flex items-center justify-center transition-colors"
                title="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Indicator Dots */}
            <div className="flex items-center gap-1.5 mt-3">
              {event.slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentSlide === idx
                      ? 'w-6 bg-[#00ff66] shadow-[0_0_8px_#00ff66]'
                      : 'w-1.5 bg-[#00ff66]/30 hover:bg-[#00ff66]/60'
                  }`}
                />
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
