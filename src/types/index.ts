export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  targetRetirementYear: number;
  currentYear: number;
}

export interface FinancialGoal {
  id: string;
  type: 'net_worth' | 'passive_income';
  targetAmount: number;
  description: string;
}

export interface Asset {
  id: string;
  type: 'real_estate' | 'investment' | 'retirement';
  name: string;
  currentValue: number;
  monthlyContribution?: number;
  expectedAnnualReturn?: number;
  details?: any;
}

export interface RealEstateAsset extends Asset {
  type: 'real_estate';
  details: {
    address: string;
    propertyType: string;
    purchasePrice: number;
    currentValue: number;
    mortgageBalance: number;
    monthlyPayment: number;
    appreciationRate: number;
  };
}

export interface InvestmentAsset extends Asset {
  type: 'investment';
  details: {
    portfolioType: string;
    riskLevel: 'conservative' | 'moderate' | 'aggressive';
    expectedReturn: number;
  };
}

export interface RetirementAsset extends Asset {
  type: 'retirement';
  details: {
    accountType: '401k' | 'ira' | 'roth_ira';
    employerMatch?: number;
    contributionLimit: number;
    currentContribution: number;
  };
}

export interface AIInsight {
  id: string;
  type: 'tip' | 'warning' | 'opportunity';
  title: string;
  description: string;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
}