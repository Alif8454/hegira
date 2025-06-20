/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo } from 'react';
import EventCard from '../../components/EventCard';
import { Search, ChevronLeft, ChevronRight, Filter as FilterIcon, ChevronDown, ChevronUp } from 'lucide-react'; 
import { EventData, PageName } from '../../HegraApp';

// Sample data for cards - updated to EventData structure
const sampleEventsData: EventData[] = [
  { 
    id: 1, category: 'B2C', name: 'Konser Musik Merdeka Vol. 2', location: 'Jakarta Fairground', 
    dateDisplay: "17 Agustus 2024", timeDisplay: "19:00 WIB",
    quotaProgress: 75, displayPrice: 'Rp 199.000', discountedPrice: 'Rp 199.000', posterUrl: 'https://picsum.photos/seed/event1/400/300',
    summary: 'Rayakan kemerdekaan dengan lantunan musik dari artis ternama ibu kota!',
    googleMapsQuery: 'Jakarta Fairground Kemayoran', parkingAvailable: true, ageRestriction: '17+', arrivalInfo: 'Dianjurkan datang 1 jam sebelum acara.',
    fullDescription: '<p>Bergabunglah dalam kemeriahan Konser Musik Merdeka Vol. 2! Menampilkan deretan musisi papan atas Indonesia yang akan membawakan lagu-lagu hits mereka dan semangat kemerdekaan. Acara ini akan diadakan di Jakarta Fairground yang luas dan nyaman.</p><p>Pastikan Anda tidak kehabisan tiket dan menjadi bagian dari malam yang tak terlupakan ini. Ajak teman dan keluarga Anda untuk merayakan semangat kemerdekaan bersama!</p>',
    ticketCategories: [
      { id: 'regular', name: 'Regular Pass', price: 199000, description: 'Akses ke area festival regular.', availabilityStatus: 'available' },
      { id: 'vip', name: 'VIP Pass', price: 499000, description: 'Akses ke area VIP dekat panggung, termasuk merchandise eksklusif.', availabilityStatus: 'almost-sold' },
    ],
    organizerName: 'Merdeka Fest Organizer',
    organizerLogoUrl: 'https://picsum.photos/seed/org1/50/50'
  },
  { 
    id: 2, category: 'B2B', name: 'International Tech Summit 2024', location: 'Bali Convention Center', 
    dateDisplay: "20-22 September 2024", timeDisplay: "09:00 - Selesai",
    quotaProgress: 60, displayPrice: 'Rp 1.500.000', posterUrl: 'https://picsum.photos/seed/event2/400/300',
    summary: 'Konferensi teknologi terbesar di Asia Tenggara, hadirkan inovator dan pemimpin industri.',
    googleMapsQuery: 'Bali International Convention Centre', parkingAvailable: true, ageRestriction: 'Profesional', arrivalInfo: 'Registrasi dimulai pukul 08:00 WITA.',
    fullDescription: '<p>International Tech Summit 2024 kembali hadir di Bali! Acara ini akan mengumpulkan para pemimpin industri, inovator, startup, dan investor dari seluruh dunia. Dapatkan wawasan terbaru tentang tren teknologi, jaringan dengan para ahli, dan temukan peluang kolaborasi.</p><p>Sesi akan mencakup AI, Blockchain, Fintech, SaaS, dan banyak lagi. Jangan lewatkan kesempatan untuk menjadi bagian dari masa depan teknologi.</p>',
    ticketCategories: [
      { id: 'earlybird', name: 'Early Bird Pass (until 1 Aug)', price: 1200000, availabilityStatus: 'almost-sold' },
      { id: 'standard', name: 'Standard Pass', price: 1500000, availabilityStatus: 'available' },
      { id: 'pro', name: 'Professional Pass + Workshop', price: 2500000, description: 'Termasuk akses ke workshop eksklusif.', availabilityStatus: 'available' },
    ],
    organizerName: 'Global Tech Network',
    organizerLogoUrl: 'https://picsum.photos/seed/org2/50/50'
  },
  { 
    id: 3, category: 'B2G', name: 'Forum Nasional Smart Governance', location: 'Istana Negara, Jakarta', 
    dateDisplay: "5 Oktober 2024", timeDisplay: "10:00 WIB (Undangan)",
    quotaProgress: 90, displayPrice: 'Undangan Khusus', posterUrl: 'https://picsum.photos/seed/event3/400/300',
    summary: 'Diskusi strategis untuk akselerasi transformasi digital pemerintahan Indonesia.',
    googleMapsQuery: 'Istana Negara Jakarta', parkingAvailable: false, ageRestriction: 'Pejabat & Undangan', arrivalInfo: 'Harap konfirmasi kehadiran H-7.',
    fullDescription: '<p>Forum Nasional Smart Governance adalah acara penting yang didedikasikan untuk membahas strategi dan implementasi tata kelola pemerintahan yang cerdas dan berbasis teknologi. Acara ini akan dihadiri oleh para pejabat tinggi negara, pakar teknologi, dan perwakilan dari berbagai instansi pemerintah.</p><p>Fokus utama adalah pada peningkatan layanan publik, transparansi, dan efisiensi melalui adopsi teknologi digital. Partisipasi hanya melalui undangan.</p>',
    ticketCategories: [
      { id: 'invitation', name: 'Undangan Resmi', price: 0, description: 'Hanya untuk tamu undangan.', availabilityStatus: 'available' },
    ],
    organizerName: 'Sekretariat Negara',
    // organizerLogoUrl: 'https://picsum.photos/seed/org3/50/50' // Could be null
  },
   { 
    id: 4, category: 'B2C', name: 'Festival Kuliner Nusantara', location: 'Alun-Alun Kota Bandung', 
    dateDisplay: "12-14 Juli 2024", timeDisplay: "10:00 - 22:00 WIB",
    quotaProgress: 85, displayPrice: 'Gratis Masuk', posterUrl: 'https://picsum.photos/seed/event4/400/300',
    summary: 'Nikmati ribuan hidangan khas dari seluruh penjuru Indonesia di satu tempat!',
    googleMapsQuery: 'Alun-Alun Kota Bandung', parkingAvailable: true, ageRestriction: 'Semua Umur', arrivalInfo: 'Paling ramai saat akhir pekan.',
    fullDescription: '<p>Festival Kuliner Nusantara kembali hadir di Bandung! Manjakan lidah Anda dengan beragam cita rasa otentik dari Sabang sampai Merauke. Lebih dari 100 tenant makanan dan minuman siap menyajikan hidangan terbaik mereka. Acara ini juga akan dimeriahkan dengan pertunjukan seni dan budaya.</p><p>Ajak keluarga dan teman-teman Anda untuk berpetualang rasa di festival ini. Masuk gratis!</p>',
    ticketCategories: [
      { id: 'entry', name: 'Tiket Masuk', price: 0, description: 'Akses gratis ke area festival.', availabilityStatus: 'available' },
      { id: 'voucher', name: 'Voucher Kuliner Rp50.000', price: 45000, description: 'Dapatkan diskon untuk pembelian makanan.', availabilityStatus: 'sold-out' },
    ],
    organizerName: 'Pesona Kuliner ID',
    organizerLogoUrl: 'https://picsum.photos/seed/org4/50/50'
  },
  {
    id: 5, category: 'B2C', name: 'Workshop Fotografi Alam', location: 'Taman Nasional Bromo', 
    dateDisplay: "3-5 November 2024", timeDisplay: "Mulai 14:00 WIB",
    quotaProgress: 50, displayPrice: 'Rp 850.000', posterUrl: 'https://picsum.photos/seed/event5/400/300',
    summary: 'Pelajari teknik fotografi lanskap dan milky way di Bromo.',
    googleMapsQuery: 'Taman Nasional Bromo Tengger Semeru', parkingAvailable: true, ageRestriction: '18+', arrivalInfo: 'Meeting point di Sukapura pukul 14:00.',
    fullDescription: '<p>Ikuti workshop fotografi alam eksklusif di Taman Nasional Bromo Tengger Semeru. Dipandu oleh fotografer profesional, Anda akan belajar teknik menangkap keindahan lanskap Bromo, matahari terbit, dan pesona milky way. Cocok untuk pemula hingga menengah.</p>',
    ticketCategories: [
      { id: 'basic', name: 'Paket Dasar', price: 850000, description: 'Termasuk workshop & akomodasi dasar.', availabilityStatus: 'available' },
      { id: 'full', name: 'Paket Lengkap', price: 1250000, description: 'Termasuk workshop, akomodasi, dan jeep tour.', availabilityStatus: 'available' },
    ],
    organizerName: 'Nature Lens Academy',
    organizerLogoUrl: 'https://picsum.photos/seed/org5/50/50'
  },
  {
    id: 6, category: 'B2B', name: 'Pameran Industri Kreatif Nasional', location: 'Jogja Expo Center', 
    dateDisplay: "10-12 Desember 2024", timeDisplay: "10:00 - 21:00 WIB",
    quotaProgress: 65, displayPrice: 'Gratis (Registrasi)', posterUrl: 'https://picsum.photos/seed/event6/400/300',
    summary: 'Wadah bagi para pelaku industri kreatif untuk berjejaring dan pamerkan karya.',
    googleMapsQuery: 'Jogja Expo Center', parkingAvailable: true, ageRestriction: 'Profesional', arrivalInfo: 'Buka pukul 10:00 - 21:00 WIB.',
    fullDescription: '<p>Pameran Industri Kreatif Nasional (PIKN) adalah ajang tahunan yang mempertemukan para pelaku industri kreatif dari berbagai subsektor seperti film, animasi, game, fashion, dan kriya. Kesempatan emas untuk networking, kolaborasi, dan update tren terbaru.</p>',
    ticketCategories: [
      { id: 'visitor', name: 'Pengunjung Umum', price: 0, description: 'Wajib registrasi online.', availabilityStatus: 'available' },
      { id: 'exhibitor', name: 'Paket Exhibitor', price: 3500000, description: 'Untuk memamerkan produk/jasa.', availabilityStatus: 'available' },
    ],
    organizerName: 'Kreatif Hub Indonesia',
    organizerLogoUrl: 'https://picsum.photos/seed/org6/50/50'
  },
  {
    id: 7, category: 'B2G', name: 'Seminar Keamanan Siber Nasional', location: 'Hotel Borobudur, Jakarta', 
    dateDisplay: "28 November 2024", timeDisplay: "08:30 WIB",
    quotaProgress: 70, displayPrice: 'Rp 500.000', posterUrl: 'https://picsum.photos/seed/event7/400/300',
    summary: 'Meningkatkan kesadaran dan kapabilitas keamanan siber di sektor pemerintahan.',
    googleMapsQuery: 'Hotel Borobudur Jakarta', parkingAvailable: true, ageRestriction: 'ASN & Profesional TI', arrivalInfo: 'Registrasi pukul 08:30 WIB.',
    fullDescription: '<p>Seminar ini bertujuan untuk membahas tantangan dan solusi dalam meningkatkan keamanan siber di lingkungan pemerintahan dan BUMN. Menghadirkan pakar keamanan siber nasional dan internasional.</p>',
    ticketCategories: [
      { id: 'government', name: 'Peserta Pemerintahan', price: 250000, description: 'Dengan surat tugas.', availabilityStatus: 'available' },
      { id: 'public', name: 'Peserta Umum/Swasta', price: 500000, availabilityStatus: 'available' },
    ],
    organizerName: 'CyberSec Forum ID',
    // organizerLogoUrl: null // Example of no logo
  },
  {
    id: 8, category: 'B2C', name: 'Pertunjukan Teater Klasik: Hamlet', location: 'Gedung Kesenian Jakarta', 
    dateDisplay: "19 Oktober 2024", timeDisplay: "20:00 WIB",
    quotaProgress: 80, displayPrice: 'Rp 150.000', posterUrl: 'https://picsum.photos/seed/event8/400/300',
    summary: 'Saksikan adaptasi mahakarya Shakespeare oleh grup teater ternama.',
    googleMapsQuery: 'Gedung Kesenian Jakarta', parkingAvailable: true, ageRestriction: '13+', arrivalInfo: 'Pintu teater dibuka 30 menit sebelum pertunjukan.',
    fullDescription: '<p>Sebuah pementasan klasik "Hamlet" karya William Shakespeare yang disajikan dengan interpretasi modern namun tetap mempertahankan esensi cerita. Dibawakan oleh aktor dan aktris teater berbakat.</p>',
    ticketCategories: [
      { id: 'balcony', name: 'Balkon', price: 150000, availabilityStatus: 'almost-sold' },
      { id: 'tribune', name: 'Tribun', price: 250000, availabilityStatus: 'available' },
      { id: 'vip', name: 'VIP', price: 400000, availabilityStatus: 'sold-out' },
    ],
    organizerName: 'Teater Panggung Merah',
    organizerLogoUrl: 'https://picsum.photos/seed/org8/50/50'
  },
  {
    id: 9, category: 'B2B', name: 'Startup Investor Meetup Vol. 3', location: 'WeWork SCBD, Jakarta', 
    dateDisplay: "7 September 2024", timeDisplay: "17:00 WIB",
    quotaProgress: 55, displayPrice: 'Khusus Undangan', posterUrl: 'https://picsum.photos/seed/event9/400/300',
    summary: 'Platform eksklusif bagi startup potensial untuk bertemu dengan investor.',
    googleMapsQuery: 'WeWork Revenue Tower SCBD', parkingAvailable: true, ageRestriction: 'Startup & Investor', arrivalInfo: 'Acara dimulai pukul 17:00 WIB.',
    fullDescription: '<p>Acara networking eksklusif yang dirancang untuk menghubungkan startup tahap awal dan pertumbuhan dengan investor aktif. Startup terpilih akan memiliki kesempatan untuk pitching.</p>',
    ticketCategories: [
      { id: 'startup', name: 'Startup (by selection)', price: 0, availabilityStatus: 'available' },
      { id: 'investor', name: 'Investor Pass', price: 1000000, availabilityStatus: 'available' },
    ],
    organizerName: 'Capital Connect',
    organizerLogoUrl: 'https://picsum.photos/seed/org9/50/50'
  },
  {
    id: 10, category: 'B2C', name: 'Festival Film Independen Surabaya', location: 'CGV Marvell City, Surabaya', 
    dateDisplay: "25-27 Oktober 2024", timeDisplay: "Sesuai Jadwal Film",
    quotaProgress: 60, displayPrice: 'Rp 35.000/film', posterUrl: 'https://picsum.photos/seed/event10/400/300',
    summary: 'Pemutaran film-film independen berkualitas karya sineas muda Indonesia.',
    googleMapsQuery: 'CGV Marvell City Surabaya', parkingAvailable: true, ageRestriction: 'Sesuai rating film', arrivalInfo: 'Jadwal pemutaran terpisah.',
    fullDescription: '<p>Festival Film Independen Surabaya (FFIS) kembali hadir dengan seleksi film pendek dan panjang dari sineas-sineas berbakat. Nikmati berbagai genre dan diskusi film menarik.</p>',
    ticketCategories: [
      { id: 'single', name: 'Tiket Per Film', price: 35000, availabilityStatus: 'available' },
      { id: 'daypass', name: 'Day Pass (All Films)', price: 120000, availabilityStatus: 'available' },
    ],
    organizerName: 'Suroboyo Film Collective',
  },
  {
    id: 11, category: 'B2C', name: 'Yoga Retreat Alam Terbuka', location: 'Ubud, Bali', 
    dateDisplay: "15-17 November 2024", timeDisplay: "Sesuai Jadwal Retreat",
    quotaProgress: 40, displayPrice: 'Rp 2.500.000', posterUrl: 'https://picsum.photos/seed/event11/400/300',
    summary: 'Temukan kedamaian dan keseimbangan melalui yoga di tengah alam Ubud yang asri.',
    googleMapsQuery: 'Ubud Bali', parkingAvailable: true, ageRestriction: 'Dewasa', arrivalInfo: 'Detail lokasi akan diinfokan setelah pendaftaran.',
    fullDescription: '<p>Sebuah retreat yoga selama 3 hari 2 malam di Ubud, Bali. Termasuk sesi yoga pagi dan sore, meditasi, workshop kesehatan, dan akomodasi. Cocok untuk semua level praktisi yoga.</p>',
    ticketCategories: [
      { id: 'shared', name: 'Kamar Bersama', price: 2500000, availabilityStatus: 'almost-sold' },
      { id: 'private', name: 'Kamar Pribadi', price: 3500000, availabilityStatus: 'available' },
    ],
    organizerName: 'Bali Soul Journey',
    organizerLogoUrl: 'https://picsum.photos/seed/org11/50/50'
  },
  {
    id: 12, category: 'B2B', name: 'Konferensi Logistik & Supply Chain Asia', location: 'JIExpo Kemayoran, Jakarta', 
    dateDisplay: "2-4 Desember 2024", timeDisplay: "09:00 - 17:00 WIB",
    quotaProgress: 70, displayPrice: 'Rp 1.200.000', posterUrl: 'https://picsum.photos/seed/event12/400/300',
    summary: 'Platform terdepan untuk para profesional logistik dan rantai pasok di Asia.',
    googleMapsQuery: 'Jakarta International Expo (JIExpo)', parkingAvailable: true, ageRestriction: 'Profesional', arrivalInfo: 'Pameran buka pukul 09:00 - 17:00 WIB.',
    fullDescription: '<p>Konferensi dan pameran internasional yang fokus pada inovasi, teknologi, dan tren terbaru dalam industri logistik dan supply chain. Menghadirkan pembicara ahli dan solusi dari penyedia terkemuka.</p>',
    ticketCategories: [
      { id: 'conference', name: 'Conference Delegate', price: 1200000, availabilityStatus: 'available' },
      { id: 'expo', name: 'Expo Visitor Pass', price: 150000, description: 'Akses hanya ke area pameran.', availabilityStatus: 'available' },
    ],
    organizerName: 'Asia Logistics Expo',
    organizerLogoUrl: 'https://picsum.photos/seed/org12/50/50'
  }
];

