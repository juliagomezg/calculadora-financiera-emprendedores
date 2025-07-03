import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BreakEvenCalculator from '../../components/calculators/BreakEvenCalculator';
import { useCalculatorState } from '../../hooks/useCalculatorState';

// Mock the hooks
vi.mock('../../hooks/useCalculatorState');
vi.mock('../../hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackCalculation: vi.fn(),
    trackTutorialView: vi.fn(),
  }),
}));

const mockCalculatorState = {
  state: {
    breakEven: {
      fixedCosts: 8000,
      pricePerUnit: 25,
      variableCostPerUnit: 15,
      breakEvenPoint: 800,
      contributionMargin: 10,
      contributionMarginRatio: 40,
    },
  },
  updateBreakEven: vi.fn(),
  updateROI: vi.fn(),
  updateUnitCost: vi.fn(),
  updateProfit: vi.fn(),
  resetCalculator: vi.fn(),
};

describe('BreakEvenCalculator', () => {
  beforeEach(() => {
    vi.mocked(useCalculatorState).mockReturnValue(mockCalculatorState);
  });

  it('renders the calculator with initial values', () => {
    render(<BreakEvenCalculator calculatorState={mockCalculatorState} />);
    
    expect(screen.getByText('Tu Primer Negocio')).toBeInTheDocument();
    expect(screen.getByDisplayValue('8000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('25')).toBeInTheDocument();
    expect(screen.getByDisplayValue('15')).toBeInTheDocument();
  });

  it('calculates break-even point correctly', () => {
    render(<BreakEvenCalculator calculatorState={mockCalculatorState} />);
    
    // The break-even point should be displayed
    expect(screen.getByText('800 productos al mes')).toBeInTheDocument();
  });

  it('updates values when inputs change', async () => {
    const user = userEvent.setup();
    render(<BreakEvenCalculator calculatorState={mockCalculatorState} />);
    
    const fixedCostsInput = screen.getByDisplayValue('8000');
    await user.clear(fixedCostsInput);
    await user.type(fixedCostsInput, '10000');
    
    expect(mockCalculatorState.updateBreakEven).toHaveBeenCalled();
  });

  it('shows tutorial when help button is clicked', async () => {
    const user = userEvent.setup();
    render(<BreakEvenCalculator calculatorState={mockCalculatorState} />);
    
    const helpButton = screen.getByText('Ver ejemplo');
    await user.click(helpButton);
    
    expect(screen.getByText(/Tu Papelería "El Lápiz Mágico"/)).toBeInTheDocument();
  });

  it('handles negative contribution margin', () => {
    const negativeMarginState = {
      ...mockCalculatorState,
      state: {
        breakEven: {
          ...mockCalculatorState.state.breakEven,
          contributionMargin: -5,
        },
      },
    };
    
    vi.mocked(useCalculatorState).mockReturnValue(negativeMarginState);
    render(<BreakEvenCalculator calculatorState={negativeMarginState} />);
    
    expect(screen.getByText(/¡Cuidado! Estás vendiendo más barato/)).toBeInTheDocument();
  });

  it('is accessible with proper ARIA labels', () => {
    render(<BreakEvenCalculator calculatorState={mockCalculatorState} />);
    
    const inputs = screen.getAllByRole('spinbutton');
    inputs.forEach(input => {
      expect(input).toHaveAccessibleName();
    });
  });
});