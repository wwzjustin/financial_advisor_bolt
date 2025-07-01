import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building, Search, TrendingUp, DollarSign, Calculator, Home, Lightbulb, Star, ArrowRight } from 'lucide-react';
import { RealEstateAsset } from '../types';
import PropertyCard from '../components/PropertyCard';
import PropertyForm from '../components/PropertyForm';
import PropertySearch from '../components/PropertySearch';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
}

// Mock AI recommendations for real estate
const realEstateRecommendations = [
  {
    id: '1',
    title: 'Consider Refinancing Your Mortgage',
    description: 'Current rates are 1.2% lower than your mortgage rate. Refinancing could save you $340/month.',
    potentialSavings: 48960, // $340 * 12 * 12 years
    priority: 'high' as const,
    actionSteps: [
      'Check current credit score',
      'Get quotes from 3-4 lenders',
      'Calculate break-even point',
      'Apply for refinancing'
    ]
  },
  {
    id: '2',
    title: 'Accelerate Mortgage Payments',
    description: 'Adding $200/month to principal could save $89,000 in interest and pay off your mortgage 6 years early.',
    potentialSavings: 89000,
    priority: 'medium' as const,
    actionSteps: [
      'Set up automatic extra payment',
      'Apply extra payments to principal only',
      'Review annually and adjust'
    ]
  },
  {
    id: '3',
    title: 'Consider House Hacking Strategy',
    description: 'Rent out a room or basement to generate $800-1200/month in passive income.',
    potentialSavings: 12000, // $1000 * 12
    priority: 'medium' as const,
    actionSteps: [
      'Research local rental laws',
      'Prepare space for rental',
      'Screen potential tenants',
      'Set up rental agreement'
    ]
  }
];

