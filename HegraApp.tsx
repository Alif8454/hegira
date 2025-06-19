/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import EventPage from './pages/EventPage';
// import BusinessMatchingPage from './pages/BusinessMatchingPage'; // Removed
import HelpPage from './pages/HelpPage';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EventDetailPage from './pages/EventDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentLoadingPage from './pages/PaymentLoadingPage'; // New
import TransactionSuccessPage from './pages/TransactionSuccessPage'; // New
import TicketDisplayPage from './pages/TicketDisplayPage'; // New
import ConfirmationModal from './components/ConfirmationModal'; // New
import FloatingHelpButton from './components/FloatingHelpButton'; // New
import Home from './Home';


// Define core data types here or import from a types file
export interface TicketCategory {
  id: string;
  name: string;
  price: number;
  description?: string;
  maxQuantity?: number; // Max available for this category
  availabilityStatus?: 'sold-out' | 'almost-sold' | 'available'; // New prop
}

export interface EventData {
  id: number;
  category: 'B2C' | 'B2B' | 'B2G';
  name:string;
  location: string;
  posterUrl?: string;
  summary?: string;
  googleMapsQuery?: string;
  dateDisplay: string; // e.g., "Sabtu, 17 Agustus 2024" or "17 Agustus 2024"
  timeDisplay: string; // e.g., "19:00 WIB" or "09:00 - Selesai"
  parkingAvailable?: boolean;
  ageRestriction?: string;
  arrivalInfo?: string;
  fullDescription: string;
  ticketCategories: TicketCategory[];
  // For EventCard display
  displayPrice: string; // e.g., "Rp 250.000" or "Mulai dari Rp 150.000"
  discountedPrice?: string; // For EventCard
  quotaProgress?: number; // For EventCard
  organizerName?: string; // Added optional organizer name
  organizerLogoUrl?: string; // Added optional organizer logo URL
}

export interface SelectedTicket {
  categoryId: string;
  categoryName: string;
  quantity: number;
  pricePerTicket: number;
}

export interface CheckoutInfo {
  event: EventData;
  selectedTickets: SelectedTicket[];
  totalPrice: number; // This will be the original total price before any coupon
}

export interface TransactionFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  gender?: string;
  dateOfBirth?: string;
  additionalTicketHolders?: Array<{
    fullName: string;
    whatsAppNumber: string;
  }>;
  // couponCode?: string; // Coupon code is handled locally in CheckoutPage, not directly part of TransactionFormData sent to backend/next step if not needed by backend explicitly
}

export interface TransactionData {
  checkoutInfo: CheckoutInfo; // This CheckoutInfo will contain the final price after discount
  formData: TransactionFormData;
  transactionId: string;
  orderId: string;
}


export type PageName = 'landing' | 'events' | 'help' | 'dashboard' | 'eventDetail' | 'checkout' | 'paymentLoading' | 'transactionSuccess' | 'ticketDisplay' | 'home'; // Removed 'business'
export type UserRole = 'visitor' | 'creator' | null;

interface PendingNavigationTarget {
  page: PageName;
  data?: any;
  resetCallback?: () => void;
}

