import {JobOffer} from '../jobBoard';
import {PlanBundleName, UploadAssets} from "../main";
import {PaymentNotification} from "../paymentProvider";
import {PaymentStatus} from "../paymentService";
import {Screen, UserInterface, ViewListener} from './ui/ui';

export type Toast = 'created'|'edited'|'bundle-used';

export class View {
  private jobOffers: JobOffer[] = [];
  private searchPhrase: string = '';
  private planBundleCanRedeem: boolean = false;

  constructor(private ui: UserInterface) {
    this.ui.addNavigationListener({
      setScreen: (screen: Screen): void => {
        this.ui.setToast(null);
        this.ui.setScreen(screen);
      },
      showJobOfferForm: (): void => {
        if (this.planBundleCanRedeem) {
          this.ui.setScreen('form');
        } else {
          this.ui.setScreen('pricing');
        }
      },
    });
    this.ui.addSearchListener(searchPhrase => {
      this.searchPhrase = searchPhrase;
      this.filterJobOffers();
    });
  }

  addEventListener(listener: ViewListener): void {
    this.ui.addViewListener(listener);
  }

  mount(cssSelector: string): void {
    this.ui.mount(cssSelector);
  }

  setJobOffers(jobOffers: JobOffer[]): void {
    this.jobOffers = jobOffers;
    this.filterJobOffers();
  }

  setPaymentNotification(notification: PaymentNotification): void {
    this.ui.setPaymentNotification(notification);
  }

  setPaymentStatus(notification: PaymentStatus): void {
    this.ui.setPaymentStatus(notification);
  }

  private filterJobOffers(): void {
    this.ui.setJobOffers(this.jobOffers.filter(jobOffer => this.jobOfferMatches(jobOffer)));
  }

  private jobOfferMatches(jobOffer: JobOffer): boolean {
    return jobOffer.title.toLowerCase().includes(this.searchPhrase.toLowerCase());
  }

  jobOfferCreatedFree(): void {
    this.ui.setToast('created');
    this.ui.setScreen('home');
  }

  jobOfferCreatedRequirePayment(jobOfferId: number): void {
    this.ui.setToast('created');
    this.ui.setCurrentJobOfferId(jobOfferId);
    this.ui.setScreen('payment');
  }

  jobOfferEdited(): void {
    this.ui.setToast('edited');
    this.ui.setScreen('home');
  }

  planBundleUsed(): void {
    this.ui.setToast('bundle-used');
  }

  jobOfferPaid(): void {
    this.ui.setScreen('home');
  }

  setPlanBundle(planName: PlanBundleName, remainingJobOffers: number): void {
    this.planBundleCanRedeem = remainingJobOffers > 0;
    this.ui.setPlanBundle(planName, remainingJobOffers, this.planBundleCanRedeem);
  }

  upload(upload: UploadAssets): void {
    this.ui.upload(upload);
  }
}
