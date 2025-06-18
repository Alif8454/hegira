/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Star, Briefcase, MapPin, DollarSign, Send, Zap } from 'lucide-react';

interface BusinessMatchingCardProps {
  id: number;
  name: string;
  logoUrl?: string;
  matchScore: number; // Keep prop for data structure consistency, even if not displayed
  sector: string;
  location: string;
  budget: string;
}

const BusinessMatchingCard: React.FC<BusinessMatchingCardProps> = ({
  name,
  logoUrl = 'https://via.placeholder.com/150/F0F3F7/8D94A8?text=Logo', // Neutral placeholder
  matchScore, // Prop remains, but not used in rendering
  sector,
  location,
  budget
}) => {
  // renderStars function is removed as rating is hidden

  return (
    <div className="bg-hegra-card-bg rounded-xl border border-hegra-navy/10 overflow-hidden transition-all duration-300 group flex flex-col md:flex-row h-full">
      <div className="md:w-1/3 flex-shrink-0 p-4 bg-gray-50 group-hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center">
        <img 
          src={logoUrl} 
          alt={`Logo ${name}`} 
          className="w-32 h-32 md:w-40 md:h-40 object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=Error')}
        />
      </div>
      <div className="p-6 flex flex-col flex-grow md:w-2/3">
        <div className="flex justify-between items-start mb-3"> {/* Chip removed, this div now only holds the h3 */}
          <h3 className="text-xl font-bold text-hegra-deep-navy group-hover:text-hegra-gradient-start transition-colors">{name}</h3>
          {/* Sector chip removed from here */}
        </div>
        {/* Rating section is removed */}
        
        <div className="space-y-2.5 text-sm text-gray-600 mb-5 flex-grow">
          <div className="flex items-center">
            <Briefcase size={16} className="mr-2.5 text-hegra-turquoise flex-shrink-0" />
            <span>Sektor Bisnis: <strong className="text-hegra-deep-navy">{sector}</strong></span>
          </div>
          <div className="flex items-center">
            <MapPin size={16} className="mr-2.5 text-hegra-turquoise flex-shrink-0" />
            <span>Lokasi Utama: <strong className="text-hegra-deep-navy">{location}</strong></span>
          </div>
          <div className="flex items-center">
            <DollarSign size={16} className="mr-2.5 text-hegra-turquoise flex-shrink-0" />
            <span>Estimasi Budget: <strong className="text-hegra-deep-navy">{budget}</strong></span>
          </div>
        </div>

        <button 
          className="mt-auto w-full md:w-auto self-start bg-gradient-to-r from-hegra-turquoise to-hegra-turquoise/80 text-white font-semibold 
                     py-3 px-6 rounded-lg transition-all duration-300
                     flex items-center justify-center group/button
                     hover:bg-gradient-to-r hover:from-hegra-turquoise/30 hover:to-hegra-turquoise/40 hover:text-hegra-turquoise"
          aria-label={`Ajukan meeting dengan ${name}`}
        >
          <Send size={18} className="mr-2 transition-transform duration-300 group-hover/button:translate-x-1" />
          Ajukan Meeting
        </button>
      </div>
    </div>
  );
};

export default BusinessMatchingCard;