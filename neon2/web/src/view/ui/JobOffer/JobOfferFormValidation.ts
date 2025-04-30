export class JobOfferFormValidation<T extends string> {
  constructor(
    private readonly fields: Record<T, any>,
    private readonly fieldNames: T[]) {}

  emptyErrors(): Record<T, string|null> {
    return this.fieldNames.reduce(
      (acc, fieldName: T) => ({...acc, [fieldName]: null}),
      {} as Record<T, string|null>);
  }

  validate(validation: (validator: Validator<T>) => void): ValidationResult<T> {
    const errors = this.emptyErrors();
    let success = true;
    validation({
      nonEmpty(field: T, errorMessage: string): void {
        this.notEqual(field, '', errorMessage);
      },
      notEqual: (field: T, value: string, errorMessage: string): void => {
        if (this.fields[field]?.trim() === value) {
          errors[field] = errorMessage;
          success = false;
        }
      },
      optionalNumeric: (field: T, errorMessage: string): void => {
        if (numberMalformed(this.fields[field])) {
          errors[field] = errorMessage;
          success = false;
        }
      },
    });
    return [success, errors];
  }
}

export type ValidationResult<T extends string> = [
  boolean,
  Record<T, string|null>
];

interface Validator<T> {
  nonEmpty(field: T, errorMessage: string): void;
  notEqual(field: T, value: string, errorMessage: string): void;
  optionalNumeric(field: T, errorMessage: string): void;
}

function numberMalformed(value: string|null): boolean {
  if (value === null) {
    return false;
  }
  const text = value.trim();
  if (text === '') {
    return false;
  }
  const number = parseInt(text, 10);
  if (isNaN(number)) {
    return true;
  }
  return number < 0;
}
