import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCalculatorState } from '../../hooks/useCalculatorState';

describe('useCalculatorState', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useCalculatorState());
    
    expect(result.current.state.breakEven.fixedCosts).toBe(8000);
    expect(result.current.state.breakEven.pricePerUnit).toBe(25);
    expect(result.current.state.breakEven.variableCostPerUnit).toBe(15);
  });

  it('updates break-even values correctly', () => {
    const { result } = renderHook(() => useCalculatorState());
    
    act(() => {
      result.current.updateBreakEven({ fixedCosts: 10000 });
    });
    
    expect(result.current.state.breakEven.fixedCosts).toBe(10000);
  });

  it('updates ROI values correctly', () => {
    const { result } = renderHook(() => useCalculatorState());
    
    act(() => {
      result.current.updateROI({ initialInvestment: 1000 });
    });
    
    expect(result.current.state.roi.initialInvestment).toBe(1000);
  });

  it('resets calculator to initial state', () => {
    const { result } = renderHook(() => useCalculatorState());
    
    // First, modify the state
    act(() => {
      result.current.updateBreakEven({ fixedCosts: 10000 });
    });
    
    expect(result.current.state.breakEven.fixedCosts).toBe(10000);
    
    // Then reset
    act(() => {
      result.current.resetCalculator('breakEven');
    });
    
    expect(result.current.state.breakEven.fixedCosts).toBe(8000);
  });

  it('handles partial updates correctly', () => {
    const { result } = renderHook(() => useCalculatorState());
    
    act(() => {
      result.current.updateBreakEven({ 
        fixedCosts: 12000,
        pricePerUnit: 30 
      });
    });
    
    expect(result.current.state.breakEven.fixedCosts).toBe(12000);
    expect(result.current.state.breakEven.pricePerUnit).toBe(30);
    expect(result.current.state.breakEven.variableCostPerUnit).toBe(15); // unchanged
  });
});