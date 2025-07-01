import React from 'react';
import { useApp } from '../context/AppContext';
import ProgressBar from '../components/ProgressBar';
import { 
  TrendingUp, 
  DollarSign, 
  Building, 
  PiggyBank, 
  Target,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Zap,
  Star,
  ArrowRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data that matches the individual pages
const mockRealEstateAssets = [
  {
    id: '1',
    type: 'real_estate' as const,
    name: 'Primary Residence',
    currentValue: 450000,
    monthlyContribution: 2200,
    expectedAnnualReturn: 3.5,
  },
];

const mockInvestmentAssets = [
  {
    id: '2',
    type: 'investment' as const,
    name: 'Investment Portfolio',
    currentValue: 125000,
    monthlyContribution: 1000,
    expectedAnnualReturn: 8.0,
  },
];

const mockRetirementAssets = [
  {
    id: '3',
    type: 'retirement' as const,
    name: '401(k)',
    currentValue: 95000,
    monthlyContribution: 800,
    expectedAnnualReturn: 7.5,
  },
  {
    id: '4',
    type: 'retirement' as const,
    name: 'Roth IRA',
    currentValue: 45000,
    monthlyContribution: 542,
    expectedAnnualReturn: 7.5,
  },
];

const allAssets = [...mockRealEstateAssets, ...mockInvestmentAssets, ...mockRetirementAssets];

const mockInsights = [
  {
    id: '1',
    type: 'opportunity' as const,
    title: 'Maximize 401(k) Employer Match',
    description: 'You\'re missing $3,000 in free employer matching. Increase your contribution by $250/month to capture the full match.',
    actionable: true,
    priority: 'high' as const,
    potentialSavings: 3720,
    category: 'retirement'
  },
  {
    id: '2',
    type: 'tip' as const,
    title: 'Rebalance Investment Portfolio',
    description: 'Your portfolio is 67% real estate. Consider reducing to 50% and increasing stock allocation for better diversification.',
    actionable: true,
    priority: 'medium' as const,
    potentialSavings: 8500,
    category: 'investment'
  },
  {
    id: '3',
    type: 'warning' as const,
    title: 'Consider Roth Conversion',
    description: 'Your current 22% tax bracket is favorable for converting some traditional IRA funds to Roth IRA.',
    actionable: true,
    priority: 'medium' as const,
    potentialSavings: 12000,
    category: 'retirement'
  },
];

// Mock projection data
const projectionData = Array.from({ length: 30 }, (_, i) => {
  const year = new Date().getFullYear() + i;
  const totalValue = allAssets.reduce((sum, asset) => {
    const years = i;
    const futureValue = asset.currentValue * Math.pow(1 + asset.expectedAnnualReturn! / 100, years) +
      (asset.monthlyContribution || 0) * 12 * years * Math.pow(1 + asset.expectedAnnualReturn! / 100, years / 2);
    return sum + futureValue;
  }, 0);
  
  return {
    year,
    value: Math.round(totalValue),
  };
});

const pieData = [
  {
    name: 'Real Estate',
    value: mockRealEstateAssets.reduce((sum, asset) => sum + asset.currentValue, 0),
    color: '#f59e0b',
  },
  {
    name: 'Investments',
    value: mockInvestmentAssets.reduce((sum, asset) => sum + asset.currentValue, 0),
    color: '#22c55e',
  },
  {
    name: 'Retirement',
    value: mockRetirementAssets.reduce((sum, asset) => sum + asset.currentValue, 0),
    color: '#3b82f6',
  },
];

export default function Dashboard() {
  const { state } = useApp();
  const { user, goals } = state;

  // Calculate totals that match individual pages
  const totalRealEstate = mockRealEstateAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalInvestments = mockInvestmentAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalRetirement = mockRetirementAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalNetWorth = totalRealEstate + totalInvestments + totalRetirement;

  const primaryGoal = goals[0];
  const targetAmount = primaryGoal?.targetAmount || 1000000;

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <TrendingUp className="w-5 h-5 text-success-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-warning-600" />;
      default:
        return <Lightbulb className="w-5 h-5 text-primary-600" />;
    }
  };

  const getInsightStyle = (type: string) => {
    switch (type) {
      case 'opportunity':
        return 'border-l-success-500 bg-success-50 border border-success-200';
      case 'warning':
        return 'border-l-warning-500 bg-warning-50 border border-warning-200';
      default:
        return 'border-l-primary-500 bg-primary-50 border border-primary-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, {user?.name || 'there'}! 👋
        </h1>
        <p className="text-primary-100 text-lg">
          Here's your financial progress toward retirement
        </p>
      </div>

      {/* AI Insights Banner - Prominent Placement */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Recommendations</h2>
              <p className="text-purple-100">Personalized insights to optimize your wealth</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              ${mockInsights.reduce((sum, insight) => sum + (insight.potentialSavings || 0), 0).toLocaleString()}
            </div>
            <div className="text-purple-100 text-sm">Potential savings</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockInsights.map((insight, index) => (
            <div
              key={insight.id}
              className="bg-white bg-opacity-10 rounded-lg p-4 hover:bg-opacity-20 transition-all cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getInsightIcon(insight.type)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                    insight.priority === 'high' ? 'bg-red-100 text-red-800 border-red-200' :
                    insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    'bg-gray-100 text-gray-800 border-gray-200'
                  }`}>
                    {insight.priority}
                  </span>
                </div>
                <Star className="w-4 h-4 text-yellow-300" />
              </div>
              <h3 className="font-semibold text-white mb-1">{insight.title}</h3>
              <p className="text-purple-100 text-sm mb-3">{insight.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-green-300 font-semibold">
                  +${insight.potentialSavings?.toLocaleString()}
                </span>
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-primary-600" />
            </div>
            <span className="text-sm text-gray-500">Net Worth</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            ${totalNetWorth.toLocaleString()}
          </div>
          <div className="text-sm text-success-600 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12.5% this year
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-slide-up" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-success-100 rounded-lg">
              <Target className="w-6 h-6 text-success-600" />
            </div>
            <span className="text-sm text-gray-500">Goal Progress</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {((totalNetWorth / targetAmount) * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">
            ${(targetAmount - totalNetWorth).toLocaleString()} to go
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Building className="w-6 h-6 text-warning-600" />
            </div>
            <span className="text-sm text-gray-500">Real Estate</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            ${totalRealEstate.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            {((totalRealEstate / totalNetWorth) * 100).toFixed(1)}% of portfolio
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-slide-up" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <PiggyBank className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Retirement</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            ${totalRetirement.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            On track for {user?.targetRetirementYear || 2059}
          </div>
        </div>
      </div>

      {/* Goal Progress */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-slide-up">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Retirement Goal Progress</h2>
        <ProgressBar
          current={totalNetWorth}
          target={targetAmount}
          label={primaryGoal?.description || 'Financial Goal'}
          color="blue"
        />
      </div>

      {/* Portfolio Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-slide-up">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Portfolio Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-warning-100 flex items-center justify-center">
              <Building className="w-10 h-10 text-warning-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">${totalRealEstate.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Real Estate</div>
            <div className="text-xs text-warning-600 font-medium">
              {((totalRealEstate / totalNetWorth) * 100).toFixed(1)}% of total
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-success-100 flex items-center justify-center">
              <TrendingUp className="w-10 h-10 text-success-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">${totalInvestments.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Investments</div>
            <div className="text-xs text-success-600 font-medium">
              {((totalInvestments / totalNetWorth) * 100).toFixed(1)}% of total
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <PiggyBank className="w-10 h-10 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">${totalRetirement.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Retirement</div>
            <div className="text-xs text-blue-600 font-medium">
              {((totalRetirement / totalNetWorth) * 100).toFixed(1)}% of total
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Net Worth Projection */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-slide-up">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Net Worth Projection</h2>
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
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Net Worth']}
                  labelStyle={{ color: '#666' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-slide-up">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Asset Allocation</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed AI Insights */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Lightbulb className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Detailed AI Insights & Recommendations</h2>
              <p className="text-gray-600">Personalized strategies to accelerate your wealth building</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <CheckCircle className="w-4 h-4 mr-1 text-success-500" />
            Updated today
          </div>
        </div>
        <div className="space-y-4">
          {mockInsights.map((insight, index) => (
            <div
              key={insight.id}
              className={`border-l-4 p-6 rounded-r-lg ${getInsightStyle(insight.type)} animate-slide-up shadow-sm`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityBadge(insight.priority)}`}>
                        {insight.priority} priority
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {insight.category}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-success-600 font-semibold">
                        Potential savings: ${insight.potentialSavings?.toLocaleString()}
                      </div>
                      <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                        Take Action
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}