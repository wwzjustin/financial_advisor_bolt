import React, { useState } from 'react';
import { Search, MapPin, Home, DollarSign, Bed, Bath, Square } from 'lucide-react';

interface PropertySearchResult {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  propertyType: string;
  yearBuilt: number;
  lotSize?: number;
  imageUrl?: string;
}

interface PropertySearchProps {
  onSelectProperty: (property: PropertySearchResult) => void;
  onClose: () => void;
}

// Mock property search results for properties you might own
const mockSearchResults: PropertySearchResult[] = [
  {
    id: '1',
    address: '123 Oak Street, San Francisco, CA 94102',
    price: 850000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1200,
    propertyType: 'Single Family',
    yearBuilt: 1985,
    lotSize: 0.15,
    imageUrl: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    address: '456 Pine Avenue, San Francisco, CA 94103',
    price: 1200000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 1800,
    propertyType: 'Townhouse',
    yearBuilt: 2010,
    lotSize: 0.08,
    imageUrl: 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    address: '789 Market Street, San Francisco, CA 94104',
    price: 650000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 950,
    propertyType: 'Condo',
    yearBuilt: 2015,
    imageUrl: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '4',
    address: '321 Elm Drive, San Francisco, CA 94105',
    price: 950000,
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 1400,
    propertyType: 'Single Family',
    yearBuilt: 1995,
    lotSize: 0.12,
    imageUrl: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export default function PropertySearch({ onSelectProperty, onClose }: PropertySearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PropertySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulate API call delay
    setTimeout(() => {
      setSearchResults(mockSearchResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Search Properties You Own</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="bg-primary-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-primary-700">
              Search for properties you currently own to add them to your portfolio. 
              You'll need to provide purchase price and mortgage details in the next step.
            </p>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your property address, city, or ZIP code..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {searchResults.length === 0 && !isSearching && (
            <div className="text-center py-12">
              <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Search for your property to get started</p>
              <p className="text-sm text-gray-400 mt-2">
                We'll help you find your property and add it to your portfolio
              </p>
            </div>
          )}

          {isSearching && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Searching properties...</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {searchResults.map((property) => (
              <div
                key={property.id}
                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => onSelectProperty(property)}
              >
                {property.imageUrl && (
                  <img
                    src={property.imageUrl}
                    alt={property.address}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold text-primary-600">
                      ${property.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {property.propertyType}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{property.address}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      {property.bedrooms} bed
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />
                      {property.bathrooms} bath
                    </div>
                    <div className="flex items-center">
                      <Square className="w-4 h-4 mr-1" />
                      {property.sqft.toLocaleString()} sqft
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      Built in {property.yearBuilt}
                      {property.lotSize && ` • ${property.lotSize} acre lot`}
                    </div>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                        Click to add to portfolio
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}