import {Location} from "../../../locationProvider/LocationProvider";

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
      optionalJsUrl: (field: T, errorMessage: string): void => {
        if (jsUrlMalformed(prependJsUrlProtocol(this.fields[field]))) {
          errors[field] = errorMessage;
          success = false;
        }
      },
      optionalLocation: (field: T, errorMessage: string): void => {
        if (this.fields[field] === null) {
          return;
        }
        if (!locationContainsCity(this.fields[field])) {
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
  optionalJsUrl(field: T, errorMessage: string): void;
  optionalLocation(field: T, errorMessage: string): void;
}

function numberMalformed(value: string|null): boolean {
  if (value === null) {
    return false;
  }
  const text = value.trim();
  if (text === '') {
    return false;
  }
  return !isValidNumeric(text);
}

function jsUrlMalformed(value: string|null): boolean {
  if (value === null) {
    return false;
  }
  const text = value.trim();
  if (text === '') {
    return false;
  }
  return !isValidJsUrl(text);
}

export function prependJsUrlProtocol(url: string): string {
  if (url === '') {
    return url;
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return 'https://' + url;
}

function isValidNumeric(text: string): boolean {
  const number = parseInt(text, 10);
  if (isNaN(number)) {
    return false;
  }
  return number >= 0;
}

function isValidJsUrl(text: string): boolean {
  let url;
  try {
    url = new URL(text);
  } catch (error) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
}

function locationContainsCity(location: Location): boolean {
  return location.city !== null;
}
