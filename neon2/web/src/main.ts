import {BackendJobOffer, BackendJobOfferLocation, JobBoardBackend, toJobOffer} from "./backend";
import {JobBoard, JobOffer} from './jobBoard';
import {JobOfferPayments} from "./jobOfferPayments";
import {GoogleMapsLocationProvider, LocationProvider, TestLocationProvider} from "./locationProvider/LocationProvider";
import {PaymentMethod, PaymentNotification, PaymentProvider} from "./paymentProvider/PaymentProvider";
import {PaymentService, PaymentStatus} from "./paymentProvider/PaymentService";
import {StripePaymentProvider} from './paymentProvider/StripePaymentProvider';
import {TestPaymentProvider} from './paymentProvider/TestPaymentProvider';
import {PlanBundle} from "./planBundle";
import {runInShadowDom, setDarkTheme} from "./view/shadowDom/shadowDom";
import {VueUi} from './view/ui/ui';
import {View} from "./view/view";

const backend = new JobBoardBackend();
const ui = new VueUi(locationProvider(backend.testMode()), backend.isAuthenticated());
const view = new View(ui);
const board = new JobBoard((jobOffers: JobOffer[]): void => view.setJobOffers(jobOffers));
const paymentProvider: PaymentProvider = backend.testMode()
  ? new TestPaymentProvider()
  : new StripePaymentProvider(backend.stripeKey()!);
const payments = new PaymentService(backend, paymentProvider);
const jobOfferPayments = new JobOfferPayments();
const planBundle = new PlanBundle();

export type PlanBundleName = 'strategic'|'growth'|'scale';
export type PricingPlan = 'free'|PaidPricingPlan;
export type PaidPricingPlan = 'premium'|PlanBundleName;

export interface InitiatePayment {
  jobOfferId: number;
  invoiceInfo: InvoiceInformation;
  paymentMethod: PaymentMethod;
}

export interface SubmitJobOffer {
  title: string;
  description: string|null;
  salaryRangeFrom: number|null;
  salaryRangeTo: number|null;
  salaryIsNet: boolean;
  salaryCurrency: Currency;
  salaryRate: Rate;
  locations: BackendJobOfferLocation[];
  tagNames: string[];
  workMode: WorkMode;
  legalForm: LegalForm;
  experience: WorkExperience;
  applicationMode: ApplicationMode;
  applicationEmail: string|null;
  applicationExternalAts: string|null;
  companyName: string;
  companyLogoUrl: string|null;
  companyWebsiteUrl: string|null;
  companyDescription: string|null;
  companyPhotoUrls: string[];
  companyVideoUrl: string|null;
  companySizeLevel: number|null;
  companyFundingYear: number|null;
  companyAddress: BackendJobOfferLocation|null;
  companyHiringType: HiringType;
}

export function toSubmitJobOffer(jobOffer: JobOffer): SubmitJobOffer {
  return jobOffer;
}

export type WorkMode = 'stationary'|'hybrid'|'fullyRemote';
export type LegalForm = 'employment'|'b2b'|'of-mandate'|'specific-task';
export type WorkExperience = 'intern'|'junior'|'mid-level'|'senior'|'lead'|'manager'|'not-provided';
export type Rate = 'monthly'|'hourly'|'yearly'|'weekly';
export type Currency = 'PLN'|'EUR'|'USD'|'GBP'|'CHF';
export type ApplicationMode = '4programmers'|'external-ats';
export type HiringType = 'direct'|'agency';

export interface InvoiceInformation {
  companyName: string,
  countryCode: string,
  vatId: string,
  companyAddress: string,
  companyPostalCode: string,
  companyCity: string,
}

function bundleSize(pricingPlan: PaidPricingPlan): 1|3|5|20 {
  const bundleSizes: Record<PaidPricingPlan, 1|3|5|20> = {
    'premium': 1,
    'strategic': 3,
    'growth': 5,
    'scale': 20,
  };
  return bundleSizes[pricingPlan];
}

