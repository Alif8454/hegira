
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { TransactionData, PageName, formatEventTime } from '../../HegraApp';
import Logo from '../../components/Logo';
import { QrCode, Download, ArrowLeft, Mail, Phone, CalendarDays, MapPin, Ticket as TicketLucide, User, Facebook, Twitter, Instagram, Linkedin, Loader2, Clock } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Helper function to format currency (if needed, though not directly used in ticket stub content)
// const formatCurrency = (amount: number) => {
//   return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
// };

interface TicketStubProps {
  ticketNumber: string;
  ticketCategory: string;
  holderName: string;
  holderWhatsApp: string;
  eventData: TransactionData['checkoutInfo']['event'];
  ordererData: TransactionData['formData'];
  orderId: string;
  className?: string; // To apply A4 and PDF selector classes
}

const TicketStub: React.FC<TicketStubProps> = ({ ticketNumber, ticketCategory, holderName, holderWhatsApp, eventData, ordererData, orderId, className = "" }) => {
  
  const currentYear = new Date().getFullYear();
  // Approximate calculation for QR size based on A4 width.
  // A4 width: 794px. Content area (794 - ~32px padding) * 40% column * ~80-90% usage.
  // Let's set a fairly large fixed size for the main QR.
  const mainQrCodeSize = 200; // pixels
  const orderQrCodeSize = 40; // pixels

  return (
    <div className={`bg-white rounded-lg border border-hegra-navy/10 mb-8 ticket-stub-container ${className}`}>
      {/* A4 Inner Container - controls overall A4 fixed size */}
      <div className="h-full flex flex-col">

        {/* 1. Greyscale Event Poster (16:6) */}
        <div className="relative w-full aspect-[16/6] bg-gray-300 overflow-hidden flex-shrink-0">
          <img 
            src={eventData.posterUrl || 'https://picsum.photos/seed/defaultposter/800/300'} 
            alt={`Poster ${eventData.name}`} 
            className="w-full h-full object-cover filter grayscale" 
            onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/eventfallback/800/300')}
          />
        </div>

        {/* Content area that takes remaining space and has internal padding */}
        <div className="flex-grow flex flex-col p-3 sm:p-4 overflow-hidden">

          {/* 2. Main Ticket Data: QR (Left) + Details (Right) */}
          <div className="flex flex-row flex-grow mb-2 sm:mb-3">
            {/* Left Column: Large QR + Ticket Holder Info */}
            <div className="w-[40%] flex flex-col items-center justify-start text-center p-1.5 sm:p-2 bg-gray-50/70 rounded-l-md border-r border-gray-200">
              <p className="text-[9px] sm:text-[10px] text-gray-600 mb-1 font-medium">Pindai untuk Masuk</p>
              <QrCode size={mainQrCodeSize} className="text-hegra-navy mb-2 sm:mb-3" aria-label={`QR Code untuk ${ticketNumber}`} />
              <p className="text-sm sm:text-base font-semibold text-hegra-navy leading-tight break-words mb-0.5">{holderName}</p>
              <p className="text-[9px] sm:text-[10px] text-gray-500 break-words mb-1">{holderWhatsApp}</p>
              <p className="text-[8px] sm:text-[9px] bg-hegra-turquoise text-white px-1.5 py-0.5 rounded-full whitespace-nowrap mb-1.5">{ticketCategory}</p>
              <p className="text-[7px] sm:text-[8px] text-gray-400 font-mono tracking-tighter break-all">{ticketNumber}</p>
            </div>

            {/* Right Column: Event Info, Orderer Info */}
            <div className="w-[60%] p-1.5 sm:p-3 space-y-2 sm:space-y-3 text-[9px] sm:text-[10px] flex flex-col">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-hegra-navy break-words leading-tight mb-1">{eventData.name}</h3>
                <div className="flex items-center text-gray-700 mt-1">
                  <CalendarDays size={12} className="mr-1.5 text-hegra-turquoise flex-shrink-0" /> <span className="break-words">{eventData.dateDisplay}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock size={12} className="mr-1.5 text-hegra-turquoise flex-shrink-0" /> <span className="break-words">{formatEventTime(eventData.timeDisplay)}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin size={12} className="mr-1.5 text-hegra-turquoise flex-shrink-0" /> <span className="break-words">{eventData.location}</span>
                </div>
                <p className="text-gray-700 mt-0.5">Penyelenggara: Hegra Events Official</p>
              </div>

              <div className="border-t border-gray-200 pt-1.5 sm:pt-2 mt-auto"> {/* Pushes orderer data down if event info is short */}
                <p className="text-[8px] sm:text-[9px] text-gray-500 uppercase font-semibold mb-0.5">Data Pemesan (Order ID: {orderId})</p>
                <div className="flex items-start gap-1.5 sm:gap-2">
                    <QrCode size={orderQrCodeSize} className="text-hegra-navy mt-0.5 flex-shrink-0" aria-label={`QR Code untuk Order ID ${orderId}`} />
                    <div className="text-gray-700">
                        <p className="break-words"><strong className="font-medium">Nama:</strong> {ordererData.fullName}</p>
                        <p className="break-words"><strong className="font-medium">Email:</strong> {ordererData.email}</p>
                        <p className="break-words"><strong className="font-medium">Telepon:</strong> {ordererData.phoneNumber}</p>
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Terms & Conditions */}
          <div className="mb-1.5 sm:mb-2 text-[7px] sm:text-[8px] leading-tight flex-shrink-0">
            <h4 className="font-semibold text-gray-700 mb-0.5">Syarat & Ketentuan:</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-0.5 columns-2 sm:columns-1">
              <li>E-tiket ini valid untuk satu orang pada tanggal dan waktu event.</li>
              <li>Tidak dapat dipindahtangankan atau diuangkan kembali.</li>
              <li>Tunjukkan e-tiket ini (digital/cetak) di pintu masuk.</li>
              <li>Penyelenggara berhak menolak masuk jika e-tiket tidak valid.</li>
              <li>Patuhi semua aturan yang berlaku di lokasi event.</li>
              <li>Dilarang membawa senjata tajam & zat berbahaya.</li>
            </ul>
          </div>

          {/* 4. Sponsor Section (Full Width Row) */}
          <div className="my-1.5 sm:my-2 py-2 sm:py-3 bg-gray-100 rounded-md text-center flex-shrink-0 border border-gray-200">
            <p className="text-[10px] sm:text-xs font-medium text-gray-500">Space Iklan Sponsor</p>
            <p className="text-[8px] sm:text-[9px] text-gray-400">(Logo sponsor akan tampil di sini)</p>
          </div>

          {/* 5. Hegra Branding & CTA (Bottom) */}
          <div className="mt-auto pt-1.5 sm:pt-2 border-t border-dashed border-gray-300 text-center text-[8px] sm:text-[9px] flex-shrink-0">
            <Logo className="h-5 sm:h-6 mx-auto mb-0.5 text-hegra-navy" />
            <p className="text-gray-600 mb-0.5">
              Rencanakan atau Temukan Event Impianmu Berikutnya di Hegra!
            </p>
            <p className="font-semibold text-hegra-turquoise mb-0.5">
              <a href="https://hegra.com" target="_blank" rel="noopener noreferrer" className="hover:underline">www.hegra.com</a>
            </p>
            <div className="flex justify-center space-x-2 my-0.5 sm:my-1">
                <a href="#" aria-label="Hegra Facebook" className="text-gray-500 hover:text-hegra-navy"><Facebook size={12}/></a>
                <a href="#" aria-label="Hegra Instagram" className="text-gray-500 hover:text-hegra-navy"><Instagram size={12}/></a>
                <a href="#" aria-label="Hegra Twitter" className="text-gray-500 hover:text-hegra-navy"><Twitter size={12}/></a>
                <a href="#" aria-label="Hegra LinkedIn" className="text-gray-500 hover:text-hegra-navy"><Linkedin size={12}/></a>
            </div>
            <p className="text-gray-400">&copy; {currentYear} PT Hegra Digital Nusantara. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TicketDisplayPageProps {
  transactionData: TransactionData;
  onNavigate: (page: PageName, data?: any) => void;
}

const TicketDisplayPage: React.FC<TicketDisplayPageProps> = ({ transactionData, onNavigate }) => {
  const { checkoutInfo, formData, orderId } = transactionData;
  const { event, selectedTickets } = checkoutInfo;
  const [isDownloading, setIsDownloading] = useState(false);

  const allTicketsData: Array<{ ticketNumber: string; categoryName: string; holderName: string; holderWhatsApp: string; }> = [];
  let ticketCounter = 0;

  selectedTickets.forEach(st => {
    for (let i = 0; i < st.quantity; i++) {
      ticketCounter++;
      const ticketNumber = `TICKET-${orderId.split('-')[1]}-${String(ticketCounter).padStart(3, '0')}`;
      let holderName = "N/A"; // Default if not found
      let holderWhatsApp = "N/A"; // Default if not found

      // formData.additionalTicketHolders is 0-indexed for all ticket holders.
      // ticketCounter is 1-indexed. So, for ticketCounter 1, we use additionalTicketHolders[0].
      if (formData.additionalTicketHolders && formData.additionalTicketHolders[ticketCounter - 1]) {
        holderName = formData.additionalTicketHolders[ticketCounter - 1].fullName;
        holderWhatsApp = formData.additionalTicketHolders[ticketCounter - 1].whatsAppNumber;
      }
      
      allTicketsData.push({
        ticketNumber,
        categoryName: st.categoryName,
        holderName,
        holderWhatsApp
      });
    }
  });

  const handleDownloadAllTickets = async () => {
    const ticketElements = document.querySelectorAll<HTMLElement>('.ticket-stub-for-pdf');
    if (ticketElements.length === 0) {
      alert('Tidak ada tiket untuk diunduh.');
      return;
    }

    setIsDownloading(true);
    const pdf = new jsPDF('p', 'mm', 'a4'); // A4, portrait, millimeters
    const a4PdfWidthMm = 210;
    const a4PdfHeightMm = 297;

    for (let i = 0; i < ticketElements.length; i++) {
      const ticketElement = ticketElements[i];
      try {
        const canvas = await html2canvas(ticketElement, {
          scale: 1.5, // Reduced scale for smaller canvas size
          useCORS: true,
          logging: false,
          width: ticketElement.offsetWidth, 
          height: ticketElement.offsetHeight, 
          scrollX: 0,
          scrollY: 0,
          windowWidth: ticketElement.scrollWidth,
          windowHeight: ticketElement.scrollHeight
        });
        // Use JPEG with quality 0.8 for smaller image size
        const imgData = canvas.toDataURL('image/jpeg', 0.8);

        if (i > 0) {
          pdf.addPage();
        }

        const canvasAspectRatio = canvas.width / canvas.height;
        let imgPdfWidth = a4PdfWidthMm;
        let imgPdfHeight = a4PdfWidthMm / canvasAspectRatio;

        if (imgPdfHeight > a4PdfHeightMm) {
          imgPdfHeight = a4PdfHeightMm;
          imgPdfWidth = a4PdfHeightMm * canvasAspectRatio;
        }
        
        const xOffset = (a4PdfWidthMm - imgPdfWidth) / 2;
        const yOffset = (a4PdfHeightMm - imgPdfHeight) / 2;
        
        // Add image as JPEG with MEDIUM compression
        pdf.addImage(imgData, 'JPEG', xOffset, yOffset, imgPdfWidth, imgPdfHeight, undefined, 'MEDIUM');

      } catch (error) {
        console.error('Error generating PDF for ticket:', error);
        alert(`Gagal membuat PDF untuk tiket ${i + 1}. Error: ${error instanceof Error ? error.message : String(error)}`);
        setIsDownloading(false);
        return;
      }
    }

    pdf.save(`Hegra-Tickets-${orderId}.pdf`);
    setIsDownloading(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 md:py-12 pb-24 lg:pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 no-print">
          <button
            onClick={() => onNavigate('transactionSuccess', transactionData)}
            className="flex items-center text-sm text-hegra-turquoise hover:text-hegra-navy font-semibold transition-colors group mb-2"
          >
            <ArrowLeft size={18} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Kembali ke Rincian Transaksi
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-hegra-navy">Tiket Anda</h1>
        </div>
        
        <p className="text-gray-600 mb-8 text-sm no-print">
          Berikut adalah e-tiket Anda untuk event <strong className="text-hegra-navy">{event.name}</strong>. 
          Anda dapat mengunduh semua tiket sekaligus. Tampilan tiket di bawah ini adalah representasi ukuran A4.
        </p>

        {allTicketsData.map((ticketData, index) => (
          <TicketStub
            key={index}
            ticketNumber={ticketData.ticketNumber}
            ticketCategory={ticketData.categoryName}
            holderName={ticketData.holderName}
            holderWhatsApp={ticketData.holderWhatsApp}
            eventData={event}
            ordererData={formData}
            orderId={orderId}
            className="ticket-stub-a4 ticket-stub-for-pdf" 
          />
        ))}

        {allTicketsData.length === 0 && (
          <p className="text-center text-gray-500 py-10">Tidak ada tiket yang ditemukan untuk transaksi ini.</p>
        )}

        {/* Desktop Download Button */}
        {allTicketsData.length > 0 && (
          <div className="hidden lg:flex justify-center mt-8 mb-4 no-print">
            <button
              onClick={handleDownloadAllTickets}
              disabled={isDownloading}
              className="bg-hegra-yellow text-hegra-navy font-semibold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 text-base shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
              aria-label="Unduh semua tiket sebagai PDF"
            >
              {isDownloading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Mengunduh...
                </>
              ) : (
                <>
                  <Download size={20} /> Unduh Semua Tiket (PDF)
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Sticky Footer Download Button */}
      {allTicketsData.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white p-4 border-t border-gray-200 shadow-lg flex justify-center no-print">
          <button
            onClick={handleDownloadAllTickets}
            disabled={isDownloading}
            className="w-full max-w-xs bg-hegra-yellow text-hegra-navy font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 text-sm shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            aria-label="Unduh semua tiket sebagai PDF"
          >
            {isDownloading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Mengunduh...
                </>
              ) : (
                <>
                  <Download size={18} /> Unduh Semua Tiket (PDF)
                </>
              )}
          </button>
        </div>
      )}
      <style>{`
        .ticket-stub-container {
          /* Base styles if any */
        }
        .ticket-stub-a4 {
          width: 794px; /* A4 width at 96 DPI */
          height: 1123px; /* A4 height at 96 DPI */
          margin-left: auto;
          margin-right: auto;
          border: 1px solid #e5e7eb; /* For visibility of A4 boundary on page */
          overflow: hidden; /* Important for html2canvas to capture content within bounds */
          box-sizing: border-box; /* Ensure padding/border are within width/height */
          /* Ensure child flex containers behave correctly for height */
          display: flex;
          flex-direction: column;
        }
        
        .ticket-stub-a4 > div:first-child { /* This targets the inner .h-full.flex.flex-col div */
            display: flex;
            flex-direction: column;
            height: 100%;
        }


        /* On smaller screens, allow horizontal scrolling if A4 width exceeds viewport */
        @media (max-width: 820px) { /* Approx 794px + some padding */
          .ticket-stub-a4 {
            /* Retains fixed A4 pixel dimensions, will cause scroll */
             /* Add a bit of scaling for better overview on mobile, if desired,
                but this makes html2canvas capture potentially tricky if not handled.
                For now, let it be full size causing scroll.
             */
          }
        }
        @media print {
          body, html {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact; /* Important for colors in PDF */
            print-color-adjust: exact;
          }
          .ticket-stub-a4 {
            width: 210mm;
            height: 297mm; /* Or slightly less to manage margins if printer adds them */
            margin: 0 auto; /* Center on page */
            border: none;
            box-shadow: none;
            page-break-after: always; /* Each ticket on a new printed page */
            overflow: visible; /* Let content flow naturally for print */
          }
          .no-print {
            display: none !important;
          }
          .filter { /* Ensure filters like grayscale are applied in print */
            filter: grayscale(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default TicketDisplayPage;
    