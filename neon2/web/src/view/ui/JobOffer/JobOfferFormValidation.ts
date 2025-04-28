import {ApplicationMode} from '../../../main';

export class JobOfferFormValidation {
  private initial: JobOfferFormErrors = {
    title: null,
    companyName: null,
    applicationEmail: null,
    applicationExternalAts: null,
  };

  constructor(private fields: JobOfferFormFields) {}

  validateJobOfferStep(): [boolean, JobOfferFormErrors] {
    return this.validate(this.jobOfferErrors());
  }

  validateCompanyStep(): [boolean, JobOfferFormErrors] {
    return this.validate(this.companyStepErrors());
  }

  private validate<T extends object>(errors: T): [boolean, JobOfferFormErrors] {
    return [
      this.validateStep(errors),
      {...this.initial, ...errors},
    ];
  }

  private validateStep<T extends object>(errors: T): boolean {
    return Object.values(errors).filter(value => value).length === 0;
  }

  private jobOfferErrors() {
    const errors = {
      title: null as string|null,
      applicationEmail: null as string|null,
      applicationExternalAts: null as string|null,
    };
    if (this.fields.title === '') {
      errors.title = 'Podaj tytuł ogłoszenia.';
    }
    if (this.fields.applicationMode === '4programmers') {
      if (this.fields.applicationEmail === '') {
        errors.applicationEmail = 'Podaj adres e-mail do otrzymania aplikacji.';
      }
    }
    if (this.fields.applicationMode === 'external-ats') {
      if (this.fields.applicationExternalAts === '') {
        errors.applicationExternalAts = 'Podaj adres Twojego systemu ATS.';
      }
    }
    return errors;
  }

  private companyStepErrors() {
    if (this.fields.companyName === '') {
      return {companyName: 'Podaj nazwę firmy.'};
    }
    return {companyName: null};
  }
}

export interface JobOfferFormFields {
  title: string;
  companyName: string;
  applicationMode: ApplicationMode;
  applicationEmail: string|null;
  applicationExternalAts: string|null;
}

export interface JobOfferFormErrors {
  title: string|null;
  companyName: string|null;
  applicationEmail: string|null,
  applicationExternalAts: string|null,
}
