'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { TechItem } from '@prisma/client';
import { DEFAULT_RINGS } from '@/lib/constants/defaults';
import { createTechItemSchema } from '@/lib/validations/techItem';
import { z } from 'zod';
import { Button } from '@/components/Button';
import { Select, SelectOption } from '@/components/Select';
import { Field } from '@/components/Field';
import styles from './TechItemForm.module.css';

interface TechItemFormProps {
  mode: 'add' | 'edit';
  radarId: string;
  quadrantNames: string[]; // Custom quadrant names from the radar
  initialData?: Partial<TechItem>;
  onSave: (data: TechItemFormData) => void | Promise<void>;
  onCancel: () => void;
  successMessage?: string | null;
  errorMessage?: string | null;
  isLoading?: boolean;
}

export interface TechItemFormData {
  name: string;
  quadrant: number;
  ring: number;
  description?: string;
  url?: string;
  category?: string;
  icon?: string; // simple-icons slug
}

export function TechItemForm({
  mode,
  radarId,
  quadrantNames,
  initialData,
  onSave,
  onCancel,
  successMessage,
  errorMessage,
  isLoading = false,
}: TechItemFormProps) {
  // Form state
  const [formData, setFormData] = useState<TechItemFormData>({
    name: initialData?.name || '',
    quadrant: initialData?.quadrant ?? 0,
    ring: initialData?.ring ?? 0,
    description: initialData?.description || '',
    url: initialData?.url || '',
    category: initialData?.category || '',
    icon: initialData?.icon || undefined,
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Transform quadrant names into Select options
  const quadrantOptions: SelectOption[] = useMemo(
    () => quadrantNames.map((name, index) => ({ value: index, label: name })),
    [quadrantNames]
  );

  // Transform ring names into Select options
  const ringOptions: SelectOption[] = useMemo(
    () => DEFAULT_RINGS.map((name, index) => ({ value: index, label: name })),
    []
  );

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        quadrant: initialData.quadrant ?? 0,
        ring: initialData.ring ?? 0,
        description: initialData.description || '',
        url: initialData.url || '',
        category: initialData.category || '',
        icon: initialData.icon || undefined,
      });
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Convert quadrant and ring to numbers
    const parsedValue = name === 'quadrant' || name === 'ring'
      ? parseInt(value, 10)
      : value;

    setFormData(prev => ({
      ...prev,
      [name]: parsedValue,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    try {
      createTechItemSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving tech item:', error);
      // Parent component handles error via errorMessage prop
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {/* Success Message */}
      {successMessage && (
        <div className={styles.successMessage} role="alert" aria-live="polite">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className={styles.errorMessage} role="alert" aria-live="assertive">
          {errorMessage}
        </div>
      )}

      {/* Name Field (Required) */}
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          Name <span className={styles.required}>*</span>
        </label>
        <Field
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          placeholder="e.g., React, PostgreSQL, Docker"
          required
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <span id="name-error" className={styles.errorMessage} role="alert">
            {errors.name}
          </span>
        )}
      </div>

      {/* Quadrant Dropdown (Required) */}
      <div className={styles.formGroup}>
        <label id="quadrant-label" htmlFor="quadrant" className={styles.label}>
          Quadrant <span className={styles.required}>*</span>
        </label>
        <Select
          id="quadrant"
          name="quadrant"
          options={quadrantOptions}
          value={formData.quadrant}
          onChange={(value) => {
            const event = {
              target: { name: 'quadrant', value: String(value) }
            } as React.ChangeEvent<HTMLSelectElement>;
            handleChange(event);
          }}
          error={!!errors.quadrant}
          required
          aria-invalid={!!errors.quadrant}
          aria-describedby={errors.quadrant ? 'quadrant-error' : undefined}
        />
        {errors.quadrant && (
          <span id="quadrant-error" className={styles.errorMessage} role="alert">
            {errors.quadrant}
          </span>
        )}
      </div>

      {/* Ring Dropdown (Required) */}
      <div className={styles.formGroup}>
        <label id="ring-label" htmlFor="ring" className={styles.label}>
          Ring <span className={styles.required}>*</span>
        </label>
        <Select
          id="ring"
          name="ring"
          options={ringOptions}
          value={formData.ring}
          onChange={(value) => {
            const event = {
              target: { name: 'ring', value: String(value) }
            } as React.ChangeEvent<HTMLSelectElement>;
            handleChange(event);
          }}
          error={!!errors.ring}
          required
          aria-invalid={!!errors.ring}
          aria-describedby={errors.ring ? 'ring-error' : undefined}
        />
        {errors.ring && (
          <span id="ring-error" className={styles.errorMessage} role="alert">
            {errors.ring}
          </span>
        )}
      </div>

      {/* Description Field (Optional) */}
      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <Field
          as="textarea"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={!!errors.description}
          placeholder="Add notes, context, or reasoning for this technology"
          rows={4}
          maxLength={500}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
        {errors.description && (
          <span id="description-error" className={styles.errorMessage} role="alert">
            {errors.description}
          </span>
        )}
        <span className={styles.charCount}>
          {formData.description?.length || 0} / 500
        </span>
      </div>

      {/* URL Field (Optional) */}
      <div className={styles.formGroup}>
        <label htmlFor="url" className={styles.label}>
          URL
        </label>
        <Field
          type="url"
          id="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          error={!!errors.url}
          placeholder="https://example.com"
          aria-invalid={!!errors.url}
          aria-describedby={errors.url ? 'url-error' : undefined}
        />
        {errors.url && (
          <span id="url-error" className={styles.errorMessage} role="alert">
            {errors.url}
          </span>
        )}
      </div>

      {/* Category Field (Optional) */}
      <div className={styles.formGroup}>
        <label htmlFor="category" className={styles.label}>
          Category
        </label>
        <Field
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          error={!!errors.category}
          placeholder="e.g., Frontend, Backend, DevOps"
          maxLength={50}
          aria-invalid={!!errors.category}
          aria-describedby={errors.category ? 'category-error' : undefined}
        />
        {errors.category && (
          <span id="category-error" className={styles.errorMessage} role="alert">
            {errors.category}
          </span>
        )}
      </div>

      {/* Form Actions */}
      <div className={styles.formActions}>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className={styles.submitButton}
        >
          {mode === 'add' ? 'Add Item' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}

export default TechItemForm;