interface EventPageProps {
  onNavigate: (page: PageName, data?: any) => void;
}

const ITEMS_PER_PAGE = 9; 

const EventPage: React.FC<EventPageProps> = ({ onNavigate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Festivals']);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  const totalPages = Math.ceil(sampleEventsData.length / ITEMS_PER_PAGE);

  const currentEvents = useMemo(() => {
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    return sampleEventsData.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const categories = ["Festivals", "Conferences", "Exhibitions"];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <header className="mb-8 md:mb-12 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-hegra-turquoise">Explore Events</h1>
        <p className="mt-3 text-lg text-gray-700 max-w-3xl mx-auto">
          Dive into a world of excitement and opportunity. Browse through a diverse collection of upcoming events, 
          from vibrant festivals and insightful conferences to engaging exhibitions. Find your next unforgettable experience right here.
        </p>
      </header>
      
      <div className="mb-12 md:mb-16">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="search"
            id="search-event"
            name="search-event"
            placeholder="Search events"
            className="w-full py-3 px-4 pl-12 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-hegra-turquoise focus:border-hegra-turquoise transition-colors bg-white" 
            aria-label="Search events"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 lg:w-1/5 bg-white p-6 rounded-lg shadow-sm border border-gray-200 self-start">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-hegra-navy">Filters</h2>
            <button 
              onClick={() => setIsFilterVisible(!isFilterVisible)} 
              className="text-hegra-navy hover:text-hegra-turquoise p-1"
              aria-expanded={isFilterVisible}
              aria-controls="event-filters-content"
            >
              {isFilterVisible ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          
          {isFilterVisible && (
            <div id="event-filters-content" className="space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Category</h3>
                <ul className="space-y-1">
                  {categories.map(category => (
                    <li key={category}>
                      <label className="flex items-center space-x-2 text-gray-700 hover:text-hegra-turquoise cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                          className="form-checkbox h-4 w-4 text-hegra-turquoise rounded border-gray-300 focus:ring-hegra-turquoise/50"
                        />
                        <span>{category}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Date Range Filter */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Date Range</h3>
                <div className="space-y-2">
                  <div>
                    <label htmlFor="start-date" className="sr-only">Start date</label>
                    <input
                      type="date"
                      id="start-date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-hegra-turquoise focus:border-hegra-turquoise text-sm bg-white"
                      placeholder="Start date"
                    />
                  </div>
                  <div>
                    <label htmlFor="end-date" className="sr-only">End date</label>
                    <input
                      type="date"
                      id="end-date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-hegra-turquoise focus:border-hegra-turquoise text-sm bg-white"
                      placeholder="End date"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </aside>

        <main className="w-full md:w-3/4 lg:w-4/5">
          <section aria-labelledby="event-list-heading">
            <h2 id="event-list-heading" className="sr-only">Daftar Event</h2>
            {currentEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {currentEvents.map(event => (
                  <EventCard key={event.id} {...event} onNavigate={onNavigate} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">Belum ada event yang tersedia saat ini.</p>
              </div>
            )}
          </section>

          {totalPages > 1 && (
            <nav aria-label="Paginasi event" className="mt-12 flex justify-center">
              <ul className="inline-flex items-center -space-x-px">
                <li>
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Halaman sebelumnya"
                  >
                    <ChevronLeft size={18} />
                  </button>
                </li>
                {pageNumbers.map(number => (
                  <li key={number}>
                    <button
                      onClick={() => handlePageChange(number)}
                      className={`py-2 px-3 leading-tight border transition-colors
                        ${currentPage === number 
                          ? 'text-hegra-turquoise bg-hegra-turquoise/10 border-gray-300 font-semibold' 
                          : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                        }`}
                      aria-current={currentPage === number ? 'page' : undefined}
                      aria-label={`Ke halaman ${number}`}
                    >
                      {number}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Halaman berikutnya"
                  >
                    <ChevronRight size={18} />
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </main>
      </div>
    </div>
  );
};

export default EventPage;