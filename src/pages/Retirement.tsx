import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  PiggyBank, 
  Plus, 
  Calculator, 
  Shield,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  DollarSign,
  Percent,
  Calendar,
  Building2,
  Download,
  RefreshCw,
  Target,
  Lightbulb,
  FileText,
  Eye,
  EyeOff,
  BarChart3,
  Zap,
  Star,
  ArrowRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface RetirementAccount {
  id: string;
  name: string;
  provider: string;
  accountType: '401k' | 'ira' | 'roth_ira' | 'sep_ira' | '403b';
  balance: number;
  contributions: {
    employee: number;
    employer: number;
    total: number;
  };
  limits: {
    annual: number;
    catchUp?: number;
  };
  lastSync: Date;
  taxStatus: 'pre-tax' | 'post-tax' | 'mixed';
  vestingSchedule?: {
    percentage: number;
    years: number;
  };
}

interface TaxRecommendation {
  id: string;
  type: 'contribution' | 'conversion' | 'withdrawal' | 'rebalance';
  title: string;
  description: string;
  taxImplication: string;
  potentialSavings: number;
  priority: 'high' | 'medium' | 'low';
  actionSteps: string[];
  deadline?: string;
}

interface TaxRule {
  id: string;
  category: 'contribution_limits' | 'withdrawal_rules' | 'tax_treatment' | 'penalties';
  title: string;
  description: string;
  details: string[];
  applicableAccounts: string[];
  examples?: {
    scenario: string;
    calculation: string;
    result: string;
  }[];
}

// Mock data
const mockRetirementAccounts: RetirementAccount[] = [
  {
    id: '1',
    name: 'Company 401(k)',
    provider: 'Fidelity',
    accountType: '401k',
    balance: 95000,
    contributions: {
      employee: 12000,
      employer: 6000,
      total: 18000
    },
    limits: {
      annual: 23000,
      catchUp: 7500
    },
    lastSync: new Date(),
    taxStatus: 'pre-tax',
    vestingSchedule: {
      percentage: 80,
      years: 4
    }
  },
  {
    id: '2',
    name: 'Roth IRA',
    provider: 'Vanguard',
    accountType: 'roth_ira',
    balance: 45000,
    contributions: {
      employee: 6500,
      employer: 0,
      total: 6500
    },
    limits: {
      annual: 7000,
      catchUp: 1000
    },
    lastSync: new Date(),
    taxStatus: 'post-tax'
  }
];

const mockTaxRecommendations: TaxRecommendation[] = [
  {
    id: '1',
    type: 'contribution',
    title: 'Maximize 401(k) Employer Match',
    description: 'You\'re leaving $3,000 in free employer matching on the table. Increase your contribution to get the full match.',
    taxImplication: 'Additional $3,000 in employer contributions (100% return) plus tax deduction on your contributions.',
    potentialSavings: 3720, // $3000 match + $720 tax savings (24% bracket)
    priority: 'high',
    actionSteps: [
      'Increase 401(k) contribution from $12,000 to $15,000 annually',
      'Contact HR to adjust payroll deductions',
      'Monitor to ensure you receive full employer match'
    ],
    deadline: 'End of current tax year'
  },
  {
    id: '2',
    type: 'conversion',
    title: 'Consider Roth Conversion Strategy',
    description: 'Your current tax bracket is favorable for converting some traditional IRA funds to Roth IRA.',
    taxImplication: 'Pay taxes now at current 22% rate vs potentially higher rates in retirement.',
    potentialSavings: 8500,
    priority: 'medium',
    actionSteps: [
      'Calculate optimal conversion amount based on tax bracket',
      'Execute partial Roth conversion of $20,000',
      'Pay conversion taxes from non-retirement funds',
      'Set up systematic conversion plan over 3-5 years'
    ]
  },
  {
    id: '3',
    type: 'contribution',
    title: 'Maximize IRA Contribution',
    description: 'You have $500 remaining in IRA contribution room for this tax year.',
    taxImplication: 'Additional tax deduction of $500, saving approximately $120 in taxes.',
    potentialSavings: 120,
    priority: 'low',
    actionSteps: [
      'Contribute remaining $500 to traditional IRA',
      'Consider backdoor Roth if income limits apply',
      'Set up automatic contributions for next year'
    ],
    deadline: 'April 15th (tax filing deadline)'
  }
];

