import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import Spinner from '@/components/Spinner';

describe('Spinner Component', () => {
  it('renders with default props', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toBeInTheDocument();
  });

  it('renders with fullPage prop', () => {
    render(<Spinner fullPage={true} />);
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('fixed', 'inset-0', 'bg-gray-500', 'bg-opacity-50', 'z-50');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Spinner size="sm" />);
    let spinner = screen.getByRole('status', { hidden: true });
    expect(spinner.firstChild).toHaveClass('w-6', 'h-6');

    rerender(<Spinner size="lg" />);
    spinner = screen.getByRole('status', { hidden: true });
    expect(spinner.firstChild).toHaveClass('w-20', 'h-20');
  });

  it('renders with custom color', () => {
    render(<Spinner color="text-red-500" />);
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner.firstChild).toHaveClass('text-red-500');
  });
}); 