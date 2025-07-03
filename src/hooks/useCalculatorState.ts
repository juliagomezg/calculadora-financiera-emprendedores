import { useReducer, useCallback } from 'react';

export interface CalculatorState {
  breakEven: {
    fixedCosts: number;
    pricePerUnit: number;
    variableCostPerUnit: number;
    breakEvenPoint: number;
    contributionMargin: number;
    contributionMarginRatio: number;
  };
  roi: {
    initialInvestment: number;
    netProfit: number;
    timeframe: number;
    roi: number;
    annualizedRoi: number;
    paybackPeriod: number;
  };
  unitCost: {
    productionVolume: number;
    costs: Array<{
      id: string;
      name: string;
      cost: number;
      type: 'fixed' | 'variable';
    }>;
    totalFixedCost: number;
    totalVariableCost: number;
    fixedCostPerUnit: number;
    variableCostPerUnit: number;
    totalCostPerUnit: number;
  };
  profit: {
    totalRevenue: number;
    totalCosts: number;
    salesPrice: number;
    unitCost: number;
    grossProfit: number;
    profitMargin: number;
    unitProfitMargin: number;
    markupPercentage: number;
  };
}

type CalculatorAction =
  | { type: 'UPDATE_BREAK_EVEN'; payload: Partial<CalculatorState['breakEven']> }
  | { type: 'UPDATE_ROI'; payload: Partial<CalculatorState['roi']> }
  | { type: 'UPDATE_UNIT_COST'; payload: Partial<CalculatorState['unitCost']> }
  | { type: 'UPDATE_PROFIT'; payload: Partial<CalculatorState['profit']> }
  | { type: 'RESET_CALCULATOR'; calculatorType: keyof CalculatorState };

const initialState: CalculatorState = {
  breakEven: {
    fixedCosts: 8000,
    pricePerUnit: 25,
    variableCostPerUnit: 15,
    breakEvenPoint: 0,
    contributionMargin: 0,
    contributionMarginRatio: 0,
  },
  roi: {
    initialInvestment: 500,
    netProfit: 200,
    timeframe: 1,
    roi: 0,
    annualizedRoi: 0,
    paybackPeriod: 0,
  },
  unitCost: {
    productionVolume: 50,
    costs: [
      { id: '1', name: 'Chaquiras y cuentas', cost: 200, type: 'variable' },
      { id: '2', name: 'Hilo elástico', cost: 100, type: 'variable' },
      { id: '3', name: 'Mesa de trabajo', cost: 300, type: 'fixed' },
      { id: '4', name: 'Publicidad', cost: 100, type: 'fixed' }
    ],
    totalFixedCost: 0,
    totalVariableCost: 0,
    fixedCostPerUnit: 0,
    variableCostPerUnit: 0,
    totalCostPerUnit: 0,
  },
  profit: {
    totalRevenue: 1000,
    totalCosts: 600,
    salesPrice: 20,
    unitCost: 12,
    grossProfit: 0,
    profitMargin: 0,
    unitProfitMargin: 0,
    markupPercentage: 0,
  },
};

function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'UPDATE_BREAK_EVEN':
      return {
        ...state,
        breakEven: { ...state.breakEven, ...action.payload }
      };
    case 'UPDATE_ROI':
      return {
        ...state,
        roi: { ...state.roi, ...action.payload }
      };
    case 'UPDATE_UNIT_COST':
      return {
        ...state,
        unitCost: { ...state.unitCost, ...action.payload }
      };
    case 'UPDATE_PROFIT':
      return {
        ...state,
        profit: { ...state.profit, ...action.payload }
      };
    case 'RESET_CALCULATOR':
      return {
        ...state,
        [action.calculatorType]: initialState[action.calculatorType]
      };
    default:
      return state;
  }
}

export function useCalculatorState() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  const updateBreakEven = useCallback((payload: Partial<CalculatorState['breakEven']>) => {
    dispatch({ type: 'UPDATE_BREAK_EVEN', payload });
  }, []);

  const updateROI = useCallback((payload: Partial<CalculatorState['roi']>) => {
    dispatch({ type: 'UPDATE_ROI', payload });
  }, []);

  const updateUnitCost = useCallback((payload: Partial<CalculatorState['unitCost']>) => {
    dispatch({ type: 'UPDATE_UNIT_COST', payload });
  }, []);

  const updateProfit = useCallback((payload: Partial<CalculatorState['profit']>) => {
    dispatch({ type: 'UPDATE_PROFIT', payload });
  }, []);

  const resetCalculator = useCallback((calculatorType: keyof CalculatorState) => {
    dispatch({ type: 'RESET_CALCULATOR', calculatorType });
  }, []);

  return {
    state,
    updateBreakEven,
    updateROI,
    updateUnitCost,
    updateProfit,
    resetCalculator,
  };
}