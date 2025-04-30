import {JobOffer} from "./jobBoard";
import {
  ApplicationMode,
  Country,
  Currency,
  HiringType,
  InvoiceInformation,
  LegalForm,
  PricingPlan,
  Rate,
  SubmitJobOffer,
  WorkExperience,
  WorkMode,
} from "./main";

function jobOfferFields(jobOffer: SubmitJobOffer): object {
  return {
    jobOfferTitle: jobOffer.title,
    jobOfferDescription: jobOffer.description,
    jobOfferCompanyName: jobOffer.companyName,
    jobOfferSalaryRangeFrom: jobOffer.salaryRangeFrom,
    jobOfferSalaryRangeTo: jobOffer.salaryRangeTo,
    jobOfferSalaryIsNet: jobOffer.salaryIsNet,
    jobOfferSalaryCurrency: jobOffer.salaryCurrency,
    jobOfferSalaryRate: jobOffer.salaryRate,
    jobOfferLocations: jobOffer.locations,
    jobOfferCompanyLogoUrl: jobOffer.companyLogoUrl,
    jobOfferTagNames: jobOffer.tagNames,
    jobOfferWorkMode: jobOffer.workMode,
    jobOfferLegalForm: jobOffer.legalForm,
    jobOfferExperience: jobOffer.experience,
    jobOfferCompanyWebsiteUrl: jobOffer.companyWebsiteUrl,
    jobOfferCompanyDescription: jobOffer.companyDescription,
    jobOfferCompanyPhotoUrls: jobOffer.companyPhotoUrls,
    jobOfferCompanyVideoUrl: jobOffer.companyVideoUrl,
    jobOfferCompanySizeLevel: jobOffer.companySizeLevel,
    jobOfferCompanyFundingYear: jobOffer.companyFundingYear,
    jobOfferCompanyAddress: jobOffer.companyAddress,
    jobOfferCompanyHiringType: jobOffer.companyHiringType,
    jobOfferApplicationMode: jobOffer.applicationMode,
    jobOfferApplicationEmail: jobOffer.applicationEmail,
    jobOfferApplicationExternalAts: jobOffer.applicationExternalAts,
  };
}

declare global {
  interface Window {
    backendInput: BackendInput;
  }
}

export class JobBoardBackend {
  private backendInput: BackendInput = window.backendInput;

  addJobOffer(
    pricingPlan: PricingPlan,
    jobOffer: SubmitJobOffer,
    created: (jobOffer: BackendJobOffer) => void,
  ): void {
    request('POST', '/neon2/job-offers', {
      jobOfferPlan: pricingPlan,
      ...jobOfferFields(jobOffer),
    })
      .then(response => response.json())
      .then((jobOffer: BackendJobOffer): void => created(jobOffer));
  }

  updateJobOffer(id: number, jobOffer: SubmitJobOffer, updated: () => void): void {
    request('PATCH', '/neon2/job-offers', {
      jobOfferId: id.toString(),
      ...jobOfferFields(jobOffer),
    })
      .then(() => updated());
  }

  preparePayment(paymentId: string, invoiceInfo: InvoiceInformation): Promise<PreparePaymentResponse> {
    return request('POST', '/neon2/job-offers/payment', {
      paymentId,
      userId: this.userId(),
      ...invoiceInfoFields(invoiceInfo),
    })
      .then(response => response.json());
  }

  fetchPaymentStatus(paymentId: string): Promise<BackendPaymentStatus> {
    return fetch('/neon2/status?paymentId=' + paymentId)
      .then(response => response.json());
  }

  async publishJobOfferUsingBundle(jobOfferId: number): Promise<void> {
    await request('POST', '/neon2/job-offers/redeem-bundle', {jobOfferId, userId: this.userId()});
  }

  initialJobOffers(): BackendJobOffer[] {
    return this.backendInput.jobOffers;
  }

  initialPlanBundle(): BackendPlanBundle {
    return this.backendInput.planBundle;
  }

  private userId(): number {
    return this.backendInput.userId;
  }

