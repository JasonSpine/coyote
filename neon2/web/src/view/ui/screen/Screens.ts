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
import {Policy} from "./Policy";

import {Router} from "./Router";

export class Screens {
  private router: Router;

  constructor(listener: ScreenListener, policy: Policy) {
    this.router = new Router(listener);
    this.addScreens();
    this.router.addDefaultScreen('home');
    this.router.before((screen: Screen, jobOfferId: number|null): Screen|null => {
      if (screen === 'form' && !policy.createCreateJobOffer()) {
        return 'pricing';
      }
      if (screen === 'edit' && !policy.canEditJobOffer(jobOfferId!)) {
        return 'home';
      }
      if (screen === 'payment' && !policy.canPayForJobOffer()) {
        return 'home';
      }
      return null;
    });
  }

  private addScreens(): void {
    this.router.addScreen(JobOfferHome, 'home', '/Job/');
    this.router.addScreen(JobOfferShowScreen, 'show', '/Job/:slug--:id');
    this.router.addScreen(JobOfferPricing, 'pricing', '/Job/pricing');
    this.router.addScreen(JobOfferCreate, 'form', '/Job/new');
    this.router.addScreen(JobOfferEdit, 'edit', '/Job/:id/edit');
    this.router.addScreen(JobOfferPaymentScreen, 'payment', '/Job/:id/payment');
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
