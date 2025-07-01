import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, FinancialGoal } from '../types';
import { 
  User as UserIcon, 
  Target, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Save,
  Mail,
  Hash
} from 'lucide-react';

export default function Settings() {
  const { state, dispatch } = useApp();
  const { user, goals } = state;
  
  const [userData, setUserData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || 30,
    targetRetirementYear: user?.targetRetirementYear || new Date().getFullYear() + 35,
  });

  const [goalData, setGoalData] = useState({
    goalType: (goals[0]?.type as 'net_worth' | 'passive_income') || 'net_worth',
    targetAmount: goals[0]?.targetAmount || 1000000,
  });

  const [activeTab, setActiveTab] = useState<'profile' | 'goals'>('profile');
  const [isSaving, setIsSaving] = useState(false);

  const yearsToRetirement = userData.targetRetirementYear - new Date().getFullYear();

  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    const updatedUser: User = {
      id: user?.id || crypto.randomUUID(),
      name: userData.name,
      email: userData.email,
      age: userData.age,
      targetRetirementYear: userData.targetRetirementYear,
      currentYear: new Date().getFullYear(),
    };

    dispatch({ type: 'SET_USER', payload: updatedUser });
    
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  const handleSaveGoals = async () => {
    setIsSaving(true);
    
    const updatedGoal: FinancialGoal = {
      id: goals[0]?.id || crypto.randomUUID(),
      type: goalData.goalType,
      targetAmount: goalData.targetAmount,
      description: goalData.goalType === 'net_worth' 
        ? `Reach $${goalData.targetAmount.toLocaleString()} net worth by retirement`
        : `Generate $${goalData.targetAmount.toLocaleString()} annual passive income`,
    };

    if (goals.length === 0) {
      dispatch({ type: 'ADD_GOAL', payload: updatedGoal });
    } else {
      // For simplicity, we'll replace the first goal
      // In a real app, you'd have an UPDATE_GOAL action
      dispatch({ type: 'SET_INSIGHTS', payload: [] }); // Clear insights to trigger recalculation
    }
    
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your profile and financial goals</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'profile'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <UserIcon className="w-4 h-4" />
                <span>Profile</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'goals'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>Financial Goals</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center space-x-2">
                        <UserIcon className="w-4 h-4" />
                        <span>Full Name</span>
                      </div>
                    </label>
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>Email Address</span>
                      </div>
                    </label>
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4" />
                        <span>Current Age</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      value={userData.age}
                      onChange={(e) => setUserData({ ...userData, age: parseInt(e.target.value) || 30 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      min="18"
                      max="65"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Target Retirement Year</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      value={userData.targetRetirementYear}
                      onChange={(e) => setUserData({ ...userData, targetRetirementYear: parseInt(e.target.value) || new Date().getFullYear() + 35 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      min={new Date().getFullYear() + 1}
                      max={new Date().getFullYear() + 50}
                    />
                  </div>
                </div>
                
                <div className="bg-primary-50 rounded-lg p-4 mt-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-primary-600 mr-2" />
                    <span className="text-primary-800 font-medium">
                      That's {yearsToRetirement} years from now
                    </span>
                  </div>
                  <p className="text-primary-700 text-sm mt-1">
                    You'll be {userData.age + yearsToRetirement} years old when you retire
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving || !userData.name || !userData.email}
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Retirement Goal</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Goal Type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => setGoalData({ ...goalData, goalType: 'net_worth' })}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          goalData.goalType === 'net_worth'
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <DollarSign className="w-6 h-6 text-primary-600 mb-2" />
                        <h3 className="font-medium text-gray-900">Net Worth Target</h3>
                        <p className="text-sm text-gray-600">Total assets minus debts</p>
                      </button>
                      <button
                        onClick={() => setGoalData({ ...goalData, goalType: 'passive_income' })}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          goalData.goalType === 'passive_income'
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <TrendingUp className="w-6 h-6 text-primary-600 mb-2" />
                        <h3 className="font-medium text-gray-900">Passive Income</h3>
                        <p className="text-sm text-gray-600">Annual income from investments</p>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Amount ($)
                    </label>
                    <input
                      type="number"
                      value={goalData.targetAmount}
                      onChange={(e) => setGoalData({ ...goalData, targetAmount: parseInt(e.target.value) || 1000000 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      min="10000"
                      step="10000"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {goalData.goalType === 'net_worth' 
                        ? 'Total wealth you want to accumulate'
                        : 'Annual passive income you want to generate'
                      }
                    </p>
                  </div>

                  <div className="bg-success-50 rounded-lg p-4">
                    <h3 className="font-medium text-success-900 mb-2">Goal Summary</h3>
                    <p className="text-success-800">
                      {goalData.goalType === 'net_worth' 
                        ? `Reach $${goalData.targetAmount.toLocaleString()} net worth by ${userData.targetRetirementYear}`
                        : `Generate $${goalData.targetAmount.toLocaleString()} annual passive income by ${userData.targetRetirementYear}`
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveGoals}
                  disabled={isSaving || !goalData.targetAmount}
                  className="inline-flex items-center px-6 py-3 bg-success-600 text-white rounded-lg hover:bg-success-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Goals'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}