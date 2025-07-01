import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  Plus, 
  BarChart3, 
  PieChart, 
  Building2,
  Shield,
  Zap,
  AlertTriangle,
  Download,
  RefreshCw,
  Target,
  DollarSign,
  Percent,
  Calendar,
  Eye,
  EyeOff,
  Lightbulb,
  Star,
  ArrowRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface BrokerageAccount {
  id: string;
  name: string;
  provider: string;
  accountType: string;
  balance: number;
  lastSync: Date;
  holdings: Holding[];
}

interface Holding {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  currentPrice: number;
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  allocation: number;
}

interface AIRecommendation {
  id: string;
  type: 'buy' | 'sell' | 'rebalance';
  symbol: string;
  name: string;
  reason: string;
  targetAllocation: number;
  currentAllocation: number;
  priority: 'high' | 'medium' | 'low';
  riskLevel: 'conservative' | 'moderate' | 'aggressive';
  potentialSavings: number;
  actionSteps: string[];
}

interface RiskProfile {
  level: 'conservative' | 'moderate' | 'aggressive';
  name: string;
  description: string;
  expectedReturn: number;
  volatility: number;
  allocation: {
    stocks: number;
    bonds: number;
    international: number;
    alternatives: number;
  };
}

// Mock data
const mockBrokerageAccounts: BrokerageAccount[] = [
  {
    id: '1',
    name: 'Investment Account',
    provider: 'Fidelity',
    accountType: 'Taxable',
    balance: 125000,
    lastSync: new Date(),
    holdings: [
      {
        id: '1',
        symbol: 'VTI',
        name: 'Vanguard Total Stock Market ETF',
        shares: 300,
        currentPrice: 245.50,
        totalValue: 73650,
        dayChange: 2.45,
        dayChangePercent: 1.01,
        allocation: 58.9
      },
      {
        id: '2',
        symbol: 'BND',
        name: 'Vanguard Total Bond Market ETF',
        shares: 250,
        currentPrice: 78.20,
        totalValue: 19550,
        dayChange: -0.15,
        dayChangePercent: -0.19,
        allocation: 15.6
      },
      {
        id: '3',
        symbol: 'VTIAX',
        name: 'Vanguard Total International Stock',
        shares: 400,
        currentPrice: 65.75,
        totalValue: 26300,
        dayChange: 1.25,
        dayChangePercent: 1.94,
        allocation: 21.0
      },
      {
        id: '4',
        symbol: 'VNQ',
        name: 'Vanguard Real Estate ETF',
        shares: 60,
        currentPrice: 92.50,
        totalValue: 5550,
        dayChange: -0.75,
        dayChangePercent: -0.80,
        allocation: 4.4
      }
    ]
  }
];

const mockRecommendations: AIRecommendation[] = [
  {
    id: '1',
    type: 'rebalance',
    symbol: 'VTI',
    name: 'Reduce US Stock Allocation',
    reason: 'Your US stock allocation is 59%, which is higher than the recommended 50% for moderate risk. Consider rebalancing.',
    targetAllocation: 50,
    currentAllocation: 58.9,
    priority: 'medium',
    riskLevel: 'moderate',
    potentialSavings: 8500,
    actionSteps: [
      'Sell $11,000 worth of VTI shares',
      'Reallocate to international stocks (VTIAX)',
      'Set up automatic rebalancing quarterly',
      'Monitor allocation drift monthly'
    ]
  },
  {
    id: '2',
    type: 'buy',
    symbol: 'BND',
    name: 'Increase Bond Allocation',
    reason: 'Your bond allocation is low at 16%. Consider increasing to 25% for better risk-adjusted returns.',
    targetAllocation: 25,
    currentAllocation: 15.6,
    priority: 'high',
    riskLevel: 'moderate',
    potentialSavings: 12000,
    actionSteps: [
      'Purchase $11,750 worth of BND',
      'Consider ladder strategy with individual bonds',
      'Review bond duration and credit quality',
      'Set up monthly bond purchases'
    ]
  },
  {
    id: '3',
    type: 'buy',
    symbol: 'SCHD',
    name: 'Add Dividend Growth ETF',
    reason: 'Consider adding dividend-focused investments for income generation and lower volatility.',
    targetAllocation: 10,
    currentAllocation: 0,
    priority: 'low',
    riskLevel: 'conservative',
    potentialSavings: 3200,
    actionSteps: [
      'Research dividend growth ETFs (SCHD, VIG)',
      'Allocate $12,500 to dividend stocks',
      'Set up dividend reinvestment plan',
      'Monitor dividend yield and growth'
    ]
  }
];

