/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { UserRole, PageName, EventData } from '../HegraApp';
import { Bookmark, Ticket as TicketIconLucide, BarChart2, Settings, PlusCircle, LogOut, LayoutDashboard, Edit3, Users } from 'lucide-react'; // Renamed Ticket to avoid conflict
import EventCard from '../components/EventCard';

// Sample Data (replace with actual data fetching)
const sampleSavedEvents: EventData[] = [
  { 
    id: 101, category: 'B2C', name: 'Konser Jazz Senja', location: 'Taman Kota', 
    dateDisplay: "25 Agustus 2024", timeDisplay: "18:00 WIB",
    quotaProgress: 80, displayPrice: 'Rp 150.000', posterUrl: 'https://picsum.photos/seed/dbevent1/400/300',
    summary: 'Nikmati alunan jazz merdu di bawah langit senja.',
    googleMapsQuery: 'Taman Kota XYZ', parkingAvailable: true, ageRestriction: 'Semua Umur', arrivalInfo: 'Pintu dibuka pukul 17:00.',
    fullDescription: '<p>Konser Jazz Senja mempersembahkan penampilan dari musisi jazz lokal berbakat. Suasana santai dan menenangkan, cocok untuk dinikmati bersama teman atau pasangan.</p>',
    ticketCategories: [
      { id: 'regular', name: 'Regular', price: 150000 },
    ],
    organizerName: 'Senja Nada Productions',
    organizerLogoUrl: 'https://picsum.photos/seed/orgdb1/50/50'
  },
  { 
    id: 102, category: 'B2B', name: 'Digital Marketing Workshop', location: 'Online', 
    dateDisplay: "10 September 2024", timeDisplay: "09:00 WIB",
    quotaProgress: 95, displayPrice: 'Rp 750.000', posterUrl: 'https://picsum.photos/seed/dbevent2/400/300',
    summary: 'Pelajari strategi digital marketing terkini dari para ahli.',
    googleMapsQuery: 'Online Event', parkingAvailable: false, ageRestriction: 'Profesional', arrivalInfo: 'Link akan dikirim H-1.',
    fullDescription: '<p>Tingkatkan kemampuan digital marketing Anda dengan workshop intensif ini. Materi mencakup SEO, SEM, Social Media Marketing, dan Content Marketing. Dibawakan oleh praktisi berpengalaman.</p>',
    ticketCategories: [
      { id: 'standard', name: 'Standard Access', price: 750000 },
      { id: 'premium', name: 'Premium Access + Recording', price: 950000 },
    ],
    organizerName: 'Marketer Pro Academy',
    organizerLogoUrl: 'https://picsum.photos/seed/orgdb2/50/50'
  },
];

const sampleTicketHistory = [
  { id: 201, eventName: 'Konser Musik Merdeka Vol. 2', date: '17 Agustus 2024', price: 'Rp 199.000', status: 'Confirmed', ticketCode: 'HGRA-XYZ-123' },
  { id: 202, eventName: 'Festival Kuliner Nusantara', date: '10 September 2024', price: 'Gratis', status: 'Confirmed', ticketCode: 'HGRA-ABC-789' },
];

interface DashboardPageProps {
  userRole: NonNullable<UserRole>;
  onNavigate: (page: PageName, data?: any) => void;
}

