import {JobOffer} from '../jobBoard';
import {JobOfferFilter, sortInPlace} from "../jobOfferFilter";
import {Country, JobOfferFilters, PaymentSummary, PlanBundleName, UploadAssets, VatIdState} from "../main";
import {PaymentNotification} from "../paymentProvider/PaymentProvider";
import {PaymentStatus} from "../paymentProvider/PaymentService";
import {Screen, UserInterface, ViewListener} from './ui/ui';

export type Toast = 'created'|'edited'|'bundle-used';

export class View {
  private jobOffers: JobOffer[] = [];
  private filter: JobOfferFilter|null = null;
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
    this.ui.addFilterListener(filter => {
      this.filter = filter;
      this.filterJobOffers();
    });
  }

  addEventListener(listener: ViewListener): void {
    this.ui.addViewListener(listener);
  }

  mount(element: Element): void {
    this.ui.mount(element);
  }

  setJobOffers(jobOffers: JobOffer[]): void {
    this.jobOffers = jobOffers;
    this.filterJobOffers();
  }

  setJobOfferFilters(filters: JobOfferFilters): void {
    this.ui.setJobOfferFilters(filters);
  }

  setPaymentNotification(notification: PaymentNotification): void {
    this.ui.setPaymentNotification(notification);
  }

  setPaymentStatus(notification: PaymentStatus): void {
    this.ui.setPaymentStatus(notification);
  }

  private filterJobOffers(): void {
    const jobOffers = this.jobOffers.filter(jobOffer => this.jobOfferMatches(jobOffer));
    if (this.filter) {
      sortInPlace(jobOffers, this.filter.sort);
    }
    this.ui.setJobOffers(jobOffers);
  }

  private jobOfferMatches(jobOffer: JobOffer): boolean {
    if (this.filter === null) {
      return true;
    }
    if (!jobOffer.title.toLowerCase().includes(this.filter.searchPhrase.toLowerCase())) {
      return false;
    }
    if (this.filter.workModes.length) {
      if (!this.filter.workModes.includes(jobOffer.workMode)) {
        return false;
      }
    }
    if (this.filter.legalForms.length) {
      if (!this.filter.legalForms.includes(jobOffer.legalForm)) {
        return false;
      }
    }
    if (this.filter.workExperiences.length) {
      if (!this.filter.workExperiences.includes(jobOffer.experience)) {
        return false;
      }
    }
    if (this.filter.tags.length) {
      if (!this.haveCommonElement(this.filter.tags, jobOffer.tagNames)) {
        return false;
      }
    }
    if (this.filter.locations.length) {
      if (!this.haveCommonElement(this.filter.locations, jobOffer.locations)) {
        return false;
      }
    }
    return true;
  }

  private haveCommonElement(array1: string[], array2: string[]): boolean {
    return array1.some(item => array2.includes(item));
  }

  jobOfferCreatedFree(jobOfferId: number): void {
    this.ui.setToast('created');
    this.ui.setScreen('home');
  }

  jobOfferCreatedRequirePayment(jobOfferId: number): void {
    this.ui.setToast('created');
    this.ui.setCurrentJobOfferId(jobOfferId);
    this.ui.setScreen('payment');
  }

  jobOfferEdited(jobOfferId: number): void {
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

  setJobOfferApplicationEmail(applicationEmail: string): void {
    this.ui.setJobOfferApplicationEmail(applicationEmail);
  }

  setPaymentSummary(summary: PaymentSummary): void {
    this.ui.setPaymentSummary(summary);
  }

  setPaymentInvoiceCountries(countries: Country[]): void {
    this.ui.setPaymentInvoiceCountries(countries);
  }

  setVatIncluded(vatIncluded: boolean): void {
    this.ui.setVatIncluded(vatIncluded);
  }

  setPaymentInvoiceVatIdState(state: VatIdState): void {
    this.ui.setVatIdState(state);
  }
}
