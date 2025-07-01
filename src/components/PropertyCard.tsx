import React from 'react';
import { Building, TrendingUp, DollarSign, MapPin, Edit, Trash2 } from 'lucide-react';
import { RealEstateAsset } from '../types';

interface PropertyCardProps {
  property: RealEstateAsset;
  onEdit: (property: RealEstateAsset) => void;
  onDelete: (id: string) => void;
}

export default function PropertyCard({ property, onEdit, onDelete }: PropertyCardProps) {
  const equity = property.details.currentValue - property.details.mortgageBalance;
  const equityPercentage = (equity / property.details.currentValue) * 100;
  const monthlyAppreciation = (property.details.currentValue * property.details.appreciationRate / 100) / 12;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Building className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{property.name}</h3>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              {property.details.address}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(property)}
            className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(property.id)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-600">Current Value</div>
          <div className="text-xl font-bold text-gray-900">
            ${property.details.currentValue.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Equity</div>
          <div className="text-xl font-bold text-success-600">
            ${equity.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Mortgage Balance</span>
          <span className="font-medium">${property.details.mortgageBalance.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Monthly Payment</span>
          <span className="font-medium">${property.details.monthlyPayment.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Appreciation Rate</span>
          <span className="font-medium text-success-600">
            {property.details.appreciationRate}% annually
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-success-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+${monthlyAppreciation.toFixed(0)}/month</span>
          </div>
          <div className="text-gray-600">
            {equityPercentage.toFixed(1)}% equity
          </div>
        </div>
      </div>
    </div>
  );
}