const riskProfiles: RiskProfile[] = [
  {
    level: 'conservative',
    name: 'Conservative',
    description: 'Lower risk, steady growth with capital preservation',
    expectedReturn: 6.5,
    volatility: 8.2,
    allocation: {
      stocks: 30,
      bonds: 50,
      international: 15,
      alternatives: 5
    }
  },
  {
    level: 'moderate',
    name: 'Moderate',
    description: 'Balanced approach with moderate risk for steady growth',
    expectedReturn: 8.2,
    volatility: 12.5,
    allocation: {
      stocks: 50,
      bonds: 25,
      international: 20,
      alternatives: 5
    }
  },
  {
    level: 'aggressive',
    name: 'Aggressive',
    description: 'Higher risk for maximum long-term growth potential',
    expectedReturn: 10.1,
    volatility: 18.3,
    allocation: {
      stocks: 70,
      bonds: 10,
      international: 15,
      alternatives: 5
    }
  }
];

// Mock performance data
const performanceData = Array.from({ length: 12 }, (_, i) => {
  const month = new Date();
  month.setMonth(month.getMonth() - (11 - i));
  const baseValue = 100000;
  const growth = Math.random() * 0.15 + 0.05; // 5-20% growth
  const volatility = (Math.random() - 0.5) * 0.1; // ±5% monthly volatility
  
  return {
    month: month.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    value: Math.round(baseValue * (1 + growth + volatility * i)),
    benchmark: Math.round(baseValue * (1 + 0.08 + volatility * i * 0.8))
  };
});

