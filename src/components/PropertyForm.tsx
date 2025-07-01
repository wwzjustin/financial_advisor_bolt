import React, { useState } from 'react';
import { X, Calculator, TrendingUp } from 'lucide-react';
import { RealEstateAsset } from '../types';

interface PropertyFormProps {
  property?: RealEstateAsset;
  onSave: (property: Omit<RealEstateAsset, 'id'>) => void;
  onClose: () => void;
}

export default function PropertyForm({ property, onSave, onClose }: PropertyFormProps) {
  const [formData, setFormData] = useState({
    name: property?.name || '',
    address: property?.details.address || '',
    propertyType: property?.details.propertyType || 'Single Family',
    purchasePrice: property?.details.purchasePrice || 0,
    currentValue: property?.details.currentValue || 0,
    mortgageBalance: property?.details.mortgageBalance || 0,
    monthlyPayment: property?.details.monthlyPayment || 0,
    appreciationRate: property?.details.appreciationRate || 3.5,
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Validation: Ensure required fields are filled
    if (!formData.name || !formData.address || !formData.purchasePrice || !formData.currentValue || formData.mortgageBalance < 0) {
      alert('Please fill in all required fields: Property Name, Address, Purchase Price, Current Value, and Mortgage Balance.');
      return;
    }

    const propertyData: Omit<RealEstateAsset, 'id'> = {
      type: 'real_estate',
      name: formData.name,
      currentValue: formData.currentValue,
      monthlyContribution: formData.monthlyPayment,
      expectedAnnualReturn: formData.appreciationRate,
      details: {
        address: formData.address,
        propertyType: formData.propertyType,
        purchasePrice: formData.purchasePrice,
        currentValue: formData.currentValue,
        mortgageBalance: formData.mortgageBalance,
        monthlyPayment: formData.monthlyPayment,
        appreciationRate: formData.appreciationRate,
      },
    };

    onSave(propertyData);
  };

  const equity = formData.currentValue - formData.mortgageBalance;
  const equityPercentage = formData.currentValue > 0 ? (equity / formData.currentValue) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {property ? 'Edit Property' : 'Add Property You Own'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-6">
            <div className="bg-primary-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-primary-900 mb-2">Property Information</h3>
              <p className="text-sm text-primary-700">
                Add details about the property you currently own
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Primary Residence"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => handleInputChange('propertyType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Single Family">Single Family</option>
                  <option value="Condo">Condo</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Multi-Family">Multi-Family</option>
                  <option value="Investment">Investment Property</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter property address"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Price *
                </label>
                <input
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Value *
                </label>
                <input
                  type="number"
                  value={formData.currentValue}
                  onChange={(e) => handleInputChange('currentValue', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mortgage Balance Left *
                </label>
                <input
                  type="number"
                  value={formData.mortgageBalance}
                  onChange={(e) => handleInputChange('mortgageBalance', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Enter 0 if property is paid off</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Payment
                </label>
                <input
                  type="number"
                  value={formData.monthlyPayment}
                  onChange={(e) => handleInputChange('monthlyPayment', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">Enter 0 if no monthly payment</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Annual Appreciation Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.appreciationRate}
                onChange={(e) => handleInputChange('appreciationRate', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="3.5"
              />
              <p className="text-xs text-gray-500 mt-1">Historical average is around 3-4% annually</p>
            </div>

            {/* Equity Summary */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center">
                <Calculator className="w-4 h-4 mr-2" />
                Property Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Current Equity</div>
                  <div className="text-xl font-bold text-success-600">
                    ${equity.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Equity Percentage</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {equityPercentage.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Annual Appreciation</div>
                  <div className="text-lg font-semibold text-primary-600">
                    ${((formData.currentValue * formData.appreciationRate) / 100).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!formData.name || !formData.address || !formData.purchasePrice || !formData.currentValue}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {property ? 'Update Property' : 'Add Property'}
          </button>
        </div>
      </div>
    </div>
  );
}