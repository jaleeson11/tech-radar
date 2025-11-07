import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TechItemForm, TechItemFormData } from './TechItemForm';
import { DEFAULT_RINGS } from '@/lib/constants/defaults';

const mockQuadrantNames = ['Tools', 'Techniques', 'Platforms', 'Languages & Frameworks'];
const mockRadarId = 'test-radar-id';

describe('TechItemForm', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering - Add Mode', () => {
    it('should render all required form fields', () => {
      render(
        <TechItemForm
          mode="add"
          radarId={mockRadarId}
          quadrantNames={mockQuadrantNames}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/quadrant/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/ring/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/url/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    });

    it('should render required field indicators', () => {
      render(
        <TechItemForm
          mode="add"
          radarId={mockRadarId}
          quadrantNames={mockQuadrantNames}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      // Check for asterisks on required fields
      const requiredMarkers = screen.getAllByText('*');
      expect(requiredMarkers.length).toBeGreaterThan(0);
    });

    it('should render save button', () => {
      render(
        <TechItemForm
          mode="add"
          radarId={mockRadarId}
          quadrantNames={mockQuadrantNames}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByRole('button', { name: /add item/i })).toBeInTheDocument();
    });

    it('should populate quadrant dropdown with custom names', async () => {
      const user = userEvent.setup();
      render(
        <TechItemForm
          mode="add"
          radarId={mockRadarId}
          quadrantNames={mockQuadrantNames}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const quadrantButton = screen.getByRole('button', { name: /quadrant/i });
      await user.click(quadrantButton);

      // Check that all quadrant names appear in the dropdown
      mockQuadrantNames.forEach(name => {
        expect(screen.getByRole('option', { name })).toBeInTheDocument();
      });
    });

    it('should populate ring dropdown with default ring names', async () => {
      const user = userEvent.setup();
      render(
        <TechItemForm
          mode="add"
          radarId={mockRadarId}
          quadrantNames={mockQuadrantNames}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const ringButton = screen.getByRole('button', { name: /ring/i });
      await user.click(ringButton);

      // Check that all ring names appear in the dropdown
      DEFAULT_RINGS.forEach(name => {
        expect(screen.getByRole('option', { name })).toBeInTheDocument();
      });
    });
  });

  describe('Rendering - Edit Mode', () => {
    const mockInitialData = {
      id: 'test-item-id',
      name: 'React',
      quadrant: 1,
      ring: 0,
      description: 'JavaScript library for building user interfaces',
      url: 'https://react.dev',
      category: 'Frontend',
      radarId: mockRadarId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should pre-populate form fields with initial data', () => {
      render(
        <TechItemForm
          mode="edit"
          radarId={mockRadarId}
          quadrantNames={mockQuadrantNames}
          initialData={mockInitialData}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByDisplayValue('React')).toBeInTheDocument();
      expect(screen.getByDisplayValue('JavaScript library for building user interfaces')).toBeInTheDocument();
      expect(screen.getByDisplayValue('https://react.dev')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Frontend')).toBeInTheDocument();
    });

    it('should show "Save Changes" button in edit mode', () => {
      render(
        <TechItemForm
          mode="edit"
          radarId={mockRadarId}
          quadrantNames={mockQuadrantNames}
          initialData={mockInitialData}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should update name field on user input', async () => {
      const user = userEvent.setup();
      render(
        <TechItemForm
          mode="add"
          radarId={mockRadarId}
          quadrantNames={mockQuadrantNames}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
      await user.type(nameInput, 'TypeScript');

      expect(nameInput.value).toBe('TypeScript');
    });

    it('should update quadrant dropdown on selection', async () => {
      const user = userEvent.setup();
      render(
        <TechItemForm
          mode="add"
          radarId={mockRadarId}
          quadrantNames={mockQuadrantNames}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const quadrantButton = screen.getByRole('button', { name: /quadrant/i });
      await user.click(quadrantButton);

      const platformsOption = screen.getByRole('option', { name: 'Platforms' });
      await user.click(platformsOption);

      // Check that the button now shows the selected value
      expect(quadrantButton).toHaveTextContent('Platforms');
    });

    it('should update ring dropdown on selection', async () => {
      const user = userEvent.setup();
      render(
        <TechItemForm
          mode="add"
          radarId={mockRadarId}
          quadrantNames={mockQuadrantNames}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const ringButton = screen.getByRole('button', { name: /ring/i });
      await user.click(ringButton);

      const trialOption = screen.getByRole('option', { name: 'Trial' });
      await user.click(trialOption);

      // Check that the button now shows the selected value
      expect(ringButton).toHaveTextContent('Trial');
    });

    it('should update description field on user input', async () => {
      const user = userEvent.setup();
      render(
        <TechItemForm
          mode="add"
          radarId={mockRadarId}
          quadrantNames={mockQuadrantNames}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;
      await user.type(descriptionInput, 'Test description');

      expect(descriptionInput.value).toBe('Test description');
    });

    it('should update URL field on user input', async () => {
      const user = userEvent.setup();
      render(
        <TechItemForm
          mode="add"
          radarId={mockRadarId}
          quadrantNames={mockQuadrantNames}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const urlInput = screen.getByLabelText(/url/i) as HTMLInputElement;
      await user.type(urlInput, 'https://example.com');

      expect(urlInput.value).toBe('https://example.com');
    });

    it('should show character count for description', async () => {
      const user = userEvent.setup();
      render(
        <TechItemForm
          mode="add"
          radarId={mockRadarId}
          quadrantNames={mockQuadrantNames}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;
      await user.type(descriptionInput, 'Test');

      expect(screen.getByText(/4 \/ 500/)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should accept empty URL field', async () => {
      const user = userEvent.setup();
      render(
        <TechItemForm
          mode="add"
          radarId={mockRadarId}
          quadrantNames={mockQuadrantNames}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/name/i);
      const submitButton = screen.getByRole('button', { name: /add item/i });

      await user.type(nameInput, 'Test Item');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalled();
      });
    });
  });

  describe('Form Submission', () => {
    it('should call onSave with form data when valid form is submitted', async () => {
      const user = userEvent.setup();
      render(
        <TechItemForm
          mode="add"
          radarId={mockRadarId}
          quadrantNames={mockQuadrantNames}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/name/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const urlInput = screen.getByLabelText(/url/i);
      const categoryInput = screen.getByLabelText(/category/i);

      await user.type(nameInput, 'Docker');
      await user.type(descriptionInput, 'Container platform');
      await user.type(urlInput, 'https://docker.com');
      await user.type(categoryInput, 'DevOps');

      // Select quadrant
      const quadrantButton = screen.getByRole('button', { name: /quadrant/i });
      await user.click(quadrantButton);
      const platformsOption = screen.getByRole('option', { name: 'Platforms' });
      await user.click(platformsOption);

      // Select ring
      const ringButton = screen.getByRole('button', { name: /ring/i });
      await user.click(ringButton);
      const adoptOption = screen.getByRole('option', { name: 'Adopt' });
      await user.click(adoptOption);

      const submitButton = screen.getByRole('button', { name: /add item/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledTimes(1);
      });

      const expectedData: TechItemFormData = {
        name: 'Docker',
        quadrant: 2,
        ring: 0,
        description: 'Container platform',
        url: 'https://docker.com',
        category: 'DevOps',
      };

      expect(mockOnSave).toHaveBeenCalledWith(expectedData);
    });

    it('should show loading state during submission', async () => {
      const { rerender } = render(
        <TechItemForm
          mode="add"
          radarId={mockRadarId}
          quadrantNames={mockQuadrantNames}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          isLoading={false}
        />
      );

      const submitButton = screen.getByRole('button', { name: /add item/i });
      expect(submitButton).not.toBeDisabled();

      // Rerender with loading state
      rerender(
        <TechItemForm
          mode="add"
          radarId={mockRadarId}
          quadrantNames={mockQuadrantNames}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          isLoading={true}
        />
      );

      // Button should be disabled during loading
      expect(submitButton).toBeDisabled();
    });

    it('should disable submit button during submission', async () => {
      render(
        <TechItemForm
          mode="add"
          radarId={mockRadarId}
          quadrantNames={mockQuadrantNames}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          isLoading={true}
        />
      );

      const submitButton = screen.getByRole('button', { name: /add item/i });

      expect(submitButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for all form fields', () => {
      render(
        <TechItemForm
          mode="add"
          radarId={mockRadarId}
          quadrantNames={mockQuadrantNames}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/name/i);
      const quadrantSelect = screen.getByLabelText(/quadrant/i);
      const ringSelect = screen.getByLabelText(/ring/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const urlInput = screen.getByLabelText(/url/i);
      const categoryInput = screen.getByLabelText(/category/i);

      expect(nameInput).toHaveAttribute('aria-required', 'true');
      expect(quadrantSelect).toHaveAttribute('aria-required', 'true');
      expect(ringSelect).toHaveAttribute('aria-required', 'true');
      expect(descriptionInput).toBeInTheDocument();
      expect(urlInput).toBeInTheDocument();
      expect(categoryInput).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle form submission with only required fields', async () => {
      const user = userEvent.setup();
      render(
        <TechItemForm
          mode="add"
          radarId={mockRadarId}
          quadrantNames={mockQuadrantNames}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/name/i);
      const submitButton = screen.getByRole('button', { name: /add item/i });

      await user.type(nameInput, 'Minimal Item');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith({
          name: 'Minimal Item',
          quadrant: 0,
          ring: 0,
          description: '',
          url: '',
          category: '',
        });
      });
    });

    it('should update form when initialData changes', () => {
      const { rerender } = render(
        <TechItemForm
          mode="edit"
          radarId={mockRadarId}
          quadrantNames={mockQuadrantNames}
          initialData={{ name: 'Initial Name', quadrant: 0, ring: 0 }}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByDisplayValue('Initial Name')).toBeInTheDocument();

      rerender(
        <TechItemForm
          mode="edit"
          radarId={mockRadarId}
          quadrantNames={mockQuadrantNames}
          initialData={{ name: 'Updated Name', quadrant: 1, ring: 2 }}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByDisplayValue('Updated Name')).toBeInTheDocument();
    });

    it('should prevent form submission when already submitting', async () => {
      render(
        <TechItemForm
          mode="add"
          radarId={mockRadarId}
          quadrantNames={mockQuadrantNames}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          isLoading={true}
        />
      );

      const submitButton = screen.getByRole('button', { name: /add item/i });

      // Button should be disabled when loading
      expect(submitButton).toBeDisabled();

      // Verify onSave is not called when button is disabled
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });
});
