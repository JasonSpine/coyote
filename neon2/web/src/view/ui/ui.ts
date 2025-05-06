import {createApp, h, Reactive, reactive, VNode} from 'vue';
import {JobOffer} from '../../jobBoard';
import {JobOfferFilter} from "../../jobOfferFilter";
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

export type Screen = 'home'|'edit'|'form'|'payment'|'pricing'|'show';

export interface JobBoardProps {
  jobOffers: JobOffer[];
  jobOfferFilters: JobOfferFilters;
  screen: Screen;
  toast: Toast|null;
  currentJobOfferId: number|null;
  paymentNotification: PaymentNotification|null;
  paymentStatus: PaymentStatus|null;
  planBundle: PlanBundle|null;
  pricingPlan: PricingPlan|null;
  upload: UploadAssets|null;
  applicationEmail: string|null;
  paymentSummary: PaymentSummary|null;
  paymentVatIdState: VatIdState;
  invoiceCountries: Country[]|null;
}

export interface ViewListener {
  createJob: (plan: PricingPlan, jobOffer: SubmitJobOffer) => void;
  updateJob: (jobOfferId: number, jobOffer: SubmitJobOffer) => void;
  payForJob: (payment: InitiatePayment) => void;
  redeemBundle: (jobOfferId: number) => void;
  managePaymentMethod: (action: 'mount'|'unmount', cssSelector?: string) => void;
  vatDetailsChanged: (countryCode: string, vatId: string) => void;
  assertUserAuthenticated: () => boolean;
}

export interface UserInterface {
  mount(element: Element): void;
  setJobOffers(jobOffers: JobOffer[]): void;
  setJobOfferFilters(filters: JobOfferFilters): void;
  setToast(toast: Toast|null): void;
  addViewListener(listener: ViewListener): void;
  addNavigationListener(listener: NavigationListener): void;
  addFilterListener(listener: FilterListener): void;
  setScreen(screen: Screen): void;
  setCurrentJobOfferId(jobOfferId: number): void;
  setPaymentNotification(notification: PaymentNotification): void;
  setPaymentStatus(status: PaymentStatus): void;
  setPlanBundle(bundleName: PlanBundleName, remainingJobOffers: number, canRedeem: boolean): void;
  upload(upload: UploadAssets): void;
  setJobOfferApplicationEmail(applicationEmail: string): void;
  setPaymentSummary(summary: PaymentSummary): void;
  setPaymentInvoiceCountries(countries: Country[]): void;
  setVatIncluded(vatIncluded: boolean): void;
  setVatIdState(state: VatIdState): void;
}

export interface NavigationListener {
  setScreen(screen: Screen): void;
  showJobOfferForm(): void;
}

export type FilterListener = (filter: JobOfferFilter) => void;

export interface PlanBundle {
  bundleName: PlanBundleName;
  remainingJobOffers: number;
  canRedeem: boolean;
}

export class VueUi implements UserInterface {
  private vueState: Reactive<JobBoardProps> = reactive<JobBoardProps>({
    jobOffers: [],
    jobOfferFilters: {
      tags: [],
      locations: [],
    },
    toast: null,
    screen: 'home',
    currentJobOfferId: null,
    paymentNotification: null,
    paymentStatus: null,
    planBundle: null,
    pricingPlan: null,
    upload: null,
    applicationEmail: null,
    paymentSummary: null,
    paymentVatIdState: 'valid',
    invoiceCountries: null,
  });
  private viewListeners: ViewListener[] = [];
  private navigationListeners: NavigationListener[] = [];
  private searchListeners: FilterListener[] = [];

  addViewListener(viewListener: ViewListener): void {
    this.viewListeners.push(viewListener);
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

  setScreen(screen: Screen): void {
    this.vueState.screen = screen;
    window.scrollTo(0, 0);
  }

  setToast(toast: Toast|null): void {
    this.vueState.toast = toast;
  }

  setCurrentJobOfferId(jobOfferId: number|null): void {
    this.vueState.currentJobOfferId = jobOfferId;
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
    const render = this.vueRender.bind(this);
    createApp({render}).mount(element);
  }

  private vueRender(): VNode {
    const that = this;
    return h(JobBoard, {
      ...this.vueState,
      onShowForm(): void {
        that.navigationListeners.forEach(listener => listener.showJobOfferForm());
      },
      onSelectPlan(plan: PricingPlan): void {
        let preventAction = false;
        that.viewListeners.forEach(listener => {
          if (!listener.assertUserAuthenticated()) {
            preventAction = true;
          }
        });
        if (!preventAction) {
          that.vueState.pricingPlan = plan;
          that.setScreen('form');
        }
      },
      onCreate(plan: PricingPlan, jobOffer: SubmitJobOffer): void {
        that.viewListeners.forEach(listener => listener.createJob(plan, jobOffer));
      },
      onUpdate(jobOfferId: number, jobOffer: SubmitJobOffer): void {
        that.viewListeners.forEach(listener => listener.updateJob(jobOfferId, jobOffer));
      },
      onPay(payment: InitiatePayment): void {
        that.viewListeners.forEach(listener => listener.payForJob(payment));
      },
      onRedeemBundle(jobOfferId: number): void {
        that.viewListeners.forEach(listener => listener.redeemBundle(jobOfferId));
      },
      onNavigate(screen: Screen, jobOfferId: number|null): void {
        that.navigationListeners.forEach(listener => listener.setScreen(screen));
        that.setCurrentJobOfferId(jobOfferId);
      },
      onFilter(filter: JobOfferFilter): void {
        that.searchListeners.forEach(listener => listener(filter));
      },
      onMountCardInput(cssSelector: string): void {
        that.viewListeners.forEach(listener => listener.managePaymentMethod('mount', cssSelector));
      },
      onUnmountCardInput(): void {
        that.viewListeners.forEach(listener => listener.managePaymentMethod('unmount'));
      },
      onVatDetailsChanged(countryCode: string, vatId: string): void {
        that.viewListeners.forEach(listener => listener.vatDetailsChanged(countryCode, vatId));
      },
    });
  }
}