export function formatEventTime(timeDisplay: string): string {
  if (!timeDisplay || typeof timeDisplay !== 'string') return 'Informasi waktu tidak tersedia';

  const originalTimeDisplay = timeDisplay;

  let processedTimeDisplay = timeDisplay.replace(/^Mulai\s+/i, '').trim();

  const timezoneRegex = /\b(WIB|WITA|WIT)\b/i;
  let timezone = '';
  const tzMatch = processedTimeDisplay.match(timezoneRegex);
  if (tzMatch) {
    timezone = ` ${tzMatch[0].toUpperCase()}`;
    processedTimeDisplay = processedTimeDisplay.replace(timezoneRegex, '').trim();
  }

  const extraInfoRegex = /\s*\(([^)]+)\)\s*$/;
  let extraInfo = '';
  const extraMatch = processedTimeDisplay.match(extraInfoRegex);
  if (extraMatch) {
    extraInfo = ` (${extraMatch[1].trim()})`;
    processedTimeDisplay = processedTimeDisplay.replace(extraInfoRegex, '').trim();
  }
  
  const timePattern = /(\d{1,2}:\d{2})/;

  if (processedTimeDisplay.includes(' - ')) {
    const parts = processedTimeDisplay.split(/\s+-\s+/);
    const startTimeMatch = parts[0].match(timePattern);
    
    if (startTimeMatch) {
      const startTime = startTimeMatch[0];
      let endTimeStr = parts[1].trim();

      if (endTimeStr.match(timePattern)) {
        return `${startTime} - ${endTimeStr}${timezone}${extraInfo}`;
      } else if (endTimeStr.toLowerCase() === 'selesai') {
        return `${startTime} - Selesai${timezone}${extraInfo}`;
      } else {
        return `${startTime} - Selesai${timezone}${extraInfo}`;
      }
    }
  }
  else {
    const singleTimeMatch = processedTimeDisplay.match(timePattern);
    if (singleTimeMatch && processedTimeDisplay.trim() === singleTimeMatch[0]) {
      return `${singleTimeMatch[0]} - Selesai${timezone}${extraInfo}`;
    }
  }

  return originalTimeDisplay;
}

const HegraApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageName>('landing');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);

  const [selectedEventForDetail, setSelectedEventForDetail] = useState<EventData | null>(null);
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfo | null>(null);
  
  const [showBackConfirmationModal, setShowBackConfirmationModal] = useState(false);
  const [pendingNavigationTarget, setPendingNavigationTarget] = useState<PendingNavigationTarget | null>(null);
  const [currentTransactionData, setCurrentTransactionData] = useState<TransactionData | null>(null);


  const handleNavigate = useCallback((page: PageName, data?: any) => {
    const nonTransactionPages: PageName[] = ['landing', 'events', 'help', 'dashboard', 'home', 'eventDetail']; // Removed 'business'
    if (nonTransactionPages.includes(page)) {
        setCurrentTransactionData(null); 
    }
    
    if (['landing', 'events', 'help', 'dashboard', 'home'].includes(page)) { // Removed 'business'
        setSelectedEventForDetail(null);
        setCheckoutInfo(null);
    }

    if (page === 'eventDetail') {
      setSelectedEventForDetail(data as EventData);
      setCheckoutInfo(null); 
    } else if (page === 'checkout') {
      setCheckoutInfo(data as CheckoutInfo);
    } else if (page === 'paymentLoading') {
      const { checkoutData, formData } = data as { checkoutData: CheckoutInfo, formData: TransactionFormData };
      setCurrentTransactionData({
        checkoutInfo: checkoutData,
        formData: formData,
        transactionId: `HEGRA-TRX-${Date.now()}`,
        orderId: `ORD-${Date.now().toString().slice(-6)}`
      });
    } else if (page === 'ticketDisplay') {
        if (data) {
            setCurrentTransactionData(data as TransactionData);
        }
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setCurrentPage, setSelectedEventForDetail, setCheckoutInfo, setCurrentTransactionData]); 

  const requestNavigationWithConfirmation = useCallback((targetPage: PageName, targetData?: any, resetTicketSelectionCallback?: () => void) => {
    setPendingNavigationTarget({ page: targetPage, data: targetData, resetCallback: resetTicketSelectionCallback });
    setShowBackConfirmationModal(true);
  }, [setPendingNavigationTarget, setShowBackConfirmationModal]);

  const confirmAndProceedNavigation = useCallback(() => {
    if (pendingNavigationTarget) {
      if (pendingNavigationTarget.resetCallback) {
        pendingNavigationTarget.resetCallback();
      }
      handleNavigate(pendingNavigationTarget.page, pendingNavigationTarget.data);
    }
    setShowBackConfirmationModal(false);
    setPendingNavigationTarget(null);
  }, [pendingNavigationTarget, handleNavigate, setShowBackConfirmationModal, setPendingNavigationTarget]);

  const cancelNavigationConfirmation = useCallback(() => {
    setShowBackConfirmationModal(false);
    setPendingNavigationTarget(null);
  }, [setShowBackConfirmationModal, setPendingNavigationTarget]);


  const handleLoginSuccess = (role: UserRole) => {
    if (role) {
      setIsLoggedIn(true);
      setUserRole(role);
      setShowLoginModal(false);
      handleNavigate('dashboard');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setShowLoginModal(false);
    setSelectedEventForDetail(null);
    setCheckoutInfo(null);
    setCurrentTransactionData(null);
    handleNavigate('landing');
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            // entry.target.classList.remove('is-visible');
          }
        });
      },
      {
        threshold: 0.1, 
      }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [currentPage]);


  let pageComponent;
  if (isLoggedIn && currentPage === 'dashboard') {
    pageComponent = <DashboardPage userRole={userRole as NonNullable<UserRole>} onNavigate={handleNavigate} />;
  } else if (currentPage === 'eventDetail' && selectedEventForDetail) {
    pageComponent = <EventDetailPage event={selectedEventForDetail} onNavigate={handleNavigate} onNavigateRequestWithConfirmation={requestNavigationWithConfirmation} />;
  } else if (currentPage === 'checkout' && checkoutInfo) {
    pageComponent = <CheckoutPage checkoutInfo={checkoutInfo} eventForBackNav={checkoutInfo.event} onNavigate={handleNavigate} />;
  } else if (currentPage === 'paymentLoading' && currentTransactionData) {
    pageComponent = <PaymentLoadingPage 
                        onNavigate={handleNavigate} 
                        onNavigateRequestWithConfirmation={requestNavigationWithConfirmation}
                        checkoutInfoToReturnTo={currentTransactionData.checkoutInfo}
                      />;
  } else if (currentPage === 'transactionSuccess' && currentTransactionData) {
    pageComponent = <TransactionSuccessPage transactionData={currentTransactionData} onNavigate={handleNavigate} />;
  } else if (currentPage === 'ticketDisplay' && currentTransactionData) {
    pageComponent = <TicketDisplayPage transactionData={currentTransactionData} onNavigate={handleNavigate} />;
  }
  else {
    switch (currentPage) {
      case 'events':
        pageComponent = <EventPage onNavigate={handleNavigate} />;
        break;
      // case 'business':  // Removed
      //   pageComponent = <BusinessMatchingPage onNavigate={handleNavigate} />;
      //   break;
      case 'help':
        pageComponent = <HelpPage />;
        break;
      case 'home': 
        pageComponent = <Home onNavigate={handleNavigate}/>;
        break;
      case 'landing':
      default:
        pageComponent = <LandingPage onNavigate={handleNavigate} onOpenLoginModal={openLoginModal} />;
        break;
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-hegra-light-bg">
      <Navbar 
        onNavigate={handleNavigate} 
        currentPage={currentPage} 
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onOpenLoginModal={openLoginModal}
      />
      <main className="flex-grow w-full pt-20">
        {pageComponent}
      </main>
      <Footer onNavigate={handleNavigate} />
      {showLoginModal && !isLoggedIn && (
        <LoginPage 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
          onLoginSuccess={handleLoginSuccess} 
        />
      )}
      {showBackConfirmationModal && pendingNavigationTarget && (
        <ConfirmationModal
          isOpen={showBackConfirmationModal}
          title={pendingNavigationTarget.page === 'checkout' ? "Batalkan Pembayaran?" : "Konfirmasi Navigasi"}
          message={
            pendingNavigationTarget.page === 'checkout' 
            ? "Apakah Anda yakin ingin membatalkan pembayaran dan kembali ke halaman data pemesan? Pesanan Anda belum selesai dan data formulir mungkin perlu diisi ulang."
            : "Apakah Anda yakin ingin kembali? Pilihan tiket Anda saat ini akan direset. Data formulir yang sudah Anda isi juga akan hilang jika Anda berada di halaman checkout."
          }
          confirmText="Ya, Lanjutkan"
          cancelText="Batal"
          onConfirm={confirmAndProceedNavigation}
          onCancel={cancelNavigationConfirmation}
          confirmButtonClass={pendingNavigationTarget.page === 'checkout' ? "bg-hegra-yellow hover:bg-opacity-90 text-hegra-navy" : "bg-red-600 hover:bg-red-700 text-white"}
        />
      )}
      <FloatingHelpButton onNavigate={handleNavigate} />
    </div>
  );
};

export default HegraApp;