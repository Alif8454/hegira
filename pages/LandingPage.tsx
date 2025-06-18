/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useRef } from 'react';
import HeroSlider from '../components/HeroSlider';
import EventCard from '../components/EventCard';
// import BusinessMatchingCard from '../components/BusinessMatchingCard'; // Removed import
import { Briefcase, CalendarDays, BarChart3, Users, Mail, TrendingUp, Zap, ShieldCheck, Search, Lightbulb, Link2, CheckCircle, SpeakerIcon, Heart, TrendingUpIcon, CalendarCheck2, Headset, LayoutGrid, Ticket as TicketIcon } from 'lucide-react'; 
import { PageName, EventData } from '../HegraApp';

// Sample data for cards - updated to EventData structure
const sampleEventsLanding: EventData[] = [
  { 
    id: 1, category: 'B2C', name: 'Konser Musik Galaxy', location: 'Jakarta Stadiun Int.', 
    dateDisplay: "28 Desember 2024", timeDisplay: "19:00 WIB",
    quotaProgress: 85, displayPrice: 'Mulai Rp 250rb', discountedPrice: 'Rp 250.000', posterUrl: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29uY2VydHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    summary: 'Rayakan akhir tahun dengan dentuman musik spektakuler!',
    googleMapsQuery: 'Jakarta International Stadium', parkingAvailable: true, ageRestriction: '13+', arrivalInfo: 'Pintu dibuka 17:00 WIB.',
    fullDescription: '<p>Detail lengkap Konser Musik Galaxy...</p>',
    ticketCategories: [{ id: 'regular', name: 'Regular', price: 250000 }],
    organizerName: 'Galaxy Entertainment',
    organizerLogoUrl: 'https://picsum.photos/seed/galaxyent/50/50'
  },
  { 
    id: 2, category: 'B2B', name: 'Global Tech Innovators Summit', location: 'Bali Nusa Dua CC', 
    dateDisplay: "15 November 2024", timeDisplay: "09:00 WITA",
    quotaProgress: 70, displayPrice: 'Mulai Rp 1.750rb', posterUrl: 'https://images.unsplash.com/photo-1578852650900-7cecf1090909?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRlY2glMjBjb25mZXJlbmNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    summary: 'Konferensi teknologi visioner masa depan.',
    googleMapsQuery: 'Bali Nusa Dua Convention Center', parkingAvailable: true, ageRestriction: 'Profesional', arrivalInfo: 'Registrasi 08:00 WITA.',
    fullDescription: '<p>Detail lengkap Global Tech Innovators Summit...</p>',
    ticketCategories: [{ id: 'standard', name: 'Standard', price: 1750000 }],
    organizerName: 'TechVision Planners',
    organizerLogoUrl: 'https://picsum.photos/seed/techvision/50/50'
  },
  { 
    id: 3, category: 'B2G', name: 'Forum Nasional Tata Kelola Digital', location: 'Hotel Indonesia Kempinski', 
    dateDisplay: "20 Oktober 2024", timeDisplay: "10:00 WIB",
    quotaProgress: 92, displayPrice: 'Khusus Undangan', posterUrl: 'https://images.unsplash.com/photo-1542744095-291d1f67b221?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YnVzaW5lc3MlMjBtZWV0aW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    summary: 'Forum strategis akselerasi digital nasional.',
    googleMapsQuery: 'Hotel Indonesia Kempinski Jakarta', parkingAvailable: false, ageRestriction: 'Undangan', arrivalInfo: 'Konfirmasi H-7.',
    fullDescription: '<p>Detail lengkap Forum Nasional Tata Kelola Digital...</p>',
    ticketCategories: [{ id: 'invitation', name: 'Undangan', price: 0 }],
    organizerName: 'Kementerian Komunikasi & Informatika',
    // organizerLogoUrl: 'https://picsum.photos/seed/kominfo/50/50' // Example, can be null
  },
];

// Sample vendors removed as the section is removed.

interface FeatureItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  iconBgClass: string;
  iconColorClass: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon: Icon, title, description, iconBgClass, iconColorClass }) => (
  <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 flex flex-col items-center text-center h-full hover:border-hegra-turquoise/20 hover:-translate-y-1 transition-all duration-300">
    <div className={`p-4 rounded-full ${iconBgClass} mb-4 sm:mb-6 inline-block`}>
      <Icon size={32} className={iconColorClass} />
    </div>
    <h3 className="text-xl font-semibold text-hegra-deep-navy mb-2">{title}</h3>
    <p className="text-sm text-gray-600 flex-grow">{description}</p>
  </div>
);


const useIntersectionObserver = (options?: IntersectionObserverInit) => {
  const [elements, setElements] = React.useState<HTMLElement[]>([]);
  const observer = React.useRef<IntersectionObserver | null>(null);

  React.useEffect(() => {
    if (elements.length === 0) return;

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, options);

    elements.forEach(element => observer.current?.observe(element));

    return () => observer.current?.disconnect();
  }, [elements, options]);

  return setElements;
};


