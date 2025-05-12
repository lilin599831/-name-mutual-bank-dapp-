export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  message: string;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const validateField = (value: string, rules: ValidationRule): string | null => {
  if (rules.required && !value) {
    return rules.message;
  }

  if (value) {
    if (rules.min !== undefined && !isNaN(Number(value))) {
      if (Number(value) < rules.min) {
        return rules.message;
      }
    }

    if (rules.max !== undefined && !isNaN(Number(value))) {
      if (Number(value) > rules.max) {
        return rules.message;
      }
    }

    if (rules.min !== undefined && isNaN(Number(value)) && value.length < rules.min) {
      return rules.message;
    }

    if (rules.max !== undefined && isNaN(Number(value)) && value.length > rules.max) {
      return rules.message;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.message;
    }

    if (rules.custom && !rules.custom(value)) {
      return rules.message;
    }
  }

  return null;
};

export const validateForm = (values: { [key: string]: string }, rules: ValidationRules): ValidationErrors => {
  const errors: ValidationErrors = {};

  Object.keys(rules).forEach(field => {
    const error = validateField(values[field], rules[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

export const isFormValid = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length === 0;
}; 