const taxRules: TaxRule[] = [
  {
    id: '1',
    category: 'contribution_limits',
    title: '2024 Contribution Limits',
    description: 'Annual contribution limits vary by account type and age',
    details: [
      '401(k): $23,000 ($30,500 if 50+)',
      'IRA/Roth IRA: $7,000 ($8,000 if 50+)',
      'SEP-IRA: Lesser of 25% of compensation or $69,000',
      '403(b): $23,000 ($30,500 if 50+)'
    ],
    applicableAccounts: ['401k', 'ira', 'roth_ira', 'sep_ira', '403b'],
    examples: [
      {
        scenario: 'Age 35, $80,000 salary',
        calculation: 'Can contribute up to $23,000 to 401(k) + $7,000 to IRA',
        result: 'Maximum annual retirement savings: $30,000'
      }
    ]
  },
  {
    id: '2',
    category: 'tax_treatment',
    title: 'Tax Treatment Differences',
    description: 'Understanding pre-tax vs post-tax contributions',
    details: [
      'Traditional 401(k)/IRA: Pre-tax contributions, taxed on withdrawal',
      'Roth 401(k)/IRA: Post-tax contributions, tax-free withdrawals',
      'Employer match: Always pre-tax, regardless of employee election',
      'Required Minimum Distributions (RMDs) apply to traditional accounts at age 73'
    ],
    applicableAccounts: ['401k', 'ira', 'roth_ira'],
    examples: [
      {
        scenario: '$10,000 traditional 401(k) contribution in 24% tax bracket',
        calculation: '$10,000 × 24% = $2,400 tax savings now',
        result: 'Immediate tax benefit of $2,400'
      },
      {
        scenario: '$10,000 Roth contribution, 24% bracket now, 32% in retirement',
        calculation: 'Pay $2,400 tax now, save $3,200 tax later',
        result: 'Net tax savings of $800 over lifetime'
      }
    ]
  },
  {
    id: '3',
    category: 'withdrawal_rules',
    title: 'Withdrawal Rules and Penalties',
    description: 'Rules governing when and how you can access retirement funds',
    details: [
      'Traditional accounts: 10% penalty + income tax if withdrawn before age 59½',
      'Roth IRA: Contributions can be withdrawn anytime tax-free',
      'Roth IRA earnings: 5-year rule + age 59½ for tax-free withdrawal',
      'Hardship withdrawals: Limited exceptions available for 401(k)',
      'Required Minimum Distributions: Must begin at age 73 for traditional accounts'
    ],
    applicableAccounts: ['401k', 'ira', 'roth_ira'],
    examples: [
      {
        scenario: 'Age 45, withdraw $20,000 from traditional 401(k)',
        calculation: '$20,000 × 10% penalty + $20,000 × 24% tax',
        result: 'Total cost: $6,800 ($2,000 penalty + $4,800 tax)'
      }
    ]
  },
  {
    id: '4',
    category: 'penalties',
    title: 'Common Penalties and How to Avoid Them',
    description: 'Understanding penalty scenarios and exceptions',
    details: [
      'Early withdrawal penalty: 10% on distributions before age 59½',
      'Excess contribution penalty: 6% annually on over-contributions',
      'RMD penalty: 25% of required amount not withdrawn (reduced from 50%)',
      'Prohibited transaction penalty: Can result in account disqualification'
    ],
    applicableAccounts: ['401k', 'ira', 'roth_ira'],
    examples: [
      {
        scenario: 'Miss $5,000 RMD at age 75',
        calculation: '$5,000 × 25% = $1,250 penalty',
        result: 'Must pay penalty plus still take the distribution'
      }
    ]
  }
];