interface LandingPageProps {
  onNavigate: (page: PageName, data?: any) => void;
  onOpenLoginModal?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenLoginModal }) => {
  const setObservedElements = useIntersectionObserver({ threshold: 0.1 });
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const validRefs = sectionRefs.current.filter(el => el !== null) as HTMLElement[];
    setObservedElements(validRefs);
  }, [setObservedElements]);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };
  
  const handleNewsletterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailInput = event.currentTarget.elements.namedItem('email') as HTMLInputElement;
    if (emailInput && emailInput.value) {
      alert(`Terima kasih! Email ${emailInput.value} telah didaftarkan untuk newsletter Hegra.`);
      emailInput.value = ''; // Clear input
    } else {
      alert('Mohon masukkan alamat email Anda.');
    }
  };

  return (
    <>
      {/* Section 1: Hero Slider */}
      <HeroSlider onNavigate={onNavigate} />

      {/* Section 2: Temukan Event Menarik */}
      <section id="events" className="py-16 md:py-24 bg-hegra-card-bg" ref={addToRefs}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-16 animate-on-scroll fade-in">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-hegra-deep-navy text-center md:text-left">Temukan Event <span className="text-gradient">Menarik</span></h2>
              <p className="text-neutral-700 mt-2 text-center md:text-left">Jelajahi berbagai acara terbaru dan paling populer.</p>
            </div>
            <button 
              onClick={() => onNavigate('events')} 
              className="mt-4 md:mt-0 text-hegra-gradient-start hover:text-hegra-gradient-mid font-semibold transition-colors duration-300 group flex items-center"
            >
              Lihat Semua Event <TrendingUp size={20} className="ml-2 transform transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleEventsLanding.map((event, index) => (
              <div key={event.id} className="animate-on-scroll fade-in-up" style={{ animationDelay: `${index * 0.15}s` }}>
                <EventCard {...event} onNavigate={onNavigate} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: About Hegra - Reconstructed */}
      <section id="about-hegra" className="py-16 md:py-24 bg-hegra-chino/20" ref={addToRefs}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 animate-on-scroll fade-in">
          <div className="mb-4">
            <span className="bg-hegra-turquoise/20 text-hegra-turquoise font-semibold px-4 py-1.5 rounded-full text-xs inline-block">
              ABOUT US
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-hegra-deep-navy mb-8">
            What Is <span className="text-hegra-turquoise">Hegira?</span>
          </h2>
          
          <div className="md:grid md:grid-cols-2 md:gap-x-12 lg:gap-x-16 mb-12 text-gray-700 text-base md:text-lg leading-relaxed space-y-4 md:space-y-0">
            <p>
              Hegira adalah platform event terintegrasi yang dirancang untuk merevolusi cara Anda menemukan, mengelola, dan menikmati berbagai acara. Kami percaya bahwa setiap event adalah sebuah kesempatan—untuk belajar, bertumbuh, berjejaring, dan menciptakan kenangan.
            </p>
            <p>
              Misi kami adalah memberdayakan penyelenggara event dengan alat yang intuitif dan komprehensif, sekaligus memberikan pengalaman yang mulus dan menyenangkan bagi para peserta. Dari konser musik megah hingga workshop bisnis yang intim, Hegira hadir untuk Anda.
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 mb-12 md:mb-16">
            <FeatureItem
              icon={TicketIcon}
              title="Tiket Terintegrasi"
              description="Beli dan jual tiket untuk berbagai jenis event (B2C, B2B, B2G) dengan mudah, aman, dan cepat."
              iconBgClass="bg-hegra-turquoise/20"
              iconColorClass="text-hegra-turquoise"
            />
            <FeatureItem
              icon={Users}
              title="Jangkauan Luas"
              description="Temukan audiens yang lebih luas untuk event Anda atau jelajahi ribuan event menarik di seluruh Indonesia."
              iconBgClass="bg-hegra-yellow/20"
              iconColorClass="text-hegra-yellow"
            />
            <FeatureItem
              icon={Briefcase}
              title="Kelola Event Mudah"
              description="Tools lengkap bagi event creator untuk mengelola penjualan tiket, promosi, dan analitik secara profesional."
              iconBgClass="bg-hegra-chino/20"
              iconColorClass="text-hegra-chino"
            />
          </div>

          <img
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80"
            alt="Hegra - Connecting Visions and Solutions"
            className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-2xl shadow-xl"
          />
        </div>
      </section>
      
      {/* Section 4: Business Matching - REMOVED */}
      {/* 
      <section id="business-matching" className="py-16 md:py-24 bg-hegra-card-bg" ref={addToRefs}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16 animate-on-scroll fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-hegra-deep-navy">Jalin Koneksi <span className="text-gradient">Bisnis Strategis</span></h2>
            <p className="text-lg text-neutral-700 mt-3 max-w-3xl mx-auto">Temukan partner, vendor, atau investor potensial untuk pertumbuhan bisnis Anda melalui platform business matching kami yang inovatif.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {sampleVendors.map((vendor, index) => (
              <div key={vendor.id} className="animate-on-scroll fade-in-up" style={{ animationDelay: `${index * 0.15}s` }}>
                <BusinessMatchingCard {...vendor} />
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Section 5: Newsletter */}
      <section id="newsletter" className="py-16 md:py-24 bg-gradient-to-b from-hegra-turquoise/60 to-hegra-turquoise text-hegra-white" ref={addToRefs}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-on-scroll fade-in">
            <Mail size={48} className="mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Tetap Terhubung!</h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              Dapatkan berita terbaru, promo eksklusif, dan info event pilihan dari Hegra langsung ke kotak masuk Anda.
            </p>
            <form 
              onSubmit={handleNewsletterSubmit} 
              className="max-w-lg mx-auto flex flex-col sm:flex-row gap-3 items-center"
            >
              <label htmlFor="newsletter-email" className="sr-only">Alamat Email</label>
              <input
                type="email"
                id="newsletter-email"
                name="email"
                placeholder="Masukkan alamat email Anda"
                required
                className="w-full sm:flex-grow py-3 px-5 rounded-lg text-hegra-deep-navy placeholder-gray-500 focus:ring-2 focus:ring-hegra-yellow focus:outline-none transition-shadow shadow-sm bg-white"
                aria-label="Alamat email untuk newsletter"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-hegra-yellow text-hegra-navy font-semibold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-hegra-navy focus:ring-offset-2 focus:ring-offset-hegra-turquoise shadow-md"
              >
                Berlangganan
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;