  jobOfferApplicationEmail(): string {
    return this.backendInput.jobOfferApplicationEmail;
  }

  testMode(): boolean {
    return this.backendInput.testMode;
  }

  stripeKey(): string|null {
    return this.backendInput.stripePublishableKey;
  }

  paymentInvoiceCountries(): Country[] {
    return this.backendInput.paymentInvoiceCountries;
  }

  async uploadLogoReturnUrl(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('logo', file);
    return fetch('/Firma/Logo', {
      method: 'POST',
      body: formData,
      headers: {'X-CSRF-TOKEN': this.backendInput.csrfToken},
    })
      .then(response => response.json())
      .then(uploadedImage => uploadedImage.url);
  }

  async uploadAssetReturnUrl(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('asset', file);
    return fetch('/assets', {
      method: 'POST',
      body: formData,
      headers: {'X-CSRF-TOKEN': this.backendInput.csrfToken},
    })
      .then(response => response.json())
      .then(uploadedImage => uploadedImage.url);
  }
}

function request(method: string, url: string, body: object) {
  return fetch(url, {
    method,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  });
}

export interface BackendInput {
  jobOffers: BackendJobOffer[];
  testMode: boolean;
  planBundle: BackendPlanBundle;
  userId: number;
  jobOfferApplicationEmail: string;
  csrfToken: string;
  stripePublishableKey: string|null;
  paymentInvoiceCountries: Array<{countryCode: string; countryName: string}>;
}

export interface BackendJobOffer {
  id: number;
  expiresInDays: number;
  status: BackendJobOfferStatus;
  payment: BackendPaymentIntent|null;
  fields: {
    title: string;
    description: string|null;
    salaryRangeFrom: number|null;
    salaryRangeTo: number|null;
    salaryIsNet: boolean;
    salaryCurrency: Currency;
    salaryRate: Rate;
    locations: string[];
    tagNames: string[];
    workMode: WorkMode;
    legalForm: LegalForm;
    experience: WorkExperience;
    applicationMode: ApplicationMode,
    applicationEmail: string|null,
    applicationExternalAts: string|null,
    companyName: string;
    companyLogoUrl: string|null;
    companyWebsiteUrl: string|null,
    companyDescription: string|null,
    companyPhotoUrls: string[],
    companyVideoUrl: string|null,
    companySizeLevel: number|null,
    companyFundingYear: number|null,
    companyAddress: string|null,
    companyHiringType: HiringType,
  };
}

export interface BackendPaymentIntent {
  paymentId: string;
  paymentPriceBase: number;
  paymentPriceVat: number;
}

export type BackendJobOfferStatus = 'published'|'awaitingPayment';
export type BackendPaymentStatus = 'awaitingPayment'|'paymentComplete'|'paymentFailed';
export type BackendPreparedPayment = ProviderReady|ProviderNotReady;

interface ProviderReady {
  providerReady: true;
  paymentId: string;
  paymentToken: string;
}

interface ProviderNotReady {
  providerReady: false;
  paymentId: string;
  paymentToken: null;
}

interface BackendPlanBundle {
  hasBundle: boolean;
  remainingJobOffers?: number;
  planBundleName?: 'strategic'|'growth'|'scale';
}

export function toJobOffer(jobOffer: BackendJobOffer): JobOffer {
  const {fields, ...operationalFields} = jobOffer;
  return {
    ...operationalFields,
    ...fields,
    isNew: true,
    isFavourite: true,
  };
}

function invoiceInfoFields(invoiceInfo: InvoiceInformation): object {
  return {
    invoiceVatId: invoiceInfo.vatId || null,
    invoiceCountryCode: invoiceInfo.countryCode,
    invoiceCompanyName: invoiceInfo.companyName,
    invoiceCompanyAddress: invoiceInfo.companyAddress,
    invoiceCompanyPostalCode: invoiceInfo.companyPostalCode,
    invoiceCompanyCity: invoiceInfo.companyCity,
  };
}

export interface PreparePaymentResponse {
  status: 'success'|'failedInvalidVatId';
  preparedPayment?: BackendPreparedPayment;
}
