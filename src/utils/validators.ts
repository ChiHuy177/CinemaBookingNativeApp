export const required = (message = 'This field is required') => ({
  required: {value: true, message},
});

export const isEmail = {
  pattern: {
    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
    message: 'Invalid email format',
  },
};

export const isPhoneNumber = {
  pattern: {
    value: /^(03|05|07|08|09|01[2|6|8|9])[0-9]{8}$/,
    message: 'Invalid phone number',
  },
};

export const minLength = (min: number, message?: string) => ({
  minLength: {
    value: min,
    message: message ?? `Must be at least ${min} characters`,
  },
});

export const maxLength = (max: number, message?: string) => ({
  maxLength: {
    value: max,
    message: message ?? `Must be no more than ${max} characters`,
  },
});

export const minValue = (min: number, message?: string) => ({
  validate: (value: number) =>
    (value >= min || message) ?? `Must be at least ${min}`,
});

export const matchPassword = (getValues: () => any, pro: string) => ({
  validate: (value: string) =>
    value === getValues()[pro] || 'Passwords do not match',
});

export const isDate = {
  validate: (value: any) => {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      return 'Invalid date';
    }
    return true;
  },
};

export const isChecked = {
  validate: (value: boolean) => value === true || 'This field must be checked',
};

export const strongPassword = {
  pattern: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
    message:
      'Password must be at least 6 characters and include uppercase, lowercase, number, and special character',
  },
};
