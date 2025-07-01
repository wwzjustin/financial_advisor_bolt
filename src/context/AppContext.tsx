import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, FinancialGoal, Asset, AIInsight } from '../types';

interface AppState {
  user: User | null;
  goals: FinancialGoal[];
  assets: Asset[];
  insights: AIInsight[];
}

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'ADD_GOAL'; payload: FinancialGoal }
  | { type: 'ADD_ASSET'; payload: Asset }
  | { type: 'UPDATE_ASSET'; payload: { id: string; asset: Partial<Asset> } }
  | { type: 'DELETE_ASSET'; payload: string }
  | { type: 'SET_INSIGHTS'; payload: AIInsight[] };

const initialState: AppState = {
  user: null,
  goals: [],
  assets: [],
  insights: [],
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    case 'ADD_ASSET':
      return { ...state, assets: [...state.assets, action.payload] };
    case 'UPDATE_ASSET':
      return {
        ...state,
        assets: state.assets.map(asset =>
          asset.id === action.payload.id
            ? { ...asset, ...action.payload.asset }
            : asset
        ),
      };
    case 'DELETE_ASSET':
      return {
        ...state,
        assets: state.assets.filter(asset => asset.id !== action.payload),
      };
    case 'SET_INSIGHTS':
      return { ...state, insights: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}