export default function Investments() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'accounts' | 'recommendations' | 'builder'>('overview');
  const [selectedRiskProfile, setSelectedRiskProfile] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [showImportModal, setShowImportModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [accounts] = useState<BrokerageAccount[]>(mockBrokerageAccounts);
  const [hideBalances, setHideBalances] = useState(false);

  const totalPortfolioValue = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalDayChange = accounts.reduce((sum, account) => 
    sum + account.holdings.reduce((holdingSum, holding) => holdingSum + (holding.shares * holding.dayChange), 0), 0
  );
  const totalDayChangePercent = totalPortfolioValue > 0 ? (totalDayChange / totalPortfolioValue) * 100 : 0;

  // Aggregate holdings across all accounts
  const allHoldings = accounts.flatMap(account => account.holdings);
  const holdingsBySymbol = allHoldings.reduce((acc, holding) => {
    if (acc[holding.symbol]) {
      acc[holding.symbol].totalValue += holding.totalValue;
      acc[holding.symbol].shares += holding.shares;
    } else {
      acc[holding.symbol] = { ...holding };
    }
    return acc;
  }, {} as Record<string, Holding>);

  const pieData = Object.values(holdingsBySymbol).map((holding, index) => ({
    name: holding.symbol,
    value: holding.totalValue,
    color: ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5],
  }));

  const handleImportAccount = async (provider: string) => {
    setIsImporting(true);
    // Simulate API call
    setTimeout(() => {
      setIsImporting(false);
      setShowImportModal(false);
      // In real app, would add new account to state
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    if (hideBalances) return '••••••';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'buy': return <TrendingUp className="w-5 h-5 text-success-600" />;
      case 'sell': return <TrendingUp className="w-5 h-5 text-red-600 rotate-180" />;
      default: return <RefreshCw className="w-5 h-5 text-primary-600" />;
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'conservative': return <Shield className="w-6 h-6 text-blue-600" />;
      case 'moderate': return <Target className="w-6 h-6 text-yellow-600" />;
      case 'aggressive': return <Zap className="w-6 h-6 text-red-600" />;
      default: return <Target className="w-6 h-6 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investment Portfolio</h1>
          <p className="text-gray-600 mt-1">Manage your investments with AI-powered insights</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setHideBalances(!hideBalances)}
            className="inline-flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {hideBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Import Account
          </button>
        </div>
      </div>

      {/* AI Investment Recommendations Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Investment Optimizer</h2>
              <p className="text-blue-100">Maximize returns with smart portfolio rebalancing</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              ${mockRecommendations.reduce((sum, rec) => sum + rec.potentialSavings, 0).toLocaleString()}
            </div>
            <div className="text-blue-100 text-sm">Potential gains</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockRecommendations.map((rec, index) => (
            <div
              key={rec.id}
              className="bg-white bg-opacity-10 rounded-lg p-4 hover:bg-opacity-20 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  rec.priority === 'high' ? 'bg-red-100 text-red-800' : 
                  rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {rec.priority}
                </span>
                <Star className="w-4 h-4 text-yellow-300" />
              </div>
              <h3 className="font-semibold text-white mb-1">{rec.name}</h3>
              <p className="text-blue-100 text-sm mb-3">{rec.reason}</p>
              <div className="flex items-center justify-between">
                <span className="text-green-300 font-semibold">
                  +${rec.potentialSavings.toLocaleString()}
                </span>
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-primary-600" />
            </div>
            <span className="text-sm text-gray-500">Total Value</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(totalPortfolioValue)}
          </div>
          <div className={`text-sm flex items-center ${totalDayChangePercent >= 0 ? 'text-success-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${totalDayChangePercent < 0 ? 'rotate-180' : ''}`} />
            {hideBalances ? '••••' : `${totalDayChangePercent >= 0 ? '+' : ''}${totalDayChangePercent.toFixed(2)}%`}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-success-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-success-600" />
            </div>
            <span className="text-sm text-gray-500">Day Change</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {hideBalances ? '••••••' : `${totalDayChange >= 0 ? '+' : ''}${formatCurrency(totalDayChange)}`}
          </div>
          <div className="text-sm text-gray-600">
            Since yesterday
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Building2 className="w-6 h-6 text-warning-600" />
            </div>
            <span className="text-sm text-gray-500">Accounts</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {accounts.length}
          </div>
          <div className="text-sm text-gray-600">
            Connected brokerages
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Holdings</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {Object.keys(holdingsBySymbol).length}
          </div>
          <div className="text-sm text-gray-600">
            Unique positions
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'accounts', name: 'Accounts', icon: Building2 },
              { id: 'recommendations', name: 'AI Recommendations', icon: Zap },
              { id: 'builder', name: 'Portfolio Builder', icon: Target }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Performance Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#666" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#666" tick={{ fontSize: 12 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                        <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} name="Portfolio" />
                        <Line type="monotone" dataKey="benchmark" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="S&P 500" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Asset Allocation */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Allocation</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
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
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Top Holdings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Holdings</h3>
                <div className="space-y-3">
                  {Object.values(holdingsBySymbol).slice(0, 5).map((holding) => (
                    <div key={holding.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <span className="text-primary-600 font-semibold text-sm">{holding.symbol}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{holding.symbol}</div>
                          <div className="text-sm text-gray-600">{holding.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{formatCurrency(holding.totalValue)}</div>
                        <div className={`text-sm ${holding.dayChangePercent >= 0 ? 'text-success-600' : 'text-red-600'}`}>
                          {holding.dayChangePercent >= 0 ? '+' : ''}{holding.dayChangePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accounts' && (
            <div className="space-y-6">
              {accounts.map((account) => (
                <div key={account.id} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{account.name}</h3>
                        <p className="text-sm text-gray-600">{account.provider} • {account.accountType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{formatCurrency(account.balance)}</div>
                      <div className="text-sm text-gray-500">Last sync: {account.lastSync.toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {account.holdings.map((holding) => (
                      <div key={holding.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-gray-900">{holding.symbol}</span>
                          <span className="text-sm text-gray-600">{holding.shares} shares</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{formatCurrency(holding.totalValue)}</div>
                          <div className={`text-sm ${holding.dayChangePercent >= 0 ? 'text-success-600' : 'text-red-600'}`}>
                            {holding.dayChangePercent >= 0 ? '+' : ''}{holding.dayChangePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <div className="bg-primary-50 rounded-lg p-4">
                <h3 className="font-medium text-primary-900 mb-2">AI-Powered Investment Recommendations</h3>
                <p className="text-sm text-primary-700">
                  Based on your current portfolio and risk profile, here are personalized recommendations to optimize your investments.
                </p>
              </div>

              <div className="space-y-4">
                {mockRecommendations.map((rec) => (
                  <div key={rec.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        {getRecommendationIcon(rec.type)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{rec.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                              {rec.priority} priority
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                              {rec.type}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm mb-3">{rec.reason}</p>
                          <div className="text-sm text-gray-600 mb-3">
                            Current: {rec.currentAllocation.toFixed(1)}% → Target: {rec.targetAllocation.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-success-600">
                          +${rec.potentialSavings.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">Potential gain</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Action Steps:</h4>
                      <div className="space-y-2">
                        {rec.actionSteps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-start text-sm text-gray-700">
                            <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                              {stepIndex + 1}
                            </span>
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                        Apply Recommendation
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'builder' && (
            <div className="space-y-6">
              <div className="bg-success-50 rounded-lg p-4">
                <h3 className="font-medium text-success-900 mb-2">AI Portfolio Builder</h3>
                <p className="text-sm text-success-700">
                  Choose your risk tolerance and let AI build an optimized portfolio for your goals.
                </p>
              </div>

              {/* Risk Profile Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Your Risk Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {riskProfiles.map((profile) => (
                    <button
                      key={profile.level}
                      onClick={() => setSelectedRiskProfile(profile.level)}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${
                        selectedRiskProfile === profile.level
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        {getRiskIcon(profile.level)}
                        <h4 className="font-semibold text-gray-900">{profile.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{profile.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expected Return:</span>
                          <span className="font-medium text-success-600">{profile.expectedReturn}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Volatility:</span>
                          <span className="font-medium text-gray-900">{profile.volatility}%</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommended Allocation */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recommended Allocation - {riskProfiles.find(p => p.level === selectedRiskProfile)?.name}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(riskProfiles.find(p => p.level === selectedRiskProfile)?.allocation || {}).map(([asset, percentage]) => (
                    <div key={asset} className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary-600">{percentage}%</span>
                      </div>
                      <div className="font-medium text-gray-900 capitalize">{asset}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                    Build This Portfolio
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Import Brokerage Account</h2>
            <p className="text-gray-600 mb-6">
              Connect your brokerage account to automatically sync your holdings and get personalized recommendations.
            </p>
            
            <div className="space-y-3 mb-6">
              {['Fidelity', 'Charles Schwab', 'E*TRADE', 'TD Ameritrade', 'Robinhood', 'Vanguard'].map((provider) => (
                <button
                  key={provider}
                  onClick={() => handleImportAccount(provider)}
                  disabled={isImporting}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left disabled:opacity-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{provider}</span>
                    <Building2 className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>

            {isImporting && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Connecting to your account...</p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setShowImportModal(false)}
                disabled={isImporting}
                className="flex-1 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}