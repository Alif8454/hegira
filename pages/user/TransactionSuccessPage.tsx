
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { TransactionData, PageName, formatEventTime } from '../../HegraApp';
import { CheckCircle, QrCode, Mail, MessageCircle as WhatsAppIcon, Phone, CalendarDays, MapPin, User, Info, Download, Home as HomeIcon, X, Ticket, Eye, Clock } from 'lucide-react';

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

interface TransactionSuccessPageProps {
  transactionData: TransactionData;
  onNavigate: (page: PageName, data?: any) => void;
}

const TransactionSuccessPage: React.FC<TransactionSuccessPageProps> = ({ transactionData, onNavigate }) => {
  const { checkoutInfo, formData, transactionId, orderId } = transactionData;
  const { event, selectedTickets, totalPrice } = checkoutInfo;

  const [showSuccessToast, setShowSuccessToast] = useState(true);
  const [toastOpacity, setToastOpacity] = useState(0); // For fade-in animation

  useEffect(() => {
    let hideTimer: number;
    const fadeInTimer = setTimeout(() => {
      setToastOpacity(1);
      hideTimer = window.setTimeout(() => {
        setShowSuccessToast(false);
      }, 3000); 
    }, 100); 

    return () => {
      clearTimeout(fadeInTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  const handleSendToEmail = () => alert('Fungsi "Kirim ke Email" belum diimplementasikan. Tiket akan dikirim ke: ' + formData.email);
  const handleSendToWhatsApp = () => alert('Fungsi "Kirim ke WhatsApp" belum diimplementasikan. Tiket akan dikirim ke: ' + formData.phoneNumber);
  const handleContactCreatorPhone = () => alert('Menghubungi Event Creator melalui telepon (placeholder).');
  const handleContactCreatorEmail = () => alert('Menghubungi Event Creator melalui email (placeholder).');
  const handleDownloadTicket = () => alert('Fungsi "Unduh Tiket" belum diimplementasikan. Gunakan tombol "Lihat Tiket-ku" untuk tampilan tiket.');
  
  const totalTicketsPurchased = selectedTickets.reduce((sum, ticket) => sum + ticket.quantity, 0);

  const handleViewMyTickets = () => {
    onNavigate('ticketDisplay', transactionData);
  };

  return (
    <>
      {showSuccessToast && (
        <div 
          className="fixed top-5 left-1/2 -translate-x-1/2 z-[1001] w-11/12 max-w-lg bg-green-500 text-white p-4 rounded-lg shadow-xl flex items-start transition-opacity duration-300 ease-in-out"
          style={{ opacity: toastOpacity }}
          role="alert"
          aria-live="assertive"
        >
          <CheckCircle className="h-6 w-6 text-white mr-3 mt-0.5 flex-shrink-0" />
          <div className="flex-grow">
            <p className="font-bold">Transaksi Selesai & Berhasil!</p>
            <p className="text-sm mt-0.5">
              E-tiket Anda telah diterbitkan dan dikirim ke email ({formData.email}) & WhatsApp ({formData.phoneNumber}).
            </p>
            <p className="text-sm mt-0.5">Terima kasih telah bertransaksi dengan Hegra.</p>
          </div>
          <button 
            onClick={() => {
              setToastOpacity(0); 
              setTimeout(() => setShowSuccessToast(false), 300); 
            }}
            className="ml-2 p-1 -mr-1 -mt-1 text-white hover:bg-green-600 rounded-full focus:outline-none"
            aria-label="Tutup notifikasi"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <div className="bg-gray-50 min-h-screen py-8 md:py-12 pb-48 lg:pb-12"> {/* Increased mobile bottom padding */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="lg:flex lg:gap-8">
            <div className="lg:w-2/3 bg-white p-6 md:p-8 rounded-xl border border-hegra-navy/10 mb-8 lg:mb-0">
              <h2 className="text-2xl font-semibold text-hegra-navy mb-6 border-b pb-3">Detail E-Tiket Anda</h2>

              <div className="mb-6 p-4 border border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
                <h3 className="text-lg font-medium text-hegra-navy mb-2">Pindai untuk Masuk Event</h3>
                <QrCode size={128} className="mx-auto text-hegra-navy my-4" /> 
                <p className="text-xs text-gray-500">Tunjukkan kode ini saat memasuki area event. Detail per tiket dapat dilihat di "Lihat Tiket-ku".</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6 text-sm">
                <div>
                  <strong className="block text-gray-500">Nomor Transaksi:</strong>
                  <span className="text-hegra-navy font-medium">{transactionId}</span>
                </div>
                <div>
                  <strong className="block text-gray-500">ID Pesanan:</strong>
                  <span className="text-hegra-navy font-medium">{orderId}</span>
                </div>
              </div>

              <div className="mb-6 border-t pt-4">
                <h3 className="text-lg font-semibold text-hegra-navy mb-3">Informasi Event</h3>
                <p className="text-xl font-medium text-hegra-turquoise mb-1">{event.name}</p>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <CalendarDays size={16} className="mr-2 flex-shrink-0" /> {event.dateDisplay}
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Clock size={16} className="mr-2 flex-shrink-0" /> {formatEventTime(event.timeDisplay)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={16} className="mr-2 flex-shrink-0" /> {event.location}
                </div>
              </div>

              <div className="mb-6 border-t pt-4">
                <h3 className="text-lg font-semibold text-hegra-navy mb-3">Data Pemesan</h3>
                <div className="space-y-1 text-sm">
                  <p><strong className="text-gray-500 w-24 inline-block">Nama:</strong> {formData.fullName}</p>
                  <p><strong className="text-gray-500 w-24 inline-block">Email:</strong> {formData.email}</p>
                  <p><strong className="text-gray-500 w-24 inline-block">Telepon:</strong> {formData.phoneNumber}</p>
                </div>
              </div>

              {totalTicketsPurchased > 0 && formData.additionalTicketHolders && formData.additionalTicketHolders.length > 0 && (
                <div className="mb-6 border-t pt-4">
                  <h3 className="text-lg font-semibold text-hegra-navy mb-4 flex items-center">
                    <Ticket size={20} className="mr-2 text-hegra-turquoise" />
                    Detail Pemegang Tiket ({totalTicketsPurchased} Tiket)
                  </h3>
                  <div className="space-y-4">
                    {formData.additionalTicketHolders.map((holder, index) => {
                      const ticketNumber = `TICKET-${orderId.split('-')[1]}-${String(index + 1).padStart(3, '0')}`;
                                            
                      return (
                        <div key={index} className="p-3 bg-gray-50 rounded-md border border-gray-200 text-sm">
                          <p className="font-semibold text-hegra-navy">Tiket #{index + 1}</p>
                          <p><strong className="text-gray-500 w-32 inline-block">Nomor Tiket:</strong> {ticketNumber}</p>
                          <p><strong className="text-gray-500 w-32 inline-block">Nama Pemegang:</strong> {holder.fullName}</p>
                          <p><strong className="text-gray-500 w-32 inline-block">No. WhatsApp:</strong> {holder.whatsAppNumber}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-hegra-navy mb-3 flex items-center">
                  <Info size={20} className="mr-2 text-hegra-turquoise" /> Syarat & Ketentuan Penting
                </h3>
                <ul className="list-disc list-inside text-xs text-gray-600 space-y-1 pl-2">
                  <li>E-tiket ini bersifat rahasia. Jangan bagikan kode QR atau detail tiket kepada pihak yang tidak berkepentingan.</li>
                  <li>Satu tiket berlaku untuk satu orang, kecuali tertera lain.</li>
                  <li>Pemegang tiket dianggap telah menyetujui seluruh syarat dan ketentuan yang ditetapkan oleh penyelenggara event.</li>
                  <li>Dilarang membawa senjata tajam, minuman keras, dan obat-obatan terlarang.</li>
                  <li>Penyelenggara berhak menolak masuk atau mengeluarkan pengunjung yang tidak mematuhi aturan.</li>
                </ul>
              </div>
            </div>

            <div className="hidden lg:block lg:w-1/3">
              <div className="sticky top-24 bg-white p-6 rounded-xl border border-hegra-navy/10">
                <h3 className="text-xl font-semibold text-hegra-navy mb-4">Detail Pesanan</h3>
                <div className="space-y-2 mb-4 text-sm">
                  {selectedTickets.map(ticket => (
                    <div key={ticket.categoryId} className="flex justify-between items-start p-2 bg-gray-50 rounded">
                      <div>
                          <p className="font-medium text-gray-800">{ticket.categoryName} (x{ticket.quantity})</p>
                          <p className="text-xs text-gray-500">{formatCurrency(ticket.pricePerTicket)} / tiket</p>
                      </div>
                      <p className="font-semibold text-gray-800">{formatCurrency(ticket.quantity * ticket.pricePerTicket)}</p>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 flex justify-between items-center">
                    <span className="text-base font-semibold text-hegra-navy">Total Dibayar</span>
                    <span className="text-xl font-bold text-hegra-yellow">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                   <button
                    onClick={handleViewMyTickets}
                    className="w-full flex items-center justify-center gap-2 bg-hegra-yellow text-hegra-navy font-semibold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    <Eye size={18} /> Lihat Tiket-ku
                  </button>
                   <button
                    onClick={handleDownloadTicket} // Kept for consistency, though main action is view tickets
                    className="w-full flex items-center justify-center gap-2 bg-hegra-turquoise text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-opacity-80 transition-colors"
                  >
                    <Download size={18} /> Unduh Tiket (Simulasi)
                  </button>
                  <button
                    onClick={handleSendToEmail}
                    className="w-full flex items-center justify-center gap-2 bg-hegra-navy text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-opacity-80 transition-colors"
                  >
                    <Mail size={18} /> Kirim ke Email Saya
                  </button>
                  <button
                    onClick={handleSendToWhatsApp}
                    className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <WhatsAppIcon size={18} /> Kirim ke WhatsApp Saya
                  </button>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-hegra-navy mb-2 text-center">Butuh Bantuan terkait Event?</p>
                  <p className="text-xs text-gray-500 mb-3 text-center">Hubungi langsung penyelenggara event:</p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleContactCreatorEmail}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs border border-gray-300 text-gray-700 font-medium py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Mail size={14} /> Email Creator
                    </button>
                    <button
                      onClick={handleContactCreatorPhone}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs border border-gray-300 text-gray-700 font-medium py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Phone size={14} /> Telepon Creator
                    </button>
                  </div>
                </div>
                 <button 
                  onClick={() => onNavigate('landing')}
                  className="mt-8 w-full text-center text-sm text-hegra-turquoise hover:underline"
                >
                  Kembali ke Beranda
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white p-3 border-t border-gray-200 shadow-lg space-y-2">
          <div className="flex justify-between items-center">
              <div>
                  <p className="text-xs text-gray-500">Total Dibayar</p>
                  <p className="text-lg font-bold text-hegra-yellow">{formatCurrency(totalPrice)}</p>
              </div>
              <button
                  onClick={handleViewMyTickets}
                  className="bg-hegra-yellow text-hegra-navy font-semibold py-2.5 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-1.5 text-sm"
              >
                  <Eye size={16} /> Lihat Tiket-ku
              </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={handleDownloadTicket}
                className="w-full flex items-center justify-center gap-1 bg-hegra-turquoise text-white font-medium py-2 px-2 rounded-md hover:bg-opacity-80 transition-colors"
              >
                <Download size={14} /> Unduh (Simulasi)
              </button>
              <button
                onClick={handleSendToEmail}
                className="w-full flex items-center justify-center gap-1 bg-hegra-navy text-white font-medium py-2 px-2 rounded-md hover:bg-opacity-80 transition-colors"
              >
                <Mail size={14} /> Kirim Email
              </button>
              <button
                onClick={handleSendToWhatsApp}
                className="w-full flex items-center justify-center gap-1 bg-green-500 text-white font-medium py-2 px-2 rounded-md hover:bg-green-600 transition-colors"
              >
                <WhatsAppIcon size={14} /> Kirim WhatsApp
              </button>
              <button
                onClick={() => onNavigate('landing')}
                className="w-full flex items-center justify-center gap-1 bg-gray-100 text-hegra-navy font-medium py-2 px-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                <HomeIcon size={14} /> Ke Beranda
              </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={handleContactCreatorEmail}
              className="w-full flex items-center justify-center gap-1 bg-gray-100 text-hegra-navy font-medium py-2 px-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              <Mail size={14} /> Email Creator
            </button>
            <button
              onClick={handleContactCreatorPhone}
              className="w-full flex items-center justify-center gap-1 bg-gray-100 text-hegra-navy font-medium py-2 px-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              <Phone size={14} /> Telepon Creator
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionSuccessPage;
    