// Mock projection data
const projectionData = Array.from({ length: 30 }, (_, i) => {
  const year = new Date().getFullYear() + i;
  const traditionalValue = mockRetirementAccounts
    .filter(acc => acc.taxStatus === 'pre-tax')
    .reduce((sum, acc) => {
      const futureValue = acc.balance * Math.pow(1.07, i) + 
        (acc.contributions.total * 12 * i * Math.pow(1.07, i / 2));
      return sum + futureValue;
    }, 0);
  
  const rothValue = mockRetirementAccounts
    .filter(acc => acc.taxStatus === 'post-tax')
    .reduce((sum, acc) => {
      const futureValue = acc.balance * Math.pow(1.07, i) + 
        (acc.contributions.total * 12 * i * Math.pow(1.07, i / 2));
      return sum + futureValue;
    }, 0);
  
  return {
    year,
    traditional: Math.round(traditionalValue),
    roth: Math.round(rothValue),
    total: Math.round(traditionalValue + rothValue)
  };
});

export default function Retirement() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'accounts' | 'education' | 'recommendations'>('overview');
  const [selectedRule, setSelectedRule] = useState<TaxRule | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [accounts] = useState<RetirementAccount[]>(mockRetirementAccounts);
  const [hideBalances, setHideBalances] = useState(false);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalContributions = accounts.reduce((sum, acc) => sum + acc.contributions.total, 0);
  const totalContributionRoom = accounts.reduce((sum, acc) => sum + (acc.limits.annual - acc.contributions.total), 0);

  const formatCurrency = (amount: number) => {
    if (hideBalances) return '••••••';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getAccountTypeInfo = (type: string) => {
    const info = {
      '401k': { name: '401(k)', icon: Building2, color: 'blue' },
      'ira': { name: 'Traditional IRA', icon: PiggyBank, color: 'green' },
      'roth_ira': { name: 'Roth IRA', icon: Shield, color: 'purple' },
      'sep_ira': { name: 'SEP-IRA', icon: TrendingUp, color: 'orange' },
      '403b': { name: '403(b)', icon: Building2, color: 'blue' }
    };
    return info[type as keyof typeof info] || info['401k'];
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'contribution_limits': return <DollarSign className="w-5 h-5" />;
      case 'withdrawal_rules': return <Calendar className="w-5 h-5" />;
      case 'tax_treatment': return <Percent className="w-5 h-5" />;
      case 'penalties': return <AlertTriangle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const handleImportAccount = async (provider: string) => {
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
      setShowImportModal(false);
    }, 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Retirement Accounts</h1>
          <p className="text-gray-600 mt-1">Optimize your retirement savings with AI-powered tax strategies</p>
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
            Import 401(k)
          </button>
        </div>
      </div>

      {/* AI Tax Strategy Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Tax Strategy Optimizer</h2>
              <p className="text-purple-100">Maximize tax savings and retirement growth</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              ${mockTaxRecommendations.reduce((sum, rec) => sum + rec.potentialSavings, 0).toLocaleString()}
            </div>
            <div className="text-purple-100 text-sm">Annual tax savings</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockTaxRecommendations.map((rec, index) => (
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
              <h3 className="font-semibold text-white mb-1">{rec.title}</h3>
              <p className="text-purple-100 text-sm mb-3">{rec.description}</p>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <PiggyBank className="w-6 h-6 text-primary-600" />
            </div>
            <span className="text-sm text-gray-500">Total Balance</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(totalBalance)}
          </div>
          <div className="text-sm text-success-600 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            On track for retirement
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-success-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-success-600" />
            </div>
            <span className="text-sm text-gray-500">Annual Contributions</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(totalContributions)}
          </div>
          <div className="text-sm text-gray-600">
            This tax year
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Target className="w-6 h-6 text-warning-600" />
            </div>
            <span className="text-sm text-gray-500">Contribution Room</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(totalContributionRoom)}
          </div>
          <div className="text-sm text-gray-600">
            Remaining for {new Date().getFullYear()}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Tax Savings</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(totalContributions * 0.24)} {/* Assuming 24% tax bracket */}
          </div>
          <div className="text-sm text-gray-600">
            Estimated this year
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
              { id: 'education', name: 'Tax Education', icon: BookOpen },
              { id: 'recommendations', name: 'AI Tax Strategy', icon: Lightbulb }
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
              {/* Projection Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Retirement Savings Projection</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projectionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="year" stroke="#666" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#666" tick={{ fontSize: 12 }} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                      <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                      <Line type="monotone" dataKey="traditional" stroke="#3b82f6" strokeWidth={3} name="Traditional" />
                      <Line type="monotone" dataKey="roth" stroke="#22c55e" strokeWidth={3} name="Roth" />
                      <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={3} strokeDasharray="5 5" name="Total" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Account Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {accounts.map((account) => {
                    const accountInfo = getAccountTypeInfo(account.accountType);
                    const contributionProgress = (account.contributions.total / account.limits.annual) * 100;
                    
                    return (
                      <div key={account.id} className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 bg-${accountInfo.color}-100 rounded-lg`}>
                              <accountInfo.icon className={`w-6 h-6 text-${accountInfo.color}-600`} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{account.name}</h4>
                              <p className="text-sm text-gray-600">{accountInfo.name} • {account.provider}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-900">{formatCurrency(account.balance)}</div>
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              account.taxStatus === 'pre-tax' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {account.taxStatus === 'pre-tax' ? 'Pre-tax' : 'Post-tax'}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Annual Contributions</span>
                              <span className="font-medium">
                                {formatCurrency(account.contributions.total)} / {formatCurrency(account.limits.annual)}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(contributionProgress, 100)}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {contributionProgress.toFixed(1)}% of annual limit
                            </div>
                          </div>

                          {account.contributions.employer > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Employer Match</span>
                              <span className="font-medium text-success-600">
                                {formatCurrency(account.contributions.employer)}
                              </span>
                            </div>
                          )}

                          {account.vestingSchedule && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Vested</span>
                              <span className="font-medium">
                                {account.vestingSchedule.percentage}% ({account.vestingSchedule.years} years)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accounts' && (
            <div className="space-y-6">
              <div className="bg-primary-50 rounded-lg p-4">
                <h3 className="font-medium text-primary-900 mb-2">Account Management</h3>
                <p className="text-sm text-primary-700">
                  Import your 401(k) and other retirement accounts to get personalized tax optimization strategies.
                </p>
              </div>

              {accounts.map((account) => {
                const accountInfo = getAccountTypeInfo(account.accountType);
                
                return (
                  <div key={account.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 bg-${accountInfo.color}-100 rounded-lg`}>
                          <accountInfo.icon className={`w-8 h-8 text-${accountInfo.color}-600`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{account.name}</h3>
                          <p className="text-gray-600">{accountInfo.name} • {account.provider}</p>
                          <p className="text-sm text-gray-500">Last sync: {account.lastSync.toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900">{formatCurrency(account.balance)}</div>
                        <div className={`text-sm px-3 py-1 rounded-full ${
                          account.taxStatus === 'pre-tax' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {account.taxStatus === 'pre-tax' ? 'Traditional (Pre-tax)' : 'Roth (Post-tax)'}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Contribution Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Employee:</span>
                            <span className="font-medium">{formatCurrency(account.contributions.employee)}</span>
                          </div>
                          {account.contributions.employer > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Employer:</span>
                              <span className="font-medium text-success-600">{formatCurrency(account.contributions.employer)}</span>
                            </div>
                          )}
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-600">Total:</span>
                            <span className="font-semibold">{formatCurrency(account.contributions.total)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Contribution Limits</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Annual Limit:</span>
                            <span className="font-medium">{formatCurrency(account.limits.annual)}</span>
                          </div>
                          {account.limits.catchUp && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Catch-up (50+):</span>
                              <span className="font-medium">{formatCurrency(account.limits.catchUp)}</span>
                            </div>
                          )}
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-600">Remaining:</span>
                            <span className="font-semibold text-primary-600">
                              {formatCurrency(account.limits.annual - account.contributions.total)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Tax Impact</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax Savings:</span>
                            <span className="font-medium text-success-600">
                              {account.taxStatus === 'pre-tax' 
                                ? formatCurrency(account.contributions.employee * 0.24)
                                : 'Tax-free growth'
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className="font-medium">
                              {account.taxStatus === 'pre-tax' ? 'Deductible' : 'After-tax'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Retirement Tax Education Center</h3>
                <p className="text-sm text-blue-700">
                  Understanding tax rules is crucial for optimizing your retirement savings. Learn about contribution limits, 
                  withdrawal rules, and tax implications to make informed decisions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {taxRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelectedRule(rule)}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        {getCategoryIcon(rule.category)}
                      </div>
                      <h3 className="font-semibold text-gray-900">{rule.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{rule.description}</p>
                    <div className="space-y-2">
                      {rule.details.slice(0, 2).map((detail, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-success-500 mr-2 flex-shrink-0" />
                          {detail}
                        </div>
                      ))}
                      {rule.details.length > 2 && (
                        <div className="text-sm text-primary-600 font-medium">
                          +{rule.details.length - 2} more details...
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tax Rule Detail Modal */}
              {selectedRule && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          {getCategoryIcon(selectedRule.category)}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedRule.title}</h2>
                      </div>
                      <button
                        onClick={() => setSelectedRule(null)}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                      >
                        ×
                      </button>
                    </div>

                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                      <p className="text-gray-700 mb-6">{selectedRule.description}</p>

                      <div className="space-y-6">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Key Details</h3>
                          <div className="space-y-2">
                            {selectedRule.details.map((detail, index) => (
                              <div key={index} className="flex items-start text-sm text-gray-700">
                                <CheckCircle className="w-4 h-4 text-success-500 mr-2 mt-0.5 flex-shrink-0" />
                                {detail}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Applicable Account Types</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedRule.applicableAccounts.map((accountType) => {
                              const info = getAccountTypeInfo(accountType);
                              return (
                                <span
                                  key={accountType}
                                  className={`px-3 py-1 rounded-full text-sm font-medium bg-${info.color}-100 text-${info.color}-800`}
                                >
                                  {info.name}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {selectedRule.examples && selectedRule.examples.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Examples</h3>
                            <div className="space-y-4">
                              {selectedRule.examples.map((example, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-900 mb-2">Scenario:</h4>
                                  <p className="text-sm text-gray-700 mb-3">{example.scenario}</p>
                                  
                                  <h4 className="font-medium text-gray-900 mb-2">Calculation:</h4>
                                  <p className="text-sm text-gray-700 mb-3 font-mono bg-white p-2 rounded">
                                    {example.calculation}
                                  </p>
                                  
                                  <h4 className="font-medium text-gray-900 mb-2">Result:</h4>
                                  <p className="text-sm font-semibold text-primary-600">{example.result}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary-50 to-success-50 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Lightbulb className="w-6 h-6 text-primary-600" />
                  <h3 className="font-semibold text-primary-900">AI Tax Optimization Recommendations</h3>
                </div>
                <p className="text-sm text-primary-700">
                  Based on your current retirement accounts and tax situation, here are personalized strategies 
                  to minimize taxes and maximize your retirement savings.
                </p>
              </div>

              <div className="space-y-6">
                {mockTaxRecommendations.map((recommendation) => (
                  <div key={recommendation.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <Calculator className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{recommendation.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(recommendation.priority)}`}>
                              {recommendation.priority} priority
                            </span>
                            <span className="text-sm text-gray-500 capitalize">{recommendation.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-success-600">
                          +{formatCurrency(recommendation.potentialSavings)}
                        </div>
                        <div className="text-sm text-gray-500">Potential savings</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Recommendation</h4>
                        <p className="text-gray-700">{recommendation.description}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Tax Implications</h4>
                        <p className="text-gray-700">{recommendation.taxImplication}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Action Steps</h4>
                        <div className="space-y-2">
                          {recommendation.actionSteps.map((step, index) => (
                            <div key={index} className="flex items-start text-sm text-gray-700">
                              <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                                {index + 1}
                              </span>
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>

                      {recommendation.deadline && (
                        <div className="bg-warning-50 border border-warning-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-warning-600" />
                            <span className="text-sm font-medium text-warning-800">
                              Deadline: {recommendation.deadline}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                          Learn More
                        </button>
                        <button className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                          Implement Strategy
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Import Retirement Account</h2>
            <p className="text-gray-600 mb-6">
              Connect your 401(k) or other retirement accounts to get personalized tax optimization strategies.
            </p>
            
            <div className="space-y-3 mb-6">
              {['Fidelity', 'Vanguard', 'Charles Schwab', 'T. Rowe Price', 'Principal', 'Empower'].map((provider) => (
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