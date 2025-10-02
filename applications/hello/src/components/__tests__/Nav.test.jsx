import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Nav from '../Nav';

describe('Nav Component', () => {
  it('should render all navigation items', () => {
    const mockOnPageChange = vi.fn();
    render(<Nav currentPage="my-card" onPageChange={mockOnPageChange} />);

    expect(screen.getByText('My Card')).toBeInTheDocument();
    expect(screen.getByText('Scan')).toBeInTheDocument();
    expect(screen.getByText('Hellos')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should highlight active page', () => {
    const mockOnPageChange = vi.fn();
    const { container } = render(<Nav currentPage="scan" onPageChange={mockOnPageChange} />);

    const scanButton = screen.getByText('Scan').closest('button');
    expect(scanButton).toHaveClass('text-[#8B70F6]');
  });

  it('should call onPageChange when nav item is clicked', () => {
    const mockOnPageChange = vi.fn();
    render(<Nav currentPage="my-card" onPageChange={mockOnPageChange} />);

    const hellosButton = screen.getByText('Hellos');
    fireEvent.click(hellosButton);

    expect(mockOnPageChange).toHaveBeenCalledWith('hellos');
  });

  it('should render all 4 navigation items', () => {
    const mockOnPageChange = vi.fn();
    const { container } = render(<Nav currentPage="my-card" onPageChange={mockOnPageChange} />);

    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(4);
  });

  it('should apply correct styling to active item', () => {
    const mockOnPageChange = vi.fn();
    render(<Nav currentPage="my-card" onPageChange={mockOnPageChange} />);

    const myCardButton = screen.getByText('My Card').closest('button');
    expect(myCardButton?.className).toContain('text-[#8B70F6]');
  });

  it('should apply correct styling to inactive items', () => {
    const mockOnPageChange = vi.fn();
    render(<Nav currentPage="my-card" onPageChange={mockOnPageChange} />);

    const scanButton = screen.getByText('Scan').closest('button');
    expect(scanButton?.className).toContain('text-[#6B6B6B]');
  });
});
