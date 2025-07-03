/**
 * Financial calculation utilities with proper error handling
 */

export interface BreakEvenInputs {
  fixedCosts: number;
  pricePerUnit: number;
  variableCostPerUnit: number;
}

export interface BreakEvenResults {
  breakEvenPoint: number;
  contributionMargin: number;
  contributionMarginRatio: number;
  isValid: boolean;
  errorMessage?: string;
}

export function calculateBreakEven(inputs: BreakEvenInputs): BreakEvenResults {
  const { fixedCosts, pricePerUnit, variableCostPerUnit } = inputs;

  // Validation
  if (fixedCosts < 0) {
    return {
      breakEvenPoint: 0,
      contributionMargin: 0,
      contributionMarginRatio: 0,
      isValid: false,
      errorMessage: 'Los costos fijos no pueden ser negativos'
    };
  }

  if (pricePerUnit <= 0) {
    return {
      breakEvenPoint: 0,
      contributionMargin: 0,
      contributionMarginRatio: 0,
      isValid: false,
      errorMessage: 'El precio por unidad debe ser mayor a cero'
    };
  }

  if (variableCostPerUnit < 0) {
    return {
      breakEvenPoint: 0,
      contributionMargin: 0,
      contributionMarginRatio: 0,
      isValid: false,
      errorMessage: 'El costo variable no puede ser negativo'
    };
  }

  const contributionMargin = pricePerUnit - variableCostPerUnit;
  
  if (contributionMargin <= 0) {
    return {
      breakEvenPoint: 0,
      contributionMargin,
      contributionMarginRatio: 0,
      isValid: false,
      errorMessage: 'El precio debe ser mayor al costo variable'
    };
  }

  const contributionMarginRatio = (contributionMargin / pricePerUnit) * 100;
  const breakEvenPoint = fixedCosts / contributionMargin;

  return {
    breakEvenPoint,
    contributionMargin,
    contributionMarginRatio,
    isValid: true
  };
}

export interface ROIInputs {
  initialInvestment: number;
  netProfit: number;
  timeframe: number;
}

export interface ROIResults {
  roi: number;
  annualizedRoi: number;
  paybackPeriod: number;
  isValid: boolean;
  errorMessage?: string;
}

export function calculateROI(inputs: ROIInputs): ROIResults {
  const { initialInvestment, netProfit, timeframe } = inputs;

  // Validation
  if (initialInvestment <= 0) {
    return {
      roi: 0,
      annualizedRoi: 0,
      paybackPeriod: 0,
      isValid: false,
      errorMessage: 'La inversión inicial debe ser mayor a cero'
    };
  }

  if (timeframe <= 0) {
    return {
      roi: 0,
      annualizedRoi: 0,
      paybackPeriod: 0,
      isValid: false,
      errorMessage: 'El período de tiempo debe ser mayor a cero'
    };
  }

  const roi = (netProfit / initialInvestment) * 100;
  const annualizedRoi = (Math.pow(1 + (roi / 100), 12 / timeframe) - 1) * 100;
  const paybackPeriod = netProfit > 0 ? (initialInvestment / netProfit) * timeframe : 0;

  return {
    roi,
    annualizedRoi,
    paybackPeriod,
    isValid: true
  };
}

export interface ProfitInputs {
  totalRevenue: number;
  totalCosts: number;
  salesPrice: number;
  unitCost: number;
}

export interface ProfitResults {
  grossProfit: number;
  profitMargin: number;
  unitProfitMargin: number;
  markupPercentage: number;
  isValid: boolean;
  errorMessage?: string;
}

export function calculateProfit(inputs: ProfitInputs): ProfitResults {
  const { totalRevenue, totalCosts, salesPrice, unitCost } = inputs;

  // Validation
  if (totalRevenue < 0 || totalCosts < 0 || salesPrice < 0 || unitCost < 0) {
    return {
      grossProfit: 0,
      profitMargin: 0,
      unitProfitMargin: 0,
      markupPercentage: 0,
      isValid: false,
      errorMessage: 'Los valores no pueden ser negativos'
    };
  }

  const grossProfit = totalRevenue - totalCosts;
  const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
  const unitProfitMargin = salesPrice > 0 ? ((salesPrice - unitCost) / salesPrice) * 100 : 0;
  const markupPercentage = unitCost > 0 ? ((salesPrice - unitCost) / unitCost) * 100 : 0;

  return {
    grossProfit,
    profitMargin,
    unitProfitMargin,
    markupPercentage,
    isValid: true
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, locale: string = 'es-MX'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Validate numeric input
 */
export function validateNumericInput(value: string): { isValid: boolean; numericValue: number } {
  const numericValue = parseFloat(value);
  const isValid = !isNaN(numericValue) && isFinite(numericValue);
  
  return {
    isValid,
    numericValue: isValid ? numericValue : 0
  };
}