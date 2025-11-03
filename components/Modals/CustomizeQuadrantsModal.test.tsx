import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CustomizeQuadrantsModal } from './CustomizeQuadrantsModal';

describe('CustomizeQuadrantsModal', () => {
  const defaultQuadrants = ['Tools', 'Techniques', 'Platforms', 'Languages'];
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(
        <CustomizeQuadrantsModal
          isOpen={false}
          onClose={mockOnClose}
          currentQuadrants={defaultQuadrants}
          onSave={mockOnSave}
        />
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(
        <CustomizeQuadrantsModal
          isOpen={true}
          onClose={mockOnClose}
          currentQuadrants={defaultQuadrants}
          onSave={mockOnSave}
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Customize Quadrants')).toBeInTheDocument();
    });

    it('should render 4 input fields with current quadrant names', () => {
      render(
        <CustomizeQuadrantsModal
          isOpen={true}
          onClose={mockOnClose}
          currentQuadrants={defaultQuadrants}
          onSave={mockOnSave}
        />
      );

      expect(screen.getByLabelText('Quadrant 1')).toHaveValue('Tools');
      expect(screen.getByLabelText('Quadrant 2')).toHaveValue('Techniques');
      expect(screen.getByLabelText('Quadrant 3')).toHaveValue('Platforms');
      expect(screen.getByLabelText('Quadrant 4')).toHaveValue('Languages');
    });

    it('should render Save and Cancel buttons', () => {
      render(
        <CustomizeQuadrantsModal
          isOpen={true}
          onClose={mockOnClose}
          currentQuadrants={defaultQuadrants}
          onSave={mockOnSave}
        />
      );

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    });

    it('should render close button', () => {
      render(
        <CustomizeQuadrantsModal
          isOpen={true}
          onClose={mockOnClose}
          currentQuadrants={defaultQuadrants}
          onSave={mockOnSave}
        />
      );

      expect(screen.getByRole('button', { name: /close modal/i })).toBeInTheDocument();
    });

    it('should show saving state when isSaving is true', () => {
      render(
        <CustomizeQuadrantsModal
          isOpen={true}
          onClose={mockOnClose}
          currentQuadrants={defaultQuadrants}
          onSave={mockOnSave}
          isSaving={true}
        />
      );

      expect(screen.getByText('Saving...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    it('should update input value when typing', () => {
      render(
        <CustomizeQuadrantsModal
          isOpen={true}
          onClose={mockOnClose}
          currentQuadrants={defaultQuadrants}
          onSave={mockOnSave}
        />
      );

      const input = screen.getByLabelText('Quadrant 1');
      fireEvent.change(input, { target: { value: 'Custom Tools' } });

      expect(input).toHaveValue('Custom Tools');
    });

    it('should call onSave with updated quadrants when Save is clicked', async () => {
      render(
        <CustomizeQuadrantsModal
          isOpen={true}
          onClose={mockOnClose}
          currentQuadrants={defaultQuadrants}
          onSave={mockOnSave}
        />
      );

      const input1 = screen.getByLabelText('Quadrant 1');
      const input2 = screen.getByLabelText('Quadrant 2');

      fireEvent.change(input1, { target: { value: 'Custom Tools' } });
      fireEvent.change(input2, { target: { value: 'Custom Techniques' } });

      const saveButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledTimes(1);
        expect(mockOnSave).toHaveBeenCalledWith([
          'Custom Tools',
          'Custom Techniques',
          'Platforms',
          'Languages',
        ]);
      });
    });

    it('should call onClose when Cancel is clicked', () => {
      render(
        <CustomizeQuadrantsModal
          isOpen={true}
          onClose={mockOnClose}
          currentQuadrants={defaultQuadrants}
          onSave={mockOnSave}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when close button is clicked', () => {
      render(
        <CustomizeQuadrantsModal
          isOpen={true}
          onClose={mockOnClose}
          currentQuadrants={defaultQuadrants}
          onSave={mockOnSave}
        />
      );

      const closeButton = screen.getByRole('button', { name: /close modal/i });
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked', () => {
      render(
        <CustomizeQuadrantsModal
          isOpen={true}
          onClose={mockOnClose}
          currentQuadrants={defaultQuadrants}
          onSave={mockOnSave}
        />
      );

      const backdrop = screen.getByRole('dialog');
      fireEvent.click(backdrop);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when clicking inside modal', () => {
      render(
        <CustomizeQuadrantsModal
          isOpen={true}
          onClose={mockOnClose}
          currentQuadrants={defaultQuadrants}
          onSave={mockOnSave}
        />
      );

      const title = screen.getByText('Customize Quadrants');
      fireEvent.click(title);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should reset fields when modal is opened', () => {
      const { rerender } = render(
        <CustomizeQuadrantsModal
          isOpen={true}
          onClose={mockOnClose}
          currentQuadrants={defaultQuadrants}
          onSave={mockOnSave}
        />
      );

      // Change a field
      const input = screen.getByLabelText('Quadrant 1');
      fireEvent.change(input, { target: { value: 'Modified' } });
      expect(input).toHaveValue('Modified');

      // Close and reopen modal
      rerender(
        <CustomizeQuadrantsModal
          isOpen={false}
          onClose={mockOnClose}
          currentQuadrants={defaultQuadrants}
          onSave={mockOnSave}
        />
      );

      rerender(
        <CustomizeQuadrantsModal
          isOpen={true}
          onClose={mockOnClose}
          currentQuadrants={defaultQuadrants}
          onSave={mockOnSave}
        />
      );

      // Field should be reset
      const resetInput = screen.getByLabelText('Quadrant 1');
      expect(resetInput).toHaveValue('Tools');
    });

    it('should trim whitespace from quadrant names when saving', async () => {
      render(
        <CustomizeQuadrantsModal
          isOpen={true}
          onClose={mockOnClose}
          currentQuadrants={defaultQuadrants}
          onSave={mockOnSave}
        />
      );

      const input = screen.getByLabelText('Quadrant 1');
      fireEvent.change(input, { target: { value: '  Trimmed  ' } });

      const saveButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith([
          'Trimmed',
          'Techniques',
          'Platforms',
          'Languages',
        ]);
      });
    });
  });

  describe('Validation', () => {
    it('should show error when quadrant name is empty', async () => {
      render(
        <CustomizeQuadrantsModal
          isOpen={true}
          onClose={mockOnClose}
          currentQuadrants={defaultQuadrants}
          onSave={mockOnSave}
        />
      );

      const input = screen.getByLabelText('Quadrant 1');
      fireEvent.change(input, { target: { value: '' } });

      const saveButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Required')).toBeInTheDocument();
      });

      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should show error when quadrant name is only whitespace', async () => {
      render(
        <CustomizeQuadrantsModal
          isOpen={true}
          onClose={mockOnClose}
          currentQuadrants={defaultQuadrants}
          onSave={mockOnSave}
        />
      );

      const input = screen.getByLabelText('Quadrant 2');
      fireEvent.change(input, { target: { value: '   ' } });

      const saveButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Required')).toBeInTheDocument();
      });

      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should show multiple errors for multiple empty fields', async () => {
      render(
        <CustomizeQuadrantsModal
          isOpen={true}
          onClose={mockOnClose}
          currentQuadrants={defaultQuadrants}
          onSave={mockOnSave}
        />
      );

      fireEvent.change(screen.getByLabelText('Quadrant 1'), { target: { value: '' } });
      fireEvent.change(screen.getByLabelText('Quadrant 3'), { target: { value: '' } });

      const saveButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        const errors = screen.getAllByText('Required');
        expect(errors).toHaveLength(2);
      });

      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should clear error when user starts typing', async () => {
      render(
        <CustomizeQuadrantsModal
          isOpen={true}
          onClose={mockOnClose}
          currentQuadrants={defaultQuadrants}
          onSave={mockOnSave}
        />
      );

      const input = screen.getByLabelText('Quadrant 1');
      fireEvent.change(input, { target: { value: '' } });

      const saveButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Required')).toBeInTheDocument();
      });

      // Start typing
      fireEvent.change(input, { target: { value: 'New Name' } });

      await waitFor(() => {
        expect(screen.queryByText('Required')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <CustomizeQuadrantsModal
          isOpen={true}
          onClose={mockOnClose}
          currentQuadrants={defaultQuadrants}
          onSave={mockOnSave}
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('should have labels for all inputs', () => {
      render(
        <CustomizeQuadrantsModal
          isOpen={true}
          onClose={mockOnClose}
          currentQuadrants={defaultQuadrants}
          onSave={mockOnSave}
        />
      );

      expect(screen.getByLabelText('Quadrant 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Quadrant 2')).toBeInTheDocument();
      expect(screen.getByLabelText('Quadrant 3')).toBeInTheDocument();
      expect(screen.getByLabelText('Quadrant 4')).toBeInTheDocument();
    });

    it('should have role="alert" for error messages', async () => {
      render(
        <CustomizeQuadrantsModal
          isOpen={true}
          onClose={mockOnClose}
          currentQuadrants={defaultQuadrants}
          onSave={mockOnSave}
        />
      );

      const input = screen.getByLabelText('Quadrant 1');
      fireEvent.change(input, { target: { value: '' } });

      const saveButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        const error = screen.getByText('Required');
        expect(error).toHaveAttribute('role', 'alert');
      });
    });
  });

  describe('Disabled state', () => {
    it('should disable all inputs when isSaving is true', () => {
      render(
        <CustomizeQuadrantsModal
          isOpen={true}
          onClose={mockOnClose}
          currentQuadrants={defaultQuadrants}
          onSave={mockOnSave}
          isSaving={true}
        />
      );

      expect(screen.getByLabelText('Quadrant 1')).toBeDisabled();
      expect(screen.getByLabelText('Quadrant 2')).toBeDisabled();
      expect(screen.getByLabelText('Quadrant 3')).toBeDisabled();
      expect(screen.getByLabelText('Quadrant 4')).toBeDisabled();
    });

    it('should disable all buttons when isSaving is true', () => {
      render(
        <CustomizeQuadrantsModal
          isOpen={true}
          onClose={mockOnClose}
          currentQuadrants={defaultQuadrants}
          onSave={mockOnSave}
          isSaving={true}
        />
      );

      expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /close modal/i })).toBeDisabled();
    });
  });
});