const DashboardSidebar: React.FC<{
  activeView: string;
  onSelectView: (view: string) => void;
}> = ({ activeView, onSelectView }) => {
  
  const creatorNavItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'manageEvents', label: 'Kelola Event Saya', icon: Edit3 },
    { id: 'createEvent', label: 'Buat Event Baru', icon: PlusCircle },
    { id: 'analytics', label: 'Analitik Event', icon: BarChart2 },
    { id: 'participants', label: 'Manajemen Peserta', icon: Users },
    { id: 'settings', label: 'Pengaturan Akun', icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 bg-hegra-navy text-hegra-white p-4 md:p-6 space-y-4 md:min-h-[calc(100vh-64px)] rounded-lg md:rounded-none md:shadow-none">
      <h2 className="text-xl font-semibold text-hegra-yellow mb-6 hidden md:block">Dashboard Kreator</h2>
      <nav className="space-y-2">
        {creatorNavItems.map(item => (
          <button
            key={item.id}
            onClick={() => onSelectView(item.id)}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left ${
              activeView === item.id ? 'bg-hegra-turquoise text-hegra-white' : 'hover:bg-hegra-turquoise/30'
            }`}
            aria-current={activeView === item.id ? 'page' : undefined}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="pt-4 mt-auto border-t border-hegra-white/20 hidden md:block">
        <p className="text-xs text-gray-400">© Hegra Event Creator</p>
      </div>
    </aside>
  );
};


const DashboardPage: React.FC<DashboardPageProps> = ({ userRole, onNavigate }) => {
  const [creatorView, setCreatorView] = useState('overview');

  const renderVisitorDashboard = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <header className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-hegra-navy">Dashboard Visitor</h1>
        <p className="mt-1 text-lg text-gray-600">Selamat datang kembali! Kelola event dan tiket Anda di sini.</p>
      </header>

      <section aria-labelledby="saved-events-heading" className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <Bookmark size={28} className="text-hegra-turquoise" />
          <h2 id="saved-events-heading" className="text-2xl font-semibold text-hegra-navy">Event Tersimpan Saya</h2>
        </div>
        {sampleSavedEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleSavedEvents.map(event => <EventCard key={event.id} {...event} onNavigate={onNavigate} />)}
          </div>
        ) : (
          <p className="text-gray-500 bg-gray-100 p-4 rounded-lg">Anda belum menyimpan event apapun.</p>
        )}
      </section>

      <section aria-labelledby="ticket-history-heading">
         <div className="flex items-center gap-3 mb-6">
          <TicketIconLucide size={28} className="text-hegra-turquoise" />
          <h2 id="ticket-history-heading" className="text-2xl font-semibold text-hegra-navy">Riwayat Pembelian Tiket</h2>
        </div>
        {sampleTicketHistory.length > 0 ? (
          <div className="space-y-4">
            {sampleTicketHistory.map(ticket => (
              <div key={ticket.id} className="bg-white p-4 sm:p-6 rounded-lg border border-hegra-navy/10 transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-hegra-navy">{ticket.eventName}</h3>
                  <p className="text-sm text-gray-600">Tanggal: {ticket.date} | Harga: {ticket.price}</p>
                  <p className="text-sm text-gray-500 mt-1">Kode Tiket: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-hegra-navy">{ticket.ticketCode}</span></p>
                </div>
                <div className="flex flex-col items-start sm:items-end mt-2 sm:mt-0">
                   <span className={`text-xs font-semibold px-2 py-1 rounded-full ${ticket.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {ticket.status}
                  </span>
                  <button className="mt-2 text-sm text-hegra-turquoise hover:underline">Lihat Detail Tiket</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 bg-gray-100 p-4 rounded-lg">Anda belum memiliki riwayat pembelian tiket.</p>
        )}
      </section>
    </div>
  );

  const renderCreatorDashboard = () => {
    let content;
    switch (creatorView) {
      case 'overview':
        content = (
          <div>
            <h2 className="text-2xl font-semibold text-hegra-navy mb-4">Overview Dashboard Kreator</h2>
            <p className="text-gray-700">Selamat datang di dashboard event creator Anda. Di sini Anda dapat mengelola semua aspek event Anda, mulai dari pembuatan hingga analisis pasca-event.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <div className="bg-white p-6 rounded-lg border border-hegra-navy/10">
                    <h3 className="text-lg font-semibold text-hegra-turquoise mb-2">Total Event Aktif</h3>
                    <p className="text-3xl font-bold text-hegra-navy">5</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-hegra-navy/10">
                    <h3 className="text-lg font-semibold text-hegra-turquoise mb-2">Total Peserta Terdaftar</h3>
                    <p className="text-3xl font-bold text-hegra-navy">1,230</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-hegra-navy/10">
                    <h3 className="text-lg font-semibold text-hegra-turquoise mb-2">Pendapatan Bulan Ini</h3>
                    <p className="text-3xl font-bold text-hegra-navy">Rp 15.000.000</p>
                </div>
            </div>
          </div>
        );
        break;
      case 'manageEvents':
        content = <div><h2 className="text-2xl font-semibold text-hegra-navy mb-4">Kelola Event Saya</h2><p className="text-gray-700">Daftar event yang sedang Anda kelola akan muncul di sini.</p></div>;
        break;
      case 'createEvent':
        content = <div><h2 className="text-2xl font-semibold text-hegra-navy mb-4">Buat Event Baru</h2><p className="text-gray-700">Formulir untuk membuat event baru.</p></div>;
        break;
      case 'analytics':
        content = <div><h2 className="text-2xl font-semibold text-hegra-navy mb-4">Analitik Event</h2><p className="text-gray-700">Data dan grafik analitik performa event Anda.</p></div>;
        break;
      case 'participants':
        content = <div><h2 className="text-2xl font-semibold text-hegra-navy mb-4">Manajemen Peserta</h2><p className="text-gray-700">Kelola data peserta event Anda.</p></div>;
        break;
      case 'settings':
        content = <div><h2 className="text-2xl font-semibold text-hegra-navy mb-4">Pengaturan Akun Kreator</h2><p className="text-gray-700">Pengaturan profil, notifikasi, dan lainnya.</p></div>;
        break;
      default:
        content = <div><h2 className="text-2xl font-semibold text-hegra-navy mb-4">Selamat Datang</h2><p className="text-gray-700">Pilih menu dari sidebar untuk memulai.</p></div>;
    }

    return (
      <div className="flex flex-col md:flex-row min-h-full bg-gray-50">
        <DashboardSidebar activeView={creatorView} onSelectView={setCreatorView} />
        <main className="flex-1 p-6 md:p-10 bg-gray-50">
          {content}
        </main>
      </div>
    );
  };

  return userRole === 'visitor' ? renderVisitorDashboard() : renderCreatorDashboard();
};

export default DashboardPage;