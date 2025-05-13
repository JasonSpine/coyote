import {App} from "vue";
import {JobOffer} from "../../../jobBoard";
import {Country, JobOfferFilters, PaymentSummary, PricingPlan, UploadAssets, VatIdState} from "../../../main";
import JobOfferCreate from "../JobOffer/JobOfferCreate.vue";
import JobOfferEdit from "../JobOffer/JobOfferEdit.vue";
import JobOfferHome from "../JobOffer/JobOfferHome.vue";
import JobOfferPaymentScreen from "../JobOffer/JobOfferPaymentScreen.vue";
import JobOfferPricing from "../JobOffer/JobOfferPricing.vue";
import JobOfferShowScreen from "../JobOffer/JobOfferShowScreen.vue";
import {PlanBundle, Screen, UiController, ViewListener} from "../ui";

import {Router} from "./Router";

export class Screens {
  private router: Router;
  private paymentAllowed: boolean = false;

  constructor(listener: ScreenListener) {
    this.router = new Router(listener);
    this.addScreens();
    this.router.addDefaultScreen('home');
    this.router.before((screen: Screen): Screen|null => {
      if (screen === 'payment' && !this.paymentAllowed) {
        return 'home';
      }
      return null;
    });
  }

  private addScreens(): void {
    this.router.addScreen(JobOfferHome, 'home', '/');
    this.router.addScreen(JobOfferShowScreen, 'show', '/offer/:slug--:id');
    this.router.addScreen(JobOfferPricing, 'pricing', '/pricing');
    this.router.addScreen(JobOfferCreate, 'form', '/offer/new');
    this.router.addScreen(JobOfferEdit, 'edit', '/offer/:id/edit');
    this.router.addScreen(JobOfferPaymentScreen, 'payment', '/offer/:id/payment');
  }

  allowPayment(): void {
    this.paymentAllowed = true;
  }

  navigate(screen: Screen, jobOfferId: number|null): void {
    this.router.navigate(screen, {id: jobOfferId});
  }

  showJobOffer(jobOffer: JobOffer): void {
    this.router.navigate('show', {
      id: jobOffer.id,
      slug: jobOffer.slug,
    });
  }

  useIn(app: App): void {
    this.router.useIn(app);
  }
}

export type ScreenListener = (jobOfferId: number|null) => ScreenProperties;

export interface ScreenProperties {
  uiController: UiController;
  viewListener: ViewListener;
  upload: UploadAssets;
  pricingPlan: PricingPlan;
  applicationEmail: string;
  planBundle: PlanBundle;
  invoiceCountries: Country[];
  paymentSummary: PaymentSummary;
  paymentVatIdState: VatIdState;
  paymentJobOfferId: number|null;
  jobOffer: JobOffer|null;
  jobOffers: JobOffer[];
  filters: JobOfferFilters;
}
