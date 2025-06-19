/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo } from 'react';
import BusinessMatchingCard from '../components/BusinessMatchingCard';
import { Search, ChevronLeft, ChevronRight, Briefcase as BriefcaseIcon, MapPin as LocationIcon, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { PageName } from '../HegraApp';

// Sample data for cards - can be expanded or fetched
const sampleVendors = [
  { id: 1, logoUrl: 'https://picsum.photos/seed/logo1/100/100', name: 'PT Inovasi Digital Nusantara', matchScore: 4.5, sector: 'Teknologi Informasi', location: 'Jakarta Selatan, DKI Jakarta', budget: 'Rp 50M - Rp 100M' },
  { id: 2, logoUrl: 'https://picsum.photos/seed/logo2/100/100', name: 'Studio Kreasi Bersama', matchScore: 4.2, sector: 'Industri Kreatif', location: 'Bandung, Jawa Barat', budget: 'Rp 10M - Rp 50M' },
  { id: 3, logoUrl: 'https://picsum.photos/seed/logo3/100/100', name: 'Manufaktur Presisi Indonesia', matchScore: 4.8, sector: 'Manufaktur', location: 'Surabaya, Jawa Timur', budget: 'Rp 100M - Rp 500M' },
  { id: 4, logoUrl: 'https://picsum.photos/seed/logo4/100/100', name: 'Solusi Edukasi Cemerlang', matchScore: 3.9, sector: 'Pendidikan & Pelatihan', location: 'Yogyakarta, DIY', budget: 'Rp 5M - Rp 20M' },
  { id: 5, logoUrl: 'https://picsum.photos/seed/logo5/100/100', name: 'Agro Makmur Sejahtera Tbk', matchScore: 4.6, sector: 'Agrikultur', location: 'Medan, Sumatera Utara', budget: 'Rp 200M - Rp 1T' },
  { id: 6, logoUrl: 'https://picsum.photos/seed/logo6/100/100', name: 'Layanan Kesehatan Prima', matchScore: 4.1, sector: 'Kesehatan', location: 'Semarang, Jawa Tengah', budget: 'Rp 30M - Rp 70M' },
  { id: 7, logoUrl: 'https://picsum.photos/seed/logo7/100/100', name: 'Jasa Keuangan Andalan', matchScore: 4.3, sector: 'Jasa Keuangan', location: 'Jakarta Pusat, DKI Jakarta', budget: 'Rp 75M - Rp 150M' },
  { id: 8, logoUrl: 'https://picsum.photos/seed/logo8/100/100', name: 'Retail Maju Jaya', matchScore: 4.0, sector: 'Retail', location: 'Bekasi, Jawa Barat', budget: 'Rp 20M - Rp 60M' },
];

const ITEMS_PER_PAGE = 6; 

interface BusinessMatchingPageProps {
  onNavigate: (page: PageName, data?: any) => void;
}

const BusinessMatchingPage: React.FC<BusinessMatchingPageProps> = ({ onNavigate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  const industrialSectors = [
    "Teknologi Informasi", "Industri Kreatif", "Manufaktur", 
    "Pendidikan & Pelatihan", "Agrikultur", "Kesehatan", "Jasa Keuangan", "Retail"
  ];

  const totalPages = Math.ceil(sampleVendors.length / ITEMS_PER_PAGE);

  const currentVendors = useMemo(() => {
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    return sampleVendors.slice(indexOfFirstItem, indexOfLastItem);
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
  
  const handleSectorChange = (sector: string) => {
    setSelectedSectors(prev => 
      prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]
    );
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <header className="mb-8 md:mb-12 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-hegra-turquoise">Explore Business Matching</h1>
        <p className="mt-3 text-lg text-gray-700 max-w-3xl mx-auto">
          Connect with potential partners, vendors, and investors. Discover new opportunities and foster collaborations to grow your business.
        </p>
      </header>
      
      <div className="mb-12 md:mb-16">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="search"
            id="search-partner"
            name="search-partner"
            placeholder="Search partners, vendors, keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 px-4 pl-12 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-hegra-turquoise focus:border-hegra-turquoise transition-colors bg-white"
            aria-label="Search partners or vendors"
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
              aria-controls="business-filters-content"
            >
              {isFilterVisible ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          
          {isFilterVisible && (
            <div id="business-filters-content" className="space-y-6">
              {/* Sector Filter */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Sector Industri</h3>
                <ul className="space-y-1 max-h-60 overflow-y-auto">
                  {industrialSectors.map(sector => (
                    <li key={sector}>
                      <label className="flex items-center space-x-2 text-gray-700 hover:text-hegra-turquoise cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedSectors.includes(sector)}
                          onChange={() => handleSectorChange(sector)}
                          className="form-checkbox h-4 w-4 text-hegra-turquoise rounded border-gray-300 focus:ring-hegra-turquoise/50 bg-white"
                        />
                        <span className="text-sm">{sector}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Location Filter */}
              <div>
                <label htmlFor="filter-location" className="block text-lg font-medium text-gray-800 mb-2">Lokasi</label>
                <div className="relative">
                    <input
                        type="text"
                        id="filter-location"
                        name="filter-location"
                        placeholder="Kota atau Provinsi"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="w-full py-2.5 px-4 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-hegra-turquoise focus:border-hegra-turquoise transition-colors text-sm bg-white"
                        aria-label="Filter berdasarkan lokasi"
                    />
                    <LocationIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              {/* Budget Filter */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Rentang Budget</h3>
                <div className="space-y-2">
                  <div>
                    <label htmlFor="min-budget" className="sr-only">Min Budget</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        id="min-budget"
                        value={minBudget}
                        onChange={(e) => setMinBudget(e.target.value)}
                        className="w-full p-2 pl-9 border border-gray-300 rounded-md focus:ring-hegra-turquoise focus:border-hegra-turquoise text-sm bg-white"
                        placeholder="Min Budget (Rp)"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="max-budget" className="sr-only">Max Budget</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="number"
                            id="max-budget"
                            value={maxBudget}
                            onChange={(e) => setMaxBudget(e.target.value)}
                            className="w-full p-2 pl-9 border border-gray-300 rounded-md focus:ring-hegra-turquoise focus:border-hegra-turquoise text-sm bg-white"
                            placeholder="Max Budget (Rp)"
                        />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </aside>

        <main className="w-full md:w-3/4 lg:w-4/5">
          <section aria-labelledby="partner-list-heading">
            <h2 id="partner-list-heading" className="sr-only">Daftar Partner dan Vendor</h2>
            {currentVendors.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {currentVendors.map(vendor => (
                  <BusinessMatchingCard key={vendor.id} {...vendor} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">Belum ada peluang business matching yang tersedia.</p>
              </div>
            )}
          </section>

          {totalPages > 1 && (
            <nav aria-label="Paginasi partner" className="mt-12 flex justify-center">
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

export default BusinessMatchingPage;