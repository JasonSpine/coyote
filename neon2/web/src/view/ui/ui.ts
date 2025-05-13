import {createApp, h, reactive} from 'vue';
import {JobOffer} from '../../jobBoard';
import {JobOfferFilter} from "../../jobOfferFilter";
import {LocationProvider} from "../../locationProvider/LocationProvider";
import {
  Country,
  InitiatePayment,
  JobOfferFilters,
  PaymentSummary,
  PlanBundleName,
  PricingPlan,
  SubmitJobOffer,
  UploadAssets,
  VatIdState,
} from "../../main";
import {PaymentNotification} from "../../paymentProvider/PaymentProvider";
import {PaymentStatus} from "../../paymentProvider/PaymentService";
import {Toast} from '../view';
import JobBoard from './JobBoard.vue';
import {JobBoardProperties} from "./JobBoardProperties";
import {Screens} from "./screen/Screens";

export type Screen = 'home'|'edit'|'form'|'payment'|'pricing'|'show';

export interface ViewListener {
  createJob(plan: PricingPlan, jobOffer: SubmitJobOffer): void;
  updateJob(jobOfferId: number, jobOffer: SubmitJobOffer): void;
  payForJob(payment: InitiatePayment): void;
  redeemBundle(jobOfferId: number): void;
  managePaymentMethod(action: 'mount'|'unmount', cssSelector?: string): void;
  vatDetailsChanged(countryCode: string, vatId: string): void;
  assertUserAuthenticated(): boolean;
}

export interface NavigationListener {
  setScreen(screen: Screen, jobOfferId: number|null): void;
  showJobOfferForm(): void;
}

export type FilterListener = (filter: JobOfferFilter) => void;

export interface PlanBundle {
  bundleName: PlanBundleName;
  remainingJobOffers: number;
  canRedeem: boolean;
}

export interface UiController {
  showForm(): void;
  selectPlan(plan: PricingPlan): void;
  navigate(screen: Screen, jobOfferId: number|null): void;
  filter(filter: JobOfferFilter): void;
  applyForJob(jobOfferId: number): void;
}

export class VueUi {
  private readonly screens: Screens;
  private readonly vueState: JobBoardProperties;
  private readonly navigationListeners: NavigationListener[] = [];
  private readonly searchListeners: FilterListener[] = [];

  constructor(locationProvider: LocationProvider) {
    this.vueState = reactive<JobBoardProperties>({
      viewListener: null,
      jobOffers: [],
      jobOfferFilters: {
        tags: [],
        locations: [],
      },
      toast: null,
      screen: 'home',
      paymentNotification: null,
      paymentStatus: null,
      planBundle: null,
      pricingPlan: null,
      upload: null,
      applicationEmail: null,
      paymentSummary: null,
      paymentVatIdState: 'valid',
      invoiceCountries: null,
      locationProvider,
      uiController: {
        showForm: this.showForm.bind(this),
        selectPlan: this.selectPlan.bind(this),
        navigate: this.navigate.bind(this),
        filter: this.filter.bind(this),
        applyForJob: this.applyForJob.bind(this),
      },
    });
    this.screens = new Screens(jobOfferId => ({
      uiController: this.vueState.uiController,
      viewListener: this.vueState.viewListener!,
      upload: this.vueState.upload!,
      pricingPlan: this.vueState.pricingPlan!,
      applicationEmail: this.vueState.applicationEmail!,
      planBundle: this.vueState.planBundle!,
      invoiceCountries: this.vueState.invoiceCountries!,
      paymentSummary: this.vueState.paymentSummary!,
      paymentVatIdState: this.vueState.paymentVatIdState,
      paymentJobOfferId: jobOfferId,
      jobOffer: jobOfferId ? this.findJobOffer(jobOfferId) : null,
      jobOffers: this.vueState.jobOffers,
      filters: this.vueState.jobOfferFilters,
    }));
  }

  private showForm(): void {
    this.navigationListeners.forEach(listener => listener.showJobOfferForm());
  }

  private selectPlan(plan: PricingPlan): void {
    const listener: ViewListener = this.vueState.viewListener!;
    if (listener.assertUserAuthenticated()) {
      this.vueState.pricingPlan = plan;
      this.setScreen('form', null);
    }
  }

  private navigate(screen: Screen, jobOfferId: number|null): void {
    this.navigationListeners.forEach(listener => listener.setScreen(screen, jobOfferId));
  }

  setScreen(screen: Screen, jobOfferId: number|null): void {
    this.screens.navigate(screen, jobOfferId);
    window.scrollTo(0, 0);
  }

  private filter(filter: JobOfferFilter): void {
    this.searchListeners.forEach(listener => listener(filter));
  }

  private applyForJob(jobOfferId: number): void {
    const currentJobOffer = this.vueState.jobOffers.find(offer => offer.id === jobOfferId)!;
    window.location.href = currentJobOffer.applicationUrl;
  }

  setViewListener(viewListener: ViewListener): void {
    this.vueState.viewListener = viewListener;
  }

  addNavigationListener(navigationListener: NavigationListener): void {
    this.navigationListeners.push(navigationListener);
  }

  addFilterListener(listener: FilterListener): void {
    this.searchListeners.push(listener);
  }

  setJobOffers(jobOffers: JobOffer[]): void {
    this.vueState.jobOffers = jobOffers;
  }

  setJobOfferFilters(filters: JobOfferFilters): void {
    this.vueState.jobOfferFilters = filters;
  }

  setToast(toast: Toast|null): void {
    this.vueState.toast = toast;
  }

  private findJobOffer(jobOfferId: number): JobOffer|null {
    const jobOffer = this.vueState.jobOffers.find(o => o.id === jobOfferId);
    if (jobOffer) {
      return jobOffer;
    }
    return null;
  }

  setPaymentNotification(notification: PaymentNotification): void {
    this.vueState.paymentNotification = notification;
  }

  setPaymentStatus(status: PaymentStatus): void {
    this.vueState.paymentStatus = status;
  }

  setPlanBundle(bundleName: PlanBundleName, remainingJobOffers: number, canRedeem: boolean): void {
    this.vueState.planBundle = {bundleName, remainingJobOffers, canRedeem};
    this.vueState.pricingPlan = bundleName;
  }

  setJobOfferApplicationEmail(applicationEmail: string) {
    this.vueState.applicationEmail = applicationEmail;
  }

  setPaymentSummary(summary: PaymentSummary): void {
    this.vueState.paymentSummary = summary;
    this.screens.allowPayment();
  }

  setPaymentInvoiceCountries(countries: Country[]): void {
    this.vueState.invoiceCountries = countries;
  }

  upload(upload: UploadAssets): void {
    this.vueState.upload = upload;
  }

  setVatIncluded(vatIncluded: boolean): void {
    this.vueState.paymentSummary!.vatIncluded = vatIncluded;
  }

  setVatIdState(state: VatIdState): void {
    this.vueState.paymentVatIdState = state;
  }

  mount(element: Element): void {
    const app = createApp({render: () => h(JobBoard, this.vueState)});
    this.screens.useIn(app);
    app.mount(element);
  }
}