ui.setViewListener({
  createJob(pricingPlan: PricingPlan, jobOffer: SubmitJobOffer): void {
    backend.addJobOffer(pricingPlan, jobOffer, (jobOffer: BackendJobOffer): void => {
      board.jobOfferCreated(toJobOffer(jobOffer));
      if (pricingPlan === 'free') {
        view.jobOfferCreatedFree(jobOffer.id);
      } else {
        const payment = jobOffer.payment!;
        jobOfferPayments.addJobOffer({jobOfferId: jobOffer.id, paymentId: payment.paymentId, pricingPlan});
        ui.setPaymentSummary({
          bundleSize: bundleSize(pricingPlan),
          basePrice: payment.paymentPriceBase,
          vat: payment.paymentPriceVat,
          vatIncluded: true,
        });
        view.jobOfferCreatedRequirePayment(jobOffer.id);
      }
    });
  },
  vatDetailsChanged(countryCode: string, vatId: string): void {
    ui.setVatIncluded(isVatIncluded(countryCode, vatId));
  },
  updateJob(jobOfferId: number, jobOffer: SubmitJobOffer): void {
    backend.updateJobOffer(jobOfferId, jobOffer, (): void => {
      board.jobOfferUpdated(jobOfferId, jobOffer);
      view.jobOfferEdited(jobOfferId);
    });
  },
  payForJob(initiatePayment: InitiatePayment): void {
    ui.setVatIdState('pending');
    payments.initiatePayment(
      jobOfferPayments.paymentId(initiatePayment.jobOfferId),
      initiatePayment.invoiceInfo,
      initiatePayment.paymentMethod);
  },
  redeemBundle(jobOfferId: number): void {
    backend.publishJobOfferUsingBundle(jobOfferId).then(() => {
      board.jobOfferPaid(jobOfferId);
      view.planBundleUsed();
      view.jobOfferPaid();
      planBundle.decrease();
    });
  },
  managePaymentMethod(action: 'mount'|'unmount', cssSelector?: string): void {
    if (action === 'mount') {
      paymentProvider.mountCardInput(cssSelector!);
    } else {
      paymentProvider.unmountCardInput();
    }
  },
  assertUserAuthenticated(): boolean {
    if (backend.isAuthenticated()) {
      return true;
    }
    window.location.href = '/Login';
    return false;
  },
});

payments.addEventListener({
  paymentInitiationVatIdState(vatId: VatIdState): void {
    ui.setVatIdState(vatId);
  },
  notificationReceived(notification: PaymentNotification): void {
    ui.setPaymentNotification(notification);
  },
  statusChanged(paymentId: string, status: PaymentStatus): void {
    ui.setPaymentStatus(status);
    if (status === 'paymentComplete') {
      board.jobOfferPaid(jobOfferPayments.jobOfferId(paymentId));
      const pricingPlan = jobOfferPayments.pricingPlan(paymentId);
      if (pricingPlan !== 'premium') {
        planBundle.set(pricingPlan, remainingJobOffers(pricingPlan));
      }
      view.jobOfferPaid();
    }
  },
});

planBundle.addListener(function (plan: PlanBundleName, remainingJobOffers: number): void {
  view.setPlanBundle(plan, remainingJobOffers);
});

function locationProvider(testMode: boolean): LocationProvider {
  return testMode
    ? new TestLocationProvider()
    : new GoogleMapsLocationProvider();
}

function remainingJobOffers(planBundle: PlanBundleName): number {
  if (planBundle === 'strategic') {
    return 2;
  }
  if (planBundle === 'growth') {
    return 4;
  }
  if (planBundle === 'scale') {
    return 19;
  }
  throw new Error('Failed to set remaining job offers for a pricing plan.');
}

const bundle = backend.initialPlanBundle();
if (bundle.hasBundle) {
  planBundle.set(bundle.planBundleName!, bundle.remainingJobOffers!);
}

backend.initialJobOffers()
  .forEach(offer => board.jobOfferCreated(toJobOffer(offer)));

ui.setJobOfferApplicationEmail(backend.jobOfferApplicationEmail());
ui.setPaymentInvoiceCountries(backend.paymentInvoiceCountries());
ui.setJobOfferFilters(board.jobOfferFilters());
ui.upload({
  async uploadLogo(file: File): Promise<string> {
    return await backend.uploadLogoReturnUrl(file);
  },
  async uploadAsset(file: File): Promise<string> {
    return await backend.uploadAssetReturnUrl(file);
  },
});

export type Theme = 'light'|'dark';
backend.onChangeTheme((theme: Theme) => setDarkTheme(theme === 'dark'));
runInShadowDom(element => ui.mount(element!));

export interface UploadImage {
  (file: File): Promise<string>;
}

export interface UploadAssets {
  uploadLogo: UploadImage;
  uploadAsset: UploadImage;
}

export interface PaymentSummary {
  basePrice: number;
  vat: number;
  bundleSize: 1|3|5|20;
  vatIncluded: boolean;
}

export interface Country {
  countryCode: string;
  countryName: string;
}

function isVatIncluded(countryCode: string, vatId: string): boolean {
  if (['PL', 'UA', 'US', 'JP', 'SG'].includes(countryCode)) {
    return true;
  }
  return vatId === '';
}

export type VatIdState = 'valid'|'invalid'|'pending';

export interface JobOfferFilters {
  tags: string[];
  locations: string[];
}
