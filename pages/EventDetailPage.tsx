/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { EventData, PageName, SelectedTicket, TicketCategory, CheckoutInfo, formatEventTime } from '../HegraApp';
import Breadcrumbs from '../components/Breadcrumbs'; // New
import { Share2, Link as LinkIcon, MapPin, CalendarDays, Clock, Users, ParkingCircle, Info, Ticket, ShoppingCart, Minus, Plus, Instagram, Facebook, Twitter, Linkedin, MessageCircle as WhatsAppIcon, ChevronDown, ChevronUp } from 'lucide-react';

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

interface TicketCategoryCardProps {
  category: TicketCategory;
  quantity: number;
  onQuantityChange: (categoryId: string, newQuantity: number) => void;
  eventDateDisplay: string;
  eventTimeDisplay: string;
}

const TicketCategoryCard: React.FC<TicketCategoryCardProps> = ({ category, quantity, onQuantityChange, eventDateDisplay, eventTimeDisplay }) => {
  const increment = () => onQuantityChange(category.id, quantity + 1);
  const decrement = () => onQuantityChange(category.id, Math.max(0, quantity - 1));

  const statusStyles = {
    'available': { text: 'Tersedia', chip: 'bg-green-100 text-green-700' },
    'almost-sold': { text: 'Hampir Habis', chip: 'bg-yellow-100 text-yellow-700' },
    'sold-out': { text: 'Habis Terjual', chip: 'bg-red-100 text-red-700' },
  };

  const currentStatus = category.availabilityStatus ? statusStyles[category.availabilityStatus] : null;

  return (
    <div 
      className={`bg-white p-4 rounded-lg border transition-all duration-300 ${
        quantity > 0 ? 'border-hegra-turquoise/40' : 'border-hegra-navy/10'
      } flex flex-col justify-between min-h-[160px]`} // Added min-h and flex for layout
    >
      <div>
        <div className="flex justify-between items-start mb-4"> {/* Gap: Title to Date/Time = 16px (was mb-6) */}
          <h4 className="text-lg font-semibold text-hegra-navy">{category.name}</h4>
          {currentStatus && (
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${currentStatus.chip}`}>
              {currentStatus.text}
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap items-center text-xs text-gray-500 mb-2 gap-x-4 sm:gap-x-6 gap-y-1"> {/* Gap: Date/Time to Description = 8px (was mb-3) */}
          <div className="flex items-center">
            <CalendarDays size={14} className="mr-1.5 text-hegra-turquoise flex-shrink-0" />
            <span>{eventDateDisplay}</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1.5 text-hegra-turquoise flex-shrink-0" />
            <span>{formatEventTime(eventTimeDisplay)}</span>
          </div>
        </div>
        
        {category.description && (
          <p className="text-xs text-gray-500 mb-4 truncate" title={category.description}> {/* Gap: Description to Price/Counter = 16px (was mb-6) */}
            {category.description}
          </p>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-2"> {/* Ensure this section is at the bottom */}
        <p className="text-2xl font-bold text-hegra-turquoise">{formatCurrency(category.price)}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={decrement}
            disabled={quantity === 0 || category.availabilityStatus === 'sold-out'}
            className="p-1.5 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label={`Kurangi jumlah tiket ${category.name}`}
          >
            <Minus size={16} />
          </button>
          <span className="text-lg font-medium w-8 text-center" aria-live="polite">{quantity}</span>
          <button
            onClick={increment}
            disabled={category.availabilityStatus === 'sold-out'}
            className="p-1.5 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label={`Tambah jumlah tiket ${category.name}`}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};


interface EventDetailPageProps {
  event: EventData;
  onNavigate: (page: PageName, data?: any) => void;
  onNavigateRequestWithConfirmation: (targetPage: PageName, targetData?: any, resetCallback?: () => void) => void;
}

const EventDetailPage: React.FC<EventDetailPageProps> = ({ event, onNavigate, onNavigateRequestWithConfirmation }) => {
  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({}); // { categoryId: quantity }
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);


  // Reset selected tickets if event changes
  useEffect(() => {
    setSelectedTickets({});
    setIsDescriptionExpanded(false); // Reset description expansion state as well
  }, [event.id]);

  const handleQuantityChange = (categoryId: string, newQuantity: number) => {
    const category = event.ticketCategories.find(cat => cat.id === categoryId);
    if (category?.availabilityStatus === 'sold-out' && newQuantity > 0) {
      return; // Prevent increasing quantity if sold out
    }
    setSelectedTickets(prev => ({ ...prev, [categoryId]: newQuantity }));
  };

  const currentEventUrl = `${window.location.origin}/event/${event.id}`; // More specific URL

  const shareActions = {
    copyLink: () => navigator.clipboard.writeText(currentEventUrl).then(() => alert('Link event disalin!')),
    whatsapp: () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(event.name + ' - ' + currentEventUrl)}`, '_blank'),
    facebook: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentEventUrl)}`, '_blank'),
    twitter: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentEventUrl)}&text=${encodeURIComponent(event.name)}`, '_blank'),
    linkedin: () => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentEventUrl)}&title=${encodeURIComponent(event.name)}&summary=${encodeURIComponent(event.summary || '')}`, '_blank'),
    instagram: () => alert('Bagikan di Instagram melalui aplikasi mobile Anda! Salin link dan buka Instagram.'), // Simplified
  };


  const totalSelectedQuantity = useMemo(() => {
    return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
  }, [selectedTickets]);

  const totalPrice = useMemo(() => {
    return event.ticketCategories.reduce((total, category) => {
      const quantity = selectedTickets[category.id] || 0;
      return total + (quantity * category.price);
    }, 0);
  }, [selectedTickets, event.ticketCategories]);

  const handlePrimaryAction = () => {
    if (totalSelectedQuantity > 0) {
      const ticketsToCheckout: SelectedTicket[] = event.ticketCategories
        .filter(cat => (selectedTickets[cat.id] || 0) > 0)
        .map(cat => ({
          categoryId: cat.id,
          categoryName: cat.name,
          quantity: selectedTickets[cat.id],
          pricePerTicket: cat.price,
        }));

      const checkoutData: CheckoutInfo = {
        event,
        selectedTickets: ticketsToCheckout,
        totalPrice,
      };
      onNavigate('checkout', checkoutData);
    } else {
      // Scroll to ticket section
      const ticketSection = document.getElementById('ticket-section');
      if (ticketSection) {
        ticketSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  const heroImageStyle: React.CSSProperties = event.posterUrl ? {
    backgroundImage: `url(${event.posterUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    paddingTop: `${(6 / 16) * 100}%`, // Aspect ratio 16:6
  } : {};

  const handleBreadcrumbNavigate = useCallback((targetPage: PageName) => {
    if (totalSelectedQuantity > 0) {
      // Pass a callback to reset local state if navigation is confirmed
      onNavigateRequestWithConfirmation(targetPage, undefined, () => setSelectedTickets({}));
    } else {
      onNavigate(targetPage);
    }
  }, [totalSelectedQuantity, onNavigate, onNavigateRequestWithConfirmation]);

  const buttonText = totalSelectedQuantity > 0 ? 'Pesan Sekarang' : 'Pilih Tiket';
  const buttonIcon = <ShoppingCart size={totalSelectedQuantity > 0 ? 20 : 18} />;


  return (
    <div className="bg-gray-50 pb-28 lg:pb-0"> {/* Added bottom padding for mobile sticky bar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
         <Breadcrumbs eventName={event.name} onNavigate={handleBreadcrumbNavigate} />
      </div>
      {/* Hero Banner */}
      <div 
        className={`w-full bg-gray-300 relative ${!event.posterUrl && 'h-48 md:h-64 lg:h-80'}`}
        style={heroImageStyle}
        role="img"
        aria-label={`Poster event ${event.name}`}
      >
        {!event.posterUrl && <div className="absolute inset-0 flex items-center justify-center text-gray-500">Poster Event</div>}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Main Content Area */}
          <div className="lg:w-2/3">
            {/* Island Card for Core Info */}
            <section aria-labelledby="event-main-info" className="bg-white p-6 rounded-xl border border-hegra-navy/10 mb-8 -mt-16 lg:-mt-24 relative z-10">
              <h1 id="event-main-info" className="text-3xl md:text-4xl font-bold text-hegra-navy mb-3">{event.name}</h1>
              {event.summary && <p className="text-gray-700 mb-6 text-lg">{event.summary}</p>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6 text-sm">
                <div className="flex items-start">
                  <CalendarDays size={20} className="text-hegra-turquoise mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="block text-hegra-navy">Tanggal & Waktu</strong>
                    <span>{event.dateDisplay}</span>
                    <span className="block text-gray-600 text-sm mt-0.5">{formatEventTime(event.timeDisplay)}</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin size={20} className="text-hegra-turquoise mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="block text-hegra-navy">Lokasi</strong>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.googleMapsQuery || event.location)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline text-hegra-turquoise"
                    >
                      {event.location}
                    </a>
                  </div>
                </div>
                {event.parkingAvailable !== undefined && (
                  <div className="flex items-start">
                    <ParkingCircle size={20} className="text-hegra-turquoise mr-3 mt-0.5 flex-shrink-0" />
                    <div><strong className="text-hegra-navy">Parkir:</strong> {event.parkingAvailable ? 'Tersedia' : 'Terbatas/Tidak Tersedia'}</div>
                  </div>
                )}
                {event.ageRestriction && (
                  <div className="flex items-start">
                    <Users size={20} className="text-hegra-turquoise mr-3 mt-0.5 flex-shrink-0" />
                    <div><strong className="text-hegra-navy">Batasan Usia:</strong> {event.ageRestriction}</div>
                  </div>
                )}
                {event.arrivalInfo && (
                  <div className="flex items-start md:col-span-2">
                    <Clock size={20} className="text-hegra-turquoise mr-3 mt-0.5 flex-shrink-0" />
                    <div><strong className="text-hegra-navy">Info Kedatangan:</strong> {event.arrivalInfo}</div>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  className="flex items-center gap-2 text-hegra-turquoise hover:text-hegra-navy font-semibold py-2 px-4 border border-hegra-turquoise rounded-lg transition-colors"
                  aria-expanded={showShareOptions}
                  aria-controls="share-options-menu"
                >
                  <Share2 size={18} /> Bagikan Event
                </button>
                {showShareOptions && (
                  <div id="share-options-menu" className="absolute left-0 mt-2 w-56 bg-white border rounded-md shadow-lg z-20 p-2 space-y-1">
                    <button onClick={shareActions.copyLink} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
                      <LinkIcon size={16} /> Salin Link
                    </button>
                    <button onClick={shareActions.whatsapp} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
                       <WhatsAppIcon size={16}/> WhatsApp
                    </button>
                     <button onClick={shareActions.facebook} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
                       <Facebook size={16}/> Facebook
                    </button>
                    <button onClick={shareActions.twitter} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
                       <Twitter size={16}/> Twitter
                    </button>
                    <button onClick={shareActions.linkedin} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
                       <Linkedin size={16}/> LinkedIn
                    </button>
                     <button onClick={shareActions.instagram} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
                       <Instagram size={16}/> Instagram
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Full Event Description */}
            <section aria-labelledby="event-description-heading" className="bg-white p-6 rounded-xl border border-hegra-navy/10 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 id="event-description-heading" className="text-2xl font-semibold text-hegra-navy">Deskripsi Event</h2>
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="flex items-center text-sm text-hegra-turquoise hover:text-hegra-navy font-semibold transition-colors"
                  aria-expanded={isDescriptionExpanded}
                >
                  {isDescriptionExpanded ? 'Sembunyikan' : 'Selengkapnya'}
                  {isDescriptionExpanded ? <ChevronUp size={18} className="ml-1" /> : <ChevronDown size={18} className="ml-1" />}
                </button>
              </div>
              <div 
                className={`prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-700 ${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}
                dangerouslySetInnerHTML={{ __html: event.fullDescription || '<p>Informasi detail mengenai event ini akan segera tersedia.</p>' }} 
              />
            </section>

            {/* Ticket Section */}
            <section id="ticket-section" aria-labelledby="ticket-options-heading" className="bg-white p-6 rounded-xl border border-hegra-navy/10">
              <div className="flex items-center gap-3 mb-6">
                <Ticket size={28} className="text-hegra-turquoise" />
                <h2 id="ticket-options-heading" className="text-2xl font-semibold text-hegra-navy">Pilih Tiket Anda</h2>
              </div>
              {event.ticketCategories && event.ticketCategories.length > 0 ? (
                <div className="space-y-4">
                  {event.ticketCategories.map(category => (
                    <TicketCategoryCard 
                      key={category.id}
                      category={category}
                      quantity={selectedTickets[category.id] || 0}
                      onQuantityChange={handleQuantityChange}
                      eventDateDisplay={event.dateDisplay}
                      eventTimeDisplay={event.timeDisplay}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Tiket untuk event ini belum tersedia atau informasi tiket akan diumumkan kemudian.</p>
              )}
            </section>
          </div>

          {/* Floating/Sticky Booking Card Area (Right Side on LG+) - DESKTOP */}
          <div className="hidden lg:block lg:w-1/3 mt-8 lg:mt-0">
            <div className="sticky top-24 bg-white p-6 rounded-xl border border-hegra-navy/10">
              <h3 className="text-xl font-semibold text-hegra-navy mb-4">Ringkasan Pesanan</h3>
              {totalSelectedQuantity > 0 ? (
                <div className="space-y-2 mb-4 text-sm">
                  {event.ticketCategories.map(cat => {
                    const qty = selectedTickets[cat.id] || 0;
                    if (qty === 0) return null;
                    return (
                      <div key={cat.id} className="flex justify-between items-center">
                        <span className="text-gray-700">{cat.name} (x{qty})</span>
                        <span className="font-medium text-gray-800">{formatCurrency(qty * cat.price)}</span>
                      </div>
                    );
                  })}
                  <div className="border-t pt-2 mt-2 flex justify-between items-center">
                    <span className="text-base font-semibold text-hegra-navy">Total</span>
                    <span className="text-xl font-bold text-hegra-yellow">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm mb-4">Pilih jenis dan jumlah tiket yang ingin Anda beli dari daftar di sebelah kiri.</p>
              )}

              <button 
                onClick={handlePrimaryAction}
                className="w-full bg-hegra-yellow text-hegra-navy font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                disabled={totalSelectedQuantity > 0 && event.ticketCategories.some(cat => cat.availabilityStatus === 'sold-out' && (selectedTickets[cat.id] || 0) > 0)}
              >
                {buttonIcon}
                {buttonText}
              </button>
               {event.ticketCategories.some(cat => cat.availabilityStatus === 'sold-out' && (selectedTickets[cat.id] || 0) > 0) && (
                <p className="text-xs text-red-600 mt-2 text-center">Beberapa tiket yang dipilih sudah habis.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white p-4 border-t border-gray-200 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Total Pesanan</p>
            <p className="text-xl font-bold text-hegra-yellow">{formatCurrency(totalPrice)}</p>
          </div>
          <button
            onClick={handlePrimaryAction}
            className="bg-hegra-yellow text-hegra-navy font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 text-sm"
             disabled={totalSelectedQuantity > 0 && event.ticketCategories.some(cat => cat.availabilityStatus === 'sold-out' && (selectedTickets[cat.id] || 0) > 0)}
          >
            {buttonIcon}
            {buttonText}
          </button>
        </div>
         {event.ticketCategories.some(cat => cat.availabilityStatus === 'sold-out' && (selectedTickets[cat.id] || 0) > 0) && (
            <p className="text-xs text-red-600 mt-1 text-center">Beberapa tiket yang dipilih sudah habis.</p>
        )}
      </div>
    </div>
  );
};

export default EventDetailPage;