export default function RealEstate() {
  const { state, dispatch } = useApp();
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showPropertySearch, setShowPropertySearch] = useState(false);
  const [editingProperty, setEditingProperty] = useState<RealEstateAsset | undefined>();

  const realEstateAssets = state.assets.filter(asset => asset.type === 'real_estate') as RealEstateAsset[];
  
  const totalRealEstateValue = realEstateAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalEquity = realEstateAssets.reduce((sum, asset) => 
    sum + (asset.details.currentValue - asset.details.mortgageBalance), 0
  );
  const totalMonthlyPayments = realEstateAssets.reduce((sum, asset) => sum + asset.details.monthlyPayment, 0);
  const averageAppreciation = realEstateAssets.length > 0 
    ? realEstateAssets.reduce((sum, asset) => sum + asset.details.appreciationRate, 0) / realEstateAssets.length 
    : 0;

  // Generate projection data for the next 10 years
  const projectionData = Array.from({ length: 11 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    const totalValue = realEstateAssets.reduce((sum, asset) => {
      const futureValue = asset.details.currentValue * Math.pow(1 + asset.details.appreciationRate / 100, i);
      return sum + futureValue;
    }, 0);
    
    return {
      year,
      value: Math.round(totalValue),
    };
  });

  const handleAddProperty = (propertyData: Omit<RealEstateAsset, 'id'>) => {
    const newProperty: RealEstateAsset = {
      ...propertyData,
      id: crypto.randomUUID(),
    };
    dispatch({ type: 'ADD_ASSET', payload: newProperty });
    setShowPropertyForm(false);
  };

  const handleEditProperty = (property: RealEstateAsset) => {
    setEditingProperty(property);
    setShowPropertyForm(true);
  };

  const handleUpdateProperty = (propertyData: Omit<RealEstateAsset, 'id'>) => {
    if (editingProperty) {
      dispatch({ 
        type: 'UPDATE_ASSET', 
        payload: { 
          id: editingProperty.id, 
          asset: propertyData 
        } 
      });
      setEditingProperty(undefined);
      setShowPropertyForm(false);
    }
  };

  const handleDeleteProperty = (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      dispatch({ type: 'DELETE_ASSET', payload: id });
    }
  };

  const handleSelectSearchResult = (searchResult: PropertySearchResult) => {
    const propertyData: Omit<RealEstateAsset, 'id'> = {
      type: 'real_estate',
      name: `Property at ${searchResult.address.split(',')[0]}`,
      currentValue: searchResult.price,
      monthlyContribution: 0,
      expectedAnnualReturn: 3.5,
      details: {
        address: searchResult.address,
        propertyType: searchResult.propertyType,
        purchasePrice: searchResult.price,
        currentValue: searchResult.price,
        mortgageBalance: 0,
        monthlyPayment: 0,
        appreciationRate: 3.5,
      },
    };

    setShowPropertySearch(false);
    setEditingProperty(undefined);
    setShowPropertyForm(true);
    
    // Pre-fill the form with search result data
    setTimeout(() => {
      handleAddProperty(propertyData);
    }, 100);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Real Estate Portfolio</h1>
          <p className="text-gray-600 mt-1">Manage properties you own and track appreciation</p>
        </div>
        <button
          onClick={() => setShowPropertySearch(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Search className="w-4 h-4 mr-2" />
          Search Properties You Own
        </button>
      </div>

      {/* AI Recommendations Banner */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Real Estate Insights</h2>
              <p className="text-green-100">Optimize your property investments</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              ${realEstateRecommendations.reduce((sum, rec) => sum + rec.potentialSavings, 0).toLocaleString()}
            </div>
            <div className="text-green-100 text-sm">Potential savings</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {realEstateRecommendations.map((rec, index) => (
            <div
              key={rec.id}
              className="bg-white bg-opacity-10 rounded-lg p-4 hover:bg-opacity-20 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  rec.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {rec.priority}
                </span>
                <Star className="w-4 h-4 text-yellow-300" />
              </div>
              <h3 className="font-semibold text-white mb-1">{rec.title}</h3>
              <p className="text-green-100 text-sm mb-3">{rec.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-yellow-300 font-semibold">
                  +${rec.potentialSavings.toLocaleString()}
                </span>
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Building className="w-6 h-6 text-primary-600" />
            </div>
            <span className="text-sm text-gray-500">Total Value</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            ${totalRealEstateValue.toLocaleString()}
          </div>
          <div className="text-sm text-success-600 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            {averageAppreciation.toFixed(1)}% avg appreciation
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-success-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-success-600" />
            </div>
            <span className="text-sm text-gray-500">Total Equity</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            ${totalEquity.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            {totalRealEstateValue > 0 ? ((totalEquity / totalRealEstateValue) * 100).toFixed(1) : 0}% of total value
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Calculator className="w-6 h-6 text-warning-600" />
            </div>
            <span className="text-sm text-gray-500">Monthly Payments</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            ${totalMonthlyPayments.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            ${(totalMonthlyPayments * 12).toLocaleString()}/year
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Home className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Properties</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {realEstateAssets.length}
          </div>
          <div className="text-sm text-gray-600">
            {realEstateAssets.length === 1 ? 'property' : 'properties'} owned
          </div>
        </div>
      </div>

      {/* Value Projection Chart */}
      {realEstateAssets.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Real Estate Value Projection</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="year" 
                  stroke="#666"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#666"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Total Value']}
                  labelStyle={{ color: '#666' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Detailed AI Recommendations */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Lightbulb className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Detailed Real Estate Recommendations</h2>
            <p className="text-gray-600">AI-powered strategies to maximize your property investments</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {realEstateRecommendations.map((rec, index) => (
            <div
              key={rec.id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {rec.priority} priority
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-success-600">
                    +${rec.potentialSavings.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Potential savings</div>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{rec.description}</p>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Action Steps:</h4>
                <div className="space-y-2">
                  {rec.actionSteps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start text-sm text-gray-700">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                        {stepIndex + 1}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                  Start Action Plan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Properties Grid */}
      {realEstateAssets.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {realEstateAssets.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onEdit={handleEditProperty}
              onDelete={handleDeleteProperty}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Properties Yet</h2>
          <p className="text-gray-600 mb-6">
            Start building your real estate portfolio by adding properties you own
          </p>
          <button
            onClick={() => setShowPropertySearch(true)}
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Search className="w-5 h-5 mr-2" />
            Search Properties You Own
          </button>
        </div>
      )}

      {/* Modals */}
      {showPropertySearch && (
        <PropertySearch
          onSelectProperty={handleSelectSearchResult}
          onClose={() => setShowPropertySearch(false)}
        />
      )}

      {showPropertyForm && (
        <PropertyForm
          property={editingProperty}
          onSave={editingProperty ? handleUpdateProperty : handleAddProperty}
          onClose={() => {
            setShowPropertyForm(false);
            setEditingProperty(undefined);
          }}
        />
      )}
    </div>
  );
}