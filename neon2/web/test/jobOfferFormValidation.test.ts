import {JobOfferFormFields, JobOfferFormValidation} from '../src/view/ui/JobOffer/JobOfferFormValidation';
import {assertEquals, assertFalse, assertTrue, beforeEach, describe, test} from "./assertion";

describe('Job offer form validation', () => {
  let validation: JobOfferFormValidation;
  let fields: JobOfferFormFields = {
    title: '',
    applicationMode: '4programmers',
    applicationEmail: 'email',
    applicationExternalAts: '',
    companyName: '',
  };

  beforeEach(() => {
    validation = new JobOfferFormValidation(fields);
    fields.applicationMode = '4programmers';
    fields.applicationEmail = 'email';
  });

  test('Non-empty offer title is valid.', () => {
    fields.title = 'Job offer';
    const [success, errors] = validation.validateJobOfferStep();
    assertTrue(success);
    assertEquals(null, errors.title);
  });

  test('Job offer title is required.', () => {
    fields.title = '';
    const [success, errors] = validation.validateJobOfferStep();
    assertFalse(success);
    assertEquals('Podaj tytuł ogłoszenia.', errors.title);
  });

  test('If application is made with 4programmers, application email is required.', () => {
    fields.applicationMode = '4programmers';
    fields.applicationEmail = '';
    const [success, errors] = validation.validateJobOfferStep();
    assertFalse(success);
    assertEquals('Podaj adres e-mail do otrzymania aplikacji.', errors.applicationEmail);
  });

  test('If application is made with an external ats, external ats link is required.', () => {
    fields.applicationMode = 'external-ats';
    fields.applicationExternalAts = '';
    const [success, errors] = validation.validateJobOfferStep();
    assertFalse(success);
    assertEquals('Podaj adres Twojego systemu ATS.', errors.applicationExternalAts);
  });

  test('Non-empty job offer company name is valid.', () => {
    fields.companyName = 'company';
    const [success, errors] = validation.validateCompanyStep();
    assertTrue(success);
    assertEquals(null, errors.companyName);
  });

  test('Job offer company name is required.', () => {
    fields.companyName = '';
    const [success, errors] = validation.validateCompanyStep();
    assertFalse(success);
    assertEquals('Podaj nazwę firmy.', errors.companyName);
  });

  test('Previously erroneous field, after successful validation is valid.', () => {
    fields.title = '';
    validation.validateJobOfferStep();
    fields.title = 'filled';
    const [_, errors] = validation.validateJobOfferStep();
    assertEquals(null, errors.title);
  });

  test('Given other step errors, when the current step is valid, it is a success.', () => {
    fields.companyName = ''; // not provided
    fields.title = 'Job offer';
    const [success] = validation.validateJobOfferStep();
    assertTrue(success);
  });

  describe('Given other step has been validated, the current step does not have errors.', () => {
    test('Given job offer step has errors, the company step does not have errors.', () => {
      fields.companyName = ''; // not provided
      fields.title = 'Job offer';
      const [success, errors] = validation.validateJobOfferStep();
      assertTrue(success);
      assertEquals(null, errors.companyName);
    });
    test('Given company step has errors, the job offer step does not have errors.', () => {
      fields.title = ''; // not provided
      fields.applicationEmail = ''; // not provided
      fields.companyName = 'company name';
      const [_, errors] = validation.validateCompanyStep();
      assertEquals(null, errors.title);
      assertEquals(null, errors.applicationEmail);
    });
  });
});
