import {createApp, h, Reactive, reactive, VNode} from 'vue';
import {JobOffer} from '../../jobBoard';
import {InitiatePayment, PlanBundleName, PricingPlan, SubmitJobOffer, UploadAssets} from "../../main";
import {PaymentNotification} from "../../paymentProvider/PaymentProvider";
import {PaymentStatus} from "../../paymentProvider/PaymentService";
import {Toast} from '../view';
import JobBoard from './JobBoard.vue';

export type Screen = 'home'|'edit'|'form'|'payment'|'pricing'|'show';

export interface JobBoardProps {
  jobOffers: JobOffer[];
  screen: Screen;
  toast: Toast|null;
  currentJobOfferId: number|null;
  paymentNotification: PaymentNotification|null;
  paymentStatus: PaymentStatus|null;
  planBundle: PlanBundle|null;
  pricingPlan: PricingPlan|null;
  upload: UploadAssets|null;
}

export interface ViewListener {
  createJob: (plan: PricingPlan, jobOffer: SubmitJobOffer) => void;
  updateJob: (jobOfferId: number, jobOffer: SubmitJobOffer) => void;
  payForJob: (payment: InitiatePayment) => void;
  redeemBundle: (jobOfferId: number) => void;
  managePaymentMethod: (action: 'mount'|'unmount', cssSelector?: string) => void;
}

export interface UserInterface {
  mount(cssSelector: string): void;
  setJobOffers(jobOffers: JobOffer[]): void;
  setToast(toast: Toast|null): void;
  addViewListener(listener: ViewListener): void;
  addNavigationListener(listener: NavigationListener): void;
  addSearchListener(listener: SearchListener): void;
  setScreen(screen: Screen): void;
  setCurrentJobOfferId(jobOfferId: number): void;
  setPaymentNotification(notification: PaymentNotification): void;
  setPaymentStatus(status: PaymentStatus): void;
  setPlanBundle(bundleName: PlanBundleName, remainingJobOffers: number, canRedeem: boolean): void;
  upload(upload: UploadAssets): void;
}

export interface NavigationListener {
  setScreen(screen: Screen): void;
  showJobOfferForm(): void;
}

export type SearchListener = (searchPhrase: string) => void;

export interface PlanBundle {
  bundleName: PlanBundleName;
  remainingJobOffers: number;
  canRedeem: boolean;
}

export class VueUi implements UserInterface {
  private vueState: Reactive<JobBoardProps> = reactive<JobBoardProps>({
    jobOffers: [],
    toast: null,
    screen: 'home',
    currentJobOfferId: null,
    paymentNotification: null,
    paymentStatus: null,
    planBundle: null,
    pricingPlan: null,
    upload: null,
  });
  private viewListeners: ViewListener[] = [];
  private navigationListeners: NavigationListener[] = [];
  private searchListeners: SearchListener[] = [];

  addViewListener(viewListener: ViewListener): void {
    this.viewListeners.push(viewListener);
  }

  addNavigationListener(navigationListener: NavigationListener): void {
    this.navigationListeners.push(navigationListener);
  }

  addSearchListener(listener: SearchListener): void {
    this.searchListeners.push(listener);
  }

  setJobOffers(jobOffers: JobOffer[]): void {
    this.vueState.jobOffers = jobOffers;
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

  upload(upload: UploadAssets): void {
    this.vueState.upload = upload;
  }

  mount(cssSelector: string): void {
    const render = this.vueRender.bind(this);
    createApp({render}).mount(cssSelector);
  }

  private vueRender(): VNode {
    const that = this;
    return h(JobBoard, {
      ...this.vueState,
      onShowForm(): void {
        that.navigationListeners.forEach(listener => listener.showJobOfferForm());
      },
      onSelectPlan(plan: PricingPlan): void {
        that.vueState.pricingPlan = plan;
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
      onSearch(searchPhrase: string): void {
        that.searchListeners.forEach(listener => listener(searchPhrase));
      },
      onMountCardInput(cssSelector: string): void {
        that.viewListeners.forEach(listener => listener.managePaymentMethod('mount', cssSelector));
      },
      onUnmountCardInput(): void {
        that.viewListeners.forEach(listener => listener.managePaymentMethod('unmount'));
      },
    });
  }
}
