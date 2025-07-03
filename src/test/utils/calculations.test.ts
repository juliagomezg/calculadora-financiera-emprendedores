import { describe, it, expect } from 'vitest';
import {
  calculateBreakEven,
  calculateROI,
  calculateProfit,
  formatCurrency,
  formatPercentage,
  validateNumericInput
} from '../../utils/calculations';

describe('calculateBreakEven', () => {
  it('calculates break-even point correctly', () => {
    const result = calculateBreakEven({
      fixedCosts: 8000,
      pricePerUnit: 25,
      variableCostPerUnit: 15
    });

    expect(result.isValid).toBe(true);
    expect(result.breakEvenPoint).toBe(800);
    expect(result.contributionMargin).toBe(10);
    expect(result.contributionMarginRatio).toBe(40);
  });

  it('handles invalid inputs', () => {
    const result = calculateBreakEven({
      fixedCosts: 8000,
      pricePerUnit: 10,
      variableCostPerUnit: 15
    });

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('El precio debe ser mayor al costo variable');
  });

  it('handles negative fixed costs', () => {
    const result = calculateBreakEven({
      fixedCosts: -1000,
      pricePerUnit: 25,
      variableCostPerUnit: 15
    });

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('Los costos fijos no pueden ser negativos');
  });
});

describe('calculateROI', () => {
  it('calculates ROI correctly', () => {
    const result = calculateROI({
      initialInvestment: 500,
      netProfit: 200,
      timeframe: 1
    });

    expect(result.isValid).toBe(true);
    expect(result.roi).toBe(40);
    expect(result.paybackPeriod).toBe(2.5);
  });

  it('handles zero investment', () => {
    const result = calculateROI({
      initialInvestment: 0,
      netProfit: 200,
      timeframe: 1
    });

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('La inversión inicial debe ser mayor a cero');
  });
});

describe('calculateProfit', () => {
  it('calculates profit metrics correctly', () => {
    const result = calculateProfit({
      totalRevenue: 1000,
      totalCosts: 600,
      salesPrice: 20,
      unitCost: 12
    });

    expect(result.isValid).toBe(true);
    expect(result.grossProfit).toBe(400);
    expect(result.profitMargin).toBe(40);
    expect(result.unitProfitMargin).toBe(40);
    expect(result.markupPercentage).toBeCloseTo(66.67, 1);
  });

  it('handles negative values', () => {
    const result = calculateProfit({
      totalRevenue: -100,
      totalCosts: 600,
      salesPrice: 20,
      unitCost: 12
    });

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('Los valores no pueden ser negativos');
  });
});

describe('formatCurrency', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(1000)).toBe('$1,000');
    expect(formatCurrency(1234.56)).toBe('$1,235');
  });
});

describe('formatPercentage', () => {
  it('formats percentage correctly', () => {
    expect(formatPercentage(25.5)).toBe('25.5%');
    expect(formatPercentage(25.567, 2)).toBe('25.57%');
  });
});

describe('validateNumericInput', () => {
  it('validates numeric input correctly', () => {
    expect(validateNumericInput('123')).toEqual({ isValid: true, numericValue: 123 });
    expect(validateNumericInput('123.45')).toEqual({ isValid: true, numericValue: 123.45 });
    expect(validateNumericInput('abc')).toEqual({ isValid: false, numericValue: 0 });
    expect(validateNumericInput('')).toEqual({ isValid: false, numericValue: 0 });
  });
});